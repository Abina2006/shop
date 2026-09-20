import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function exportDatabase() {
  console.log('Exporting complete PostgreSQL database to separate JSON data file...');

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
  const priceAlerts = await prisma.priceAlert.findMany();
  const wishlists = await prisma.wishlist.findMany();
  const scraperLogs = await prisma.scraperLog.findMany();

  const fullDatabaseStore = {
    exportedAt: new Date().toISOString(),
    totalUsersCount: users.length,
    totalProductsCount: products.length,
    tables: {
      users,
      products,
      priceAlerts,
      wishlists,
      scraperLogs
    }
  };

  const outputPath = path.join(__dirname, 'database_store.json');
  fs.writeFileSync(outputPath, JSON.stringify(fullDatabaseStore, null, 2), 'utf-8');

  console.log(`\n✅ Database Export Complete!`);
  console.log(`📄 Saved to separate file: ${outputPath}`);
  console.log(`📊 Exported ${users.length} Users, ${products.length} Products, and all associated seller listings/reviews.`);

  await prisma.$disconnect();
}

exportDatabase();
