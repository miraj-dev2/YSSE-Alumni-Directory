import React from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  CalendarCheck2,
  CheckCircle2,
  Bookmark,
  Compass,
  ArrowRight,
  Video
} from 'lucide-react';
import { MemberDashboardData } from '../../types/portal';

interface Props {
  data: MemberDashboardData;
  onRefresh: () => void;
}

export const MemberDashboardView: React.FC<Props> = ({ data }) => {
  const { stats, recentRequests } = data;

  const statCards = [
    { label: 'Active Requests', value: stats.sentPending, icon: Send, link: '/dashboard/requests', alert: stats.sentPending > 0 },
    { label: 'Confirmed Sessions', value: stats.acceptedSessions, icon: CalendarCheck2, link: '/dashboard/sessions', alert: stats.acceptedSessions > 0 },
    { label: 'Completed Sessions', value: stats.completedSessions, icon: CheckCircle2, link: '/dashboard/sessions', alert: false },
    { label: 'Saved Mentors', value: stats.savedCount, icon: Bookmark, link: '/dashboard/saved', alert: false }
  ];

  return (
    <div className="space-y-6">
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

      {/* Discovery banner cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-[#1F3027] border border-[#2E4336] flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#B7FF72] block">Mentorship Network</span>
            <h3 className="text-base font-bold text-[#EEF3E8]">Connect with Alumni Leaders</h3>
            <p className="text-xs text-[#9DB0A2]">
              Filter hundreds of verified YSSE alumni by wing, batch, and current company to request 1-on-1 mentorship sessions.
            </p>
          </div>
          <Link to="/alumni" className="btn-primary !h-10 text-xs font-semibold gap-2 inline-flex items-center w-fit">
            <Compass className="w-4 h-4" />
            Explore Directory
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-[#1F3027] border border-[#2E4336] flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#B7FF72] block">Knowledge Hub</span>
            <h3 className="text-base font-bold text-[#EEF3E8]">Watch YSSE Alumni Talks</h3>
            <p className="text-xs text-[#9DB0A2]">
              Access recordings, live masterclasses, and keynote sessions delivered by distinguished alumni worldwide.
            </p>
          </div>
          <Link to="/alumni-talk" className="btn-secondary !h-10 text-xs font-semibold gap-2 inline-flex items-center w-fit">
            <Video className="w-4 h-4 text-[#B7FF72]" />
            Watch Alumni Talks
          </Link>
        </div>
      </div>

      {/* Recent sent requests */}
      <div className="bg-[#1F3027] border border-[#2E4336] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#EEF3E8]">My Mentorship Requests</h2>
          <Link to="/dashboard/requests" className="text-xs text-[#B7FF72] hover:underline flex items-center gap-1">
            View all ({stats.sentPending}) <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentRequests.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#9DB0A2] bg-[#142018]/50 rounded-xl border border-[#2E4336]/60">
            You haven't requested any sessions yet. Browse the directory to connect with an alumni mentor!
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
                    {req.offer?.alumni?.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#EEF3E8]">{req.offer?.alumni?.name}</h4>
                    <p className="text-[11px] text-[#9DB0A2]">
                      {req.offer?.topic || req.offer?.title || 'Mentorship'} &bull; Wing:{' '}
                      {typeof req.offer?.alumni?.wing === 'object'
                        ? req.offer?.alumni?.wing?.name
                        : req.offer?.alumni?.wing || 'General'}
                    </p>
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
                    Details
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
