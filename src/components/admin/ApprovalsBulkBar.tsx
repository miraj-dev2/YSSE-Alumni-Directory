import React from 'react';
import { Check, X } from 'lucide-react';

interface ApprovalsBulkBarProps {
  selectedCount: number;
  onApproveAll: () => void;
  onRejectAll: () => void;
  onClearSelection: () => void;
  isSubmitting?: boolean;
}

export const ApprovalsBulkBar: React.FC<ApprovalsBulkBarProps> = ({
  selectedCount,
  onApproveAll,
  onRejectAll,
  onClearSelection,
  isSubmitting = false,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-[#1F3027] border border-[#2E4336] p-3 rounded flex flex-wrap items-center justify-between gap-3 animate-fade-in">
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono uppercase bg-[#18251D] text-[#B7FF72] px-2.5 py-1 rounded border border-[#2E4336]">
          {selectedCount} Selected
        </span>
        <button
          type="button"
          onClick={onClearSelection}
          disabled={isSubmitting}
          className="text-xs text-[#9DB0A2] hover:text-[#EEF3E8] underline min-h-[44px] flex items-center"
        >
          Clear
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onApproveAll}
          disabled={isSubmitting}
          className="min-h-[44px] px-4 text-xs font-semibold rounded bg-[#B7FF72] text-[#18251D] flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Bulk Approve ({selectedCount})</span>
        </button>

        <button
          type="button"
          onClick={onRejectAll}
          disabled={isSubmitting}
          className="min-h-[44px] px-4 text-xs font-semibold rounded bg-[#18251D] border border-[#E8A598]/50 text-[#E8A598] flex items-center gap-1.5 hover:bg-[#E8A598]/10 disabled:opacity-50 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          <span>Bulk Reject ({selectedCount})</span>
        </button>
      </div>
    </div>
  );
};
