import { Prisma, AlumniStatus } from '@prisma/client';
import { AlumniQueryInput } from './alumni.schema.js';

export interface AlumniFilterOptions extends Partial<AlumniQueryInput> {
  status?: AlumniStatus;
  statuses?: AlumniStatus[];
}

export const buildAlumniWhere = (
  filters: AlumniFilterOptions
): Prisma.AlumniProfileWhereInput => {
  const where: Prisma.AlumniProfileWhereInput = {};

  if (filters.status) {
    where.status = filters.status;
  } else if (filters.statuses && filters.statuses.length > 0) {
    where.status = { in: filters.statuses };
  }

  if (filters.batch) {
    where.batch = filters.batch;
  }

  if (filters.wing) {
    where.wing = {
      name: { equals: filters.wing, mode: 'insensitive' }
    };
  }

  if (filters.openToSessions !== undefined) {
    if (filters.openToSessions) {
      where.sessionOffers = { some: { isActive: true } };
    } else {
      where.sessionOffers = { none: { isActive: true } };
    }
  }

  if (filters.q && filters.q.trim()) {
    const term = filters.q.trim();
    where.OR = [
      { name: { contains: term, mode: 'insensitive' } },
      { organization: { contains: term, mode: 'insensitive' } },
      { currentRole: { contains: term, mode: 'insensitive' } }
    ];
  }

  return where;
};

export const buildAlumniOrderBy = (
  sort?: string
): Prisma.AlumniProfileOrderByWithRelationInput => {
  switch (sort) {
    case 'name_asc':
      return { name: 'asc' };
    case 'name_desc':
      return { name: 'desc' };
    case 'batch_asc':
      return { batch: 'asc' };
    case 'batch_desc':
      return { batch: 'desc' };
    case 'recent':
    default:
      return { createdAt: 'desc' };
  }
};
