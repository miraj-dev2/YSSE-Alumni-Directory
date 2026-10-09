import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Papa from 'papaparse';
import { adminService } from '../../services/adminService';
import { alumniService } from '../../services/alumniService';
import { useToast } from '../../context/ToastContext';
import { AlumniProfile } from '../../types';
import { Avatar } from '../../components/shared/Avatar';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Drawer } from '../../components/shared/Drawer';
import { Modal } from '../../components/shared/Modal';
import {
  Download,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Save,
  ArrowUpDown,
  Filter,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminAlumniPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [batchFilter, setBatchFilter] = useState('all');
  const [wingFilter, setWingFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openToSessionsFilter, setOpenToSessionsFilter] = useState<boolean | undefined>(undefined);

  // Table options
  const [density, setDensity] = useState<'compact' | 'comfortable'>('compact');
  const [sortBy, setSortBy] = useState<'name' | 'batch' | 'updatedAt'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Edit Drawer state
  const [editingAlumnus, setEditingAlumnus] = useState<AlumniProfile | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<AlumniProfile>>({});

  // Delete Confirm Modal
  const [deletingAlumnus, setDeletingAlumnus] = useState<AlumniProfile | null>(null);

  // Query options
  const { data: options = { batches: [], wings: [], companies: [], cities: [], fields: [] } } = useQuery({
    queryKey: ['filterOptions'],
    queryFn: () => alumniService.getDistinctFilterOptions(),
  });

  // Query alumni
  const { data: rawList = [], isLoading } = useQuery({
    queryKey: ['adminAllAlumni', search, batchFilter, wingFilter, countryFilter, statusFilter, openToSessionsFilter],
    queryFn: () =>
      adminService.getAllAlumni({
        search,
        batch: batchFilter,
        wing: wingFilter,
        country: countryFilter,
        status: statusFilter,
        openToSessions: openToSessionsFilter,
      }),
  });

  // Sort and Paginate
  const sortedList = useMemo(() => {
    const list = [...rawList];
    list.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortBy === 'batch') cmp = a.batch.localeCompare(b.batch);
      else if (sortBy === 'updatedAt') cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [rawList, sortBy, sortOrder]);

  const totalPages = Math.ceil(sortedList.length / pageSize) || 1;
  const paginatedList = sortedList.slice((page - 1) * pageSize, page * pageSize);

  // Mutations
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<AlumniProfile> }) =>
      adminService.updateAlumnus(id, updates),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['adminAllAlumni'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
      success('Record Updated', `${updated.name}'s information was saved.`);
      setEditingAlumnus(null);
    },
    onError: () => error('Update failed', 'Could not update alumnus.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteAlumnus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAllAlumni'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
      success('Alumnus Deleted', 'The profile was permanently deleted.');
      setDeletingAlumnus(null);
    },
    onError: () => error('Delete failed', 'Could not delete profile.'),
  });

  const handleToggleSort = (column: 'name' | 'batch' | 'updatedAt') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(paginatedList.map((a) => a.id));
    else setSelectedIds([]);
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter((i) => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const handleOpenEdit = (alumnus: AlumniProfile) => {
    setEditingAlumnus(alumnus);
    setEditFormData({ ...alumnus });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlumnus) return;
    updateMutation.mutate({ id: editingAlumnus.id, updates: editFormData });
  };

  const handleToggleHide = (alumnus: AlumniProfile) => {
    const nextStatus = alumnus.approvalStatus === 'Approved' ? 'Pending' : 'Approved';
    updateMutation.mutate({ id: alumnus.id, updates: { approvalStatus: nextStatus } });
  };

  // Export Filtered CSV (respects current filters)
  const handleExportCsv = (onlySelected = false) => {
    const targetData = onlySelected
      ? sortedList.filter((a) => selectedIds.includes(a.id))
      : sortedList;

    if (targetData.length === 0) {
      error('Nothing to export', 'Zero alumni match the current export scope.');
      return;
    }

    const rows = targetData.map((a) => ({
      ID: a.id,
      Name: a.name,
      Email: a.email,
      Batch: a.batch,
      Wing: a.wing,
      Role: a.role,
      Organization: a.organization,
      City: a.city,
      Country: a.country,
      ApprovalStatus: a.approvalStatus,
      OpenToSessions: a.openToSessions ? 'Yes' : 'No',
      SessionTopic: a.sessionTopic || '',
      UpdatedAt: a.updatedAt,
    }));

    const csvString = Papa.unparse(rows);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ysse_alumni_${onlySelected ? 'selected' : 'filtered'}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    success('CSV Exported', `Downloaded ${rows.length} records.`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text">
            Alumni Master Directory
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Internal database table with live filtering, bulk exports, and inline editing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={() => handleExportCsv(true)}
              className="btn-secondary !min-h-[36px] h-[36px] text-xs px-3 gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Selected ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={() => handleExportCsv(false)}
            className="btn-primary !min-h-[36px] h-[36px] text-xs px-3.5 gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Filtered CSV ({sortedList.length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Density Toolbar */}
      <div className="bg-surface border border-border rounded-card p-4 space-y-3">
        {/* Row 1: Search and density */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email, organization, or role..."
              className="input-base pl-10 text-xs !min-h-[38px] h-[38px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted font-mono">Density:</span>
            <div className="flex items-center border border-border-strong rounded-md p-0.5 bg-surface-hover text-xs font-mono">
              <button
                onClick={() => setDensity('compact')}
                className={`px-2 py-1 rounded-sm ${density === 'compact' ? 'bg-surface text-accent' : 'text-muted'}`}
              >
                Compact
              </button>
              <button
                onClick={() => setDensity('comfortable')}
                className={`px-2 py-1 rounded-sm ${density === 'comfortable' ? 'bg-surface text-accent' : 'text-muted'}`}
              >
                Roomy
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Faceted Selects */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          <select
            value={batchFilter}
            onChange={(e) => {
              setBatchFilter(e.target.value);
              setPage(1);
            }}
            className="input-base text-xs !min-h-[34px] h-[34px] py-1"
          >
            <option value="all">All Batches</option>
            {options.batches.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select
            value={wingFilter}
            onChange={(e) => {
              setWingFilter(e.target.value);
              setPage(1);
            }}
            className="input-base text-xs !min-h-[34px] h-[34px] py-1"
          >
            <option value="all">All Wings</option>
            {options.wings.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="input-base text-xs !min-h-[34px] h-[34px] py-1"
          >
            <option value="all">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={openToSessionsFilter === undefined ? 'all' : String(openToSessionsFilter)}
            onChange={(e) => {
              const val = e.target.value;
              setOpenToSessionsFilter(val === 'all' ? undefined : val === 'true');
              setPage(1);
            }}
            className="input-base text-xs !min-h-[34px] h-[34px] py-1"
          >
            <option value="all">All Sessions</option>
            <option value="true">Open to Sessions</option>
            <option value="false">Not Offering</option>
          </select>

          <div className="flex items-center justify-end text-xs text-muted font-mono col-span-2 sm:col-span-1">
            <span>{sortedList.length} rows</span>
          </div>
        </div>
      </div>

      {/* Dense Table */}
      <div className="bg-surface border border-border rounded-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-hover text-muted font-mono uppercase text-[11px] border-b border-border sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={paginatedList.length > 0 && selectedIds.length === paginatedList.length}
                    onChange={handleSelectAll}
                    className="accent-[#B7FF72] rounded cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-3 cursor-pointer" onClick={() => handleToggleSort('name')}>
                  <div className="flex items-center gap-1">
                    <span>Alumnus</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3 cursor-pointer" onClick={() => handleToggleSort('batch')}>
                  <div className="flex items-center gap-1">
                    <span>Batch / Wing</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3">Role & Organization</th>
                <th className="py-2.5 px-3">Sessions</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 cursor-pointer" onClick={() => handleToggleSort('updatedAt')}>
                  <div className="flex items-center gap-1">
                    <span>Updated</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={8} className="py-4 px-3 h-9 bg-surface-hover/20" />
                  </tr>
                ))
              ) : paginatedList.length > 0 ? (
                paginatedList.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-surface-hover/50 transition-colors ${
                      density === 'compact' ? 'py-1.5' : 'py-3.5'
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleToggleSelect(item.id)}
                        className="accent-[#B7FF72] rounded cursor-pointer"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={item.photoUrl} name={item.name} size="sm" className="!rounded-md" />
                        <div>
                          <span className="font-semibold text-text block leading-tight">{item.name}</span>
                          <span className="text-[11px] text-muted font-mono">{item.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="chip bg-surface-hover text-accent text-[10px] block w-fit mb-0.5">
                        {item.batch}
                      </span>
                      <span className="text-[11px] text-muted truncate max-w-[120px] block">
                        {item.wing}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-medium text-text block">{item.role}</span>
                      <span className="text-muted block">{item.organization}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      {item.openToSessions ? (
                        <span className="chip bg-accent/15 text-accent border-accent/25 text-[10px]">
                          Yes ({item.sessionFormat})
                        </span>
                      ) : (
                        <span className="text-muted text-[11px]">No</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={item.approvalStatus} />
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-muted whitespace-nowrap">
                      {item.updatedAt}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/alumni/${item.id}`}
                          className="p-1 rounded text-muted hover:text-text hover:bg-surface-hover"
                          title="View public profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1 rounded text-muted hover:text-accent hover:bg-surface-hover"
                          title="Edit record"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleHide(item)}
                          className="p-1 rounded text-muted hover:text-status-pending hover:bg-surface-hover"
                          title={item.approvalStatus === 'Approved' ? 'Hide from directory' : 'Un-hide'}
                        >
                          <EyeOff className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingAlumnus(item)}
                          className="p-1 rounded text-muted hover:text-status-rejected hover:bg-surface-hover"
                          title="Delete alumnus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted">
                    No alumni records match the specified filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="p-3 bg-surface-hover/40 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="bg-surface border border-border-strong rounded px-2 py-1 text-xs"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sortedList.length)} of {sortedList.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded border border-border bg-surface text-muted hover:text-text disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded border border-border bg-surface text-muted hover:text-text disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Drawer */}
      {editingAlumnus && (
        <Drawer
          isOpen={Boolean(editingAlumnus)}
          onClose={() => setEditingAlumnus(null)}
          title={`Edit Record: ${editingAlumnus.name}`}
          description={`Alumni ID: ${editingAlumnus.id}`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-text mb-1">Full Name</label>
              <input
                type="text"
                value={editFormData.name || ''}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="input-base text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">Email</label>
              <input
                type="email"
                value={editFormData.email || ''}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                className="input-base text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text mb-1">Role</label>
                <input
                  type="text"
                  value={editFormData.role || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  className="input-base text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text mb-1">Organization</label>
                <input
                  type="text"
                  value={editFormData.organization || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, organization: e.target.value })}
                  className="input-base text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text mb-1">Cohort Batch</label>
                <input
                  type="text"
                  value={editFormData.batch || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, batch: e.target.value })}
                  className="input-base text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text mb-1">Wing</label>
                <input
                  type="text"
                  value={editFormData.wing || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, wing: e.target.value })}
                  className="input-base text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">Approval Status</label>
              <select
                value={editFormData.approvalStatus || 'Approved'}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, approvalStatus: e.target.value as any })
                }
                className="input-base text-xs cursor-pointer"
              >
                <option value="Approved">Approved (Public)</option>
                <option value="Pending">Pending Review</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="pt-4 border-t border-border flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingAlumnus(null)}
                className="btn-secondary !min-h-[36px] h-[36px] text-xs px-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="btn-primary !min-h-[36px] h-[36px] text-xs px-5 gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </Drawer>
      )}

      {/* Delete Confirmation Modal naming the item */}
      {deletingAlumnus && (
        <Modal
          isOpen={Boolean(deletingAlumnus)}
          onClose={() => setDeletingAlumnus(null)}
          title="Delete Alumnus Record"
          description={`Are you sure you want to permanently delete ${deletingAlumnus.name}? This action cannot be undone.`}
        >
          <div className="space-y-4 text-xs">
            <p className="p-3 bg-status-rejected-bg border border-status-rejected/30 rounded-md text-status-rejected">
              Deleting <strong>{deletingAlumnus.name}</strong> ({deletingAlumnus.email}) will remove their directory listing, career history, and mentorship offerings.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingAlumnus(null)}
                className="btn-secondary !min-h-[36px] h-[36px] text-xs px-3"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(deletingAlumnus.id)}
                className="btn-danger !min-h-[36px] h-[36px] text-xs px-4 gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete {deletingAlumnus.name}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
