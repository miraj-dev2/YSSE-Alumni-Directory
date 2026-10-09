import React from 'react';
import { LucideIcon, Search } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Search,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-surface/50 border border-dashed border-border rounded-card my-6">
      <div className="w-14 h-14 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center text-accent mb-4 shadow-surface">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-text font-heading">{title}</h3>
      <p className="text-sm text-text-muted max-w-sm mt-1.5 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="btn-secondary mt-5 text-xs h-10 px-5"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
