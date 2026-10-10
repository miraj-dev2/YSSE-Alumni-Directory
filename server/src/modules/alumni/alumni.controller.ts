import { Request, Response, NextFunction } from 'express';
import * as alumniService from './alumni.service.js';
import * as myProfileService from './myProfile.service.js';
import * as photoService from './photo.service.js';
import { ok } from '../../lib/apiResponse.js';
import { AppError } from '../../lib/AppError.js';
import { AlumniQueryInput } from './alumni.schema.js';

export const getAlumni = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as unknown as AlumniQueryInput;
    const { data, meta } = await alumniService.getPublicAlumniList(query, req.user);
    ok(res, data, 200, meta);
  } catch (error) {
    next(error);
  }
};

export const getFeatured = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const featured = await alumniService.getFeaturedAlumni(req.user);
    ok(res, featured);
  } catch (error) {
    next(error);
  }
};

export const getAlumniById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profile = await alumniService.getAlumniById(req.params.id, req.user);
    ok(res, profile);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profile = await myProfileService.getMyProfile(req.user!.id);
    ok(res, profile);
  } catch (error) {
    next(error);
  }
};

export const createMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profile = await myProfileService.createMyProfile(
      req.user!.id,
      req.user!.email,
      req.body
    );
    ok(res, profile, 201);
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profile = await myProfileService.updateMyProfile(req.user!.id, req.body);
    ok(res, profile);
  } catch (error) {
    next(error);
  }
};

export const uploadPhotoHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file || !req.file.buffer) {
      throw AppError.badRequest('Photo file is required in multipart form-data');
    }
    const photoUrl = await photoService.processAndSaveProfilePhoto(
      req.user!.id,
      req.file.buffer
    );
    ok(res, { photoUrl });
  } catch (error) {
    next(error);
  }
};
