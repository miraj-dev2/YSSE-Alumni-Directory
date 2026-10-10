import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AlumniPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const AlumniPagination: React.FC<AlumniPaginationProps> = ({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
}) => {
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
      <div className="text-xs text-[#9DB0A2] font-mono">
        Showing <span className="text-[#EEF3E8] font-bold">{startItem}</span> -{' '}
        <span className="text-[#EEF3E8] font-bold">{endItem}</span> of{' '}
        <span className="text-[#EEF3E8] font-bold">{total}</span> alumni
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="min-h-[44px] min-w-[44px] px-3 rounded bg-[#1F3027] border border-[#2E4336] text-[#EEF3E8] flex items-center justify-center hover:bg-[#2E4336]/40 disabled:opacity-40 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-xs font-mono px-3 text-[#9DB0A2]">
          Page <strong className="text-[#B7FF72]">{page}</strong> / {totalPages || 1}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="min-h-[44px] min-w-[44px] px-3 rounded bg-[#1F3027] border border-[#2E4336] text-[#EEF3E8] flex items-center justify-center hover:bg-[#2E4336]/40 disabled:opacity-40 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
