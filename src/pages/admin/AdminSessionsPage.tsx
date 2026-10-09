import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { SessionRequest, SessionRequestStatus } from '../../types';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Avatar } from '../../components/shared/Avatar';
import { Drawer } from '../../components/shared/Drawer';
import {
  CalendarCheck2,
  Clock,
  Mail,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  Check,
} from 'lucide-react';

export const AdminSessionsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const [statusTab, setStatusTab] = useState<'All' | SessionRequestStatus>('All');
  const [selectedRequest, setSelectedRequest] = useState<SessionRequest | null>(null);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['adminSessionRequests'],
    queryFn: () => adminService.getSessionRequests(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: SessionRequestStatus }) =>
      adminService.updateSessionStatus(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['adminSessionRequests'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['mySessionRequests'] });
      success('Status Updated', `Request marked as ${updated.status}.`);
      if (selectedRequest && selectedRequest.id === updated.id) {
        setSelectedRequest(updated);
      }
    },
    onError: () => error('Update failed', 'Could not change session request status.'),
  });

  const filteredRequests = requests.filter(
    (r) => statusTab === 'All' || r.status === statusTab
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-text">
          Session Requests Directory
        </h1>
        <p className="text-xs text-muted mt-0.5">
          Review community mentorship bookings, inspect message threads, and update statuses.
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-px text-xs font-mono">
        {(['All', 'Pending', 'Accepted', 'Done', 'Declined'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusTab(tab)}
            className={`pb-2 px-3 font-semibold border-b-2 transition-colors ${
              statusTab === tab
                ? 'border-accent text-accent'
                : 'border-transparent text-muted hover:text-text'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-hover text-muted font-mono uppercase text-[11px] border-b border-border">
              <tr>
                <th className="py-2.5 px-3">Requester</th>
                <th className="py-2.5 px-3">Alumnus Mentor</th>
                <th className="py-2.5 px-3">Topic</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="py-4 px-3 h-10 bg-surface-hover/20" />
                  </tr>
                ))
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-surface-hover/50 transition-colors">
                    {/* Requester */}
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-text block leading-tight">
                        {req.requesterName}
                      </span>
                      <span className="text-[11px] text-muted font-mono">{req.requesterEmail}</span>
                    </td>

                    {/* Alumnus */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <Avatar src={req.alumniPhoto} name={req.alumniName || 'A'} size="sm" className="!rounded-md" />
                        <div>
                          <span className="font-medium text-text block leading-tight">{req.alumniName}</span>
                          <span className="text-[11px] text-muted">{req.alumniRole} ({req.alumniOrg})</span>
                        </div>
                      </div>
                    </td>

                    {/* Topic */}
                    <td className="py-2.5 px-3 max-w-xs">
                      <span className="font-medium text-accent block truncate">{req.topic}</span>
                    </td>

                    {/* Date */}
                    <td className="py-2.5 px-3 font-mono text-[11px] text-muted whitespace-nowrap">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3">
                      <StatusBadge status={req.status} />
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="btn-secondary !min-h-[30px] h-[30px] text-xs px-2.5 gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Thread</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted">
                    No session requests in this tab.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row Drawer with message thread and status control */}
      {selectedRequest && (
        <Drawer
          isOpen={Boolean(selectedRequest)}
          onClose={() => setSelectedRequest(null)}
          title="Session Request Details"
          description={`ID: ${selectedRequest.id} • Submitted on ${new Date(selectedRequest.createdAt).toLocaleString()}`}
        >
          <div className="space-y-6 text-xs text-text">
            {/* Header info card */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-surface-hover rounded-md border border-border">
              <div>
                <span className="text-[10px] font-mono uppercase text-muted block mb-0.5">Requester</span>
                <span className="font-semibold text-text block">{selectedRequest.requesterName}</span>
                <span className="font-mono text-muted">{selectedRequest.requesterEmail}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-muted block mb-0.5">Mentor Alumnus</span>
                <span className="font-semibold text-text block">{selectedRequest.alumniName}</span>
                <span className="text-muted">{selectedRequest.alumniRole} ({selectedRequest.alumniOrg})</span>
              </div>
            </div>

            {/* Topic & Thread Message */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-muted tracking-wider block">
                Mentorship Topic & Inquiry
              </span>
              <p className="font-semibold text-sm text-accent">{selectedRequest.topic}</p>
              <div className="p-3.5 bg-surface-hover/80 rounded-md border border-border text-muted leading-relaxed whitespace-pre-wrap">
                "{selectedRequest.message}"
              </div>
            </div>

            {/* Current Lifecycle Status */}
            <div className="p-3.5 bg-surface-hover rounded-md border border-border flex items-center justify-between">
              <span className="text-xs font-semibold text-text">Current Lifecycle Status:</span>
              <StatusBadge status={selectedRequest.status} size="md" />
            </div>

            {/* Status Controls */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono uppercase text-muted tracking-wider block">
                Admin Lifecycle Override
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => updateStatusMutation.mutate({ id: selectedRequest.id, status: 'Pending' })}
                  disabled={selectedRequest.status === 'Pending'}
                  className="btn-secondary !min-h-[34px] h-[34px] text-xs"
                >
                  Pending
                </button>
                <button
                  onClick={() => updateStatusMutation.mutate({ id: selectedRequest.id, status: 'Accepted' })}
                  disabled={selectedRequest.status === 'Accepted'}
                  className="btn-primary !min-h-[34px] h-[34px] text-xs"
                >
                  Accepted
                </button>
                <button
                  onClick={() => updateStatusMutation.mutate({ id: selectedRequest.id, status: 'Done' })}
                  disabled={selectedRequest.status === 'Done'}
                  className="btn-secondary !min-h-[34px] h-[34px] text-xs text-status-approved border-status-approved/40"
                >
                  Mark Done
                </button>
                <button
                  onClick={() => updateStatusMutation.mutate({ id: selectedRequest.id, status: 'Declined' })}
                  disabled={selectedRequest.status === 'Declined'}
                  className="btn-danger !min-h-[34px] h-[34px] text-xs"
                >
                  Declined
                </button>
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
