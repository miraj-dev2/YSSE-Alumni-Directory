import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prismaTest, request, createTestUser } from './test-client.js';

describe('C. Authentication Mechanics & Brute-Force Testing', () => {
  let existingUser: any;

  beforeAll(async () => {
    existingUser = await createTestUser({
      email: 'sec_auth_existing@example.com',
      password: 'RealPassword123!'
    });
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  describe('1. Credential Enumeration & Timing/Message Parity', () => {
    it('returns identical message and 401 status for non-existent user and wrong password', async () => {
      // 1. Non-existent user
      const resNonExistent = await request.post('/api/auth/login').send({
        email: 'does_not_exist_user_9999@example.com',
        password: 'RandomPassword123!'
      });

      // 2. Existing user with wrong password
      const resWrongPassword = await request.post('/api/auth/login').send({
        email: existingUser.email,
        password: 'WrongPassword123!'
      });

      expect(resNonExistent.status).toBe(401);
      expect(resWrongPassword.status).toBe(401);
      expect(resNonExistent.body.error.message).toBe('Invalid email or password');
      expect(resWrongPassword.body.error.message).toBe('Invalid email or password');
      expect(resNonExistent.body.error.code).toBe('INVALID_CREDENTIALS');
      expect(resWrongPassword.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('identifies that registration endpoint reveals when an email is already taken', async () => {
      const res = await request.post('/api/auth/register').send({
        name: 'Duplicate Register Attempt',
        email: existingUser.email,
        password: 'AnotherPassword123!'
      });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('EMAIL_TAKEN');
    });
  });

  describe('2. Password Rules Enforcement', () => {
    it('rejects passwords shorter than 8 characters during registration with 400', async () => {
      const res = await request.post('/api/auth/register').send({
        name: 'Short Password User',
        email: 'short_pw_user@example.com',
        password: '1234567'
      });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
