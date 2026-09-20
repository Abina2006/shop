import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAbinaUser() {
  console.log('🌱 Seeding user abinaa059@gmail.com into database...');

  const email = 'abinaa059@gmail.com';
  const rawPassword = 'Abina@2006';
  const name = 'Abina';

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(rawPassword, salt);

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    console.log('Updating password for existing user abinaa059@gmail.com...');
    await prisma.user.update({
      where: { email },
      data: {
        passwordHash,
        role: 'ADMIN'
      }
    });
  } else {
    console.log('Creating user abinaa059@gmail.com...');
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'ADMIN'
      }
    });
  }

  console.log('✅ User abinaa059@gmail.com seeded successfully with ADMIN role!');
  const allUsers = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true }
  });
  console.log('Current DB Users:', allUsers);
  
  await prisma.$disconnect();
}

seedAbinaUser().catch((err) => {
  console.error('Failed to seed user:', err);
  prisma.$disconnect();
  process.exit(1);
});
