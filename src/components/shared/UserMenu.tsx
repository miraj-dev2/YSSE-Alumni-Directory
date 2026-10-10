import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from './Avatar';
import {
  User as UserIcon,
  GraduationCap,
  Shield,
  LogOut,
  Repeat,
  Calendar,
  Layers,
  LogIn,
  UserPlus,
} from 'lucide-react';

export const UserMenu: React.FC = () => {
  const { user, role, logout, loginAs, openAuthModal } = useAuth();
  const navigate = useNavigate();

  if (!user || role === 'visitor') {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => openAuthModal('login')}
          className="btn-secondary !min-h-[38px] sm:!min-h-[44px] h-[38px] sm:h-[44px] text-xs px-2.5 sm:px-3.5 gap-1.5"
          aria-label="Log In"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Log In</span>
        </button>
        <button
          onClick={() => openAuthModal('register')}
          className="btn-primary !min-h-[38px] sm:!min-h-[44px] h-[38px] sm:h-[44px] text-xs px-2.5 sm:px-3.5 gap-1.5"
          aria-label="Register"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Register</span>
        </button>
      </div>
    );
  }

  const handleSwitchToMemberView = async () => {
    await loginAs('member');
    navigate('/alumni');
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex items-center gap-2.5 p-1.5 rounded-md hover:bg-surface-hover border border-border transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Open user menu"
        >
          <Avatar src={user.avatarUrl} name={user.name} size="sm" />
          <div className="hidden sm:flex flex-col pr-1">
            <span className="text-xs font-semibold text-text leading-tight line-clamp-1">
              {user.name}
            </span>
            <span className="text-[10px] font-mono uppercase text-muted leading-tight">
              {role}
            </span>
          </div>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[220px] bg-surface border border-border-strong rounded-md p-1.5 shadow-xl animate-fade-in text-xs text-text focus:outline-none"
        >
          <div className="px-2.5 py-2 border-b border-border mb-1">
            <p className="font-semibold text-text truncate">{user.name}</p>
            <p className="text-[11px] font-mono text-muted truncate">{user.email}</p>
            <span className="chip bg-surface-active text-accent border-border mt-1.5">
              Role: {role.toUpperCase()}
            </span>
          </div>

          <DropdownMenu.Item asChild>
            <Link
              to="/account"
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-sm hover:bg-surface-hover cursor-pointer outline-none transition-colors"
            >
              <UserIcon className="w-4 h-4 text-muted" />
              <span>Account Settings</span>
            </Link>
          </DropdownMenu.Item>

          {role === 'alumni' && (
            <DropdownMenu.Item asChild>
              <Link
                to="/me"
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-sm hover:bg-surface-hover cursor-pointer outline-none transition-colors"
              >
                <GraduationCap className="w-4 h-4 text-accent" />
                <span>My Alumni Profile</span>
              </Link>
            </DropdownMenu.Item>
          )}

          <DropdownMenu.Item asChild>
            <Link
              to="/sessions"
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-sm hover:bg-surface-hover cursor-pointer outline-none transition-colors"
            >
              <Calendar className="w-4 h-4 text-muted" />
              <span>Mentorship Sessions</span>
            </Link>
          </DropdownMenu.Item>

          {role === 'admin' && (
            <>
              <DropdownMenu.Item asChild>
                <Link
                  to="/admin"
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-sm hover:bg-surface-hover text-status-pending cursor-pointer outline-none transition-colors font-medium"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Portal</span>
                </Link>
              </DropdownMenu.Item>

              <DropdownMenu.Item
                onClick={handleSwitchToMemberView}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-sm hover:bg-surface-hover cursor-pointer outline-none transition-colors text-muted"
              >
                <Repeat className="w-4 h-4" />
                <span>Switch to Member View</span>
              </DropdownMenu.Item>
            </>
          )}

          <DropdownMenu.Separator className="h-px bg-border my-1" />

          <DropdownMenu.Item
            onClick={() => openAuthModal('login')}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-sm hover:bg-surface-hover cursor-pointer outline-none transition-colors text-muted"
          >
            <Layers className="w-4 h-4" />
            <span>Switch Role / Account</span>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onClick={logout}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-sm hover:bg-status-rejected-bg text-status-rejected cursor-pointer outline-none transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
