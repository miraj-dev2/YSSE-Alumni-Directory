import { SessionRequest, SessionRequestStatus } from '../types';

export const mapBackendSessionRequestToFrontend = (item: any): SessionRequest => {
  const rawStatus = (item.status || 'PENDING').toUpperCase();
  const statusMap: Record<string, SessionRequestStatus> = {
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
    DECLINED: 'Declined',
    DONE: 'Done'
  };

  return {
    id: item.id,
    alumniId: item.offer?.alumniId || item.alumniId || '',
    alumniName: item.offer?.alumni?.name || item.alumniName || 'Mentor',
    alumniPhoto: item.offer?.alumni?.photoUrl || item.alumniPhoto || undefined,
    alumniRole: item.offer?.alumni?.currentRole || item.alumniRole || 'Mentor',
    alumniOrg: item.offer?.alumni?.organization || item.alumniOrg || 'YSSE Global',
    requesterId: item.requesterId || item.requester?.id || '',
    requesterName: item.requester?.name || item.requesterName || 'Mentee',
    requesterEmail: item.requester?.email || item.requesterEmail || '',
    topic: item.offer?.topic || item.topic || 'Mentorship Session',
    message: item.message || '',
    status: statusMap[rawStatus] || 'Pending',
    createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString()
  };
};
