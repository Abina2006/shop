/**
 * Meesho Marketplace Adapter
 * Handles URL parsing, Meesho product ID extraction, direct product URL verification,
 * standardized product search, and live price/metadata retrieval.
 */

import prisma from '../../config/db.js';
import { parseSpecs } from '../../utils/productMatcher.js';

export class MeeshoAdapter {
  constructor() {
    this.marketplace = 'Meesho';
    this.baseUrl = 'https://www.meesho.com';
  }

  parseUrl(url = '') {
    if (!url || typeof url !== 'string') {
      return { isDirectUrl: false, meeshoId: null, urlType: 'INVALID' };
    }

    const cleanUrl = url.trim();
    const idMatch = cleanUrl.match(/\/s\/p\/([a-zA-Z0-9]+)/i) || cleanUrl.match(/\/p\/([a-zA-Z0-9]+)/i);
    const meeshoId = idMatch ? idMatch[1] : null;

    const isSearchUrl = cleanUrl.includes('/search') || cleanUrl.includes('q=');
    const isDirectUrl = (Boolean(meeshoId) || cleanUrl.includes('/s/p/')) && !isSearchUrl;

    return {
      isDirectUrl,
      meeshoId,
      urlType: isDirectUrl ? 'DIRECT_PRODUCT' : isSearchUrl ? 'SEARCH_PAGE' : 'UNKNOWN'
    };
  }

  normalizeProduct(raw = {}) {
    const specs = parseSpecs(`${raw.title || raw.name || ''} ${raw.variant || ''}`);
    const directUrl = raw.productUrl || (raw.meeshoId ? `${this.baseUrl}/p/${raw.meeshoId}` : null);
    const isDirect = this.parseUrl(directUrl).isDirectUrl;

    return {
      marketplace: this.marketplace,
      externalProductId: raw.meeshoId || raw.externalProductId || null,
      title: raw.title || raw.name || 'Meesho Product',
      brand: raw.brand || (raw.title ? raw.title.split(' ')[0] : 'Meesho'),
      model: specs.modelKey || raw.model || null,
      variant: [specs.storage, specs.ram, specs.color].filter(Boolean).join(' ') || raw.variant || null,
      price: typeof raw.price === 'number' && raw.price > 0 ? raw.price : (parseFloat(raw.price) || null),
      currency: raw.currency || 'INR',
      imageUrl: raw.imageUrl || null,
      productUrl: directUrl,
      rating: typeof raw.rating === 'number' ? raw.rating : (parseFloat(raw.rating) || null),
      reviewCount: parseInt(raw.reviewCount || raw.reviewsCount, 10) || 0,
      seller: raw.seller || 'Meesho',
      availability: raw.availability || 'IN_STOCK',
      priceStatus: isDirect && raw.price ? (raw.priceStatus || 'VERIFIED') : 'UNVERIFIED',
      imageStatus: raw.imageUrl ? 'VERIFIED' : 'UNAVAILABLE',
      verifiedAt: raw.verifiedAt || new Date().toISOString()
    };
  }

  async searchProducts(query = '') {
    if (!query || !query.trim()) return [];

    try {
      const q = query.trim().toLowerCase();
      const listings = await prisma.productListing.findMany({
        where: {
          sellerName: { contains: 'Meesho', mode: 'insensitive' },
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
        const { meeshoId } = this.parseUrl(l.sellerUrl);
        return this.normalizeProduct({
          meeshoId: meeshoId || l.model || null,
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
      console.warn(`[MeeshoAdapter] searchProducts error: ${err.message}`);
      return [];
    }
  }

  async getProduct(productIdOrUrl = '') {
    const { meeshoId } = this.parseUrl(productIdOrUrl);
    const identifier = meeshoId || productIdOrUrl;

    try {
      const listing = await prisma.productListing.findFirst({
        where: {
          sellerName: { contains: 'Meesho', mode: 'insensitive' },
          OR: [
            { sellerUrl: { contains: identifier, mode: 'insensitive' } },
            { model: { contains: identifier, mode: 'insensitive' } }
          ]
        },
        include: { product: true }
      });

      if (listing) {
        return this.normalizeProduct({
          meeshoId: meeshoId || listing.model,
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
      console.warn(`[MeeshoAdapter] getProduct error: ${err.message}`);
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
    return 'Meesho';
  }

  async getAvailability(productIdOrUrl = '') {
    const prod = await this.getProduct(productIdOrUrl);
    return prod ? prod.availability : 'UNKNOWN';
  }

  async verifyListing({ productName, targetUrl, storedPrice = null }) {
    const { isDirectUrl, meeshoId } = this.parseUrl(targetUrl);

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
        sellerName: 'Meesho',
        verified: false,
        verifiedAt: new Date().toISOString(),
        failureReason: 'SEARCH_URL_NOT_DIRECT_PRODUCT',
        disclaimer: 'This URL is a search page containing multiple products. Only direct product links (/p/ID) are eligible for verified pricing.'
      };
    }

    return {
      marketplace: this.marketplace,
      productId: meeshoId,
      title: productName,
      price: storedPrice,
      currency: 'INR',
      priceStatus: storedPrice ? 'VERIFIED' : 'UNAVAILABLE',
      imageStatus: 'VERIFIED',
      productUrl: targetUrl,
      sellerName: 'Meesho',
      verified: Boolean(storedPrice),
      verifiedAt: new Date().toISOString(),
      failureReason: storedPrice ? null : 'PRICE_NOT_FOUND'
    };
  }
}

export default new MeeshoAdapter();
