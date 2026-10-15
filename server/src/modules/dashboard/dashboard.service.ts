import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../lib/AppError.js';

export const calculateProfileCompletion = (p: any): number => {
  if (!p) return 0;
  let score = 0;
  if (p.name) score += 10;
  if (p.currentRole) score += 10;
  if (p.organization) score += 10;
  if (p.batch) score += 10;
  if (p.wing?.name || p.wingId) score += 10;
  if (p.location) score += 10;
  if (p.bio && p.bio.length > 20) score += 15;
  if (p.linkedinUrl) score += 10;
  if (p.photoUrl) score += 10;
  if (p.story || (Array.isArray(p.skills) && p.skills.length > 0)) score += 5;
  return Math.min(score, 100);
};

export const getDashboardStats = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: { include: { sessionOffers: true, wing: true } } }
  });

  if (!user) throw AppError.notFound('User not found');

  const unreadNotifications = await prisma.notification.count({
    where: { userId, isRead: false }
  });

  if (user.profile) {
    const alumniId = user.profile.id;
    const [pendingRequests, acceptedSessions, completedSessions] = await Promise.all([
      prisma.sessionRequest.count({
        where: { offer: { alumniId }, status: 'PENDING' }
      }),
      prisma.sessionRequest.count({
        where: { offer: { alumniId }, status: 'ACCEPTED' }
      }),
      prisma.sessionRequest.count({
        where: { offer: { alumniId }, status: 'DONE' }
      })
    ]);

    const recentRequests = await prisma.sessionRequest.findMany({
      where: { offer: { alumniId } },
      include: {
        requester: { select: { id: true, name: true, email: true, avatarUrl: true } },
        offer: { select: { id: true, topic: true, mode: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 4
    });

    return {
      role: 'alumni',
      profileCompletion: calculateProfileCompletion(user.profile),
      stats: {
        pendingRequests,
        acceptedSessions,
        completedSessions,
        offersCount: user.profile.sessionOffers.length,
        unreadNotifications
      },
      recentRequests,
      profile: {
        id: user.profile.id,
        name: user.profile.name,
        photoUrl: user.profile.photoUrl,
        wing: user.profile.wing?.name || '',
        isVerified: user.profile.status === 'APPROVED'
      }
    };
  }

  // Member stats
  const [sentPending, acceptedSessions, completedSessions, savedCount] = await Promise.all([
    prisma.sessionRequest.count({
      where: { requesterId: userId, status: 'PENDING' }
    }),
    prisma.sessionRequest.count({
      where: { requesterId: userId, status: 'ACCEPTED' }
    }),
    prisma.sessionRequest.count({
      where: { requesterId: userId, status: 'DONE' }
    }),
    prisma.savedAlumni.count({
      where: { userId }
    })
  ]);

  const recentRequests = await prisma.sessionRequest.findMany({
    where: { requesterId: userId },
    include: {
      offer: {
        include: {
          alumni: { select: { id: true, name: true, photoUrl: true, wing: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 4
  });

  return {
    role: 'member',
    stats: {
      sentPending,
      acceptedSessions,
      completedSessions,
      savedCount,
      unreadNotifications
    },
    recentRequests,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl
    }
  };
};
