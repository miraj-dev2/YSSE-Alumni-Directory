import React from 'react';
import { Check, X } from 'lucide-react';
import { AlumniProfile } from '../../types/admin';
import { StatusBadge } from '../common/StatusBadge';

interface ApprovalsTableProps {
  items: AlumniProfile[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onApproveSingle: (id: string) => void;
  onRejectSingle: (item: AlumniProfile) => void;
  isSubmitting?: boolean;
}

export const ApprovalsTable: React.FC<ApprovalsTableProps> = ({
  items, selectedIds, onToggleSelect, onToggleSelectAll,
  onApproveSingle, onRejectSingle, isSubmitting = false,
}) => {
  const allSelected = items.length > 0 && selectedIds.size === items.length;

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto border border-[#2E4336] rounded bg-[#1F3027]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#18251D] text-[#9DB0A2] font-mono uppercase text-[11px] border-b border-[#2E4336]">
            <tr>
              <th className="p-3 w-10">
                <input
                  type="checkbox" checked={allSelected} onChange={onToggleSelectAll}
                  disabled={isSubmitting} aria-label="Select all"
                  className="rounded bg-[#1F3027] border-[#2E4336] text-[#B7FF72] h-4 w-4"
                />
              </th>
              <th className="p-3">Applicant</th>
              <th className="p-3">Batch & Wing</th>
              <th className="p-3">Organization</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2E4336]">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-[#18251D]/50 transition-colors">
                <td className="p-3">
                  <input
                    type="checkbox" checked={selectedIds.has(item.id)}
                    onChange={() => onToggleSelect(item.id)} disabled={isSubmitting}
                    className="rounded bg-[#1F3027] border-[#2E4336] text-[#B7FF72] h-4 w-4"
                  />
                </td>
                <td className="p-3">
                  <p className="font-semibold text-[#EEF3E8]">{item.name}</p>
                  <p className="text-[11px] text-[#9DB0A2]">{item.email}</p>
                </td>
                <td className="p-3">
                  <p className="text-[#EEF3E8]">{item.batch}</p>
                  <p className="text-[11px] text-[#9DB0A2]">{item.wing}</p>
                </td>
                <td className="p-3">
                  <p className="text-[#EEF3E8]">{item.organization}</p>
                  <p className="text-[11px] text-[#9DB0A2]">{item.currentRole}</p>
                </td>
                <td className="p-3">
                  <StatusBadge status={item.status} />
                  {item.rejectionReason && (
                    <p className="text-[10px] text-[#E8A598] mt-1 max-w-[180px] truncate" title={item.rejectionReason}>
                      {item.rejectionReason}
                    </p>
                  )}
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {item.status !== 'APPROVED' && (
                      <button
                        type="button" onClick={() => onApproveSingle(item.id)} disabled={isSubmitting}
                        className="min-h-[44px] px-3 rounded bg-[#B7FF72] text-[#18251D] font-semibold flex items-center gap-1 hover:opacity-90 disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" /> <span>Approve</span>
                      </button>
                    )}
                    {item.status !== 'REJECTED' && (
                      <button
                        type="button" onClick={() => onRejectSingle(item)} disabled={isSubmitting}
                        className="min-h-[44px] px-3 rounded bg-[#18251D] border border-[#E8A598]/50 text-[#E8A598] font-semibold flex items-center gap-1 hover:bg-[#E8A598]/10 disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" /> <span>Reject</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List (< 768px) */}
      <div className="md:hidden space-y-3">
        {items.map((item) => (
          <div key={item.id} className="p-4 rounded border border-[#2E4336] bg-[#1F3027] space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox" checked={selectedIds.has(item.id)}
                  onChange={() => onToggleSelect(item.id)} disabled={isSubmitting}
                  className="rounded bg-[#1F3027] border-[#2E4336] text-[#B7FF72] h-5 w-5"
                />
                <div>
                  <h3 className="text-sm font-semibold text-[#EEF3E8]">{item.name}</h3>
                  <p className="text-xs text-[#9DB0A2]">{item.email}</p>
                </div>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <div className="text-xs text-[#9DB0A2] bg-[#18251D] p-2 rounded border border-[#2E4336]">
              {item.batch} • {item.wing} | {item.currentRole} at {item.organization}
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2E4336]">
              {item.status !== 'APPROVED' && (
                <button
                  type="button" onClick={() => onApproveSingle(item.id)} disabled={isSubmitting}
                  className="min-h-[44px] flex-1 px-3 rounded bg-[#B7FF72] text-[#18251D] font-semibold flex items-center justify-center gap-1"
                >
                  <Check className="w-4 h-4" /> Approve
                </button>
              )}
              {item.status !== 'REJECTED' && (
                <button
                  type="button" onClick={() => onRejectSingle(item)} disabled={isSubmitting}
                  className="min-h-[44px] flex-1 px-3 rounded bg-[#18251D] border border-[#E8A598]/50 text-[#E8A598] font-semibold flex items-center justify-center gap-1"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
