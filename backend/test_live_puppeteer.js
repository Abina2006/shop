import { scrapeProductData } from './src/utils/liveScraper.js';

async function testLiveScraper() {
  console.log('🧪 Testing Puppeteer Stealth Live Scraper on Meesho...\n');
  const url = 'https://www.meesho.com/boat-airdopes-alpha/p/aqdw7s';
  const data = await scrapeProductData(url);
  console.log('Scraped result:', JSON.stringify(data, null, 2));
}

testLiveScraper().catch(console.error);
