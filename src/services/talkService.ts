import { AlumniTalk } from '../types';
import { apiClient } from '../api/client';

export const talkService = {
  async getTalks(params?: { q?: string; featuredOnly?: boolean; limit?: number }): Promise<AlumniTalk[]> {
    try {
      const res = await apiClient.get<any[]>('/talks', params);
      return (res.data || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.description || undefined,
        topic: t.topic,
        speakerName: t.speakerName,
        speakerRole: t.speakerRole || t.speaker?.currentRole || undefined,
        speakerOrg: t.speakerOrg || t.speaker?.organization || undefined,
        speakerPhoto: t.speakerPhoto || t.speaker?.photoUrl || undefined,
        speakerId: t.speakerId || t.speaker?.id || undefined,
        talkDate: t.talkDate,
        recordingUrl: t.recordingUrl || undefined,
        liveUrl: t.liveUrl || undefined,
        isFeatured: Boolean(t.isFeatured),
        createdAt: t.createdAt
      }));
    } catch {
      return [];
    }
  },

  async getTalkById(id: string): Promise<AlumniTalk | null> {
    try {
      const res = await apiClient.get<any>(`/talks/${id}`);
      if (!res.data) return null;
      const t = res.data;
      return {
        id: t.id,
        title: t.title,
        description: t.description || undefined,
        topic: t.topic,
        speakerName: t.speakerName,
        speakerRole: t.speakerRole || t.speaker?.currentRole || undefined,
        speakerOrg: t.speakerOrg || t.speaker?.organization || undefined,
        speakerPhoto: t.speakerPhoto || t.speaker?.photoUrl || undefined,
        speakerId: t.speakerId || t.speaker?.id || undefined,
        talkDate: t.talkDate,
        recordingUrl: t.recordingUrl || undefined,
        liveUrl: t.liveUrl || undefined,
        isFeatured: Boolean(t.isFeatured),
        createdAt: t.createdAt
      };
    } catch {
      return null;
    }
  },

  async createTalk(data: Partial<AlumniTalk>): Promise<AlumniTalk> {
    const res = await apiClient.post<any>('/talks', data);
    return res.data;
  },

  async deleteTalk(id: string): Promise<void> {
    await apiClient.delete(`/talks/${id}`);
  }
};
