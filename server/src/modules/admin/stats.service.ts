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
    prisma.$queryRaw<{ month: string; count: number }[]>`
      SELECT
        to_char(COALESCE("reviewedAt", "createdAt"), 'YYYY-MM') AS month,
        COUNT(*)::int AS count
      FROM "AlumniProfile"
      WHERE status = 'APPROVED'
      GROUP BY to_char(COALESCE("reviewedAt", "createdAt"), 'YYYY-MM')
      ORDER BY month ASC
    `
  ]);

  const byBatch = batchGroups.map((g) => ({
    batch: g.batch,
    count: g._count.id
  }));

  const byWing = wingRecords.map((w) => ({
    wing: w.name,
    count: w._count.profiles
  }));

  let cumulativeCount = 0;
  const growth = approvedProfiles.map((row) => {
    cumulativeCount += Number(row.count);
    return { month: row.month, count: cumulativeCount };
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
