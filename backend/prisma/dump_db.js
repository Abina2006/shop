import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function dumpDatabase() {
  const users = await prisma.user.findMany();
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

  console.log('================================================================================');
  console.log('                   📊 COMPLETE POSTGRESQL DATABASE DUMP                         ');
  console.log('================================================================================\n');

  console.log('👤 TABLE: users (' + users.length + ' Registered Accounts)');
  console.log('--------------------------------------------------------------------------------');
  users.forEach((u, i) => {
    console.log(`[${i + 1}] ID: ${u.id}`);
    console.log(`    Name: ${u.name} | Email: ${u.email} | Role: ${u.role} | Created: ${u.createdAt.toISOString()}`);
  });

  console.log('\n📦 TABLE: products (' + products.length + ' Products)');
  console.log('--------------------------------------------------------------------------------');
  products.forEach((p, i) => {
    console.log(`\n[${i + 1}] Product ID: ${p.id}`);
    console.log(`    Name: ${p.name}`);
    console.log(`    Category: ${p.category} | Brand: ${p.brand}`);
    console.log(`    Image URL: ${p.imageUrl}`);

    console.log(`\n    🏪 TABLE: product_listings (${p.listings.length} Seller Listings):`);
    p.listings.forEach((l, li) => {
      console.log(`      (${li + 1}) Listing ID: ${l.id}`);
      console.log(`          Seller: ${l.sellerName} | Price: ₹${l.price} | Rating: ${l.rating}★ | Reviews: ${l.reviewCount}`);
      console.log(`          Seller URL: ${l.sellerUrl}`);

      if (l.reviews.length > 0) {
        console.log(`          ⭐ Reviews (${l.reviews.length}):`);
        l.reviews.forEach((r, ri) => {
          console.log(`             - ${r.reviewerName} (${r.rating}★): "${r.reviewText}"`);
        });
      }

      if (l.priceHistory.length > 0) {
        console.log(`          📈 Price History (${l.priceHistory.length} Points):`);
        l.priceHistory.forEach((h) => {
          console.log(`             - ₹${h.price} on ${h.recordedAt.toISOString().split('T')[0]}`);
        });
      }
    });
  });

  console.log('\n================================================================================');
  await prisma.$disconnect();
}

dumpDatabase();
