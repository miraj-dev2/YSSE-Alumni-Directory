import { prisma } from '../../lib/prisma.js';

export const getAdminStats = async () => {
  const [
    totalAlumni,
    pendingAlumni,
    openToSessionsCount,
    totalRequests,
    batchGroups,
    wingRecords,
    approvedProfiles
  ] = await Promise.all([
    prisma.alumniProfile.count({ where: { status: 'APPROVED' } }),
    prisma.alumniProfile.count({ where: { status: 'PENDING' } }),
    prisma.alumniProfile.count({
      where: {
        status: 'APPROVED',
        sessionOffers: { some: { isActive: true } }
      }
    }),
    prisma.sessionRequest.count(),
    prisma.alumniProfile.groupBy({
      by: ['batch'],
      where: { status: 'APPROVED' },
      _count: { id: true },
      orderBy: { batch: 'asc' }
    }),
    prisma.wing.findMany({
      select: {
        name: true,
        _count: {
          select: {
            profiles: { where: { status: 'APPROVED' } }
          }
        }
      },
      orderBy: { name: 'asc' }
    }),
    prisma.alumniProfile.findMany({
      where: { status: 'APPROVED' },
      select: { reviewedAt: true, createdAt: true }
    })
  ]);

  const byBatch = batchGroups.map((g) => ({
    batch: g.batch,
    count: g._count.id
  }));

  const byWing = wingRecords.map((w) => ({
    wing: w.name,
    count: w._count.profiles
  }));

  // Real growth grouped by month (YYYY-MM) using approved date (reviewedAt or createdAt)
  const growthMap = new Map<string, number>();
  for (const p of approvedProfiles) {
    const d = p.reviewedAt || p.createdAt;
    const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    growthMap.set(yearMonth, (growthMap.get(yearMonth) || 0) + 1);
  }

  const sortedMonths = Array.from(growthMap.keys()).sort();
  let cumulativeCount = 0;
  const growth = sortedMonths.map((month) => {
    cumulativeCount += growthMap.get(month)!;
    return { month, count: cumulativeCount };
  });

  return {
    totals: {
      alumni: totalAlumni,
      pending: pendingAlumni,
      openToSessions: openToSessionsCount,
      sessionRequests: totalRequests
    },
    byBatch,
    byWing,
    growth
  };
};
