import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AdminSettings } from '../../services/storage';
import { Avatar } from '../../components/shared/Avatar';
import { Save, User, Shield, Bell, Database, Mail, Plus, RotateCcw } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { user, updateUserAccount } = useAuth();
  const { success, error } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'account' | 'directory' | 'reminders' | 'admins'>('account');

  // Account form
  const [adminName, setAdminName] = useState(user?.name || '');

  // Admin settings form
  const { data: settings } = useQuery({
    queryKey: ['adminSettings'],
    queryFn: () => adminService.getSettings(),
  });

  const [approvalRequired, setApprovalRequired] = useState(settings?.approvalRequired ?? true);
  const [defaultEmailPublic, setDefaultEmailPublic] = useState(settings?.defaultEmailPublic ?? true);
  const [defaultLinkedinPublic, setDefaultLinkedinPublic] = useState(settings?.defaultLinkedinPublic ?? true);
  const [intervalMonths, setIntervalMonths] = useState(settings?.reminderIntervalMonths ?? 6);
  const [emailTemplate, setEmailTemplate] = useState(
    settings?.emailTemplate ||
      'Hi {{name}},\n\nIt has been over 6 months since your YSSE alumni profile was last refreshed. Please take 2 minutes to update your details.\n\nWarm regards,\nYSSE Secretariat'
  );

  // Invite Admin state
  const [inviteEmail, setInviteEmail] = useState('');
  const [adminList, setAdminList] = useState([
    { name: 'Rashidul Alam', email: 'rashidul.alam@ysse.org', role: 'Superadmin' },
    { name: 'Nusrat Jahan', email: 'admin.nusrat@ysse.org', role: 'Secretariat Admin' },
  ]);

  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: Partial<AdminSettings>) => adminService.updateSettings(newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
      success('Settings Saved', 'System policies and reminder intervals updated.');
    },
    onError: () => error('Save Failed', 'Could not save system settings.'),
  });

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserAccount({ name: adminName });
      success('Account Updated', 'Administrator profile information saved.');
    } catch {
      error('Failed to update', 'Please try again.');
    }
  };

  const handleSaveDirectorySettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate({
      approvalRequired,
      defaultEmailPublic,
      defaultLinkedinPublic,
    });
  };

  const handleSaveReminders = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate({
      reminderIntervalMonths: intervalMonths,
      emailTemplate,
    });
  };

  const handleInviteAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setAdminList([...adminList, { name: 'Invited Admin', email: inviteEmail, role: 'Secretariat Admin' }]);
    success('Invitation Sent', `Sent leadership invite link to ${inviteEmail}.`);
    setInviteEmail('');
  };

  const handleResetData = async () => {
    if (window.confirm('Reset all alumni records, session requests, and activity logs back to fresh demo seeds?')) {
      await adminService.resetData();
      success('Seed Data Reset', 'All database records refreshed.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text">
            Console & System Settings
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Configure directory policies, stale reminder intervals, and administrative access.
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="btn-secondary !min-h-[34px] h-[34px] text-xs px-3 gap-1.5 text-muted hover:text-status-rejected hover:border-status-rejected/40"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-px text-xs font-mono">
        <button
          onClick={() => setActiveTab('account')}
          className={`pb-2 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'account' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-text'
          }`}
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab('directory')}
          className={`pb-2 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'directory' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-text'
          }`}
        >
          Directory Policies
        </button>
        <button
          onClick={() => setActiveTab('reminders')}
          className={`pb-2 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'reminders' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-text'
          }`}
        >
          Stale Reminders
        </button>
        <button
          onClick={() => setActiveTab('admins')}
          className={`pb-2 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'admins' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-text'
          }`}
        >
          Administrators
        </button>
      </div>

      {/* Tab 1: Account */}
      {activeTab === 'account' && (
        <form onSubmit={handleSaveAccount} className="bg-surface border border-border rounded-card p-6 space-y-4 max-w-xl text-xs">
          <h2 className="text-sm font-semibold text-text">Administrator Credentials</h2>

          <div className="flex items-center gap-4 py-2">
            <Avatar src={user?.avatarUrl} name={user?.name || 'Admin'} size="lg" className="!rounded-md" />
            <div>
              <span className="font-semibold text-text block">{user?.name}</span>
              <span className="text-muted font-mono">{user?.email}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Full Name</label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="input-base text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Email Address</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="input-base text-xs opacity-60 bg-surface-hover cursor-not-allowed"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="btn-primary !min-h-[36px] h-[36px] text-xs px-4 gap-1.5">
              <Save className="w-3.5 h-3.5" />
              <span>Save Account</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Directory Policies */}
      {activeTab === 'directory' && (
        <form onSubmit={handleSaveDirectorySettings} className="bg-surface border border-border rounded-card p-6 space-y-4 max-w-xl text-xs">
          <h2 className="text-sm font-semibold text-text">Directory Approval & Privacy Rules</h2>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3 bg-surface-hover rounded-md border border-border cursor-pointer select-none">
              <div>
                <span className="font-semibold text-text block">Require Manual Verification</span>
                <span className="text-muted">Hold new profiles and sensitive changes in Pending queue until approved.</span>
              </div>
              <input
                type="checkbox"
                checked={approvalRequired}
                onChange={(e) => setApprovalRequired(e.target.checked)}
                className="w-4 h-4 accent-[#B7FF72] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-surface-hover rounded-md border border-border cursor-pointer select-none">
              <div>
                <span className="font-semibold text-text block">Default Email Public (for Members)</span>
                <span className="text-muted">Automatically check email visibility on newly created profiles.</span>
              </div>
              <input
                type="checkbox"
                checked={defaultEmailPublic}
                onChange={(e) => setDefaultEmailPublic(e.target.checked)}
                className="w-4 h-4 accent-[#B7FF72] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-surface-hover rounded-md border border-border cursor-pointer select-none">
              <div>
                <span className="font-semibold text-text block">Default LinkedIn URL Public</span>
                <span className="text-muted">Automatically check LinkedIn visibility on newly created profiles.</span>
              </div>
              <input
                type="checkbox"
                checked={defaultLinkedinPublic}
                onChange={(e) => setDefaultLinkedinPublic(e.target.checked)}
                className="w-4 h-4 accent-[#B7FF72] rounded"
              />
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="btn-primary !min-h-[36px] h-[36px] text-xs px-4 gap-1.5">
              <Save className="w-3.5 h-3.5" />
              <span>Save Policies</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Stale Reminders */}
      {activeTab === 'reminders' && (
        <form onSubmit={handleSaveReminders} className="bg-surface border border-border rounded-card p-6 space-y-4 max-w-xl text-xs">
          <h2 className="text-sm font-semibold text-text">Profile Refresh Automation</h2>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">
              Stale Profile Threshold (Months)
            </label>
            <input
              type="number"
              min={1}
              max={24}
              value={intervalMonths}
              onChange={(e) => setIntervalMonths(Number(e.target.value))}
              className="input-base text-xs !min-h-[36px] h-[36px] w-32"
            />
            <span className="text-[11px] text-muted mt-1 block">
              Profiles unedited for this duration will appear on the Stale Profiles queue.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">
              Email Reminder Template Preview
            </label>
            <textarea
              rows={6}
              value={emailTemplate}
              onChange={(e) => setEmailTemplate(e.target.value)}
              className="input-base text-xs h-auto py-2 font-mono leading-relaxed resize-none"
            />
            <span className="text-[11px] text-muted mt-1 block">
              Available variables: <code>{"{{name}}"}</code>, <code>{"{{batch}}"}</code>, <code>{"{{wing}}"}</code>
            </span>
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="btn-primary !min-h-[36px] h-[36px] text-xs px-4 gap-1.5">
              <Save className="w-3.5 h-3.5" />
              <span>Save Reminder Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Admins */}
      {activeTab === 'admins' && (
        <div className="space-y-6 max-w-xl text-xs">
          {/* Invite form */}
          <form onSubmit={handleInviteAdmin} className="bg-surface border border-border rounded-card p-4 space-y-3">
            <h2 className="text-sm font-semibold text-text">Invite Administrator</h2>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="admin@ysse.org"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="input-base text-xs !min-h-[36px] h-[36px] flex-1"
                required
              />
              <button type="submit" className="btn-primary !min-h-[36px] h-[36px] text-xs px-3.5 gap-1.5 shrink-0">
                <Plus className="w-3.5 h-3.5" />
                <span>Invite</span>
              </button>
            </div>
          </form>

          {/* Admins List */}
          <div className="bg-surface border border-border rounded-card overflow-hidden">
            <div className="p-3 bg-surface-hover border-b border-border font-mono text-[11px] uppercase text-muted">
              Current Administrators ({adminList.length})
            </div>
            <div className="divide-y divide-border">
              {adminList.map((adm) => (
                <div key={adm.email} className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={adm.name} size="sm" className="!rounded-md" />
                    <div>
                      <span className="font-semibold text-text block">{adm.name}</span>
                      <span className="text-muted font-mono text-[11px]">{adm.email}</span>
                    </div>
                  </div>
                  <span className="chip bg-surface-hover text-status-pending border-status-pending/30 text-[10px]">
                    {adm.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
