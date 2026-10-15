export interface PortalNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface SavedAlumniItem {
  id: string;
  userId: string;
  alumniId: string;
  createdAt: string;
  alumni: {
    id: string;
    name: string;
    photoUrl?: string;
    wing: string;
    currentRole?: string;
    company?: string;
    city?: string;
    country?: string;
  };
}

export interface AlumniDashboardData {
  role: 'alumni';
  profileCompletion: number;
  stats: {
    pendingRequests: number;
    acceptedSessions: number;
    completedSessions: number;
    offersCount: number;
    unreadNotifications: number;
  };
  recentRequests: any[];
  profile: {
    id: string;
    name: string;
    photoUrl?: string;
    wing: string;
    isVerified: boolean;
  };
}

export interface MemberDashboardData {
  role: 'member';
  stats: {
    sentPending: number;
    acceptedSessions: number;
    completedSessions: number;
    savedCount: number;
    unreadNotifications: number;
  };
  recentRequests: any[];
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export type DashboardStatsData = AlumniDashboardData | MemberDashboardData;
