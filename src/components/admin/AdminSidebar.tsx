import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCheck, CalendarCheck2, FileSpreadsheet, Settings, ArrowLeft, X,
} from 'lucide-react';
import { AdminUser } from '../../types/admin';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  pendingApprovalsCount: number;
  adminUser?: AdminUser | null;
}

const PRIMARY_NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/alumni', label: 'Alumni Directory', icon: Users },
  { to: '/admin/approvals', label: 'Approvals', icon: UserCheck, withBadge: true },
  { to: '/admin/sessions', label: 'Session requests', icon: CalendarCheck2 },
  { to: '/admin/import', label: 'Import CSV', icon: FileSpreadsheet },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen, onClose, pendingApprovalsCount, adminUser,
}) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/75 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[264px] bg-[#131E17] border-r border-[#2E4336] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          <div className="h-20 px-6 border-b border-[#2E4336] flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5" onClick={onClose}>
              <div className="w-8 h-8 rounded-full bg-[#2A4033] border border-[#2E4336] flex items-center justify-center font-heading font-black text-[#B7FF72] text-sm">
                Y
              </div>
              <span className="font-heading font-extrabold text-base tracking-tight text-[#EEF3E8]">
                YSSE<span className="text-[#B7FF72]">.alumni</span>
              </span>
            </Link>
            <button onClick={onClose} className="lg:hidden p-2 text-[#9DB0A2] hover:text-[#EEF3E8] min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Close sidebar">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-1.5" aria-label="Admin Navigation">
            {PRIMARY_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 h-[46px] rounded-full text-xs transition-colors ${
                      isActive ? 'bg-[#B7FF72] text-[#18251D] font-bold shadow-sm' : 'text-[#9DB0A2] hover:text-[#EEF3E8] hover:bg-[#1F3027]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#18251D]' : 'text-[#9DB0A2]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.withBadge && pendingApprovalsCount > 0 && (
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-[#18251D] text-[#B7FF72]' : 'bg-[#B7FF72] text-[#18251D]'
                        }`}>
                          {pendingApprovalsCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}

            <div className="pt-2 pb-1 border-t border-[#2E4336] my-2" />

            <NavLink
              to="/admin/settings"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 h-[46px] rounded-full text-xs transition-colors ${
                  isActive ? 'bg-[#B7FF72] text-[#18251D] font-bold' : 'text-[#9DB0A2] hover:text-[#EEF3E8] hover:bg-[#1F3027]'
                }`
              }
            >
              <Settings className="w-4 h-4 text-inherit" />
              <span>Settings</span>
            </NavLink>
          </nav>
        </div>

        <div className="p-4 border-t border-[#2E4336] space-y-3">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 text-xs text-[#9DB0A2] hover:text-[#EEF3E8] hover:bg-[#1F3027] rounded-full transition-colors min-h-[44px]">
            <ArrowLeft className="w-4 h-4" /> <span>Back to site</span>
          </Link>
          <div className="flex items-center gap-2.5 px-3 py-2 bg-[#1F3027] border border-[#2E4336] rounded-full">
            <div className="w-7 h-7 rounded-full bg-[#2A4033] text-[#B7FF72] font-bold text-xs flex items-center justify-center shrink-0">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#EEF3E8] truncate">{adminUser?.name || 'Rashidul Alam'}</p>
              <p className="text-[10px] font-mono text-[#B7FF72] uppercase leading-none">Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
