import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import { makeUser, loginAs } from './helpers/index.js';

vi.mock('../src/lib/prisma.js', () => ({
  prisma: {
    user: { findUnique: vi.fn() }
  }
}));

describe('Admin Route Guards', () => {
  it('returns 403 Forbidden when a MEMBER tries to access admin routes', async () => {
    const member = makeUser({ id: 'usr_member', role: 'MEMBER' });
    const memberToken = loginAs('usr_member');

    (prisma.user.findUnique as any).mockResolvedValueOnce(member);

    const res = await request(app)
      .get('/admin/stats')
      .set('Cookie', [`token=${memberToken}`]);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('ADMIN_ONLY');
  });

  it('returns 401 Unauthorized when an unauthenticated request hits admin routes', async () => {
    const res = await request(app).get('/admin/stats');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('AUTH_REQUIRED');
  });
});
