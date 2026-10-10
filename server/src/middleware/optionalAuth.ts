import { Request, Response, NextFunction } from 'express';
import { extractToken } from './authenticate.js';
import { verifyToken } from '../lib/jwt.js';
import { prisma } from '../lib/prisma.js';

export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);
    if (!token) {
      return next();
    }

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, role: true, googleId: true }
    });

    if (user) {
      req.user = user;
    }
  } catch {
    // Optional auth silently ignores expired/invalid tokens
  }
  next();
};
