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

  async loginWithCredentials(email: string, _password?: string): Promise<User> {
    const normalized = email.trim().toLowerCase();
    const roleParam = normalized.includes('admin') ? 'ADMIN' : 'MEMBER';
    const nameCandidate = email.split('@')[0].replace(/[._-]/g, ' ');
    const name = nameCandidate.charAt(0).toUpperCase() + nameCandidate.slice(1);

    const res = await apiClient.post<any>('/auth/dev-login', {
      email: normalized,
      name,
      role: roleParam
    });

    const u = res.user;
    const role: UserRole =
      u.role === 'ADMIN' ? 'admin' : normalized.includes('alumni') ? 'alumni' : 'member';

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
    return this.loginWithCredentials(data.email);
  },

  async loginAs(role: UserRole): Promise<User | null> {
    if (role === 'visitor') {
      await this.logout();
      return null;
    }

    const emailMap: Record<string, string> = {
      admin: 'admin@ysseglobal.org',
      alumni: 'alumni@ysseglobal.org',
      member: 'member@ysseglobal.org'
    };

    return this.loginWithCredentials(emailMap[role] || 'member@ysseglobal.org');
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
