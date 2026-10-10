import React from 'react';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon: Icon = FolderOpen,
}) => {
  return (
    <div className="p-12 text-center bg-surface border border-lines rounded-md space-y-4">
      <div className="w-12 h-12 rounded-md bg-surface border border-lines flex items-center justify-center text-muted mx-auto">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-sm mx-auto">
        <h3 className="text-sm font-semibold text-text">{title}</h3>
        <p className="text-xs text-muted leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <div>
          <button
            type="button"
            onClick={onAction}
            className="px-4 py-2 text-xs font-semibold rounded-md bg-surface text-accent border border-lines hover:border-accent transition-colors"
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
};
