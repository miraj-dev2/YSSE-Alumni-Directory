import React from 'react';
import { Link } from 'react-router-dom';
import { Quote, ArrowRight, BookOpen, RotateCw, AlertCircle } from 'lucide-react';
import { AlumniProfile } from '../../types';
import { Avatar } from '../shared/Avatar';
import { useAuth } from '../../context/AuthContext';

interface StoriesSectionProps {
  stories: AlumniProfile[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export const LandingStoriesSection: React.FC<StoriesSectionProps> = ({
  stories,
  isLoading,
  isError,
  onRetry
}) => {
  const { role } = useAuth();
  const isAlumni = role === 'alumni' || role === 'admin';

  return (
    <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="chip bg-accent/15 text-accent border-accent/25 text-[11px] font-mono">
              Impact & Journeys
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-text">Alumni Success Stories</h2>
          <p className="text-xs text-muted mt-1 max-w-xl">
            Real stories and career reflections from YSSE alumni driving positive change worldwide.
          </p>
        </div>
        {isAlumni && (
          <Link to="/me" className="btn-secondary !min-h-[38px] h-[38px] text-xs px-3.5 gap-1.5 self-start sm:self-auto">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Share Your Story</span>
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-card p-6 h-56 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-surface border border-border rounded-card p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-muted text-xs">
            <AlertCircle className="w-5 h-5 text-status-rejected shrink-0" />
            <span>Failed to load success stories.</span>
          </div>
          <button onClick={onRetry} className="btn-secondary !min-h-[36px] h-[36px] text-xs px-3.5 gap-1.5 shrink-0">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      ) : stories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.slice(0, 6).map((alumnus) => (
            <div
              key={alumnus.id}
              className="bg-surface border border-border hover:border-accent/30 transition-colors rounded-card p-6 flex flex-col justify-between relative group"
            >
              <div>
                <Quote className="w-6 h-6 text-accent/30 mb-3" />
                <p className="text-xs sm:text-sm text-text leading-relaxed line-clamp-4 italic mb-5">
                  "{alumnus.story}"
                </p>
              </div>
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <Link to={`/alumni/${alumnus.id}`} className="flex items-center gap-3 group-hover:text-accent transition-colors">
                  <Avatar src={alumnus.photoUrl} name={alumnus.name} size="sm" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text truncate group-hover:text-accent transition-colors">{alumnus.name}</p>
                    <p className="text-[11px] text-muted truncate">{alumnus.role} · {alumnus.organization}</p>
                  </div>
                </Link>
                <Link to={`/alumni/${alumnus.id}`} className="text-muted hover:text-text p-1 shrink-0 ml-2" title="Read full story">
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-dashed border-border rounded-card p-10 text-center space-y-3">
          <BookOpen className="w-8 h-8 text-accent/60 mx-auto" />
          <h3 className="text-sm font-semibold text-text">No stories published yet</h3>
          <p className="text-xs text-muted max-w-md mx-auto">
            {isAlumni ? 'Add your reflections in your profile to inspire fellow youth and newcomers.' : 'Alumni stories will be showcased here once published.'}
          </p>
        </div>
      )}
    </section>
  );
};
