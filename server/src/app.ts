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
import { talksRouter } from './modules/talks/talks.routes.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { ok } from './lib/apiResponse.js';

export const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const allowedOrigins = new Set([
  env.CLIENT_ORIGIN,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin) || env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
    },
    credentials: true
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Static files for photo uploads
app.use('/uploads', express.static(path.resolve(env.UPLOAD_DIR)));

// Public health check
app.get('/health', (_req, res) => {
  ok(res, { status: 'healthy', timestamp: new Date().toISOString() });
});

// Mount modules on both /api and root paths
const apiRouter = express.Router();
apiRouter.get('/health', (_req, res) => {
  ok(res, { status: 'healthy', timestamp: new Date().toISOString() });
});
apiRouter.use('/auth', authRouter);
apiRouter.use('/alumni', alumniRouter);
apiRouter.use('/sessions', sessionsRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/wings', wingsRouter);
apiRouter.use('/talks', talksRouter);

app.use('/api', apiRouter);
app.use('/auth', authRouter);
app.use('/alumni', alumniRouter);
app.use('/sessions', sessionsRouter);
app.use('/admin', adminRouter);
app.use('/wings', wingsRouter);
app.use('/talks', talksRouter);

// 404 & Global Error Handling
app.use(notFound);
app.use(errorHandler);
