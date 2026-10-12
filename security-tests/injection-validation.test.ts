import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prismaTest, request, createTestUser, getAuthCookie } from './test-client.js';

describe('D. Injection & Parameter Validation Suite', () => {
  let adminUser: any;
  let memberUser: any;
  let itWing: any;

  beforeAll(async () => {
    itWing = await prismaTest.wing.findFirst({ where: { name: 'IT' } });
    if (!itWing) {
      itWing = await prismaTest.wing.create({ data: { name: 'IT' } });
    }
    adminUser = await createTestUser({ email: 'sec_inj_admin@example.com', role: 'ADMIN' });
    memberUser = await createTestUser({ email: 'sec_inj_member@example.com', role: 'MEMBER' });
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  describe('1. SQL Injection Resilience (Prisma Parameterization)', () => {
    it('safely handles classic SQL injection payloads in query search param', async () => {
      const sqlPayloads = [
        "' OR '1'='1",
        "'; DROP TABLE \"AlumniProfile\"; --",
        "1 UNION SELECT null, null, null--",
        "' OR 1=1 --"
      ];

      for (const payload of sqlPayloads) {
        const res = await request.get('/api/alumni').query({ q: payload });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
      }
    });

    it('safely handles SQL injection attempts in wing filter', async () => {
      const res = await request.get('/api/alumni').query({ wing: "' OR '1'='1" });
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });

  describe('2. Parameter Allowlisting and Bounds Validation', () => {
    it('rejects pageSize exceeding maximum (pageSize=100000) with 400', async () => {
      const res = await request.get('/api/alumni?pageSize=100000');
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('rejects negative page (page=-1) with 400', async () => {
      const res = await request.get('/api/alumni?page=-1');
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('rejects non-numeric page (page=abc) with 400', async () => {
      const res = await request.get('/api/alumni?page=abc');
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('rejects unallowlisted sort value (sort=injected_column) with 400', async () => {
      const res = await request.get('/api/alumni?sort=injected_column');
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('3. URI Scheme Validation Behavior Analysis', () => {
    it('checks whether javascript: pseudo-protocol is accepted by current URL validator', async () => {
      const res = await request
        .post('/api/talks')
        .set('Cookie', getAuthCookie(adminUser.id))
        .send({
          title: 'URI Scheme Test Session',
          topic: 'Security Auditing',
          speakerName: 'Security Auditor',
          talkDate: new Date().toISOString(),
          recordingUrl: 'javascript:alert(document.cookie)'
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
