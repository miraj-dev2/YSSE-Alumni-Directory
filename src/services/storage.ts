import { INITIAL_ALUMNI } from '../mock/alumniData';
import { INITIAL_SESSIONS } from '../mock/sessionsData';
import { INITIAL_USERS } from '../mock/userData';
import { INITIAL_ACTIVITY_LOGS } from '../mock/activityData';
import { AlumniProfile, User, SessionRequest, ActivityLog } from '../types';

const ALUMNI_KEY = 'ysse_alumni_directory_v2';
const SESSIONS_KEY = 'ysse_sessions_v2';
const USERS_KEY = 'ysse_users_v2';
const LOGS_KEY = 'ysse_activity_logs_v2';
const AUTH_KEY = 'ysse_auth_v2';
const SETTINGS_KEY = 'ysse_admin_settings_v2';

export interface AdminSettings {
  approvalRequired: boolean;
  defaultEmailPublic: boolean;
  defaultLinkedinPublic: boolean;
  reminderIntervalMonths: number;
  emailTemplate: string;
}

const DEFAULT_SETTINGS: AdminSettings = {
  approvalRequired: true,
  defaultEmailPublic: true,
  defaultLinkedinPublic: true,
  reminderIntervalMonths: 6,
  emailTemplate:
    'Hi {{name}},\n\nIt has been over 6 months since your YSSE alumni profile was last refreshed. Please take 2 minutes to update your current company and mentorship availability so fellows can connect with you.\n\nWarm regards,\nYSSE Alumni Secretariat',
};

export function getStoredAlumni(): AlumniProfile[] {
  try {
    const raw = localStorage.getItem(ALUMNI_KEY);
    if (!raw) {
      localStorage.setItem(ALUMNI_KEY, JSON.stringify(INITIAL_ALUMNI));
      return INITIAL_ALUMNI;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ALUMNI;
  }
}

export function saveStoredAlumni(data: AlumniProfile[]): void {
  localStorage.setItem(ALUMNI_KEY, JSON.stringify(data));
}

export function getStoredSessions(): SessionRequest[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(INITIAL_SESSIONS));
      return INITIAL_SESSIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SESSIONS;
  }
}

export function saveStoredSessions(data: SessionRequest[]): void {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(data));
}

export function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveStoredUsers(data: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(data));
}

export function getStoredLogs(): ActivityLog[] {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) {
      localStorage.setItem(LOGS_KEY, JSON.stringify(INITIAL_ACTIVITY_LOGS));
      return INITIAL_ACTIVITY_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ACTIVITY_LOGS;
  }
}

export function logActivity(actorName: string, action: string, target: string): void {
  const current = getStoredLogs();
  const entry: ActivityLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    actorId: 'system',
    actorName,
    action,
    target,
    createdAt: new Date().toISOString(),
  };
  current.unshift(entry);
  localStorage.setItem(LOGS_KEY, JSON.stringify(current));
}

export function getStoredSettings(): AdminSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
  return DEFAULT_SETTINGS;
}

export function saveStoredSettings(s: AdminSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export function getStoredAuth(): User {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // Default to Alumni user (Abrar Zahin) for rich exploration
  const defaultUser = INITIAL_USERS[0];
  localStorage.setItem(AUTH_KEY, JSON.stringify(defaultUser));
  return defaultUser;
}

export function saveStoredAuth(user: User | null): void {
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function resetAllStorage(): void {
  localStorage.setItem(ALUMNI_KEY, JSON.stringify(INITIAL_ALUMNI));
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(INITIAL_SESSIONS));
  localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(LOGS_KEY, JSON.stringify(INITIAL_ACTIVITY_LOGS));
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
}
