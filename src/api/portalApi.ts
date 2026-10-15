import { apiClient } from './client';
import {
  PortalNotification,
  SavedAlumniItem,
  DashboardStatsData
} from '../types/portal';

export const portalApi = {
  async getDashboardStats(): Promise<DashboardStatsData> {
    const res = await apiClient.get<DashboardStatsData>('/dashboard/stats');
    return res.data;
  },

  async getNotifications(): Promise<{ items: PortalNotification[]; unreadCount: number }> {
    const res = await apiClient.get<{ items: PortalNotification[]; unreadCount: number }>('/notifications');
    return res.data;
  },

  async markNotificationRead(id: string): Promise<PortalNotification> {
    return apiClient.patch<PortalNotification>(`/notifications/${id}/read`);
  },

  async markAllNotificationsRead(): Promise<{ updated: number }> {
    return apiClient.post<{ updated: number }>('/notifications/read-all');
  },

  async getSavedAlumni(): Promise<SavedAlumniItem[]> {
    const res = await apiClient.get<SavedAlumniItem[]>('/alumni/saved');
    return res.data;
  },

  async toggleSaveAlumnus(alumniId: string): Promise<{ saved: boolean }> {
    return apiClient.post<{ saved: boolean }>(`/alumni/${alumniId}/save`);
  },

  async getMyRequests(): Promise<any[]> {
    const res = await apiClient.get<any[]>('/sessions/requests/mine');
    return res.data;
  },

  async getIncomingRequests(): Promise<any[]> {
    const res = await apiClient.get<any[]>('/sessions/requests/incoming');
    return res.data;
  },

  async cancelRequest(requestId: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/sessions/requests/${requestId}`);
  },

  async updateRequestStatus(requestId: string, status: 'ACCEPTED' | 'DECLINED' | 'DONE'): Promise<any> {
    return apiClient.patch(`/sessions/requests/${requestId}/status`, { status });
  }
};
