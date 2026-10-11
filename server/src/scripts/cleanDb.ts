import { prisma } from '../lib/prisma.js';

async function cleanDatabase() {
  console.log('--- Database Cleanup Started ---');

  // Delete dependent child records first to respect foreign keys
  const deletedRequests = await prisma.sessionRequest.deleteMany({});
  console.log(`Deleted SessionRequests: ${deletedRequests.count}`);

  const deletedOffers = await prisma.sessionOffer.deleteMany({});
  console.log(`Deleted SessionOffers: ${deletedOffers.count}`);

  const deletedTalks = await prisma.alumniTalk.deleteMany({});
  console.log(`Deleted AlumniTalks: ${deletedTalks.count}`);

  const deletedAudits = await prisma.auditLog.deleteMany({});
  console.log(`Deleted AuditLogs: ${deletedAudits.count}`);

  const deletedProfiles = await prisma.alumniProfile.deleteMany({});
  console.log(`Deleted AlumniProfiles: ${deletedProfiles.count}`);

  // Delete all users
  const deletedUsers = await prisma.user.deleteMany({});
  console.log(`Deleted Users: ${deletedUsers.count}`);

  console.log('--- Ensuring Official Wings Exist ---');
  const OFFICIAL_WINGS = [
    'Tech & Innovation',
    'Social Impact & Entrepreneurship',
    'Marketing & Global Outreach',
    'Research & Policy',
    'Operations & Secretariat',
    'Academy',
    'Charity Hub'
  ];

  for (const name of OFFICIAL_WINGS) {
    await prisma.wing.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  console.log('--- Cleanup Finished: Database completely purged of all users and mock data ---');
}

cleanDatabase()
  .catch((err) => {
    console.error('Error cleaning database:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
