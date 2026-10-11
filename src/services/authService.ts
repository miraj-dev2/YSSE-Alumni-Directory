import { User, UserRole } from '../types';
import { apiClient } from '../api/client';

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    try {
      const res = await apiClient.get<any>('/auth/me');
      const u = res.data;
      if (!u) return null;
      const role: UserRole =
        u.role === 'ADMIN' ? 'admin' : u.profile ? 'alumni' : 'member';

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
    const res = await apiClient.post<any>('/auth/google', { idToken });
    const u = res.user;
    const role: UserRole = u.role === 'ADMIN' ? 'admin' : 'member';

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      avatarUrl: u.avatarUrl || undefined,
      role,
      interests: ['Social Entrepreneurship'],
      lastLoginAt: new Date().toISOString()
    };
  },

  async loginWithCredentials(email: string, password?: string): Promise<User> {
    const res = await apiClient.post<any>('/auth/login', {
      email: email.trim().toLowerCase(),
      password: password || ''
    });

    const u = res.user;
    const role: UserRole = u.role === 'ADMIN' ? 'admin' : 'member';

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      avatarUrl: u.avatarUrl || undefined,
      role,
      interests: ['Community Leadership'],
      lastLoginAt: new Date().toISOString()
    };
  },

  async registerUser(data: {
    name: string;
    email: string;
    password?: string;
    role: 'member' | 'alumni';
  }): Promise<User> {
    const res = await apiClient.post<any>('/auth/register', {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password || '',
      role: data.role.toUpperCase()
    });

    const u = res.user;
    const role: UserRole = u.role === 'ADMIN' ? 'admin' : data.role;

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      avatarUrl: u.avatarUrl || undefined,
      role,
      interests: ['Social Entrepreneurship'],
      lastLoginAt: new Date().toISOString()
    };
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
