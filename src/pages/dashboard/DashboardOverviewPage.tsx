import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { portalApi } from '../../api/portalApi';
import { useAuth } from '../../context/AuthContext';
import { DashboardStatsData } from '../../types/portal';
import { DashboardGreeting } from '../../components/dashboard/DashboardGreeting';
import { AlumniDashboardView } from '../../components/dashboard/AlumniDashboardView';
import { MemberDashboardView } from '../../components/dashboard/MemberDashboardView';

export const DashboardOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const outletCtx = useOutletContext<{ refreshBadges: () => void }>();
  const refreshBadges = outletCtx?.refreshBadges;
  const [data, setData] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await portalApi.getDashboardStats();
      setData(res);
      refreshBadges?.();
    } catch (err: any) {
      setError(err?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [refreshBadges]);

  useEffect(() => {
    if (user?.role !== 'admin') {
      fetchStats();
    }
  }, [fetchStats, user?.role]);

  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="w-8 h-8 text-[#B7FF72] animate-spin mb-3" />
        <p className="text-xs text-[#9DB0A2]">Loading your personal dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-[#1F3027] border border-red-500/30 rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
        <h3 className="text-sm font-semibold text-[#EEF3E8]">Unable to load dashboard</h3>
        <p className="text-xs text-[#9DB0A2]">{error || 'An unexpected error occurred.'}</p>
        <button
          onClick={fetchStats}
          className="btn-primary !h-9 text-xs font-semibold gap-2 inline-flex items-center"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardGreeting role={data.role} />
      {data.role === 'alumni' ? (
        <AlumniDashboardView data={data} onRefresh={fetchStats} />
      ) : (
        <MemberDashboardView data={data} onRefresh={fetchStats} />
      )}
    </div>
  );
};
