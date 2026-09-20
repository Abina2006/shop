const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixRemaining() {
  // Step 1: Delete ALL remaining "Access Denied" type entries by any name variation
  const accessDenied = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'Access', mode: 'insensitive' } },
        { name: { contains: 'Denied', mode: 'insensitive' } },
        { name: { contains: 'forbidden', mode: 'insensitive' } },
        { name: { contains: 'blocked', mode: 'insensitive' } },
        { name: { equals: '', mode: 'insensitive' } },
      ]
    }
  });
  console.log('Suspicious products:', accessDenied.map(p => p.name));

  if (accessDenied.length > 0) {
    const ids = accessDenied.map(p => p.id);
    await prisma.product.deleteMany({ where: { id: { in: ids } } });
    console.log(`Deleted ${accessDenied.length} suspicious products.`);
  }

  // Step 2: Fix category for products — use correct standard categories
  // Mobile phones
  await prisma.product.updateMany({
    where: { category: { in: ['Smartphones', 'Phone', 'Mobiles'] } },
    data: { category: 'Mobile' }
  });

  // Laptop/Computers
  await prisma.product.updateMany({
    where: { category: { in: ['Computers', 'Computer', 'Laptops'] } },
    data: { category: 'Laptop' }
  });

  // Grocery
  await prisma.product.updateMany({
    where: { category: { in: ['General', 'general'] }, name: { contains: 'oil', mode: 'insensitive' } },
    data: { category: 'Grocery' }
  });

  // Step 3: Remove duplicate Hoppup products — keep only 1 (the one with Meesho listing)
  const hoppups = await prisma.product.findMany({
    where: { name: { contains: 'Hoppup', mode: 'insensitive' } },
    include: { listings: true },
    orderBy: { createdAt: 'asc' }
  });
  
  console.log(`Found ${hoppups.length} Hoppup products`);
  if (hoppups.length > 1) {
    // Keep the one that has listings, delete the rest
    const withListings = hoppups.filter(h => h.listings.length > 0);
    const toKeep = withListings.length > 0 ? withListings[0] : hoppups[0];
    const toDelete = hoppups.filter(h => h.id !== toKeep.id).map(h => h.id);
    if (toDelete.length > 0) {
      await prisma.product.deleteMany({ where: { id: { in: toDelete } } });
      console.log(`Deleted ${toDelete.length} duplicate Hoppup products, kept: ${toKeep.name}`);
    }
  }

  // Step 4: Remove duplicate boAt/Boat products
  const boats = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'Airdopes', mode: 'insensitive' } },
        { name: { contains: 'boAt', mode: 'insensitive' } },
        { name: { startsWith: 'Boat ', mode: 'insensitive' } },
      ]
    },
    include: { listings: true },
    orderBy: { createdAt: 'asc' }
  });

  console.log(`Found ${boats.length} boAt products`);
  if (boats.length > 1) {
    const withListings = boats.filter(b => b.listings.length > 0);
    const toKeep = withListings.length > 0 ? withListings[0] : boats[0];
    const toDelete = boats.filter(b => b.id !== toKeep.id).map(b => b.id);
    if (toDelete.length > 0) {
      await prisma.product.deleteMany({ where: { id: { in: toDelete } } });
      console.log(`Deleted ${toDelete.length} duplicate boAt products, kept: ${toKeep.name}`);
    }
  }

  // Step 5: Final state
  const final = await prisma.product.findMany({
    select: { id: true, name: true, category: true, imageUrl: true },
    orderBy: { category: 'asc' }
  });
  console.log('\n=== FINAL CLEAN PRODUCTS ===');
  final.forEach(p => console.log(`[${p.category}] ${p.name} | img: ${p.imageUrl ? '✓' : '✗'}`));
  
  await prisma.$disconnect();
}

fixRemaining().catch(e => { console.error(e); process.exit(1); });
