import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  // Generate page numbers
  const pages: (number | string)[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 mt-10 select-none"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className="p-2.5 rounded-xl border border-border bg-surface text-text hover:bg-surface-elevated disabled:opacity-30 disabled:pointer-events-none transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p, idx) => {
        if (p === '...') {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 text-text-muted text-xs font-mono"
            >
              ...
            </span>
          );
        }

        const isCurrent = p === currentPage;
        return (
          <button
            key={`page-${p}`}
            onClick={() => onPageChange(p as number)}
            aria-current={isCurrent ? 'page' : undefined}
            className={`min-w-[40px] h-10 px-3 rounded-xl text-sm font-semibold transition-all ${
              isCurrent
                ? 'bg-accent text-accent-text font-bold shadow-glow'
                : 'bg-surface border border-border text-text hover:bg-surface-elevated'
            }`}
          >
            {p}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        className="p-2.5 rounded-xl border border-border bg-surface text-text hover:bg-surface-elevated disabled:opacity-30 disabled:pointer-events-none transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};
