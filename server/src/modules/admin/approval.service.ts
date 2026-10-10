import { AlumniStatus } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../lib/AppError.js';
import { mapProfileToView } from '../../lib/publicProfile.js';

export const updateAlumniStatus = async (
  adminId: string,
  profileId: string,
  newStatus: AlumniStatus,
  reason?: string
) => {
  const profile = await prisma.alumniProfile.findUnique({
    where: { id: profileId },
    include: { wing: true, sessionOffers: true }
  });

  if (!profile) {
    throw AppError.notFound('Alumni profile not found');
  }

  if (profile.status === newStatus) {
    throw AppError.conflict(
      `Profile is already in '${newStatus}' status`
    );
  }

  if (newStatus === 'REJECTED' && (!reason || reason.trim().length === 0)) {
    throw AppError.badRequest('Rejection requires a non-empty reason');
  }

  const now = new Date();
  const [updated] = await prisma.$transaction([
    prisma.alumniProfile.update({
      where: { id: profileId },
      data: {
        status: newStatus,
        rejectionReason: newStatus === 'REJECTED' ? reason?.trim() : null,
        reviewedById: adminId,
        reviewedAt: now
      },
      include: { wing: true, sessionOffers: true }
    }),
    prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: `PROFILE_STATUS_${newStatus}`,
        targetType: 'AlumniProfile',
        targetId: profileId,
        meta: {
          previousStatus: profile.status,
          newStatus,
          reason: reason?.trim() || null
        }
      }
    })
  ]);

  return mapProfileToView(updated, { id: adminId, role: 'ADMIN' });
};

export const bulkUpdateAlumniStatus = async (
  adminId: string,
  ids: string[],
  newStatus: AlumniStatus,
  reason?: string
) => {
  if (newStatus === 'REJECTED' && (!reason || reason.trim().length === 0)) {
    throw AppError.badRequest('Bulk rejection requires a non-empty reason');
  }

  const now = new Date();
  const result = await prisma.$transaction(async (tx) => {
    const updateResult = await tx.alumniProfile.updateMany({
      where: {
        id: { in: ids },
        status: { not: newStatus }
      },
      data: {
        status: newStatus,
        rejectionReason: newStatus === 'REJECTED' ? reason?.trim() : null,
        reviewedById: adminId,
        reviewedAt: now
      }
    });

    await tx.auditLog.create({
      data: {
        actorId: adminId,
        action: `BULK_PROFILE_STATUS_${newStatus}`,
        targetType: 'AlumniProfile',
        targetId: ids.join(','),
        meta: { count: updateResult.count, newStatus, reason: reason?.trim() || null }
      }
    });

    return updateResult;
  });

  return { affected: result.count };
};
