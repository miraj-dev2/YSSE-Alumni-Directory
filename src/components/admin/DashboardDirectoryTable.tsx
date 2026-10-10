import React from 'react';
import { Eye, Edit2, MoreVertical } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { AlumniProfile } from '../../types/admin';

interface DashboardDirectoryTableProps {
  items: AlumniProfile[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onViewAlumnus: (item: AlumniProfile) => void;
  onEditAlumnus: (item: AlumniProfile) => void;
}

export const DashboardDirectoryTable: React.FC<DashboardDirectoryTableProps> = ({
  items, selectedIds, onToggleSelect, onToggleSelectAll, onViewAlumnus, onEditAlumnus,
}) => {
  const allSelected = items.length > 0 && selectedIds.size === items.length;

  return (
    <>
      {/* Desktop Table (>= 768px) */}
      <div className="hidden md:block overflow-x-auto mt-4 rounded-xl border border-[#2E4336]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#26382E] text-[#9DB0A2] font-mono uppercase text-[11px] border-b border-[#2E4336]">
            <tr>
              <th className="p-3 w-10">
                <input
                  type="checkbox" checked={allSelected} onChange={onToggleSelectAll}
                  aria-label="Select all" className="rounded bg-[#18251D] border-[#2E4336] text-[#B7FF72] h-4 w-4"
                />
              </th>
              <th className="p-3">Alumni</th>
              <th className="p-3">Batch</th>
              <th className="p-3">Wing</th>
              <th className="p-3">Current role</th>
              <th className="p-3">Location</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2E4336]">
            {items.map((alumnus) => (
              <tr key={alumnus.id} className="hover:bg-[#18251D]/60 transition-colors">
                <td className="p-3">
                  <input
                    type="checkbox" checked={selectedIds.has(alumnus.id)}
                    onChange={() => onToggleSelect(alumnus.id)} aria-label={`Select ${alumnus.name}`}
                    className="rounded bg-[#18251D] border-[#2E4336] text-[#B7FF72] h-4 w-4"
                  />
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#2A4033] border border-[#2E4336] flex items-center justify-center text-[#B7FF72] font-bold text-xs shrink-0">
                      {alumnus.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-[#EEF3E8] block truncate">{alumnus.name}</span>
                      <span className="text-[10px] text-[#9DB0A2] block truncate">{alumnus.email}</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 font-mono text-[#EEF3E8]">{alumnus.batch}</td>
                <td className="p-3 text-[#9DB0A2]">{alumnus.wing}</td>
                <td className="p-3">
                  <span className="text-[#EEF3E8] block">{alumnus.currentRole}</span>
                  <span className="text-[10px] text-[#9DB0A2] block">{alumnus.organization}</span>
                </td>
                <td className="p-3 text-[#9DB0A2]">{alumnus.location}</td>
                <td className="p-3">
                  <span className={`inline-block font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                    alumnus.status === 'APPROVED' ? 'bg-[#B7FF72] text-[#18251D]' :
                    alumnus.status === 'PENDING' ? 'bg-[#3D3619] text-[#E9C46A]' : 'bg-[#E8A598]/20 text-[#E8A598]'
                  }`}>
                    {alumnus.status === 'APPROVED' ? 'Verified' : alumnus.status === 'PENDING' ? 'Pending' : 'Rejected'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => onViewAlumnus(alumnus)} className="p-1.5 text-[#9DB0A2] hover:text-[#B7FF72] rounded min-h-[36px] min-w-[36px] flex items-center justify-center" aria-label={`View ${alumnus.name}`}>
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => onEditAlumnus(alumnus)} className="p-1.5 text-[#9DB0A2] hover:text-[#EEF3E8] rounded min-h-[36px] min-w-[36px] flex items-center justify-center" aria-label={`Edit ${alumnus.name}`}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button type="button" className="p-1.5 text-[#9DB0A2] hover:text-[#EEF3E8] rounded min-h-[36px] min-w-[36px] flex items-center justify-center" aria-label={`More ${alumnus.name}`}>
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content align="end" className="z-50 min-w-[140px] bg-[#18251D] border border-[#2E4336] rounded-md p-1 text-xs text-[#EEF3E8] shadow-xl">
                          <DropdownMenu.Item onClick={() => navigator.clipboard.writeText(alumnus.email)} className="px-2.5 py-1.5 rounded cursor-pointer hover:bg-[#1F3027] outline-none">
                            Copy Email
                          </DropdownMenu.Item>
                          <DropdownMenu.Item onClick={() => window.open(alumnus.linkedinUrl, '_blank')} className="px-2.5 py-1.5 rounded cursor-pointer hover:bg-[#1F3027] outline-none">
                            LinkedIn Profile
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Stack (< 768px) */}
      <div className="md:hidden space-y-3 mt-4">
        {items.map((alumnus) => (
          <div key={alumnus.id} className="p-4 bg-[#18251D] border border-[#2E4336] rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#EEF3E8]">{alumnus.name}</span>
              <span className="font-mono text-[#B7FF72]">{alumnus.batch}</span>
            </div>
            <p className="text-[#9DB0A2]">{alumnus.currentRole} at {alumnus.organization}</p>
            <div className="flex items-center justify-between pt-2 border-t border-[#2E4336]">
              <span className="text-[10px] text-[#9DB0A2]">{alumnus.wing}</span>
              <button type="button" onClick={() => onViewAlumnus(alumnus)} className="text-[#B7FF72] font-semibold text-[11px]">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
