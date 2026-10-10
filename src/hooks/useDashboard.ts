import { useState, useEffect, useCallback } from 'react';
import { DashboardStats, ChartBarData, AlumniProfile, SessionRequest } from '../types/admin';
import { dashboardApi } from '../api/dashboardApi';
import { alumniApi } from '../api/alumniApi';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [batchData, setBatchData] = useState<ChartBarData[]>([]);
  const [wingData, setWingData] = useState<ChartBarData[]>([]);
  const [needsReview, setNeedsReview] = useState<AlumniProfile[]>([]);
  const [recentSessions, setRecentSessions] = useState<SessionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [s, batches, wings, review, sessions] = await Promise.all([
        dashboardApi.getDashboardStats(),
        dashboardApi.getBatchDistribution(),
        dashboardApi.getWingDistribution(),
        dashboardApi.getNeedsReviewList(),
        dashboardApi.getRecentSessionRequests(),
      ]);
      setStats(s);
      setBatchData(batches);
      setWingData(wings);
      setNeedsReview(review);
      setRecentSessions(sessions);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleApprove = async (id: string) => {
    setActionInProgressId(id);
    try {
      await alumniApi.approveAlumnus(id);
      await fetchDashboardData();
      return true;
    } catch {
      return false;
    } finally {
      setActionInProgressId(null);
    }
  };

  const handleReject = async (id: string, reason: string) => {
    setActionInProgressId(id);
    try {
      await alumniApi.rejectAlumnus(id, reason);
      await fetchDashboardData();
      return true;
    } catch {
      return false;
    } finally {
      setActionInProgressId(null);
    }
  };

  return {
    stats,
    batchData,
    wingData,
    needsReview,
    recentSessions,
    isLoading,
    error,
    actionInProgressId,
    retry: fetchDashboardData,
    approveAlumnus: handleApprove,
    rejectAlumnus: handleReject,
  };
};
