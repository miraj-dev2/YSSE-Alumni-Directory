import { AlumniProfile, CsvAlumniRow, SessionRequest, SessionRequestStatus, ActivityLog } from '../types';
import {
  getStoredAlumni,
  getStoredSessions,
  getStoredLogs,
  getStoredSettings,
  saveStoredSettings,
  logActivity,
  resetAllStorage,
  saveStoredAlumni,
  saveStoredSessions,
  AdminSettings,
} from './storage';

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const adminService = {
  async getDashboardStats(): Promise<{
    totalAlumni: number;
    pendingApprovals: number;
    openSessionsCount: number;
    sessionRequestsCount: number;
    totalAlumniDelta: string;
    pendingDelta: string;
    sessionsDelta: string;
    requestsDelta: string;
    batchDistribution: { batch: string; count: number }[];
    wingDistribution: { wing: string; count: number }[];
    countryDistribution: { country: string; count: number }[];
    registrationsOverTime: { month: string; count: number }[];
    needsAttention: {
      pendingApprovalsCount: number;
      pendingSessionsCount: number;
      staleProfilesCount: number;
    };
    recentActivity: ActivityLog[];
  }> {
    await delay(180);
    const alumni = getStoredAlumni();
    const sessions = getStoredSessions();
    const logs = getStoredLogs();

    const totalAlumni = alumni.length;
    const pendingApprovals = alumni.filter((a) => a.approvalStatus === 'Pending').length;
    const openSessionsCount = alumni.filter((a) => a.approvalStatus === 'Approved' && a.openToSessions).length;
    const sessionRequestsCount = sessions.length;

    // Batch distribution
    const batchCounts: Record<string, number> = {};
    alumni.forEach((a) => {
      batchCounts[a.batch] = (batchCounts[a.batch] || 0) + 1;
    });
    const batchDistribution = Object.entries(batchCounts)
      .map(([batch, count]) => ({ batch, count }))
      .sort((a, b) => a.batch.localeCompare(b.batch));

    // Wing distribution
    const wingCounts: Record<string, number> = {};
    alumni.forEach((a) => {
      wingCounts[a.wing] = (wingCounts[a.wing] || 0) + 1;
    });
    const wingDistribution = Object.entries(wingCounts).map(([wing, count]) => ({
      wing: wing.replace('&', 'and'),
      count,
    }));

    // Country distribution
    const countryCounts: Record<string, number> = {};
    alumni.forEach((a) => {
      countryCounts[a.country] = (countryCounts[a.country] || 0) + 1;
    });
    const countryDistribution = Object.entries(countryCounts).map(([country, count]) => ({
      country,
      count,
    }));

    // Registrations over time (monthly trend)
    const registrationsOverTime = [
      { month: 'Jan', count: 4 },
      { month: 'Feb', count: 7 },
      { month: 'Mar', count: 9 },
      { month: 'Apr', count: 14 },
      { month: 'May', count: 18 },
    ];

    // Stale profiles (not updated in > 180 days)
    const now = new Date().getTime();
    const sixMonthsAgo = now - 180 * 24 * 60 * 60 * 1000;
    const staleProfilesCount = alumni.filter((a) => new Date(a.updatedAt).getTime() < sixMonthsAgo).length;

    return {
      totalAlumni,
      pendingApprovals,
      openSessionsCount,
      sessionRequestsCount,
      totalAlumniDelta: '+12% from last month',
      pendingDelta: `${pendingApprovals} awaiting review`,
      sessionsDelta: '+4 new this week',
      requestsDelta: '+18% completion rate',
      batchDistribution,
      wingDistribution,
      countryDistribution,
      registrationsOverTime,
      needsAttention: {
        pendingApprovalsCount: pendingApprovals,
        pendingSessionsCount: sessions.filter((s) => s.status === 'Pending').length,
        staleProfilesCount,
      },
      recentActivity: logs.slice(0, 5),
    };
  },

  async getApprovals(status: 'Pending' | 'Approved' | 'Rejected' = 'Pending'): Promise<AlumniProfile[]> {
    await delay(150);
    const alumni = getStoredAlumni();
    return alumni.filter((a) => a.approvalStatus === status);
  },

  async approveAlumnus(id: string): Promise<AlumniProfile> {
    await delay(200);
    const alumni = getStoredAlumni();
    const idx = alumni.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Alumnus not found');

    alumni[idx].approvalStatus = 'Approved';
    alumni[idx].rejectionReason = undefined;
    saveStoredAlumni(alumni);
    logActivity('Admin', 'Approved Profile', alumni[idx].name);
    return alumni[idx];
  },

  async rejectAlumnus(id: string, reason: string): Promise<AlumniProfile> {
    await delay(200);
    const alumni = getStoredAlumni();
    const idx = alumni.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Alumnus not found');

    alumni[idx].approvalStatus = 'Rejected';
    alumni[idx].rejectionReason = reason;
    saveStoredAlumni(alumni);
    logActivity('Admin', 'Rejected Profile', `${alumni[idx].name} (Reason: ${reason})`);
    return alumni[idx];
  },

  async getAllAlumni(params?: {
    search?: string;
    batch?: string;
    wing?: string;
    country?: string;
    status?: string;
    openToSessions?: boolean;
  }): Promise<AlumniProfile[]> {
    await delay(180);
    let list = getStoredAlumni();

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.organization.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q)
      );
    }

    if (params?.batch && params.batch !== 'all') {
      list = list.filter((a) => a.batch === params.batch);
    }

    if (params?.wing && params.wing !== 'all') {
      list = list.filter((a) => a.wing === params.wing);
    }

    if (params?.country && params.country !== 'all') {
      list = list.filter((a) => a.country === params.country);
    }

    if (params?.status && params.status !== 'all') {
      list = list.filter((a) => a.approvalStatus === params.status);
    }

    if (params?.openToSessions !== undefined) {
      list = list.filter((a) => a.openToSessions === params.openToSessions);
    }

    return list;
  },

  async updateAlumnus(id: string, updates: Partial<AlumniProfile>): Promise<AlumniProfile> {
    await delay(200);
    const alumni = getStoredAlumni();
    const idx = alumni.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Alumnus not found');

    alumni[idx] = { ...alumni[idx], ...updates, updatedAt: new Date().toISOString().split('T')[0] };
    saveStoredAlumni(alumni);
    logActivity('Admin', 'Edited Alumnus Record', alumni[idx].name);
    return alumni[idx];
  },

  async deleteAlumnus(id: string): Promise<void> {
    await delay(200);
    const alumni = getStoredAlumni();
    const target = alumni.find((a) => a.id === id);
    const filtered = alumni.filter((a) => a.id !== id);
    saveStoredAlumni(filtered);
    logActivity('Admin', 'Deleted Alumnus', target?.name || id);
  },

  async getSessionRequests(): Promise<SessionRequest[]> {
    await delay(150);
    return getStoredSessions();
  },

  async updateSessionStatus(id: string, status: SessionRequestStatus): Promise<SessionRequest> {
    await delay(200);
    const sessions = getStoredSessions();
    const idx = sessions.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Session request not found');

    sessions[idx].status = status;
    saveStoredSessions(sessions);
    logActivity('Admin', 'Updated Session Request Status', `Request #${id} marked ${status}`);
    return sessions[idx];
  },

  async importAlumni(rows: CsvAlumniRow[]): Promise<{ importedCount: number }> {
    await delay(350);
    const current = getStoredAlumni();
    const today = new Date().toISOString().split('T')[0];

    const newItems: AlumniProfile[] = rows.map((r, i) => ({
      id: `imported-${Date.now()}-${i}`,
      userId: `user-imported-${Date.now()}-${i}`,
      name: r.name,
      email: r.email,
      batch: r.batch,
      wing: r.wing,
      role: r.role,
      organization: r.organization,
      city: 'Dhaka',
      country: 'Bangladesh',
      bio: `Alumnus from ${r.batch}, formerly contributing to the ${r.wing} wing at YSSE. Currently working at ${r.organization}.`,
      isEmailPublic: true,
      isLinkedinPublic: true,
      openToSessions: false,
      expertise: ['Project Management', 'Youth Leadership'],
      career: [{ id: `c-${i}`, role: r.role, organization: r.organization, startYear: '2023', current: true }],
      approvalStatus: 'Approved',
      createdAt: today,
      updatedAt: today,
    }));

    const combined = [...newItems, ...current];
    saveStoredAlumni(combined);
    logActivity('Admin', 'Bulk CSV Import', `Ingested ${newItems.length} verified rows`);
    return { importedCount: newItems.length };
  },

  async getStaleProfiles(): Promise<AlumniProfile[]> {
    await delay(150);
    const alumni = getStoredAlumni();
    const now = new Date().getTime();
    const sixMonthsAgo = now - 180 * 24 * 60 * 60 * 1000;
    return alumni.filter((a) => a.approvalStatus === 'Approved' && new Date(a.updatedAt).getTime() < sixMonthsAgo);
  },

  async sendReminder(alumniIds: string[]): Promise<number> {
    await delay(250);
    const alumni = getStoredAlumni();
    const targets = alumni.filter((a) => alumniIds.includes(a.id));
    logActivity('Admin', 'Dispatched Profile Refresh Reminders', `${targets.length} alumni recipients`);
    return targets.length;
  },

  async getActivityLogs(): Promise<ActivityLog[]> {
    await delay(100);
    return getStoredLogs();
  },

  async getSettings(): Promise<AdminSettings> {
    await delay(80);
    return getStoredSettings();
  },

  async updateSettings(updates: Partial<AdminSettings>): Promise<AdminSettings> {
    await delay(150);
    const current = getStoredSettings();
    const next = { ...current, ...updates };
    saveStoredSettings(next);
    logActivity('Admin', 'Updated System Settings', 'Policy & Reminder Rules Modified');
    return next;
  },

  async resetData(): Promise<void> {
    await delay(150);
    resetAllStorage();
  },
};
