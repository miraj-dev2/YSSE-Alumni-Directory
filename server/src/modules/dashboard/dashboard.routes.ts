import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { getStatsHandler } from './dashboard.controller.js';

export const dashboardRouter = Router();

dashboardRouter.get('/stats', authenticate, getStatsHandler);
