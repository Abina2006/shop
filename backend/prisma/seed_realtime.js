import { scrapeAndSave } from '../src/modules/product/product.service.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleUrls = [
  "https://www.meesho.com/hoppup-xo3-gaming-earbuds-with-35ms-low-latency/p/6p8x2z",
  "https://amazon.in/dp/B0CHX12345",
  "https://amazon.in/dp/B09XS8728S",
  "https://flipkart.com/boat-airdopes-141"
];

async function seedRealtime() {
  console.log('Ingesting real-time scraped products via Scrapy engine into PostgreSQL...');

  for (const url of sampleUrls) {
    try {
      console.log(`Scraping live URL: ${url}`);
      const results = await scrapeAndSave(url);
      console.log(`Scraped ${results.length} items from ${url}`);
    } catch (err) {
      console.error(`Failed scraping ${url}:`, err.message);
    }
  }

  const count = await prisma.product.count();
  console.log(`Real-time ingestion complete! PostgreSQL database now contains ${count} live scraped products.`);
  await prisma.$disconnect();
}

seedRealtime();
