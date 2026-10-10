import { prisma } from '../../lib/prisma.js';
import { Prisma } from '@prisma/client';

export interface CreateAuditLogParams {
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  meta?: Prisma.InputJsonValue;
}

export const recordAuditLog = async (params: CreateAuditLogParams) => {
  return prisma.auditLog.create({
    data: {
      actorId: params.actorId,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      meta: params.meta
    }
  });
};

export const getAuditLogs = async (take = 50) => {
  return prisma.auditLog.findMany({
    take,
    orderBy: { createdAt: 'desc' },
    include: {
      actor: {
        select: { id: true, name: true, email: true, role: true }
      }
    }
  });
};
