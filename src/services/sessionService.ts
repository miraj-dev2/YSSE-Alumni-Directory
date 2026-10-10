import { AlumniProfile, SessionRequest, SessionRequestStatus } from '../types';
import { apiClient } from '../api/client';
import { mapBackendSessionRequestToFrontend } from './sessionMapper';
import { mapBackendAlumniToFrontend } from './alumniMapper';

export const sessionService = {
  async getSessionsOffered(): Promise<AlumniProfile[]> {
    const res = await apiClient.get<any[]>('/alumni', { openToSessions: true, pageSize: 50 });
    return (res.data || []).map(mapBackendAlumniToFrontend);
  },

  async getMySessionRequests(_requesterId?: string): Promise<SessionRequest[]> {
    const res = await apiClient.get<any[]>('/sessions/requests/mine');
    return (res.data || []).map(mapBackendSessionRequestToFrontend);
  },

  async getRequestsToMe(_alumniId?: string): Promise<SessionRequest[]> {
    const res = await apiClient.get<any[]>('/sessions/requests/incoming');
    return (res.data || []).map(mapBackendSessionRequestToFrontend);
  },

  async requestSession(input: {
    alumniId: string;
    offerId?: string;
    requesterId?: string;
    requesterName?: string;
    requesterEmail?: string;
    topic: string;
    message: string;
  }): Promise<SessionRequest> {
    let offerId = input.offerId;
    if (!offerId) {
      const offersRes = await apiClient.get<any[]>('/sessions/offers');
      const matched = (offersRes.data || []).find((o: any) => o.alumniId === input.alumniId);
      offerId = matched?.id || input.alumniId;
    }

    const res = await apiClient.post<any>('/sessions/requests', {
      offerId,
      message: input.message
    });

    return mapBackendSessionRequestToFrontend(res);
  },

  async updateStatus(
    id: string,
    status: SessionRequestStatus,
    _actorName?: string
  ): Promise<SessionRequest> {
    const backendStatus = status.toUpperCase();
    const res = await apiClient.patch<any>(`/sessions/requests/${id}/status`, {
      status: backendStatus
    });
    return mapBackendSessionRequestToFrontend(res);
  }
};
