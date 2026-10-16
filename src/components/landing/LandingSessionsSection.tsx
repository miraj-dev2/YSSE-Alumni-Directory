import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, RotateCw, AlertCircle } from 'lucide-react';
import { AlumniProfile } from '../../types';
import { Avatar } from '../shared/Avatar';

interface SessionsProps {
  sessionsOffered: AlumniProfile[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export const LandingSessionsSection: React.FC<SessionsProps> = ({
  sessionsOffered,
  isLoading,
  isError,
  onRetry
}) => {
  return (
    <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-text">
            Alumni Talk & Knowledge Sharing
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Explore knowledge-sharing sessions and book advisory office hours with alumni.
          </p>
        </div>
        <Link to="/alumni-talk" className="btn-secondary !min-h-[38px] h-[38px] text-xs px-3.5 gap-1.5">
          <span>Explore Alumni Talk</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-card p-5 h-64 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-surface border border-border rounded-card p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-muted text-xs">
            <AlertCircle className="w-5 h-5 text-status-rejected shrink-0" />
            <span>Failed to load active mentorship sessions.</span>
          </div>
          <button onClick={onRetry} className="btn-secondary !min-h-[36px] h-[36px] text-xs px-3.5 gap-1.5 shrink-0">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      ) : sessionsOffered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sessionsOffered.map((mentor) => (
            <div key={mentor.id} className="bg-surface border border-border rounded-card p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <Avatar src={mentor.photoUrl} name={mentor.name} size="md" />
                  <span className="chip bg-accent/15 text-accent border-accent/25 text-[10px]">
                    {mentor.sessionFormat || 'Online'}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-text">{mentor.name}</h3>
                <p className="text-xs text-muted">{mentor.role} at {mentor.organization}</p>
                <div className="mt-3 p-3 bg-surface-hover rounded-md border border-border">
                  <span className="text-[10px] font-mono uppercase text-muted block mb-0.5">Focus Area</span>
                  <p className="text-xs text-text font-medium line-clamp-2">
                    {mentor.sessionTopic || 'Career & Technical Advising'}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <Link to={`/alumni/${mentor.id}`} className="text-xs text-muted hover:text-text">
                  View Profile
                </Link>
                <Link to="/alumni-talk" className="btn-primary !min-h-[36px] h-[36px] text-xs px-3 gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Request Session</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-card p-10 text-center text-muted text-xs">
          No active mentorship office hours published yet. Verified alumni can offer sessions from their profile.
        </div>
      )}
    </section>
  );
};
