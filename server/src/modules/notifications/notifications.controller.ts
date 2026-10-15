import { Request, Response, NextFunction } from 'express';
import * as notificationService from './notifications.service.js';
import { ok } from '../../lib/apiResponse.js';

export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await notificationService.listUserNotifications(req.user!.id);
    ok(res, data);
  } catch (error) {
    next(error);
  }
};

export const markRead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await notificationService.markNotificationRead(req.user!.id, req.params.id);
    ok(res, data);
  } catch (error) {
    next(error);
  }
};

export const markAllRead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await notificationService.markAllNotificationsRead(req.user!.id);
    ok(res, data);
  } catch (error) {
    next(error);
  }
};
