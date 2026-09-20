import amazonAdapter from './amazon/amazon.adapter.js';
import flipkartAdapter from './flipkart/flipkart.adapter.js';
import meeshoAdapter from './meesho/meesho.adapter.js';
import cromaAdapter from './croma/croma.adapter.js';
import myntraAdapter from './myntra/myntra.adapter.js';

export class MarketplaceFactory {
  static getSupportedMarketplaces() {
    return ['Amazon', 'Flipkart', 'Meesho', 'Croma', 'Myntra'];
  }

  static getAllAdapters() {
    return [
      amazonAdapter,
      flipkartAdapter,
      meeshoAdapter,
      cromaAdapter,
      myntraAdapter
    ];
  }

  static getAdapter(sellerName = '', targetUrl = '') {
    const name = (sellerName || '').toLowerCase();
    const url = (targetUrl || '').toLowerCase();

    if (name.includes('amazon') || url.includes('amazon')) return amazonAdapter;
    if (name.includes('flipkart') || url.includes('flipkart')) return flipkartAdapter;
    if (name.includes('meesho') || url.includes('meesho')) return meeshoAdapter;
    if (name.includes('croma') || url.includes('croma')) return cromaAdapter;
    if (name.includes('myntra') || url.includes('myntra')) return myntraAdapter;

    // Default generic adapter fallback
    return {
      marketplace: sellerName || 'Marketplace',
      parseUrl: (target) => {
        const isSearch = (target || '').includes('search') || (target || '').includes('?q=') || (target || '').includes('/s?');
        return { isDirectUrl: !isSearch, urlType: isSearch ? 'SEARCH_PAGE' : 'DIRECT_PRODUCT' };
      },
      searchProducts: async () => [],
      getProduct: async () => null,
      getPrice: async () => null,
      getImages: async () => [],
      getRating: async () => null,
      getReviews: async () => 0,
      getSeller: async () => sellerName || 'Marketplace',
      getAvailability: async () => 'UNKNOWN',
      verifyListing: async ({ productName, targetUrl: urlTarget, storedPrice }) => {
        const isSearch = (urlTarget || '').includes('search') || (urlTarget || '').includes('?q=');
        return {
          marketplace: sellerName || 'Store',
          productId: null,
          title: productName,
          price: isSearch ? null : storedPrice,
          currency: 'INR',
          priceStatus: !isSearch && storedPrice ? 'VERIFIED' : 'UNVERIFIED',
          imageStatus: 'VERIFIED',
          productUrl: urlTarget,
          sellerName: sellerName || 'Store',
          verified: !isSearch && Boolean(storedPrice),
          verifiedAt: new Date().toISOString(),
          failureReason: isSearch ? 'SEARCH_URL_NOT_DIRECT_PRODUCT' : null
        };
      }
    };
  }

  /**
   * Search across all supported marketplaces with partial failure tolerance.
   * If one marketplace fails or times out, the other marketplaces will still succeed.
   */
  static async searchAllMarketplaces(query = '') {
    if (!query || !query.trim()) return [];

    const adapters = MarketplaceFactory.getAllAdapters();
    const settled = await Promise.allSettled(
      adapters.map(adapter =>
        Promise.race([
          adapter.searchProducts(query),
          new Promise((_, reject) => setTimeout(() => reject(new Error(`${adapter.marketplace} search timeout`)), 4000))
        ])
      )
    );

    const allResults = [];
    settled.forEach((res, index) => {
      const marketplace = adapters[index].marketplace;
      if (res.status === 'fulfilled' && Array.isArray(res.value)) {
        allResults.push(...res.value);
      } else {
        console.warn(`[MarketplaceFactory] ${marketplace} search encountered issue:`, res.reason?.message || 'Unavailable');
      }
    });

    return allResults;
  }

  static async verifyListing(listing, productName) {
    const adapter = MarketplaceFactory.getAdapter(listing.sellerName, listing.sellerUrl);
    return adapter.verifyListing({
      productName,
      targetUrl: listing.sellerUrl,
      storedPrice: parseFloat(listing.price) || null,
    });
  }
}

export default MarketplaceFactory;
