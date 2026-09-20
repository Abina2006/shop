import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedHistory() {
  const listings = await prisma.productListing.findMany();

  for (const listing of listings) {
    const price = Number(listing.price);
    // Add past historical price data points
    await prisma.priceHistory.createMany({
      data: [
        { listingId: listing.id, price: price + 200, recordedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
        { listingId: listing.id, price: price + 100, recordedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        { listingId: listing.id, price: price, recordedAt: new Date() }
      ]
    });
  }

  console.log('Price history points populated in PostgreSQL!');
  await prisma.$disconnect();
}

seedHistory();
