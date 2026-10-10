import { Router } from 'express';
import { googleAuth, devAuth, logout, getMe } from './auth.controller.js';
import { googleAuthSchema, devAuthSchema } from './auth.schema.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authLimiter } from '../../middleware/rateLimiters.js';

export const authRouter = Router();

authRouter.post('/google', authLimiter, validate({ body: googleAuthSchema }), googleAuth);
authRouter.post('/dev-login', authLimiter, validate({ body: devAuthSchema }), devAuth);
authRouter.post('/logout', logout);
authRouter.get('/me', authenticate, getMe);
