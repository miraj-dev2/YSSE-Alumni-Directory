import React from 'react';
import { Search, SlidersHorizontal, Bell, Menu, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminTopBarProps {
  onOpenMobileMenu: () => void;
  onFilterClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  onOpenMobileMenu,
  onFilterClick,
  searchQuery = '',
  onSearchChange,
}) => {
  const { user } = useAuth();
  const displayName = user?.name || 'Administrator';
  const displayRole = user?.role ? user.role.toUpperCase() : 'ADMIN';

  return (
    <header className="h-18 py-3 px-4 sm:px-9 border-b border-[#2E4336] bg-[#18251D] flex items-center justify-between gap-4">
      {/* Left: Mobile menu toggle + Pill Search + Filter */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-[#9DB0A2] hover:text-[#EEF3E8] bg-[#1F3027] border border-[#2E4336] rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative flex-1">
          <label htmlFor="topbar-search" className="sr-only">Quick search directory</label>
          <Search className="w-4 h-4 text-[#9DB0A2] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="topbar-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search alumni, wing, batch..."
            className="w-full h-[44px] bg-[#1F3027] border border-[#2E4336] rounded-full pl-10 pr-4 text-xs text-[#EEF3E8] placeholder-[#9DB0A2]/60 focus:outline-none focus:border-[#B7FF72]"
          />
        </div>

        <button
          type="button"
          onClick={onFilterClick}
          className="h-[44px] px-3.5 rounded-full bg-[#1F3027] border border-[#2E4336] text-[#EEF3E8] text-xs font-semibold flex items-center gap-1.5 hover:border-[#B7FF72] transition-colors shrink-0"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#B7FF72]" />
          <span className="hidden sm:inline">Filter</span>
        </button>
      </div>

      {/* Right: Notifications + Admin Avatar */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          aria-label="Notifications"
          className="w-11 h-11 rounded-full bg-[#1F3027] border border-[#2E4336] flex items-center justify-center text-[#9DB0A2] hover:text-[#EEF3E8] hover:border-[#B7FF72] transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#B7FF72]" />
        </button>

        <div className="flex items-center gap-2.5 pl-2 border-l border-[#2E4336]">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={displayName}
              className="w-9 h-9 rounded-full object-cover border border-[#2E4336]"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#1F3027] border border-[#2E4336] flex items-center justify-center text-[#B7FF72]">
              <UserCheck className="w-4 h-4" />
            </div>
          )}
          <div className="hidden sm:block text-left">
            <span className="text-xs font-semibold text-[#EEF3E8] block leading-tight">
              {displayName}
            </span>
            <span className="text-[10px] font-mono text-[#B7FF72] uppercase leading-none block mt-0.5">
              {displayRole}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
