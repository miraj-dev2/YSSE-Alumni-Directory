import { prisma } from '../../lib/prisma.js';
import { logger } from '../../lib/logger.js';

export const autoClaimAlumniProfile = async (
  userId: string,
  userEmail: string
): Promise<void> => {
  try {
    const unlinkedProfile = await prisma.alumniProfile.findFirst({
      where: {
        email: userEmail.toLowerCase().trim(),
        userId: null
      }
    });

    if (unlinkedProfile) {
      await prisma.alumniProfile.update({
        where: { id: unlinkedProfile.id },
        data: { userId }
      });
      logger.info(
        { userId, profileId: unlinkedProfile.id, email: userEmail },
        'Auto-claimed existing alumni profile for user'
      );
    }
  } catch (error) {
    logger.error({ error, userId, userEmail }, 'Error during profile auto-claim');
  }
};

export const ensureAlumniProfile = async (
  userId: string,
  userEmail: string,
  name: string
): Promise<void> => {
  try {
    await autoClaimAlumniProfile(userId, userEmail);
    const existing = await prisma.alumniProfile.findFirst({
      where: { OR: [{ userId }, { email: userEmail.toLowerCase().trim() }] }
    });

    if (!existing) {
      const defaultWing = await prisma.wing.findFirst({ orderBy: { name: 'asc' } });
      if (defaultWing) {
        await prisma.alumniProfile.create({
          data: {
            userId,
            email: userEmail.toLowerCase().trim(),
            name,
            batch: new Date().getFullYear(),
            wingId: defaultWing.id,
            status: 'PENDING',
            source: 'SELF'
          }
        });
        logger.info({ userId, email: userEmail }, 'Created initial self alumni profile');
      }
    } else if (!existing.userId) {
      await prisma.alumniProfile.update({
        where: { id: existing.id },
        data: { userId }
      });
    }
  } catch (error) {
    logger.error({ error, userId, userEmail }, 'Error ensuring alumni profile');
  }
};

