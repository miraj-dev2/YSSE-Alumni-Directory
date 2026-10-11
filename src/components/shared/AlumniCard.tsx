import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Sparkles, ArrowUpRight, Clock } from 'lucide-react';
import { AlumniProfile } from '../../types';
import { Avatar } from './Avatar';

interface AlumniCardProps {
  alumni: AlumniProfile;
}

export const AlumniCard: React.FC<AlumniCardProps> = ({ alumni }) => {
  return (
    <Link
      to={`/alumni/${alumni.id}`}
      className="group flex flex-col justify-between bg-surface border border-border hover:border-border-strong rounded-card p-5 transition-colors duration-150 text-left"
      aria-label={`View profile of ${alumni.name}, ${alumni.role} at ${alumni.organization}`}
    >
      <div>
        {/* Top: Photo (4:5 aspect ratio) / Avatar */}
        <div className="relative aspect-[4/5] rounded-md overflow-hidden mb-4 bg-surface-hover border border-border">
          {alumni.photoUrl ? (
            <img
              src={alumni.photoUrl}
              alt={alumni.name}
              loading="lazy"
              className="w-full h-full object-cover transition-opacity duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Avatar name={alumni.name} size="2xl" className="!rounded-md" />
            </div>
          )}

          {/* Badges on photo */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
            <span className="chip bg-bg/90 backdrop-blur-sm text-muted border-border-strong text-[10px]">
              {alumni.batch}
            </span>
            <div className="flex items-center gap-1">
              {alumni.story && (
                <span className="chip bg-surface/90 backdrop-blur-sm text-accent text-[9px] border-accent/30 font-medium">
                  Story
                </span>
              )}
              {alumni.openToSessions && (
                <span className="chip bg-accent text-on-accent font-semibold text-[10px] border-transparent">
                  <Sparkles className="w-3 h-3 text-on-accent" />
                  <span>Mentoring</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Identity & Current Role */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-text group-hover:text-accent transition-colors font-heading truncate">
              {alumni.name}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors shrink-0 ml-1" />
          </div>
          <p className="text-sm text-muted truncate">
            {alumni.role} at <span className="text-text font-medium">{alumni.organization}</span>
          </p>
        </div>

        {/* Bio excerpt */}
        {alumni.bio && (
          <p className="text-xs text-muted line-clamp-2 leading-relaxed mb-4">
            {alumni.bio}
          </p>
        )}
      </div>

      {/* Card Footer: Metadata and Updated Date */}
      <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span className="truncate max-w-[140px] font-mono text-[11px]">
          {alumni.wing}
        </span>
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <Clock className="w-3 h-3 text-muted/70" />
          <span>Updated {alumni.updatedAt}</span>
        </div>
      </div>
    </Link>
  );
};
