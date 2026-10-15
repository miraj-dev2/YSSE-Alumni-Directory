import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Compass,
  Inbox,
  CalendarCheck2,
  Bookmark,
  Bell,
  Settings,
  LogOut,
  X,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pendingCount?: number;
  unreadNotesCount?: number;
}

export const DashboardSidebar: React.FC<Props> = ({
  isOpen,
  onClose,
  pendingCount = 0,
  unreadNotesCount = 0
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role === 'alumni' ? 'alumni' : 'member';

  const handleLogout = async () => {
    navigate('/', { replace: true });
    await logout();
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
      isActive
        ? 'bg-[#B7FF72] text-[#18251D] shadow-sm'
        : 'text-[#9DB0A2] hover:text-[#EEF3E8] hover:bg-[#25392D]'
    }`;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed top-0 bottom-0 left-0 w-[260px] bg-[#1B2A20] border-r border-[#2E4336] z-50 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 px-5 border-b border-[#2E4336] flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <img src="/ysse-logo.png" alt="YSSE Logo" className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 border border-[#2E4336]" />
            <div>
              <span className="font-bold text-sm tracking-tight text-[#EEF3E8] block">YSSE Portal</span>
              <span className="text-[10px] text-[#9DB0A2] font-mono uppercase tracking-wider block">Member Hub</span>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1.5 text-[#9DB0A2] hover:text-[#EEF3E8]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#9DB0A2]/60 px-3 py-1">Dashboard</div>
          <NavLink to="/dashboard" end className={navClass} onClick={onClose}>
            <div className="flex items-center gap-2.5"><LayoutDashboard className="w-4 h-4" /><span>Overview</span></div>
          </NavLink>
          <NavLink to="/dashboard/profile" className={navClass} onClick={onClose}>
            <div className="flex items-center gap-2.5"><User className="w-4 h-4" /><span>My Profile</span></div>
          </NavLink>
          <NavLink to="/dashboard/directory" className={navClass} onClick={onClose}>
            <div className="flex items-center gap-2.5"><Compass className="w-4 h-4" /><span>Alumni Directory</span></div>
          </NavLink>
          <NavLink to="/dashboard/requests" className={navClass} onClick={onClose}>
            <div className="flex items-center gap-2.5"><Inbox className="w-4 h-4" /><span>{role === 'alumni' ? 'Incoming Requests' : 'My Requests'}</span></div>
            {pendingCount > 0 && <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-[#B7FF72]/20 text-[#B7FF72] font-bold">{pendingCount}</span>}
          </NavLink>
          <NavLink to="/dashboard/sessions" className={navClass} onClick={onClose}>
            <div className="flex items-center gap-2.5"><CalendarCheck2 className="w-4 h-4" /><span>My Sessions</span></div>
          </NavLink>
          {role === 'member' && (
            <NavLink to="/dashboard/saved" className={navClass} onClick={onClose}>
              <div className="flex items-center gap-2.5"><Bookmark className="w-4 h-4" /><span>Saved Mentors</span></div>
            </NavLink>
          )}
          <NavLink to="/dashboard/notifications" className={navClass} onClick={onClose}>
            <div className="flex items-center gap-2.5"><Bell className="w-4 h-4" /><span>Notifications</span></div>
            {unreadNotesCount > 0 && <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-[#B7FF72] text-[#18251D] font-bold">{unreadNotesCount}</span>}
          </NavLink>
          <NavLink to="/dashboard/settings" className={navClass} onClick={onClose}>
            <div className="flex items-center gap-2.5"><Settings className="w-4 h-4" /><span>Settings</span></div>
          </NavLink>

          {user?.role === 'admin' && (
            <div className="pt-3 pb-1 border-t border-[#2E4336] mt-3">
              <Link to="/admin" className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#E9C46A] hover:bg-[#25392D]">
                <ShieldAlert className="w-4 h-4" /><span>Admin Panel</span>
              </Link>
            </div>
          )}
        </nav>

        <div className="p-3 border-t border-[#2E4336] bg-[#142018] flex items-center justify-between">
          <div className="truncate pr-2">
            <span className="block text-xs font-semibold text-[#EEF3E8] truncate">{user?.name}</span>
            <span className="block text-[10px] text-[#9DB0A2] uppercase tracking-wider">{user?.role}</span>
          </div>
          <button onClick={handleLogout} className="p-2 text-[#9DB0A2] hover:text-[#EEF3E8] hover:bg-[#25392D] rounded-lg transition-colors" title="Log out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
