import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanAndShow() {
  // Drop accidental manual tables
  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "user" CASCADE;`);
  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "user name" CASCADE;`);
  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "usernmae" CASCADE;`);
  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "prices" CASCADE;`);
  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "wishlist" CASCADE;`);

  console.log('✅ Cleaned up old manual empty tables.');

  // Fetch actual data
  const users = await prisma.$queryRawUnsafe(`SELECT name, email, role FROM users;`);
  const products = await prisma.$queryRawUnsafe(`SELECT name, category, brand FROM products;`);
  const listings = await prisma.$queryRawUnsafe(`SELECT seller_name, price, rating FROM product_listings;`);

  console.log('\n👤 TABLE: users');
  console.table(users);

  console.log('\n📦 TABLE: products');
  console.table(products);

  console.log('\n🏪 TABLE: product_listings (Comparison & Stores)');
  console.table(listings);

  await prisma.$disconnect();
}

cleanAndShow();
