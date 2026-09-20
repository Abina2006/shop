import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkFlatPrices() {
  const products = await prisma.product.findMany({
    include: { listings: true }
  });

  let flatCount = 0;
  for (const p of products) {
    const prices = p.listings.map(l => Number(l.price));
    const allSame = prices.length > 1 && prices.every(v => v === prices[0]);
    if (allSame) {
      flatCount++;
      console.log(`FLAT PRICE FOUND: "${p.name}" -> all stores priced at ₹${prices[0]}`);
    }
  }
  console.log(`Total products with identical prices across all sellers: ${flatCount}`);
  await prisma.$disconnect();
}
checkFlatPrices();
