import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/AppError.js';

export const requireAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    return next(AppError.unauthorized('Authentication required', 'AUTH_REQUIRED'));
  }

  if (req.user.role !== 'ADMIN') {
    return next(AppError.forbidden('Admin privilege required', 'ADMIN_ONLY'));
  }

  next();
};
