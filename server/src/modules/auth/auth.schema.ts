import { z } from 'zod';

export const googleAuthSchema = z.object({
  idToken: z.string().min(10, 'Google ID token is required')
});

export const devAuthSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().optional(),
  role: z.enum(['ADMIN', 'MEMBER']).optional()
});

export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
export type DevAuthInput = z.infer<typeof devAuthSchema>;
