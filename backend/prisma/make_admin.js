import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin() {
  console.log('Promoting users to ADMIN role in PostgreSQL...');

  const updated = await prisma.user.updateMany({
    data: { role: 'ADMIN' }
  });

  console.log(`Successfully updated ${updated.count} users to ADMIN role in PostgreSQL!`);

  const users = await prisma.user.findMany({ select: { name: true, email: true, role: true } });
  console.log('Current DB Users:', users);

  await prisma.$disconnect();
}

makeAdmin();
