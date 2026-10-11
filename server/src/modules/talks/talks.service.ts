import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../lib/AppError.js';
import { TalkQueryInput, CreateTalkInput, UpdateTalkInput } from './talks.schema.js';

/**
 * Retrieves recorded talks & upcoming panels matching search terms and filters.
 */
export const getTalks = async (query: TalkQueryInput) => {
  const where: any = {};

  if (query.featuredOnly) {
    where.isFeatured = true;
  }

  if (query.q) {
    where.OR = [
      { title: { contains: query.q, mode: 'insensitive' } },
      { topic: { contains: query.q, mode: 'insensitive' } },
      { speakerName: { contains: query.q, mode: 'insensitive' } }
    ];
  }

  const talks = await prisma.alumniTalk.findMany({
    where,
    orderBy: { talkDate: 'desc' },
    take: query.limit || 20,
    include: {
      speaker: {
        select: {
          id: true,
          name: true,
          batch: true,
          wing: { select: { name: true } },
          currentRole: true,
          organization: true,
          photoUrl: true
        }
      }
    }
  });

  return talks;
};

/**
 * Retrieves a single talk by its unique ID.
 */
export const getTalkById = async (id: string) => {
  const talk = await prisma.alumniTalk.findUnique({
    where: { id },
    include: {
      speaker: {
        select: {
          id: true,
          name: true,
          batch: true,
          wing: { select: { name: true } },
          currentRole: true,
          organization: true,
          photoUrl: true
        }
      }
    }
  });

  if (!talk) {
    throw AppError.notFound('Alumni talk entry not found');
  }

  return talk;
};

/**
 * Creates and publishes a new Alumni Talk session.
 */
export const createTalk = async (data: CreateTalkInput) => {
  const talk = await prisma.alumniTalk.create({
    data: {
      title: data.title,
      description: data.description,
      topic: data.topic,
      speakerName: data.speakerName,
      speakerRole: data.speakerRole,
      speakerOrg: data.speakerOrg,
      speakerPhoto: data.speakerPhoto,
      speakerId: data.speakerId,
      talkDate: new Date(data.talkDate),
      recordingUrl: data.recordingUrl || null,
      liveUrl: data.liveUrl || null,
      isFeatured: data.isFeatured ?? false
    }
  });

  return talk;
};

/**
 * Updates an existing talk entry.
 */
export const updateTalk = async (id: string, data: UpdateTalkInput) => {
  await getTalkById(id);

  const updated = await prisma.alumniTalk.update({
    where: { id },
    data: {
      ...data,
      talkDate: data.talkDate ? new Date(data.talkDate) : undefined,
      recordingUrl: data.recordingUrl !== undefined ? data.recordingUrl || null : undefined,
      liveUrl: data.liveUrl !== undefined ? data.liveUrl || null : undefined
    }
  });

  return updated;
};

/**
 * Permanently deletes a talk record.
 */
export const deleteTalk = async (id: string) => {
  await getTalkById(id);
  await prisma.alumniTalk.delete({ where: { id } });
  return { id };
};
