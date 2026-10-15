import { Router } from 'express';
import {
  getNotifications,
  markRead,
  markAllRead
} from './notifications.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

export const notificationsRouter = Router();

notificationsRouter.use(authenticate);

notificationsRouter.get('/', getNotifications);
notificationsRouter.patch('/:id/read', markRead);
notificationsRouter.post('/read-all', markAllRead);
