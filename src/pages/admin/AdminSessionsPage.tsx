import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAdminSessions } from '../../hooks/useAdminSessions';
import { useToast } from '../../context/ToastContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { SessionRequestsList } from '../../components/admin/SessionRequestsList';
import { EmptyState } from '../../components/common/EmptyState';
import { CardSkeleton, ErrorState } from '../../components/common/SkeletonLoader';

interface OutletContextType {
  onOpenMobileMenu: () => void;
}

export const AdminSessionsPage: React.FC = () => {
  const { onOpenMobileMenu } = useOutletContext<OutletContextType>();
  const {
    sessions,
    statusFilter,
    setStatusFilter,
    isLoading,
    isSubmitting,
    error,
    acceptSession,
    markDone,
    retry,
  } = useAdminSessions();

  const { success, error: toastError } = useToast();

  const handleAccept = async (id: string) => {
    const ok = await acceptSession(id);
    if (ok) success('Session Accepted', 'Mentor and requester will be notified.');
    else toastError('Action Failed', 'Could not update session status.');
  };

  const handleMarkDone = async (id: string) => {
    const ok = await markDone(id);
    if (ok) success('Session Completed', 'Marked as successfully completed.');
    else toastError('Action Failed', 'Could not update session status.');
  };

  const FILTERS = ['all', 'PENDING', 'ACCEPTED', 'DONE'] as const;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Mentorship Session Bookings"
        subtitle="Manage and coordinate 1:1 guidance calls requested by YSSE members"
        onOpenMobileMenu={onOpenMobileMenu}
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2E4336] pb-3 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setStatusFilter(f)}
            className={`min-h-[44px] px-3.5 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
              statusFilter === f
                ? 'bg-[#B7FF72] text-[#18251D]'
                : 'bg-[#1F3027] text-[#9DB0A2] border border-[#2E4336] hover:text-[#EEF3E8]'
            }`}
          >
            {f === 'all' ? 'All Sessions' : f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
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
  );
};
