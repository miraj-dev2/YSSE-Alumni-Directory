import { ActivityLog } from '../types';

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    actorId: 'user-admin-1',
    actorName: 'Rashidul Alam',
    action: 'Approved Profile',
    target: 'Tanvir Hossain (Batch 2019)',
    createdAt: '2024-05-18T11:20:00Z',
  },
  {
    id: 'log-2',
    actorId: 'user-admin-1',
    actorName: 'Rashidul Alam',
    action: 'Sent Stale Profile Reminder',
    target: 'Batch 2018 Alumni Cohort (14 profiles)',
    createdAt: '2024-05-18T09:40:00Z',
  },
  {
    id: 'log-3',
    actorId: 'user-alumni-1',
    actorName: 'Abrar Zahin',
    action: 'Updated Profile',
    target: 'Self Profile (Role & Career Timeline)',
    createdAt: '2024-05-17T16:15:00Z',
  },
  {
    id: 'log-4',
    actorId: 'user-admin-2',
    actorName: 'Nusrat Jahan',
    action: 'Accepted Session Request',
    target: 'Request #req-2 with Anika Rahman',
    createdAt: '2024-05-16T14:10:00Z',
  },
  {
    id: 'log-5',
    actorId: 'user-admin-1',
    actorName: 'Rashidul Alam',
    action: 'Imported CSV Alumni',
    target: 'Bulk ingestion (12 rows added)',
    createdAt: '2024-05-15T12:00:00Z',
  },
  {
    id: 'log-6',
    actorId: 'user-admin-2',
    actorName: 'Nusrat Jahan',
    action: 'Rejected Profile',
    target: 'Spam Account Test (Reason: Unverified affiliation)',
    createdAt: '2024-05-14T08:30:00Z',
  },
];
