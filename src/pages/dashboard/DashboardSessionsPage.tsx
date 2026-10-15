import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, CalendarCheck2, CheckCircle, Video, MapPin, Mail } from 'lucide-react';
import { portalApi } from '../../api/portalApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const DashboardSessionsPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const isAlumni = user?.role === 'alumni';

  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const data = isAlumni ? await portalApi.getIncomingRequests() : await portalApi.getMyRequests();
      // filter only ACCEPTED or DONE sessions
      setSessions(data.filter((r: any) => r.status === 'ACCEPTED' || r.status === 'DONE'));
    } catch (err: any) {
      error('Failed to load sessions', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAlumni, error]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleMarkDone = async (id: string) => {
    try {
      await portalApi.updateRequestStatus(id, 'DONE');
      success('Session Completed', 'Marked mentorship session as done.');
      loadSessions();
    } catch (err: any) {
      error('Update failed', err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#EEF3E8]">Confirmed Mentorship Sessions</h1>
        <p className="text-xs text-[#9DB0A2]">View your scheduled and completed 1-on-1 mentorship connections.</p>
      </div>

      {loading ? (
        <div className="py-20 text-center"><Loader2 className="w-7 h-7 text-[#B7FF72] animate-spin mx-auto" /></div>
      ) : sessions.length === 0 ? (
        <div className="bg-[#1F3027] border border-[#2E4336] rounded-2xl p-12 text-center text-xs text-[#9DB0A2] space-y-2">
          <CalendarCheck2 className="w-8 h-8 text-[#9DB0A2] mx-auto" />
          <p>No confirmed sessions yet. Once a session request is accepted, it will appear here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map((sess) => {
            const partnerName = isAlumni ? sess.requester?.name : sess.offer?.alumni?.name;
            const partnerEmail = isAlumni ? sess.requester?.email : null;
            return (
              <div key={sess.id} className="bg-[#1F3027] border border-[#2E4336] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      sess.status === 'ACCEPTED' ? 'bg-[#B7FF72]/20 text-[#B7FF72]' : 'bg-zinc-700 text-zinc-300'
                    }`}>
                      {sess.status === 'ACCEPTED' ? 'Scheduled' : 'Completed'}
                    </span>
                    <span className="text-[11px] text-[#9DB0A2]">
                      {new Date(sess.respondedAt || sess.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#EEF3E8]">{sess.offer?.topic || sess.offer?.title || 'Mentorship Session'}</h3>
                    <p className="text-xs text-[#9DB0A2]">With <span className="text-[#EEF3E8] font-semibold">{partnerName}</span></p>
                  </div>

                  <div className="bg-[#142018] p-3 rounded-xl border border-[#2E4336] space-y-1.5 text-xs text-[#9DB0A2]">
                    <div className="flex items-center gap-2">
                      {sess.offer?.mode === 'ONLINE' ? <Video className="w-3.5 h-3.5 text-[#B7FF72]" /> : <MapPin className="w-3.5 h-3.5 text-[#B7FF72]" />}
                      <span className="capitalize">{sess.offer?.mode?.toLowerCase()} Session</span>
                    </div>
                    {partnerEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-[#9DB0A2]" />
                        <span>{partnerEmail}</span>
                      </div>
                    )}
                  </div>
                </div>

                {isAlumni && sess.status === 'ACCEPTED' && (
                  <button
                    onClick={() => handleMarkDone(sess.id)}
                    className="btn-secondary !h-8 text-xs font-semibold gap-1.5 inline-flex items-center justify-center w-full"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-[#B7FF72]" /> Mark as Completed
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
