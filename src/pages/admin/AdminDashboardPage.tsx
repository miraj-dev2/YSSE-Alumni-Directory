import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { UserCheck, RefreshCw } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { useToast } from '../../context/ToastContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { DashboardTiles } from '../../components/admin/DashboardTiles';
import { DashboardCharts } from '../../components/admin/DashboardCharts';
import { DashboardNeedsReview } from '../../components/admin/DashboardNeedsReview';
import { DashboardRecentSessions } from '../../components/admin/DashboardRecentSessions';
import { CardSkeleton, TileSkeleton, ErrorState } from '../../components/common/SkeletonLoader';

interface OutletContextType {
  onOpenMobileMenu: () => void;
  refreshPendingCount?: () => void;
}

export const AdminDashboardPage: React.FC = () => {
  const { onOpenMobileMenu, refreshPendingCount } = useOutletContext<OutletContextType>();
  const {
    stats,
    batchData,
    wingData,
    needsReview,
    recentSessions,
    isLoading,
    error,
    actionInProgressId,
    retry,
    approveAlumnus,
    rejectAlumnus,
  } = useDashboard();
  const { success, error: toastError } = useToast();

  const handleApprove = async (id: string) => {
    const ok = await approveAlumnus(id);
    if (ok) {
      success('Alumnus Approved', 'Profile is now published to the public directory.');
      refreshPendingCount?.();
    } else {
      toastError('Approval Failed', 'Unable to update status. Please try again.');
    }
    return ok;
  };

  const handleReject = async (id: string, reason: string) => {
    const ok = await rejectAlumnus(id, reason);
    if (ok) {
      success('Alumnus Rejected', 'Submission updated with secretariat notes.');
      refreshPendingCount?.();
    } else {
      toastError('Rejection Failed', 'Unable to record rejection.');
    }
    return ok;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AdminHeader
          title="Executive Dashboard"
          subtitle="Real-time status overview of YSSE alumni community"
          onOpenMobileMenu={onOpenMobileMenu}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TileSkeleton /><TileSkeleton /><TileSkeleton /><TileSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CardSkeleton /><CardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <AdminHeader
          title="Executive Dashboard"
          subtitle="Real-time status overview of YSSE alumni community"
          onOpenMobileMenu={onOpenMobileMenu}
        />
        <ErrorState
          title="Unable to load dashboard data"
          message={error || 'An unexpected error occurred while fetching metrics.'}
          onRetry={retry}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Executive Dashboard"
        subtitle="Real-time status overview of YSSE alumni community"
        onOpenMobileMenu={onOpenMobileMenu}
        primaryAction={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={retry}
              className="p-2 text-[#9DB0A2] hover:text-[#EEF3E8] bg-[#1F3027] border border-[#2E4336] rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Refresh dashboard metrics"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              to="/admin/approvals"
              className="min-h-[44px] px-4 rounded bg-[#B7FF72] text-[#18251D] text-xs font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <UserCheck className="w-4 h-4" />
              <span>Review Submissions ({stats.pendingApprovals})</span>
            </Link>
          </div>
        }
      />

      <DashboardTiles stats={stats} />

      <DashboardCharts batchData={batchData} wingData={wingData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashboardNeedsReview
          items={needsReview}
          onApprove={handleApprove}
          onReject={handleReject}
          actionInProgressId={actionInProgressId}
        />
        <DashboardRecentSessions sessions={recentSessions} />
      </div>
    </div>
  );
};
