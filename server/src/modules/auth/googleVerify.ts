import { googleOAuthClient } from '../../lib/googleClient.js';
import { env } from '../../config/env.js';
import { AppError } from '../../lib/AppError.js';

export interface VerifiedGoogleUser {
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export const verifyGoogleIdToken = async (
  idToken: string
): Promise<VerifiedGoogleUser> => {
  try {
    const ticket = await googleOAuthClient.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw AppError.unauthorized('Invalid Google token payload', 'AUTH_INVALID_TOKEN');
    }

    if (!payload.email_verified) {
      throw AppError.unauthorized(
        'Google email is not verified',
        'AUTH_EMAIL_NOT_VERIFIED'
      );
    }

    if (!payload.sub || !payload.email) {
      throw AppError.unauthorized('Google token missing subject or email');
    }

    return {
      googleId: payload.sub,
      email: payload.email.toLowerCase().trim(),
      name: payload.name || payload.email.split('@')[0],
      avatarUrl: payload.picture
    };
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw AppError.unauthorized(
      'Google authentication failed: ' + (err instanceof Error ? err.message : 'Invalid token'),
      'AUTH_GOOGLE_FAILED'
    );
  }
};
