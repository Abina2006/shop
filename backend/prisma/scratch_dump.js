import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { listings: true }
  });

  for (const p of products) {
    console.log(`\nProduct: "${p.name}" (Category: ${p.category})`);
    for (const l of p.listings) {
      console.log(`  - ${l.sellerName.padEnd(12)}: ₹${l.price} | Rating: ${l.rating} | URL: ${l.sellerUrl}`);
    }
  }
  await prisma.$disconnect();
}
main();
