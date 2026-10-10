import React from 'react';
import { Check, CheckCircle2, User, Mail, MessageSquare } from 'lucide-react';
import { SessionRequest } from '../../types/admin';
import { StatusBadge } from '../common/StatusBadge';

interface SessionRequestsListProps {
  items: SessionRequest[];
  onAccept: (id: string) => void;
  onMarkDone: (id: string) => void;
  isSubmitting?: boolean;
}

export const SessionRequestsList: React.FC<SessionRequestsListProps> = ({
  items,
  onAccept,
  onMarkDone,
  isSubmitting = false,
}) => {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const canAccept = item.status === 'PENDING';
        const canMarkDone = item.status !== 'DONE';

        return (
          <div
            key={item.id}
            className="p-5 rounded border border-[#2E4336] bg-[#1F3027] flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold font-heading text-[#EEF3E8]">
                  {item.topic || 'Mentorship Guidance'}
                </h3>
                <StatusBadge status={item.status} />
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#9DB0A2]">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#B7FF72]" />
                  <span>Requester: <strong className="text-[#EEF3E8]">{item.requesterName}</strong></span>
                </div>
                {item.requesterEmail && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{item.requesterEmail}</span>
                  </div>
                )}
                <div>
                  Target Mentor: <strong className="text-[#B7FF72]">{item.alumniName}</strong>
                </div>
              </div>

              {item.message && (
                <div className="bg-[#18251D] p-3 rounded border border-[#2E4336] text-xs text-[#EEF3E8] flex items-start gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-[#9DB0A2] mt-0.5 shrink-0" />
                  <p className="italic font-sans">"{item.message}"</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              {canAccept && (
                <button
                  type="button"
                  onClick={() => onAccept(item.id)}
                  disabled={isSubmitting}
                  className="min-h-[44px] px-3.5 rounded bg-[#B7FF72] text-[#18251D] text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept Booking</span>
                </button>
              )}

              {canMarkDone && (
                <button
                  type="button"
                  onClick={() => onMarkDone(item.id)}
                  disabled={isSubmitting}
                  className="min-h-[44px] px-3.5 rounded bg-[#18251D] border border-[#2E4336] text-[#EEF3E8] text-xs font-semibold flex items-center gap-1.5 hover:border-[#B7FF72] hover:text-[#B7FF72] disabled:opacity-50 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Done</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
