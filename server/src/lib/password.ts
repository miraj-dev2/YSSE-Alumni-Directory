import crypto from 'crypto';

const scryptAsync = (
  password: crypto.BinaryLike,
  salt: crypto.BinaryLike,
  keylen: number,
  options: crypto.ScryptOptions
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keylen, options, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
};

// OWASP Recommended scrypt parameters for password storage:
// N = 32768 (Cost/iteration parameter), r = 8 (Block size), p = 1 (Parallelization)
// Output keylen: 64 bytes (512 bits)
const OWASP_SCRYPT_OPTIONS: crypto.ScryptOptions = {
  N: 32768,
  r: 8,
  p: 1,
  maxmem: 64 * 1024 * 1024 // 64 MB allowance
};

// Legacy scrypt parameters used by Node default scryptSync: N = 16384, r = 8, p = 1
const LEGACY_SCRYPT_OPTIONS: crypto.ScryptOptions = {
  N: 16384,
  r: 8,
  p: 1,
  maxmem: 32 * 1024 * 1024
};

/**
 * Checks if a stored password hash is using a legacy scrypt cost parameter
 * and requires upgrading to the current OWASP standard (v2 format).
 */
export const needsRehash = (hashString?: string | null): boolean => {
  if (!hashString) return false;
  return !hashString.startsWith('v2:');
};

/**
 * Asynchronously hashes a password using scrypt with OWASP parameters.
 * Format: "v2:<salt_hex>:<hash_hex>"
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = (await scryptAsync(
    password,
    salt,
    64,
    OWASP_SCRYPT_OPTIONS
  )) as Buffer;
  return `v2:${salt}:${derivedKey.toString('hex')}`;
};

/**
 * Asynchronously verifies a password against a stored hash string.
 * Supports:
 * - Current v2 format: "v2:<salt_hex>:<hash_hex>" (N=32768)
 * - Legacy format: "<salt_hex>:<hash_hex>" (N=16384)
 * Uses crypto.timingSafeEqual to prevent side-channel timing attacks.
 */
export const verifyPassword = async (
  password: string,
  combined?: string | null
): Promise<boolean> => {
  if (!combined) return false;
  const parts = combined.split(':');

  let salt: string;
  let expectedHash: string;
  let options: crypto.ScryptOptions;

  if (parts.length === 3 && parts[0] === 'v2') {
    // Current OWASP scrypt format
    [, salt, expectedHash] = parts;
    options = OWASP_SCRYPT_OPTIONS;
  } else if (parts.length === 2) {
    // Legacy scrypt format
    [salt, expectedHash] = parts;
    options = LEGACY_SCRYPT_OPTIONS;
  } else {
    return false;
  }

  try {
    const derivedKey = (await scryptAsync(
      password,
      salt,
      64,
      options
    )) as Buffer;
    const expectedKey = Buffer.from(expectedHash, 'hex');

    if (derivedKey.length !== expectedKey.length) return false;
    return crypto.timingSafeEqual(derivedKey, expectedKey);
  } catch {
    return false;
  }
};
