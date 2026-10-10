import React from 'react';
import { ArrowUpDown, Edit, Trash2 } from 'lucide-react';
import { AlumniProfile } from '../../types/admin';
import { StatusBadge } from '../common/StatusBadge';

interface AlumniTableProps {
  items: AlumniProfile[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort: (field: 'name' | 'batch' | 'wing' | 'organization') => void;
  onEdit: (item: AlumniProfile) => void;
  onDelete: (item: AlumniProfile) => void;
}

export const AlumniTable: React.FC<AlumniTableProps> = ({
  items,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
}) => {
  const renderSortIndicator = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown className="w-3 h-3 text-[#9DB0A2]/50 inline ml-1" />;
    return (
      <span className="text-[#B7FF72] text-[10px] ml-1 font-mono">
        {sortOrder === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto border border-[#2E4336] rounded bg-[#1F3027]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#18251D] text-[#9DB0A2] font-mono uppercase text-[11px] border-b border-[#2E4336]">
            <tr>
              <th className="p-3 cursor-pointer hover:text-[#EEF3E8]" onClick={() => onSort('name')}>
                Alumnus {renderSortIndicator('name')}
              </th>
              <th className="p-3 cursor-pointer hover:text-[#EEF3E8]" onClick={() => onSort('batch')}>
                Batch {renderSortIndicator('batch')}
              </th>
              <th className="p-3 cursor-pointer hover:text-[#EEF3E8]" onClick={() => onSort('wing')}>
                Wing {renderSortIndicator('wing')}
              </th>
              <th className="p-3 cursor-pointer hover:text-[#EEF3E8]" onClick={() => onSort('organization')}>
                Role & Org {renderSortIndicator('organization')}
              </th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2E4336]">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-[#18251D]/50 transition-colors">
                <td className="p-3">
                  <p className="font-semibold text-[#EEF3E8]">{item.name}</p>
                  <p className="text-[11px] text-[#9DB0A2]">{item.email}</p>
                </td>
                <td className="p-3 font-mono text-[#EEF3E8]">{item.batch}</td>
                <td className="p-3 text-[#9DB0A2]">{item.wing}</td>
                <td className="p-3">
                  <p className="text-[#EEF3E8]">{item.currentRole}</p>
                  <p className="text-[11px] text-[#9DB0A2]">{item.organization}</p>
                </td>
                <td className="p-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      aria-label={`Edit ${item.name}`}
                      className="p-2 text-[#9DB0A2] hover:text-[#B7FF72] min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      aria-label={`Delete ${item.name}`}
                      className="p-2 text-[#9DB0A2] hover:text-[#E8A598] min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-[#EEF3E8]">{item.name}</h3>
                <p className="text-xs text-[#9DB0A2]">{item.email}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>

            <div className="text-xs text-[#9DB0A2] space-y-1 bg-[#18251D] p-2.5 rounded border border-[#2E4336]">
              <p><span className="text-[#EEF3E8]">Batch:</span> {item.batch} • {item.wing}</p>
              <p><span className="text-[#EEF3E8]">Role:</span> {item.currentRole} at {item.organization}</p>
              <p><span className="text-[#EEF3E8]">Location:</span> {item.location}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2E4336]">
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="min-h-[44px] flex-1 px-3 rounded bg-[#18251D] border border-[#2E4336] text-[#EEF3E8] text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
              <button
                type="button"
                onClick={() => onDelete(item)}
                className="min-h-[44px] px-3 rounded bg-[#18251D] border border-[#E8A598]/50 text-[#E8A598] text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
