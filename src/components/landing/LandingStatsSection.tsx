import React from 'react';

interface StatsProps {
  stats: {
    total: number;
    batchesCount: number;
    companiesCount: number;
    countriesCount: number;
  };
}

export const LandingStatsSection: React.FC<StatsProps> = ({ stats }) => {
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
