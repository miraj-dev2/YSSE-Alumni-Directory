import { prisma } from '../../lib/prisma.js';

export const getAllWings = async () => {
  return prisma.wing.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          profiles: {
            where: { status: 'APPROVED' }
          }
        }
      }
    }
  });
};
