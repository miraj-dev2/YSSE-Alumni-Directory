import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages?: number;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export const ok = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: PaginationMeta
): Response => {
  const payload: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(meta ? { meta } : {})
  };
  return res.status(statusCode).json(payload);
};

export const fail = (
  res: Response,
  code: string,
  message: string,
  statusCode = 400,
  details?: unknown
): Response => {
  const payload: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {})
    }
  };
  return res.status(statusCode).json(payload);
};
