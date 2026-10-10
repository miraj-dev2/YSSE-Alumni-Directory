import React from 'react';

export const SkeletonRow: React.FC = () => (
  <div className="h-14 bg-surface border border-lines rounded-md animate-pulse" />
);

export const SkeletonCard: React.FC = () => (
  <div className="p-5 bg-surface border border-lines rounded-md space-y-3 animate-pulse">
    <div className="h-4 bg-lines rounded w-1/3" />
    <div className="h-3 bg-lines rounded w-2/3" />
    <div className="h-3 bg-lines rounded w-1/2" />
  </div>
);

export const SkeletonTile: React.FC = () => (
  <div className="p-6 bg-surface border border-lines rounded-md space-y-2 animate-pulse">
    <div className="h-3 bg-lines rounded w-1/2" />
    <div className="h-8 bg-lines rounded w-1/3 mt-2" />
  </div>
);

export const TableRowSkeleton = SkeletonRow;
export const CardSkeleton = SkeletonCard;
export const TileSkeleton = SkeletonTile;

export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({
  title,
  message = 'Failed to load data.',
  onRetry,
}) => (
  <div className="p-8 text-center bg-surface border border-destructive/30 rounded-md space-y-3">
    {title && <h3 className="text-sm font-bold font-heading text-text">{title}</h3>}
    <p className="text-xs text-destructive font-mono">{message}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="px-4 py-2 text-xs font-semibold rounded-md bg-surface text-text border border-lines hover:border-accent transition-colors min-h-[44px]"
      >
        Retry
      </button>
    )}
  </div>
);
