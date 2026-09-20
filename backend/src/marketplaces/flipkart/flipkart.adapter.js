/**
 * Flipkart Marketplace Adapter
 * Handles URL parsing, FSN extraction, direct product URL verification,
 * standardized product search, and live price/metadata retrieval.
 */

import prisma from '../../config/db.js';
import { parseSpecs } from '../../utils/productMatcher.js';

export class FlipkartAdapter {
  constructor() {
    this.marketplace = 'Flipkart';
    this.baseUrl = 'https://www.flipkart.com';
  }

  /**
   * Extract Flipkart Item ID (FSN) and check if URL is direct product page.
   */
  parseUrl(url = '') {
    if (!url || typeof url !== 'string') {
      return { isDirectUrl: false, fsn: null, urlType: 'INVALID' };
    }

    const cleanUrl = url.trim();
    const fsnMatch = cleanUrl.match(/\/p\/(itm[a-zA-Z0-9]{8,16})/i) || cleanUrl.match(/pid=([A-Z0-9]{16})/i);
    const fsn = fsnMatch ? fsnMatch[1] : null;

    const isSearchUrl = cleanUrl.includes('/search?') || cleanUrl.includes('q=') || cleanUrl.includes('/search/');
    const isDirectUrl = (Boolean(fsn) || cleanUrl.includes('/p/')) && !isSearchUrl;

    return {
      isDirectUrl,
      fsn,
      urlType: isDirectUrl ? 'DIRECT_PRODUCT' : isSearchUrl ? 'SEARCH_PAGE' : 'UNKNOWN'
    };
  }

  /**
   * Normalize raw data into standardized structure conforming to Section 7
   */
  normalizeProduct(raw = {}) {
    const specs = parseSpecs(`${raw.title || raw.name || ''} ${raw.variant || ''}`);
    const directUrl = raw.productUrl || (raw.fsn ? `${this.baseUrl}/p/${raw.fsn}` : null);
    const isDirect = this.parseUrl(directUrl).isDirectUrl;

    return {
      marketplace: this.marketplace,
      externalProductId: raw.fsn || raw.externalProductId || null,
      title: raw.title || raw.name || 'Flipkart Product',
      brand: raw.brand || (raw.title ? raw.title.split(' ')[0] : 'Flipkart'),
      model: specs.modelKey || raw.model || null,
      variant: [specs.storage, specs.ram, specs.color].filter(Boolean).join(' ') || raw.variant || null,
      price: typeof raw.price === 'number' && raw.price > 0 ? raw.price : (parseFloat(raw.price) || null),
      currency: raw.currency || 'INR',
      imageUrl: raw.imageUrl || null,
      productUrl: directUrl,
      rating: typeof raw.rating === 'number' ? raw.rating : (parseFloat(raw.rating) || null),
      reviewCount: parseInt(raw.reviewCount || raw.reviewsCount, 10) || 0,
      seller: raw.seller || 'Flipkart',
      availability: raw.availability || 'IN_STOCK',
      priceStatus: isDirect && raw.price ? (raw.priceStatus || 'VERIFIED') : 'UNVERIFIED',
      imageStatus: raw.imageUrl ? 'VERIFIED' : 'UNAVAILABLE',
      verifiedAt: raw.verifiedAt || new Date().toISOString()
    };
  }

