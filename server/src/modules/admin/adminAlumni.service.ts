import { prisma } from '../../lib/prisma.js';
import { mapProfileToView } from '../../lib/publicProfile.js';
import { buildAlumniWhere, buildAlumniOrderBy } from '../alumni/alumni.queries.js';
import {
  AdminAlumniQueryInput,
  AdminCreateAlumniInput,
  AdminUpdateAlumniInput
} from './admin.schema.js';
import { parsePagination, buildPaginationMeta } from '../../lib/pagination.js';
import { AppError } from '../../lib/AppError.js';

export const getAdminAlumniList = async (
  query: AdminAlumniQueryInput,
  adminId: string
) => {
  const { page, pageSize, skip, take } = parsePagination(query.page, query.pageSize);
  const where = buildAlumniWhere(query);
  const orderBy = buildAlumniOrderBy(query.sort);

  const [total, items] = await Promise.all([
    prisma.alumniProfile.count({ where }),
    prisma.alumniProfile.findMany({
      where,
      orderBy,
      skip,
      take,
      include: { wing: true, sessionOffers: true }
    })
  ]);

  const data = items.map((p) => mapProfileToView(p, { id: adminId, role: 'ADMIN' }));
  const meta = buildPaginationMeta(page, pageSize, total);
  return { data, meta };
};

export const createAdminAlumni = async (
  adminId: string,
  data: AdminCreateAlumniInput
) => {
  const wing = await prisma.wing.findUnique({ where: { id: data.wingId } });
  if (!wing) throw AppError.badRequest('Invalid wing ID');

  const existing = await prisma.alumniProfile.findUnique({
    where: { email: data.email.toLowerCase() }
  });
  if (existing) throw AppError.conflict('Profile with this email already exists');

  const [profile] = await prisma.$transaction([
    prisma.alumniProfile.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        batch: data.batch,
        wingId: data.wingId,
        currentRole: data.currentRole,
        organization: data.organization,
        location: data.location,
        linkedinUrl: data.linkedinUrl || null,
        bio: data.bio,
        isContactPublic: data.isContactPublic ?? false,
        status: data.status,
        source: 'ADMIN',
        reviewedById: adminId,
        reviewedAt: new Date()
      },
      include: { wing: true, sessionOffers: true }
    }),
    prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: 'ADMIN_CREATE_PROFILE',
        targetType: 'AlumniProfile',
        targetId: data.email.toLowerCase()
      }
    })
  ]);

  return mapProfileToView(profile, { id: adminId, role: 'ADMIN' });
};

export const updateAdminAlumni = async (
  adminId: string,
  profileId: string,
  data: AdminUpdateAlumniInput
) => {
  const profile = await prisma.alumniProfile.findUnique({ where: { id: profileId } });
  if (!profile) throw AppError.notFound('Profile not found');

  const [updated] = await prisma.$transaction([
    prisma.alumniProfile.update({
      where: { id: profileId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email.toLowerCase() }),
        ...(data.batch && { batch: data.batch }),
        ...(data.wingId && { wingId: data.wingId }),
        ...(data.currentRole !== undefined && { currentRole: data.currentRole }),
        ...(data.organization !== undefined && { organization: data.organization }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.linkedinUrl !== undefined && { linkedinUrl: data.linkedinUrl || null }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.isContactPublic !== undefined && { isContactPublic: data.isContactPublic }),
        ...(data.status && { status: data.status })
      },
      include: { wing: true, sessionOffers: true }
    }),
    prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: 'ADMIN_UPDATE_PROFILE',
        targetType: 'AlumniProfile',
        targetId: profileId,
        meta: { changes: Object.keys(data) }
      }
    })
  ]);

  return mapProfileToView(updated, { id: adminId, role: 'ADMIN' });
};

export const getAllAdminSessionRequests = async () => {
  return prisma.sessionRequest.findMany({
    include: {
      requester: { select: { id: true, name: true, email: true, avatarUrl: true } },
      offer: {
        include: {
          alumni: { select: { id: true, name: true, email: true, photoUrl: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};
