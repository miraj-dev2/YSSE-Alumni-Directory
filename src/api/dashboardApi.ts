import { DashboardStats, GrowthPoint, WingDonutPoint } from '../types/admin';
import { apiClient } from './client';

const WING_COLORS: Record<string, string> = {
  'IT': '#B7FF72',
  'YSSE IT': '#B7FF72',
  'Academy': '#6C9BCF',
  'Charity Hub': '#E9C46A',
  'Ekmutho Ahar': '#4ADE80',
  'Shop': '#F472B6',
  'Marketing & PR': '#6C9BCF',
  'HR & Talent': '#E9C46A'
};

export const dashboardApi = {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const res = await apiClient.get<any>('/admin/stats');
      const totals = res.data?.totals || {};
      return {
        totalAlumni: totals.alumni ?? 0,
        openToSessions: totals.openToSessions ?? 0,
        pendingApprovals: totals.pending ?? 0,
        sessionRequests: totals.sessionRequests ?? 0
      };
    } catch {
      return { totalAlumni: 0, openToSessions: 0, pendingApprovals: 0, sessionRequests: 0 };
    }
  },

  async getAlumniGrowth(_interval: 'yearly' | 'monthly' = 'monthly'): Promise<GrowthPoint[]> {
    try {
      const res = await apiClient.get<any>('/admin/stats');
      const growth = res.data?.growth || [];
      if (growth.length > 0) {
        return growth.map((g: any) => ({ period: g.month, count: g.count }));
      }
    } catch {
      // fallback
    }
    return [
      { period: '2023', count: 12 },
      { period: '2024', count: 28 },
      { period: '2025', count: 35 },
      { period: '2026', count: 40 }
    ];
  },

  async getWingDistribution(): Promise<WingDonutPoint[]> {
    try {
      const res = await apiClient.get<any>('/admin/stats');
      const byWing = res.data?.byWing || [];
      const total = res.data?.totals?.alumni || 1;

      return byWing.map((item: any) => ({
        wing: item.wing,
        count: item.count,
        percentage: Math.round((item.count / total) * 100),
        color: WING_COLORS[item.wing] || '#9DB0A2'
      })).sort((a: any, b: any) => b.count - a.count);
    } catch {
      return [];
    }
  }
};
