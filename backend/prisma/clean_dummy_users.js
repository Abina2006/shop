import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDummyUsers() {
  console.log('=== Cleaning dummy seed users from PostgreSQL ===\n');

  // Delete only the dummy seed users, keep real registered users
  const dummyEmails = ['john@example.com', 'admin@shopwise.ai'];

  const deleted = await prisma.user.deleteMany({
    where: {
      email: { in: dummyEmails }
    }
  });

  console.log(`✅ Deleted ${deleted.count} dummy seed users.`);

  // Show remaining real users
  const realUsers = await prisma.user.findMany();
  console.log(`\n👤 Real registered users remaining (${realUsers.length}):`);
  realUsers.forEach((u, i) => {
    console.log(`  [${i + 1}] ${u.name} | ${u.email} | Role: ${u.role} | Joined: ${u.createdAt.toISOString()}`);
  });

  await prisma.$disconnect();
}

cleanDummyUsers();
