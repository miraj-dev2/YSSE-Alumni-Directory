import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../hooks/useDashboard';
import { useToast } from '../../context/ToastContext';
import { AlumniProfile } from '../../types/admin';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { DashboardStatCards } from '../../components/admin/DashboardStatCards';
import { DashboardDirectoryCard } from '../../components/admin/DashboardDirectoryCard';
import { AlumniGrowthChart } from '../../components/charts/AlumniGrowthChart';
import { AlumniWingDonut } from '../../components/charts/AlumniWingDonut';
import { AlumniFormModal } from '../../components/admin/AlumniFormModal';
import { alumniApi } from '../../api/alumniApi';
import { TileSkeleton, ErrorState } from '../../components/common/SkeletonLoader';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    stats, growthData, growthInterval, setGrowthInterval, wingData, directoryItems,
    activeTab, setActiveTab, openToSessionsOnly, setOpenToSessionsOnly,
    selectedIds, toggleSelect, toggleSelectAll, isLoading, error, retry,
  } = useDashboard();

  const { success, error: toastError } = useToast();
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AlumniProfile | null>(null);
  const [period, setPeriod] = useState('This month');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (values: any) => {
    try {
      if (editingItem) {
        await alumniApi.updateAlumnus(editingItem.id, values);
        success('Profile Updated', `${values.name}'s details saved.`);
      } else {
        await alumniApi.createAlumnus(values);
        success('Alumnus Added', `${values.name} enrolled into directory.`);
      }
      setFormModalOpen(false);
      retry();
    } catch {
      toastError('Save Error', 'Could not save alumnus profile.');
    }
  };

  const handleBulkAction = () => {
    success('Bulk Selected', `Processing batch operations for ${selectedIds.size} alumni.`);
  };

  if (isLoading || !stats) {
    return (
      <div className="space-y-7">
        <AdminPageHeader onAddAlumnus={handleOpenAdd} />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <TileSkeleton /><TileSkeleton /><TileSkeleton /><TileSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-7">
        <AdminPageHeader onAddAlumnus={handleOpenAdd} />
        <ErrorState title="Failed to load dashboard metrics" message={error} onRetry={retry} />
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <AdminPageHeader
        name={user?.name || 'Administrator'}
        period={period}
        onPeriodChange={setPeriod}
        onAddAlumnus={handleOpenAdd}
      />

      <DashboardStatCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Directory Card (~70% width) */}
        <div className="lg:col-span-8">
          <DashboardDirectoryCard
            items={directoryItems}
            activeTab={activeTab}
            onTabChange={(tab) => {
              if (tab === 'Approvals') navigate('/admin/approvals');
              else if (tab === 'Sessions') navigate('/admin/sessions');
              else setActiveTab(tab);
            }}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
            openToSessionsOnly={openToSessionsOnly}
            onToggleOpenToSessions={setOpenToSessionsOnly}
            onViewAlumnus={(item) => navigate(`/alumni/${item.id}`)}
            onEditAlumnus={(item) => {
              setEditingItem(item);
              setFormModalOpen(true);
            }}
            onBulkAction={handleBulkAction}
          />
        </div>

        {/* Right Column: Growth & Wing Charts (~30% width) */}
        <div className="lg:col-span-4 space-y-6">
          <AlumniGrowthChart
            data={growthData}
            interval={growthInterval}
            onIntervalChange={setGrowthInterval}
          />
          <AlumniWingDonut data={wingData} />
        </div>
      </div>

      <AlumniFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
      />
    </div>
  );
};
