import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ArrowRight } from 'lucide-react';
import { AlumniProfile } from '../../types/admin';
import { ReasonDialog } from '../common/ReasonDialog';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface DashboardNeedsReviewProps {
  items: AlumniProfile[];
  onApprove: (id: string) => Promise<boolean>;
  onReject: (id: string, reason: string) => Promise<boolean>;
  actionInProgressId: string | null;
}

export const DashboardNeedsReview: React.FC<DashboardNeedsReviewProps> = ({
  items,
  onApprove,
  onReject,
  actionInProgressId,
}) => {
  const [confirmApproveId, setConfirmApproveId] = useState<string | null>(null);
  const [rejectingItem, setRejectingItem] = useState<AlumniProfile | null>(null);

  const activeApproveTarget = items.find((i) => i.id === confirmApproveId);

  return (
    <div className="bg-[#1F3027] border border-[#2E4336] rounded p-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#2E4336]">
        <div>
          <h2 className="text-sm font-bold font-heading text-[#EEF3E8]">
            Needs Review
          </h2>
          <p className="text-xs text-[#9DB0A2] mt-0.5">Pending alumni membership submissions</p>
        </div>
        <Link
          to="/admin/approvals"
          className="text-xs text-[#B7FF72] hover:underline flex items-center gap-1 font-medium min-h-[44px] flex items-center"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-[#2E4336] mt-1">
        {items.length === 0 ? (
          <p className="text-xs text-[#9DB0A2] py-6 text-center">No profiles pending review.</p>
        ) : (
          items.map((item) => {
            const isProcessing = actionInProgressId === item.id;
            return (
              <div
                key={item.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-[#EEF3E8] truncate">{item.name}</p>
                    <span className="text-[10px] font-mono text-[#9DB0A2] bg-[#18251D] px-1.5 py-0.2 rounded border border-[#2E4336]">
                      {item.batch}
                    </span>
                  </div>
                  <p className="text-xs text-[#9DB0A2] truncate mt-0.5">
                    {item.currentRole} at <span className="text-[#EEF3E8]">{item.organization}</span> • {item.wing}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setConfirmApproveId(item.id)}
                    disabled={isProcessing}
                    aria-label={`Approve ${item.name}`}
                    className="min-h-[44px] px-3 rounded bg-[#B7FF72] text-[#18251D] text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejectingItem(item)}
                    disabled={isProcessing}
                    aria-label={`Reject ${item.name}`}
                    className="min-h-[44px] px-3 rounded bg-[#18251D] border border-[#E8A598]/50 text-[#E8A598] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#E8A598]/10 disabled:opacity-50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ConfirmDialog
        isOpen={!!confirmApproveId}
        onClose={() => setConfirmApproveId(null)}
        onConfirm={async () => {
          if (confirmApproveId) {
            await onApprove(confirmApproveId);
            setConfirmApproveId(null);
          }
        }}
        title="Approve Alumni Submission"
        description={`Are you sure you want to approve ${activeApproveTarget?.name || 'this profile'}? They will immediately appear in the public alumni directory.`}
        confirmText="Approve Profile"
        isSubmitting={!!actionInProgressId}
      />

      <ReasonDialog
        isOpen={!!rejectingItem}
        onClose={() => setRejectingItem(null)}
        onSubmit={async (reason) => {
          if (rejectingItem) {
            await onReject(rejectingItem.id, reason);
            setRejectingItem(null);
          }
        }}
        title={`Reject ${rejectingItem?.name || 'Alumnus'}`}
        description="Provide a constructive reason explaining why this application was not approved. This will be stored for audit."
        isSubmitting={!!actionInProgressId}
      />
    </div>
  );
};
