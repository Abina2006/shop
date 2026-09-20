import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const prods = await prisma.product.findMany({
    include: { listings: true }
  });
  console.log(`Found ${prods.length} products:`);
  prods.forEach((p, idx) => {
    const prices = p.listings.map(l => `${l.sellerName}: ₹${l.price}`).join(' | ');
    console.log(`${idx + 1}. [${p.category}] ${p.name} (${p.brand}) -> ${prices}`);
  });
  await prisma.$disconnect();
}

main().catch(console.error);
