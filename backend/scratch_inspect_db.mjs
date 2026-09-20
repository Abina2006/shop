import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function inspectData() {
  const products = await prisma.product.findMany({
    include: {
      listings: true
    },
    take: 10
  });
  console.log(`Total Products in DB: ${products.length}`);
  products.forEach((p, idx) => {
    console.log(`\n--- Product #${idx+1} ---`);
    console.log(`ID: ${p.id}`);
    console.log(`Name: ${p.name}`);
    console.log(`Brand: ${p.brand}, Category: ${p.category}`);
    console.log(`Image URL: ${p.imageUrl}`);
    console.log(`Listings (${p.listings.length}):`);
    p.listings.forEach(l => {
      console.log(`  - Seller: ${l.sellerName}, Price: ₹${l.price}, Currency: ${l.currency}, Rating: ${l.rating}`);
    });
  });
}

inspectData().catch(console.error).finally(() => prisma.$disconnect());
