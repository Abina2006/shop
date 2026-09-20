/**
 * Fix all product images to use reliable Unsplash CDN URLs
 * Run: node fix_product_images_now.mjs
 */
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

// Map product names/categories to real Unsplash image URLs
const IMAGE_MAP = [
  // Induction cooktop
  {
    match: /induction/i,
    url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80'
  },
  // Tea / beverages
  {
    match: /tea|coffee|beverage/i,
    url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80'
  },
  // Soap bars
  {
    match: /soap|bathing bar|dove|pears|dettol|lux/i,
    url: 'https://images.unsplash.com/photo-1585232350077-b3d9f03e9b56?w=600&q=80'
  },
  // Running shoes / footwear
  {
    match: /shoes|sneaker|footwear|campus|asian|nike|adidas/i,
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'
  },
  // Smartwatch
  {
    match: /smartwatch|watch|noise|boAt watch|fitbit/i,
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'
  },
  // Microphone / audio accessories
  {
    match: /microphone|mic|collar/i,
    url: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&q=80'
  },
  // Air fryer / kitchen appliances
  {
    match: /air fryer|airfryer|philips|kitchen/i,
    url: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80'
  },
  // Cooking oil / grocery
  {
    match: /oil|sunflower|fortune|grocery/i,
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80'
  },
  // Shampoo / hair care
  {
    match: /shampoo|hair|tresemme|conditioner/i,
    url: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80'
  },
  // Women ethnic wear / kurta
  {
    match: /kurta|kurti|anarkali|ethnic|salwar|lehenga/i,
    url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80'
  },
  // Jeans / men clothing
  {
    match: /jeans|denim|levi|trouser|shirt|men.*cloth/i,
    url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80'
  },
  // Sony WH-1000XM5 headphones
  {
    match: /sony|headphone|wh-1000|noise cancell/i,
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'
  },
  // boAt earbuds / TWS
  {
    match: /boat|airdopes|earbuds|tws|wireless ear/i,
    url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80'
  },
  // Laptop HP / Dell
  {
    match: /laptop|pavilion|hp|dell|lenovo|asus|notebook/i,
    url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80'
  },
  // MacBook
  {
    match: /macbook|apple.*mac/i,
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80'
  },
  // OnePlus phone
  {
    match: /oneplus/i,
    url: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80'
  },
  // Samsung Galaxy
  {
    match: /samsung|galaxy/i,
    url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80'
  },
  // iPhone / Apple phone
  {
    match: /iphone|apple.*pro|apple.*15/i,
    url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80'
  },
  // iPad
  {
    match: /ipad|tablet/i,
    url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80'
  },
  // Smartphone generic fallback
  {
    match: /phone|pixel|realme|redmi|poco|oppo|vivo|motorola/i,
    url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80'
  },
];

const FALLBACK_URL = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80';

function findImageUrl(name, category) {
  const text = `${name} ${category}`;
  for (const { match, url } of IMAGE_MAP) {
    if (match.test(text)) return url;
  }
  return FALLBACK_URL;
}

async function main() {
  console.log('🔄 Connecting to database...');
  await prisma.$connect();
  
  const products = await prisma.product.findMany();
  console.log(`📦 Found ${products.length} products to update`);

  let updated = 0;
  for (const p of products) {
    const newUrl = findImageUrl(p.name, p.category);
    await prisma.product.update({
      where: { id: p.id },
      data: { imageUrl: newUrl }
    });
    console.log(`  ✅ ${p.name.substring(0, 50)}`);
    console.log(`     → ${newUrl}`);
    updated++;
  }

  console.log(`\n🎉 Updated ${updated} product images to Unsplash CDN URLs!`);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
