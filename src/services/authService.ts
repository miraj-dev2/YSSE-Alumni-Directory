import { User, UserRole } from '../types';
import { getStoredAuth, saveStoredAuth, getStoredUsers, saveStoredUsers, logActivity } from './storage';

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    await delay(60);
    return getStoredAuth();
  },

  async loginAs(role: UserRole): Promise<User | null> {
    await delay(150);
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

  async loginWithCredentials(email: string, _password?: string): Promise<User> {
    await delay(200);
    const normalized = email.trim().toLowerCase();
    const users = getStoredUsers();

    // Check if user exists by email
    let user = users.find((u) => u.email.toLowerCase() === normalized);

    if (!user) {
      // If mock login and email contains 'alumni' or 'admin', allocate appropriate role, otherwise default to member
      const role: UserRole = normalized.includes('admin')
        ? 'admin'
        : normalized.includes('alumni')
        ? 'alumni'
        : 'member';

      const displayName = email.split('@')[0].replace(/[._-]/g, ' ');
      const capitalized = displayName.charAt(0).toUpperCase() + displayName.slice(1);

      user = {
        id: `user-${Date.now()}`,
        name: capitalized || 'YSSE Member',
        email: normalized,
        role,
        interests: ['Social Entrepreneurship', 'Community Development'],
        lastLoginAt: new Date().toISOString(),
      };

      users.push(user);
      saveStoredUsers(users);
    } else {
      user = { ...user, lastLoginAt: new Date().toISOString() };
      const idx = users.findIndex((u) => u.id === user!.id);
      if (idx !== -1) {
        users[idx] = user;
        saveStoredUsers(users);
      }
    }

    saveStoredAuth(user);
    logActivity(user.name, 'Signed in', 'Email authentication');
    return user;
  },

  async registerUser(data: {
    name: string;
    email: string;
    password?: string;
    role: 'member' | 'alumni';
  }): Promise<User> {
    await delay(250);
    const normalized = data.email.trim().toLowerCase();
    const users = getStoredUsers();

    const existing = users.find((u) => u.email.toLowerCase() === normalized);
    if (existing) {
      // Log in as existing
      const updated = { ...existing, name: data.name || existing.name, role: data.role, lastLoginAt: new Date().toISOString() };
      saveStoredAuth(updated);
      return updated;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      email: normalized,
      role: data.role,
      interests: data.role === 'alumni' ? ['Mentorship', 'Leadership'] : ['Internships', 'Career Guidance'],
      lastLoginAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveStoredUsers(users);
    saveStoredAuth(newUser);
    logActivity(newUser.name, 'Registered account', `Role: ${newUser.role}`);
    return newUser;
  },

  async loginWithGoogle(targetRole: UserRole = 'member'): Promise<User> {
    await delay(200);
    const effectiveRole: 'member' | 'alumni' | 'admin' =
      targetRole === 'visitor' ? 'member' : targetRole;
    const users = getStoredUsers();
    let matched = users.find((u) => u.role === effectiveRole);

    if (!matched) {
      matched = {
        id: `user-google-${Date.now()}`,
        name: effectiveRole === 'alumni' ? 'Google Alumni User' : 'Google Member User',
        email: `${effectiveRole}.user@gmail.com`,
        role: effectiveRole,
        lastLoginAt: new Date().toISOString(),
      };
      users.push(matched);
      saveStoredUsers(users);
    } else {
      matched = { ...matched, lastLoginAt: new Date().toISOString() };
    }

    saveStoredAuth(matched);
    logActivity(matched.name, 'Signed in', 'Google OAuth');
    return matched;
  },

  async updateUser(updates: Partial<User>): Promise<User> {
    await delay(150);
    const current = getStoredAuth();
    if (!current) throw new Error('No active user session');

    const updated = { ...current, ...updates };
    saveStoredAuth(updated);

    const allUsers = getStoredUsers();
    const idx = allUsers.findIndex((u) => u.id === current.id);
    if (idx !== -1) {
      allUsers[idx] = updated;
      saveStoredUsers(allUsers);
    }

    return updated;
  },

  async logout(): Promise<void> {
    await delay(80);
    saveStoredAuth(null);
  },
};
