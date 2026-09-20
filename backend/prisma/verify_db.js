import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  console.log('================================================================================');
  console.log('            📊 SHOPWISE AI — COMPLETE LIVE POSTGRESQL DATABASE                  ');
  console.log('================================================================================\n');

  // 1. Registered User Login Accounts
  const users = await prisma.user.findMany({
    include: {
      wishlists: { include: { product: true } },
      priceAlerts: { include: { listing: true } }
    }
  });

  console.log(`👤 1. USER LOGIN & AUTHENTICATION ACCOUNTS (${users.length} Users)`);
  console.log('--------------------------------------------------------------------------------');
  users.forEach((u, i) => {
    console.log(`[User ${i + 1}] ID: ${u.id}`);
    console.log(`          Name: ${u.name} | Email: ${u.email} | Role: ${u.role}`);
    console.log(`          Created At: ${u.createdAt.toISOString()}`);
    if (u.wishlists.length > 0) {
      console.log(`          ❤️ Wishlists (${u.wishlists.length}): ${u.wishlists.map(w => w.product?.name).join(', ')}`);
    }
    if (u.priceAlerts.length > 0) {
      console.log(`          🔔 Price Alerts (${u.priceAlerts.length}): ${u.priceAlerts.map(a => `Target ₹${a.targetPrice}`).join(', ')}`);
    }
  });

  // 2. Products, Seller Listings, Comparison & Reviews
  const products = await prisma.product.findMany({
    include: {
      listings: {
        include: {
          reviews: true,
          priceHistory: true
        }
      },
      platformRecommendations: true
    }
  });

  console.log(`\n📦 2. PRODUCTS, SELLER LISTINGS & COMPARISON DATA (${products.length} Products)`);
  console.log('--------------------------------------------------------------------------------');
  products.forEach((p, i) => {
    console.log(`\n[Product ${i + 1}] Name: ${p.name}`);
    console.log(`             ID: ${p.id}`);
    console.log(`             Category: ${p.category} | Brand: ${p.brand}`);
    console.log(`             Image URL: ${p.imageUrl}`);

    // AI Platform Recommendation
    if (p.platformRecommendations.length > 0) {
      const rec = p.platformRecommendations[0];
      console.log(`             🤖 AI Recommendation: Buy on "${rec.recommendedPlatform}" (Confidence: ${rec.confidenceScore}%)`);
      console.log(`                Best Price: ₹${rec.bestPrice} on ${rec.bestSeller} | Delivery: ${rec.fastestDelivery}`);
      console.log(`                Verdict: ${rec.verdictSummary}`);
    }

    // Seller Listings
    console.log(`\n             🏪 Seller Store Listings (${p.listings.length} Stores):`);
    p.listings.forEach((l, li) => {
      console.log(`                (${li + 1}) Seller: ${l.sellerName} | Price: ₹${l.price} | Rating: ${l.rating}★ | Reviews: ${l.reviewCount}`);
      console.log(`                    URL: ${l.sellerUrl}`);

      if (l.priceHistory.length > 0) {
        console.log(`                    📈 Price History (${l.priceHistory.length} Points): ${l.priceHistory.map(h => `₹${h.price}`).join(' -> ')}`);
      }

      if (l.reviews.length > 0) {
        console.log(`                    ⭐ Extracted Customer Reviews (${l.reviews.length}):`);
        l.reviews.slice(0, 3).forEach(r => {
          console.log(`                       - ${r.reviewerName} (${r.rating}★): "${r.reviewText}"`);
        });
      }
    });
  });

  console.log('\n================================================================================');
  await prisma.$disconnect();
}

verify();
