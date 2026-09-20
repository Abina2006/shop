import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function auditCatalog() {
  console.log('=== COMPLETE CATALOG AUDIT ===\n');

  const products = await prisma.product.findMany({
    include: { listings: true }
  });

  products.forEach((p, index) => {
    console.log(`[Item ${index + 1}] ID: ${p.id}`);
    console.log(`  Title: ${p.name}`);
    console.log(`  Category: ${p.category} | Brand: ${p.brand}`);
    console.log(`  Image URL: ${p.imageUrl}`);
    console.log(`  Stores (${p.listings.length}):`);
    p.listings.forEach(l => {
      console.log(`    - ${l.sellerName}: ₹${l.price}`);
    });
    console.log('---------------------------------------------------------');
  });

  await prisma.$disconnect();
}

auditCatalog().catch(console.error);
