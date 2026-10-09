import React from 'react';
import { ApprovalStatus, SessionRequestStatus } from '../../types';

interface StatusBadgeProps {
  status: ApprovalStatus | SessionRequestStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  let badgeStyles = 'bg-surface-elevated text-text-muted border-border';

  switch (status) {
    case 'Pending':
      badgeStyles = 'bg-amber-950/40 text-amber-300 border-amber-800/60';
      break;
    case 'Approved':
    case 'Accepted':
      badgeStyles = 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60';
      break;
    case 'Rejected':
      badgeStyles = 'bg-rose-950/40 text-rose-300 border-rose-800/60';
      break;
    case 'Done':
      badgeStyles = 'bg-sky-950/40 text-sky-300 border-sky-800/60';
      break;
  }

  const sizeClass = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-medium uppercase tracking-wider rounded-full border ${badgeStyles} ${sizeClass}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'Pending'
            ? 'bg-amber-400 animate-pulse'
            : status === 'Approved' || status === 'Accepted'
            ? 'bg-emerald-400'
            : status === 'Done'
            ? 'bg-sky-400'
            : 'bg-rose-400'
        }`}
      />
      {status}
    </span>
  );
};
