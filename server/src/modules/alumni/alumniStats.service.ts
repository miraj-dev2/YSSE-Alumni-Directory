import { prisma } from '../../lib/prisma.js';

export interface PublicStats {
  total: number;
  batchesCount: number;
  companiesCount: number;
  countriesCount: number;
}

let cachedStats: { data: PublicStats; expiresAt: number } | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60-second in-memory cache

/**
 * Computes public aggregate statistics from approved alumni profiles only.
 * Returns zero PII.
 * 
 * In-Memory Cache Limits:
 * - Cache is process-local and will not synchronize across multiple server instances without Redis.
 * - Updates to alumni profiles may take up to 60 seconds to reflect on the public landing page.
 */
export const getPublicAlumniStats = async (): Promise<PublicStats> => {
  const now = Date.now();
  if (cachedStats && cachedStats.expiresAt > now) {
    return cachedStats.data;
  }

  const [total, batchGroups, orgProfiles, locationProfiles] = await Promise.all([
    // Total approved alumni
    prisma.alumniProfile.count({
      where: { status: 'APPROVED' }
    }),
    // Distinct cohorts
    prisma.alumniProfile.groupBy({
      by: ['batch'],
      where: { status: 'APPROVED' }
    }),
    // Distinct organizations
    prisma.alumniProfile.findMany({
      where: { status: 'APPROVED', organization: { not: null } },
      select: { organization: true },
      distinct: ['organization']
    }),
    // Distinct locations to derive countries
    prisma.alumniProfile.findMany({
      where: { status: 'APPROVED', location: { not: null } },
      select: { location: true },
      distinct: ['location']
    })
  ]);

  const batchesCount = batchGroups.length;
  const companiesCount = orgProfiles.filter(
    (p) => p.organization && p.organization.trim().length > 0
  ).length;

  // Derives country following existing alumni mapper rule: location.split(',')[1]?.trim() || 'Bangladesh'
  const countriesSet = new Set<string>();
  for (const item of locationProfiles) {
    if (!item.location) continue;
    const parts = item.location.split(',');
    const country = parts[1]?.trim() || 'Bangladesh';
    if (country) countriesSet.add(country);
  }
  const countriesCount = countriesSet.size || (total > 0 ? 1 : 0);

  const data: PublicStats = {
    total,
    batchesCount,
    companiesCount,
    countriesCount
  };

  cachedStats = { data, expiresAt: now + CACHE_TTL_MS };
  return data;
};

export const resetPublicStatsCache = (): void => {
  cachedStats = null;
};