  /**
   * Search for products on Flipkart.
   */
  async searchProducts(query = '') {
    if (!query || !query.trim()) return [];

    try {
      const q = query.trim().toLowerCase();
      const listings = await prisma.productListing.findMany({
        where: {
          sellerName: { contains: 'Flipkart', mode: 'insensitive' },
          product: {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { brand: { contains: q, mode: 'insensitive' } },
              { category: { contains: q, mode: 'insensitive' } }
            ]
          }
        },
        include: { product: true },
        take: 10
      });

      return listings.map(l => {
        const { fsn } = this.parseUrl(l.sellerUrl);
        return this.normalizeProduct({
          fsn: fsn || l.model || null,
          title: l.product.name,
          brand: l.product.brand,
          model: l.model,
          variant: l.variant,
          price: parseFloat(l.price),
          currency: l.currency,
          imageUrl: l.product.imageUrl,
          productUrl: l.sellerUrl,
          rating: l.rating,
          reviewCount: l.reviewCount,
          seller: l.sellerName,
          availability: l.availability,
          priceStatus: l.priceStatus || 'VERIFIED',
          verifiedAt: l.priceVerifiedAt || l.lastScrapedAt
        });
      });
    } catch (err) {
      console.warn(`[FlipkartAdapter] searchProducts error: ${err.message}`);
      return [];
    }
  }

  /**
   * Get single product details by FSN or URL
   */
  async getProduct(productIdOrUrl = '') {
    const { fsn, isDirectUrl } = this.parseUrl(productIdOrUrl);
    const identifier = fsn || productIdOrUrl;

    try {
      const listing = await prisma.productListing.findFirst({
        where: {
          sellerName: { contains: 'Flipkart', mode: 'insensitive' },
          OR: [
            { sellerUrl: { contains: identifier, mode: 'insensitive' } },
            { model: { contains: identifier, mode: 'insensitive' } }
          ]
        },
        include: { product: true }
      });

      if (listing) {
        return this.normalizeProduct({
          fsn: fsn || listing.model,
          title: listing.product.name,
          brand: listing.product.brand,
          model: listing.model,
          variant: listing.variant,
          price: parseFloat(listing.price),
          currency: listing.currency,
          imageUrl: listing.product.imageUrl,
          productUrl: listing.sellerUrl,
          rating: listing.rating,
          reviewCount: listing.reviewCount,
          seller: listing.sellerName,
          availability: listing.availability,
          priceStatus: listing.priceStatus || 'VERIFIED'
        });
      }
    } catch (err) {
      console.warn(`[FlipkartAdapter] getProduct error: ${err.message}`);
    }

    return null;
  }

  async getPrice(productIdOrUrl = '') {
    const prod = await this.getProduct(productIdOrUrl);
    return prod ? prod.price : null;
  }

  async getImages(productIdOrUrl = '') {
    const prod = await this.getProduct(productIdOrUrl);
    return prod && prod.imageUrl ? [prod.imageUrl] : [];
  }

  async getRating(productIdOrUrl = '') {
    const prod = await this.getProduct(productIdOrUrl);
    return prod ? prod.rating : null;
  }

  async getReviews(productIdOrUrl = '') {
    const prod = await this.getProduct(productIdOrUrl);
    return prod ? prod.reviewCount : 0;
  }

  async getSeller(productIdOrUrl = '') {
    return 'Flipkart';
  }

  async getAvailability(productIdOrUrl = '') {
    const prod = await this.getProduct(productIdOrUrl);
    return prod ? prod.availability : 'UNKNOWN';
  }

  /**
   * Verify listing for Flipkart product URL
   */
  async verifyListing({ productName, targetUrl, storedPrice = null }) {
    const { isDirectUrl, fsn } = this.parseUrl(targetUrl);

    if (!isDirectUrl) {
      return {
        marketplace: this.marketplace,
        productId: null,
        title: productName,
        price: null,
        currency: 'INR',
        priceStatus: 'UNVERIFIED',
        imageStatus: 'UNAVAILABLE',
        productUrl: targetUrl,
        sellerName: 'Flipkart',
        verified: false,
        verifiedAt: new Date().toISOString(),
        failureReason: 'SEARCH_URL_NOT_DIRECT_PRODUCT',
        disclaimer: 'This URL is a search page containing multiple products. Only direct product links (/p/ITEM_ID) are eligible for verified pricing.'
      };
    }

    return {
      marketplace: this.marketplace,
      productId: fsn,
      title: productName,
      price: storedPrice,
      currency: 'INR',
      priceStatus: storedPrice ? 'VERIFIED' : 'UNAVAILABLE',
      imageStatus: 'VERIFIED',
      productUrl: targetUrl,
      sellerName: 'Flipkart',
      verified: Boolean(storedPrice),
      verifiedAt: new Date().toISOString(),
      failureReason: storedPrice ? null : 'PRICE_NOT_FOUND'
    };
  }
}

export default new FlipkartAdapter();
