import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/password.js';

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

  // Ensure default administrator account exists
  const adminEmail = 'admin@ysseglobal.org';
  const adminPasswordHash = hashPassword('Admin@ysse2026!');

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
      passwordHash: adminPasswordHash
    },
    create: {
      email: adminEmail,
      name: 'YSSE Administrator',
      role: 'ADMIN',
      passwordHash: adminPasswordHash
    }
  });

  console.log('✅ Official wings & Administrator account synced.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
