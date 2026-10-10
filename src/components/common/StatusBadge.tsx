import React from 'react';
import { AlumniStatus, SessionStatus } from '../../types/admin';

type StatusType = AlumniStatus | SessionStatus | string;

export const StatusBadge: React.FC<{ status: StatusType; className?: string }> = ({
  status,
  className = '',
}) => {
  const normalized = status.toUpperCase();

  const getStyle = () => {
    switch (normalized) {
      case 'APPROVED':
      case 'ACCEPTED':
        return 'bg-accent/15 text-accent border-accent/30';
      case 'PENDING':
        return 'bg-[#C2A24D]/15 text-[#C2A24D] border-[#C2A24D]/30';
      case 'REJECTED':
        return 'bg-destructive/15 text-destructive border-destructive/30';
      case 'DONE':
        return 'bg-[#6C9BCF]/15 text-[#6C9BCF] border-[#6C9BCF]/30';
      default:
        return 'bg-surface text-muted border-lines';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider border font-medium ${getStyle()} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" aria-hidden="true" />
      <span>{normalized}</span>
    </span>
  );
};
