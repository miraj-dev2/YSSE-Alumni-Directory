import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from './Modal';
import { Shield, User as UserIcon, GraduationCap, LogOut, Check } from 'lucide-react';
import { UserRole } from '../../types';

export const RoleSwitcherModal: React.FC = () => {
  const { isRoleSelectorOpen, setIsRoleSelectorOpen, role, loginAs, logout } = useAuth();
  const { success } = useToast();

  const handleSelectRole = async (targetRole: UserRole) => {
    if (targetRole === 'visitor') {
      await logout();
      success('Signed Out', 'You are now browsing as a public visitor');
    } else {
      await loginAs(targetRole);
      success(
        `Switched Role: ${targetRole.toUpperCase()}`,
        targetRole === 'admin'
          ? 'Leadership portal access enabled'
          : targetRole === 'alumni'
          ? 'Alumni privileges active (manage profile at /me, offer sessions)'
          : 'Member privileges active (browse contacts, book sessions)'
      );
    }
  };

  return (
    <Modal
      isOpen={isRoleSelectorOpen}
      onClose={() => setIsRoleSelectorOpen(false)}
      title="Sign In Simulation"
      description="Choose a role to test visitor, member, alumni, and admin permission flows."
      maxWidth="md"
    >
      <div className="space-y-2.5">
        {/* Alumni Option */}
        <button
          onClick={() => handleSelectRole('alumni')}
          className={`w-full flex items-center justify-between p-3.5 rounded-md border text-left transition-colors ${
            role === 'alumni'
              ? 'bg-surface-active border-accent text-text'
              : 'bg-surface border-border hover:bg-surface-hover text-text'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-surface-active border border-border-strong flex items-center justify-center text-accent">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Alumni Account</span>
                <span className="chip bg-accent/15 text-accent border-accent/25 text-[10px]">Alumnus</span>
              </div>
              <p className="text-xs text-muted mt-0.5">
                Abrar Zahin (Batch 2024) — Edit AlumniProfile at /me, offer sessions, view contacts.
              </p>
            </div>
          </div>
          {role === 'alumni' && <Check className="w-4 h-4 text-accent shrink-0 ml-2" />}
        </button>

        {/* Member Option */}
        <button
          onClick={() => handleSelectRole('member')}
          className={`w-full flex items-center justify-between p-3.5 rounded-md border text-left transition-colors ${
            role === 'member'
              ? 'bg-surface-active border-accent text-text'
              : 'bg-surface border-border hover:bg-surface-hover text-text'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-surface-active border border-border-strong flex items-center justify-center text-text">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Current Member / Intern</span>
                <span className="chip bg-surface text-muted border-border text-[10px]">Member</span>
              </div>
              <p className="text-xs text-muted mt-0.5">
                Tanima Rahman — Has Account page, requests 1:1 sessions, no alumni profile.
              </p>
            </div>
          </div>
          {role === 'member' && <Check className="w-4 h-4 text-accent shrink-0 ml-2" />}
        </button>

        {/* Admin Option */}
        <button
          onClick={() => handleSelectRole('admin')}
          className={`w-full flex items-center justify-between p-3.5 rounded-md border text-left transition-colors ${
            role === 'admin'
              ? 'bg-surface-active border-accent text-text'
              : 'bg-surface border-border hover:bg-surface-hover text-text'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-surface-active border border-border-strong flex items-center justify-center text-status-pending">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Admin Leadership</span>
                <span className="chip bg-status-pending-bg text-status-pending border-status-pending/30 text-[10px]">Admin</span>
              </div>
              <p className="text-xs text-muted mt-0.5">
                Rashidul Alam — Full access to /admin dashboard, approvals, CSV import, and settings.
              </p>
            </div>
          </div>
          {role === 'admin' && <Check className="w-4 h-4 text-accent shrink-0 ml-2" />}
        </button>

        {/* Visitor Option */}
        <button
          onClick={() => handleSelectRole('visitor')}
          className={`w-full flex items-center justify-between p-3.5 rounded-md border text-left transition-colors ${
            role === 'visitor'
              ? 'bg-surface-active border-border-strong text-text'
              : 'bg-surface border-border hover:bg-surface-hover text-muted'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-surface-active border border-border flex items-center justify-center text-muted">
              <LogOut className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-sm">Visitor (Logged Out)</span>
              <p className="text-xs text-muted mt-0.5">
                Public directory search with gated contact details.
              </p>
            </div>
          </div>
          {role === 'visitor' && <Check className="w-4 h-4 text-muted shrink-0 ml-2" />}
        </button>
      </div>

      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs text-muted">
        <span>Mock OAuth Provider</span>
        <button
          onClick={() => setIsRoleSelectorOpen(false)}
          className="text-text hover:text-accent font-medium underline"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};
