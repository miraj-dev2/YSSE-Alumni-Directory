import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import sharp from 'sharp';
import { env } from '../../config/env.js';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../lib/AppError.js';

export const processAndSaveProfilePhoto = async (
  userId: string,
  buffer: Buffer
): Promise<string> => {
  const profile = await prisma.alumniProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw AppError.notFound('Alumni profile not found', 'PROFILE_NOT_FOUND');
  }

  let metadata: sharp.Metadata;
  try {
    metadata = await sharp(buffer).metadata();
  } catch {
    throw AppError.badRequest('Invalid or corrupt image buffer', 'INVALID_IMAGE');
  }

  const allowedFormats = ['jpeg', 'png', 'webp'];
  if (!metadata.format || !allowedFormats.includes(metadata.format)) {
    throw AppError.badRequest(
      'Image content must be a valid JPEG, PNG, or WebP',
      'UNSUPPORTED_IMAGE_FORMAT'
    );
  }

  const uploadDir = path.resolve(env.UPLOAD_DIR);
  await fs.mkdir(uploadDir, { recursive: true });

  const randomHash = crypto.randomBytes(16).toString('hex');
  const filename = `photo-${profile.id}-${randomHash}.webp`;
  const targetPath = path.join(uploadDir, filename);

  await sharp(buffer)
    .resize(400, 400, { fit: 'cover', position: 'center' })
    .webp({ quality: 85 })
    .toFile(targetPath);

  const photoUrl = `/uploads/${filename}`;

  await prisma.alumniProfile.update({
    where: { id: profile.id },
    data: { photoUrl }
  });

  return photoUrl;
};
