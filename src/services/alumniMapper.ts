import { AlumniProfile, ApprovalStatus } from '../types';

export const mapBackendAlumniToFrontend = (item: any): AlumniProfile => {
  const locationParts = (item.location || 'Dhaka, Bangladesh').split(',');
  const city = locationParts[0]?.trim() || 'Dhaka';
  const country = locationParts[1]?.trim() || 'Bangladesh';

  const rawStatus = (item.status || 'APPROVED').toUpperCase();
  const approvalStatus: ApprovalStatus =
    rawStatus === 'APPROVED' ? 'Approved' : rawStatus === 'REJECTED' ? 'Rejected' : 'Pending';

  return {
    id: item.id,
    userId: item.userId || item.id,
    name: item.name || '',
    batch: typeof item.batch === 'number' ? `Batch ${item.batch}` : (item.batch || 'Batch 1'),
    wing: item.wing || '',
    role: item.currentRole || item.role || 'Member',
    organization: item.organization || 'YSSE Global',
    city,
    country,
    bio: item.bio || '',
    photoUrl: item.photoUrl || undefined,
    email: item.email || '',
    linkedinUrl: item.linkedinUrl || undefined,
    isEmailPublic: Boolean(item.isContactPublic),
    isLinkedinPublic: Boolean(item.isContactPublic),
    openToSessions: Boolean(item.openToSessions),
    sessionTopic: item.sessionTopic || undefined,
    sessionFormat: item.sessionFormat || 'Online',
    expertise: item.expertise || ['Social Entrepreneurship', 'Leadership'],
    career: item.career || [],
    updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : new Date().toISOString(),
    createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
    approvalStatus,
    rejectionReason: item.rejectionReason || undefined
  };
};
