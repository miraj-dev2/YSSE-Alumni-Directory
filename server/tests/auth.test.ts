import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import { googleOAuthClient } from '../src/lib/googleClient.js';
import { makeUser, loginAs } from './helpers/index.js';

vi.mock('../src/lib/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      upsert: vi.fn()
    },
    alumniProfile: {
      findFirst: vi.fn(),
      update: vi.fn()
    }
  }
}));

describe('Authentication Module', () => {
  it('rejects Google auth when token verification fails or audience mismatch', async () => {
    vi.spyOn(googleOAuthClient, 'verifyIdToken').mockRejectedValueOnce(
      new Error('Wrong recipient, audience mismatch')
    );

    const res = await request(app)
      .post('/auth/google')
      .send({ idToken: 'invalid_or_bad_audience_token' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects Google auth when email is not verified', async () => {
    vi.spyOn(googleOAuthClient, 'verifyIdToken').mockResolvedValueOnce({
      getPayload: () => ({
        sub: 'google_123',
        email: 'unverified@example.com',
        email_verified: false,
        name: 'Unverified User'
      })
    } as any);

    const res = await request(app)
      .post('/auth/google')
      .send({ idToken: 'unverified_email_token' });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('AUTH_EMAIL_NOT_VERIFIED');
  });

  it('loads role strictly from the DB, not from the token', async () => {
    const user = makeUser({ id: 'usr_admin', role: 'ADMIN' });
    const token = loginAs('usr_admin');

    (prisma.user.findUnique as any).mockResolvedValue(user);

    const res = await request(app)
      .get('/auth/me')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe('ADMIN');
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'usr_admin' },
      select: { id: true, email: true, name: true, role: true, googleId: true }
    });
  });

  it('rejects registration when client attempts to specify role (ADMIN or ALUMNI)', async () => {
    const resAdmin = await request(app)
      .post('/auth/register')
      .send({
        name: 'Attacker User',
        email: 'attacker@example.com',
        password: 'Password123!',
        role: 'ADMIN'
      });

    expect(resAdmin.status).toBe(400);

    const resAlumni = await request(app)
      .post('/auth/register')
      .send({
        name: 'Attacker User 2',
        email: 'attacker2@example.com',
        password: 'Password123!',
        role: 'ALUMNI'
      });

    expect(resAlumni.status).toBe(400);
  });
});
