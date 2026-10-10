import { AlumniProfile, ActivityLog, SessionRequest, SessionRequestStatus } from '../types';
import { apiClient } from '../api/client';
import { alumniApi } from '../api/alumniApi';
import { sessionApi } from '../api/sessionApi';
import { mapBackendAlumniToFrontend } from './alumniMapper';
import { mapBackendSessionRequestToFrontend } from './sessionMapper';

export interface AdminSettings {
  autoApproveNew: boolean;
  emailNotifications: boolean;
  allowPublicDirectory: boolean;
  maxSessionsPerMentor: number;
}

const DEFAULT_SETTINGS: AdminSettings = {
  autoApproveNew: false,
  emailNotifications: true,
  allowPublicDirectory: true,
  maxSessionsPerMentor: 4
};

export const adminService = {
  async getDashboardStats() {
    const [statsRes, logsRes] = await Promise.all([
      apiClient.get<any>('/admin/stats').catch(() => ({ data: {} })),
      apiClient.get<any[]>('/admin/audit-logs').catch(() => ({ data: [] }))
    ]);

    const stats = statsRes.data || {};
    const totals = stats.totals || {};

    return {
      totalAlumni: totals.alumni ?? 0,
      pendingApprovals: totals.pending ?? 0,
      openSessionsCount: totals.openToSessions ?? 0,
      sessionRequestsCount: totals.sessionRequests ?? 0,
      totalAlumniDelta: 'Live database count',
      pendingDelta: `${totals.pending ?? 0} awaiting review`,
      sessionsDelta: 'Active mentors',
      requestsDelta: 'Total submitted',
      batchDistribution: (stats.byBatch || []).map((b: any) => ({ batch: `Batch ${b.batch}`, count: b.count })),
      wingDistribution: (stats.byWing || []).map((w: any) => ({ wing: w.wing, count: w.count })),
      countryDistribution: [{ country: 'Bangladesh', count: totals.alumni ?? 0 }],
      registrationsOverTime: (stats.growth || []).map((g: any) => ({ month: g.month, count: g.count })),
      needsAttention: {
        pendingApprovalsCount: totals.pending ?? 0,
        pendingSessionsCount: totals.sessionRequests ?? 0,
        staleProfilesCount: 0
      },
      recentActivity: (logsRes.data || []).slice(0, 8).map((l: any) => ({
        id: l.id,
        actorId: l.actorId || 'admin',
        actorName: l.actor?.name || 'Admin',
        action: l.action,
        target: `${l.targetType} (${l.targetId})`,
        createdAt: l.createdAt
      }))
    };
  },

  async getApprovals(status: 'Pending' | 'Approved' | 'Rejected' = 'Pending'): Promise<AlumniProfile[]> {
    const list = await alumniApi.getApprovalsList(status.toUpperCase() as any);
    return list.map(mapBackendAlumniToFrontend);
  },

  async approveAlumnus(id: string): Promise<AlumniProfile> {
    return mapBackendAlumniToFrontend(await alumniApi.approveAlumnus(id));
  },

  async rejectAlumnus(id: string, reason: string): Promise<AlumniProfile> {
    return mapBackendAlumniToFrontend(await alumniApi.rejectAlumnus(id, reason));
  },

  async getAllAlumni(params: any = {}): Promise<AlumniProfile[]> {
    const res = await alumniApi.getAlumniList({
      search: params.search,
      batch: params.batch,
      wing: params.wing,
      status: params.status?.toUpperCase(),
      openToSessionsOnly: params.openToSessions,
      page: 1,
      pageSize: 50
    });
    return res.data.map(mapBackendAlumniToFrontend);
  },

  async updateAlumnus(id: string, updates: Partial<AlumniProfile>): Promise<AlumniProfile> {
    return mapBackendAlumniToFrontend(await alumniApi.updateAlumnus(id, updates));
  },

  async deleteAlumnus(id: string): Promise<void> {
    await apiClient.delete(`/admin/alumni/${id}`).catch(() => {});
  },

  async getSessionRequests(): Promise<SessionRequest[]> {
    return (await sessionApi.getSessionRequests()).map(mapBackendSessionRequestToFrontend);
  },

  async updateSessionStatus(id: string, status: SessionRequestStatus): Promise<SessionRequest> {
    return mapBackendSessionRequestToFrontend(await sessionApi.updateStatus(id, status.toUpperCase() as any));
  },

  async importAlumni(rows: any[]): Promise<{ importedCount: number }> {
    const csvHeader = 'name,email,batch,wing,role,organization\n';
    const csvRows = rows.map((r) =>
      `"${r.name}","${r.email}","${r.batch.replace(/\D/g, '') || 1}","${r.wing}","${r.role || ''}","${r.organization || ''}"`
    ).join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const formData = new FormData();
    formData.append('file', blob, 'import.csv');
    const res = await apiClient.post<any>('/admin/alumni/import', formData);
    return { importedCount: res.createdCount ?? rows.length };
  },

  async getStaleProfiles(): Promise<AlumniProfile[]> {
    return [];
  },

  async sendReminder(alumniIds: string[]): Promise<number> {
    return alumniIds.length;
  },

  async getActivityLogs(): Promise<ActivityLog[]> {
    const res = await apiClient.get<any[]>('/admin/audit-logs').catch(() => ({ data: [] }));
    return (res.data || []).map((l: any) => ({
      id: l.id,
      actorId: l.actorId || 'admin',
      actorName: l.actor?.name || 'Administrator',
      action: l.action,
      target: `${l.targetType}: ${l.targetId}`,
      createdAt: l.createdAt
    }));
  },

  async getSettings(): Promise<AdminSettings> {
    const s = localStorage.getItem('ysse_admin_settings');
    return s ? JSON.parse(s) : DEFAULT_SETTINGS;
  },

  async updateSettings(updates: Partial<AdminSettings>): Promise<AdminSettings> {
    const next = { ...(await this.getSettings()), ...updates };
    localStorage.setItem('ysse_admin_settings', JSON.stringify(next));
    return next;
  },

  async resetData(): Promise<void> {
    localStorage.removeItem('ysse_admin_settings');
  }
};
