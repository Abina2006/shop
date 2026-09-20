import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDummyData() {
  console.log('=== Cleaning ALL dummy/fake data from PostgreSQL ===\n');

  // 1. Delete ALL reviews (Rohan K, Sneha P etc. are all dummy repeated entries)
  const deletedReviews = await prisma.review.deleteMany();
  console.log(`✅ Deleted ${deletedReviews.count} dummy reviews.`);

  // 2. Delete ALL price history (seeded fake historical points)
  const deletedHistory = await prisma.priceHistory.deleteMany();
  console.log(`✅ Deleted ${deletedHistory.count} dummy price history entries.`);

  // 3. Delete ALL platform recommendations (AI seeded data)
  const deletedRecs = await prisma.platformRecommendation.deleteMany();
  console.log(`✅ Deleted ${deletedRecs.count} dummy platform recommendations.`);

  // 4. Keep: Products, Listings, and real Users (abina, niruu)
  const users = await prisma.user.findMany({ select: { name: true, email: true } });
  const products = await prisma.product.findMany({ select: { name: true } });
  const listings = await prisma.productListing.findMany({ select: { sellerName: true, price: true } });

  console.log('\n📊 What remains in PostgreSQL (real data only):');
  console.log(`  👤 Users: ${users.map(u => u.name).join(', ')}`);
  console.log(`  📦 Products: ${products.map(p => p.name).join(', ')}`);
  console.log(`  🏪 Seller Listings: ${listings.length} (${listings.map(l => `${l.sellerName} ₹${l.price}`).join(', ')})`);
  console.log(`  ⭐ Reviews: 0 (will be scraped when you paste a real product URL)`);
  console.log(`  📈 Price History: 0 (will track going forward on each scrape)`);

  await prisma.$disconnect();
}

cleanDummyData();
