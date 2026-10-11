import crypto from 'crypto';

/**
 * Hashes a plaintext password using crypto.scrypt with a random 16-byte salt.
 * Stored in format: "<salt_hex>:<hash_hex>"
 */
export const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

/**
 * Verifies a plaintext password against a stored "<salt_hex>:<hash_hex>" string.
 * Uses timingSafeEqual to protect against timing attacks.
 */
export const verifyPassword = (password: string, combined?: string | null): boolean => {
  if (!combined) return false;
  const parts = combined.split(':');
  if (parts.length !== 2) return false;

  const [salt, expectedHash] = parts;
  const derivedKey = crypto.scryptSync(password, salt, 64);
  const expectedKey = Buffer.from(expectedHash, 'hex');

  if (derivedKey.length !== expectedKey.length) return false;
  return crypto.timingSafeEqual(derivedKey, expectedKey);
};
