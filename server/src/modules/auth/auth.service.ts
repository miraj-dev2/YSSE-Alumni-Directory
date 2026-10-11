import { prisma } from '../../lib/prisma.js';
import { env } from '../../config/env.js';
import { signToken } from '../../lib/jwt.js';
import { verifyGoogleIdToken } from './googleVerify.js';
import { autoClaimAlumniProfile } from './claimProfile.js';
import { mapProfileToView } from '../../lib/publicProfile.js';
import { AppError } from '../../lib/AppError.js';
import { hashPassword, verifyPassword } from '../../lib/password.js';
import { LoginInput, RegisterInput } from './auth.schema.js';

/**
 * Authenticates via Google OAuth ID token. Verifies signature,
 * creates or syncs the User record, and claims any matching alumni roster profile.
 */
export const loginWithGoogle = async (idToken: string) => {
  const googleUser = await verifyGoogleIdToken(idToken);
  const isAdmin = env.ADMIN_EMAILS.includes(googleUser.email.toLowerCase().trim());
  const targetRole = isAdmin ? 'ADMIN' : 'MEMBER';

  const user = await prisma.user.upsert({
    where: { googleId: googleUser.googleId },
    update: {
      email: googleUser.email.toLowerCase().trim(),
      name: googleUser.name,
      avatarUrl: googleUser.avatarUrl,
      role: targetRole
    },
    create: {
      googleId: googleUser.googleId,
      email: googleUser.email.toLowerCase().trim(),
      name: googleUser.name,
      avatarUrl: googleUser.avatarUrl,
      role: targetRole
    }
  });

  await autoClaimAlumniProfile(user.id, user.email);
  const token = signToken(user.id);
  return { user, token };
};

/**
 * Registers a new user with salt+scrypt password hashing.
 * Elevates to ADMIN if email matches official secretariat list.
 */
export const registerWithCredentials = async (input: RegisterInput) => {
  const normalizedEmail = input.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    throw AppError.conflict('An account with this email already exists', 'EMAIL_TAKEN');
  }

  const isAdmin = env.ADMIN_EMAILS.includes(normalizedEmail);
  const targetRole = isAdmin ? 'ADMIN' : 'MEMBER';
  const passwordHash = hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      name: input.name.trim(),
      passwordHash,
      role: targetRole
    }
  });

  await autoClaimAlumniProfile(user.id, user.email);
  const token = signToken(user.id);
  return { user, token };
};

/**
 * Authenticates user credentials using timing-safe scrypt password check.
 * Issues signed JWT and syncs role permissions.
 */
export const loginWithCredentials = async (input: LoginInput) => {
  const normalizedEmail = input.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (!user) {
    throw AppError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  if (!user.passwordHash) {
    throw AppError.unauthorized(
      'This account was registered using Google. Please click "Continue with Google".',
      'USE_GOOGLE_LOGIN'
    );
  }

  const isValid = verifyPassword(input.password, user.passwordHash);
  if (!isValid) {
    throw AppError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const isAdmin = env.ADMIN_EMAILS.includes(normalizedEmail);
  if (isAdmin && user.role !== 'ADMIN') {
    await prisma.user.update({ where: { id: user.id }, data: { role: 'ADMIN' } });
    user.role = 'ADMIN';
  }

  await autoClaimAlumniProfile(user.id, user.email);
  const token = signToken(user.id);
  return { user, token };
};

/**
 * Retrieves the authenticated user's session with sanitized profile data.
 */
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
