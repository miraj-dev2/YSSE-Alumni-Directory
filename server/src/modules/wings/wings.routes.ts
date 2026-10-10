import { Router } from 'express';
import { getWings } from './wings.controller.js';

export const wingsRouter = Router();

wingsRouter.get('/', getWings);
