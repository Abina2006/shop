import { syncAllProductsLivePrices } from './src/services/livePriceSync.service.js';

async function runScrape() {
  console.log('🚀 Initiating Complete Catalog Live Price Sync via Puppeteer...');
  const results = await syncAllProductsLivePrices();
  console.log('✅ Sync complete!', results);
  process.exit(0);
}

runScrape().catch(err => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
