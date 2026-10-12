import { prisma } from '../../lib/prisma.js';
import { CreateProfileInput, UpdateProfileInput } from './alumni.schema.js';
import { mapProfileToView } from '../../lib/publicProfile.js';
import { AppError } from '../../lib/AppError.js';

export const getMyProfile = async (userId: string) => {
  const profile = await prisma.alumniProfile.findUnique({
    where: { userId },
    include: {
      wing: true,
      sessionOffers: true
    }
  });

  if (!profile) {
    throw AppError.notFound('Profile not found. Please create one.', 'NO_PROFILE');
  }

  return mapProfileToView(profile, { id: userId, role: 'MEMBER' });
};

export const createMyProfile = async (
  userId: string,
  userEmail: string,
  data: CreateProfileInput
) => {
  const existing = await prisma.alumniProfile.findUnique({ where: { userId } });
  if (existing) {
    throw AppError.conflict('You already have a profile linked to this account');
  }

  const wing = await prisma.wing.findUnique({ where: { id: data.wingId } });
  if (!wing) {
    throw AppError.badRequest('Invalid wing ID selected', 'INVALID_WING');
  }

  const profile = await prisma.alumniProfile.create({
    data: {
      userId,
      email: userEmail.toLowerCase().trim(),
      name: data.name,
      batch: data.batch,
      wingId: data.wingId,
      currentRole: data.currentRole,
      organization: data.organization,
      location: data.location,
      linkedinUrl: data.linkedinUrl || null,
      bio: data.bio,
      story: data.story || null,
      isContactPublic: data.isContactPublic ?? false,
      status: 'APPROVED',
      source: 'SELF'
    },
    include: { wing: true, sessionOffers: true }
  });

  return mapProfileToView(profile, { id: userId, role: 'MEMBER' });
};

export const updateMyProfile = async (
  userId: string,
  data: UpdateProfileInput
) => {
  const profile = await prisma.alumniProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw AppError.notFound('Profile does not exist. Create it first.');
  }

  if (data.wingId) {
    const wing = await prisma.wing.findUnique({ where: { id: data.wingId } });
    if (!wing) throw AppError.badRequest('Invalid wing selected', 'INVALID_WING');
  }

  // Business rule: editing APPROVED keeps it APPROVED and writes audit entry;
  // editing REJECTED resets it to PENDING.
  const newStatus = profile.status === 'REJECTED' ? 'PENDING' : profile.status;

  const [updatedProfile] = await prisma.$transaction([
    prisma.alumniProfile.update({
      where: { id: profile.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.batch && { batch: data.batch }),
        ...(data.wingId && { wingId: data.wingId }),
        ...(data.currentRole !== undefined && { currentRole: data.currentRole }),
        ...(data.organization !== undefined && { organization: data.organization }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.linkedinUrl !== undefined && { linkedinUrl: data.linkedinUrl || null }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.story !== undefined && { story: data.story || null }),
        ...(data.isContactPublic !== undefined && { isContactPublic: data.isContactPublic }),
        status: newStatus,
        ...(profile.status === 'REJECTED' ? { rejectionReason: null } : {})
      },
      include: { wing: true, sessionOffers: true }
    }),
    ...(profile.status === 'APPROVED'
      ? [
          prisma.auditLog.create({
            data: {
              actorId: userId,
              action: 'ALUMNI_SELF_EDIT_APPROVED',
              targetType: 'AlumniProfile',
              targetId: profile.id,
              meta: { changes: Object.keys(data) }
            }
          })
        ]
      : [])
  ]);

  return mapProfileToView(updatedProfile, { id: userId, role: 'MEMBER' });
};
