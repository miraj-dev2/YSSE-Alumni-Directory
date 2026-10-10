import React from 'react';
import { Users, Clock, Video, CalendarCheck2 } from 'lucide-react';
import { DashboardStats } from '../../types/admin';

interface DashboardTilesProps {
  stats: DashboardStats;
}

export const DashboardTiles: React.FC<DashboardTilesProps> = ({ stats }) => {
  const tiles = [
    {
      label: 'TOTAL ALUMNI',
      value: stats.totalAlumni,
      icon: Users,
      description: 'Registered network members',
    },
    {
      label: 'PENDING APPROVALS',
      value: stats.pendingApprovals,
      icon: Clock,
      description: 'Awaiting Secretariat review',
      highlight: stats.pendingApprovals > 0,
    },
    {
      label: 'OPEN TO SESSIONS',
      value: stats.openToSessions,
      icon: Video,
      description: 'Available for youth mentorship',
    },
    {
      label: 'SESSION REQUESTS',
      value: stats.sessionRequests,
      icon: CalendarCheck2,
      description: 'Incoming member bookings',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tiles.map((tile) => {
        const Icon = tile.icon;
        return (
          <div
            key={tile.label}
            className="bg-[#1F3027] border border-[#2E4336] rounded p-5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#9DB0A2]">
                {tile.label}
              </span>
              <div className="w-8 h-8 rounded bg-[#18251D] border border-[#2E4336] flex items-center justify-center text-[#B7FF72]">
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div
                className={`text-3xl font-bold font-heading tracking-tight ${
                  tile.highlight ? 'text-[#B7FF72]' : 'text-[#EEF3E8]'
                }`}
              >
                {tile.value}
              </div>
              <p className="text-xs text-[#9DB0A2] mt-1">{tile.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
