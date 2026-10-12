import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prismaTest, request, createTestUser, getAuthCookie } from './test-client.js';
import { sanitizeForCsv } from '../server/src/modules/admin/csvExport.service.js';

describe('E. File Upload & CSV Security Suite', () => {
  let adminUser: any;
  let memberUser: any;
  let itWing: any;

  beforeAll(async () => {
    itWing = await prismaTest.wing.findFirst({ where: { name: 'IT' } });
    if (!itWing) {
      itWing = await prismaTest.wing.create({ data: { name: 'IT' } });
    }
    adminUser = await createTestUser({ email: 'sec_csv_admin@example.com', role: 'ADMIN' });
    memberUser = await createTestUser({ email: 'sec_csv_member@example.com', role: 'MEMBER' });
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  describe('1. Photo Upload Security & Type Inspection', () => {
    it('rejects a fake image (text/html content renamed to avatar.png)', async () => {
      // First create profile for memberUser
      await prismaTest.alumniProfile.upsert({
        where: { userId: memberUser.id },
        update: {},
        create: {
          userId: memberUser.id,
          email: memberUser.email,
          name: 'Photo Test User',
          batch: 9,
          wingId: itWing.id,
          status: 'APPROVED',
          source: 'SELF'
        }
      });

      const fakeImageBuffer = Buffer.from('<script>alert("not a real image")</script>');

      const res = await request
        .post('/api/alumni/me/photo')
        .set('Cookie', getAuthCookie(memberUser.id))
        .attach('photo', fakeImageBuffer, { filename: 'avatar.png', contentType: 'image/png' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('INVALID_IMAGE');
    });

    it('rejects SVG files disguised as image/svg+xml', async () => {
      const svgBuffer = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');

      const res = await request
        .post('/api/alumni/me/photo')
        .set('Cookie', getAuthCookie(memberUser.id))
        .attach('photo', svgBuffer, { filename: 'test.svg', contentType: 'image/svg+xml' });

      expect(res.status).toBe(400);
    });
  });

  describe('2. CSV Import Resiliency & Per-Row Validation', () => {
    it('accurately reports bad rows while allowing valid rows in bulk import', async () => {
      await prismaTest.alumniProfile.deleteMany({
        where: { email: { in: ['valid_csv_alumni_1@example.com'] } }
      });

      const csvContent = [
        'name,email,batch,wing',
        'Valid Alumni,valid_csv_alumni_1@example.com,8,IT',
        'Bad Email Alumni,notanemail,8,IT',
        'Unknown Wing Alumni,unknown_wing_alumni@example.com,8,NonExistentWing',
        'Negative Batch Alumni,neg_batch@example.com,-5,IT',
        'Duplicate File Alumni,valid_csv_alumni_1@example.com,8,IT'
      ].join('\n');

      const res = await request
        .post('/api/admin/alumni/import')
        .set('Cookie', getAuthCookie(adminUser.id))
        .attach('file', Buffer.from(csvContent), 'test_roster.csv');

      expect(res.status).toBe(200);
      expect(res.body.data.totalRows).toBe(5);
      expect(res.body.data.createdCount).toBe(1);
      expect(res.body.data.failedCount).toBe(4);

      // Verify valid row is in database
      const imported = await prismaTest.alumniProfile.findUnique({
        where: { email: 'valid_csv_alumni_1@example.com' }
      });
      expect(imported).not.toBeNull();
      expect(imported?.name).toBe('Valid Alumni');
    });
  });

  describe('3. CSV Export Formula Injection Neutralization', () => {
    it('prepends a single quote to cells beginning with formula triggers (=, +, -, @)', () => {
      expect(sanitizeForCsv('=SUM(A1:A10)')).toBe("'=SUM(A1:A10)");
      expect(sanitizeForCsv('+cmd|/c calc')).toBe("'+cmd|/c calc");
      expect(sanitizeForCsv('-2+3*4')).toBe("'-2+3*4");
      expect(sanitizeForCsv('@external_ref')).toBe("'@external_ref");
      expect(sanitizeForCsv('Normal Text')).toBe('Normal Text');
    });
  });
});
