import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base font-semibold',
  xl: 'w-20 h-20 text-xl font-bold',
  '2xl': 'w-32 h-32 text-3xl font-bold',
};

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className = '' }) => {
  const [hasError, setHasError] = useState(false);

  const getInitials = (n: string) => {
    if (!n) return 'YS';
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const getBackgroundColor = (str: string) => {
    const hues = [
      'bg-emerald-900 text-emerald-200 border-emerald-700/50',
      'bg-teal-900 text-teal-200 border-teal-700/50',
      'bg-forest-800 text-lime-300 border-lime-800/40',
      'bg-slate-800 text-slate-200 border-slate-700/50',
      'bg-zinc-800 text-amber-200 border-amber-800/40',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % hues.length;
    return hues[idx];
  };

  if (src && !hasError) {
    return (
      <div
        className={`relative inline-block rounded-full overflow-hidden shrink-0 border border-border ${sizeClasses[size]} ${className}`}
      >
        <img
          src={src}
          alt={name}
          loading="lazy"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      aria-label={name}
      className={`inline-flex items-center justify-center rounded-full shrink-0 border font-mono select-none ${getBackgroundColor(
        name
      )} ${sizeClasses[size]} ${className}`}
    >
      <span>{getInitials(name)}</span>
    </div>
  );
};
