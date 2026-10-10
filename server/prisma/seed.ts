/**
 * SEED SCRIPT - DEMO DATA ONLY
 * DO NOT RUN IN PRODUCTION. Refuses to run if NODE_ENV === 'production'.
 */
import { PrismaClient, AlumniStatus, Mode } from '@prisma/client';

const prisma = new PrismaClient();

const WING_NAMES = ['IT', 'Academy', 'Charity Hub', 'Ekmutho Ahar', 'Shop'];

const FIRST_NAMES = [
  'Tanvir', 'Farhana', 'Rahim', 'Nusrat', 'Shafiq', 'Anika', 'Zubair', 'Tasnim',
  'Shakil', 'Sadia', 'Mehedi', 'Ayesha', 'Rifat', 'Fatima', 'Adnan', 'Sumaiya',
  'Fahim', 'Nabila', 'Kamrul', 'Israt', 'Mahmud', 'Samira', 'Arif', 'Tasmia'
];

const LAST_NAMES = [
  'Ahmed', 'Chowdhury', 'Hasan', 'Jahan', 'Islam', 'Rahman', 'Siddiqui', 'Karim',
  'Akter', 'Hossain', 'Kazi', 'Mahbub', 'Alam', 'Uddin', 'Khan', 'Begum'
];

const ROLES = [
  'Software Engineer', 'Product Designer', 'Data Analyst', 'Marketing Lead',
  'Operations Manager', 'Project Coordinator', 'UX Researcher', 'DevOps Specialist'
];

const ORGS = ['Pathao', 'bKash', 'ShopUp', 'Grameenphone', 'Optimizely', 'BRAC', 'YSSE Global', 'Brain Station 23'];

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('❌ Refusing to seed database in production environment!');
  }

  console.log('🌱 Starting YSSE Alumni Directory DEMO seed...');

  // 1. Seed Wings
  const wingMap: Record<string, string> = {};
  for (const name of WING_NAMES) {
    const wing = await prisma.wing.upsert({
      where: { name },
      update: {},
      create: { name }
    });
    wingMap[name] = wing.id;
  }

  // 2. Seed ~40 Demo Alumni
  const statuses: AlumniStatus[] = ['APPROVED', 'APPROVED', 'APPROVED', 'PENDING', 'REJECTED'];
  const modes: Mode[] = ['ONLINE', 'OFFLINE', 'BOTH'];

  for (let i = 1; i <= 40; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[i % LAST_NAMES.length];
    const name = `${first} ${last}`;
    const email = `alumni${i}.${first.toLowerCase()}@example.org`;
    const wingName = WING_NAMES[i % WING_NAMES.length];
    const batch = (i % 10) + 1;
    const status = statuses[i % statuses.length];
    const hasOffer = status === 'APPROVED' && i % 3 === 0;

    const profile = await prisma.alumniProfile.upsert({
      where: { email },
      update: {},
      create: {
        name,
        email,
        batch,
        wingId: wingMap[wingName],
        currentRole: ROLES[i % ROLES.length],
        organization: ORGS[i % ORGS.length],
        location: i % 4 === 0 ? 'Chattogram' : 'Dhaka, Bangladesh',
        linkedinUrl: `https://linkedin.com/in/${first.toLowerCase()}-${last.toLowerCase()}`,
        bio: `Passionate social changemaker from Batch ${batch}, actively contributing to ${wingName}.`,
        isContactPublic: i % 2 === 0,
        status,
        rejectionReason: status === 'REJECTED' ? 'Incomplete batch verification documents' : null,
        source: i % 5 === 0 ? 'CSV' : 'SELF',
        createdAt: new Date(Date.now() - (40 - i) * 86400000 * 5)
      }
    });

    if (hasOffer) {
      await prisma.sessionOffer.create({
        data: {
          alumniId: profile.id,
          topic: `Career Transition & Mentorship in ${ROLES[i % ROLES.length]}`,
          description: 'One-on-one session sharing experiences and guidance for young professionals.',
          mode: modes[i % modes.length],
          isActive: true
        }
      });
    }
  }

  console.log('✅ Demo seed completed: 5 Wings, 40 Alumni profiles seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
