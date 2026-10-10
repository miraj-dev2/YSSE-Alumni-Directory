import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Avatar } from '../../components/shared/Avatar';
import { Send } from 'lucide-react';

export const AdminStaleProfilesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: staleList = [], isLoading } = useQuery({
    queryKey: ['staleProfilesList'],
    queryFn: () => adminService.getStaleProfiles(),
  });

  const sendReminderMutation = useMutation({
    mutationFn: (ids: string[]) => adminService.sendReminder(ids),
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
      success('Reminders Dispatched', `Automated refresh emails sent to ${count} alumni.`);
      setSelectedIds([]);
    },
    onError: () => error('Action failed', 'Could not send reminders.'),
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIds(e.target.checked ? staleList.map((a) => a.id) : []);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleSendReminder = (id?: string) => {
    const targets = id ? [id] : selectedIds;
    if (targets.length > 0) sendReminderMutation.mutate(targets);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text">Stale Alumni Profiles</h1>
          <p className="text-xs text-muted mt-0.5">Profiles unedited for over 6 months.</p>
        </div>
        {selectedIds.length > 0 && (
          <button
            onClick={() => handleSendReminder()}
            disabled={sendReminderMutation.isPending}
            className="btn-primary !min-h-[36px] h-[36px] text-xs px-3.5 gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> <span>Send Reminder ({selectedIds.length})</span>
          </button>
        )}
      </div>

      <div className="bg-surface border border-border rounded-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-hover text-muted font-mono uppercase text-[11px] border-b border-border">
              <tr>
                <th className="py-2.5 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={staleList.length > 0 && selectedIds.length === staleList.length}
                    onChange={handleSelectAll}
                    className="accent-[#B7FF72] rounded cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-3">Alumnus</th>
                <th className="py-2.5 px-3">Batch & Wing</th>
                <th className="py-2.5 px-3">Last Updated</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="py-4 px-3 h-10 bg-surface-hover/20" />
                  </tr>
                ))
              ) : staleList.length > 0 ? (
                staleList.map((alumnus) => (
                  <tr key={alumnus.id} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="py-2.5 px-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(alumnus.id)}
                        onChange={() => handleToggleSelect(alumnus.id)}
                        className="accent-[#B7FF72] rounded cursor-pointer"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={alumnus.photoUrl} name={alumnus.name} size="sm" className="!rounded-md" />
                        <div>
                          <span className="font-semibold text-text block leading-tight">{alumnus.name}</span>
                          <span className="text-[11px] text-muted font-mono">{alumnus.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="chip bg-surface-hover text-accent text-[10px] block w-fit mb-0.5">{alumnus.batch}</span>
                      <span className="text-[11px] text-muted block">{alumnus.wing}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-status-pending">
                      {alumnus.updatedAt}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleSendReminder(alumnus.id)}
                        disabled={sendReminderMutation.isPending}
                        className="btn-secondary !min-h-[30px] h-[30px] text-xs px-2.5 gap-1"
                      >
                        <Send className="w-3 h-3" /> <span>Remind</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted">
                    No stale alumni profiles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
