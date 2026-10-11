export type UserRole = 'visitor' | 'member' | 'alumni' | 'admin';

export type SessionFormat = 'Online' | 'Offline' | 'Both';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';
export type SessionRequestStatus = 'Pending' | 'Accepted' | 'Done' | 'Declined';

export interface CareerEntry {
  id: string;
  role: string;
  organization: string;
  startYear: string;
  endYear?: string;
  current?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'member' | 'alumni' | 'admin';
  interests?: string[];
  lastLoginAt?: string;
}

export interface AlumniProfile {
  id: string;
  userId: string;
  name: string;
  batch: string;
  wing: string;
  role: string;
  organization: string;
  city: string;
  country: string;
  bio: string;
  photoUrl?: string;
  email: string;
  linkedinUrl?: string;
  isEmailPublic: boolean;
  isLinkedinPublic: boolean;
  openToSessions: boolean;
  sessionTopic?: string;
  sessionFormat?: SessionFormat;
  expertise: string[];
  career: CareerEntry[];
  story?: string;
  updatedAt: string;
  approvalStatus: ApprovalStatus;
  rejectionReason?: string;
  createdAt: string;
}

export interface SessionRequest {
  id: string;
  alumniId: string;
  alumniName?: string;
  alumniPhoto?: string;
  alumniRole?: string;
  alumniOrg?: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  topic: string;
  message: string;
  status: SessionRequestStatus;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  target: string;
  createdAt: string;
}

export interface DirectoryFilterParams {
  search?: string;
  batch?: string;
  wing?: string;
  company?: string;
  city?: string;
  country?: string;
  field?: string;
  openToSessions?: boolean;
  sort?: 'name' | 'batch' | 'updatedAt';
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AlumniTalk {
  id: string;
  title: string;
  description?: string;
  topic: string;
  speakerName: string;
  speakerRole?: string;
  speakerOrg?: string;
  speakerPhoto?: string;
  speakerId?: string;
  talkDate: string;
  recordingUrl?: string;
  liveUrl?: string;
  isFeatured: boolean;
  createdAt: string;
}

export interface CsvAlumniRow {
  name: string;
  email: string;
  batch: string;
  wing: string;
  role: string;
  organization: string;
}

export interface CsvValidationError {
  row: number;
  field: string;
  message: string;
}

export type Permission =
  | 'view_directory'
  | 'view_contact_private'
  | 'view_contact_full'
  | 'request_session'
  | 'manage_own_profile'
  | 'offer_sessions'
  | 'approve_profiles'
  | 'manage_alumni'
  | 'manage_sessions'
  | 'import_export_csv'
  | 'view_admin_dashboard'
  | 'send_stale_reminders'
  | 'manage_settings';
