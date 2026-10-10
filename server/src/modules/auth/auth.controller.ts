import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service.js';
import { ok } from '../../lib/apiResponse.js';
import { env } from '../../config/env.js';

const COOKIE_NAME = 'token';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const googleAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { idToken } = req.body;
    const { user, token } = await authService.loginWithGoogle(idToken);

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SEVEN_DAYS_MS
    });

    ok(res, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    ok(res, { message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const me = await authService.getCurrentUser(req.user!.id);
    ok(res, me);
  } catch (error) {
    next(error);
  }
};
