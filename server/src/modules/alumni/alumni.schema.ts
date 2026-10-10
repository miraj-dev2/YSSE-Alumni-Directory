import { z } from 'zod';

export const alumniQuerySchema = z.object({
  q: z.string().trim().optional(),
  batch: z.coerce.number().int().positive().optional(),
  wing: z.string().trim().optional(),
  openToSessions: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  sort: z.enum(['name_asc', 'name_desc', 'batch_desc', 'batch_asc', 'recent']).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(12)
});

export const createProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  batch: z.coerce.number().int().min(1, 'Valid batch number is required'),
  wingId: z.string().min(1, 'Wing is required'),
  currentRole: z.string().trim().max(100).optional(),
  organization: z.string().trim().max(100).optional(),
  location: z.string().trim().max(100).optional(),
  linkedinUrl: z.string().trim().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  bio: z.string().trim().max(1000).optional(),
  isContactPublic: z.boolean().default(false)
});

export const updateProfileSchema = createProfileSchema.partial();

export type AlumniQueryInput = z.infer<typeof alumniQuerySchema>;
export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
