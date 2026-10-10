import { describe, it, expect } from 'vitest';
import { parseAndValidateRow } from '../src/modules/admin/csvRowRules.js';

describe('CSV Import Row Validation Rules', () => {
  const knownWings = new Set(['it', 'academy', 'charity hub']);
  const seenEmails = new Set<string>();

  it('validates a completely correct CSV row', () => {
    const raw = {
      name: 'John Doe',
      email: 'john@example.com',
      batch: '8',
      wing: 'IT',
      role: 'Tech Lead',
      organization: 'Tech Org'
    };

    const res = parseAndValidateRow(raw, 2, knownWings, seenEmails);
    expect(res.isValid).toBe(true);
    expect(res.parsed?.email).toBe('john@example.com');
    expect(res.parsed?.batch).toBe(8);
  });

  it('rejects invalid or malformed email address', () => {
    const raw = { name: 'Invalid Email', email: 'notanemail', batch: '5', wing: 'IT' };
    const res = parseAndValidateRow(raw, 3, knownWings, seenEmails);
    expect(res.isValid).toBe(false);
    expect(res.status).toBe('invalid_email');
  });

  it('rejects missing or non-positive batch number', () => {
    const raw = { name: 'No Batch', email: 'nobatch@example.com', batch: '0', wing: 'IT' };
    const res = parseAndValidateRow(raw, 4, knownWings, seenEmails);
    expect(res.isValid).toBe(false);
    expect(res.status).toBe('missing_batch');
  });

  it('rejects unknown wing names', () => {
    const raw = { name: 'Unknown Wing', email: 'uw@example.com', batch: '3', wing: 'Space Wing' };
    const res = parseAndValidateRow(raw, 5, knownWings, seenEmails);
    expect(res.isValid).toBe(false);
    expect(res.status).toBe('unknown_wing');
  });
});
