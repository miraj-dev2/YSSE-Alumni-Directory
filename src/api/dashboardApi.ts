// DEMO API: Dashboard analytics aggregation from in-memory stores
import { DashboardStats, ChartBarData, AlumniProfile, SessionRequest } from '../types/admin';
import { alumniApi } from './alumniApi';
import { sessionApi } from './sessionApi';

export const dashboardApi = {
  async getDashboardStats(): Promise<DashboardStats> {
    const approvalsPending = await alumniApi.getApprovalsList('PENDING');
    const all = await alumniApi.getAlumniList({ page: 1, pageSize: 999 });
    const sessions = await sessionApi.getSessionRequests();

    const openToSessionsCount = all.data.filter((a) => a.openToSessions).length;

    return {
      totalAlumni: all.data.length,
      pendingApprovals: approvalsPending.length,
      openToSessions: openToSessionsCount,
      sessionRequests: sessions.length,
    };
  },

  async getBatchDistribution(): Promise<ChartBarData[]> {
    const all = await alumniApi.getAlumniList({ page: 1, pageSize: 999 });
    const countMap: Record<string, number> = {};

    all.data.forEach((a) => {
      const b = a.batch || 'Unspecified';
      countMap[b] = (countMap[b] || 0) + 1;
    });

    return Object.entries(countMap)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.label.localeCompare(a.label));
  },

  async getWingDistribution(): Promise<ChartBarData[]> {
    const all = await alumniApi.getAlumniList({ page: 1, pageSize: 999 });
    const countMap: Record<string, number> = {};

    all.data.forEach((a) => {
      const w = a.wing || 'General';
      countMap[w] = (countMap[w] || 0) + 1;
    });

    return Object.entries(countMap)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  },

  async getNeedsReviewList(): Promise<AlumniProfile[]> {
    const pending = await alumniApi.getApprovalsList('PENDING');
    return pending.slice(0, 5);
  },

  async getRecentSessionRequests(): Promise<SessionRequest[]> {
    const sessions = await sessionApi.getSessionRequests();
    return sessions.slice(0, 5);
  },
};
