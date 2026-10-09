import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import { Avatar } from '../components/shared/Avatar';
import { CommandPalette } from '../components/shared/CommandPalette';
import { RoleSwitcherModal } from '../components/shared/RoleSwitcherModal';
import {
  LayoutDashboard,
  UserCheck,
  Users,
  CalendarCheck2,
  FileSpreadsheet,
  Clock,
  Activity,
  Settings,
  Bell,
  Menu,
  X,
  ChevronRight,
  Repeat,
  LogOut,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, loginAs, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Query pending approvals count for sidebar badge
  const { data: pendingList = [] } = useQuery({
    queryKey: ['pendingApprovalsCount'],
    queryFn: () => adminService.getApprovals('Pending'),
  });

  const { data: staleList = [] } = useQuery({
    queryKey: ['staleProfilesCount'],
    queryFn: () => adminService.getStaleProfiles(),
  });

  const handleSwitchToMember = async () => {
    await loginAs('member');
    navigate('/alumni');
  };

  interface NavItem {
    to: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    end?: boolean;
    badge?: number;
  }

  interface NavGroup {
    title: string;
    items: NavItem[];
  }

  const navGroups: NavGroup[] = [
    {
      title: 'Overview',
      items: [
        { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
      ],
    },
    {
      title: 'Manage',
      items: [
        {
          to: '/admin/approvals',
          label: 'Approvals',
          icon: UserCheck,
          badge: pendingList.length > 0 ? pendingList.length : undefined,
        },
        { to: '/admin/alumni', label: 'Alumni Directory', icon: Users },
        { to: '/admin/sessions', label: 'Session Requests', icon: CalendarCheck2 },
        { to: '/admin/import', label: 'Import CSV', icon: FileSpreadsheet },
        {
          to: '/admin/stale',
          label: 'Stale Profiles',
          icon: Clock,
          badge: staleList.length > 0 ? staleList.length : undefined,
        },
      ],
    },
    {
      title: 'System',
      items: [
        { to: '/admin/activity', label: 'Activity Log', icon: Activity },
        { to: '/admin/settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  // Compute breadcrumb label
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentSubPage = pathParts[1] || 'Dashboard';

  return (
    <div className="min-h-screen bg-bg text-text flex">
      {/* 240px Fixed Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-surface border-r border-border p-4 flex flex-col justify-between transition-transform duration-200 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Header & Logo */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-surface-hover border border-border-strong flex items-center justify-center text-accent font-heading font-black text-sm">
                Y
              </div>
              <div>
                <span className="font-heading font-semibold text-sm text-text block leading-none">
                  YSSE Admin
                </span>
                <span className="text-[10px] font-mono uppercase text-muted tracking-wider leading-none mt-1 block">
                  Console v2
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1 text-muted hover:text-text"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Groups */}
          <nav className="space-y-5 text-xs" aria-label="Admin Navigation">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted px-2.5 py-1 block">
                  {group.title}
                </span>
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={({ isActive }) =>
                      `relative flex items-center justify-between px-2.5 py-2 rounded-sm font-medium transition-colors ${
                        isActive
                          ? 'text-accent bg-surface-hover font-semibold'
                          : 'text-muted hover:text-text hover:bg-surface-hover'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-2.5">
                          <item.icon className="w-4 h-4 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="chip bg-status-pending-bg text-status-pending border-status-pending/30 text-[10px] px-1.5 py-0">
                            {item.badge}
                          </span>
                        )}
                        {/* 2px accent indicator */}
                        {isActive && (
                          <div className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-accent rounded-r" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-border space-y-2 text-xs">
          <button
            onClick={handleSwitchToMember}
            className="w-full flex items-center gap-2 px-2.5 py-2 text-muted hover:text-text hover:bg-surface-hover rounded-sm transition-colors text-left"
          >
            <Repeat className="w-4 h-4 text-muted" />
            <span>Switch to Member View</span>
          </button>

          <Link
            to="/alumni"
            className="flex items-center gap-2 px-2.5 py-2 text-muted hover:text-accent hover:bg-surface-hover rounded-sm transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-muted" />
            <span>Public Directory</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area (Offset by 240px on md+) */}
      <div className="flex-1 md:pl-60 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-14 bg-bg/95 backdrop-blur-md border-b border-border px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Left: Mobile trigger & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-sm bg-surface border border-border text-text"
              aria-label="Open sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted">Admin</span>
              <ChevronRight className="w-3 h-3 text-muted" />
              <span className="font-semibold text-text capitalize">
                {currentSubPage.replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Right: Command Palette, Notifications & User */}
          <div className="flex items-center gap-3">
            <CommandPalette />

            <button
              className="p-2 rounded-sm text-muted hover:text-text hover:bg-surface transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <Avatar src={user?.avatarUrl} name={user?.name || 'Admin'} size="sm" />
              <div className="hidden sm:block text-left text-xs">
                <span className="font-semibold text-text block leading-none">{user?.name}</span>
                <span className="text-[10px] font-mono uppercase text-status-pending leading-none mt-0.5">
                  Leadership
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Admin Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-admin w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <RoleSwitcherModal />
    </div>
  );
};
