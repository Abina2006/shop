import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPersistence() {
  const productCount = await prisma.product.count();
  const listingCount = await prisma.productListing.count();
  const historyCount = await prisma.priceHistory.count();
  const reviewCount = await prisma.review.count();
  const userCount = await prisma.user.count();
  const logCount = await prisma.scraperLog.count();

  console.log('=== POSTGRESQL DATABASE PERSISTENCE STATUS ===');
  console.log(`📦 Total Products: ${productCount}`);
  console.log(`🏪 Total Seller Listings: ${listingCount}`);
  console.log(`📈 Price History Data Points: ${historyCount}`);
  console.log(`⭐ Total Scraped Reviews: ${reviewCount}`);
  console.log(`👤 Registered Users: ${userCount}`);
  console.log(`📋 Scraper Execution Logs: ${logCount}`);

  await prisma.$disconnect();
}

checkPersistence();
