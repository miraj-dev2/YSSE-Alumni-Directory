// DEMO DATA: In-memory store for YSSE Admin Panel
import { AlumniProfile, SessionRequest, AdminUser } from '../types/admin';

export const DEMO_ADMIN_USER: AdminUser = {
  id: 'admin-1',
  name: 'Rashidul Alam',
  email: 'rashidul.alam@ysseglobal.org',
  role: 'ADMIN',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
};

export const INITIAL_ALUMNI_STORE: AlumniProfile[] = [
  {
    id: 'alm-1', name: 'Tanvir Hossain', email: 'tanvir.hossain@google.com',
    batch: 'Batch 8', wing: 'YSSE IT', currentRole: 'Senior Software Engineer',
    organization: 'Google', location: 'Munich, Germany', linkedinUrl: 'https://linkedin.com/in/tanvir-hossain',
    isContactPublic: true, status: 'APPROVED', openToSessions: true, submittedAt: '2024-04-12', updatedAt: '2024-05-10',
  },
  {
    id: 'alm-2', name: 'Nusrat Jahan', email: 'nusrat.jahan@unilever.com',
    batch: 'Batch 7', wing: 'Marketing & PR', currentRole: 'Brand Communications Manager',
    organization: 'Unilever', location: 'Dhaka, Bangladesh', linkedinUrl: 'https://linkedin.com/in/nusrat-jahan',
    isContactPublic: true, status: 'APPROVED', openToSessions: true, submittedAt: '2024-03-15', updatedAt: '2024-04-12',
  },
  {
    id: 'alm-3', name: 'Saimon Chowdhury', email: 'saimon.c@microsoft.com',
    batch: 'Batch 8', wing: 'YSSE IT', currentRole: 'Machine Learning Engineer',
    organization: 'Microsoft', location: 'Seattle, USA', linkedinUrl: 'https://linkedin.com/in/saimon-c',
    isContactPublic: false, status: 'APPROVED', openToSessions: true, submittedAt: '2024-05-01', updatedAt: '2024-05-18',
  },
  {
    id: 'alm-4', name: 'Farzana Haque', email: 'farzana.haque@bkash.com',
    batch: 'Batch 6', wing: 'HR & Talent', currentRole: 'People Operations Specialist',
    organization: 'bKash', location: 'Dhaka, Bangladesh', linkedinUrl: 'https://linkedin.com/in/farzana-h',
    isContactPublic: true, status: 'PENDING', openToSessions: false, submittedAt: '2024-05-19', updatedAt: '2024-05-19',
  },
  {
    id: 'alm-5', name: 'Kazi Farhan', email: 'kazi.farhan@worldbank.org',
    batch: 'Batch 5', wing: 'Finance & Sponsorship', currentRole: 'Investment Analyst',
    organization: 'World Bank Group', location: 'Washington, D.C.', linkedinUrl: 'https://linkedin.com/in/kazi-farhan',
    isContactPublic: true, status: 'PENDING', openToSessions: true, submittedAt: '2024-05-20', updatedAt: '2024-05-20',
  },
  {
    id: 'alm-6', name: 'Anika Rahman', email: 'anika.rahman@canva.com',
    batch: 'Batch 7', wing: 'Creative & Content', currentRole: 'Senior Product Designer',
    organization: 'Canva', location: 'Sydney, Australia', linkedinUrl: 'https://linkedin.com/in/anika-r',
    isContactPublic: false, status: 'PENDING', openToSessions: true, submittedAt: '2024-05-21', updatedAt: '2024-05-21',
  },
  {
    id: 'alm-7', name: 'Mahir Faisal', email: 'mahir.faisal@pathao.com',
    batch: 'Batch 4', wing: 'Operations & Logistics', currentRole: 'Fleet Strategy Lead',
    organization: 'Pathao', location: 'Dhaka, Bangladesh', linkedinUrl: 'https://linkedin.com/in/mahir-f',
    isContactPublic: true, status: 'REJECTED', rejectionReason: 'Unable to verify batch tenure with records.',
    openToSessions: false, submittedAt: '2024-02-10', updatedAt: '2024-02-15',
  },
];

export const INITIAL_SESSIONS_STORE: SessionRequest[] = [
  {
    id: 'req-1', offerId: 'alm-1', requesterId: 'user-101',
    requesterName: 'Abrar Fahim', requesterEmail: 'abrar.fahim@ysse.org',
    alumniName: 'Tanvir Hossain', topic: 'Cracking Big Tech Coding Interviews',
    message: 'Seeking advice on system design expectations in Europe.',
    status: 'PENDING', createdAt: '2024-05-20T10:15:00Z',
  },
  {
    id: 'req-2', offerId: 'alm-2', requesterId: 'user-102',
    requesterName: 'Sumaiya Akter', requesterEmail: 'sumaiya.akter@ysse.org',
    alumniName: 'Nusrat Jahan', topic: 'FMCG Brand Management Career Trajectory',
    message: 'Undergraduate aiming for FMCG strategy management trainee program.',
    status: 'ACCEPTED', createdAt: '2024-05-18T14:30:00Z',
  },
  {
    id: 'req-3', offerId: 'alm-3', requesterId: 'user-103',
    requesterName: 'Tanzim Hossain', requesterEmail: 'tanzim.hossain@ysse.org',
    alumniName: 'Saimon Chowdhury', topic: 'Applied Machine Learning in Industry',
    message: 'Seeking guidance on transition from engineering to ML modeling.',
    status: 'DONE', createdAt: '2024-05-15T09:00:00Z',
  },
];
