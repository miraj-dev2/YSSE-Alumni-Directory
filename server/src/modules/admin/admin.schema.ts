import { z } from 'zod';
import { alumniQuerySchema, createProfileSchema } from '../alumni/alumni.schema.js';

export const adminAlumniQuerySchema = alumniQuerySchema.extend({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED'] as const).optional()
});

export const updateStatusSchema = z
  .object({
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED'] as const),
    reason: z.string().trim().optional()
  })
  .refine(
    (data) => {
      if (data.status === 'REJECTED') {
        return Boolean(data.reason && data.reason.trim().length > 0);
      }
      return true;
    },
    {
      message: 'A non-empty rejection reason is required when rejecting a profile',
      path: ['reason']
    }
  );

export const bulkStatusSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, 'At least one profile ID is required'),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED'] as const),
  reason: z.string().trim().optional()
});

export const adminCreateAlumniSchema = createProfileSchema.extend({
  email: z.string().trim().email().toLowerCase(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED'] as const).default('APPROVED')
});

export const adminUpdateAlumniSchema = adminCreateAlumniSchema.partial();

export type AdminAlumniQueryInput = z.infer<typeof adminAlumniQuerySchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type BulkStatusInput = z.infer<typeof bulkStatusSchema>;
export type AdminCreateAlumniInput = z.infer<typeof adminCreateAlumniSchema>;
export type AdminUpdateAlumniInput = z.infer<typeof adminUpdateAlumniSchema>;
