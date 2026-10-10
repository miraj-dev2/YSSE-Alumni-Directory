export type CsvRowStatus =
  | 'created'
  | 'duplicate_email'
  | 'missing_batch'
  | 'invalid_email'
  | 'unknown_wing';

export interface RawCsvRow {
  name?: string;
  email?: string;
  batch?: string | number;
  wing?: string;
  role?: string;
  organization?: string;
  location?: string;
  linkedin?: string;
  [key: string]: unknown;
}

export interface ParsedCsvRow {
  name: string;
  email: string;
  batch: number;
  wingName: string;
  currentRole?: string;
  organization?: string;
  location?: string;
  linkedinUrl?: string;
}

export interface RowValidationResult {
  isValid: boolean;
  status?: CsvRowStatus;
  message?: string;
  parsed?: ParsedCsvRow;
}

export const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeCsvCell = (value?: unknown): string => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

export const parseAndValidateRow = (
  rawRow: RawCsvRow,
  rowNumber: number,
  knownWingNames: Set<string>,
  seenFileEmails: Set<string>
): RowValidationResult => {
  const name = sanitizeCsvCell(rawRow.name || rawRow.Name);
  const rawEmail = sanitizeCsvCell(rawRow.email || rawRow.Email).toLowerCase();
  const rawBatch = sanitizeCsvCell(rawRow.batch || rawRow.Batch);
  const rawWing = sanitizeCsvCell(rawRow.wing || rawRow.Wing);

  if (!rawEmail || !validateEmailFormat(rawEmail)) {
    return {
      isValid: false,
      status: 'invalid_email',
      message: `Row ${rowNumber}: Invalid or missing email address`
    };
  }

  if (seenFileEmails.has(rawEmail)) {
    return {
      isValid: false,
      status: 'duplicate_email',
      message: `Row ${rowNumber}: Duplicate email '${rawEmail}' within CSV file`
    };
  }

  const batchNum = parseInt(rawBatch, 10);
  if (!rawBatch || isNaN(batchNum) || batchNum <= 0) {
    return {
      isValid: false,
      status: 'missing_batch',
      message: `Row ${rowNumber}: Missing or non-positive batch number`
    };
  }

  if (!rawWing || !knownWingNames.has(rawWing.toLowerCase())) {
    return {
      isValid: false,
      status: 'unknown_wing',
      message: `Row ${rowNumber}: Unknown or missing wing '${rawWing}'`
    };
  }

  if (!name) {
    return {
      isValid: false,
      status: 'invalid_email',
      message: `Row ${rowNumber}: Name is required`
    };
  }

  return {
    isValid: true,
    parsed: {
      name,
      email: rawEmail,
      batch: batchNum,
      wingName: rawWing,
      currentRole: sanitizeCsvCell(rawRow.role || rawRow.Role) || undefined,
      organization: sanitizeCsvCell(rawRow.organization || rawRow.Organization) || undefined,
      location: sanitizeCsvCell(rawRow.location || rawRow.Location) || undefined,
      linkedinUrl: sanitizeCsvCell(rawRow.linkedin || rawRow.Linkedin) || undefined
    }
  };
};
