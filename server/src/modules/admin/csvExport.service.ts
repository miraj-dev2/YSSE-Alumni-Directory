import { prisma } from '../../lib/prisma.js';
import { buildAlumniWhere, buildAlumniOrderBy } from '../alumni/alumni.queries.js';
import { AdminAlumniQueryInput } from './admin.schema.js';

export const sanitizeForCsv = (value?: unknown): string => {
  if (value === null || value === undefined) return '';
  let str = String(value).trim();
  // Formula injection defense: prefix dangerous leading characters with single quote
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const generateAlumniCsvExport = async (query: AdminAlumniQueryInput) => {
  const where = buildAlumniWhere(query);
  const orderBy = buildAlumniOrderBy(query.sort);

  const alumni = await prisma.alumniProfile.findMany({
    where,
    orderBy,
    include: {
      wing: true,
      sessionOffers: { where: { isActive: true }, select: { id: true } }
    }
  });

  const headers = [
    'ID',
    'Name',
    'Email',
    'Batch',
    'Wing',
    'Current Role',
    'Organization',
    'Location',
    'LinkedIn',
    'Status',
    'Open To Sessions',
    'Source',
    'Created At'
  ];

  const rows = alumni.map((a) => {
    const openToSessions = a.sessionOffers.length > 0 ? 'Yes' : 'No';
    return [
      sanitizeForCsv(a.id),
      sanitizeForCsv(a.name),
      sanitizeForCsv(a.email),
      sanitizeForCsv(a.batch),
      sanitizeForCsv(a.wing.name),
      sanitizeForCsv(a.currentRole),
      sanitizeForCsv(a.organization),
      sanitizeForCsv(a.location),
      sanitizeForCsv(a.linkedinUrl),
      sanitizeForCsv(a.status),
      sanitizeForCsv(openToSessions),
      sanitizeForCsv(a.source),
      sanitizeForCsv(a.createdAt.toISOString())
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
};
