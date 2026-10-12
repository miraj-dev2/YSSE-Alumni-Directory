import { PrismaClient } from '../server/node_modules/@prisma/client/default.js';
import supertest from '../server/node_modules/supertest/index.js';
import { app } from '../server/src/app.js';
import { signToken } from '../server/src/lib/jwt.js';
import { hashPassword } from '../server/src/lib/password.js';

export const TEST_DB_URL = 'postgresql://postgres:23001616@localhost:5432/ysse_alumni_test?schema=public';

export const prismaTest = new PrismaClient({
  datasources: { db: { url: TEST_DB_URL } }
});

export const request = supertest(app);

export const createTestUser = async (overrides: {
  email: string;
  name?: string;
  role?: 'ADMIN' | 'MEMBER';
  password?: string;
}) => {
  const passwordHash = hashPassword(overrides.password || 'TestPassword123!');
  return prismaTest.user.upsert({
    where: { email: overrides.email },
    update: {
      role: overrides.role || 'MEMBER',
      name: overrides.name || 'Test User',
      passwordHash
    },
    create: {
      email: overrides.email,
      name: overrides.name || 'Test User',
      role: overrides.role || 'MEMBER',
      passwordHash
    }
  });
};

export const getAuthCookie = (userId: string) => {
  const token = signToken(userId);
  return `token=${token}`;
};
