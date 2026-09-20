import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedUsers() {
  console.log('🌱 Seeding user accounts in PostgreSQL database...');

  const usersToSeed = [
    {
      name: 'Vaishnavi',
      email: 'vaish@gmail.com',
      password: 'vaish', // also accepts vaish123
      role: 'USER',
    },
    {
      name: 'Abina',
      email: 'abinaa059@gmail.com',
      password: 'Abina@2006',
      role: 'ADMIN',
    },
    {
      name: 'ShopWise Admin',
      email: 'admin@shopwise.ai',
      password: 'Admin@123',
      role: 'ADMIN',
    },
  ];

  for (const u of usersToSeed) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(u.password, salt);

    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        passwordHash,
        role: u.role,
      },
      create: {
        name: u.name,
        email: u.email,
        passwordHash,
        role: u.role,
      },
    });

    console.log(`✅ User seeded/updated: ${user.name} (${user.email}) - Role: ${user.role}`);
  }

  console.log('🎉 User seeding complete!');
}

seedUsers()
  .catch((err) => {
    console.error('❌ User seeding failed:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
