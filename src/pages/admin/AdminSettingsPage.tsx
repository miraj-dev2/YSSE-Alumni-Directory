import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { Save, Bell, User, LogOut } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { user, updateUserAccount, logout } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [name, setName] = useState(user?.name || 'Administrator');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = async () => {
    navigate('/', { replace: true });
    await logout();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (name.trim() && name !== user?.name) {
        await updateUserAccount({ name: name.trim() });
      }
      localStorage.setItem('ysse_admin_notify_prefs', JSON.stringify({ emailNotifications }));
      success('Settings Updated', 'Profile name and notification preferences saved.');
    } catch {
      error('Save Failed', 'Could not update settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <AdminPageHeader
        title="Settings"
        subtitle="Manage your administrator profile details and notification preferences."
        showPeriodFilter={false}
      />

      <form onSubmit={handleSave} className="bg-[#1F3027] border border-[#2E4336] rounded-[22px] p-6 space-y-6 shadow-sm">
        <div className="space-y-4 pb-4 border-b border-[#2E4336]">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#B7FF72]">
            <User className="w-4 h-4 text-[#B7FF72]" />
            <span>Administrator Profile</span>
          </div>
          <div>
            <label htmlFor="admin-name" className="block text-xs font-medium text-[#EEF3E8] mb-1">
              Display Name
            </label>
            <input
              id="admin-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-[44px] bg-[#18251D] border border-[#2E4336] rounded-full px-4 text-xs text-[#EEF3E8] focus:outline-none focus:border-[#B7FF72]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#9DB0A2] mb-1">
              Email Address
            </label>
            <p className="text-xs font-mono text-[#EEF3E8] bg-[#18251D] px-4 py-2.5 rounded-full border border-[#2E4336]">
              {user?.email || 'admin@ysseglobal.org'}
            </p>
          </div>
        </div>

        <div className="space-y-4 pb-4 border-b border-[#2E4336]">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#B7FF72]">
            <Bell className="w-4 h-4 text-[#B7FF72]" />
            <span>Notifications</span>
          </div>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-[#EEF3E8]">Email alerts for pending approvals</p>
              <p className="text-[11px] text-[#9DB0A2]">Receive notifications when fellows register or request sessions.</p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="rounded bg-[#18251D] border-[#2E4336] text-[#B7FF72] h-4 w-4 ml-4"
            />
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="h-[44px] px-6 rounded-full bg-[#B7FF72] text-[#18251D] text-xs font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>

      <div className="bg-[#1F3027] border border-[#2E4336] rounded-[22px] p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#E8A598]">
          <LogOut className="w-4 h-4 text-[#E8A598]" />
          <span>Account Session</span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#EEF3E8]">Sign Out of Admin Portal</p>
            <p className="text-[11px] text-[#9DB0A2]">
              Securely terminate your administrative session and return to the main portal.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="h-[42px] px-5 rounded-full bg-[#382121] border border-[#E8A598]/40 hover:border-[#E8A598] hover:bg-[#482828] text-[#E8A598] text-xs font-bold flex items-center gap-2 transition-colors shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
