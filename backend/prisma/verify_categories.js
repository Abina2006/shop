import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const products = await prisma.product.findMany({
    include: {
      listings: true
    }
  });

  console.log(`Total Products in DB: ${products.length}\n`);

  const categoryMap = {};
  products.forEach(p => {
    if (!categoryMap[p.category]) categoryMap[p.category] = [];
    categoryMap[p.category].push({
      name: p.name,
      brand: p.brand,
      listings: p.listings.length,
      lowestPrice: Math.min(...p.listings.map(l => Number(l.price)))
    });
  });

  console.log('Categories Summary:');
  Object.keys(categoryMap).forEach(cat => {
    console.log(`\n📌 CATEGORY: ${cat} (${categoryMap[cat].length} products)`);
    categoryMap[cat].forEach(prod => {
      console.log(`  - ${prod.name} | Lowest Price: ₹${prod.lowestPrice} across ${prod.listings} stores`);
    });
  });

  await prisma.$disconnect();
}

check();
