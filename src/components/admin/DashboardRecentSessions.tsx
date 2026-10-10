import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { SessionRequest } from '../../types/admin';
import { StatusBadge } from '../common/StatusBadge';

interface DashboardRecentSessionsProps {
  sessions: SessionRequest[];
}

export const DashboardRecentSessions: React.FC<DashboardRecentSessionsProps> = ({ sessions }) => {
  return (
    <div className="bg-[#1F3027] border border-[#2E4336] rounded p-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#2E4336]">
        <div>
          <h2 className="text-sm font-bold font-heading text-[#EEF3E8]">
            Recent Session Requests
          </h2>
          <p className="text-xs text-[#9DB0A2] mt-0.5">Mentorship and career guidance bookings</p>
        </div>
        <Link
          to="/admin/sessions"
          className="text-xs text-[#B7FF72] hover:underline flex items-center gap-1 font-medium min-h-[44px] flex items-center"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-[#2E4336] mt-1">
        {sessions.length === 0 ? (
          <p className="text-xs text-[#9DB0A2] py-6 text-center">No session requests found.</p>
        ) : (
          sessions.map((req) => (
            <div
              key={req.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-[#EEF3E8] truncate">
                    {req.topic || 'Mentorship Guidance'}
                  </p>
                  <StatusBadge status={req.status} />
                </div>
                <p className="text-xs text-[#9DB0A2] truncate">
                  From <span className="text-[#EEF3E8]">{req.requesterName}</span> for{' '}
                  <span className="text-[#B7FF72]">{req.alumniName}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono text-[#9DB0A2] shrink-0">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Recent'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
