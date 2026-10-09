import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { CsvAlumniRow, CsvValidationError } from '../../types';
import { Stepper } from '../../components/shared/Stepper';
import {
  UploadCloud,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle,
  Download,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const REQUIRED_COLUMNS = ['name', 'email', 'batch', 'wing', 'role', 'organization'];

const SAMPLE_CSV = `name,email,batch,wing,role,organization
Muntakim Chowdhury,muntakim.c@example.com,Batch 2021,Tech & Innovation,Software Engineer II,Amazon
Riffat Ara,riffat.ara@example.com,Batch 2020,Marketing & PR,Senior Brand Specialist,Nestle
Saifur Rahman,saifur.rahman@example.com,Batch 2019,Finance & Sponsorship,Investment Associate,IDLC Finance
Farhana Akter,farhana.akter@example.com,Batch 2022,Creative & Content,Visual Designer,Craftwork Studio
Invalid Row Test,invalid-email-address,Batch 2023,Tech & Innovation,DevOps Engineer,`;

export const AdminImportPage: React.FC = () => {
  const { success, error } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [fileName, setFileName] = useState<string>('');
  const [validRows, setValidRows] = useState<CsvAlumniRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<CsvValidationError[]>([]);
  const [duplicateEmails, setDuplicateEmails] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);

  const steps = ['Upload CSV File', 'Map & Validate', 'Confirm & Ingest'];

  const parseCsvContent = (csvString: string, name = 'custom.csv') => {
    setFileName(name);

    Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rawRows = results.data as Record<string, string>[];
        const valid: CsvAlumniRow[] = [];
        const errors: CsvValidationError[] = [];
        const seenEmails = new Set<string>();
        const duplicates: string[] = [];

        const headers = results.meta.fields?.map((f) => f.trim().toLowerCase()) || [];
        const missingHeaders = REQUIRED_COLUMNS.filter((col) => !headers.includes(col));

        if (missingHeaders.length > 0) {
          errors.push({
            row: 0,
            field: 'Headers',
            message: `Missing required columns: ${missingHeaders.join(', ')}`,
          });
          setValidRows([]);
          setValidationErrors(errors);
          setCurrentStep(2);
          return;
        }

        rawRows.forEach((row, idx) => {
          const rowNum = idx + 1;
          const normalized: Record<string, string> = {};
          Object.keys(row).forEach((k) => {
            normalized[k.trim().toLowerCase()] = (row[k] || '').trim();
          });

          let rowHasError = false;

          if (!normalized['name']) {
            errors.push({ row: rowNum, field: 'name', message: 'Name is required' });
            rowHasError = true;
          }

          if (!normalized['email']) {
            errors.push({ row: rowNum, field: 'email', message: 'Email is required' });
            rowHasError = true;
          } else if (!normalized['email'].includes('@') || !normalized['email'].includes('.')) {
            errors.push({ row: rowNum, field: 'email', message: 'Invalid email address syntax' });
            rowHasError = true;
          } else {
            if (seenEmails.has(normalized['email'].toLowerCase())) {
              duplicates.push(normalized['email']);
            }
            seenEmails.add(normalized['email'].toLowerCase());
          }

          if (!normalized['batch']) {
            errors.push({ row: rowNum, field: 'batch', message: 'Batch is required' });
            rowHasError = true;
          }

          if (!normalized['wing']) {
            errors.push({ row: rowNum, field: 'wing', message: 'Wing is required' });
            rowHasError = true;
          }

          if (!normalized['role']) {
            errors.push({ row: rowNum, field: 'role', message: 'Role is required' });
            rowHasError = true;
          }

          if (!normalized['organization']) {
            errors.push({ row: rowNum, field: 'organization', message: 'Organization is required' });
            rowHasError = true;
          }

          if (!rowHasError) {
            valid.push({
              name: normalized['name'],
              email: normalized['email'],
              batch: normalized['batch'],
              wing: normalized['wing'],
              role: normalized['role'],
              organization: normalized['organization'],
            });
          }
        });

        setValidRows(valid);
        setValidationErrors(errors);
        setDuplicateEmails(duplicates);
        setCurrentStep(2);
      },
      error: (err: Error) => {
        error('Parse Error', err.message);
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      parseCsvContent(content, file.name);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    parseCsvContent(SAMPLE_CSV, 'sample_ysse_alumni_batch.csv');
    success('Demo CSV Loaded', 'Includes 4 valid records and 1 deliberate validation error.');
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ysse_alumni_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadErrorReport = () => {
    const csvContent = Papa.unparse(validationErrors);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `import_errors_${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmImport = async () => {
    if (validRows.length === 0) return;
    setImporting(true);
    try {
      const res = await adminService.importAlumni(validRows);
      success('Import Successful', `Ingested ${res.importedCount} valid alumni profiles.`);
      navigate('/admin/alumni');
    } catch {
      error('Import failed', 'An unexpected error occurred while saving records.');
    } finally {
      setImporting(false);
    }
  };

  const handleReset = () => {
    setFileName('');
    setValidRows([]);
    setValidationErrors([]);
    setDuplicateEmails([]);
    setCurrentStep(1);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text">
            Bulk Alumni Ingestion
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Client-side CSV parsing, column mapping, row-level validation, and atomic import.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadTemplate}
            className="btn-secondary !min-h-[34px] h-[34px] text-xs px-3 gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Template</span>
          </button>
          <button
            onClick={handleLoadSample}
            className="btn-primary !min-h-[34px] h-[34px] text-xs px-3 gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Demo CSV</span>
          </button>
        </div>
      </div>

      {/* Stepper */}
      <Stepper steps={steps} currentStep={currentStep} />

      {/* Step 1: Upload */}
      {currentStep === 1 && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border-strong hover:border-accent bg-surface/50 rounded-card p-12 text-center cursor-pointer transition-colors flex flex-col items-center justify-center space-y-4"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-md bg-surface-hover border border-border-strong flex items-center justify-center text-accent">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text">
              Select or drop your alumni CSV spreadsheet
            </h3>
            <p className="text-xs text-muted mt-1 max-w-sm mx-auto font-mono">
              Columns: name, email, batch, wing, role, organization
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Map & Validate */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="bg-surface border border-border rounded-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-accent" />
              <div>
                <span className="font-semibold text-text block">{fileName}</span>
                <span className="text-muted">
                  {validRows.length} valid rows • {validationErrors.length} errors
                  {duplicateEmails.length > 0 && ` • ${duplicateEmails.length} duplicate emails`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="btn-secondary !min-h-[34px] h-[34px] text-xs px-3 gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Change File</span>
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={validRows.length === 0}
                className="btn-primary !min-h-[34px] h-[34px] text-xs px-4 gap-1.5"
              >
                <span>Proceed to Confirm</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Errors Report */}
          {validationErrors.length > 0 && (
            <div className="p-4 bg-status-rejected-bg border border-status-rejected/40 rounded-card space-y-3 text-xs text-status-rejected">
              <div className="flex items-center justify-between">
                <span className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Validation Errors Detected ({validationErrors.length})</span>
                </span>
                <button
                  onClick={handleDownloadErrorReport}
                  className="btn-secondary !min-h-[28px] h-[28px] text-[11px] px-2.5 gap-1 text-text border-status-rejected/40"
                >
                  <Download className="w-3 h-3" />
                  <span>Download Error Report</span>
                </button>
              </div>
              <p className="text-muted text-[11px]">
                Rows with errors will be skipped during ingestion.
              </p>
              <div className="max-h-40 overflow-y-auto divide-y divide-status-rejected/20 font-mono text-[11px]">
                {validationErrors.map((err, i) => (
                  <div key={i} className="py-1.5">
                    Row {err.row}: [{err.field}] {err.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* First 20 Rows Preview Table */}
          {validRows.length > 0 && (
            <div className="bg-surface border border-border rounded-card overflow-hidden">
              <div className="p-3 bg-surface-hover border-b border-border text-xs font-mono font-semibold text-text">
                Previewing Valid Rows ({Math.min(20, validRows.length)} of {validRows.length})
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface text-muted font-mono uppercase text-[10px] border-b border-border">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Email</th>
                      <th className="py-2 px-3">Batch</th>
                      <th className="py-2 px-3">Wing</th>
                      <th className="py-2 px-3">Role</th>
                      <th className="py-2 px-3">Organization</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-mono text-[11px]">
                    {validRows.slice(0, 20).map((r, i) => (
                      <tr key={i} className="hover:bg-surface-hover/30">
                        <td className="py-2 px-3 text-muted">{i + 1}</td>
                        <td className="py-2 px-3 font-sans font-semibold text-text">{r.name}</td>
                        <td className="py-2 px-3 text-muted">{r.email}</td>
                        <td className="py-2 px-3 text-accent">{r.batch}</td>
                        <td className="py-2 px-3 text-muted">{r.wing}</td>
                        <td className="py-2 px-3 text-text">{r.role}</td>
                        <td className="py-2 px-3 text-muted">{r.organization}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Confirm & Ingest */}
      {currentStep === 3 && (
        <div className="bg-surface border border-border rounded-card p-6 sm:p-8 space-y-6 max-w-2xl mx-auto text-xs">
          <div>
            <h2 className="text-base font-bold font-heading text-text">
              Confirm Bulk Ingestion
            </h2>
            <p className="text-muted mt-0.5">
              Please review the ingestion summary before writing to the database.
            </p>
          </div>

          <div className="space-y-3 font-mono">
            <div className="p-3 bg-surface-hover rounded border border-border flex justify-between">
              <span className="text-muted">Target Spreadsheet:</span>
              <span className="text-text font-semibold">{fileName}</span>
            </div>
            <div className="p-3 bg-surface-hover rounded border border-border flex justify-between">
              <span className="text-muted">Valid Profiles to Ingest:</span>
              <span className="text-accent font-semibold">{validRows.length} rows</span>
            </div>
            <div className="p-3 bg-surface-hover rounded border border-border flex justify-between">
              <span className="text-muted">Skipped Invalid Rows:</span>
              <span className="text-status-rejected font-semibold">{validationErrors.length} rows</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="btn-secondary !min-h-[36px] h-[36px] text-xs px-3 gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Preview</span>
            </button>
            <button
              onClick={handleConfirmImport}
              disabled={importing}
              className="btn-primary !min-h-[36px] h-[36px] text-xs px-6 gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{importing ? 'Ingesting...' : `Confirm Import (${validRows.length} Profiles)`}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
