import { User } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-alumni-1',
    name: 'Abrar Zahin',
    email: 'abrar.zahin@example.com',
    role: 'alumni',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    interests: ['Frontend Engineering', 'Accessibility', 'Microservices'],
    lastLoginAt: '2024-05-18T10:00:00Z',
  },
  {
    id: 'user-member-1',
    name: 'Tanima Rahman',
    email: 'tanima.rahman@ysse.org',
    role: 'member',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    interests: ['Social Entrepreneurship', 'Tech & Innovation', 'UI/UX Design'],
    lastLoginAt: '2024-05-17T15:30:00Z',
  },
  {
    id: 'user-admin-1',
    name: 'Rashidul Alam',
    email: 'rashidul.alam@ysse.org',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    interests: ['Non-Profit Leadership', 'Partnerships', 'Global Grants'],
    lastLoginAt: '2024-05-18T11:45:00Z',
  },
  {
    id: 'user-admin-2',
    name: 'Nusrat Jahan',
    email: 'admin.nusrat@ysse.org',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    interests: ['Operations Strategy', 'Mentorship Governance'],
    lastLoginAt: '2024-05-16T09:20:00Z',
  },
];
