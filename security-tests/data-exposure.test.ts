import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prismaTest, request, createTestUser, getAuthCookie } from './test-client.js';

describe('B. Data Exposure & Privacy Security Suite', () => {
  let itWing: any;
  let approvedPublicAlumni: any;
  let approvedPrivateAlumni: any;
  let pendingAlumni: any;
  let rejectedAlumni: any;
  let normalMember: any;

  beforeAll(async () => {
    itWing = await prismaTest.wing.findFirst({ where: { name: 'IT' } });
    if (!itWing) {
      itWing = await prismaTest.wing.create({ data: { name: 'IT' } });
    }

    normalMember = await createTestUser({ email: 'normal_viewer@example.com', role: 'MEMBER' });

    // 1. Approved Alumni with isContactPublic = true
    approvedPublicAlumni = await prismaTest.alumniProfile.upsert({
      where: { email: 'public_alumni@example.com' },
      update: { status: 'APPROVED', isContactPublic: true },
      create: {
        name: 'Public Alumni',
        email: 'public_alumni@example.com',
        batch: 5,
        wingId: itWing.id,
        status: 'APPROVED',
        isContactPublic: true,
        source: 'SELF',
        linkedinUrl: 'https://linkedin.com/in/public-alumni',
        story: 'Inspiring public journey story.'
      }
    });

    // 2. Approved Alumni with isContactPublic = false
    approvedPrivateAlumni = await prismaTest.alumniProfile.upsert({
      where: { email: 'private_alumni@example.com' },
      update: { status: 'APPROVED', isContactPublic: false },
      create: {
        name: 'Private Alumni',
        email: 'private_alumni@example.com',
        batch: 6,
        wingId: itWing.id,
        status: 'APPROVED',
        isContactPublic: false,
        source: 'SELF',
        linkedinUrl: 'https://linkedin.com/in/private-alumni',
        story: 'Inspiring private journey story.'
      }
    });

    // 3. Pending Alumni
    pendingAlumni = await prismaTest.alumniProfile.upsert({
      where: { email: 'pending_alumni@example.com' },
      update: { status: 'PENDING' },
      create: {
        name: 'Pending Alumni',
        email: 'pending_alumni@example.com',
        batch: 7,
        wingId: itWing.id,
        status: 'PENDING',
        source: 'SELF',
        isContactPublic: true
      }
    });

    // 4. Rejected Alumni
    rejectedAlumni = await prismaTest.alumniProfile.upsert({
      where: { email: 'rejected_alumni@example.com' },
      update: { status: 'REJECTED' },
      create: {
        name: 'Rejected Alumni',
        email: 'rejected_alumni@example.com',
        batch: 8,
        wingId: itWing.id,
        status: 'REJECTED',
        source: 'SELF',
        rejectionReason: 'Invalid credentials provided',
        isContactPublic: true
      }
    });
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  describe('1. Anonymous Visitor Data Sanitization', () => {
    it('never exposes email or linkedinUrl to anonymous visitors on /api/alumni', async () => {
      const res = await request.get('/api/alumni');
      expect(res.status).toBe(200);

      const rawJson = JSON.stringify(res.body);
      expect(rawJson).not.toContain('public_alumni@example.com');
      expect(rawJson).not.toContain('private_alumni@example.com');
      expect(rawJson).not.toContain('https://linkedin.com/in/public-alumni');
      expect(rawJson).not.toContain('passwordHash');
    });

    it('never exposes email or linkedinUrl on /api/alumni/:id to anonymous visitors', async () => {
      const res = await request.get(`/api/alumni/${approvedPublicAlumni.id}`);
      expect(res.status).toBe(200);

      const rawJson = JSON.stringify(res.body);
      expect(rawJson).not.toContain('public_alumni@example.com');
      expect(rawJson).not.toContain('https://linkedin.com/in/public-alumni');
      expect(res.body.data.email).toBeUndefined();
      expect(res.body.data.linkedinUrl).toBeUndefined();
    });

    it('never exposes contact info on /api/alumni/stories to anonymous visitors', async () => {
      const res = await request.get('/api/alumni/stories');
      expect(res.status).toBe(200);

      const rawJson = JSON.stringify(res.body);
      expect(rawJson).not.toContain('public_alumni@example.com');
      expect(rawJson).not.toContain('https://linkedin.com/in/public-alumni');
    });
  });

  describe('2. Exclusion of PENDING & REJECTED Profiles from Public Access', () => {
    it('never returns PENDING or REJECTED profiles in /api/alumni listing', async () => {
      const res = await request.get('/api/alumni');
      expect(res.status).toBe(200);

      const ids = res.body.data.map((p: any) => p.id);
      expect(ids).not.toContain(pendingAlumni.id);
      expect(ids).not.toContain(rejectedAlumni.id);
    });

    it('returns 404 when querying a PENDING profile directly by ID anonymously', async () => {
      const res = await request.get(`/api/alumni/${pendingAlumni.id}`);
      expect(res.status).toBe(404);
    });

    it('returns 404 when querying a REJECTED profile directly by ID anonymously', async () => {
      const res = await request.get(`/api/alumni/${rejectedAlumni.id}`);
      expect(res.status).toBe(404);
    });
  });

  describe('3. Contact Privacy (isContactPublic flag)', () => {
    it('hides contact info from normal MEMBER when isContactPublic is false', async () => {
      const res = await request
        .get(`/api/alumni/${approvedPrivateAlumni.id}`)
        .set('Cookie', getAuthCookie(normalMember.id));

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBeUndefined();
      expect(res.body.data.linkedinUrl).toBeUndefined();
    });

    it('reveals contact info to normal MEMBER when isContactPublic is true', async () => {
      const res = await request
        .get(`/api/alumni/${approvedPublicAlumni.id}`)
        .set('Cookie', getAuthCookie(normalMember.id));

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe('public_alumni@example.com');
      expect(res.body.data.linkedinUrl).toBe('https://linkedin.com/in/public-alumni');
    });
  });

  describe('4. Error Information Disclosure', () => {
    it('masks stack traces and internals on invalid input / 400 errors', async () => {
      const res = await request.get('/api/alumni?page=-1');
      expect(res.status).toBe(400);

      const rawJson = JSON.stringify(res.body);
      expect(rawJson).not.toContain('node_modules');
      expect(rawJson).not.toContain('Error:');
      expect(rawJson).not.toContain('at ');
    });
  });
});
