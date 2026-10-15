import { Request, Response, NextFunction } from 'express';
import { getDashboardStats } from './dashboard.service.js';
import { ok } from '../../lib/apiResponse.js';

export const getStatsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await getDashboardStats(req.user!.id);
    ok(res, data);
  } catch (error) {
    next(error);
  }
};
