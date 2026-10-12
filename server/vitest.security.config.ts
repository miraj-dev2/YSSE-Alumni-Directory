import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 20000,
    hookTimeout: 20000,
    include: ['../security-tests/**/*.test.ts'],
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://postgres:23001616@localhost:5432/ysse_alumni_test?schema=public',
      JWT_SECRET: 'test_secret_at_least_32_characters_long_for_security_suite!',
      UPLOAD_DIR: './test-uploads',
      ADMIN_EMAILS: 'admin@ysseglobal.org,sec_admin@example.com,sec_inj_admin@example.com,sec_csv_admin@example.com'
    }
  }
});
