import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clean() {
  console.log('Cleaning all dummy data from PostgreSQL database...');

  try {
    await prisma.platformRecommendation.deleteMany();
    await prisma.priceHistory.deleteMany();
    await prisma.priceAlert.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.review.deleteMany();
    await prisma.productListing.deleteMany();
    await prisma.product.deleteMany();
    await prisma.sellerReliability.deleteMany();
    await prisma.scraperLog.deleteMany();

    console.log('All dummy data successfully removed from database.');
  } catch (error) {
    console.error('Error cleaning database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clean();
