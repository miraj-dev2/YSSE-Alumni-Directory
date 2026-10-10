import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useCsvImport } from '../../hooks/useCsvImport';
import { useToast } from '../../context/ToastContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { CsvDropzone } from '../../components/admin/CsvDropzone';
import { CsvPreviewTable } from '../../components/admin/CsvPreviewTable';
import { CsvSummaryModal } from '../../components/admin/CsvSummaryModal';

interface OutletContextType {
  onOpenMobileMenu: () => void;
}

export const AdminImportPage: React.FC = () => {
  const { onOpenMobileMenu } = useOutletContext<OutletContextType>();
  const {
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
  } = useCsvImport();

  const { success, error: toastError } = useToast();

  const handleCommit = async () => {
    const ok = await commitImport();
    if (ok) {
      success('Import Succeeded', `Processed alumni batch file.`);
    } else {
      toastError('Import Failed', 'No valid records to import or an error occurred.');
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Batch Import Alumni Records"
        subtitle="Upload and validate CSV records for rapid cohort onboarding"
        onOpenMobileMenu={onOpenMobileMenu}
      />

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

      <CsvSummaryModal
        isOpen={!!summary}
        onClose={resetImport}
        importedCount={summary?.imported || 0}
        skippedCount={summary?.skipped || 0}
      />
    </div>
  );
};
