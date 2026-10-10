import React from 'react';
import { Users, Video, Clock, CalendarCheck2 } from 'lucide-react';
import { DashboardStats } from '../../types/admin';

interface DashboardStatCardsProps {
  stats: DashboardStats;
}

export const DashboardStatCards: React.FC<DashboardStatCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total alumni',
      value: stats.totalAlumni,
      icon: Users,
      descriptor: 'Registered YSSE fellows across all cohorts',
    },
    {
      title: 'Open to sessions',
      value: stats.openToSessions,
      icon: Video,
      descriptor: 'Available for 1:1 mentorship guidance calls',
    },
    {
      title: 'Pending approvals',
      value: stats.pendingApprovals,
      icon: Clock,
      descriptor: 'Applications awaiting Secretariat verification',
      highlight: stats.pendingApprovals > 0,
    },
    {
      title: 'Session requests',
      value: stats.sessionRequests,
      icon: CalendarCheck2,
      descriptor: 'Member requests submitted this season',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className="bg-[#1F3027] border border-[#2E4336] rounded-[22px] p-6 flex flex-col justify-between shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#9DB0A2]">
                {c.title}
              </span>
              <div className="w-11 h-11 rounded-full bg-[#2A4033] flex items-center justify-center text-[#B7FF72] shrink-0">
                <Icon className="w-5 h-5 text-[#B7FF72]" />
              </div>
            </div>

            <div className="mt-4">
              <div
                className={`text-3xl lg:text-[38px] font-extrabold font-heading tracking-tight leading-none ${
                  c.highlight ? 'text-[#B7FF72]' : 'text-[#EEF3E8]'
                }`}
              >
                {c.value}
              </div>
              <p className="text-xs text-[#9DB0A2] mt-2 leading-relaxed">
                {c.descriptor}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
