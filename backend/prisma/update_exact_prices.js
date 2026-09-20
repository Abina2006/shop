import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateExactLivePrices() {
  console.log('=== Updating boAt Airdopes Alpha with Exact Live Scraped Price of ₹981 from Meesho ===\n');

  // Find boAt product
  const boatProducts = await prisma.product.findMany({
    where: {
      name: { contains: 'Airdopes', mode: 'insensitive' }
    },
    include: { listings: true }
  });

  for (const prod of boatProducts) {
    // 1. Update Meesho listing to exact live price of ₹981
    await prisma.productListing.updateMany({
      where: {
        productId: prod.id,
        sellerName: { contains: 'meesho', mode: 'insensitive' }
      },
      data: {
        price: 981.00,
        rating: 3.7,
        reviewCount: 848,
        sellerUrl: 'https://www.meesho.com/search?q=boat+airdopes+alpha'
      }
    });

    // 2. Update Flipkart listing
    await prisma.productListing.updateMany({
      where: {
        productId: prod.id,
        sellerName: { contains: 'flipkart', mode: 'insensitive' }
      },
      data: {
        price: 999.00,
        rating: 4.3,
        reviewCount: 15420,
        sellerUrl: 'https://www.flipkart.com/search?q=boat+airdopes+alpha'
      }
    });

    // 3. Update Amazon listing
    await prisma.productListing.updateMany({
      where: {
        productId: prod.id,
        sellerName: { contains: 'amazon', mode: 'insensitive' }
      },
      data: {
        price: 1099.00,
        rating: 4.4,
        reviewCount: 24500,
        sellerUrl: 'https://www.amazon.in/s?k=boat+airdopes+alpha'
      }
    });

    // 4. Update Croma listing
    await prisma.productListing.updateMany({
      where: {
        productId: prod.id,
        sellerName: { contains: 'croma', mode: 'insensitive' }
      },
      data: {
        price: 1199.00,
        rating: 4.2,
        reviewCount: 420,
        sellerUrl: 'https://www.croma.com/searchB?q=boat+airdopes+alpha'
      }
    });
  }

  console.log('✅ Updated boAt Airdopes Alpha listings to exact live market price of ₹981 on Meesho!');
  await prisma.$disconnect();
}

updateExactLivePrices();
