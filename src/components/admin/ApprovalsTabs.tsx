import React from 'react';
import { AlumniStatus } from '../../types/admin';

interface ApprovalsTabsProps {
  activeTab: AlumniStatus;
  onChangeTab: (tab: AlumniStatus) => void;
  counts?: { PENDING?: number; APPROVED?: number; REJECTED?: number };
}

const TABS: { id: AlumniStatus; label: string }[] = [
  { id: 'PENDING', label: 'Pending Review' },
  { id: 'APPROVED', label: 'Approved Alumni' },
  { id: 'REJECTED', label: 'Rejected' },
];

export const ApprovalsTabs: React.FC<ApprovalsTabsProps> = ({
  activeTab,
  onChangeTab,
  counts,
}) => {
  return (
    <div className="flex border-b border-[#2E4336] gap-2 overflow-x-auto pb-px" role="tablist">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const count = counts ? counts[tab.id] : undefined;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChangeTab(tab.id)}
            className={`min-h-[44px] px-4 py-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              isActive
                ? 'border-[#B7FF72] text-[#B7FF72]'
                : 'border-transparent text-[#9DB0A2] hover:text-[#EEF3E8] hover:border-[#2E4336]'
            }`}
          >
            <span>{tab.label}</span>
            {count !== undefined && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-[#B7FF72] text-[#18251D]'
                    : 'bg-[#1F3027] text-[#9DB0A2] border border-[#2E4336]'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
