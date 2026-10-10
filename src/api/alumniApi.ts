// DEMO API: Alumni & Approvals service with in-memory persistence
import { AlumniProfile, AlumniStatus, PaginatedAlumniQuery, PaginatedResponse } from '../types/admin';
import { INITIAL_ALUMNI_STORE } from './mockData';

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));
let store: AlumniProfile[] = [...INITIAL_ALUMNI_STORE];

export const alumniApi = {
  async getAlumniList(query: PaginatedAlumniQuery): Promise<PaginatedResponse<AlumniProfile>> {
    await delay();
    let list = [...store];

    if (query.search?.trim()) {
      const q = query.search.trim().toLowerCase();
      list = list.filter((a) =>
        a.name.toLowerCase().includes(q) ||
        a.organization.toLowerCase().includes(q) ||
        a.currentRole.toLowerCase().includes(q)
      );
    }
    if (query.batch && query.batch !== 'all') {
      list = list.filter((a) => a.batch.toLowerCase() === query.batch!.toLowerCase());
    }
    if (query.wing && query.wing !== 'all') {
      list = list.filter((a) => a.wing.toLowerCase() === query.wing!.toLowerCase());
    }
    if (query.status && query.status !== 'all') {
      list = list.filter((a) => a.status === query.status);
    }
    if (query.openToSessionsOnly) {
      list = list.filter((a) => a.openToSessions);
    }
    if (query.sortBy) {
      const field = query.sortBy;
      const order = query.sortOrder === 'desc' ? -1 : 1;
      list.sort((a, b) => {
        const valA = (a[field] || '').toString().toLowerCase();
        const valB = (b[field] || '').toString().toLowerCase();
        return valA.localeCompare(valB) * order;
      });
    }

    const total = list.length;
    const pageSize = query.pageSize || 10;
    const page = query.page || 1;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const start = (page - 1) * pageSize;
    return { data: list.slice(start, start + pageSize), page, pageSize, total, totalPages };
  },

  async getApprovalsList(status: AlumniStatus = 'PENDING'): Promise<AlumniProfile[]> {
    await delay();
    return store.filter((a) => a.status === status);
  },

  async approveAlumnus(id: string): Promise<AlumniProfile> {
    await delay();
    const item = store.find((a) => a.id === id);
    if (!item) throw new Error(`Alumnus ${id} not found`);
    item.status = 'APPROVED';
    item.updatedAt = new Date().toISOString().split('T')[0];
    return { ...item };
  },

  async bulkApprove(ids: string[]): Promise<AlumniProfile[]> {
    await delay(150);
    const updated: AlumniProfile[] = [];
    ids.forEach((id) => {
      const item = store.find((a) => a.id === id);
      if (item) {
        item.status = 'APPROVED';
        item.updatedAt = new Date().toISOString().split('T')[0];
        updated.push({ ...item });
      }
    });
    return updated;
  },

  async rejectAlumnus(id: string, reason: string): Promise<AlumniProfile> {
    await delay();
    const item = store.find((a) => a.id === id);
    if (!item) throw new Error(`Alumnus ${id} not found`);
    item.status = 'REJECTED';
    item.rejectionReason = reason;
    item.updatedAt = new Date().toISOString().split('T')[0];
    return { ...item };
  },

  async bulkReject(ids: string[], reason: string): Promise<AlumniProfile[]> {
    await delay(150);
    const updated: AlumniProfile[] = [];
    ids.forEach((id) => {
      const item = store.find((a) => a.id === id);
      if (item) {
        item.status = 'REJECTED';
        item.rejectionReason = reason;
        item.updatedAt = new Date().toISOString().split('T')[0];
        updated.push({ ...item });
      }
    });
    return updated;
  },

  async createAlumnus(data: Omit<AlumniProfile, 'id' | 'status'>): Promise<AlumniProfile> {
    await delay();
    const today = new Date().toISOString().split('T')[0];
    const newItem: AlumniProfile = {
      ...data,
      id: `alm-${Date.now()}`,
      status: 'APPROVED',
      updatedAt: today,
      submittedAt: today,
    };
    store.unshift(newItem);
    return newItem;
  },

  async updateAlumnus(id: string, data: Partial<AlumniProfile>): Promise<AlumniProfile> {
    await delay();
    const idx = store.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error(`Alumnus ${id} not found`);
    store[idx] = { ...store[idx], ...data, updatedAt: new Date().toISOString().split('T')[0] };
    return { ...store[idx] };
  },

  async deleteAlumnus(id: string): Promise<void> {
    await delay();
    store = store.filter((a) => a.id !== id);
  },

  async importAlumni(rows: Omit<AlumniProfile, 'id' | 'status'>[]): Promise<{ imported: number }> {
    await delay(200);
    const today = new Date().toISOString().split('T')[0];
    const newItems: AlumniProfile[] = rows.map((r, i) => ({
      ...r,
      id: `alm-import-${Date.now()}-${i}`,
      status: 'APPROVED',
      submittedAt: today,
      updatedAt: today,
    }));
    store.unshift(...newItems);
    return { imported: newItems.length };
  },

  async getAllExistingEmails(): Promise<string[]> {
    await delay(40);
    return store.map((a) => a.email.toLowerCase());
  },
};
