import { parse } from 'csv-parse/sync';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../lib/AppError.js';
import {
  parseAndValidateRow,
  RawCsvRow,
  ParsedCsvRow,
  CsvRowStatus
} from './csvRowRules.js';

export interface RowReport {
  row: number;
  status: CsvRowStatus;
  message: string;
}

export const processCsvImport = async (
  adminId: string,
  csvBuffer: Buffer
) => {
  let records: RawCsvRow[];
  try {
    records = parse(csvBuffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
  } catch (err) {
    throw AppError.badRequest('Invalid CSV format: ' + (err instanceof Error ? err.message : ''));
  }

  if (records.length > 2000) {
    throw AppError.badRequest('CSV exceeds maximum allowed limit of 2000 rows');
  }

  const wings = await prisma.wing.findMany();
  const wingMap = new Map(wings.map((w) => [w.name.toLowerCase().trim(), w.id]));
  const knownWingNames = new Set(wings.map((w) => w.name.toLowerCase().trim()));

  const existingEmails = new Set(
    (await prisma.alumniProfile.findMany({ select: { email: true } })).map((p) =>
      p.email.toLowerCase()
    )
  );

  const seenFileEmails = new Set<string>();
  const report: RowReport[] = [];
  const validRowsToInsert: Array<ParsedCsvRow & { wingId: string }> = [];

  for (let idx = 0; idx < records.length; idx++) {
    const rowNumber = idx + 2; // header is row 1
    const rawRow = records[idx];

    const validation = parseAndValidateRow(
      rawRow,
      rowNumber,
      knownWingNames,
      seenFileEmails
    );

    if (!validation.isValid) {
      report.push({
        row: rowNumber,
        status: validation.status!,
        message: validation.message!
      });
      continue;
    }

    const parsed = validation.parsed!;
    if (existingEmails.has(parsed.email)) {
      report.push({
        row: rowNumber,
        status: 'duplicate_email',
        message: `Row ${rowNumber}: Email '${parsed.email}' already exists in database`
      });
      continue;
    }

    seenFileEmails.add(parsed.email);
    const wingId = wingMap.get(parsed.wingName.toLowerCase().trim())!;
    validRowsToInsert.push({ ...parsed, wingId });
  }

  // Create valid rows
  let createdCount = 0;
  for (const row of validRowsToInsert) {
    try {
      await prisma.alumniProfile.create({
        data: {
          name: row.name,
          email: row.email,
          batch: row.batch,
          wingId: row.wingId,
          currentRole: row.currentRole,
          organization: row.organization,
          location: row.location,
          linkedinUrl: row.linkedinUrl,
          status: 'APPROVED',
          source: 'CSV',
          reviewedById: adminId,
          reviewedAt: new Date()
        }
      });
      createdCount++;
      report.push({
        row: -1,
        status: 'created',
        message: `Imported '${row.name}' (${row.email})`
      });
    } catch {
      report.push({
        row: -1,
        status: 'duplicate_email',
        message: `Failed inserting row for '${row.email}'`
      });
    }
  }

  await prisma.auditLog.create({
    data: {
      actorId: adminId,
      action: 'CSV_IMPORT_EXECUTED',
      targetType: 'AlumniProfile',
      targetId: 'BULK_IMPORT',
      meta: { totalRows: records.length, createdCount, failedCount: records.length - createdCount }
    }
  });

  return {
    totalRows: records.length,
    createdCount,
    failedCount: records.length - createdCount,
    report
  };
};
