import { Router } from 'express';
import {
  getTalks,
  getTalkById,
  createTalk,
  updateTalk,
  deleteTalk
} from './talks.controller.js';
import { talkQuerySchema, createTalkSchema, updateTalkSchema } from './talks.schema.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';

export const talksRouter = Router();

// Public discovery endpoints
talksRouter.get('/', validate({ query: talkQuerySchema }), getTalks);
talksRouter.get('/:id', getTalkById);

// Admin moderation endpoints
talksRouter.post(
  '/',
  authenticate,
  requireAdmin,
  validate({ body: createTalkSchema }),
  createTalk
);

talksRouter.put(
  '/:id',
  authenticate,
  requireAdmin,
  validate({ body: updateTalkSchema }),
  updateTalk
);

talksRouter.delete(
  '/:id',
  authenticate,
  requireAdmin,
  deleteTalk
);
