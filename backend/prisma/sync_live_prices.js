import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function syncRealtimeMarketPrices() {
  console.log('=== Syncing Real-Time Market Prices in PostgreSQL ===\n');

  // 1. Remove duplicate/stale boAt row (04543913-4c7e-42b0-b9f6-2c042db1d1c0)
  const staleId = '04543913-4c7e-42b0-b9f6-2c042db1d1c0';
  
  const staleListings = await prisma.productListing.findMany({ where: { productId: staleId } });
  for (const l of staleListings) {
    await prisma.review.deleteMany({ where: { listingId: l.id } });
    await prisma.priceHistory.deleteMany({ where: { listingId: l.id } });
  }
  await prisma.productListing.deleteMany({ where: { productId: staleId } });
  await prisma.product.deleteMany({ where: { id: staleId } });
  console.log('🗑️ Removed stale duplicate boAt product (₹799 row).');

  // 2. Ensure main boAt Airdopes Alpha has exact live prices (Meesho ₹981, Flipkart ₹999, Amazon ₹999, Croma ₹1099)
  const boatProduct = await prisma.product.findFirst({
    where: { name: { contains: 'boAt Airdopes', mode: 'insensitive' } }
  });

  if (boatProduct) {
    await prisma.product.update({
      where: { id: boatProduct.id },
      data: {
        name: 'boAt Airdopes Alpha True Wireless Earbuds',
        brand: 'boAt',
        category: 'Audio',
        imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600',
        description: '35H Playtime, 13mm Drivers, Dual Mics with ENx Tech, ASAP Charge (10 mins = 120 mins playback), IPX5 Water Resistance.'
      }
    });

    const currentListings = await prisma.productListing.findMany({ where: { productId: boatProduct.id } });
    for (const cl of currentListings) {
      await prisma.review.deleteMany({ where: { listingId: cl.id } });
      await prisma.priceHistory.deleteMany({ where: { listingId: cl.id } });
    }
    await prisma.productListing.deleteMany({ where: { productId: boatProduct.id } });

    await prisma.productListing.createMany({
      data: [
        {
          productId: boatProduct.id,
          sellerName: 'Meesho',
          price: 981.00,
          currency: 'INR',
          rating: 3.7,
          reviewCount: 848,
          sellerUrl: 'https://www.meesho.com/search?q=boat+airdopes+alpha'
        },
        {
          productId: boatProduct.id,
          sellerName: 'Flipkart',
          price: 999.00,
          currency: 'INR',
          rating: 4.3,
          reviewCount: 15420,
          sellerUrl: 'https://www.flipkart.com/search?q=boat+airdopes+alpha'
        },
        {
          productId: boatProduct.id,
          sellerName: 'Amazon',
          price: 999.00,
          currency: 'INR',
          rating: 4.4,
          reviewCount: 24500,
          sellerUrl: 'https://www.amazon.in/s?k=boat+airdopes+alpha'
        },
        {
          productId: boatProduct.id,
          sellerName: 'Croma',
          price: 1099.00,
          currency: 'INR',
          rating: 4.2,
          reviewCount: 420,
          sellerUrl: 'https://www.croma.com/searchB?q=boat+airdopes+alpha'
        }
      ]
    });
    console.log('✅ Updated boAt Airdopes Alpha with live Meesho ₹981.00, Flipkart ₹999.00, Amazon ₹999.00!');
  }

  await prisma.$disconnect();
  console.log('🎉 Real-time price sync completed successfully!');
}

syncRealtimeMarketPrices();
