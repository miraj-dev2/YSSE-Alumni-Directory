import React from 'react';
import { Search, Download } from 'lucide-react';
import { PaginatedAlumniQuery } from '../../types/admin';

interface AlumniFiltersProps {
  query: PaginatedAlumniQuery;
  onUpdateQuery: (patch: Partial<PaginatedAlumniQuery>) => void;
  onExportCsv: () => void;
}

const BATCHES = [
  'all',
  ...Array.from({ length: 17 }, (_, i) => `Batch ${17 - i}`)
];
const WINGS = [
  'all',
  'Admin & HR Department',
  'Marketing & PR Department',
  'Communication Department',
  'Content Writing Department',
  'Graphic Design Department',
  'Video Editing Department',
  'Operations Management Department',
  'Business Development Department',
  'IT Department',
  'IT: Wing 1 — Web Development & CMS',
  'IT: Wing 2 — Software & App Engineering',
  'IT: Wing 3 — Systems Automation & DataOps',
  'IT: Wing 4 — AI Integration & Cybersecurity',
  'IT: Wing 5 — Tech Research & Innovation'
];
const STATUSES = ['all', 'APPROVED', 'PENDING', 'REJECTED'];

export const AlumniFilters: React.FC<AlumniFiltersProps> = ({
  query,
  onUpdateQuery,
  onExportCsv,
}) => {
  return (
    <div className="bg-[#1F3027] border border-[#2E4336] p-4 rounded space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <label htmlFor="alumni-search" className="sr-only">
            Search alumni by name, company, or role
          </label>
          <Search className="w-4 h-4 text-[#9DB0A2] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="alumni-search"
            type="text"
            value={query.search || ''}
            onChange={(e) => onUpdateQuery({ search: e.target.value })}
            placeholder="Search by name, organization, or role..."
            className="w-full bg-[#18251D] border border-[#2E4336] rounded pl-9 pr-3 py-2 text-xs text-[#EEF3E8] placeholder-[#9DB0A2]/60 focus:border-[#B7FF72] focus:outline-none min-h-[44px]"
          />
        </div>

        {/* Batch Dropdown */}
        <div>
          <label htmlFor="batch-select" className="sr-only">Filter by Batch</label>
          <select
            id="batch-select"
            value={query.batch || 'all'}
            onChange={(e) => onUpdateQuery({ batch: e.target.value })}
            className="w-full bg-[#18251D] border border-[#2E4336] rounded px-3 py-2 text-xs text-[#EEF3E8] focus:border-[#B7FF72] focus:outline-none min-h-[44px]"
          >
            {BATCHES.map((b) => (
              <option key={b} value={b}>
                {b === 'all' ? 'All Batches' : b}
              </option>
            ))}
          </select>
        </div>

        {/* Wing Dropdown */}
        <div>
          <label htmlFor="wing-select" className="sr-only">Filter by Wing</label>
          <select
            id="wing-select"
            value={query.wing || 'all'}
            onChange={(e) => onUpdateQuery({ wing: e.target.value })}
            className="w-full bg-[#18251D] border border-[#2E4336] rounded px-3 py-2 text-xs text-[#EEF3E8] focus:border-[#B7FF72] focus:outline-none min-h-[44px]"
          >
            {WINGS.map((w) => (
              <option key={w} value={w}>
                {w === 'all' ? 'All Wings' : w}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-[#2E4336]">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <span className="text-[10px] font-mono uppercase text-[#9DB0A2] mr-1">Status:</span>
          {STATUSES.map((st) => {
            const isSelected = (query.status || 'all') === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => onUpdateQuery({ status: st })}
                className={`text-[11px] font-medium px-2.5 py-1 rounded min-h-[32px] transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#B7FF72] text-[#18251D] font-semibold'
                    : 'bg-[#18251D] text-[#9DB0A2] border border-[#2E4336] hover:text-[#EEF3E8]'
                }`}
              >
                {st === 'all' ? 'All' : st}
              </button>
            );
          })}
        </div>

        {/* Export CSV button */}
        <button
          type="button"
          onClick={onExportCsv}
          className="min-h-[44px] px-3.5 py-2 text-xs font-semibold rounded bg-[#18251D] border border-[#2E4336] text-[#EEF3E8] hover:border-[#B7FF72] hover:text-[#B7FF72] flex items-center gap-2 transition-colors self-end sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
};
