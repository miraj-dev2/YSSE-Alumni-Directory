import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '../src/lib/prisma.js';
import { getAdminStats } from '../src/modules/admin/stats.service.js';

vi.mock('../src/lib/prisma.js', () => ({
  prisma: {
    alumniProfile: {
      count: vi.fn(),
      groupBy: vi.fn()
    },
    sessionRequest: {
      count: vi.fn()
    },
    wing: {
      findMany: vi.fn()
    },
    $queryRaw: vi.fn()
  }
}));

// Reference old JS grouping implementation for equivalence testing
function oldGrowthCalculation(profiles: { reviewedAt: Date | null; createdAt: Date }[]) {
  const growthMap = new Map<string, number>();
  for (const p of profiles) {
    const d = p.reviewedAt || p.createdAt;
    const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    growthMap.set(yearMonth, (growthMap.get(yearMonth) || 0) + 1);
  }
  const sortedMonths = Array.from(growthMap.keys()).sort();
  let cumulativeCount = 0;
  return sortedMonths.map((month) => {
    cumulativeCount += growthMap.get(month)!;
    return { month, count: cumulativeCount };
  });
}

describe('Admin Stats Service (Growth Query Optimization)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('produces identical growth result to the legacy in-memory grouping on the same data', async () => {
    const dataset = [
      { reviewedAt: new Date('2024-01-15'), createdAt: new Date('2024-01-10') },
      { reviewedAt: new Date('2024-01-20'), createdAt: new Date('2024-01-12') },
      { reviewedAt: null, createdAt: new Date('2024-02-05') },
      { reviewedAt: new Date('2024-03-01'), createdAt: new Date('2024-02-28') },
      { reviewedAt: new Date('2024-03-22'), createdAt: new Date('2024-03-10') }
    ];

    const expectedOldGrowth = oldGrowthCalculation(dataset);

    // Simulate DB query raw aggregation result corresponding to the exact same dataset
    const simulatedDbAggregation = [
      { month: '2024-01', count: 2 },
      { month: '2024-02', count: 1 },
      { month: '2024-03', count: 2 }
    ];

    (prisma.alumniProfile.count as any).mockResolvedValueOnce(5).mockResolvedValueOnce(0).mockResolvedValueOnce(0);
    (prisma.sessionRequest.count as any).mockResolvedValueOnce(0);
    (prisma.alumniProfile.groupBy as any).mockResolvedValueOnce([]);
    (prisma.wing.findMany as any).mockResolvedValueOnce([]);
    (prisma.$queryRaw as any).mockResolvedValueOnce(simulatedDbAggregation);

    const stats = await getAdminStats();

    expect(stats.growth).toEqual(expectedOldGrowth);
    expect(stats.growth).toEqual([
      { month: '2024-01', count: 2 },
      { month: '2024-02', count: 3 },
      { month: '2024-03', count: 5 }
    ]);
  });

  it('handles empty data correctly', async () => {
    (prisma.alumniProfile.count as any).mockResolvedValue(0);
    (prisma.sessionRequest.count as any).mockResolvedValue(0);
    (prisma.alumniProfile.groupBy as any).mockResolvedValue([]);
    (prisma.wing.findMany as any).mockResolvedValue([]);
    (prisma.$queryRaw as any).mockResolvedValue([]);

    const stats = await getAdminStats();
    expect(stats.growth).toEqual([]);
    expect(stats.totals.alumni).toBe(0);
  });
});
