import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const counts = {
    users: await prisma.user.count(),
    products: await prisma.product.count(),
    productListings: await prisma.productListing.count(),
    priceHistories: await prisma.priceHistory.count(),
    priceAlerts: await prisma.priceAlert.count(),
    wishlists: await prisma.wishlist.count(),
    reviews: await prisma.review.count(),
    sellerReliabilities: await prisma.sellerReliability.count(),
    platformRecommendations: await prisma.platformRecommendation.count(),
    scraperLogs: await prisma.scraperLog.count()
  };

  console.log('📊 ALL 10 PRISMA MODELS RECORD COUNTS:');
  console.table(counts);

  // Check sample product pricing
  const products = await prisma.product.findMany({
    take: 5,
    include: {
      listings: true,
      platformRecommendations: true,
    }
  });

  console.log('\n🔍 SAMPLE PRODUCTS WITH STORE LISTING PRICES:');
  for (const p of products) {
    console.log(`\nProduct: "${p.name}" (${p.category})`);
    console.log(`Listings: ${p.listings.map(l => `${l.sellerName}: ₹${l.price}`).join(' | ')}`);
    if (p.platformRecommendations.length > 0) {
      console.log(`Recommendation: Buy on ${p.platformRecommendations[0].recommendedPlatform} @ ₹${p.platformRecommendations[0].bestPrice}`);
    }
  }

  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
