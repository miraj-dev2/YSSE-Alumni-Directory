import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import { makeProfile } from './helpers/index.js';

vi.mock('../src/lib/prisma.js', () => ({
  prisma: {
    alumniProfile: {
      findMany: vi.fn()
    }
  }
}));

describe('Alumni Success Stories', () => {
  it('returns approved alumni with non-null stories', async () => {
    const profileWithStory = makeProfile({
      id: 'prof-story-1',
      name: 'Rahim Chowdhury',
      story: 'YSSE provided the springboard for launching our agritech initiative.'
    });

    (prisma.alumniProfile.findMany as any).mockResolvedValueOnce([profileWithStory]);

    const res = await request(app).get('/alumni/stories');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].story).toBe('YSSE provided the springboard for launching our agritech initiative.');
    expect(res.body.data[0].name).toBe('Rahim Chowdhury');
  });
});
