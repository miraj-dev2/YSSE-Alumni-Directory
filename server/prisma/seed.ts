import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const OFFICIAL_WINGS = ['IT', 'Academy', 'Charity Hub', 'Ekmutho Ahar', 'Shop'];

async function main() {
  console.log('🌱 Ensuring official YSSE wings exist...');

  for (const name of OFFICIAL_WINGS) {
    await prisma.wing.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  console.log('✅ Official wings synced (0 mock alumni profiles).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
