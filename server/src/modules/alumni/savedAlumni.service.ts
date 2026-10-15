import { prisma } from '../../lib/prisma.js';
import { mapProfileToView } from '../../lib/publicProfile.js';
import { AppError } from '../../lib/AppError.js';

export const listSavedAlumni = async (userId: string) => {
  const records = await prisma.savedAlumni.findMany({
    where: { userId },
    include: {
      alumni: {
        include: {
          wing: true,
          sessionOffers: { where: { isActive: true }, select: { id: true, isActive: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return records.map((r) => ({
    savedAt: r.createdAt,
    alumnus: mapProfileToView(r.alumni, { id: userId, role: 'MEMBER' })
  }));
};

export const toggleSaveAlumnus = async (userId: string, alumniId: string) => {
  const alumnus = await prisma.alumniProfile.findUnique({ where: { id: alumniId } });
  if (!alumnus) throw AppError.notFound('Alumni profile not found');

  const existing = await prisma.savedAlumni.findUnique({
    where: { userId_alumniId: { userId, alumniId } }
  });

  if (existing) {
    await prisma.savedAlumni.delete({
      where: { userId_alumniId: { userId, alumniId } }
    });
    return { isSaved: false };
  }

  await prisma.savedAlumni.create({
    data: { userId, alumniId }
  });
  return { isSaved: true };
};

export const getSavedIds = async (userId: string): Promise<string[]> => {
  const saved = await prisma.savedAlumni.findMany({
    where: { userId },
    select: { alumniId: true }
  });
  return saved.map((s) => s.alumniId);
};
