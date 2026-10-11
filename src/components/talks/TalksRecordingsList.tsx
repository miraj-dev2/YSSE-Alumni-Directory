import React, { useState } from 'react';
import { Search, Video, Plus } from 'lucide-react';
import { AlumniTalk } from '../../types';
import { TalkCard } from './TalkCard';
import { useAuth } from '../../context/AuthContext';

interface TalksRecordingsListProps {
  talks: AlumniTalk[];
  loading: boolean;
  onAddClick: () => void;
}

export const TalksRecordingsList: React.FC<TalksRecordingsListProps> = ({
  talks,
  loading,
  onAddClick
}) => {
  const { role } = useAuth();
  const [search, setSearch] = useState('');

  const filtered = talks.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.topic.toLowerCase().includes(q) ||
      t.speakerName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search talks by topic, title, or speaker..."
            className="input-base pl-9 text-xs"
          />
        </div>

        {role === 'admin' && (
          <button
            type="button"
            onClick={onAddClick}
            className="btn-primary !min-h-[38px] h-[38px] text-xs px-3.5 gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Session / Talk</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 bg-surface rounded-card border border-border animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((talk) => (
            <TalkCard key={talk.id} talk={talk} />
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-dashed border-border rounded-card p-12 text-center space-y-3">
          <Video className="w-8 h-8 text-accent/60 mx-auto" />
          <h3 className="text-sm font-semibold text-text">No Alumni Talk recordings found</h3>
          <p className="text-xs text-muted max-w-md mx-auto">
            {search
              ? 'No talks match your search term. Try a different topic or speaker name.'
              : 'Knowledge-sharing talk recordings and live panel sessions will be published here.'}
          </p>
        </div>
      )}
    </div>
  );
};
