import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { env } from './config/env.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { alumniRouter } from './modules/alumni/alumni.routes.js';
import { sessionsRouter } from './modules/sessions/sessions.routes.js';
import { adminRouter } from './modules/admin/admin.routes.js';
import { wingsRouter } from './modules/wings/wings.routes.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { ok } from './lib/apiResponse.js';

export const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Static files for photo uploads
app.use('/uploads', express.static(path.resolve(env.UPLOAD_DIR)));

// Public health check
app.get('/health', (_req, res) => {
  ok(res, { status: 'healthy', timestamp: new Date().toISOString() });
});

// Mount modules
app.use('/auth', authRouter);
app.use('/alumni', alumniRouter);
app.use('/sessions', sessionsRouter);
app.use('/admin', adminRouter);
app.use('/wings', wingsRouter);

// 404 & Global Error Handling
app.use(notFound);
app.use(errorHandler);
