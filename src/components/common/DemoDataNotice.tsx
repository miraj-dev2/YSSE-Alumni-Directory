import React from 'react';
import { Info } from 'lucide-react';

export const DemoDataNotice: React.FC = () => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface border border-lines text-[11px] font-mono text-muted mb-6">
      <Info className="w-3.5 h-3.5 text-accent shrink-0" />
      <span>
        DEMO MODE: Data persists in-memory. Decisions (Approve/Reject/Import) update active UI immediately.
      </span>
    </div>
  );
};
