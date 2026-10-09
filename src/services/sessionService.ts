import { AlumniProfile, SessionRequest, SessionRequestStatus } from '../types';
import { getStoredAlumni, getStoredSessions, logActivity, saveStoredSessions } from './storage';

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const sessionService = {
  async getSessionsOffered(): Promise<AlumniProfile[]> {
    await delay(150);
    const all = getStoredAlumni();
    return all.filter((a) => a.approvalStatus === 'Approved' && a.openToSessions);
  },

  async getMySessionRequests(requesterId: string): Promise<SessionRequest[]> {
    await delay(150);
    const sessions = getStoredSessions();
    return sessions.filter((s) => s.requesterId === requesterId);
  },

  async getRequestsToMe(alumniId: string): Promise<SessionRequest[]> {
    await delay(150);
    const sessions = getStoredSessions();
    return sessions.filter((s) => s.alumniId === alumniId);
  },

  async requestSession(input: {
    alumniId: string;
    requesterId: string;
    requesterName: string;
    requesterEmail: string;
    topic: string;
    message: string;
  }): Promise<SessionRequest> {
    await delay(250);
    const alumniList = getStoredAlumni();
    const alumnus = alumniList.find((a) => a.id === input.alumniId);

    const newRequest: SessionRequest = {
      id: `req-${Date.now()}`,
      alumniId: input.alumniId,
      alumniName: alumnus?.name || 'Alumnus',
      alumniPhoto: alumnus?.photoUrl,
      alumniRole: alumnus?.role,
      alumniOrg: alumnus?.organization,
      requesterId: input.requesterId,
      requesterName: input.requesterName,
      requesterEmail: input.requesterEmail,
      topic: input.topic,
      message: input.message,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    const currentSessions = getStoredSessions();
    currentSessions.unshift(newRequest);
    saveStoredSessions(currentSessions);
    logActivity(input.requesterName, 'Requested Session', `With ${alumnus?.name || 'Alumnus'}`);
    return newRequest;
  },

  async updateStatus(id: string, status: SessionRequestStatus, actorName = 'User'): Promise<SessionRequest> {
    await delay(200);
    const currentSessions = getStoredSessions();
    const idx = currentSessions.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Session request not found');

    currentSessions[idx].status = status;
    saveStoredSessions(currentSessions);
    logActivity(actorName, 'Changed Session Status', `Request #${id} marked as ${status}`);
    return currentSessions[idx];
  },
};
