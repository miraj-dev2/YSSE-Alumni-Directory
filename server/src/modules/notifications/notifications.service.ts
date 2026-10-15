import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../lib/AppError.js';

export const listUserNotifications = async (userId: string) => {
  const [items, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 40
    }),
    prisma.notification.count({
      where: { userId, isRead: false }
    })
  ]);

  return { items, unreadCount };
};

export const markNotificationRead = async (userId: string, id: string) => {
  const note = await prisma.notification.findUnique({ where: { id } });
  if (!note) throw AppError.notFound('Notification not found');
  if (note.userId !== userId) throw AppError.forbidden('Forbidden');

  return prisma.notification.update({
    where: { id },
    data: { isRead: true }
  });
};

export const markAllNotificationsRead = async (userId: string) => {
  const res = await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true }
  });
  return { updated: res.count };
};

export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: string,
  link?: string
) => {
  return prisma.notification.create({
    data: { userId, title, message, type, link }
  });
};
