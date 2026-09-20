import fs from 'fs';
import crypto from 'crypto';

const seedContent = fs.readFileSync('prisma/seed_perfect_real_catalog.js', 'utf8');
const match = seedContent.match(/const CATALOG = (\[[\s\S]*?\]);\s*const SAMPLE_REVIEWS/);
if (!match) {
  console.error('Could not match catalog');
  process.exit(1);
}
const CATALOG = eval(match[1]);

let sql = `-- ====================================================================
-- SHOPWISE AI: CLOUD DATABASE SEED (REAL PRODUCTS & STORE DEALS)
-- ====================================================================

TRUNCATE TABLE "users", "products", "product_listings", "price_history", "price_alerts", "wishlists", "reviews", "seller_reliability", "platform_recommendations", "scraper_logs" CASCADE;

INSERT INTO "users" ("id", "name", "email", "password_hash", "role", "created_at") VALUES
  ('${crypto.randomUUID()}', 'Admin User', 'admin@shopwise.ai', '$2a$10$wO3nE8yQc/1t4KkLp8xMheXz.R2O2eI9XfN6BfK.r1z.Xz.R2O2eI', 'ADMIN', NOW()),
  ('${crypto.randomUUID()}', 'Demo Shopper', 'shopper@shopwise.ai', '$2a$10$wO3nE8yQc/1t4KkLp8xMheXz.R2O2eI9XfN6BfK.r1z.Xz.R2O2eI', 'USER', NOW());

`;

for (const item of CATALOG) {
  const prodId = crypto.randomUUID();
  const cleanName = item.name.replace(/'/g, "''");
  const cleanDesc = (item.description || '').replace(/'/g, "''");
  const cleanBrand = (item.brand || '').replace(/'/g, "''");
  const cleanCat = (item.category || '').replace(/'/g, "''");
  const cleanImg = (item.imageUrl || '').replace(/'/g, "''");

  sql += `INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES\n  ('${prodId}', '${cleanName}', '${cleanCat}', '${cleanBrand}', '${cleanImg}', '${cleanDesc}', NOW());\n\n`;

  let lowestPrice = Infinity;
  let lowestStore = '';
  let highestPrice = 0;

  for (const st of (item.stores || [])) {
    const listId = crypto.randomUUID();
    const stName = st.sellerName.replace(/'/g, "''");
    const stUrl = (st.sellerUrl || '').replace(/'/g, "''");
    const p = parseFloat(st.price);
    if (p < lowestPrice) { lowestPrice = p; lowestStore = st.sellerName; }
    if (p > highestPrice) { highestPrice = p; }

    sql += `INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES\n  ('${listId}', '${prodId}', '${stName}', '${stUrl}', ${p}, 'INR', ${st.rating || 4.5}, ${st.reviewCount || 100}, '2-3 Days', '10% Instant Bank Discount', NOW());\n\n`;

    sql += `INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES\n  ('${crypto.randomUUID()}', '${listId}', ${(p * 1.08).toFixed(2)}, NOW() - INTERVAL '15 days'),\n  ('${crypto.randomUUID()}', '${listId}', ${p}, NOW());\n\n`;

    sql += `INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES\n  ('${crypto.randomUUID()}', '${listId}', 'Verified Customer', ${st.rating || 4.5}, 'Excellent verified authentic product from ${stName} with fast shipping.', 0.92, 'Highly recommended', NOW());\n\n`;
  }

  const reasons = [
    `Lowest authenticated price verified at ₹${lowestPrice.toLocaleString('en-IN')}`,
    `Guaranteed genuine warranty & authorized seller fulfillment on ${lowestStore}`,
    `Fast express dispatch with 7-day hassle-free replacement`
  ];
  const reasonsArr = `ARRAY['${reasons.map(r => r.replace(/'/g, "''")).join("', '")}']`;
  const recId = crypto.randomUUID();
  const verdict = `Recommended to purchase on ${lowestStore} for maximum savings of ₹${(highestPrice - lowestPrice).toLocaleString('en-IN')}.`;

  sql += `INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES\n  ('${recId}', '${prodId}', '${lowestStore}', 95, ${reasonsArr}, ${lowestPrice}, '${lowestStore}', '1-2 Days Express', 'Bank Offer & Instant Savings', '${verdict.replace(/'/g, "''")}', NOW());\n\n`;
}

fs.writeFileSync('prisma/seed_cloud.sql', sql, 'utf8');
console.log(`Generated prisma/seed_cloud.sql for ${CATALOG.length} products!`);