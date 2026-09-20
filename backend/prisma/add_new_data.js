import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addNewData() {
  console.log('=== Adding New Products, Store Comparisons & Deals to PostgreSQL ===\n');

  // 1. Add New Product: Apple MacBook Air M3
  const macbook = await prisma.product.create({
    data: {
      name: 'Apple MacBook Air M3 (13.6-inch, 16GB RAM, 512GB SSD)',
      category: 'Laptops',
      brand: 'Apple',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600',
      description: 'Supercharged by the next-generation M3 chip, delivering striking performance and up to 18 hours of battery life.'
    }
  });

  // Add comparison store listings for MacBook
  const mac_croma = await prisma.productListing.create({
    data: {
      productId: macbook.id,
      sellerName: 'Croma',
      sellerUrl: 'https://croma.com/apple-macbook-air-m3',
      price: 119990.00,
      currency: 'INR',
      rating: 4.8,
      reviewCount: 340
    }
  });

  const mac_flipkart = await prisma.productListing.create({
    data: {
      productId: macbook.id,
      sellerName: 'Flipkart',
      sellerUrl: 'https://flipkart.com/apple-macbook-air-m3',
      price: 121990.00,
      currency: 'INR',
      rating: 4.6,
      reviewCount: 520
    }
  });

  const mac_amazon = await prisma.productListing.create({
    data: {
      productId: macbook.id,
      sellerName: 'Amazon',
      sellerUrl: 'https://amazon.in/dp/B0CX23M3AIR',
      price: 124990.00,
      currency: 'INR',
      rating: 4.7,
      reviewCount: 1120
    }
  });

  // 2. Add New Product: OnePlus 12 5G
  const oneplus = await prisma.product.create({
    data: {
      name: 'OnePlus 12 5G (Silky Black, 16GB RAM, 512GB Storage)',
      category: 'Smartphones',
      brand: 'OnePlus',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600',
      description: 'Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera System, 5400mAh Battery with 100W SUPERVOOC charging.'
    }
  });

  const op_meesho = await prisma.productListing.create({
    data: {
      productId: oneplus.id,
      sellerName: 'Meesho',
      sellerUrl: 'https://meesho.com/oneplus-12-5g/p/9912',
      price: 59999.00,
      currency: 'INR',
      rating: 4.4,
      reviewCount: 180
    }
  });

  const op_flipkart = await prisma.productListing.create({
    data: {
      productId: oneplus.id,
      sellerName: 'Flipkart',
      sellerUrl: 'https://flipkart.com/oneplus-12-5g',
      price: 62999.00,
      currency: 'INR',
      rating: 4.6,
      reviewCount: 760
    }
  });

  const op_amazon = await prisma.productListing.create({
    data: {
      productId: oneplus.id,
      sellerName: 'Amazon',
      sellerUrl: 'https://amazon.in/dp/B0CQ49OP12',
      price: 64999.00,
      currency: 'INR',
      rating: 4.7,
      reviewCount: 2450
    }
  });

  // 3. Add AI Recommendations
  await prisma.platformRecommendation.create({
    data: {
      productId: macbook.id,
      recommendedPlatform: 'Croma',
      confidenceScore: 96,
      reasons: ['Lowest market price at ₹1,19,990 (Save ₹5,000 vs Amazon)', 'Fast 24-hr authorized store delivery', 'Official Apple warranty'],
      bestPrice: 119990.00,
      bestSeller: 'Croma',
      fastestDelivery: 'Croma (1 day)',
      bestOffer: 'Croma ₹1,19,990 with HDFC Card discount',
      verdictSummary: 'Croma provides the best authentic deal for MacBook Air M3 at ₹1,19,990.'
    }
  });

  await prisma.platformRecommendation.create({
    data: {
      productId: oneplus.id,
      recommendedPlatform: 'Meesho',
      confidenceScore: 92,
      reasons: ['Unbeatable flash sale price of ₹59,999 (Save ₹5,000 vs Amazon)', 'Verified brand seller score 4.4★'],
      bestPrice: 59999.00,
      bestSeller: 'Meesho',
      fastestDelivery: 'Amazon (2 days)',
      bestOffer: 'Meesho ₹59,999 special promo',
      verdictSummary: 'Meesho offers the lowest price for OnePlus 12 5G at ₹59,999.'
    }
  });

  // 4. Add Reviews
  await prisma.review.createMany({
    data: [
      { listingId: mac_croma.id, reviewerName: 'Vikram Mehta', rating: 5, reviewText: 'M3 chip speed is blazing fast and battery lasts 2 full working days!', sentimentScore: 0.98, summarizedText: 'Incredible performance and battery life.' },
      { listingId: op_amazon.id, reviewerName: 'Kavita Rao', rating: 5, reviewText: 'Camera color tones from Hasselblad are stunning, charges from 0 to 100% in 25 mins.', sentimentScore: 0.95, summarizedText: 'Stunning camera quality and ultra-fast charging.' }
    ]
  });

  // 5. Add Price History
  await prisma.priceHistory.createMany({
    data: [
      { listingId: mac_croma.id, price: 124990.00, recordedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { listingId: mac_croma.id, price: 119990.00, recordedAt: new Date() },
      { listingId: op_meesho.id, price: 64999.00, recordedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { listingId: op_meesho.id, price: 59999.00, recordedAt: new Date() }
    ]
  });

  console.log('✅ Added MacBook Air M3 + OnePlus 12 with 6 comparison store prices, reviews & AI recommendations!');

  await prisma.$disconnect();
}

addNewData();
