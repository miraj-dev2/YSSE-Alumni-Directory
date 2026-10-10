import React from 'react';
import { UserPlus, ChevronDown } from 'lucide-react';

interface AdminPageHeaderProps {
  title?: string;
  name?: string;
  subtitle?: string;
  onAddAlumnus?: () => void;
  period?: string;
  onPeriodChange?: (period: string) => void;
  showPeriodFilter?: boolean;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  name = 'Administrator',
  subtitle = 'Here is your executive alumni directory overview for the current session.',
  onAddAlumnus,
  period = 'This month',
  onPeriodChange,
  showPeriodFilter = true,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-heading font-extrabold text-[#EEF3E8] tracking-tight leading-tight">
          {title || `Welcome back, ${name}`}
        </h1>
        <p className="text-xs sm:text-sm text-[#9DB0A2] mt-1 font-sans">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3 self-start lg:self-auto shrink-0">
        {showPeriodFilter && (
          <div className="relative">
            <select
              value={period}
              onChange={(e) => onPeriodChange?.(e.target.value)}
              aria-label="Filter report timeframe"
              className="appearance-none h-[44px] pl-4 pr-9 rounded-full bg-[#1F3027] border border-[#2E4336] text-xs font-semibold text-[#EEF3E8] focus:outline-none focus:border-[#B7FF72] cursor-pointer"
            >
              <option value="This month">This month</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="This quarter">This quarter</option>
              <option value="All time">All time</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#9DB0A2] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}

        {onAddAlumnus && (
          <button
            type="button"
            onClick={onAddAlumnus}
            className="h-[44px] px-5 rounded-full bg-[#B7FF72] text-[#18251D] text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
          >
            <UserPlus className="w-4 h-4 text-[#18251D]" />
            <span>Add alumnus</span>
          </button>
        )}
      </div>
    </div>
  );
};
