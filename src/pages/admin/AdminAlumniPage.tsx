import React, { useState } from 'react';
import { useAlumniAdmin } from '../../hooks/useAlumniAdmin';
import { useToast } from '../../context/ToastContext';
import { AlumniProfile } from '../../types/admin';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AlumniFilters } from '../../components/admin/AlumniFilters';
import { AlumniTable } from '../../components/admin/AlumniTable';
import { AlumniPagination } from '../../components/admin/AlumniPagination';
import { AlumniFormModal } from '../../components/admin/AlumniFormModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { TableRowSkeleton, ErrorState } from '../../components/common/SkeletonLoader';

export const AdminAlumniPage: React.FC = () => {
  const {
    query, items, total, totalPages, isLoading, error, updateQuery,
    toggleSort, createAlumnus, updateAlumnus, deleteAlumnus, exportCsv, retry,
  } = useAlumniAdmin();

  const { success, error: toastError } = useToast();
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AlumniProfile | null>(null);
  const [deletingItem, setDeletingItem] = useState<AlumniProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => { setEditingItem(null); setFormModalOpen(true); };
  const handleOpenEdit = (item: AlumniProfile) => { setEditingItem(item); setFormModalOpen(true); };

  const handleFormSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateAlumnus(editingItem.id, values);
        success('Alumnus Updated', `${values.name}'s profile was updated.`);
      } else {
        await createAlumnus(values);
        success('Alumnus Added', `${values.name} has been enrolled.`);
      }
      setFormModalOpen(false);
    } catch {
      toastError('Save Failed', 'Could not save profile details.');
    } finally { setIsSubmitting(false); }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setIsSubmitting(true);
    try {
      await deleteAlumnus(deletingItem.id);
      success('Alumnus Removed', `${deletingItem.name} was removed.`);
      setDeletingItem(null);
    } catch {
      toastError('Delete Failed', 'Could not remove alumnus.');
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Alumni Directory"
        subtitle="Search, filter, edit and maintain all registered YSSE fellows."
        showPeriodFilter={false}
        onAddAlumnus={handleOpenAdd}
      />

      <div className="space-y-5">
        <AlumniFilters query={query} onUpdateQuery={updateQuery} onExportCsv={exportCsv} />

        <div className="bg-[#1F3027] border border-[#2E4336] rounded-[22px] p-6 space-y-4">
          {isLoading ? (
            <div className="space-y-2"><TableRowSkeleton /><TableRowSkeleton /><TableRowSkeleton /></div>
          ) : error ? (
            <ErrorState title="Failed to Load Alumni" message={error} onRetry={retry} />
          ) : items.length === 0 ? (
            <EmptyState
              title="No alumni match your criteria"
              description="Try clearing search terms or resetting filters."
              actionText="Reset Search"
              onAction={() => updateQuery({ search: '', batch: 'all', wing: 'all', status: 'all' })}
            />
          ) : (
            <>
              <AlumniTable
                items={items}
                sortBy={query.sortBy}
                sortOrder={query.sortOrder}
                onSort={toggleSort}
                onEdit={handleOpenEdit}
                onDelete={(item) => setDeletingItem(item)}
              />
              <AlumniPagination
                page={query.page}
                pageSize={query.pageSize}
                total={total}
                totalPages={totalPages}
                onPageChange={(page) => updateQuery({ page })}
              />
            </>
          )}
        </div>
      </div>

      <AlumniFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
        isSubmitting={isSubmitting}
      />

      <ConfirmDialog
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Alumni Record"
        description={`Are you sure you want to delete ${deletingItem?.name || 'this member'}?`}
        confirmText="Delete Record"
        isDestructive={true}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
