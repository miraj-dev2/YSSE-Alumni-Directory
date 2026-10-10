import React from 'react';
import { useAdminSessions } from '../../hooks/useAdminSessions';
import { useToast } from '../../context/ToastContext';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { SessionRequestsList } from '../../components/admin/SessionRequestsList';
import { EmptyState } from '../../components/common/EmptyState';
import { CardSkeleton, ErrorState } from '../../components/common/SkeletonLoader';

export const AdminSessionsPage: React.FC = () => {
  const {
    sessions, statusFilter, setStatusFilter, isLoading, isSubmitting, error,
    acceptSession, markDone, retry,
  } = useAdminSessions();

  const { success, error: toastError } = useToast();

  const handleAccept = async (id: string) => {
    const ok = await acceptSession(id);
    if (ok) success('Session Accepted', 'Mentor and requester notified.');
    else toastError('Action Failed', 'Could not update status.');
  };

  const handleMarkDone = async (id: string) => {
    const ok = await markDone(id);
    if (ok) success('Session Completed', 'Marked completed.');
    else toastError('Action Failed', 'Could not update status.');
  };

  const FILTERS = ['all', 'PENDING', 'ACCEPTED', 'DONE'] as const;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Session Requests"
        subtitle="Manage and coordinate 1:1 guidance calls requested by YSSE members."
        showPeriodFilter={false}
      />

      <div className="bg-[#1F3027] border border-[#2E4336] rounded-[22px] p-6 space-y-5">
        <div className="flex items-center gap-2 border-b border-[#2E4336] pb-3 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setStatusFilter(f)}
              className={`h-[38px] px-4 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === f
                  ? 'bg-[#B7FF72] text-[#18251D] font-bold'
                  : 'bg-[#18251D] text-[#9DB0A2] border border-[#2E4336] hover:text-[#EEF3E8]'
              }`}
            >
              {f === 'all' ? 'All Sessions' : f}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3"><CardSkeleton /><CardSkeleton /></div>
        ) : error ? (
          <ErrorState title="Error Loading Sessions" message={error} onRetry={retry} />
        ) : sessions.length === 0 ? (
          <EmptyState
            title="No session requests found"
            description="There are currently no session requests matching the selected filter."
          />
        ) : (
          <SessionRequestsList
            items={sessions}
            onAccept={handleAccept}
            onMarkDone={handleMarkDone}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};
