import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import { makeProfile } from './helpers/index.js';

vi.mock('../src/lib/prisma.js', () => ({
  prisma: {
    alumniProfile: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn()
    }
  }
}));

describe('Alumni Public Field Sanitization', () => {
  it('hides email and linkedin from anonymous viewers on public list', async () => {
    const profile = makeProfile({
      isContactPublic: false,
      email: 'private@alumni.com',
      openToSessions: true
    });

    (prisma.alumniProfile.count as any).mockResolvedValueOnce(1);
    (prisma.alumniProfile.findMany as any).mockResolvedValueOnce([profile]);

    const res = await request(app).get('/alumni');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].email).toBeUndefined();
    expect(res.body.data[0].linkedinUrl).toBeUndefined();
    expect(res.body.data[0].name).toBe('Test Alumni');
    expect(res.body.data[0].openToSessions).toBe(true);
  });

  it('hides email and linkedin from anonymous viewers even if isContactPublic is true', async () => {
    // Rule: "email and linkedinUrl are included ONLY when the viewer is authenticated AND (profile.isContactPublic OR viewer is ADMIN OR viewer owns the profile)"
    const profile = makeProfile({
      isContactPublic: true,
      email: 'public_contact@alumni.com'
    });

    (prisma.alumniProfile.findUnique as any).mockResolvedValueOnce(profile);

    const res = await request(app).get(`/alumni/${profile.id}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBeUndefined();
    expect(res.body.data.linkedinUrl).toBeUndefined();
  });
});
