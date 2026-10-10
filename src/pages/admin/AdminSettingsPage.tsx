import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AdminSettings } from '../../services/storage';
import { Save, RotateCcw } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { user, updateUserAccount } = useAuth();
  const { success, error } = useToast();
  const queryClient = useQueryClient();
  const [adminName, setAdminName] = useState(user?.name || '');

  const { data: settings } = useQuery({
    queryKey: ['adminSettings'],
    queryFn: () => adminService.getSettings(),
  });

  const [approvalRequired, setApprovalRequired] = useState(settings?.approvalRequired ?? true);
  const [intervalMonths, setIntervalMonths] = useState(settings?.reminderIntervalMonths ?? 6);

  const updateMutation = useMutation({
    mutationFn: (newSettings: Partial<AdminSettings>) => adminService.updateSettings(newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
      success('Settings Saved', 'System configurations updated.');
    },
    onError: () => error('Save Failed', 'Could not save settings.'),
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminName !== user?.name) await updateUserAccount({ name: adminName });
    updateMutation.mutate({ approvalRequired, reminderIntervalMonths: intervalMonths });
  };

  const handleResetData = async () => {
    if (window.confirm('Reset all demo data back to default records?')) {
      await adminService.resetData();
      success('Demo Data Reset', 'Directory refreshed.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2E4336]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#EEF3E8]">System Settings</h1>
          <p className="text-xs text-[#9DB0A2] mt-0.5">Admin preferences and directory moderation policies.</p>
        </div>
        <button
          type="button"
          onClick={handleResetData}
          className="min-h-[44px] px-3.5 rounded bg-[#18251D] border border-[#2E4336] text-[#E8A598] text-xs font-semibold flex items-center gap-2 hover:bg-[#E8A598]/10"
        >
          <RotateCcw className="w-3.5 h-3.5" /> <span>Reset Demo Data</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-[#1F3027] border border-[#2E4336] rounded p-5 space-y-4">
        <div>
          <label className="block text-[11px] font-mono uppercase text-[#9DB0A2] mb-1">Admin Display Name</label>
          <input
            type="text"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            className="w-full bg-[#18251D] border border-[#2E4336] rounded px-3 py-2 text-xs text-[#EEF3E8] min-h-[44px]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase text-[#9DB0A2] mb-1">
            Stale Profile Refresh Interval (Months)
          </label>
          <input
            type="number"
            min={1}
            max={24}
            value={intervalMonths}
            onChange={(e) => setIntervalMonths(Number(e.target.value))}
            className="w-full bg-[#18251D] border border-[#2E4336] rounded px-3 py-2 text-xs text-[#EEF3E8] min-h-[44px]"
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-3 cursor-pointer text-xs text-[#EEF3E8]">
            <input
              type="checkbox"
              checked={approvalRequired}
              onChange={(e) => setApprovalRequired(e.target.checked)}
              className="rounded bg-[#18251D] border-[#2E4336] text-[#B7FF72] h-4 w-4"
            />
            <span>Require Secretariat approval before public directory publication</span>
          </label>
        </div>

        <div className="pt-4 border-t border-[#2E4336] flex justify-end">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="min-h-[44px] px-5 rounded bg-[#B7FF72] text-[#18251D] text-xs font-semibold flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> <span>{updateMutation.isPending ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
