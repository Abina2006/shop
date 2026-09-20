import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const prods = await prisma.product.findMany({
    select: { id: true, name: true, category: true, brand: true, imageUrl: true }
  });
  console.log(`Total Products: ${prods.length}`);
  prods.forEach((p, i) => {
    console.log(`${i + 1}. [${p.category}] ${p.name}`);
    console.log(`   Image: ${p.imageUrl}`);
  });
  await prisma.$disconnect();
}

main().catch(console.error);
