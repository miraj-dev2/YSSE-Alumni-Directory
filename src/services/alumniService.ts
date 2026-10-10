import { AlumniProfile, DirectoryFilterParams, PaginatedResult } from '../types';
import { getStoredAlumni, logActivity, saveStoredAlumni } from './storage';

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const alumniService = {
  async getAlumni(params: DirectoryFilterParams = {}): Promise<PaginatedResult<AlumniProfile>> {
    await delay(200);
    const all = getStoredAlumni();

    // Directory only lists approved alumni
    let filtered = all.filter((a) => a.approvalStatus === 'Approved');

    // Search query
    if (params.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.organization.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          a.country.toLowerCase().includes(q) ||
          a.expertise.some((e) => e.toLowerCase().includes(q))
      );
    }

    // Batch filter
    if (params.batch && params.batch !== 'all') {
      const b = params.batch.trim().toLowerCase();
      filtered = filtered.filter((a) => {
        const itemBatch = a.batch.trim().toLowerCase();
        if (itemBatch === b) return true;
        if (b === '8' && (itemBatch === 'batch 8' || itemBatch.includes('8'))) return true;
        return itemBatch.includes(b);
      });
    }

    // Wing filter
    if (params.wing && params.wing !== 'all') {
      const w = params.wing.trim().toLowerCase();
      filtered = filtered.filter((a) => {
        const itemWing = a.wing.trim().toLowerCase();
        if (itemWing === w) return true;
        if (w === 'ysse it' && (itemWing === 'ysse it' || itemWing.includes('it') || itemWing.includes('tech'))) return true;
        return itemWing.includes(w);
      });
    }

    // Company filter
    if (params.company && params.company !== 'all') {
      filtered = filtered.filter(
        (a) => a.organization.toLowerCase() === params.company!.toLowerCase()
      );
    }

    // City / Country filter
    if (params.city && params.city !== 'all') {
      filtered = filtered.filter(
        (a) =>
          a.city.toLowerCase() === params.city!.toLowerCase() ||
          a.country.toLowerCase() === params.city!.toLowerCase()
      );
    }

    // Field / Expertise filter
    if (params.field && params.field !== 'all') {
      filtered = filtered.filter((a) =>
        a.expertise.some((e) => e.toLowerCase().includes(params.field!.toLowerCase()))
      );
    }

    // Open to sessions filter
    if (params.openToSessions !== undefined) {
      filtered = filtered.filter((a) => a.openToSessions === params.openToSessions);
    }

    // Sorting
    if (params.sort === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (params.sort === 'batch') {
      filtered.sort((a, b) => b.batch.localeCompare(a.batch));
    } else if (params.sort === 'updatedAt') {
      filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else {
      // Default: sort by updatedAt descending
      filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }

    const page = params.page || 1;
    const pageSize = params.pageSize || 9;
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIdx = (page - 1) * pageSize;
    const paginatedData = filtered.slice(startIdx, startIdx + pageSize);

    return {
      data: paginatedData,
      total,
      page,
      pageSize,
      totalPages,
    };
  },

  async getFeaturedAlumni(): Promise<AlumniProfile[]> {
    await delay(150);
    const all = getStoredAlumni();
    return all.filter((a) => a.approvalStatus === 'Approved' && a.photoUrl).slice(0, 8);
  },

  async getAlumniById(id: string): Promise<AlumniProfile | null> {
    await delay(150);
    const all = getStoredAlumni();
    return all.find((a) => a.id === id) || null;
  },

  async getSimilarAlumni(id: string, wing: string, batch: string): Promise<AlumniProfile[]> {
    await delay(150);
    const all = getStoredAlumni();
    return all
      .filter((a) => a.id !== id && a.approvalStatus === 'Approved' && (a.wing === wing || a.batch === batch))
      .slice(0, 3);
  },

  async getMyProfile(userId: string): Promise<AlumniProfile | null> {
    await delay(150);
    const all = getStoredAlumni();
    return all.find((a) => a.userId === userId) || null;
  },

  async updateProfile(id: string, updates: Partial<AlumniProfile>): Promise<AlumniProfile> {
    await delay(250);
    const all = getStoredAlumni();
    const index = all.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Alumni profile not found');

    const previous = all[index];
    const sensitiveFieldsChanged = Boolean(
      (updates.role && updates.role !== previous.role) ||
      (updates.organization && updates.organization !== previous.organization) ||
      (updates.wing && updates.wing !== previous.wing)
    );

    // Rule: Editing an approved profile re-enters Pending for changed sensitive fields.
    const newApprovalStatus =
      previous.approvalStatus === 'Approved' && sensitiveFieldsChanged
        ? 'Pending'
        : updates.approvalStatus || previous.approvalStatus;

    const updated: AlumniProfile = {
      ...previous,
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0],
      approvalStatus: newApprovalStatus,
    };

    all[index] = updated;
    saveStoredAlumni(all);
    logActivity(updated.name, 'Updated Profile', `Profile ID ${id} (${sensitiveFieldsChanged ? 'Triggered Review' : 'Saved'})`);
    return updated;
  },

  async createProfile(data: Omit<AlumniProfile, 'id' | 'approvalStatus' | 'createdAt' | 'updatedAt'>): Promise<AlumniProfile> {
    await delay(300);
    const all = getStoredAlumni();
    const today = new Date().toISOString().split('T')[0];
    const newProfile: AlumniProfile = {
      ...data,
      id: `alumni-${Date.now()}`,
      approvalStatus: 'Pending',
      createdAt: today,
      updatedAt: today,
    };
    all.unshift(newProfile);
    saveStoredAlumni(all);
    logActivity(newProfile.name, 'Registered Profile', `New alumni profile submitted for approval`);
    return newProfile;
  },

  async getDistinctFilterOptions(): Promise<{
    batches: string[];
    wings: string[];
    companies: string[];
    cities: string[];
    fields: string[];
  }> {
    await delay(100);
    const all = getStoredAlumni().filter((a) => a.approvalStatus === 'Approved');

    const batches = Array.from(new Set(all.map((a) => a.batch))).sort().reverse();
    const wings = Array.from(new Set(all.map((a) => a.wing))).sort();
    const companies = Array.from(new Set(all.map((a) => a.organization))).sort();
    const cities = Array.from(new Set(all.map((a) => a.city))).sort();

    const allFields = all.flatMap((a) => a.expertise || []);
    const fields = Array.from(new Set(allFields)).sort();

    return { batches, wings, companies, cities, fields };
  },
};
