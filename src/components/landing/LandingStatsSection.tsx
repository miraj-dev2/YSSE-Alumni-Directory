import React from 'react';
import { RotateCw, AlertCircle } from 'lucide-react';

interface StatsProps {
  stats?: {
    total: number;
    batchesCount: number;
    companiesCount: number;
    countriesCount: number;
  };
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export const LandingStatsSection: React.FC<StatsProps> = ({
  stats,
  isLoading,
  isError,
  onRetry
}) => {
  if (isLoading) {
    return (
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-card p-6 h-28 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (isError || !stats) {
    return (
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface border border-border rounded-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-muted text-xs">
            <AlertCircle className="w-5 h-5 text-status-rejected shrink-0" />
            <span>Unable to load live directory statistics at this time.</span>
          </div>
          <button
            onClick={onRetry}
            className="btn-secondary !min-h-[36px] h-[36px] text-xs px-3.5 gap-1.5 shrink-0"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-card p-6">
          <span className="block font-heading font-semibold text-3xl sm:text-4xl text-text">
            {stats.total}+
          </span>
          <span className="text-xs text-muted uppercase font-mono tracking-wider mt-1 block">
            Verified Alumni
          </span>
        </div>

        <div className="bg-surface border border-border rounded-card p-6">
          <span className="block font-heading font-semibold text-3xl sm:text-4xl text-accent">
            {stats.batchesCount}
          </span>
          <span className="text-xs text-muted uppercase font-mono tracking-wider mt-1 block">
            Alumni Batches
          </span>
        </div>

        <div className="bg-surface border border-border rounded-card p-6">
          <span className="block font-heading font-semibold text-3xl sm:text-4xl text-text">
            {stats.companiesCount}+
          </span>
          <span className="text-xs text-muted uppercase font-mono tracking-wider mt-1 block">
            Organizations
          </span>
        </div>

        <div className="bg-surface border border-border rounded-card p-6">
          <span className="block font-heading font-semibold text-3xl sm:text-4xl text-accent">
            {stats.countriesCount}+
          </span>
          <span className="text-xs text-muted uppercase font-mono tracking-wider mt-1 block">
            Regions Reached
          </span>
        </div>
      </div>
    </section>
  );
};
