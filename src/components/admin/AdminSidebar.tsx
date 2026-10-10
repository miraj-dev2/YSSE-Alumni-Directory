import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Users,
  CalendarCheck2,
  FileSpreadsheet,
  ArrowLeft,
  X,
  ShieldCheck,
} from 'lucide-react';
import { AdminUser } from '../../types/admin';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  pendingApprovalsCount: number;
  adminUser?: AdminUser | null;
}

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/approvals', label: 'Approvals', icon: UserCheck, withBadge: true },
  { to: '/admin/alumni', label: 'Alumni', icon: Users },
  { to: '/admin/sessions', label: 'Session requests', icon: CalendarCheck2 },
  { to: '/admin/import', label: 'Import CSV', icon: FileSpreadsheet },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen,
  onClose,
  pendingApprovalsCount,
  adminUser,
}) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/75 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[248px] bg-[#18251D] border-r border-[#2E4336] flex flex-col justify-between transition-transform duration-200 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo & Mobile Close */}
          <div className="h-16 px-5 border-b border-[#2E4336] flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5" onClick={onClose}>
              <div className="w-8 h-8 rounded bg-[#1F3027] border border-[#2E4336] flex items-center justify-center font-heading font-bold text-[#B7FF72] text-sm">
                Y
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-sm text-[#EEF3E8] leading-none">
                  YSSE Admin
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#9DB0A2] mt-1 leading-none">
                  Dhaka Directorate
                </span>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="md:hidden p-2 text-[#9DB0A2] hover:text-[#EEF3E8] min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-1" aria-label="Admin navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium transition-colors min-h-[44px] ${
                      isActive
                        ? 'bg-[#1F3027] text-[#B7FF72] border-l-2 border-[#B7FF72]'
                        : 'text-[#9DB0A2] hover:text-[#EEF3E8] hover:bg-[#1F3027]/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.withBadge && pendingApprovalsCount > 0 && (
                    <span className="bg-[#B7FF72] text-[#18251D] text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full">
                      {pendingApprovalsCount}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer: Admin chip & Back to site */}
        <div className="p-4 border-t border-[#2E4336] space-y-3">
          <div className="flex items-center gap-2.5 p-2 rounded bg-[#1F3027] border border-[#2E4336]">
            <div className="w-8 h-8 rounded bg-[#2E4336] flex items-center justify-center text-[#B7FF72] text-xs font-bold shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[#EEF3E8] truncate">
                {adminUser?.name || 'Administrator'}
              </p>
              <p className="text-[10px] font-mono uppercase text-[#B7FF72] truncate">
                ROLE: {adminUser?.role || 'ADMIN'}
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-[#9DB0A2] hover:text-[#EEF3E8] hover:bg-[#1F3027] rounded transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to site</span>
          </Link>
        </div>
      </aside>
    </>
  );
};
