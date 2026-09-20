import { fetchLivePriceOnly, scrapeProductData } from './src/utils/liveScraper.js';

async function runTest() {
  console.log('Testing Puppeteer Live Scraper on Myntra...');
  
  // Real Myntra product URL
  const url = 'https://www.myntra.com/watches/fossil/fossil-men-black-dial-watch-fs5308/1799279/buy';
  
  try {
    const data = await scrapeProductData(url);
    console.log(`\n✅ PUPPETEER REAL-TIME RESULT:`);
    console.log(JSON.stringify(data, null, 2));
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

runTest();
