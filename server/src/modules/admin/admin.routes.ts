import { Router } from 'express';
import {
  getStats,
  getAlumni,
  createAlumni,
  updateAlumni,
  updateStatus,
  bulkStatus,
  importCsv,
  exportCsv,
  getSessionRequests,
  getAuditLogs
} from './admin.controller.js';
import {
  adminAlumniQuerySchema,
  updateStatusSchema,
  bulkStatusSchema,
  adminCreateAlumniSchema,
  adminUpdateAlumniSchema
} from './admin.schema.js';
import { authenticate } from '../../middleware/authenticate.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';
import { validate } from '../../middleware/validate.js';
import { uploadCsv } from '../../middleware/upload.js';

export const adminRouter = Router();

adminRouter.use(authenticate, requireAdmin);

adminRouter.get('/stats', getStats);
adminRouter.get('/alumni', validate({ query: adminAlumniQuerySchema }), getAlumni);
adminRouter.post('/alumni', validate({ body: adminCreateAlumniSchema }), createAlumni);
adminRouter.patch('/alumni/:id', validate({ body: adminUpdateAlumniSchema }), updateAlumni);
adminRouter.patch('/alumni/:id/status', validate({ body: updateStatusSchema }), updateStatus);
adminRouter.post('/alumni/bulk-status', validate({ body: bulkStatusSchema }), bulkStatus);
adminRouter.post('/alumni/import', uploadCsv, importCsv);
adminRouter.get('/alumni/export', validate({ query: adminAlumniQuerySchema }), exportCsv);
adminRouter.get('/session-requests', getSessionRequests);
adminRouter.get('/audit-logs', getAuditLogs);
