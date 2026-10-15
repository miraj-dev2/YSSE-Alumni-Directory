import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { alumniApi } from '../api/alumniApi';

export interface CsvRowValidation {
  rowIndex: number;
  data: {
    name: string;
    email: string;
    batch: string;
    wing: string;
    currentRole: string;
    organization: string;
    location: string;
    linkedinUrl: string;
  };
  isValid: boolean;
  statusText: 'Valid' | 'Duplicate email' | 'Missing batch' | 'Missing name' | 'Invalid email';
}

export const useCsvImport = () => {
  const [rows, setRows] = useState<CsvRowValidation[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [summary, setSummary] = useState<{ imported: number; skipped: number } | null>(null);

  const downloadTemplate = () => {
    const template = 'name,email,batch,wing,currentRole,organization,location,linkedinUrl\n' +
      'Tahmid Khan,tahmid.k@example.com,Batch 17,IT Department,Backend Engineer,Brain Station 23,Dhaka,https://linkedin.com/in/tahmid\n' +
      'Sabrina Islam,sabrina.i@example.com,Batch 16,Marketing & PR Department,Digital Strategist,Grameenphone,Dhaka,https://linkedin.com/in/sabrina\n';
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ysse_alumni_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseFile = useCallback(async (file: File) => {
    setIsParsing(true);
    setFileName(file.name);
    setSummary(null);

    const existingEmails = new Set(await alumniApi.getAllExistingEmails());
    const seenInFile = new Set<string>();

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validated: CsvRowValidation[] = results.data.map((row, idx) => {
          const name = (row.name || row.Name || '').trim();
          const email = (row.email || row.Email || '').trim().toLowerCase();
          const batch = (row.batch || row.Batch || '').trim();
          const wing = (row.wing || row.Wing || 'General').trim();
          const currentRole = (row.currentRole || row.Role || 'Alumnus').trim();
          const organization = (row.organization || row.Organization || 'YSSE Alumni').trim();
          const location = (row.location || row.Location || 'Dhaka, Bangladesh').trim();
          const linkedinUrl = (row.linkedinUrl || row.LinkedIn || '').trim();

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          let statusText: CsvRowValidation['statusText'] = 'Valid';
          let isValid = true;

          if (!name) {
            statusText = 'Missing name';
            isValid = false;
          } else if (!email || !emailRegex.test(email)) {
            statusText = 'Invalid email';
            isValid = false;
          } else if (!batch) {
            statusText = 'Missing batch';
            isValid = false;
          } else if (seenInFile.has(email) || existingEmails.has(email)) {
            statusText = 'Duplicate email';
            isValid = false;
          } else {
            seenInFile.add(email);
          }

          return {
            rowIndex: idx + 1,
            data: { name, email, batch, wing, currentRole, organization, location, linkedinUrl },
            isValid,
            statusText,
          };
        });

        setRows(validated);
        setIsParsing(false);
      },
      error: () => {
        setIsParsing(false);
      },
    });
  }, []);

  const commitImport = async (): Promise<boolean> => {
    const validRows = rows.filter((r) => r.isValid).map((r) => ({
      ...r.data,
      isContactPublic: true,
      openToSessions: false,
    }));

    if (validRows.length === 0) return false;

    setIsImporting(true);
    try {
      const res = await alumniApi.importAlumni(validRows);
      setSummary({ imported: res.imported, skipped: rows.length - res.imported });
      setRows([]);
      setFileName(null);
      return true;
    } catch {
      return false;
    } finally {
      setIsImporting(false);
    }
  };

  const resetImport = () => {
    setRows([]);
    setFileName(null);
    setSummary(null);
  };

  const validCount = rows.filter((r) => r.isValid).length;
  const invalidCount = rows.length - validCount;

  return {
    rows,
    fileName,
    validCount,
    invalidCount,
    isParsing,
    isImporting,
    summary,
    parseFile,
    commitImport,
    resetImport,
    downloadTemplate,
  };
};
