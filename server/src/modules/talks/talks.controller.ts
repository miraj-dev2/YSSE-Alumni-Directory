import { Request, Response, NextFunction } from 'express';
import * as talkService from './talks.service.js';
import { ok } from '../../lib/apiResponse.js';
import { TalkQueryInput, CreateTalkInput, UpdateTalkInput } from './talks.schema.js';

export const getTalks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as unknown as TalkQueryInput;
    const talks = await talkService.getTalks(query);
    ok(res, talks);
  } catch (error) {
    next(error);
  }
};

export const getTalkById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const talk = await talkService.getTalkById(req.params.id);
    ok(res, talk);
  } catch (error) {
    next(error);
  }
};

export const createTalk = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const talk = await talkService.createTalk(req.body as CreateTalkInput);
    ok(res, talk, 201);
  } catch (error) {
    next(error);
  }
};

export const updateTalk = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const talk = await talkService.updateTalk(req.params.id, req.body as UpdateTalkInput);
    ok(res, talk);
  } catch (error) {
    next(error);
  }
};

export const deleteTalk = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await talkService.deleteTalk(req.params.id);
    ok(res, result);
  } catch (error) {
    next(error);
  }
};
