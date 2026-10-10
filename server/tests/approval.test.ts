import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import { makeUser, makeProfile, loginAs } from './helpers/index.js';

vi.mock('../src/lib/prisma.js', () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    alumniProfile: {
      findUnique: vi.fn(),
      update: vi.fn()
    },
    auditLog: { create: vi.fn() },
    $transaction: vi.fn((actions) => {
      if (Array.isArray(actions)) return Promise.all(actions);
      if (typeof actions === 'function') return actions(prisma);
      return Promise.resolve(actions);
    })
  }
}));

describe('Admin Approval Rules', () => {
  const admin = makeUser({ id: 'usr_admin', role: 'ADMIN' });
  const adminToken = loginAs('usr_admin');

  it('requires a non-empty reason when rejecting a profile', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(admin);

    const res = await request(app)
      .patch('/admin/alumni/prof_1/status')
      .set('Cookie', [`token=${adminToken}`])
      .send({ status: 'REJECTED', reason: '' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 409 conflict when transitioning to the current status', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(admin);
    const approvedProfile = makeProfile({ id: 'prof_1', status: 'APPROVED' });
    (prisma.alumniProfile.findUnique as any).mockResolvedValueOnce(approvedProfile);

    const res = await request(app)
      .patch('/admin/alumni/prof_1/status')
      .set('Cookie', [`token=${adminToken}`])
      .send({ status: 'APPROVED' });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });
});
