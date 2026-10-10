// DEMO API: Dashboard analytics aggregation
import { DashboardStats, GrowthPoint, WingDonutPoint } from '../types/admin';
import { alumniApi } from './alumniApi';
import { sessionApi } from './sessionApi';

const WING_COLORS: Record<string, string> = {
  'YSSE IT': '#B7FF72',
  'Marketing & PR': '#6C9BCF',
  'HR & Talent': '#E9C46A',
  'Finance & Sponsorship': '#4ADE80',
  'Creative & Content': '#F472B6',
  'Operations & Logistics': '#A78BFA',
};

export const dashboardApi = {
  async getDashboardStats(): Promise<DashboardStats> {
    const approvalsPending = await alumniApi.getApprovalsList('PENDING');
    const all = await alumniApi.getAlumniList({ page: 1, pageSize: 999 });
    const sessions = await sessionApi.getSessionRequests();
    const openToSessionsCount = all.data.filter((a) => a.openToSessions).length;

    return {
      totalAlumni: all.data.length,
      openToSessions: openToSessionsCount,
      pendingApprovals: approvalsPending.length,
      sessionRequests: sessions.length,
    };
  },

  async getAlumniGrowth(interval: 'yearly' | 'monthly'): Promise<GrowthPoint[]> {
    if (interval === 'yearly') {
      return [
        { period: '2019', count: 140 },
        { period: '2020', count: 280 },
        { period: '2021', count: 460 },
        { period: '2022', count: 690 },
        { period: '2023', count: 920 },
        { period: '2024', count: 1140 },
      ];
    }
    return [
      { period: 'Jan', count: 980 },
      { period: 'Feb', count: 1010 },
      { period: 'Mar', count: 1050 },
      { period: 'Apr', count: 1090 },
      { period: 'May', count: 1120 },
      { period: 'Jun', count: 1140 },
    ];
  },

  async getWingDistribution(): Promise<WingDonutPoint[]> {
    const all = await alumniApi.getAlumniList({ page: 1, pageSize: 999 });
    const countMap: Record<string, number> = {};
    all.data.forEach((a) => {
      const w = a.wing || 'General';
      countMap[w] = (countMap[w] || 0) + 1;
    });

    const total = all.data.length || 1;
    return Object.entries(countMap).map(([wing, count]) => ({
      wing,
      count,
      percentage: Math.round((count / total) * 100),
      color: WING_COLORS[wing] || '#9DB0A2',
    })).sort((a, b) => b.count - a.count);
  },
};
