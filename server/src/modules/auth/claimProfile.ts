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

