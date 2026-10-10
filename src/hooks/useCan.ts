import { useAuth } from '../context/AuthContext';
import { Permission, UserRole } from '../types';

const PERMISSION_MATRIX: Record<Permission, Record<UserRole, boolean>> = {
  view_directory: {
    visitor: true,
    member: true,
    alumni: true,
    admin: true,
  },
  view_contact_private: {
    visitor: false,
    member: true,
    alumni: true,
    admin: true,
  },
  view_contact_full: {
    visitor: false,
    member: false,
    alumni: false,
    admin: true,
  },
  request_session: {
    visitor: false,
    member: true,
    alumni: false,
    admin: false,
  },
  manage_own_profile: {
    visitor: false,
    member: false,
    alumni: true,
    admin: false,
  },
  offer_sessions: {
    visitor: false,
    member: false,
    alumni: true,
    admin: false,
  },
  approve_profiles: {
    visitor: false,
    member: false,
    alumni: false,
    admin: true,
  },
  manage_alumni: {
    visitor: false,
    member: false,
    alumni: false,
    admin: true,
  },
  manage_sessions: {
    visitor: false,
    member: false,
    alumni: false,
    admin: true,
  },
  import_export_csv: {
    visitor: false,
    member: false,
    alumni: false,
    admin: true,
  },
  view_admin_dashboard: {
    visitor: false,
    member: false,
    alumni: false,
    admin: true,
  },
  send_stale_reminders: {
    visitor: false,
    member: false,
    alumni: false,
    admin: true,
  },
  manage_settings: {
    visitor: false,
    member: false,
    alumni: false,
    admin: true,
  },
};

export const useCan = (permission: Permission): boolean => {
  const { role } = useAuth();
  return PERMISSION_MATRIX[permission]?.[role] ?? false;
};
