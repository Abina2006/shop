import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updateBoatPrices() {
  console.log('=== Updating boAt Airdopes Alpha prices: Meesho = ₹981, Flipkart = ₹1199, Amazon = ₹1199, Croma = ₹1299 ===\n');

  const products = await prisma.product.findMany({
    where: { name: { contains: 'Airdopes', mode: 'insensitive' } }
  });

  for (const p of products) {
    // Meesho -> 981
    await prisma.productListing.updateMany({
      where: { productId: p.id, sellerName: { contains: 'meesho', mode: 'insensitive' } },
      data: { price: 981.00 }
    });

    // Flipkart -> 1199
    await prisma.productListing.updateMany({
      where: { productId: p.id, sellerName: { contains: 'flipkart', mode: 'insensitive' } },
      data: { price: 1199.00 }
    });

    // Amazon -> 1199
    await prisma.productListing.updateMany({
      where: { productId: p.id, sellerName: { contains: 'amazon', mode: 'insensitive' } },
      data: { price: 1199.00 }
    });

    // Croma -> 1299
    await prisma.productListing.updateMany({
      where: { productId: p.id, sellerName: { contains: 'croma', mode: 'insensitive' } },
      data: { price: 1299.00 }
    });

    const listings = await prisma.productListing.findMany({ where: { productId: p.id } });
    for (const l of listings) {
      await prisma.priceHistory.create({
        data: { listingId: l.id, price: l.price, recordedAt: new Date() }
      }).catch(() => {});
    }
  }

  console.log('✅ Updated boAt Airdopes Alpha listings successfully in PostgreSQL!');
  await prisma.$disconnect();
}

updateBoatPrices().catch(console.error);
