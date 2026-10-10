import { prisma } from '../../lib/prisma.js';
import { env } from '../../config/env.js';
import { signToken } from '../../lib/jwt.js';
import { verifyGoogleIdToken } from './googleVerify.js';
import { autoClaimAlumniProfile } from './claimProfile.js';
import { mapProfileToView } from '../../lib/publicProfile.js';
import { AppError } from '../../lib/AppError.js';

export const loginWithGoogle = async (idToken: string) => {
  const googleUser = await verifyGoogleIdToken(idToken);
  const isAdmin = env.ADMIN_EMAILS.includes(googleUser.email);
  const targetRole = isAdmin ? 'ADMIN' : 'MEMBER';

  const user = await prisma.user.upsert({
    where: { googleId: googleUser.googleId },
    update: {
      email: googleUser.email,
      name: googleUser.name,
      avatarUrl: googleUser.avatarUrl,
      role: targetRole
    },
    create: {
      googleId: googleUser.googleId,
      email: googleUser.email,
      name: googleUser.name,
      avatarUrl: googleUser.avatarUrl,
      role: targetRole
    }
  });

  await autoClaimAlumniProfile(user.id, user.email);

  const token = signToken(user.id);
  return { user, token };
};

export const devLogin = async (
  email: string,
  name?: string,
  requestedRole?: 'ADMIN' | 'MEMBER'
) => {
  if (env.NODE_ENV === 'production') {
    throw AppError.forbidden('Development login disabled in production');
  }

  const normalized = email.toLowerCase().trim();
  const isAdmin = env.ADMIN_EMAILS.includes(normalized) || requestedRole === 'ADMIN';
  const targetRole = isAdmin ? 'ADMIN' : 'MEMBER';

  const user = await prisma.user.upsert({
    where: { email: normalized },
    update: {
      name: name || normalized.split('@')[0],
      role: targetRole
    },
    create: {
      googleId: `dev_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      email: normalized,
      name: name || normalized.split('@')[0],
      role: targetRole
    }
  });

  await autoClaimAlumniProfile(user.id, user.email);
  const token = signToken(user.id);
  return { user, token };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: {
        include: {
          wing: true,
          sessionOffers: true
        }
      }
    }
  });

  if (!user) {
    throw AppError.notFound('User not found', 'USER_NOT_FOUND');
  }

  const mappedProfile = user.profile
    ? mapProfileToView(user.profile, { id: user.id, role: user.role })
    : null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
    profile: mappedProfile
  };
};
