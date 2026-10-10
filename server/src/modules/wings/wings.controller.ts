import { Request, Response, NextFunction } from 'express';
import * as wingsService from './wings.service.js';
import { ok } from '../../lib/apiResponse.js';

export const getWings = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const wings = await wingsService.getAllWings();
    ok(res, wings);
  } catch (error) {
    next(error);
  }
};
