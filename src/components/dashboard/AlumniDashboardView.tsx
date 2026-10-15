import React from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  CalendarCheck2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  UserCheck,
  Video
} from 'lucide-react';
import { AlumniDashboardData } from '../../types/portal';

interface Props {
  data: AlumniDashboardData;
  onRefresh: () => void;
}

export const AlumniDashboardView: React.FC<Props> = ({ data }) => {
  const { profileCompletion, stats, recentRequests, profile } = data;

  const statCards = [
    { label: 'Pending Requests', value: stats.pendingRequests, icon: Inbox, link: '/dashboard/requests', alert: stats.pendingRequests > 0 },
    { label: 'Confirmed Sessions', value: stats.acceptedSessions, icon: CalendarCheck2, link: '/dashboard/sessions', alert: false },
    { label: 'Completed Mentorships', value: stats.completedSessions, icon: CheckCircle2, link: '/dashboard/sessions', alert: false },
    { label: 'Active Offers', value: stats.offersCount, icon: Video, link: '/alumni-talk', alert: false }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Completion banner */}
      <div className="bg-[#1F3027] border border-[#2E4336] rounded-2xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B7FF72]" />
            <h3 className="text-sm font-semibold text-[#EEF3E8]">Profile Completion</h3>
          </div>
          <span className="text-sm font-bold text-[#B7FF72]">{profileCompletion}%</span>
        </div>
        <div className="w-full bg-[#142018] h-2.5 rounded-full overflow-hidden border border-[#2E4336]">
          <div
            className="bg-[#B7FF72] h-full rounded-full transition-all duration-500"
            style={{ width: `${profileCompletion}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-[#9DB0A2] pt-1">
          <span>{profileCompletion === 100 ? 'Awesome! Your profile is complete.' : 'Complete your bio, wing, and LinkedIn to attract more mentees.'}</span>
          <Link to={`/alumni/${profile.id}`} className="text-[#B7FF72] hover:underline font-semibold flex items-center gap-1">
            View Public Profile <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={i}
              to={card.link}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                card.alert
                  ? 'bg-[#1F3027] border-[#B7FF72]/40 hover:border-[#B7FF72]'
                  : 'bg-[#1F3027] border-[#2E4336] hover:border-[#9DB0A2]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#9DB0A2] font-medium">{card.label}</span>
                <Icon className={`w-4 h-4 ${card.alert ? 'text-[#B7FF72]' : 'text-[#9DB0A2]'}`} />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#EEF3E8]">{card.value}</div>
            </Link>
          );
        })}
      </div>

      {/* Recent incoming requests */}
      <div className="bg-[#1F3027] border border-[#2E4336] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#EEF3E8]">Recent Mentorship Requests</h2>
          <Link to="/dashboard/requests" className="text-xs text-[#B7FF72] hover:underline flex items-center gap-1">
            View all ({stats.pendingRequests}) <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentRequests.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#9DB0A2] bg-[#142018]/50 rounded-xl border border-[#2E4336]/60">
            No mentorship requests yet. Ensure your session offers are active!
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentRequests.map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-xl bg-[#142018] border border-[#2E4336] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#25392D] border border-[#2E4336] flex items-center justify-center font-bold text-xs text-[#B7FF72]">
                    {req.requester?.name?.charAt(0) || 'M'}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#EEF3E8]">{req.requester?.name}</h4>
                    <p className="text-[11px] text-[#9DB0A2]">{req.offer?.topic || req.offer?.title || 'Mentorship Session'} &bull; <span className="uppercase text-[10px] text-[#B7FF72]">{req.offer?.mode}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase ${
                    req.status === 'PENDING' ? 'bg-amber-400/20 text-amber-300' :
                    req.status === 'ACCEPTED' ? 'bg-[#B7FF72]/20 text-[#B7FF72]' : 'bg-zinc-700 text-zinc-300'
                  }`}>
                    {req.status}
                  </span>
                  <Link to="/dashboard/requests" className="text-xs text-[#B7FF72] hover:underline px-2 py-1">
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
