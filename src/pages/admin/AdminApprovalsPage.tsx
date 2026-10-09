import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { AlumniProfile } from '../../types';
import { Avatar } from '../../components/shared/Avatar';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Drawer } from '../../components/shared/Drawer';
import { Modal } from '../../components/shared/Modal';
import { EmptyState } from '../../components/shared/EmptyState';
import { Timeline } from '../../components/shared/Timeline';
import {
  CheckCircle,
  XCircle,
  Eye,
  Check,
  AlertTriangle,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react';

export const AdminApprovalsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [selectedAlumnus, setSelectedAlumnus] = useState<AlumniProfile | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: list = [], isLoading } = useQuery({
    queryKey: ['adminApprovals', activeTab],
    queryFn: () => adminService.getApprovals(activeTab),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminService.approveAlumnus(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['adminApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['alumni'] });
      success('Profile Approved', `${updated.name} has been published to the directory.`);
      setSelectedAlumnus(null);
    },
    onError: () => error('Action failed', 'Could not approve alumnus.'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminService.rejectAlumnus(id, reason),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['adminApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
      success('Profile Rejected', `${updated.name}'s profile status was set to Rejected.`);
      setRejectingId(null);
      setRejectionReason('');
      setSelectedAlumnus(null);
    },
    onError: () => error('Action failed', 'Could not reject alumnus.'),
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(list.map((a) => a.id));
    else setSelectedIds([]);
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter((i) => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const handleBulkApprove = async () => {
    for (const id of selectedIds) {
      await adminService.approveAlumnus(id);
    }
    queryClient.invalidateQueries({ queryKey: ['adminApprovals'] });
    queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
    success('Bulk Approved', `Approved ${selectedIds.length} profiles.`);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text">
            Alumni Approvals Queue
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Verify new member profiles and modified sensitive records before publishing.
          </p>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkApprove}
              className="btn-primary !min-h-[36px] h-[36px] text-xs px-3.5 gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Bulk Approve ({selectedIds.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-px text-xs font-mono">
        <button
          onClick={() => {
            setActiveTab('Pending');
            setSelectedIds([]);
          }}
          className={`pb-2 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'Pending'
              ? 'border-status-pending text-status-pending'
              : 'border-transparent text-muted hover:text-text'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => {
            setActiveTab('Approved');
            setSelectedIds([]);
          }}
          className={`pb-2 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'Approved'
              ? 'border-status-approved text-status-approved'
              : 'border-transparent text-muted hover:text-text'
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => {
            setActiveTab('Rejected');
            setSelectedIds([]);
          }}
          className={`pb-2 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'Rejected'
              ? 'border-status-rejected text-status-rejected'
              : 'border-transparent text-muted hover:text-text'
          }`}
        >
          Rejected
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-hover text-muted font-mono uppercase text-[11px] border-b border-border">
              <tr>
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={list.length > 0 && selectedIds.length === list.length}
                    onChange={handleSelectAll}
                    className="accent-[#B7FF72] rounded cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3">Applicant</th>
                <th className="py-3 px-3">Cohort</th>
                <th className="py-3 px-3">Designation & Org</th>
                <th className="py-3 px-3">Submitted</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="py-4 px-3 h-10 bg-surface-hover/30" />
                  </tr>
                ))
              ) : list.length > 0 ? (
                list.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleToggleSelect(item.id)}
                        className="accent-[#B7FF72] rounded cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={item.photoUrl} name={item.name} size="sm" className="!rounded-md" />
                        <div>
                          <span className="font-semibold text-text block">{item.name}</span>
                          <span className="text-[11px] text-muted font-mono">{item.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="chip bg-surface-hover text-accent text-[10px] mb-0.5 block w-fit">
                        {item.batch}
                      </span>
                      <span className="text-[11px] text-muted block">{item.wing}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-text block">{item.role}</span>
                      <span className="text-muted block">{item.organization}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-muted">
                      {item.createdAt}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={item.approvalStatus} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedAlumnus(item)}
                          className="p-1.5 rounded-sm bg-surface-hover text-muted hover:text-text hover:bg-border transition-colors"
                          title="Inspect profile & diff"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {item.approvalStatus === 'Pending' && (
                          <>
                            <button
                              onClick={() => approveMutation.mutate(item.id)}
                              className="p-1.5 rounded-sm bg-status-approved-bg text-status-approved hover:bg-status-approved/20 transition-colors"
                              title="Approve"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setRejectingId(item.id)}
                              className="p-1.5 rounded-sm bg-status-rejected-bg text-status-rejected hover:bg-status-rejected/20 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted">
                    No records in the {activeTab.toLowerCase()} queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer: Detailed Profile & Diff Inspection */}
      {selectedAlumnus && (
        <Drawer
          isOpen={Boolean(selectedAlumnus)}
          onClose={() => setSelectedAlumnus(null)}
          title={`Verification Review: ${selectedAlumnus.name}`}
          description={`Submitted on ${selectedAlumnus.createdAt} • ID: ${selectedAlumnus.id}`}
        >
          <div className="space-y-6 text-xs text-text">
            {/* Header Identity Card */}
            <div className="flex items-start gap-4 p-4 bg-surface-hover rounded-md border border-border">
              <Avatar src={selectedAlumnus.photoUrl} name={selectedAlumnus.name} size="xl" className="!rounded-md" />
              <div className="space-y-1">
                <span className="text-base font-bold font-heading text-text block">
                  {selectedAlumnus.name}
                </span>
                <p className="text-muted">
                  {selectedAlumnus.role} at <strong className="text-text">{selectedAlumnus.organization}</strong>
                </p>
                <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-muted">
                  <span>{selectedAlumnus.batch}</span>
                  <span>•</span>
                  <span>{selectedAlumnus.wing}</span>
                </div>
              </div>
            </div>

            {/* Field Diff Section */}
            <div>
              <span className="font-mono uppercase text-[10px] text-muted tracking-wider block mb-2">
                Field Verification Checks
              </span>
              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-2.5 bg-surface-hover/70 rounded border border-border flex justify-between">
                  <span className="text-muted">Affiliated Wing:</span>
                  <span className="text-accent">{selectedAlumnus.wing}</span>
                </div>
                <div className="p-2.5 bg-surface-hover/70 rounded border border-border flex justify-between">
                  <span className="text-muted">Email Record:</span>
                  <span className="text-text">{selectedAlumnus.email}</span>
                </div>
                <div className="p-2.5 bg-surface-hover/70 rounded border border-border flex justify-between">
                  <span className="text-muted">Location:</span>
                  <span>{[selectedAlumnus.city, selectedAlumnus.country].filter(Boolean).join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <span className="font-mono uppercase text-[10px] text-muted tracking-wider block mb-1">
                Candidate Bio Statement
              </span>
              <p className="p-3 bg-surface-hover rounded-md border border-border text-muted leading-relaxed">
                {selectedAlumnus.bio}
              </p>
            </div>

            {/* Timeline */}
            <div>
              <span className="font-mono uppercase text-[10px] text-muted tracking-wider block mb-2">
                Reported Career Trajectory
              </span>
              <Timeline entries={selectedAlumnus.career} />
            </div>

            {/* Drawer Bottom Actions */}
            {selectedAlumnus.approvalStatus === 'Pending' && (
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  onClick={() => setRejectingId(selectedAlumnus.id)}
                  className="btn-danger !min-h-[38px] h-[38px] text-xs px-4"
                >
                  Reject Application
                </button>
                <button
                  onClick={() => approveMutation.mutate(selectedAlumnus.id)}
                  className="btn-primary !min-h-[38px] h-[38px] text-xs px-5 gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve Profile</span>
                </button>
              </div>
            )}
          </div>
        </Drawer>
      )}

      {/* Reject Reason Modal */}
      {rejectingId && (
        <Modal
          isOpen={Boolean(rejectingId)}
          onClose={() => setRejectingId(null)}
          title="Reject Alumni Application"
          description="Provide a concrete reason for rejection. This will be visible to the alumnus so they can rectify and resubmit."
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="rejection-reason-textarea" className="block text-xs font-semibold text-text mb-1.5">
                Rejection Reason <span className="text-status-rejected">*</span>
              </label>
              <textarea
                id="rejection-reason-textarea"
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Could not confirm YSSE internship record for Batch 2021; please provide proof of certificate."
                className="input-base text-xs h-auto resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectingId(null)}
                className="btn-secondary !min-h-[38px] h-[38px] text-xs px-3"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!rejectionReason.trim()}
                onClick={() =>
                  rejectMutation.mutate({ id: rejectingId, reason: rejectionReason })
                }
                className="btn-danger !min-h-[38px] h-[38px] text-xs px-4"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
