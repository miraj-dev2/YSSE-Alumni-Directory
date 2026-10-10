import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/AppError.js';

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(
    AppError.notFound(
      `Endpoint ${req.method} ${req.originalUrl} not found`,
      'ROUTE_NOT_FOUND'
    )
  );
};
