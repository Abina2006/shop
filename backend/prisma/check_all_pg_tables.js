import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function inspectAllPgTables() {
  console.log('🔍 INSPECTING ALL POSTGRESQL TABLES & DATA STORED IN SHOPWISEAI...\n');

  try {
    const usersCount = await prisma.user.count();
    const productsCount = await prisma.product.count();
    const listingsCount = await prisma.productListing.count();
    const historyCount = await prisma.priceHistory.count();
    const wishlistCount = await prisma.wishlist.count();
    const alertsCount = await prisma.priceAlert.count();
    const reviewsCount = await prisma.review.count();
    const sellerRelCount = await prisma.sellerReliability.count();
    const recommendationsCount = await prisma.platformRecommendation.count();
    const logsCount = await prisma.scraperLog.count();

    console.log('====================================================');
    console.log('📊 POSTGRESQL DATABASE RECORD COUNTS (shopwiseAI):');
    console.log('====================================================');
    console.log(` 1. users:                    ${usersCount} records`);
    console.log(` 2. products:                 ${productsCount} records`);
    console.log(` 3. product_listings:         ${listingsCount} records`);
    console.log(` 4. price_history:            ${historyCount} records`);
    console.log(` 5. wishlists:                ${wishlistCount} records`);
    console.log(` 6. price_alerts:             ${alertsCount} records`);
    console.log(` 7. reviews:                  ${reviewsCount} records`);
    console.log(` 8. seller_reliability:       ${sellerRelCount} records`);
    console.log(` 9. platform_recommendations: ${recommendationsCount} records`);
    console.log(`10. scraper_logs:             ${logsCount} records`);
    console.log('====================================================');

    const totalRecords = usersCount + productsCount + listingsCount + historyCount +
                         wishlistCount + alertsCount + reviewsCount + sellerRelCount +
                         recommendationsCount + logsCount;

    console.log(`✨ TOTAL RECORDS STORED IN POSTGRESQL: ${totalRecords}`);
  } catch (error) {
    console.error('❌ Error inspecting PostgreSQL database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

inspectAllPgTables();
