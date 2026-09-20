import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Curated Platform Data Registry for Amazon, Flipkart, Meesho, Croma, and Myntra
 */
const PLATFORM_OFFERS = {
  Amazon: {
    deliveryTime: '1-2 Days (Prime Express)',
    offers: '5% Cashback on Amazon Pay ICICI Card + No Cost EMI up to 12 months'
  },
  Flipkart: {
    deliveryTime: '2-3 Days (Flipkart Assured)',
    offers: '10% Instant Discount on Axis Bank & SBI Credit Cards'
  },
  Meesho: {
    deliveryTime: '3-5 Days (Free Doorstep Dispatch)',
    offers: 'Flat ₹50 Off on First Order + Lowest Direct Seller Pricing'
  },
  Croma: {
    deliveryTime: 'Same-Day Store Pickup or 2 Days Express',
    offers: 'Flat ₹1,500 Instant Discount on HDFC & ICICI Credit Cards'
  },
  Myntra: {
    deliveryTime: '2-3 Days (Speed Delivery)',
    offers: 'Extra 15% Off with Coupon MYNTRA15 + 14-Day Free Returns'
  },
  Blinkit: {
    deliveryTime: '10-15 Minutes Instant Delivery',
    offers: 'Free Delivery on Orders above ₹199'
  },
  BigBasket: {
    deliveryTime: 'Same-Day Slotted Delivery',
    offers: 'Up to ₹200 Cashback with BB Star Membership'
  }
};

async function updateCuratedDataset() {
  console.log('=== Updating Curated Dataset (Delivery Time & Offers) in PostgreSQL ===\n');

  const listings = await prisma.productListing.findMany();
  console.log(`Updating ${listings.length} product listings...`);

  let updatedCount = 0;
  for (const listing of listings) {
    const meta = PLATFORM_OFFERS[listing.sellerName] || {
      deliveryTime: '2-4 Business Days',
      offers: 'Standard Online Payment Discount'
    };

    await prisma.productListing.update({
      where: { id: listing.id },
      data: {
        deliveryTime: meta.deliveryTime,
        offers: meta.offers
      }
    });
    updatedCount++;
  }

  console.log(`✅ Successfully enriched ${updatedCount} listings with curated delivery times and store offers!`);
  await prisma.$disconnect();
}

updateCuratedDataset().catch(err => {
  console.error('Error updating curated dataset:', err);
  process.exit(1);
});
