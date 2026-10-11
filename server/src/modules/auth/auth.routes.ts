import { Router } from 'express';
import { googleAuth, register, login, logout, getMe } from './auth.controller.js';
import { googleAuthSchema, registerSchema, loginSchema } from './auth.schema.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authLimiter } from '../../middleware/rateLimiters.js';

export const authRouter = Router();

authRouter.post('/google', authLimiter, validate({ body: googleAuthSchema }), googleAuth);
authRouter.post('/register', authLimiter, validate({ body: registerSchema }), register);
authRouter.post('/login', authLimiter, validate({ body: loginSchema }), login);
authRouter.post('/logout', logout);
authRouter.get('/me', authenticate, getMe);
