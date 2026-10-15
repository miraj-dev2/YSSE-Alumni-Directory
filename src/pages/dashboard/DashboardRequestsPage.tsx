import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader2, Check, X, Trash2, Clock, Inbox } from 'lucide-react';
import { portalApi } from '../../api/portalApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const DashboardRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const { refreshBadges } = useOutletContext<{ refreshBadges: () => void }>() || {};
  const isAlumni = user?.role === 'alumni';

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'DECLINED'>('ALL');

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = isAlumni ? await portalApi.getIncomingRequests() : await portalApi.getMyRequests();
      setRequests(data);
      refreshBadges?.();
    } catch (err: any) {
      error('Failed to load requests', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAlumni, refreshBadges, error]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleUpdateStatus = async (id: string, status: 'ACCEPTED' | 'DECLINED') => {
    try {
      await portalApi.updateRequestStatus(id, status);
      success(`Request ${status === 'ACCEPTED' ? 'Accepted' : 'Declined'}`, 'Status updated successfully.');
      loadRequests();
    } catch (err: any) {
      error('Update failed', err.message);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this mentorship request?')) return;
    try {
      await portalApi.cancelRequest(id);
      success('Cancelled', 'Your session request has been cancelled.');
      loadRequests();
    } catch (err: any) {
      error('Cancellation failed', err.message);
    }
  };

  const filtered = requests.filter((r) => activeTab === 'ALL' || r.status === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#EEF3E8]">{isAlumni ? 'Incoming Mentorship Requests' : 'My Session Requests'}</h1>
          <p className="text-xs text-[#9DB0A2]">{isAlumni ? 'Review and manage session requests sent to you.' : 'Track the progress of your mentorship requests.'}</p>
        </div>
        <div className="flex items-center gap-1 bg-[#1F3027] p-1 rounded-xl border border-[#2E4336]">
          {(['ALL', 'PENDING', 'ACCEPTED', 'DECLINED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeTab === tab ? 'bg-[#B7FF72] text-[#18251D]' : 'text-[#9DB0A2] hover:text-[#EEF3E8]'
              }`}
            >
              {tab.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center"><Loader2 className="w-7 h-7 text-[#B7FF72] animate-spin mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#1F3027] border border-[#2E4336] rounded-2xl p-12 text-center text-xs text-[#9DB0A2] space-y-2">
          <Inbox className="w-8 h-8 text-[#9DB0A2] mx-auto" />
          <p>No {activeTab !== 'ALL' ? activeTab.toLowerCase() : ''} requests found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => (
            <div key={req.id} className="bg-[#1F3027] border border-[#2E4336] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    req.status === 'PENDING' ? 'bg-amber-400/20 text-amber-300' :
                    req.status === 'ACCEPTED' ? 'bg-[#B7FF72]/20 text-[#B7FF72]' : 'bg-red-400/20 text-red-300'
                  }`}>
                    {req.status}
                  </span>
                  <span className="text-[11px] text-[#9DB0A2] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#EEF3E8]">
                  {isAlumni ? req.requester?.name : req.offer?.alumni?.name} &bull; <span className="font-normal text-xs text-[#9DB0A2]">{req.offer?.topic || req.offer?.title || 'Mentorship'}</span>
                </h3>
                {req.message && <p className="text-xs text-[#9DB0A2] bg-[#142018] p-2.5 rounded-lg border border-[#2E4336] italic">"{req.message}"</p>}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isAlumni && req.status === 'PENDING' && (
                  <>
                    <button onClick={() => handleUpdateStatus(req.id, 'ACCEPTED')} className="btn-primary !h-8 text-xs font-semibold gap-1 inline-flex items-center">
                      <Check className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button onClick={() => handleUpdateStatus(req.id, 'DECLINED')} className="px-3 h-8 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-semibold gap-1 inline-flex items-center">
                      <X className="w-3.5 h-3.5" /> Decline
                    </button>
                  </>
                )}
                {!isAlumni && req.status === 'PENDING' && (
                  <button onClick={() => handleCancel(req.id)} className="px-3 h-8 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-semibold gap-1.5 inline-flex items-center">
                    <Trash2 className="w-3.5 h-3.5" /> Cancel Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
