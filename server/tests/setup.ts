import { vi, beforeEach } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_at_least_32_characters_long_for_unit_tests!';
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';
process.env.ADMIN_EMAILS = 'admin@ysseglobal.org';
process.env.DATABASE_URL = 'postgresql://mock:mock@localhost:5432/mock';
process.env.UPLOAD_DIR = './test-uploads';

beforeEach(() => {
  vi.clearAllMocks();
});
