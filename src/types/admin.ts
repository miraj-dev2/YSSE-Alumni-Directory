// Strict TypeScript domain models for YSSE Admin Panel
export type AlumniStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AlumniProfile {
  id: string;
  name: string;
  email: string;
  batch: string;
  wing: string;
  currentRole: string;
  organization: string;
  location: string;
  linkedinUrl: string;
  photoUrl?: string;
  isContactPublic: boolean;
  openToSessions: boolean;
  status: AlumniStatus;
  rejectionReason?: string;
  submittedAt?: string;
  updatedAt?: string;
}

export type SessionStatus = 'PENDING' | 'ACCEPTED' | 'DONE';

export interface SessionRequest {
  id: string;
  offerId: string;
  requesterId: string;
  requesterName?: string;
  requesterEmail?: string;
  alumniName?: string;
  topic?: string;
  message: string;
  status: SessionStatus;
  createdAt?: string;
}

export type AdminUserRole = 'ADMIN' | 'MEMBER';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  avatarUrl?: string;
}

export interface DashboardStats {
  totalAlumni: number;
  openToSessions: number;
  pendingApprovals: number;
  sessionRequests: number;
}

export interface GrowthPoint {
  period: string;
  count: number;
}

export interface ChartBarData {
  label: string;
  count: number;
}

export interface WingDonutPoint {
  wing: string;
  count: number;
  percentage: number;
  color: string;
}

export interface PaginatedAlumniQuery {
  search?: string;
  batch?: string;
  wing?: string;
  status?: string;
  sortBy?: 'name' | 'batch' | 'wing' | 'organization' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page: number;
  pageSize: number;
  openToSessionsOnly?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
