import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/password.js';
import { DUMMY_ALUMNI } from './dummyData.js';

const prisma = new PrismaClient();

const OFFICIAL_WINGS = [
  'Admin & HR Department',
  'Marketing & PR Department',
  'Communication Department',
  'Content Writing Department',
  'Graphic Design Department',
  'Video Editing Department',
  'Operations Management Department',
  'Business Development Department',
  'IT Department',
  'IT: Wing 1 — Web Development & CMS',
  'IT: Wing 2 — Software & App Engineering',
  'IT: Wing 3 — Systems Automation & DataOps',
  'IT: Wing 4 — AI Integration & Cybersecurity',
  'IT: Wing 5 — Tech Research & Innovation'
];

async function main() {
  console.log('🌱 Seeding official YSSE wings...');
  for (const name of OFFICIAL_WINGS) {
    await prisma.wing.upsert({ where: { name }, update: {}, create: { name } });
  }

  console.log('🌱 Seeding administrator & member accounts...');
  const adminEmail = 'admin@ysseglobal.org';
  const adminPasswordHash = await hashPassword('Admin@ysse2026!');
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN', passwordHash: adminPasswordHash },
    create: { email: adminEmail, name: 'YSSE Administrator', role: 'ADMIN', passwordHash: adminPasswordHash }
  });

  const memberEmail = 'member@ysseglobal.org';
  const memberPasswordHash = await hashPassword('Member@ysse2026!');
  await prisma.user.upsert({
    where: { email: memberEmail },
    update: { role: 'MEMBER', passwordHash: memberPasswordHash },
    create: { email: memberEmail, name: 'Demo YSSE Member', role: 'MEMBER', passwordHash: memberPasswordHash }
  });

  console.log('🌱 Seeding dummy alumni & session offers...');
  const wings = await prisma.wing.findMany();
  const defaultWingId = wings[0]?.id;
  const alumniPassword = await hashPassword('Alumni@ysse2026!');

  for (const d of DUMMY_ALUMNI) {
    const wingId = wings.find((w) => w.name === d.wingName)?.id || defaultWingId;

    const user = await prisma.user.upsert({
      where: { email: d.email },
      update: { name: d.name, avatarUrl: d.photoUrl },
      create: { email: d.email, name: d.name, avatarUrl: d.photoUrl, role: 'MEMBER', passwordHash: alumniPassword }
    });

    const profile = await prisma.alumniProfile.upsert({
      where: { email: d.email },
      update: {
        userId: user.id, name: d.name, batch: d.batch, wingId, currentRole: d.role,
        organization: d.org, location: d.location, bio: d.bio, story: d.story || null,
        linkedinUrl: d.linkedinUrl, photoUrl: d.photoUrl, status: d.status,
        isContactPublic: d.isContactPublic, source: 'CSV'
      },
      create: {
        userId: user.id, email: d.email, name: d.name, batch: d.batch, wingId, currentRole: d.role,
        organization: d.org, location: d.location, bio: d.bio, story: d.story || null,
        linkedinUrl: d.linkedinUrl, photoUrl: d.photoUrl, status: d.status,
        isContactPublic: d.isContactPublic, source: 'CSV'
      }
    });

    if (d.offerTopic && d.status === 'APPROVED') {
      const existingOffer = await prisma.sessionOffer.findFirst({ where: { alumniId: profile.id } });
      if (!existingOffer) {
        await prisma.sessionOffer.create({
          data: {
            alumniId: profile.id, topic: d.offerTopic,
            description: `1:1 mentoring session with ${d.name} covering practical industry guidance and questions.`,
            mode: d.offerMode || 'ONLINE', isActive: true
          }
        });
      }
    }
  }

  console.log(`✅ Seeded ${DUMMY_ALUMNI.length} alumni profiles and test users.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
