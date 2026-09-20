import cron from 'node-cron';
import { syncAllProductsLivePrices } from '../services/livePriceSync.service.js';
import { broadcastScraperLog } from '../services/realtime.service.js';
import { checkAndTriggerPriceAlerts } from '../services/emailAlert.service.js';

/**
 * Initialize Scheduled Price Metadata Refresh Jobs.
 *
 * What this cron does:
 * - Refreshes lastScrapedAt timestamps on all product listings (so frontend staleness badges stay accurate)
 * - If real API credentials are configured (AMAZON_PAAPI_KEY etc.), updates actual prices from those sources
 * - If no real API is configured, preserves existing DB prices unchanged — does NOT invent new prices
 * - Checks active price alerts and sends email notifications when thresholds are met
 *
 * To enable live price fetching, add your API credentials to backend/.env:
 *   AMAZON_PAAPI_KEY=your_key
 *   FLIPKART_AFFILIATE_KEY=your_key
 */
export function initPriceSyncCron() {
  console.log('⏰ [Cron Scheduler] Initializing price metadata refresh jobs...');

  const hasRealApiConfigured = !!(
    process.env.AMAZON_PAAPI_KEY ||
    process.env.FLIPKART_AFFILIATE_KEY ||
    process.env.PRICE_API_KEY
  );

  if (!hasRealApiConfigured) {
    console.log('ℹ️  [Cron Scheduler] No live price API keys configured. Cron will only refresh metadata timestamps and check price alerts.');
    console.log('ℹ️  [Cron Scheduler] To enable live prices, add AMAZON_PAAPI_KEY or FLIPKART_AFFILIATE_KEY to your .env file.');
  }

  async function runSync(label) {
    console.log(`⏰ [Cron Scheduler] Running ${label} price metadata refresh...`);
    broadcastScraperLog(
      `⏰ ${label}: Refreshing price metadata for all catalog products...`,
      'step'
    );

    try {
      const results = await syncAllProductsLivePrices();
      const count = results.length;

      if (hasRealApiConfigured) {
        console.log(`✅ [Cron Scheduler] Live prices synced for ${count} products.`);
        broadcastScraperLog(`✅ ${label}: Live prices updated for ${count} products.`, 'success');
      } else {
        console.log(`✅ [Cron Scheduler] Price metadata refreshed for ${count} products (reference prices preserved).`);
        broadcastScraperLog(
          `✅ ${label}: Price metadata refreshed for ${count} products. Prices are reference values — configure a price API for live data.`,
          'info'
        );
      }

      // Always check active price drop alerts regardless of API availability
      await checkAndTriggerPriceAlerts();
    } catch (err) {
      console.error(`❌ [Cron Scheduler] Error during ${label}:`, err.message);
      broadcastScraperLog(`❌ ${label} Error: ${err.message}`, 'error');
    }
  }

  // Schedule to run every 4 hours
  cron.schedule('0 */4 * * *', () => runSync('4-hour scheduled refresh'));

  // Run once 5 minutes after server start to initialize fresh metadata
  setTimeout(() => runSync('Startup metadata refresh (5min post-boot)'), 5 * 60 * 1000);

  console.log('✅ [Cron Scheduler] Price sync cron registered (every 4 hours + startup in 5 min).');
}
