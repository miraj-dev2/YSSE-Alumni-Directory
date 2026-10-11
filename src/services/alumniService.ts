import { AlumniProfile, DirectoryFilterParams, PaginatedResult } from '../types';
import { apiClient } from '../api/client';
import { mapBackendAlumniToFrontend } from './alumniMapper';

export const alumniService = {
  async getAlumni(params: DirectoryFilterParams = {}): Promise<PaginatedResult<AlumniProfile>> {
    const rawBatch = params.batch && params.batch !== 'all' ? params.batch.replace(/\D/g, '') : undefined;
    const queryParams: Record<string, any> = {
      q: params.search?.trim() || undefined,
      batch: rawBatch ? parseInt(rawBatch, 10) : undefined,
      wing: params.wing && params.wing !== 'all' ? params.wing : undefined,
      openToSessions: params.openToSessions ? true : undefined,
      page: params.page || 1,
      pageSize: params.pageSize || 12,
      sort: params.sort === 'name' ? 'name_asc' : params.sort === 'batch' ? 'batch_desc' : 'recent'
    };

    const res = await apiClient.get<any[]>('/alumni', queryParams);
    const data = (res.data || []).map(mapBackendAlumniToFrontend);
    const meta = (res.meta as any) || {};

    return {
      data,
      total: meta.total ?? data.length,
      page: meta.page ?? 1,
      pageSize: meta.pageSize ?? 12,
      totalPages: meta.totalPages ?? Math.ceil(data.length / 12)
    };
  },

  async getFeaturedAlumni(): Promise<AlumniProfile[]> {
    const res = await apiClient.get<any[]>('/alumni/featured');
    return (res.data || []).map(mapBackendAlumniToFrontend);
  },

  async getSuccessStories(): Promise<AlumniProfile[]> {
    try {
      const res = await apiClient.get<any[]>('/alumni/stories');
      return (res.data || []).map(mapBackendAlumniToFrontend);
    } catch {
      return [];
    }
  },

  async getAlumniById(id: string): Promise<AlumniProfile | null> {
    try {
      const res = await apiClient.get<any>(`/alumni/${id}`);
      return res.data ? mapBackendAlumniToFrontend(res.data) : null;
    } catch {
      return null;
    }
  },

  async getSimilarAlumni(_id?: string, _wing?: string, _batch?: string): Promise<AlumniProfile[]> {
    const res = await apiClient.get<any[]>('/alumni/featured');
    return (res.data || []).slice(0, 3).map(mapBackendAlumniToFrontend);
  },

  async getMyProfile(_userId?: string): Promise<AlumniProfile | null> {
    try {
      const res = await apiClient.get<any>('/alumni/me');
      return res.data ? mapBackendAlumniToFrontend(res.data) : null;
    } catch {
      return null;
    }
  },

  async createProfile(profileData: Partial<AlumniProfile>): Promise<AlumniProfile> {
    const rawBatch = profileData.batch ? parseInt(profileData.batch.replace(/\D/g, ''), 10) : 1;
    const payload = {
      name: profileData.name,
      batch: isNaN(rawBatch) ? 1 : rawBatch,
      wingId: (profileData as any).wingId || 'wing_1',
      currentRole: profileData.role,
      organization: profileData.organization,
      location: `${profileData.city || 'Dhaka'}, ${profileData.country || 'Bangladesh'}`,
      linkedinUrl: profileData.linkedinUrl || undefined,
      bio: profileData.bio,
      story: profileData.story || undefined,
      isContactPublic: profileData.isEmailPublic ?? false
    };

    const res = await apiClient.post<any>('/alumni/me', payload);
    return mapBackendAlumniToFrontend(res);
  },

  async updateProfile(_id: string, updates: Partial<AlumniProfile>): Promise<AlumniProfile> {
    const payload: any = {
      name: updates.name,
      currentRole: updates.role,
      organization: updates.organization,
      bio: updates.bio,
      isContactPublic: updates.isEmailPublic
    };

    if (updates.story !== undefined) payload.story = updates.story;
    if (updates.city || updates.country) {
      payload.location = `${updates.city || 'Dhaka'}, ${updates.country || 'Bangladesh'}`;
    }
    if (updates.linkedinUrl !== undefined) {
      payload.linkedinUrl = updates.linkedinUrl || null;
    }
    if (updates.batch) {
      const b = parseInt(updates.batch.replace(/\D/g, ''), 10);
      if (!isNaN(b)) payload.batch = b;
    }

    const res = await apiClient.put<any>('/alumni/me', payload);
    return mapBackendAlumniToFrontend(res);
  },

  async uploadPhoto(_id: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('photo', file);
    const res = await apiClient.post<{ photoUrl: string }>('/alumni/me/photo', formData);
    return res.photoUrl;
  },

  async getFilterOptions() {
    const [wingsRes, alumniRes] = await Promise.all([
      apiClient.get<any[]>('/wings').catch(() => ({ data: [] })),
      apiClient.get<any[]>('/alumni', { pageSize: 100 }).catch(() => ({ data: [] }))
    ]);
    const wings = (wingsRes.data || []).map((w: any) => w.name);
    const alumni = alumniRes.data || [];

    const batches = Array.from(new Set(alumni.map((a: any) => `Batch ${a.batch}`))).sort();
    const companies = Array.from(new Set(alumni.map((a: any) => a.organization).filter(Boolean))).sort();
    const cities = Array.from(new Set(alumni.map((a: any) => a.location?.split(',')[0]?.trim()).filter(Boolean))).sort();
    const fields = Array.from(new Set(alumni.map((a: any) => a.currentRole).filter(Boolean))).sort();

    return { batches, wings, companies, cities, fields };
  },

  getDistinctFilterOptions() {
    return this.getFilterOptions();
  }
};
