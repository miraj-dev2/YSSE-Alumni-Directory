import { Router } from 'express';
import {
  getOffers,
  createOffer,
  updateOffer,
  createRequest,
  getMyRequests,
  getIncomingRequests,
  updateRequestStatus
} from './sessions.controller.js';
import {
  createOfferSchema,
  updateOfferSchema,
  createRequestSchema,
  updateRequestStatusSchema
} from './sessions.schema.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';

export const sessionsRouter = Router();

sessionsRouter.get('/offers', getOffers);
sessionsRouter.post(
  '/offers',
  authenticate,
  validate({ body: createOfferSchema }),
  createOffer
);
sessionsRouter.patch(
  '/offers/:id',
  authenticate,
  validate({ body: updateOfferSchema }),
  updateOffer
);

sessionsRouter.post(
  '/requests',
  authenticate,
  validate({ body: createRequestSchema }),
  createRequest
);
sessionsRouter.get('/requests/mine', authenticate, getMyRequests);
sessionsRouter.get('/requests/incoming', authenticate, getIncomingRequests);
sessionsRouter.patch(
  '/requests/:id/status',
  authenticate,
  validate({ body: updateRequestStatusSchema }),
  updateRequestStatus
);
