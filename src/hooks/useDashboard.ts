import { useState, useEffect, useCallback } from 'react';
import { DashboardStats, GrowthPoint, WingDonutPoint, AlumniProfile } from '../types/admin';
import { dashboardApi } from '../api/dashboardApi';
import { alumniApi } from '../api/alumniApi';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [growthData, setGrowthData] = useState<GrowthPoint[]>([]);
  const [growthInterval, setGrowthInterval] = useState<'yearly' | 'monthly'>('yearly');
  const [wingData, setWingData] = useState<WingDonutPoint[]>([]);
  const [directoryItems, setDirectoryItems] = useState<AlumniProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'Directory' | 'Approvals' | 'Sessions'>('Directory');
  const [openToSessionsOnly, setOpenToSessionsOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [s, g, w] = await Promise.all([
        dashboardApi.getDashboardStats(),
        dashboardApi.getAlumniGrowth(growthInterval),
        dashboardApi.getWingDistribution(),
      ]);
      setStats(s);
      setGrowthData(g);
      setWingData(w);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics');
    } finally {
      setIsLoading(false);
    }
  }, [growthInterval]);

  const fetchDirectoryItems = useCallback(async () => {
    try {
      let statusFilter: string | undefined = undefined;
      if (activeTab === 'Approvals') statusFilter = 'PENDING';
      const res = await alumniApi.getAlumniList({
        page: 1,
        pageSize: 10,
        status: statusFilter,
        openToSessionsOnly: openToSessionsOnly || undefined,
      });
      setDirectoryItems(res.data);
    } catch {
      // Fallback
    }
  }, [activeTab, openToSessionsOnly]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchDirectoryItems();
  }, [fetchDirectoryItems]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === directoryItems.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(directoryItems.map((i) => i.id)));
  };

  return {
    stats,
    growthData,
    growthInterval,
    setGrowthInterval,
    wingData,
    directoryItems,
    activeTab,
    setActiveTab,
    openToSessionsOnly,
    setOpenToSessionsOnly,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    isLoading,
    error,
    retry: fetchDashboardData,
  };
};
