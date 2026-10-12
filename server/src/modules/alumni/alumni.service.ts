import { prisma } from '../../lib/prisma.js';
import { mapProfileToView, ViewerContext } from '../../lib/publicProfile.js';
import { buildAlumniWhere, buildAlumniOrderBy } from './alumni.queries.js';
import { AlumniQueryInput } from './alumni.schema.js';
import { parsePagination, buildPaginationMeta } from '../../lib/pagination.js';
import { AppError } from '../../lib/AppError.js';

export const getPublicAlumniList = async (
  query: AlumniQueryInput,
  viewer?: ViewerContext | null
) => {
  const { page, pageSize, skip, take } = parsePagination(query.page, query.pageSize);
  const where = buildAlumniWhere({ ...query, status: 'APPROVED' });
  const orderBy = buildAlumniOrderBy(query.sort);

  const [total, items] = await Promise.all([
    prisma.alumniProfile.count({ where }),
    prisma.alumniProfile.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        wing: true,
        sessionOffers: { where: { isActive: true }, select: { id: true, isActive: true } }
      }
    })
  ]);

  const data = items.map((profile) => mapProfileToView(profile, viewer));
  const meta = buildPaginationMeta(page, pageSize, total);

  return { data, meta };
};

export const getFeaturedAlumni = async (viewer?: ViewerContext | null) => {
  let list = await prisma.alumniProfile.findMany({
    where: { status: 'APPROVED', photoUrl: { not: null } },
    take: 24,
    include: {
      wing: true,
      sessionOffers: { where: { isActive: true }, select: { id: true, isActive: true } }
    }
  });

  if (list.length === 0) {
    list = await prisma.alumniProfile.findMany({
      where: { status: 'APPROVED' },
      take: 24,
      orderBy: { createdAt: 'desc' },
      include: {
        wing: true,
        sessionOffers: { where: { isActive: true }, select: { id: true, isActive: true } }
      }
    });
  }

  const shuffled = list
    .sort(() => 0.5 - Math.random())
    .slice(0, 12);

  return shuffled.map((p) => mapProfileToView(p, viewer));
};

export const getAlumniStories = async (viewer?: ViewerContext | null) => {
  const stories = await prisma.alumniProfile.findMany({
    where: {
      status: 'APPROVED',
      story: { not: null }
    },
    take: 12,
    orderBy: { updatedAt: 'desc' },
    include: {
      wing: true,
      sessionOffers: { where: { isActive: true }, select: { id: true, isActive: true } }
    }
  });

  return stories
    .filter((p) => p.story && p.story.trim().length > 0)
    .map((p) => mapProfileToView(p, viewer));
};

export const getAlumniById = async (id: string, viewer?: ViewerContext | null) => {
  const profile = await prisma.alumniProfile.findUnique({
    where: { id },
    include: {
      wing: true,
      sessionOffers: { where: { isActive: true } }
    }
  });

  if (!profile) {
    throw AppError.notFound('Alumni profile not found', 'PROFILE_NOT_FOUND');
  }

  const isOwner = viewer?.id && profile.userId === viewer.id;
  const isAdmin = viewer?.role === 'ADMIN';

  if (profile.status !== 'APPROVED' && !isOwner && !isAdmin) {
    throw AppError.notFound('Alumni profile not found', 'PROFILE_NOT_FOUND');
  }

  return mapProfileToView(profile, viewer);
};
