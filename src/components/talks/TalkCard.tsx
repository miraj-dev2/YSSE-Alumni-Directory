import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Calendar, ExternalLink, Video } from 'lucide-react';
import { AlumniTalk } from '../../types';
import { Avatar } from '../shared/Avatar';

interface TalkCardProps {
  talk: AlumniTalk;
}

export const TalkCard: React.FC<TalkCardProps> = ({ talk }) => {
  const formattedDate = new Date(talk.talkDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-surface border border-border hover:border-accent/30 rounded-card p-6 flex flex-col justify-between transition-colors shadow-sm">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <span className="chip bg-accent/15 text-accent border-accent/25 text-[11px] font-mono">
            {talk.topic}
          </span>
          <span className="text-[11px] font-mono text-muted flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formattedDate}</span>
          </span>
        </div>

        <div>
          <h3 className="text-base font-bold font-heading text-text line-clamp-2">
            {talk.title}
          </h3>
          {talk.description && (
            <p className="text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed">
              {talk.description}
            </p>
          )}
        </div>

        {/* Speaker Info */}
        <div className="pt-2 flex items-center gap-3">
          <Avatar src={talk.speakerPhoto} name={talk.speakerName} size="sm" />
          <div className="min-w-0">
            {talk.speakerId ? (
              <Link
                to={`/alumni/${talk.speakerId}`}
                className="text-xs font-semibold text-text hover:text-accent truncate block"
              >
                {talk.speakerName}
              </Link>
            ) : (
              <p className="text-xs font-semibold text-text truncate">
                {talk.speakerName}
              </p>
            )}
            {(talk.speakerRole || talk.speakerOrg) && (
              <p className="text-[11px] text-muted truncate">
                {talk.speakerRole} {talk.speakerOrg ? `· ${talk.speakerOrg}` : ''}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Links */}
      <div className="mt-5 pt-3.5 border-t border-border flex items-center justify-between gap-2">
        {talk.recordingUrl ? (
          <a
            href={talk.recordingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !min-h-[34px] h-[34px] text-xs px-3.5 gap-1.5"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Watch Recording</span>
          </a>
        ) : talk.liveUrl ? (
          <a
            href={talk.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary !min-h-[34px] h-[34px] text-xs px-3.5 gap-1.5"
          >
            <Video className="w-3 h-3" />
            <span>Join Session</span>
          </a>
        ) : (
          <span className="text-[11px] text-muted italic">Recording processing</span>
        )}

        {talk.speakerId && (
          <Link
            to={`/alumni/${talk.speakerId}`}
            className="text-xs text-muted hover:text-text flex items-center gap-1"
          >
            <span>Speaker Profile</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
};
