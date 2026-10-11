import { Router } from 'express';
import {
  getAlumni,
  getFeatured,
  getStories,
  getAlumniById,
  getMe,
  createMe,
  updateMe,
  uploadPhotoHandler
} from './alumni.controller.js';
import {
  alumniQuerySchema,
  createProfileSchema,
  updateProfileSchema
} from './alumni.schema.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { optionalAuth } from '../../middleware/optionalAuth.js';
import { publicListLimiter } from '../../middleware/rateLimiters.js';
import { uploadPhoto } from '../../middleware/upload.js';

export const alumniRouter = Router();

// Authenticated /me routes must precede /:id to avoid param conflict
alumniRouter.get('/me', authenticate, getMe);
alumniRouter.post('/me', authenticate, validate({ body: createProfileSchema }), createMe);
alumniRouter.put('/me', authenticate, validate({ body: updateProfileSchema }), updateMe);
alumniRouter.post('/me/photo', authenticate, uploadPhoto, uploadPhotoHandler);

// Public routes
alumniRouter.get('/featured', optionalAuth, getFeatured);
alumniRouter.get('/stories', optionalAuth, getStories);
alumniRouter.get(
  '/',
  publicListLimiter,
  optionalAuth,
  validate({ query: alumniQuerySchema }),
  getAlumni
);
alumniRouter.get('/:id', optionalAuth, getAlumniById);
