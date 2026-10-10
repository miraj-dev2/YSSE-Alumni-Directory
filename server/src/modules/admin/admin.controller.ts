import { Request, Response, NextFunction } from 'express';
import * as statsService from './stats.service.js';
import * as approvalService from './approval.service.js';
import * as adminAlumniService from './adminAlumni.service.js';
import * as csvImportService from './csvImport.service.js';
import * as csvExportService from './csvExport.service.js';
import * as auditService from './audit.service.js';
import { ok } from '../../lib/apiResponse.js';
import { AppError } from '../../lib/AppError.js';
import { AdminAlumniQueryInput } from './admin.schema.js';

export const getStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await statsService.getAdminStats();
    ok(res, stats);
  } catch (err) { next(err); }
};

export const getAlumni = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query as unknown as AdminAlumniQueryInput;
    const { data, meta } = await adminAlumniService.getAdminAlumniList(query, req.user!.id);
    ok(res, data, 200, meta);
  } catch (err) { next(err); }
};

export const createAlumni = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await adminAlumniService.createAdminAlumni(req.user!.id, req.body);
    ok(res, profile, 201);
  } catch (err) { next(err); }
};

export const updateAlumni = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await adminAlumniService.updateAdminAlumni(req.user!.id, req.params.id, req.body);
    ok(res, profile);
  } catch (err) { next(err); }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, reason } = req.body;
    const profile = await approvalService.updateAlumniStatus(req.user!.id, req.params.id, status, reason);
    ok(res, profile);
  } catch (err) { next(err); }
};

export const bulkStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ids, status, reason } = req.body;
    const result = await approvalService.bulkUpdateAlumniStatus(req.user!.id, ids, status, reason);
    ok(res, result);
  } catch (err) { next(err); }
};

export const importCsv = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file || !req.file.buffer) {
      throw AppError.badRequest('CSV file is required in multipart form-data');
    }
    const report = await csvImportService.processCsvImport(req.user!.id, req.file.buffer);
    ok(res, report, 200);
  } catch (err) { next(err); }
};

export const exportCsv = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query as unknown as AdminAlumniQueryInput;
    const csvContent = await csvExportService.generateAlumniCsvExport(query);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="alumni-export.csv"');
    res.status(200).send(csvContent);
  } catch (err) { next(err); }
};

export const getSessionRequests = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await adminAlumniService.getAllAdminSessionRequests();
    ok(res, requests);
  } catch (err) { next(err); }
};

export const getAuditLogs = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await auditService.getAuditLogs();
    ok(res, logs);
  } catch (err) { next(err); }
};
