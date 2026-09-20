import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SAMPLE_REVIEWS_BY_CATEGORY = {
  Audio: [
    { reviewerName: 'Aarav Sharma', rating: 5.0, reviewText: 'Phenomenal audio clarity, deep punchy bass, and battery easily lasts all day. Highly recommended!' },
    { reviewerName: 'Sneha Patel', rating: 4.5, reviewText: 'Very comfortable in-ear fit and seamless Bluetooth pairing with both laptop and phone.' },
    { reviewerName: 'Kavya Nair', rating: 4.0, reviewText: 'Great value for money. Microphone is crisp for Zoom meetings and calls.' },
    { reviewerName: 'Rohan Gupta', rating: 5.0, reviewText: 'Active noise cancellation exceeded my expectations. Total game changer during flights.' }
  ],
  Smartphones: [
    { reviewerName: 'Vikram Mehta', rating: 5.0, reviewText: 'Stunning display, flagship camera quality, and super snappy performance with zero lag.' },
    { reviewerName: 'Ananya Roy', rating: 4.5, reviewText: 'Battery life easily lasts 1.5 days on heavy usage. Fast charging is incredible.' },
    { reviewerName: 'Rahul Verma', rating: 4.5, reviewText: 'Build quality feels super premium in hand. Low light photography is top notch.' },
    { reviewerName: 'Priya Iyer', rating: 4.0, reviewText: 'Smooth 120Hz refresh rate and crisp stereo speakers. Great overall package.' }
  ],
  Computers: [
    { reviewerName: 'Siddharth Jain', rating: 5.0, reviewText: 'Blazing fast compile times and whisper quiet thermals. Battery life is extraordinary.' },
    { reviewerName: 'Divya Menen', rating: 4.8, reviewText: 'Crisp high resolution screen, tactile keyboard, and feather-light portability.' },
    { reviewerName: 'Manish Kaushik', rating: 4.5, reviewText: 'Handles 4K video rendering and heavy multitasking effortlessly. Best purchase this year.' }
  ],
  Wearables: [
    { reviewerName: 'Tanvi Saxena', rating: 5.0, reviewText: 'Accurate sleep and heart rate tracking. Bright AMOLED display is clearly visible in sunlight.' },
    { reviewerName: 'Arjun Das', rating: 4.5, reviewText: 'Premium finish and seamless notification sync. Fitness workout modes are very comprehensive.' },
    { reviewerName: 'Meera Chawla', rating: 4.0, reviewText: 'Battery lasts great and the step counter is very reliable. Looks elegant on wrist.' }
  ],
  Fashion: [
    { reviewerName: 'Pooja Reddy', rating: 5.0, reviewText: 'Fabric is extremely soft, breathable, and color does not bleed after washing. Fits true to size!' },
    { reviewerName: 'Neha Kapoor', rating: 4.5, reviewText: 'Stitching quality is top grade. Looks even better in person than the product photos.' },
    { reviewerName: 'Aditya Singh', rating: 4.0, reviewText: 'Comfortable stretch material and modern fit. Great for casual and daily wear.' }
  ],
  Footwear: [
    { reviewerName: 'Rajesh Nair', rating: 5.0, reviewText: 'Superior arch support and cloud-like cushioning. Ideal for long distance running and gym.' },
    { reviewerName: 'Deepak V', rating: 4.5, reviewText: 'Lightweight build with durable grip on wet surfaces. Worth every single rupee.' },
    { reviewerName: 'Shreya Joshi', rating: 4.5, reviewText: 'Super comfortable all-day shoe. Sizing is accurate and heel support is great.' }
  ],
  'Personal Care': [
    { reviewerName: 'Sunita Rao', rating: 5.0, reviewText: 'Gentle on sensitive skin, refreshing fragrance, and keeps skin naturally moisturized.' },
    { reviewerName: 'Alok Mishra', rating: 4.5, reviewText: 'Lathers rich and leaves no residue. A staple in our family household for years.' },
    { reviewerName: 'Kritika Sen', rating: 4.5, reviewText: 'Noticeable glow and skin feels rejuvenated. 100% authentic product.' }
  ],
  Groceries: [
    { reviewerName: 'Ramesh Sundaram', rating: 5.0, reviewText: 'Aromatic long grains that cook fluffy without clumping. Ideal for biryanis and daily meals.' },
    { reviewerName: 'Geeta Varma', rating: 4.5, reviewText: 'Fresh packaging and pure quality. Clean and ready to use.' }
  ],
  Appliances: [
    { reviewerName: 'Amitabh Sen', rating: 5.0, reviewText: 'Cuts cooking oil by 90% while keeping snacks crispy and golden. Easy to clean basket.' },
    { reviewerName: 'Bhavna K', rating: 4.5, reviewText: 'Fast heating presets and safe auto-off features. Very practical for modern Indian kitchen.' }
  ]
};

async function seedAllReviews() {
  console.log('=== Seeding Customer Reviews Across All Products & Listings ===\n');

  const listings = await prisma.productListing.findMany({
    include: { product: true }
  });

  console.log(`Found ${listings.length} product listings in database.`);

  let totalInserted = 0;

  for (const listing of listings) {
    const category = listing.product.category || 'Audio';
    const samplePool = SAMPLE_REVIEWS_BY_CATEGORY[category] || SAMPLE_REVIEWS_BY_CATEGORY['Audio'];

    // Check if listing already has reviews
    const existingCount = await prisma.review.count({ where: { listingId: listing.id } });
    if (existingCount >= 2) continue;

    // Pick 2-3 reviews
    const reviewsToInsert = samplePool.slice(0, 3);
    for (const rev of reviewsToInsert) {
      await prisma.review.create({
        data: {
          listingId: listing.id,
          reviewerName: rev.reviewerName,
          rating: rev.rating,
          reviewText: rev.reviewText,
          sentimentScore: rev.rating >= 4.5 ? 0.92 : 0.78,
          summarizedText: rev.reviewText.split('.')[0] + '.',
          scrapedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 86400000))
        }
      });
      totalInserted++;
    }
  }

  const finalCount = await prisma.review.count();
  console.log(`\n🎉 Seeded ${totalInserted} reviews! Total reviews in database: ${finalCount}`);
  await prisma.$disconnect();
}

seedAllReviews().catch(err => {
  console.error('Error seeding reviews:', err);
  process.exit(1);
});
