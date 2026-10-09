import { User, UserRole } from '../types';
import { getStoredAuth, saveStoredAuth, getStoredUsers } from './storage';

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    await delay(80);
    return getStoredAuth();
  },

  async loginAs(role: UserRole): Promise<User | null> {
    await delay(200);
    const users = getStoredUsers();

    if (role === 'visitor') {
      saveStoredAuth(null);
      return null;
    }

    const matched = users.find((u) => u.role === role);
    if (matched) {
      const updated = { ...matched, lastLoginAt: new Date().toISOString() };
      saveStoredAuth(updated);
      return updated;
    }

    return null;
  },

  async updateUser(updates: Partial<User>): Promise<User> {
    await delay(200);
    const current = getStoredAuth();
    if (!current) throw new Error('No active user session');

    const updated = { ...current, ...updates };
    saveStoredAuth(updated);

    const allUsers = getStoredUsers();
    const idx = allUsers.findIndex((u) => u.id === current.id);
    if (idx !== -1) {
      allUsers[idx] = updated;
      localStorage.setItem('ysse_users_v2', JSON.stringify(allUsers));
    }

    return updated;
  },

  async logout(): Promise<void> {
    await delay(100);
    saveStoredAuth(null);
  },
};
