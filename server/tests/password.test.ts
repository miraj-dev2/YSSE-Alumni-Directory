import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { hashPassword, verifyPassword, needsRehash } from '../src/lib/password.js';

describe('Password Service (Async Scrypt & OWASP Upgrade)', () => {
  const plain = 'StrongP@ssw0rd2026!';

  it('performs hash and verify round trip with v2 prefix', async () => {
    const hashed = await hashPassword(plain);
    expect(hashed).toMatch(/^v2:[0-9a-f]{32}:[0-9a-f]{128}$/);
    expect(needsRehash(hashed)).toBe(false);

    const isValid = await verifyPassword(plain, hashed);
    expect(isValid).toBe(true);
  });

  it('rejects an incorrect password', async () => {
    const hashed = await hashPassword(plain);
    const isValid = await verifyPassword('WrongPassword123!', hashed);
    expect(isValid).toBe(false);
  });

  it('verifies legacy format hashes (salt:hash without prefix) and flags them for rehash', async () => {
    // Generate legacy hash format manually using scryptSync (N=16384)
    const salt = crypto.randomBytes(16).toString('hex');
    const legacyDerived = crypto.scryptSync(plain, salt, 64).toString('hex');
    const legacyCombined = `${salt}:${legacyDerived}`;

    expect(needsRehash(legacyCombined)).toBe(true);

    // Verifies successfully against legacy hash
    const isValid = await verifyPassword(plain, legacyCombined);
    expect(isValid).toBe(true);

    // Wrong password against legacy hash fails
    const isWrongValid = await verifyPassword('IncorrectLegacy!', legacyCombined);
    expect(isWrongValid).toBe(false);
  });

  it('handles malformed or invalid hash strings gracefully', async () => {
    expect(await verifyPassword(plain, null)).toBe(false);
    expect(await verifyPassword(plain, '')).toBe(false);
    expect(await verifyPassword(plain, 'invalid_no_colon')).toBe(false);
    expect(await verifyPassword(plain, 'v3:too:many:parts:here')).toBe(false);
  });
});
