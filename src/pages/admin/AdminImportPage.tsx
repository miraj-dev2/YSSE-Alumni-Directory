import React from 'react';
import { useCsvImport } from '../../hooks/useCsvImport';
import { useToast } from '../../context/ToastContext';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { CsvDropzone } from '../../components/admin/CsvDropzone';
import { CsvPreviewTable } from '../../components/admin/CsvPreviewTable';
import { CsvSummaryModal } from '../../components/admin/CsvSummaryModal';

export const AdminImportPage: React.FC = () => {
  const {
    rows, fileName, validCount, invalidCount, isParsing, isImporting,
    summary, parseFile, commitImport, resetImport, downloadTemplate,
  } = useCsvImport();

  const { success, error: toastError } = useToast();

  const handleCommit = async () => {
    const ok = await commitImport();
    if (ok) success('Import Succeeded', 'Processed alumni batch roster.');
    else toastError('Import Failed', 'No valid records to import.');
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Import CSV"
        subtitle="3-step cohort onboarding: template download, file upload, and validation preview."
        showPeriodFilter={false}
      />

      <div className="bg-[#1F3027] border border-[#2E4336] rounded-[22px] p-6 space-y-6">
        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-3 border-b border-[#2E4336] pb-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#B7FF72]">
            <span className="w-5 h-5 rounded-full bg-[#B7FF72] text-[#18251D] flex items-center justify-center font-bold text-[11px]">1</span>
            <span>Download Template</span>
          </div>
          <div className={`flex items-center gap-2 ${rows.length > 0 ? 'text-[#B7FF72]' : 'text-[#EEF3E8]'}`}>
            <span className="w-5 h-5 rounded-full bg-[#2A4033] text-[#B7FF72] flex items-center justify-center font-bold text-[11px]">2</span>
            <span>Dropzone Upload</span>
          </div>
          <div className={`flex items-center gap-2 ${rows.length > 0 ? 'text-[#EEF3E8]' : 'text-[#9DB0A2]'}`}>
            <span className="w-5 h-5 rounded-full bg-[#18251D] text-[#9DB0A2] border border-[#2E4336] flex items-center justify-center font-bold text-[11px]">3</span>
            <span>Validation Preview</span>
          </div>
        </div>

        {rows.length === 0 ? (
          <CsvDropzone
            onFileSelect={parseFile}
            onDownloadTemplate={downloadTemplate}
            isParsing={isParsing}
          />
        ) : (
          <CsvPreviewTable
            rows={rows}
            fileName={fileName}
            validCount={validCount}
            invalidCount={invalidCount}
            onCommitImport={handleCommit}
            onDiscard={resetImport}
            isImporting={isImporting}
          />
        )}
      </div>

      <CsvSummaryModal
        isOpen={!!summary}
        onClose={resetImport}
        importedCount={summary?.imported || 0}
        skippedCount={summary?.skipped || 0}
      />
    </div>
  );
};
