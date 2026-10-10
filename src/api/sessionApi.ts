import { SessionRequest, SessionStatus } from '../types/admin';
import { apiClient } from './client';

export const sessionApi = {
  async getSessionRequests(): Promise<SessionRequest[]> {
    try {
      const res = await apiClient.get<any[]>('/admin/session-requests');
      return (res.data || []).map((s: any) => ({
        id: s.id,
        offerId: s.offerId,
        requesterId: s.requesterId,
        requesterName: s.requester?.name || 'Requester',
        requesterEmail: s.requester?.email || '',
        alumniName: s.offer?.alumni?.name || 'Alumnus',
        topic: s.offer?.topic || 'Mentorship',
        message: s.message || '',
        status: (s.status || 'PENDING') as SessionStatus,
        createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString()
      }));
    } catch {
      return [];
    }
  },

  async updateStatus(id: string, status: SessionStatus): Promise<SessionRequest> {
    const res = await apiClient.patch<any>(`/sessions/requests/${id}/status`, { status });
    return {
      id: res.id,
      offerId: res.offerId,
      requesterId: res.requesterId,
      topic: res.topic || 'Mentorship',
      message: res.message || '',
      status: res.status as SessionStatus,
      createdAt: res.createdAt
    };
  },

  async acceptSessionRequest(id: string): Promise<SessionRequest> {
    return this.updateStatus(id, 'ACCEPTED');
  },

  async markSessionDone(id: string): Promise<SessionRequest> {
    return this.updateStatus(id, 'DONE');
  }
};
