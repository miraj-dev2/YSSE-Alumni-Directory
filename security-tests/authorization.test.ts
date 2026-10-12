import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import jwt from '../server/node_modules/jsonwebtoken/index.js';
import { prismaTest, request, createTestUser, getAuthCookie } from './test-client.js';

describe('A. Authorization & RBAC Security Suite', () => {
  let memberUser: any;
  let adminUser: any;
  let otherMember: any;
  let itWing: any;

  beforeAll(async () => {
    itWing = await prismaTest.wing.findFirst({ where: { name: 'IT' } });
    if (!itWing) {
      itWing = await prismaTest.wing.create({ data: { name: 'IT' } });
    }

    memberUser = await createTestUser({ email: 'sec_member1@example.com', role: 'MEMBER' });
    adminUser = await createTestUser({ email: 'sec_admin@example.com', role: 'ADMIN' });
    otherMember = await createTestUser({ email: 'sec_member2@example.com', role: 'MEMBER' });
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  describe('1. Access Matrix Enforcement', () => {
    it('rejects unauthenticated requests to /api/auth/me with 401', async () => {
      const res = await request.get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('AUTH_REQUIRED');
    });

    it('rejects unauthenticated requests to /api/admin/stats with 401', async () => {
      const res = await request.get('/api/admin/stats');
      expect(res.status).toBe(401);
    });

    it('blocks regular MEMBER from /api/admin/stats with 403 Forbidden', async () => {
      const res = await request
        .get('/api/admin/stats')
        .set('Cookie', getAuthCookie(memberUser.id));
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('ADMIN_ONLY');
    });

    it('blocks regular MEMBER from /api/admin/alumni with 403 Forbidden', async () => {
      const res = await request
        .get('/api/admin/alumni')
        .set('Cookie', getAuthCookie(memberUser.id));
      expect(res.status).toBe(403);
    });

    it('allows verified ADMIN to access /api/admin/stats with 200', async () => {
      const res = await request
        .get('/api/admin/stats')
        .set('Cookie', getAuthCookie(adminUser.id));
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('blocks regular MEMBER from creating an Alumni Talk (POST /api/talks) with 403', async () => {
      const res = await request
        .post('/api/talks')
        .set('Cookie', getAuthCookie(memberUser.id))
        .send({
          title: 'Unauthorized Talk',
          topic: 'Security',
          speakerName: 'Member',
          talkDate: new Date().toISOString()
        });
      expect(res.status).toBe(403);
    });
  });

  describe('2. IDOR Protections', () => {
    it('prevents user A from updating user B session offer', async () => {
      // Create alumni profile for memberUser
      let profileA = await prismaTest.alumniProfile.findUnique({ where: { userId: memberUser.id } });
      if (!profileA) {
        profileA = await prismaTest.alumniProfile.create({
          data: {
            userId: memberUser.id,
            email: memberUser.email,
            name: 'Alumni A',
            batch: 8,
            wingId: itWing.id,
            status: 'APPROVED',
            source: 'SELF'
          }
        });
      }

      // Create session offer owned by profileA
      const offerA = await prismaTest.sessionOffer.create({
        data: {
          alumniId: profileA.id,
          topic: 'Initial Topic',
          mode: 'ONLINE'
        }
      });

      // otherMember attempts to PATCH offerA
      const res = await request
        .patch(`/api/sessions/offers/${offerA.id}`)
        .set('Cookie', getAuthCookie(otherMember.id))
        .send({ topic: 'Tampered Topic' });

      expect(res.status).toBe(403);
      expect(res.body.error.message).toMatch(/only edit your own/i);
    });
  });

  describe('3. Session Request Status Transitions', () => {
    it('rejects illegal status transition from DONE to ACCEPTED with 409 Conflict', async () => {
      const profile = await prismaTest.alumniProfile.findFirst({ where: { userId: memberUser.id } });
      const offer = await prismaTest.sessionOffer.findFirst({ where: { alumniId: profile!.id } });

      // Clear any previous requests for this offer
      await prismaTest.sessionRequest.deleteMany({ where: { offerId: offer!.id } });

      // Create a request marked DONE
      const req = await prismaTest.sessionRequest.create({
        data: {
          offerId: offer!.id,
          requesterId: otherMember.id,
          status: 'DONE'
        }
      });

      // Mentor tries to transition from terminal DONE to ACCEPTED
      const res = await request
        .patch(`/api/sessions/requests/${req.id}/status`)
        .set('Cookie', getAuthCookie(memberUser.id))
        .send({ status: 'ACCEPTED' });

      expect(res.status).toBe(409);
      expect(res.body.error.message).toMatch(/cannot transition/i);
    });
  });

  describe('4. Mass Assignment Protections', () => {
    it('strictly blocks privilege escalation (role: ADMIN) in registration schema with 400', async () => {
      const res = await request.post('/api/auth/register').send({
        name: 'Attacker User',
        email: 'attacker_test_sec_400@example.com',
        password: 'Password123!',
        role: 'ADMIN'
      });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('ignores extra fields (isAdmin: true) when role is valid MEMBER', async () => {
      const email = `attacker_test_sec_${Date.now()}@example.com`;
      const res = await request.post('/api/auth/register').send({
        name: 'Attacker User',
        email,
        password: 'Password123!',
        role: 'MEMBER',
        isAdmin: true
      });

      expect(res.status).toBe(201);
      expect(res.body.data.user.role).toBe('MEMBER');

      const dbUser = await prismaTest.user.findUnique({ where: { email } });
      expect(dbUser?.role).toBe('MEMBER');
    });
  });

  describe('5. Role Derived from Database (Dynamic Privilege)', () => {
    it('revokes admin privileges if role is downgraded in DB despite valid token', async () => {
      const tempAdmin = await createTestUser({ email: 'temp_admin@example.com', role: 'ADMIN' });
      const tokenCookie = getAuthCookie(tempAdmin.id);

      // Verify initial admin access
      const res1 = await request.get('/api/admin/stats').set('Cookie', tokenCookie);
      expect(res1.status).toBe(200);

      // Downgrade user in DB
      await prismaTest.user.update({
        where: { id: tempAdmin.id },
        data: { role: 'MEMBER' }
      });

      // Subsequent call with SAME token must now receive 403 Forbidden
      const res2 = await request.get('/api/admin/stats').set('Cookie', tokenCookie);
      expect(res2.status).toBe(403);
    });
  });

  describe('6. JWT Tampering & Integrity', () => {
    it('rejects token with alg: none with 401', async () => {
      const noneToken = jwt.sign({ sub: memberUser.id }, '', { algorithm: 'none' });
      const res = await request.get('/api/auth/me').set('Cookie', `token=${noneToken}`);
      expect(res.status).toBe(401);
    });

    it('rejects token with wrong signature with 401', async () => {
      const forgedToken = jwt.sign({ sub: memberUser.id }, 'wrong_secret_12345678901234567890!');
      const res = await request.get('/api/auth/me').set('Cookie', `token=${forgedToken}`);
      expect(res.status).toBe(401);
    });
  });
});
