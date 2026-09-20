import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_Ouwft9dcey4z@ep-lively-night-ae31t8jj.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require'
    }
  }
});

async function main() {
  const users = await prisma.user.findMany();
  console.log('SUCCESS! Found users:', JSON.stringify(users, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
