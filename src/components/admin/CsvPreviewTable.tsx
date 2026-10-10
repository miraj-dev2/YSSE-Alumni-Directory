import React from 'react';
import { CheckCircle2, AlertTriangle, UploadCloud } from 'lucide-react';
import { CsvRowValidation } from '../../hooks/useCsvImport';

interface CsvPreviewTableProps {
  rows: CsvRowValidation[];
  fileName: string | null;
  validCount: number;
  invalidCount: number;
  onCommitImport: () => void;
  onDiscard: () => void;
  isImporting?: boolean;
}

export const CsvPreviewTable: React.FC<CsvPreviewTableProps> = ({
  rows,
  fileName,
  validCount,
  invalidCount,
  onCommitImport,
  onDiscard,
  isImporting = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Metrics Banner */}
      <div className="bg-[#1F3027] border border-[#2E4336] p-4 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold font-heading text-[#EEF3E8]">
              File Preview: {fileName}
            </h3>
            <span className="text-[10px] font-mono text-[#9DB0A2] bg-[#18251D] px-2 py-0.5 rounded border border-[#2E4336]">
              {rows.length} rows
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs font-mono">
            <span className="text-[#B7FF72] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {validCount} Ready to import
            </span>
            {invalidCount > 0 && (
              <span className="text-[#E8A598] flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {invalidCount} Invalid (will be skipped)
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={onDiscard}
            disabled={isImporting}
            className="min-h-[44px] px-3.5 text-xs font-semibold rounded bg-[#18251D] border border-[#2E4336] text-[#9DB0A2] hover:text-[#EEF3E8]"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={onCommitImport}
            disabled={isImporting || validCount === 0}
            className="min-h-[44px] px-4 text-xs font-semibold rounded bg-[#B7FF72] text-[#18251D] flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isImporting ? 'Importing...' : `Import ${validCount} Valid Records`}</span>
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto border border-[#2E4336] rounded bg-[#1F3027] max-h-96">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#18251D] text-[#9DB0A2] font-mono uppercase text-[11px] sticky top-0 border-b border-[#2E4336]">
            <tr>
              <th className="p-3 w-12">#</th>
              <th className="p-3">Status</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Batch & Wing</th>
              <th className="p-3">Organization</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2E4336]">
            {rows.slice(0, 50).map((row) => (
              <tr key={row.rowIndex} className="hover:bg-[#18251D]/50">
                <td className="p-3 font-mono text-[#9DB0A2]">{row.rowIndex}</td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      row.isValid
                        ? 'bg-[#B7FF72]/15 text-[#B7FF72] border border-[#B7FF72]/30'
                        : 'bg-[#E8A598]/15 text-[#E8A598] border border-[#E8A598]/30'
                    }`}
                  >
                    {row.statusText}
                  </span>
                </td>
                <td className="p-3 font-semibold text-[#EEF3E8]">{row.data.name || '—'}</td>
                <td className="p-3 text-[#9DB0A2]">{row.data.email || '—'}</td>
                <td className="p-3 text-[#EEF3E8]">
                  {row.data.batch || '—'} • {row.data.wing}
                </td>
                <td className="p-3 text-[#9DB0A2]">
                  {row.data.currentRole} at {row.data.organization}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-2">
        {rows.slice(0, 20).map((row) => (
          <div key={row.rowIndex} className="p-3 bg-[#1F3027] border border-[#2E4336] rounded space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#EEF3E8]">#{row.rowIndex} {row.data.name}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  row.isValid ? 'bg-[#B7FF72]/15 text-[#B7FF72]' : 'bg-[#E8A598]/15 text-[#E8A598]'
                }`}
              >
                {row.statusText}
              </span>
            </div>
            <p className="text-[#9DB0A2]">{row.data.email}</p>
            <p className="text-[#9DB0A2]">Batch: {row.data.batch} | {row.data.wing}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
