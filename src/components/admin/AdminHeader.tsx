import React from 'react';
import { Menu } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  primaryAction?: React.ReactNode;
  onOpenMobileMenu: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  primaryAction,
  onOpenMobileMenu,
}) => {
  return (
    <header className="border-b border-[#2E4336] bg-[#18251D] px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 text-[#9DB0A2] hover:text-[#EEF3E8] bg-[#1F3027] border border-[#2E4336] rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#EEF3E8] leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-[#9DB0A2] mt-0.5 font-sans">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {primaryAction && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {primaryAction}
          </div>
        )}
      </div>
    </header>
  );
};
