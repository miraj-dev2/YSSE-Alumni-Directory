import React from 'react';
import { CareerEntry } from '../../types';
import { Briefcase } from 'lucide-react';

interface TimelineProps {
  entries: CareerEntry[];
}

export const Timeline: React.FC<TimelineProps> = ({ entries }) => {
  if (!entries || entries.length === 0) {
    return <p className="text-xs text-muted">No career milestones logged yet.</p>;
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
      {entries.map((entry) => (
        <div key={entry.id} className="relative group">
          {/* Timeline node */}
          <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-surface border-2 border-border-strong group-hover:border-accent transition-colors flex items-center justify-center">
            {entry.current && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text">{entry.role}</span>
              {entry.current && (
                <span className="chip bg-accent/15 text-accent border-accent/25 text-[10px]">
                  Present
                </span>
              )}
            </div>
            <p className="text-xs text-muted flex items-center gap-1.5 mt-0.5">
              <Briefcase className="w-3.5 h-3.5 text-muted/70" />
              <span className="text-text font-medium">{entry.organization}</span>
              <span>•</span>
              <span className="font-mono text-[11px]">
                {entry.startYear} – {entry.current ? 'Present' : entry.endYear || ''}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
