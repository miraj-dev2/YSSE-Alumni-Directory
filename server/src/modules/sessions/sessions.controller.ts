import { Request, Response, NextFunction } from 'express';
import { Mode } from '@prisma/client';
import * as offersService from './offers.service.js';
import * as requestsService from './requests.service.js';
import { ok } from '../../lib/apiResponse.js';

export const getOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const mode = req.query.mode as Mode | undefined;
    const offers = await offersService.getActiveOffers(mode);
    ok(res, offers);
  } catch (error) {
    next(error);
  }
};

export const createOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const offer = await offersService.createSessionOffer(req.user!.id, req.body);
    ok(res, offer, 201);
  } catch (error) {
    next(error);
  }
};

export const updateOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updated = await offersService.updateSessionOffer(
      req.user!.id,
      req.params.id,
      req.body
    );
    ok(res, updated);
  } catch (error) {
    next(error);
  }
};

export const createRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { offerId, message } = req.body;
    const sessionReq = await requestsService.createSessionRequest(
      req.user!.id,
      offerId,
      message
    );
    ok(res, sessionReq, 201);
  } catch (error) {
    next(error);
  }
};

export const getMyRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requests = await requestsService.getMyRequests(req.user!.id);
    ok(res, requests);
  } catch (error) {
    next(error);
  }
};

export const getIncomingRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requests = await requestsService.getIncomingRequests(req.user!.id);
    ok(res, requests);
  } catch (error) {
    next(error);
  }
};

export const updateRequestStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body;
    const updated = await requestsService.updateRequestStatus(
      req.user!.id,
      req.user!.role,
      req.params.id,
      status
    );
    ok(res, updated);
  } catch (error) {
    next(error);
  }
};
