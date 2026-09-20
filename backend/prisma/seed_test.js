import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  console.log('Testing DB connection and quick seed...');
  try {
    const count = await prisma.product.count();
    console.log('Current product count in DB:', count);
  } catch (err) {
    console.error('Error counting products:', err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
