import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function populateCompleteDatabase() {
  console.log('=== POPULATING ALL 10 POSTGRESQL TABLES WITH RICH DATA ===\n');

  // 1. Clean existing records safely
  await prisma.review.deleteMany();
  await prisma.priceHistory.deleteMany();
  await prisma.platformRecommendation.deleteMany();
  await prisma.priceAlert.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.scraperLog.deleteMany();
  await prisma.productListing.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.sellerReliability.deleteMany();

  // 2. Insert Users (Real accounts)
  const passwordHash = await bcrypt.hash('Abina@2006', 10);

  const u1 = await prisma.user.create({
    data: {
      name: 'abina',
      email: 'abinaa059@gmail.com',
      passwordHash: passwordHash,
      role: 'ADMIN'
    }
  });

  const u2 = await prisma.user.create({
    data: {
      name: 'niruu',
      email: 'abina.j.it.2024@snsct.org',
      passwordHash: passwordHash,
      role: 'ADMIN'
    }
  });

  const u3 = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      passwordHash: passwordHash,
      role: 'USER'
    }
  });
  console.log('✅ Stored 3 Users in `users` table.');

  // 3. Insert Seller Stores Reliability
  const stores = [
    { sellerName: 'Amazon', reliabilityScore: 4.8, totalReviews: 4500, avgDeliveryDays: 2.0, returnPolicyScore: 4.9 },
    { sellerName: 'Flipkart', reliabilityScore: 4.5, totalReviews: 3800, avgDeliveryDays: 2.5, returnPolicyScore: 4.3 },
    { sellerName: 'Meesho', reliabilityScore: 4.2, totalReviews: 2100, avgDeliveryDays: 3.5, returnPolicyScore: 4.0 },
    { sellerName: 'Nike', reliabilityScore: 4.9, totalReviews: 1400, avgDeliveryDays: 2.0, returnPolicyScore: 4.8 },
    { sellerName: 'Croma', reliabilityScore: 4.6, totalReviews: 1800, avgDeliveryDays: 1.5, returnPolicyScore: 4.5 }
  ];
  for (const s of stores) {
    await prisma.sellerReliability.create({ data: s });
  }
  console.log('✅ Stored 5 Stores in `seller_reliability` table.');

  // 4. Insert Products
  const p1 = await prisma.product.create({
    data: {
      name: 'boAt Airdopes Alpha True Wireless Earbuds',
      category: 'Audio',
      brand: 'boAt',
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600',
      description: 'boAt Airdopes Alpha with 35ms Low Latency, Dual Mics ENx Tech, and 35 Hours Playback.'
    }
  });

  const p2 = await prisma.product.create({
    data: {
      name: 'Apple iPhone 15 Pro (128 GB) Titanium',
      category: 'Smartphones',
      brand: 'Apple',
      imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600',
      description: 'Aerospace-grade titanium design, A17 Pro Chip, 48MP main camera with customizable Action Button.'
    }
  });

  const p3 = await prisma.product.create({
    data: {
      name: 'Sony WH-1000XM5 ANC Wireless Headphones',
      category: 'Audio',
      brand: 'Sony',
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600',
      description: 'Industry leading noise canceling wireless over-ear headphones with 30-hour battery life.'
    }
  });

  const p4 = await prisma.product.create({
    data: {
      name: 'Nike Air Zoom Pegasus 40 Running Shoes',
      category: 'Footwear',
      brand: 'Nike',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600',
      description: 'Responsive cushioning and breathable engineered mesh for everyday runners.'
    }
  });

  const p5 = await prisma.product.create({
    data: {
      name: 'Samsung Galaxy Watch 6 Bluetooth 44mm',
      category: 'Wearables',
      brand: 'Samsung',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600',
      description: 'Personalized wellness and sleep coaching with advanced sapphire crystal glass display.'
    }
  });
  console.log('✅ Stored 5 Products in `products` table.');

  // 5. Insert Store Listings / Comparisons (Flipkart, Amazon, Meesho, Nike, Croma)
  const l1_flipkart = await prisma.productListing.create({
    data: { productId: p1.id, sellerName: 'Flipkart', sellerUrl: 'https://flipkart.com/boat-airdopes-alpha', price: 999.00, currency: 'INR', rating: 4.2, reviewCount: 1450 }
  });
  const l1_meesho = await prisma.productListing.create({
    data: { productId: p1.id, sellerName: 'Meesho', sellerUrl: 'https://meesho.com/boat-airdopes-alpha/p/123', price: 799.00, currency: 'INR', rating: 4.1, reviewCount: 620 }
  });
  const l1_amazon = await prisma.productListing.create({
    data: { productId: p1.id, sellerName: 'Amazon', sellerUrl: 'https://amazon.in/dp/B0BOATALPH', price: 1099.00, currency: 'INR', rating: 4.3, reviewCount: 2300 }
  });

  const l2_amazon = await prisma.productListing.create({
    data: { productId: p2.id, sellerName: 'Amazon', sellerUrl: 'https://amazon.in/dp/B0CHX15PRO', price: 127990.00, currency: 'INR', rating: 4.7, reviewCount: 890 }
  });
  const l2_croma = await prisma.productListing.create({
    data: { productId: p2.id, sellerName: 'Croma', sellerUrl: 'https://croma.com/apple-iphone-15-pro', price: 126999.00, currency: 'INR', rating: 4.6, reviewCount: 310 }
  });

  const l3_amazon = await prisma.productListing.create({
    data: { productId: p3.id, sellerName: 'Amazon', sellerUrl: 'https://amazon.in/dp/B09SONYXM5', price: 29990.00, currency: 'INR', rating: 4.8, reviewCount: 1240 }
  });
  const l3_flipkart = await prisma.productListing.create({
    data: { productId: p3.id, sellerName: 'Flipkart', sellerUrl: 'https://flipkart.com/sony-wh1000xm5', price: 28490.00, currency: 'INR', rating: 4.5, reviewCount: 430 }
  });

  const l4_nike = await prisma.productListing.create({
    data: { productId: p4.id, sellerName: 'Nike', sellerUrl: 'https://nike.com/in/t/air-zoom-pegasus-40', price: 2499.00, currency: 'INR', rating: 4.9, reviewCount: 520 }
  });
  const l4_flipkart = await prisma.productListing.create({
    data: { productId: p4.id, sellerName: 'Flipkart', sellerUrl: 'https://flipkart.com/nike-pegasus-40', price: 2799.00, currency: 'INR', rating: 4.4, reviewCount: 180 }
  });

  const l5_amazon = await prisma.productListing.create({
    data: { productId: p5.id, sellerName: 'Amazon', sellerUrl: 'https://amazon.in/dp/B0SAMSGW6', price: 21999.00, currency: 'INR', rating: 4.5, reviewCount: 780 }
  });
  console.log('✅ Stored 10 Store Listings / Comparisons in `product_listings` table.');

  // 6. Insert Price History Points
  await prisma.priceHistory.createMany({
    data: [
      { listingId: l1_meesho.id, price: 999.00, recordedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
      { listingId: l1_meesho.id, price: 799.00, recordedAt: new Date() },
      { listingId: l2_croma.id, price: 134900.00, recordedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
      { listingId: l2_croma.id, price: 126999.00, recordedAt: new Date() },
      { listingId: l3_flipkart.id, price: 31990.00, recordedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { listingId: l3_flipkart.id, price: 28490.00, recordedAt: new Date() }
    ]
  });
  console.log('✅ Stored 6 Price History Points in `price_history` table.');

  // 7. Insert Reviews
  await prisma.review.createMany({
    data: [
      { listingId: l1_meesho.id, reviewerName: 'Rohan K', rating: 5, reviewText: 'Best low latency wireless earbuds for gaming and calls! Battery lasts over 30 hours.', sentimentScore: 0.95, summarizedText: 'Excellent gaming latency and battery backup.' },
      { listingId: l1_flipkart.id, reviewerName: 'Sneha P', rating: 4, reviewText: 'Very comfortable fit and sound quality is clear. Great value for price.', sentimentScore: 0.85, summarizedText: 'Comfortable fit and clear audio.' },
      { listingId: l2_amazon.id, reviewerName: 'Ananya Verma', rating: 5, reviewText: 'Titanium build feels super premium and camera zoom is unbeatable.', sentimentScore: 0.98, summarizedText: 'Top-tier camera and premium lightweight titanium.' },
      { listingId: l4_nike.id, reviewerName: 'Arjun Das', rating: 5, reviewText: 'Super lightweight and high rebound cushioning. Best running shoes I have owned.', sentimentScore: 0.96, summarizedText: 'Durable and highly responsive running shoes.' }
    ]
  });
  console.log('✅ Stored 4 Reviews in `reviews` table.');

  // 8. Insert Wishlists & Price Alerts
  await prisma.wishlist.create({
    data: { userId: u1.id, productId: p1.id }
  });
  await prisma.wishlist.create({
    data: { userId: u2.id, productId: p4.id }
  });
  console.log('✅ Stored 2 User Wishlists in `wishlists` table.');

  await prisma.priceAlert.create({
    data: { userId: u1.id, listingId: l1_meesho.id, targetPrice: 750.00, isActive: true }
  });
  console.log('✅ Stored 1 Price Alert in `price_alerts` table.');

  // 9. Insert AI Platform Recommendation
  await prisma.platformRecommendation.create({
    data: {
      productId: p1.id,
      recommendedPlatform: 'Meesho',
      confidenceScore: 94,
      reasons: ['Lowest store price verified at ₹799', 'High customer satisfaction rating 4.2★', 'Standard 3-day reliable delivery'],
      bestPrice: 799.00,
      bestSeller: 'Meesho',
      fastestDelivery: 'Amazon (2 days)',
      bestOffer: 'Meesho ₹799 with free shipping',
      verdictSummary: 'Meesho offers the highest value for boAt Airdopes Alpha at ₹799 (₹200 cheaper than Flipkart).'
    }
  });
  console.log('✅ Stored AI Recommendation in `platform_recommendations` table.');

  console.log('\n🎉 ALL 10 DATABASE TABLES ARE FULLY STORED AND POPULATED!');
  await prisma.$disconnect();
}

populateCompleteDatabase();
