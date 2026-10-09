import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-surface-elevated/70 border border-border/40 rounded-xl ${className}`}
    />
  );
};

export const AlumniCardSkeleton: React.FC = () => {
  return (
    <div className="bg-surface border border-border rounded-card p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="w-14 h-14 rounded-full" />
          <Skeleton className="w-20 h-6 rounded-full" />
        </div>
        <Skeleton className="w-3/4 h-5 mb-2 rounded-lg" />
        <Skeleton className="w-1/2 h-4 mb-2 rounded-lg" />
        <Skeleton className="w-2/3 h-3.5 mb-4 rounded-lg" />
        <Skeleton className="w-full h-8 mb-4 rounded-lg" />
      </div>
      <div className="pt-4 border-t border-border flex items-center gap-2">
        <Skeleton className="w-16 h-5 rounded-full" />
        <Skeleton className="w-24 h-5 rounded-full" />
      </div>
    </div>
  );
};
