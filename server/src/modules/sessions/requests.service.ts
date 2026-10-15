import { RequestStatus, Role } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { isValidSessionTransition } from './requestTransitions.js';
import { AppError } from '../../lib/AppError.js';
import { createNotification } from '../notifications/notifications.service.js';

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

  const req = await prisma.sessionRequest.create({
    data: { offerId, requesterId, message },
    include: {
      requester: { select: { name: true } },
      offer: { include: { alumni: { select: { id: true, name: true, photoUrl: true } } } }
    }
  });

  if (offer.alumni.userId) {
    createNotification(
      offer.alumni.userId,
      'New Session Request',
      `${req.requester?.name || 'A member'} requested a mentorship session`,
      'SESSION_REQUEST',
      '/dashboard/requests'
    ).catch(() => {});
  }

  return req;
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

  if (!request) throw AppError.notFound('Session request not found');

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

  createNotification(
    request.requesterId,
    `Request ${newStatus}`,
    `Your request for "${request.offer.topic}" was ${newStatus.toLowerCase()}.`,
    'SESSION_UPDATE',
    '/dashboard/sessions'
  ).catch(() => {});

  return updated;
};

export const cancelSessionRequest = async (userId: string, requestId: string) => {
  const req = await prisma.sessionRequest.findUnique({ where: { id: requestId } });
  if (!req) throw AppError.notFound('Session request not found');
  if (req.requesterId !== userId) throw AppError.forbidden('Only requester can cancel this request');
  if (req.status !== 'PENDING') throw AppError.badRequest('Only pending requests can be cancelled');

  await prisma.sessionRequest.delete({ where: { id: requestId } });
  return { success: true };
};
