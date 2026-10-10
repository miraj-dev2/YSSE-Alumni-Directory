import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import { makeUser, loginAs } from './helpers/index.js';

vi.mock('../src/lib/prisma.js', () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    sessionOffer: { findUnique: vi.fn() },
    sessionRequest: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn()
    },
    auditLog: { create: vi.fn() },
    $transaction: vi.fn((actions) => Promise.all(actions))
  }
}));

describe('Session Request Rules & Transitions', () => {
  const user = makeUser({ id: 'usr_member', role: 'MEMBER' });
  const token = loginAs('usr_member');

  it('prevents requesting own session offer', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(user);
    (prisma.sessionOffer.findUnique as any).mockResolvedValueOnce({
      id: 'off_1',
      isActive: true,
      alumni: { userId: 'usr_member' } // same user
    });

    const res = await request(app)
      .post('/sessions/requests')
      .set('Cookie', [`token=${token}`])
      .send({ offerId: 'off_1', message: 'Hello' });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toContain('own session offer');
  });

  it('rejects invalid state transitions with 409 conflict', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(user);
    (prisma.sessionRequest.findUnique as any).mockResolvedValueOnce({
      id: 'req_1',
      status: 'DONE', // already DONE, no transition allowed
      offer: { alumni: { userId: 'usr_member' } }
    });

    const res = await request(app)
      .patch('/sessions/requests/req_1/status')
      .set('Cookie', [`token=${token}`])
      .send({ status: 'ACCEPTED' });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });
});
