import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

vi.mock('../src/lib/prisma.js', () => ({
  prisma: {
    alumniTalk: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn()
    }
  }
}));

describe('Alumni Talk API', () => {
  it('GET /api/talks returns list of knowledge sharing talks', async () => {
    const mockTalk = {
      id: 'talk_1',
      title: 'Building Scalable Fintech with AI',
      topic: 'Fintech & Tech Innovation',
      speakerName: 'Tanvir Hossain',
      speakerRole: 'Engineering Lead',
      speakerOrg: 'bKash',
      talkDate: new Date('2026-09-15T14:00:00Z'),
      recordingUrl: 'https://youtube.com/watch?v=demo123',
      liveUrl: null,
      isFeatured: true,
      speaker: null
    };

    (prisma.alumniTalk.findMany as any).mockResolvedValueOnce([mockTalk]);

    const res = await request(app).get('/api/talks');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('Building Scalable Fintech with AI');
    expect(res.body.data[0].recordingUrl).toBe('https://youtube.com/watch?v=demo123');
  });

  it('GET /api/talks/:id returns 404 when talk not found', async () => {
    (prisma.alumniTalk.findUnique as any).mockResolvedValueOnce(null);

    const res = await request(app).get('/api/talks/non_existent_id');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
