// DEMO API: Session requests service for YSSE Admin
import { SessionRequest, SessionStatus } from '../types/admin';
import { INITIAL_SESSIONS_STORE } from './mockData';

const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

let store: SessionRequest[] = [...INITIAL_SESSIONS_STORE];

export const sessionApi = {
  async getSessionRequests(): Promise<SessionRequest[]> {
    await delay();
    return [...store];
  },

  async updateStatus(id: string, status: SessionStatus): Promise<SessionRequest> {
    await delay();
    const item = store.find((s) => s.id === id);
    if (!item) throw new Error(`Session request ${id} not found`);
    item.status = status;
    return { ...item };
  },

  async acceptSessionRequest(id: string): Promise<SessionRequest> {
    return this.updateStatus(id, 'ACCEPTED');
  },

  async markSessionDone(id: string): Promise<SessionRequest> {
    return this.updateStatus(id, 'DONE');
  },
};
