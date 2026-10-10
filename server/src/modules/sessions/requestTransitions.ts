import { RequestStatus } from '@prisma/client';

export type AllowedTransitions = Record<RequestStatus, readonly RequestStatus[]>;

export const SESSION_REQUEST_TRANSITIONS: AllowedTransitions = {
  PENDING: ['ACCEPTED', 'DECLINED'] as const,
  ACCEPTED: ['DONE'] as const,
  DECLINED: [] as const,
  DONE: [] as const
} as const;

export const isValidSessionTransition = (
  currentStatus: RequestStatus,
  targetStatus: RequestStatus
): boolean => {
  const allowed = SESSION_REQUEST_TRANSITIONS[currentStatus];
  return Boolean(allowed && allowed.includes(targetStatus));
};
