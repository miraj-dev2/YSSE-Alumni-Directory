import { AlumniProfile, Wing } from '@prisma/client';

export type ProfileWithRelations = AlumniProfile & {
  wing?: Wing | null;
  sessionOffers?: Array<{ id?: string; isActive: boolean }>;
  _count?: { sessionOffers?: number };
};

export interface ViewerContext {
  id?: string;
  role?: 'ADMIN' | 'MEMBER';
}

export interface SanitizedAlumniProfile {
  id: string;
  name: string;
  batch: number;
  wing: string;
  wingId: string;
  currentRole: string | null;
  organization: string | null;
  location: string | null;
  photoUrl: string | null;
  bio: string | null;
  openToSessions: boolean;
  isContactPublic: boolean;
  email?: string;
  linkedinUrl?: string | null;
  status?: string;
  rejectionReason?: string | null;
  source?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const mapProfileToView = (
  profile: ProfileWithRelations,
  viewer?: ViewerContext | null
): SanitizedAlumniProfile => {
  const isOpenToSessions =
    Array.isArray(profile.sessionOffers)
      ? profile.sessionOffers.some((o) => o.isActive)
      : (profile._count?.sessionOffers ?? 0) > 0;

  const isOwner = Boolean(viewer?.id && profile.userId === viewer.id);
  const isAdmin = viewer?.role === 'ADMIN';
  const canSeeContact = Boolean(
    viewer?.id && (profile.isContactPublic || isAdmin || isOwner)
  );

  const base: SanitizedAlumniProfile = {
    id: profile.id,
    name: profile.name,
    batch: profile.batch,
    wing: profile.wing ? profile.wing.name : '',
    wingId: profile.wingId,
    currentRole: profile.currentRole,
    organization: profile.organization,
    location: profile.location,
    photoUrl: profile.photoUrl,
    bio: profile.bio,
    isContactPublic: profile.isContactPublic,
    openToSessions: isOpenToSessions
  };

  if (canSeeContact) {
    base.email = profile.email;
    base.linkedinUrl = profile.linkedinUrl;
  }

  if (isAdmin || isOwner) {
    base.status = profile.status;
    base.rejectionReason = profile.rejectionReason;
    base.source = profile.source;
    base.createdAt = profile.createdAt;
    base.updatedAt = profile.updatedAt;
  }

  return base;
};
