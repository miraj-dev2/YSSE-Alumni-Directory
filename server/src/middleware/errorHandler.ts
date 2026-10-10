import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../lib/AppError.js';
import { fail } from '../lib/apiResponse.js';
import { logger } from '../lib/logger.js';
import { env } from '../config/env.js';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    fail(res, err.code, err.message, err.statusCode, err.details);
    return;
  }

  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));
    fail(res, 'VALIDATION_ERROR', 'Validation failed', 400, details);
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = Array.isArray(err.meta?.target)
        ? (err.meta?.target as string[]).join(', ')
        : 'unique constraint';
      fail(
        res,
        'CONFLICT',
        `A record with this ${target} already exists`,
        409,
        err.meta
      );
      return;
    }
    if (err.code === 'P2025') {
      fail(res, 'NOT_FOUND', 'Requested database record not found', 404);
      return;
    }
  }

  logger.error({ err }, 'Unhandled server error');

  const message =
    env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : err instanceof Error
        ? err.message
        : 'Unknown internal error';

  fail(res, 'INTERNAL_SERVER_ERROR', message, 500);
};
