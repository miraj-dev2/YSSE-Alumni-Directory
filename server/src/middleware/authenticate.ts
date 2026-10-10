import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt.js';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/AppError.js';

export const extractToken = (req: Request): string | null => {
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);
    if (!token) {
      throw AppError.unauthorized('Authentication required', 'AUTH_REQUIRED');
    }

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, role: true, googleId: true }
    });

    if (!user) {
      throw AppError.unauthorized('User no longer exists', 'USER_NOT_FOUND');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
