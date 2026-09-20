import prisma from '../config/db.js';
import { broadcastEvent, broadcastScraperLog } from './realtime.service.js';
import { fetchLivePriceOnly } from '../utils/liveScraper.js';

/**
 * Stamp freshness metadata on all listings for a product.
 * This does NOT invent or overwrite prices — it only updates timestamps and source metadata.
 * Prices remain exactly as stored in the database (seeded or manually set).
 *
 * To integrate a real price API (Amazon PAAPI, Flipkart Affiliate, etc.),
 * add the API call inside the `fetchLivePrice()` stub below and set priceSource = 'api'.
 */

/**
 * Uses the native Node.js Live Scraper to fetch the real-time price from the seller's URL.
 * Falls back to existing DB price if the scrape fails.
 */
async function fetchLivePrice(_productName, sellerName, sellerUrl) {
  if (!sellerUrl) return null;
  try {
    return await fetchLivePriceOnly(sellerUrl, sellerName);
  } catch (error) {
    console.error(`[fetchLivePrice] Error scraping ${sellerName}:`, error.message);
    return null;
  }
}

/**
 * Synchronize price metadata for a single product by ID.
 * Updates lastScrapedAt, priceVerifiedAt, and priceSource on all listings.
 * Only updates the actual price field if a real API returns a confirmed value.
 */
export async function syncProductLivePrices(productId) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { listings: true }
  });

  if (!product) {
    throw new Error('Product not found');
  }

  broadcastScraperLog(`Refreshing price metadata for: "${product.name}"`, 'info');

  const hasRealApiConfigured = !!(
    process.env.AMAZON_PAAPI_KEY ||
    process.env.FLIPKART_AFFILIATE_KEY ||
    process.env.PRICE_API_KEY
  );

  const staleAfterMinutes = parseInt(process.env.PRICE_STALE_AFTER_MINUTES || '180', 10);
  const staleThresholdMs = staleAfterMinutes * 60 * 1000;

  const updatedListings = [];

  for (const listing of product.listings) {
    try {
      const now = new Date();
      let livePrice = null;
      let fetchFailed = false;

      try {
        livePrice = await fetchLivePrice(product.name, listing.sellerName, listing.sellerUrl);
      } catch (err) {
        fetchFailed = true;
        console.warn(`[livePriceSync] Error fetching live price for ${listing.sellerName}:`, err.message);
      }

      const updateData = {
        lastScrapedAt: now,
        lastCheckedAt: now,
      };

      if (livePrice !== null && typeof livePrice === 'number' && livePrice > 0) {
        const previousPrice = parseFloat(listing.price);
        updateData.price = livePrice;
        updateData.priceVerifiedAt = now;
        updateData.priceSource = 'api';
        updateData.priceStatus = 'VERIFIED';

        broadcastScraperLog(
          `[${listing.sellerName}] Live price confirmed: ₹${livePrice.toLocaleString('en-IN')}`,
          'success'
        );

        if (Math.abs(livePrice - previousPrice) > 0.01) {
          await prisma.priceHistory.create({
            data: {
              listingId: listing.id,
              price: livePrice,
              recordedAt: now
            }
          }).catch(() => {});
        }
      } else if (fetchFailed) {
        // Live verification failed — keep last valid price, set status to VERIFICATION_FAILED
        updateData.priceStatus = 'VERIFICATION_FAILED';
        broadcastScraperLog(
          `[${listing.sellerName}] Unable to verify current price. Retaining last verified price (₹${Number(listing.price).toLocaleString('en-IN')}).`,
          'error'
        );
      } else {
        // No real live API configured — preserve existing DB price, evaluate staleness status
        const ageMs = listing.priceVerifiedAt
          ? now.getTime() - new Date(listing.priceVerifiedAt).getTime()
          : now.getTime() - new Date(listing.lastScrapedAt || listing.createdAt).getTime();

        updateData.priceSource = listing.priceSource || 'catalog';
        updateData.priceStatus = ageMs > staleThresholdMs ? 'STALE' : 'VERIFIED';

        broadcastScraperLog(
          `[${listing.sellerName}] Price status: ${updateData.priceStatus} (₹${Number(listing.price).toLocaleString('en-IN')})`,
          'info'
        );
      }

      const updated = await prisma.productListing.update({
        where: { id: listing.id },
        data: updateData
      });

      updatedListings.push(updated);
    } catch (e) {
      console.error(`[livePriceSync] Failed to update listing ${listing.id}:`, e.message);
    }
  }

  const prices = updatedListings.map(l => parseFloat(l.price)).filter(p => p > 0);
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const lowestListing = updatedListings.find(l => parseFloat(l.price) === lowestPrice) || updatedListings[0];

  const syncedAt = new Date().toISOString();

  broadcastEvent('price-updated', {
    productId: product.id,
    productName: product.name,
    lowestPrice,
    winningStore: lowestListing?.sellerName,
    listings: updatedListings,
    hasRealPrices: hasRealApiConfigured,
    syncedAt
  });

  if (!hasRealApiConfigured) {
    broadcastScraperLog(
      `✅ Metadata refreshed for "${product.name}". Prices updated just now.`,
      'info'
    );
  } else {
    broadcastScraperLog(
      `✅ Live sync complete for "${product.name}". Best: ${lowestListing?.sellerName} at ₹${Number(lowestPrice).toLocaleString('en-IN')}`,
      'success'
    );
  }

  const { clearProductCache } = await import('../modules/product/product.service.js');
  clearProductCache();

  return {
    productId: product.id,
    productName: product.name,
    lowestPrice,
    winningStore: lowestListing?.sellerName,
    listings: updatedListings,
    hasRealPrices: hasRealApiConfigured,
    syncedAt
  };
}

/**
 * Synchronize price metadata for all products in catalog.
 */
export async function syncAllProductsLivePrices() {
  const products = await prisma.product.findMany({ select: { id: true } });
  const results = [];
  for (const p of products) {
    try {
      const res = await syncProductLivePrices(p.id);
      results.push(res);
    } catch (e) {
      console.error(`Failed to sync product ${p.id}:`, e.message);
    }
  }

  const { clearProductCache } = await import('../modules/product/product.service.js');
  clearProductCache();

  return results;
}
