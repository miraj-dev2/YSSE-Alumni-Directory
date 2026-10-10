import { Mode } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { CreateOfferInput, UpdateOfferInput } from './sessions.schema.js';
import { AppError } from '../../lib/AppError.js';

export const getActiveOffers = async (modeFilter?: Mode) => {
  return prisma.sessionOffer.findMany({
    where: {
      isActive: true,
      ...(modeFilter ? { mode: modeFilter } : {}),
      alumni: { status: 'APPROVED' }
    },
    include: {
      alumni: {
        select: {
          id: true,
          name: true,
          batch: true,
          currentRole: true,
          organization: true,
          photoUrl: true,
          wing: { select: { id: true, name: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const createSessionOffer = async (
  userId: string,
  data: CreateOfferInput
) => {
  const profile = await prisma.alumniProfile.findUnique({
    where: { userId }
  });

  if (!profile) {
    throw AppError.forbidden('You must have an alumni profile to offer sessions');
  }

  if (profile.status !== 'APPROVED') {
    throw AppError.forbidden(
      'Your alumni profile must be approved before you can offer mentorship sessions'
    );
  }

  return prisma.sessionOffer.create({
    data: {
      alumniId: profile.id,
      topic: data.topic,
      description: data.description,
      mode: data.mode
    },
    include: {
      alumni: {
        select: { id: true, name: true, photoUrl: true, wing: { select: { name: true } } }
      }
    }
  });
};

export const updateSessionOffer = async (
  userId: string,
  offerId: string,
  data: UpdateOfferInput
) => {
  const offer = await prisma.sessionOffer.findUnique({
    where: { id: offerId },
    include: { alumni: true }
  });

  if (!offer) {
    throw AppError.notFound('Session offer not found');
  }

  if (offer.alumni.userId !== userId) {
    throw AppError.forbidden('You can only edit your own session offers');
  }

  return prisma.sessionOffer.update({
    where: { id: offerId },
    data: {
      ...(data.topic !== undefined && { topic: data.topic }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.mode !== undefined && { mode: data.mode }),
      ...(data.isActive !== undefined && { isActive: data.isActive })
    }
  });
};
