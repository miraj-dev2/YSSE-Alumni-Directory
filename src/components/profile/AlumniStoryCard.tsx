import React from 'react';
import { Quote, Sparkles } from 'lucide-react';

interface AlumniStoryCardProps {
  story: string;
  name: string;
}

export const AlumniStoryCard: React.FC<AlumniStoryCardProps> = ({ story, name }) => {
  return (
    <div className="bg-gradient-to-br from-surface to-surface-hover/80 border border-accent/25 rounded-card p-6 sm:p-7 relative overflow-hidden shadow-sm">
      {/* Background watermark quote icon */}
      <div className="absolute -right-4 -bottom-4 text-accent/5 pointer-events-none select-none">
        <Quote className="w-32 h-32" />
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-text">
              Success Story & Journey Reflection
            </h3>
            <p className="text-[11px] text-muted">
              Personal reflections on YSSE experience and professional milestones
            </p>
          </div>
        </div>

        <div className="relative pl-4 border-l-2 border-accent/40">
          <p className="text-sm text-text leading-relaxed whitespace-pre-line italic font-normal">
            "{story}"
          </p>
        </div>

        <div className="pt-2 text-right">
          <span className="text-xs font-medium text-accent font-mono">
            — {name}
          </span>
        </div>
      </div>
    </div>
  );
};
