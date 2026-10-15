import { z } from 'zod';

export const googleAuthSchema = z.object({
  idToken: z.string().min(10, 'Google ID token is required')
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('A valid email address is required'),
  password: z.string().min(1, 'Password is required')
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().toLowerCase().email('A valid email address is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.undefined({ invalid_type_error: 'Role assignment is not permitted during registration' })
});

export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
