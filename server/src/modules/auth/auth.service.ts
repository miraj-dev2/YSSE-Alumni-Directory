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
