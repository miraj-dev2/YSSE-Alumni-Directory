import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Bookmark, BookmarkX, ArrowRight, Compass } from 'lucide-react';
import { portalApi } from '../../api/portalApi';
import { SavedAlumniItem } from '../../types/portal';
import { useToast } from '../../context/ToastContext';

export const DashboardSavedPage: React.FC = () => {
  const { success, error } = useToast();
  const [savedList, setSavedList] = useState<SavedAlumniItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = useCallback(async () => {
    setLoading(true);
    try {
      const data = await portalApi.getSavedAlumni();
      setSavedList(data);
    } catch (err: any) {
      error('Failed to load bookmarks', err.message);
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  const handleRemove = async (alumniId: string) => {
    try {
      await portalApi.toggleSaveAlumnus(alumniId);
      success('Bookmark Removed', 'Mentor removed from your saved list.');
      setSavedList((prev) => prev.filter((item) => item.alumni.id !== alumniId));
    } catch (err: any) {
      error('Failed to remove bookmark', err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#EEF3E8]">Saved Alumni Mentors</h1>
          <p className="text-xs text-[#9DB0A2]">Quickly access mentors you bookmarked for career guidance and networking.</p>
        </div>
        <Link to="/alumni" className="btn-primary !h-9 text-xs font-semibold gap-1.5 inline-flex items-center">
          <Compass className="w-3.5 h-3.5" /> Browse Directory
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center"><Loader2 className="w-7 h-7 text-[#B7FF72] animate-spin mx-auto" /></div>
      ) : savedList.length === 0 ? (
        <div className="bg-[#1F3027] border border-[#2E4336] rounded-2xl p-12 text-center text-xs text-[#9DB0A2] space-y-3">
          <Bookmark className="w-8 h-8 text-[#9DB0A2] mx-auto" />
          <p>You haven't bookmarked any alumni mentors yet.</p>
          <Link to="/alumni" className="btn-secondary !h-8 text-xs font-semibold inline-flex items-center gap-1">
            Explore Alumni Directory <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedList.map((item) => {
            const al = item.alumni;
            return (
              <div key={item.id} className="bg-[#1F3027] border border-[#2E4336] rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#25392D] border border-[#2E4336] flex items-center justify-center font-bold text-base text-[#B7FF72] overflow-hidden shrink-0">
                      {al.photoUrl ? (
                        <img src={al.photoUrl} alt={al.name} className="w-full h-full object-cover" />
                      ) : (
                        al.name?.charAt(0) || 'A'
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#EEF3E8]">{al.name}</h3>
                      <p className="text-xs text-[#9DB0A2]">{al.currentRole || 'Alumnus'} {al.company && `at ${al.company}`}</p>
                      <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#B7FF72]/15 text-[#B7FF72]">
                        {al.wing}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(al.id)}
                    className="p-1.5 text-[#9DB0A2] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remove bookmark"
                  >
                    <BookmarkX className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-2 border-t border-[#2E4336] flex items-center justify-between">
                  <span className="text-[10px] text-[#9DB0A2]">
                    Saved {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/alumni/${al.id}`}
                    className="text-xs font-semibold text-[#B7FF72] hover:underline flex items-center gap-1"
                  >
                    View Profile <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
