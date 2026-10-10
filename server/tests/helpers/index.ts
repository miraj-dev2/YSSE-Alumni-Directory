import { Role, AlumniStatus } from '@prisma/client';
import { signToken } from '../../src/lib/jwt.js';

export const makeUser = (overrides?: Partial<{
  id: string;
  email: string;
  name: string;
  role: Role;
  googleId: string;
}>) => ({
  id: overrides?.id || 'usr_test_123',
  email: overrides?.email || 'test@example.com',
  name: overrides?.name || 'Test User',
  role: overrides?.role || 'MEMBER',
  googleId: overrides?.googleId || 'google_sub_123',
  avatarUrl: null,
  createdAt: new Date()
});

export const loginAs = (userId: string): string => {
  return signToken(userId);
};

export const makeProfile = (overrides?: Partial<{
  id: string;
  userId: string | null;
  name: string;
  email: string;
  batch: number;
  wingId: string;
  wingName: string;
  status: AlumniStatus;
  isContactPublic: boolean;
  openToSessions: boolean;
}>) => ({
  id: overrides?.id || 'prof_test_123',
  userId: overrides?.userId ?? 'usr_test_123',
  name: overrides?.name || 'Test Alumni',
  email: overrides?.email || 'alumni@example.com',
  batch: overrides?.batch || 8,
  wingId: overrides?.wingId || 'wing_it_123',
  currentRole: 'Senior Software Engineer',
  organization: 'Tech Co',
  location: 'Dhaka',
  linkedinUrl: 'https://linkedin.com/in/test',
  bio: 'Passionate about engineering',
  photoUrl: '/uploads/test.webp',
  isContactPublic: overrides?.isContactPublic ?? false,
  status: overrides?.status || 'APPROVED',
  rejectionReason: null,
  reviewedById: null,
  reviewedAt: null,
  source: 'SELF' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  wing: { id: overrides?.wingId || 'wing_it_123', name: overrides?.wingName || 'IT' },
  sessionOffers: overrides?.openToSessions
    ? [{ id: 'off_1', isActive: true }]
    : []
});
