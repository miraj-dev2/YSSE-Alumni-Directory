import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),
  ADMIN_EMAILS: z
    .string()
    .default('')
    .transform((val) =>
      val
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)
    ),
  UPLOAD_DIR: z.string().default('./uploads')
});

const parseEnv = () => {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('❌ Critical Environment Validation Error:', parsed.error.format());
    process.exit(1);
  }
  return parsed.data;
};

export const env = parseEnv();
export type Env = z.infer<typeof envSchema>;
