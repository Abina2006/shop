import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAllStoresAndData() {
  console.log('=== Populating Store Reliability and Product Comparisons in PostgreSQL ===\n');

  // 1. Seller Reliability Table
  const sellers = [
    { sellerName: 'Amazon', reliabilityScore: 4.8, totalReviews: 3200, avgDeliveryDays: 2.0, returnPolicyScore: 4.9 },
    { sellerName: 'Flipkart', reliabilityScore: 4.5, totalReviews: 2800, avgDeliveryDays: 2.5, returnPolicyScore: 4.3 },
    { sellerName: 'Meesho', reliabilityScore: 4.2, totalReviews: 1500, avgDeliveryDays: 3.5, returnPolicyScore: 4.0 },
    { sellerName: 'Nike', reliabilityScore: 4.9, totalReviews: 950, avgDeliveryDays: 2.0, returnPolicyScore: 4.8 },
    { sellerName: 'Croma', reliabilityScore: 4.6, totalReviews: 1200, avgDeliveryDays: 1.5, returnPolicyScore: 4.5 }
  ];

  for (const s of sellers) {
    await prisma.sellerReliability.upsert({
      where: { sellerName: s.sellerName },
      update: s,
      create: s
    });
  }
  console.log('✅ Updated 5 Stores in seller_reliability table.');

  // 2. Export updated database
  const userCount = await prisma.user.count();
  const productCount = await prisma.product.count();
  const listingCount = await prisma.productListing.count();
  const sellerCount = await prisma.sellerReliability.count();

  console.log(`\n📊 Live Database Status:`);
  console.log(`   - Users: ${userCount}`);
  console.log(`   - Products: ${productCount}`);
  console.log(`   - Store Listings / Price Comparisons: ${listingCount}`);
  console.log(`   - Store Reliability Data: ${sellerCount}`);

  await prisma.$disconnect();
}

seedAllStoresAndData();
