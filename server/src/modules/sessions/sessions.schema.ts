import { z } from 'zod';

export const createOfferSchema = z.object({
  topic: z.string().trim().min(3, 'Topic must be at least 3 characters').max(150),
  description: z.string().trim().max(1000).optional(),
  mode: z.enum(['ONLINE', 'OFFLINE', 'BOTH'] as const)
});

export const updateOfferSchema = createOfferSchema.partial().extend({
  isActive: z.boolean().optional()
});

export const createRequestSchema = z.object({
  offerId: z.string().min(1, 'Offer ID is required'),
  message: z.string().trim().max(1000).optional()
});

export const updateRequestStatusSchema = z.object({
  status: z.enum(['ACCEPTED', 'DECLINED', 'DONE'] as const)
});

export type CreateOfferInput = z.infer<typeof createOfferSchema>;
export type UpdateOfferInput = z.infer<typeof updateOfferSchema>;
export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type UpdateRequestStatusInput = z.infer<typeof updateRequestStatusSchema>;
