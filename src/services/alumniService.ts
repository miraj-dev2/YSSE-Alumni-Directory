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
    const wingsRes = await apiClient.get<any[]>('/wings').catch(() => ({ data: [] }));
    const wings = (wingsRes.data || []).map((w: any) => w.name);

    return {
      batches: ['Batch 1', 'Batch 2', 'Batch 3', 'Batch 4', 'Batch 5', 'Batch 6', 'Batch 7', 'Batch 8', 'Batch 9', 'Batch 10'],
      wings: wings.length > 0 ? wings : ['IT', 'Academy', 'Charity Hub', 'Ekmutho Ahar', 'Shop'],
      companies: ['Pathao', 'bKash', 'ShopUp', 'Grameenphone', 'Optimizely', 'BRAC', 'YSSE Global', 'Brain Station 23'],
      cities: ['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna'],
      fields: ['Technology & IT', 'Marketing & PR', 'Social Entrepreneurship', 'Design & Creative', 'Finance']
    };
  },

  getDistinctFilterOptions() {
    return this.getFilterOptions();
  }
};
