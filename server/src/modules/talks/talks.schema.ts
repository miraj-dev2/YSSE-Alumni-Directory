import { z } from 'zod';

export const talkQuerySchema = z.object({
  q: z.string().trim().optional(),
  featuredOnly: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
  limit: z.coerce.number().int().min(1).max(50).default(20)
});

export const createTalkSchema = z.object({
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().max(1000).optional(),
  topic: z.string().trim().min(2).max(100),
  speakerName: z.string().trim().min(2).max(100),
  speakerRole: z.string().trim().max(100).optional(),
  speakerOrg: z.string().trim().max(100).optional(),
  speakerPhoto: z
    .string()
    .regex(/^https?:\/\//i, 'URL must start with http:// or https://')
    .url()
    .or(z.string().startsWith('/uploads/'))
    .optional(),
  speakerId: z.string().cuid().optional(),
  talkDate: z.string().datetime(),
  recordingUrl: z
    .string()
    .regex(/^https?:\/\//i, 'Recording URL must start with http:// or https://')
    .url()
    .optional()
    .or(z.literal('')),
  liveUrl: z
    .string()
    .regex(/^https?:\/\//i, 'Live URL must start with http:// or https://')
    .url()
    .optional()
    .or(z.literal('')),
  isFeatured: z.boolean().default(false)
});

export const updateTalkSchema = createTalkSchema.partial();

export type TalkQueryInput = z.infer<typeof talkQuerySchema>;
export type CreateTalkInput = z.infer<typeof createTalkSchema>;
export type UpdateTalkInput = z.infer<typeof updateTalkSchema>;
