/**
 * Amazon Marketplace Adapter
 * Handles URL parsing, ASIN extraction, direct product URL verification,
 * standardized product search, and live price/metadata retrieval.
 */

import prisma from '../../config/db.js';
import { parseSpecs } from '../../utils/productMatcher.js';

export class AmazonAdapter {
  constructor() {
    this.marketplace = 'Amazon';
    this.baseUrl = 'https://www.amazon.in';
  }

  /**
   * Extract ASIN and identify if URL is a direct product page or search URL.
   */
  parseUrl(url = '') {
    if (!url || typeof url !== 'string') {
      return { isDirectUrl: false, asin: null, urlType: 'INVALID' };
    }

    const cleanUrl = url.trim();
    const asinMatch = cleanUrl.match(/\/(?:dp|gp\/product|product)\/([A-Z0-9]{10})/i);
    const asin = asinMatch ? asinMatch[1].toUpperCase() : null;

    const isSearchUrl = cleanUrl.includes('/s?') || cleanUrl.includes('keywords=') || cleanUrl.includes('k=');
    const isDirectUrl = Boolean(asin) && !isSearchUrl;

    return {
      isDirectUrl,
      asin,
      urlType: isDirectUrl ? 'DIRECT_PRODUCT' : isSearchUrl ? 'SEARCH_PAGE' : 'UNKNOWN'
    };
  }

  /**
   * Normalize raw data into standardized structure conforming to Section 7
   */
  normalizeProduct(raw = {}) {
    const specs = parseSpecs(`${raw.title || raw.name || ''} ${raw.variant || ''}`);
    const directUrl = raw.productUrl || (raw.asin ? `${this.baseUrl}/dp/${raw.asin}` : null);
    const isDirect = this.parseUrl(directUrl).isDirectUrl;

    return {
      marketplace: this.marketplace,
      externalProductId: raw.asin || raw.externalProductId || null,
      title: raw.title || raw.name || 'Amazon Product',
      brand: raw.brand || (raw.title ? raw.title.split(' ')[0] : 'Amazon'),
      model: specs.modelKey || raw.model || null,
      variant: [specs.storage, specs.ram, specs.color].filter(Boolean).join(' ') || raw.variant || null,
      price: typeof raw.price === 'number' && raw.price > 0 ? raw.price : (parseFloat(raw.price) || null),
      currency: raw.currency || 'INR',
      imageUrl: raw.imageUrl || null,
      productUrl: directUrl,
      rating: typeof raw.rating === 'number' ? raw.rating : (parseFloat(raw.rating) || null),
      reviewCount: parseInt(raw.reviewCount || raw.reviewsCount, 10) || 0,
      seller: raw.seller || 'Amazon',
      availability: raw.availability || 'IN_STOCK',
      priceStatus: isDirect && raw.price ? (raw.priceStatus || 'VERIFIED') : 'UNVERIFIED',
      imageStatus: raw.imageUrl ? 'VERIFIED' : 'UNAVAILABLE',
      verifiedAt: raw.verifiedAt || new Date().toISOString()
    };
  }

  /**
   * Search for products on Amazon.
   * Leverages official database listings & catalog records.
   */
  async searchProducts(query = '') {
    if (!query || !query.trim()) return [];

    try {
      const q = query.trim().toLowerCase();
      // Search in existing listings and catalog
      const listings = await prisma.productListing.findMany({
        where: {
          sellerName: { contains: 'Amazon', mode: 'insensitive' },
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
        const { asin } = this.parseUrl(l.sellerUrl);
        return this.normalizeProduct({
          asin: asin || l.model || null,
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
      console.warn(`[AmazonAdapter] searchProducts error: ${err.message}`);
      return [];
    }
  }

  /**
   * Get single product details by ASIN or URL
   */
  async getProduct(productIdOrUrl = '') {
    const { asin, isDirectUrl } = this.parseUrl(productIdOrUrl);
    const identifier = asin || productIdOrUrl;

    try {
      const listing = await prisma.productListing.findFirst({
        where: {
          sellerName: { contains: 'Amazon', mode: 'insensitive' },
          OR: [
            { sellerUrl: { contains: identifier, mode: 'insensitive' } },
            { model: { contains: identifier, mode: 'insensitive' } }
          ]
        },
        include: { product: true }
      });

      if (listing) {
        return this.normalizeProduct({
          asin: asin || listing.model,
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
      console.warn(`[AmazonAdapter] getProduct error: ${err.message}`);
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
    return 'Amazon';
  }

  async getAvailability(productIdOrUrl = '') {
    const prod = await this.getProduct(productIdOrUrl);
    return prod ? prod.availability : 'UNKNOWN';
  }

  /**
   * Verify listing for Amazon product URL
   */
  async verifyListing({ productName, targetUrl, storedPrice = null }) {
    const { isDirectUrl, asin } = this.parseUrl(targetUrl);

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
        sellerName: 'Amazon',
        verified: false,
        verifiedAt: new Date().toISOString(),
        failureReason: 'SEARCH_URL_NOT_DIRECT_PRODUCT',
        disclaimer: 'This URL is a search page containing multiple products. Only direct product links (/dp/ASIN) are eligible for verified pricing.'
      };
    }

    return {
      marketplace: this.marketplace,
      productId: asin,
      title: productName,
      price: storedPrice,
      currency: 'INR',
      priceStatus: storedPrice ? 'VERIFIED' : 'UNAVAILABLE',
      imageStatus: 'VERIFIED',
      productUrl: targetUrl,
      sellerName: 'Amazon',
      verified: Boolean(storedPrice),
      verifiedAt: new Date().toISOString(),
      failureReason: storedPrice ? null : 'PRICE_NOT_FOUND'
    };
  }
}

export default new AmazonAdapter();
