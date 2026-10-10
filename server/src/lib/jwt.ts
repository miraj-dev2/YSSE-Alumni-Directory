import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from './AppError.js';

export interface TokenPayload {
  sub: string;
}

export const signToken = (userId: string): string => {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    if (!decoded || !decoded.sub) {
      throw AppError.unauthorized('Invalid token payload', 'INVALID_TOKEN');
    }
    return decoded;
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw AppError.unauthorized('Token is expired or invalid', 'INVALID_TOKEN');
  }
};
