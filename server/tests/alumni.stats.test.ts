import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import { resetPublicStatsCache } from '../src/modules/alumni/alumniStats.service.js';

vi.mock('../src/lib/prisma.js', () => ({
  prisma: {
    alumniProfile: {
      count: vi.fn(),
      groupBy: vi.fn(),
      findMany: vi.fn()
    }
  }
}));

describe('Public Alumni Stats API (GET /api/alumni/stats)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetPublicStatsCache();
  });

  it('computes stats exclusively for APPROVED profiles and matches DB counts', async () => {
    (prisma.alumniProfile.count as any).mockResolvedValueOnce(42);
    (prisma.alumniProfile.groupBy as any).mockResolvedValueOnce([
      { batch: 15 }, { batch: 16 }, { batch: 17 }
    ]);
    (prisma.alumniProfile.findMany as any).mockResolvedValueOnce([
      { organization: 'Google' },
      { organization: 'Microsoft' },
      { organization: 'Brain Station 23' }
    ]);
    (prisma.alumniProfile.findMany as any).mockResolvedValueOnce([
      { location: 'Dhaka, Bangladesh' },
      { location: 'London, UK' },
      { location: 'New York, USA' }
    ]);

    const res = await request(app).get('/api/alumni/stats');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual({
      total: 42,
      batchesCount: 3,
      companiesCount: 3,
      countriesCount: 3
    });

    // Verify status: 'APPROVED' constraint is strictly enforced on all queries
    expect(prisma.alumniProfile.count).toHaveBeenCalledWith({
      where: { status: 'APPROVED' }
    });
    expect(prisma.alumniProfile.groupBy).toHaveBeenCalledWith({
      by: ['batch'],
      where: { status: 'APPROVED' }
    });
    expect(prisma.alumniProfile.findMany).toHaveBeenNthCalledWith(1, {
      where: { status: 'APPROVED', organization: { not: null } },
      select: { organization: true },
      distinct: ['organization']
    });
  });

  it('never returns any Personally Identifiable Information (PII)', async () => {
    (prisma.alumniProfile.count as any).mockResolvedValueOnce(5);
    (prisma.alumniProfile.groupBy as any).mockResolvedValueOnce([{ batch: 17 }]);
    (prisma.alumniProfile.findMany as any).mockResolvedValueOnce([{ organization: 'Test Org' }]);
    (prisma.alumniProfile.findMany as any).mockResolvedValueOnce([{ location: 'Dhaka, Bangladesh' }]);

    const res = await request(app).get('/api/alumni/stats');

    expect(res.status).toBe(200);
    const data = res.body.data;
    expect(Object.keys(data).sort()).toEqual([
      'batchesCount',
      'companiesCount',
      'countriesCount',
      'total'
    ]);
    // Ensure no names, emails, ids, or phones
    const bodyStr = JSON.stringify(res.body);
    expect(bodyStr).not.toContain('email');
    expect(bodyStr).not.toContain('name');
    expect(bodyStr).not.toContain('phone');
    expect(bodyStr).not.toContain('linkedin');
  });
});
