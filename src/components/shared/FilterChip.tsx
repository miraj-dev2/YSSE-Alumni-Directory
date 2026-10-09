import React from 'react';
import { X } from 'lucide-react';

interface FilterChipProps {
  label: string;
  value: string;
  onRemove: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, value, onRemove }) => {
  return (
    <span className="chip bg-surface border-border-strong text-text gap-1.5 py-1">
      <span className="text-muted">{label}:</span>
      <span className="font-semibold text-accent">{value}</span>
      <button
        onClick={onRemove}
        className="text-muted hover:text-text rounded-full p-0.5"
        aria-label={`Remove filter ${label}: ${value}`}
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
};
