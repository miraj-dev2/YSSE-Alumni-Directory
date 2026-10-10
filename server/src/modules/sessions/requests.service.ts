import { RequestStatus, Role } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { isValidSessionTransition } from './requestTransitions.js';
import { AppError } from '../../lib/AppError.js';

export const createSessionRequest = async (
  requesterId: string,
  offerId: string,
  message?: string
) => {
  const offer = await prisma.sessionOffer.findUnique({
    where: { id: offerId },
    include: { alumni: true }
  });

  if (!offer || !offer.isActive) {
    throw AppError.badRequest('Session offer is no longer active or does not exist');
  }

  if (offer.alumni.userId === requesterId) {
    throw AppError.badRequest('You cannot request mentorship from your own session offer');
  }

  const existing = await prisma.sessionRequest.findUnique({
    where: { offerId_requesterId: { offerId, requesterId } }
  });

  if (existing) {
    throw AppError.conflict('You have already submitted a request for this offer');
  }

  return prisma.sessionRequest.create({
    data: { offerId, requesterId, message },
    include: {
      offer: { include: { alumni: { select: { id: true, name: true, photoUrl: true } } } }
    }
  });
};

export const getMyRequests = async (requesterId: string) => {
  return prisma.sessionRequest.findMany({
    where: { requesterId },
    include: {
      offer: {
        include: {
          alumni: { select: { id: true, name: true, photoUrl: true, wing: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getIncomingRequests = async (userId: string) => {
  const profile = await prisma.alumniProfile.findUnique({ where: { userId } });
  if (!profile) return [];

  return prisma.sessionRequest.findMany({
    where: { offer: { alumniId: profile.id } },
    include: {
      requester: { select: { id: true, name: true, email: true, avatarUrl: true } },
      offer: true
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const updateRequestStatus = async (
  userId: string,
  userRole: Role,
  requestId: string,
  newStatus: RequestStatus
) => {
  const request = await prisma.sessionRequest.findUnique({
    where: { id: requestId },
    include: { offer: { include: { alumni: true } } }
  });

  if (!request) {
    throw AppError.notFound('Session request not found');
  }

  const isOfferOwner = request.offer.alumni.userId === userId;
  const isAdmin = userRole === 'ADMIN';

  if (!isOfferOwner && !isAdmin) {
    throw AppError.forbidden('Only the session mentor or an admin can update this request');
  }

  if (!isValidSessionTransition(request.status, newStatus)) {
    throw AppError.conflict(
      `Cannot transition session request from ${request.status} to ${newStatus}`
    );
  }

  const [updated] = await prisma.$transaction([
    prisma.sessionRequest.update({
      where: { id: requestId },
      data: { status: newStatus, respondedAt: new Date() }
    }),
    prisma.auditLog.create({
      data: {
        actorId: userId,
        action: 'SESSION_STATUS_CHANGED',
        targetType: 'SessionRequest',
        targetId: requestId,
        meta: { from: request.status, to: newStatus }
      }
    })
  ]);

  return updated;
};
