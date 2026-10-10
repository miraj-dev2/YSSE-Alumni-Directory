import { PaginationMeta } from './apiResponse.js';

export interface PaginationParams {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
}

export const parsePagination = (
  rawPage?: unknown,
  rawPageSize?: unknown,
  defaultSize = 12,
  maxSize = 50
): PaginationParams => {
  const pageNumber = Number(rawPage);
  const pageSizeNumber = Number(rawPageSize);

  const page = Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1;
  const sizeCandidate =
    Number.isInteger(pageSizeNumber) && pageSizeNumber > 0
      ? pageSizeNumber
      : defaultSize;
  const pageSize = Math.min(Math.max(sizeCandidate, 1), maxSize);

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize
  };
};

export const buildPaginationMeta = (
  page: number,
  pageSize: number,
  total: number
): PaginationMeta => {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize)
  };
};
