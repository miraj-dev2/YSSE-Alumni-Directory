import { AlumniProfile, AlumniStatus, PaginatedAlumniQuery, PaginatedResponse } from '../types/admin';
import { apiClient } from './client';

const mapAdminProfile = (a: any): AlumniProfile => ({
  id: a.id,
  name: a.name || '',
  email: a.email || '',
  batch: typeof a.batch === 'number' ? `Batch ${a.batch}` : (a.batch || 'Batch 1'),
  wing: a.wing || '',
  currentRole: a.currentRole || 'Member',
  organization: a.organization || 'YSSE Global',
  location: a.location || 'Dhaka, Bangladesh',
  linkedinUrl: a.linkedinUrl || '',
  photoUrl: a.photoUrl || undefined,
  isContactPublic: Boolean(a.isContactPublic),
  openToSessions: Boolean(a.openToSessions),
  status: (a.status || 'PENDING') as AlumniStatus,
  rejectionReason: a.rejectionReason || undefined,
  submittedAt: a.createdAt || new Date().toISOString(),
  updatedAt: a.updatedAt || new Date().toISOString()
});

export const alumniApi = {
  async getAlumniList(query: PaginatedAlumniQuery): Promise<PaginatedResponse<AlumniProfile>> {
    const rawBatch = query.batch && query.batch !== 'all' ? query.batch.replace(/\D/g, '') : undefined;
    const params: Record<string, any> = {
      q: query.search?.trim() || undefined,
      batch: rawBatch ? parseInt(rawBatch, 10) : undefined,
      wing: query.wing && query.wing !== 'all' ? query.wing : undefined,
      status: query.status && query.status !== 'all' ? query.status : undefined,
      openToSessions: query.openToSessionsOnly ? true : undefined,
      sort: query.sortBy === 'name' ? 'name_asc' : query.sortBy === 'batch' ? 'batch_desc' : 'recent',
      page: query.page || 1,
      pageSize: query.pageSize || 10
    };

    const res = await apiClient.get<any[]>('/admin/alumni', params);
    const data = (res.data || []).map(mapAdminProfile);
    const meta = (res.meta as any) || {};

    return {
      data,
      page: meta.page ?? 1,
      pageSize: meta.pageSize ?? 10,
      total: meta.total ?? data.length,
      totalPages: meta.totalPages ?? Math.ceil(data.length / 10)
    };
  },

  async getApprovalsList(status: AlumniStatus = 'PENDING'): Promise<AlumniProfile[]> {
    const res = await apiClient.get<any[]>('/admin/alumni', { status, pageSize: 50 });
    return (res.data || []).map(mapAdminProfile);
  },

  async approveAlumnus(id: string): Promise<AlumniProfile> {
    const res = await apiClient.patch<any>(`/admin/alumni/${id}/status`, { status: 'APPROVED' });
    return mapAdminProfile(res);
  },

  async rejectAlumnus(id: string, reason = 'Document verification failed'): Promise<AlumniProfile> {
    const res = await apiClient.patch<any>(`/admin/alumni/${id}/status`, {
      status: 'REJECTED',
      reason: reason.trim() || 'Incomplete verification information'
    });
    return mapAdminProfile(res);
  },

  async bulkUpdateStatus(ids: string[], status: AlumniStatus, reason?: string) {
    return apiClient.post<{ affected: number }>('/admin/alumni/bulk-status', {
      ids,
      status,
      reason: reason || (status === 'REJECTED' ? 'Verification incomplete' : undefined)
    });
  },

  async bulkApprove(ids: string[]) {
    return this.bulkUpdateStatus(ids, 'APPROVED');
  },

  async bulkReject(ids: string[], reason: string) {
    return this.bulkUpdateStatus(ids, 'REJECTED', reason);
  },

  async deleteAlumnus(id: string): Promise<void> {
    await apiClient.delete(`/admin/alumni/${id}`).catch(() => {});
  },

  async getAllExistingEmails(): Promise<string[]> {
    const res = await this.getAlumniList({ page: 1, pageSize: 500 });
    return res.data.map((a) => a.email.toLowerCase());
  },

  async importAlumni(rows: any[]) {
    const csvHeader = 'name,email,batch,wing,role,organization\n';
    const csvRows = rows.map((r) =>
      `"${r.name}","${r.email}","${r.batch.replace(/\D/g, '') || 1}","${r.wing}","${r.role || ''}","${r.organization || ''}"`
    ).join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const formData = new FormData();
    formData.append('file', blob, 'import.csv');
    return apiClient.post<any>('/admin/alumni/import', formData);
  },

  async createAlumnus(data: any): Promise<AlumniProfile> {
    const res = await apiClient.post<any>('/admin/alumni', data);
    return mapAdminProfile(res);
  },

  async updateAlumnus(id: string, data: any): Promise<AlumniProfile> {
    const res = await apiClient.patch<any>(`/admin/alumni/${id}`, data);
    return mapAdminProfile(res);
  }
};
