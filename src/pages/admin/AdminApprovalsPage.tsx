import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useApprovals } from '../../hooks/useApprovals';
import { useToast } from '../../context/ToastContext';
import { AlumniProfile } from '../../types/admin';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { ApprovalsTabs } from '../../components/admin/ApprovalsTabs';
import { ApprovalsBulkBar } from '../../components/admin/ApprovalsBulkBar';
import { ApprovalsTable } from '../../components/admin/ApprovalsTable';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ReasonDialog } from '../../components/common/ReasonDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { TableRowSkeleton, ErrorState } from '../../components/common/SkeletonLoader';

interface OutletContextType { onOpenMobileMenu: () => void; refreshPendingCount?: () => void; }

export const AdminApprovalsPage: React.FC = () => {
  const { onOpenMobileMenu, refreshPendingCount } = useOutletContext<OutletContextType>();
  const {
    activeTab, setActiveTab, items, selectedIds, isLoading, isSubmitting, error,
    toggleSelect, toggleSelectAll, approveSingle, rejectSingle, approveBulk, rejectBulk, retry,
  } = useApprovals('PENDING');

  const { success, error: toastError } = useToast();
  const [confirmApproveId, setConfirmApproveId] = useState<string | null>(null);
  const [rejectItem, setRejectItem] = useState<AlumniProfile | null>(null);
  const [isBulkApproveOpen, setIsBulkApproveOpen] = useState(false);
  const [isBulkRejectOpen, setIsBulkRejectOpen] = useState(false);

  const handleApproveConfirm = async () => {
    if (!confirmApproveId) return;
    const ok = await approveSingle(confirmApproveId);
    setConfirmApproveId(null);
    if (ok) { success('Submission Approved', 'Profile published.'); refreshPendingCount?.(); }
    else toastError('Approval Failed', 'Rolled back changes.');
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectItem) return;
    const ok = await rejectSingle(rejectItem.id, reason);
    setRejectItem(null);
    if (ok) { success('Submission Rejected', 'Marked rejected.'); refreshPendingCount?.(); }
    else toastError('Rejection Failed', 'Rolled back changes.');
  };

  const handleBulkApprove = async () => {
    setIsBulkApproveOpen(false);
    const ok = await approveBulk();
    if (ok) { success('Bulk Approved', 'Selected applicants approved.'); refreshPendingCount?.(); }
    else toastError('Bulk Action Failed', 'Could not complete approval.');
  };

  const handleBulkReject = async (reason: string) => {
    setIsBulkRejectOpen(false);
    const ok = await rejectBulk(reason);
    if (ok) { success('Bulk Rejected', 'Selected profiles rejected.'); refreshPendingCount?.(); }
    else toastError('Bulk Action Failed', 'Could not complete rejection.');
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Member Submissions & Approvals"
        subtitle="Verify tenure and batch authenticity for incoming alumni records"
        onOpenMobileMenu={onOpenMobileMenu}
      />

      <ApprovalsTabs activeTab={activeTab} onChangeTab={setActiveTab} counts={{ [activeTab]: items.length }} />

      <ApprovalsBulkBar
        selectedCount={selectedIds.size}
        onApproveAll={() => setIsBulkApproveOpen(true)}
        onRejectAll={() => setIsBulkRejectOpen(true)}
        onClearSelection={() => toggleSelectAll()}
        isSubmitting={isSubmitting}
      />

      {isLoading ? (
        <div className="space-y-2"><TableRowSkeleton /><TableRowSkeleton /><TableRowSkeleton /></div>
      ) : error ? (
        <ErrorState title="Error Loading Approvals" message={error} onRetry={retry} />
      ) : items.length === 0 ? (
        <EmptyState title={`No ${activeTab.toLowerCase()} profiles found`} description="No submissions in this category." />
      ) : (
        <ApprovalsTable
          items={items}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onApproveSingle={(id) => setConfirmApproveId(id)}
          onRejectSingle={(item) => setRejectItem(item)}
          isSubmitting={isSubmitting}
        />
      )}

      <ConfirmDialog
        isOpen={!!confirmApproveId}
        onClose={() => setConfirmApproveId(null)}
        onConfirm={handleApproveConfirm}
        title="Confirm Approval"
        description="Are you sure you want to approve this applicant? They will be visible in the directory."
        confirmText="Approve"
        isSubmitting={isSubmitting}
      />

      <ConfirmDialog
        isOpen={isBulkApproveOpen}
        onClose={() => setIsBulkApproveOpen(false)}
        onConfirm={handleBulkApprove}
        title="Bulk Approve Submissions"
        description={`Approve all ${selectedIds.size} selected profiles?`}
        confirmText="Approve All Selected"
        isSubmitting={isSubmitting}
      />

      <ReasonDialog
        isOpen={!!rejectItem}
        onClose={() => setRejectItem(null)}
        onSubmit={handleRejectConfirm}
        title="Provide Rejection Reason"
        description="Explain why this profile cannot be verified."
        isSubmitting={isSubmitting}
      />

      <ReasonDialog
        isOpen={isBulkRejectOpen}
        onClose={() => setIsBulkRejectOpen(false)}
        onSubmit={handleBulkReject}
        title={`Bulk Reject ${selectedIds.size} Profiles`}
        description="Provide a uniform reason for rejecting selected records."
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
