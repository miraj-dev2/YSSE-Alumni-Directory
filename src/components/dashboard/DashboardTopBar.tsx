import React from 'react';
import { Menu, Bell, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onOpenMobileMenu: () => void;
  unreadCount?: number;
}

export const DashboardTopBar: React.FC<Props> = ({
  onOpenMobileMenu,
  unreadCount = 0
}) => {
  const { user } = useAuth();
  const role = user?.role === 'alumni' ? 'Alumni' : user?.role === 'admin' ? 'Admin' : 'Member';

  return (
    <header className="h-16 px-4 sm:px-8 border-b border-[#2E4336] bg-[#18251D] flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-[#9DB0A2] hover:text-[#EEF3E8] bg-[#1F3027] border border-[#2E4336] rounded-xl flex items-center justify-center shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <img
          src="/ysse-logo.png"
          alt="YSSE Logo"
          className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 border border-[#2E4336] lg:hidden"
        />
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#9DB0A2] block">YSSE Alumni Network</span>
          <span className="text-sm font-semibold text-[#EEF3E8] block">
            {user?.role === 'admin' ? 'Admin Portal' : user?.role === 'alumni' ? 'Alumni Portal' : 'Personal Member Portal'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/dashboard/notifications"
          className="relative p-2 text-[#9DB0A2] hover:text-[#EEF3E8] bg-[#1F3027] border border-[#2E4336] hover:border-[#B7FF72] rounded-xl transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#B7FF72] text-[#18251D] text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        <div className="flex items-center gap-2 pl-2 border-l border-[#2E4336]">
          <div className="w-8 h-8 rounded-full bg-[#25392D] border border-[#2E4336] flex items-center justify-center font-bold text-xs text-[#B7FF72]">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <UserIcon className="w-4 h-4" />
            )}
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-semibold text-[#EEF3E8] block leading-tight">{user?.name}</span>
            <span className="text-[10px] text-[#9DB0A2] block leading-tight">{role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
