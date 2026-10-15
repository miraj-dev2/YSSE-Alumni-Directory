import { User, UserRole } from '../types';
import { apiClient } from '../api/client';

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    try {
      const res = await apiClient.get<any>('/auth/me');
      const u = res.data;
      if (!u) return null;
      const role: UserRole =
        u.role === 'ADMIN' ? 'admin' : u.role === 'ALUMNI' ? 'alumni' : 'member';

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        avatarUrl: u.avatarUrl || undefined,
        role,
        interests: ['Social Entrepreneurship', 'Leadership'],
        lastLoginAt: new Date().toISOString()
      };
    } catch {
      return null;
    }
  },

  async loginWithGoogle(idToken: string): Promise<User> {
    await apiClient.post<any>('/auth/google', { idToken });
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Failed to retrieve user session');
    return user;
  },

  async loginWithCredentials(email: string, password?: string): Promise<User> {
    await apiClient.post<any>('/auth/login', {
      email: email.trim().toLowerCase(),
      password: password || ''
    });

    const user = await this.getCurrentUser();
    if (!user) throw new Error('Failed to retrieve user session');
    return user;
  },

  async registerUser(data: {
    name: string;
    email: string;
    password?: string;
    role: 'member' | 'alumni';
  }): Promise<User> {
    await apiClient.post<any>('/auth/register', {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password || ''
    });

    const user = await this.getCurrentUser();
    if (!user) throw new Error('Failed to retrieve user session');
    return user;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout').catch(() => {});
  },

  async updateUserAccount(updates: Partial<User>): Promise<User> {
    const current = await this.getCurrentUser();
    if (!current) throw new Error('Not authenticated');
    return { ...current, ...updates };
  },

  async updateUser(updates: Partial<User>): Promise<User> {
    return this.updateUserAccount(updates);
  }
};
