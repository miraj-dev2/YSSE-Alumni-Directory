import React from 'react';
import { SlidersHorizontal, Layers, Video } from 'lucide-react';
import { AlumniProfile } from '../../types/admin';
import { DashboardDirectoryTable } from './DashboardDirectoryTable';

interface DashboardDirectoryCardProps {
  items: AlumniProfile[];
  activeTab: 'Directory' | 'Approvals' | 'Sessions';
  onTabChange: (tab: 'Directory' | 'Approvals' | 'Sessions') => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  openToSessionsOnly: boolean;
  onToggleOpenToSessions: (val: boolean) => void;
  onViewAlumnus: (item: AlumniProfile) => void;
  onEditAlumnus: (item: AlumniProfile) => void;
  onBulkAction: () => void;
}

export const DashboardDirectoryCard: React.FC<DashboardDirectoryCardProps> = ({
  items,
  activeTab,
  onTabChange,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  openToSessionsOnly,
  onToggleOpenToSessions,
  onViewAlumnus,
  onEditAlumnus,
  onBulkAction,
}) => {
  return (
    <div className="bg-[#1F3027] border border-[#2E4336] rounded-[22px] p-6 flex flex-col justify-between shadow-sm">
      {/* Header with Tabs and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2E4336]">
        <div className="flex items-center gap-6 overflow-x-auto pb-1 sm:pb-0" role="tablist">
          {(['Directory', 'Approvals', 'Sessions'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabChange(tab)}
                className={`pb-2 text-sm font-bold font-heading transition-colors whitespace-nowrap relative ${
                  isActive ? 'text-[#B7FF72]' : 'text-[#9DB0A2] hover:text-[#EEF3E8]'
                }`}
              >
                <span>{tab}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B7FF72] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            className="h-[38px] px-3.5 rounded-full bg-[#18251D] border border-[#2E4336] text-xs font-semibold text-[#EEF3E8] hover:border-[#B7FF72] flex items-center gap-1.5 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#B7FF72]" />
            <span>Filter</span>
          </button>
          <button
            type="button"
            onClick={onBulkAction}
            disabled={selectedIds.size === 0}
            className="h-[38px] px-3.5 rounded-full bg-[#18251D] border border-[#2E4336] text-xs font-semibold text-[#EEF3E8] hover:border-[#B7FF72] flex items-center gap-1.5 transition-colors disabled:opacity-40"
          >
            <Layers className="w-3.5 h-3.5 text-[#B7FF72]" />
            <span>Bulk actions {selectedIds.size > 0 && `(${selectedIds.size})`}</span>
          </button>
        </div>
      </div>

      {/* Directory Table View */}
      <DashboardDirectoryTable
        items={items}
        selectedIds={selectedIds}
        onToggleSelect={onToggleSelect}
        onToggleSelectAll={onToggleSelectAll}
        onViewAlumnus={onViewAlumnus}
        onEditAlumnus={onEditAlumnus}
      />

      {/* Footer Checkbox */}
      <div className="mt-5 pt-4 border-t border-[#2E4336] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#EEF3E8] select-none">
          <input
            type="checkbox"
            checked={openToSessionsOnly}
            onChange={(e) => onToggleOpenToSessions(e.target.checked)}
            className="rounded bg-[#18251D] border-[#2E4336] text-[#B7FF72] h-4 w-4"
          />
          <span className="flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-[#B7FF72]" />
            <span>Show only alumni open to sessions</span>
          </span>
        </label>
        <span className="text-xs font-mono text-[#9DB0A2]">
          Showing {items.length} records
        </span>
      </div>
    </div>
  );
};
