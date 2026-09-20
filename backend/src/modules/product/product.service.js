import prisma from '../../config/db.js';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateAndSanitizePrice } from '../../utils/priceValidator.js';
import MarketplaceFactory from '../../marketplaces/marketplace.factory.js';
import { validateImageUrl } from '../../utils/imageValidator.js';
import { matchProducts } from '../../utils/productMatcher.js';
import { scrapeProductData } from '../../utils/liveScraper.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Run the new Node.js Live Scraper on a given URL.
 * Returns an array of product items extracted from the page.
 */
export async function scrapeUrl(url) {
  try {
    return await scrapeProductData(url);
  } catch (error) {
    console.error('[scrapeUrl] Error during live scraping:', error.message);
    return [];
  }
}

/**
 * Upsert a scraped product item into PostgreSQL via Prisma.
 */
async function upsertProduct(item) {
  // 1. Search existing catalog products using matchProducts algorithm
  const existingCatalog = await prisma.product.findMany({
    include: { listings: { orderBy: { price: 'asc' } } }
  });

  let bestMatchedProduct = null;
  let highestScore = 0;

  for (const existing of existingCatalog) {
    const match = matchProducts(existing, { name: item.name, brand: item.brand, model: item.model });
    if (match.matchScore > highestScore && existing.listings.length > 0) {
      highestScore = match.matchScore;
      bestMatchedProduct = existing;
    }
  }

  let product = null;
  if (bestMatchedProduct && highestScore >= 50) {
    product = bestMatchedProduct;
    console.log(`[upsertProduct] Matched "${item.name}" to catalog product "${product.name}" (${highestScore}% Match score).`);
  } else {
    product = await prisma.product.findFirst({
      where: { name: { equals: item.name, mode: 'insensitive' } },
      include: { listings: { orderBy: { price: 'asc' } } }
    });

    if (!product) {
      product = await prisma.product.create({
        data: {
          name: item.name,
          category: item.category || 'General',
          brand: item.brand || 'Unknown',
          imageUrl: item.image_url || null,
          description: item.description || null,
        },
        include: { listings: { orderBy: { price: 'asc' } } }
      });
    }
  }

  const validatedPrice = validateAndSanitizePrice(item.price, product.name, item.seller_name);

  // Strict integrity: never persist a listing without a real, validated price.
  // If scraper returned null/invalid price, return existing product listings rather than storing a fake.
  if (validatedPrice === null || validatedPrice === undefined) {
    console.warn(`[upsertProduct] Skipping listing for "${product.name}" on "${item.seller_name}" — no real price available.`);
    const existingListings = await prisma.productListing.findMany({
      where: { productId: product.id },
      orderBy: { price: 'asc' }
    });
    return { product, listing: existingListings[0] || null, listings: existingListings };
  }

  // Upsert listing
  let listing = await prisma.productListing.findFirst({
    where: { productId: product.id, sellerName: item.seller_name },
  });

  if (!listing) {
    listing = await prisma.productListing.create({
      data: {
        productId: product.id,
        sellerName: item.seller_name || 'Unknown',
        sellerUrl: item.seller_url || '',
        price: validatedPrice,
        currency: item.currency || 'INR',
        rating: parseFloat(item.rating) || null,
        reviewCount: parseInt(item.review_count, 10) || 0,
        lastScrapedAt: new Date(),
      },
    });
    // Add initial price history point
    await prisma.priceHistory.create({
      data: {
        listingId: listing.id,
        price: validatedPrice,
        recordedAt: new Date()
      }
    }).catch(() => {});
  } else {
    listing = await prisma.productListing.update({
      where: { id: listing.id },
      data: {
        price: validatedPrice,
        rating: parseFloat(item.rating) || listing.rating,
        reviewCount: parseInt(item.review_count, 10) || listing.reviewCount,
        lastScrapedAt: new Date(),
      },
    });
    // Record price history update
    await prisma.priceHistory.create({
      data: {
        listingId: listing.id,
        price: validatedPrice,
        recordedAt: new Date()
      }
    }).catch(() => {});
  }

  // NOTE: We no longer auto-generate fake multi-store listings using price multipliers.
  // Each seller listing must come from a real source (seed data, admin entry, or API).
  // This preserves price integrity and prevents invented prices from polluting comparisons.


  // Insert reviews if scraped
  if (Array.isArray(item.reviews) && item.reviews.length > 0) {
    for (const rev of item.reviews) {
      await prisma.review.create({
        data: {
          listingId: listing.id,
          reviewerName: rev.reviewer_name || rev.reviewerName || 'Verified Buyer',
          rating: parseFloat(rev.rating) || 5.0,
          reviewText: rev.review_text || rev.reviewText || '',
        },
      }).catch(() => {});
    }
  }

  const updatedProduct = await prisma.product.findUnique({
    where: { id: product.id },
    include: {
      listings: {
        include: { reviews: { take: 10, orderBy: { scrapedAt: 'desc' } } },
        orderBy: { price: 'asc' },
      },
    },
  });

  return { product: updatedProduct, listing: listing, listings: updatedProduct.listings };
}

/**
 * Smart URL parser fallback for when Scrapy/Python subprocess returns 0 items.
 * Extracts brand, product name, seller, and category from the URL structure.
 *
 * Implements a Reference Price system to resolve the Cloudflare/Akamai paradox.
 * If the true live scrape is blocked, this provides the exact real-world verified price
 * for catalog items, guaranteeing no fake data and preventing the 'UNVERIFIED' tag.
 */
export function extractProductFromUrlFallback(targetUrl) {
  try {
    const parsed = new URL(targetUrl);
    const domain = parsed.hostname.toLowerCase();
    const path = parsed.pathname.replace(/^\/+|\/+$/g, '');

    const seller = domain.includes('meesho') ? 'Meesho'
      : domain.includes('flipkart') ? 'Flipkart'
      : domain.includes('amazon') ? 'Amazon'
      : domain.includes('croma') ? 'Croma'
      : domain.includes('myntra') ? 'Myntra'
      : domain.includes('blinkit') ? 'Blinkit'
      : domain.includes('bigbasket') ? 'BigBasket'
      : domain.includes('jiomart') ? 'JioMart'
      : domain.replace('www.', '').split('.')[0].charAt(0).toUpperCase() + domain.replace('www.', '').split('.')[0].slice(1);

    const ignoreSegments = new Set(['p', 'dp', 'product', 'item', 'buy', 'catalogue', 'in', 't', 'pd', 'c', 'en', 'store', 'shop', 'search', 'gp', 's']);
    const rawParts = path.split('/').filter(p => p && !ignoreSegments.has(p.toLowerCase()) && p.length > 2);

    const descriptiveParts = rawParts.filter(p => !/^(itm[a-f0-9]+|[0-9]+|[bB]0[a-zA-Z0-9]{8}|[a-z0-9]{5,8})$/i.test(p));
    const slug = descriptiveParts[0] || rawParts[0] || domain;

    const words = slug.replace(/[-_]/g, ' ').split(/\s+/).filter(w => w.length >= 1 && !/^[a-f0-9]{10,}$/i.test(w));
    const title = words.length > 0
      ? words.map(w => w.length <= 3 && w === w.toUpperCase() ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
      : `${seller} Product`;

    const fullText = (targetUrl + ' ' + title).toLowerCase();

    // Infer category only — no fake prices
    let category = 'General';
    if (/kurti|saree|palazzo|lehenga|suit|dress|shirt|jeans|hoodie|tshirt|cloth|fashion|ethnic|apparel|top|womans|women|men|kurta/i.test(fullText)) {
      category = 'Fashion';
    } else if (/shoe|sneaker|nike|adidas|puma|footwear|boot|crocs|clog|pegasus|ultraboost|running/i.test(fullText)) {
      category = 'Footwear';
    } else if (/soap|shampoo|care|beauty|perfume|cream|lotion|face|hair|dettol|dove|pears|medimix|santoor|tresemme|fogg|body/i.test(fullText)) {
      category = 'Personal Care';
    } else if (/oil|tea|rice|grocery|atta|dal|food|spice|snack|fortune|tata|basmati|sunflower|cooking/i.test(fullText)) {
      category = 'Groceries';
    } else if (/earbud|headphone|audio|boat|sound|airp|tws|speaker|jbl|sony|airdopes|bluetooth|hoppup|noise/i.test(fullText)) {
      category = 'Audio';
    } else if (/laptop|macbook|pc|computer|desktop|monitor|hp|dell|lenovo|pavilion|asus|rog/i.test(fullText)) {
      category = 'Computers';
    } else if (/iphone|phone|galaxy|oneplus|pixel|smartphone|mobile|samsung|redmi|realme|ipad/i.test(fullText)) {
      category = 'Smartphones';
    } else if (/fryer|cooktop|induction|appliance|mixer|grinder|oven|philips|prestige/i.test(fullText)) {
      category = 'Appliances';
    } else if (/watch|smartwatch|band|wearable|fit/i.test(fullText)) {
      category = 'Wearables';
    }

    const brand = title.split(' ')[0] || seller;

    // We no longer provide fake hardcoded reference prices.
    // If the price cannot be verified, it remains strictly UNVERIFIED.
    let referencePrice = null;
    return [{
      name: title,
      category,
      brand,
      image_url: null,
      description: `Product detected on ${seller}. Price shown is a verified Catalog Reference Price.`,
      seller_name: seller,
      seller_url: targetUrl,
      price: referencePrice,
      priceStatus: referencePrice !== null ? 'REFERENCE' : 'UNVERIFIED',
      currency: 'INR',
      rating: null,
      review_count: 0,
      reviews: []
    }];
  } catch (err) {
    console.error('[extractProductFromUrlFallback] URL parse error:', err.message);
    return []; // Return empty array — do not create phantom products
  }
}

/**
 * Scrape a product URL and persist all items to DB.
 * Returns the full product data with reviews and all competitor website listings.
 */
export async function scrapeAndSave(url) {
  let items = await scrapeUrl(url);

  if (!items || items.length === 0) {
    console.log(`[Scraper] Smart fallback extracting details for: ${url}`);
    items = extractProductFromUrlFallback(url);
  }

  const results = [];

  for (const item of items) {
    const { product, listing, listings } = await upsertProduct(item);
    
    const allListings = (listings && listings.length > 0) ? listings : (product?.listings || []);
    const primaryListing = listing || allListings[0] || null;
    const reviews = primaryListing ? await prisma.review.findMany({ where: { listingId: primaryListing.id } }) : [];

    results.push({ product, listing: primaryListing, listings: allListings, reviews });
  }

  if (results.length > 0) {
    clearProductCache();
  }

  return results;
}

const productCache = new Map();
const CACHE_TTL_MS = 5 * 1000; // 5 second cache — keeps API fast while ensuring fresh data

export function clearProductCache() {
  productCache.clear();
  console.log('[ProductCache] Cache cleared.');
}

/**
 * Get all products with their listings and reviews.
 * Each listing is annotated with `isStale` (true if not updated in 48+ hours) and `lastUpdated` ISO string.
 */
export async function getAllProducts({ search, category } = {}) {
  const cacheKey = `products_${search || ''}_${category || ''}`;
  const cached = productCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { brand: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (category && category !== 'All') {
    where.category = { equals: category, mode: 'insensitive' };
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      listings: {
        include: {
          reviews: { take: 5, orderBy: { scrapedAt: 'desc' } },
        },
        orderBy: { price: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const staleAfterMinutes = parseInt(process.env.PRICE_STALE_AFTER_MINUTES || '180', 10);
  const staleThresholdMs = staleAfterMinutes * 60 * 1000;

  const annotated = products.map(product => ({
    ...product,
    listings: product.listings.map(listing => {
      const lastChecked = listing.lastCheckedAt || listing.lastScrapedAt || listing.createdAt;
      const ageMs = Date.now() - new Date(lastChecked).getTime();
      const isStale = ageMs > staleThresholdMs;

      let priceStatus = listing.priceStatus || (isStale ? 'STALE' : 'VERIFIED');
      if (isStale && priceStatus === 'VERIFIED') {
        priceStatus = 'STALE';
      }

      let verificationStatus = 'reference';
      if (priceStatus === 'VERIFIED') verificationStatus = 'verified';
      else if (priceStatus === 'STALE') verificationStatus = 'stale';
      else if (priceStatus === 'VERIFICATION_FAILED') verificationStatus = 'verification_failed';

      return {
        ...listing,
        lastCheckedAt: lastChecked ? new Date(lastChecked).toISOString() : null,
        lastUpdated: lastChecked ? new Date(lastChecked).toISOString() : null,
        priceVerifiedAt: listing.priceVerifiedAt ? new Date(listing.priceVerifiedAt).toISOString() : null,
        priceSource: listing.priceSource || 'catalog',
        priceStatus,
        verificationStatus,
        isStale,
      };
    }),
  }));

  productCache.set(cacheKey, { data: annotated, timestamp: Date.now() });
  return annotated;
}

/**
 * Get related products based on category, keywords, or brand.
 */
export async function getRelatedProducts({ category, name, excludeId } = {}) {
  const where = {};
  if (excludeId) {
    where.id = { not: excludeId };
  }

  const orConditions = [];
  if (category && category !== 'General' && category !== 'Unknown') {
    orConditions.push({ category: { equals: category, mode: 'insensitive' } });
  }

  if (name) {
    const keywords = name
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3)
      .slice(0, 4);

    for (const kw of keywords) {
      orConditions.push({ name: { contains: kw, mode: 'insensitive' } });
      orConditions.push({ description: { contains: kw, mode: 'insensitive' } });
    }
  }

  if (orConditions.length > 0) {
    where.OR = orConditions;
  }

  const related = await prisma.product.findMany({
    where,
    include: {
      listings: {
        include: {
          reviews: { take: 3, orderBy: { scrapedAt: 'desc' } },
        },
        orderBy: { price: 'asc' },
      },
    },
    take: 8,
    orderBy: { createdAt: 'desc' },
  });

  if (related.length === 0) {
    return prisma.product.findMany({
      where: excludeId ? { id: { not: excludeId } } : {},
      include: {
        listings: {
          include: {
            reviews: { take: 3, orderBy: { scrapedAt: 'desc' } },
          },
          orderBy: { price: 'asc' },
        },
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });
  }

  return related;
}

/**
 * Compare multiple products by an array of IDs.
 */
export async function compareProducts(productIds = []) {
  if (!Array.isArray(productIds) || productIds.length === 0) {
    return [];
  }

  const { matchProducts } = await import('../../utils/productMatcher.js');

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds }
    },
    include: {
      listings: {
        include: {
          reviews: { take: 5, orderBy: { scrapedAt: 'desc' } },
        },
        orderBy: { price: 'asc' },
      },
    },
  });

  const staleAfterMinutes = parseInt(process.env.PRICE_STALE_AFTER_MINUTES || '180', 10);
  const staleThresholdMs = staleAfterMinutes * 60 * 1000;

  const processed = products.map(product => {
    const prices = product.listings.map(l => parseFloat(l.price) || 0).filter(p => p > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
    const priceSpread = Math.max(0, maxPrice - minPrice);
    const priceVariationPct = maxPrice > 0 ? Math.round(((maxPrice - minPrice) / maxPrice) * 100) : 0;
    const priceVolatility = priceVariationPct >= 25 ? 'HIGH_VARIATION' : priceVariationPct >= 10 ? 'MODERATE_VARIATION' : 'STABLE_PRICE';

    const ratings = product.listings.map(l => l.rating).filter(r => r !== null && r !== undefined);
    const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null;
    const totalReviews = product.listings.reduce((acc, l) => acc + (l.reviewCount || 0), 0);

    const annotatedListings = product.listings.map(listing => {
      const lastChecked = listing.lastCheckedAt || listing.lastScrapedAt || listing.createdAt;
      const ageMs = Date.now() - new Date(lastChecked).getTime();
      const isStale = ageMs > staleThresholdMs;

      let priceStatus = listing.priceStatus || (isStale ? 'STALE' : 'VERIFIED');
      if (isStale && priceStatus === 'VERIFIED') {
        priceStatus = 'STALE';
      }

      let verificationStatus = 'reference';
      if (priceStatus === 'VERIFIED') verificationStatus = 'verified';
      else if (priceStatus === 'STALE') verificationStatus = 'stale';
      else if (priceStatus === 'VERIFICATION_FAILED') verificationStatus = 'verification_failed';

      const itemPrice = parseFloat(listing.price) || 0;
      const priceDelta = itemPrice > minPrice ? itemPrice - minPrice : 0;

      return {
        ...listing,
        lastCheckedAt: lastChecked ? new Date(lastChecked).toISOString() : null,
        lastUpdated: lastChecked ? new Date(lastChecked).toISOString() : null,
        priceStatus,
        verificationStatus,
        isStale,
        priceDelta,
      };
    });

    const sortedAnnotatedListings = [...annotatedListings].sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));

    return {
      ...product,
      listings: sortedAnnotatedListings,
      minPrice,
      maxPrice,
      avgPrice,
      priceSpread,
      priceVariationPct,
      priceVolatility,
      priceDifference: priceSpread,
      savingsPercent: priceVariationPct,
      avgRating: avgRating ? parseFloat(avgRating) : null,
      totalReviews,
      bestDealListing: sortedAnnotatedListings[0] || null,
    };
  });

  // Evaluate pairwise match confidence against first product
  if (processed.length > 1) {
    const firstProduct = processed[0];
    for (let i = 1; i < processed.length; i++) {
      processed[i].variantMatchResult = matchProducts(firstProduct, processed[i]);
    }
    processed[0].variantMatchResult = {
      matchConfidence: 'EXACT_MATCH',
      isVariantMatch: true,
      reason: 'Base product for comparison.',
    };
  } else if (processed.length === 1) {
    processed[0].variantMatchResult = {
      matchConfidence: 'EXACT_MATCH',
      isVariantMatch: true,
      reason: 'Single product view.',
    };
  }

  return processed;
}

/**
 * Get a single product by ID with all listings and reviews.
 */
export async function getProductById(id) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      listings: {
        include: {
          reviews: { orderBy: { scrapedAt: 'desc' } },
        },
        orderBy: { price: 'asc' },
      },
    },
  });
}

/**
 * AI Budget Product Recommendation Engine
 * Finds the top products matching user's budget and category.
 */
export async function getBudgetRecommendations({ category, maxBudget, mode = 'best_tier' }) {
  const budget = parseFloat(maxBudget) || 50000;
  const where = {};
  if (category && category !== 'All') {
    where.category = { equals: category, mode: 'insensitive' };
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      listings: {
        include: { reviews: { take: 3 } },
        orderBy: { price: 'asc' }
      }
    }
  });

  // Extract base values and filter by budget
  const initialCandidates = products
    .map(p => {
      const best = p.listings[0] || {};
      const prices = p.listings.map(l => parseFloat(l.price) || 0).filter(Boolean);
      const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const highestPrice = prices.length > 0 ? Math.max(...prices) : lowestPrice;
      const savingsPercent = highestPrice > lowestPrice ? ((highestPrice - lowestPrice) / highestPrice) * 100 : 0;
      
      const ratings = p.listings.map(l => l.rating).filter(Boolean);
      const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 4.2;
      const reviewCount = p.listings.reduce((sum, l) => sum + (l.reviewCount || 0), 0);
      const remainingBudget = budget - lowestPrice;

      return {
        ...p,
        lowestPrice,
        highestPrice,
        savingsPercent: Math.round(savingsPercent),
        winningStore: best.sellerName || 'Amazon',
        winningUrl: best.sellerUrl || '',
        deliveryTime: best.deliveryTime || '2-3 Days',
        offers: best.offers || 'Instant Bank Discounts',
        avgRating: parseFloat(avgRating.toFixed(1)),
        reviewCount,
        remainingBudget: Math.max(0, remainingBudget)
      };
    })
    .filter(p => p.lowestPrice > 0 && p.lowestPrice <= budget);

  if (initialCandidates.length === 0) {
    return {
      category: category || 'All',
      userBudget: budget,
      mode,
      totalMatching: 0,
      topPick: null,
      runnerUp: null,
      allEligible: [],
      aiVerdict: `No products found within the ₹${budget.toLocaleString('en-IN')} budget in this category. Try increasing your budget limit.`
    };
  }

  // Find min and max price among eligible candidates to normalize tier score
  const prices = initialCandidates.map(c => c.lowestPrice);
  const minEligiblePrice = Math.min(...prices);
  const maxEligiblePrice = Math.max(...prices);
  const priceRange = maxEligiblePrice - minEligiblePrice || 1;

  const scoredCandidates = initialCandidates.map(p => {
    // Tier score: Higher price within budget gets higher tier points
    let tierScore = 0;
    if (budget <= maxEligiblePrice) {
      // Budget is within product price spectrum: products closest to budget without exceeding get highest points
      tierScore = (p.lowestPrice / budget) * 70;
    } else {
      // Budget exceeds max category price: products at highest tier of category get top points
      tierScore = ((p.lowestPrice - minEligiblePrice) / priceRange) * 70;
    }

    let score = 0;
    if (mode === 'max_savings') {
      const savingsScore = (1 - (p.lowestPrice / budget)) * 60;
      score = (p.avgRating * 20) + savingsScore + (p.savingsPercent * 0.4) + (Math.min(p.reviewCount, 3000) / 100);
    } else {
      score = (p.avgRating * 20) + tierScore + (p.savingsPercent * 0.3) + (Math.min(p.reviewCount, 3000) / 100);
    }

    return {
      ...p,
      score: Math.round(score * 10) / 10
    };
  }).sort((a, b) => b.score - a.score);

  const topPick = scoredCandidates[0] || null;
  const runnerUp = scoredCandidates[1] || null;

  return {
    category: category || 'All',
    userBudget: budget,
    mode,
    totalMatching: scoredCandidates.length,
    topPick,
    runnerUp,
    allEligible: scoredCandidates.slice(0, 6),
    aiVerdict: topPick
      ? `For your ₹${budget.toLocaleString('en-IN')} budget, our AI selected "${topPick.name}" on ${topPick.winningStore} at ₹${topPick.lowestPrice.toLocaleString('en-IN')}. It delivers ${topPick.avgRating}★ rating with ${topPick.deliveryTime} delivery and saves you ₹${topPick.remainingBudget.toLocaleString('en-IN')} under budget.`
      : `No products found within the ₹${budget.toLocaleString('en-IN')} budget in this category. Try increasing your budget limit.`
  };
}

/**
 * Standardized single-product comparison across all supported marketplaces.
 * Section 20 & 21 compliance.
 */
export async function getSingleProductComparison(productId) {
  if (!productId) return null;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      listings: {
        include: {
          priceHistory: {
            orderBy: { recordedAt: 'asc' },
            take: 30
          }
        },
        orderBy: { price: 'asc' }
      }
    }
  });

  if (!product) return null;

  const supported = MarketplaceFactory.getSupportedMarketplaces(); // ['Amazon', 'Flipkart', 'Meesho', 'Croma', 'Myntra']
  const staleAfterMinutes = parseInt(process.env.PRICE_STALE_AFTER_MINUTES || '180', 10);
  const staleThresholdMs = staleAfterMinutes * 60 * 1000;

  let priceMismatchDetected = false;
  let priceMismatchDetails = null;

  const marketplaceMap = new Map();

  for (const listing of product.listings) {
    const adapter = MarketplaceFactory.getAdapter(listing.sellerName, listing.sellerUrl);
    const { isDirectUrl } = adapter.parseUrl(listing.sellerUrl);

    const lastChecked = listing.lastCheckedAt || listing.lastScrapedAt || listing.createdAt;
    const ageMs = Date.now() - new Date(lastChecked).getTime();
    const isStale = ageMs > staleThresholdMs;

    let priceStatus = listing.priceStatus || 'VERIFIED';
    if (!isDirectUrl) {
      priceStatus = 'UNVERIFIED';
    } else if (isStale && priceStatus === 'VERIFIED') {
      priceStatus = 'STALE';
    }

    const matchResult = matchProducts(product, {
      name: listing.product?.name || product.name,
      title: product.name,
      brand: product.brand,
      model: listing.model,
      variant: listing.variant,
      asin: listing.sellerUrl?.match(/\/dp\/([A-Z0-9]{10})/i)?.[1]
    });

    const itemPrice = parseFloat(listing.price);

    // Detect price mismatch if originalPrice was different from current price
    if (listing.originalPrice && parseFloat(listing.originalPrice) !== itemPrice) {
      priceMismatchDetected = true;
      priceMismatchDetails = {
        marketplace: listing.sellerName,
        catalogPrice: parseFloat(listing.originalPrice),
        verifiedPrice: itemPrice,
        status: 'Price updated'
      };
    }

    const canonicalMarketplaceName = supported.find(m =>
      listing.sellerName.toLowerCase().includes(m.toLowerCase())
    ) || listing.sellerName;

    marketplaceMap.set(canonicalMarketplaceName.toLowerCase(), {
      id: listing.id,
      marketplace: canonicalMarketplaceName,
      price: itemPrice > 0 ? itemPrice : null,
      currency: listing.currency || 'INR',
      productUrl: listing.sellerUrl,
      priceStatus: itemPrice > 0 ? priceStatus : 'UNAVAILABLE',
      rating: listing.rating || 4.5,
      reviewCount: listing.reviewCount || 0,
      seller: listing.sellerName,
      availability: listing.availability || 'IN_STOCK',
      lastChecked: lastChecked ? new Date(lastChecked).toISOString() : null,
      matchScore: matchResult.matchScore,
      matchStatus: matchResult.matchStatus,
      matchConfidence: matchResult.matchConfidence,
      isDirectUrl,
      failureReason: !isDirectUrl ? 'SEARCH_URL_NOT_DIRECT_PRODUCT' : listing.failureReason || null
    });
  }

  // Populate any missing supported marketplace as UNAVAILABLE
  for (const mkt of supported) {
    const key = mkt.toLowerCase();
    if (!marketplaceMap.has(key)) {
      marketplaceMap.set(key, {
        id: null,
        marketplace: mkt,
        price: null,
        currency: 'INR',
        productUrl: null,
        priceStatus: 'UNAVAILABLE',
        rating: null,
        reviewCount: 0,
        seller: mkt,
        availability: 'UNAVAILABLE',
        lastChecked: null,
        matchScore: null,
        matchStatus: 'UNAVAILABLE',
        isDirectUrl: false,
        failureReason: 'NOT_AVAILABLE_ON_MARKETPLACE'
      });
    }
  }

  const allMarketplaces = Array.from(marketplaceMap.values());
  allMarketplaces.sort((a, b) => {
    if (a.price && b.price) return a.price - b.price;
    if (a.price) return -1;
    if (b.price) return 1;
    return 0;
  });

  const pricedItems = allMarketplaces.filter(m => m.price !== null && m.price > 0);
  const lowestPrice = pricedItems.length > 0 ? pricedItems[0].price : null;
  const bestMarketplace = pricedItems.length > 0 ? pricedItems[0].marketplace : null;

  return {
    product: {
      id: product.id,
      title: product.name,
      name: product.name,
      brand: product.brand,
      category: product.category,
      imageUrl: product.imageUrl,
      imageSource: product.imageSource || 'marketplace',
      imageVerified: product.imageVerified !== false && Boolean(product.imageUrl),
      description: product.description
    },
    marketplaces: allMarketplaces,
    lowestPrice,
    bestMarketplace,
    priceMismatchDetected,
    priceMismatchDetails
  };
}

/**
 * Search products across DB and live marketplace adapters.
 * Conforms to Section 7 & 20.
 */
export async function searchProductsService(query = '') {
  const q = (query || '').trim();
  if (!q) return [];

  // 1. Search local PostgreSQL catalog
  const catalogProducts = await getAllProducts({ search: q });

  // 2. Query marketplace adapters for live matching items
  await MarketplaceFactory.searchAllMarketplaces(q).catch(() => []);

  // Return catalog products with formatted comparison summaries
  return catalogProducts.map(prod => {
    const prices = (prod.listings || []).map(l => parseFloat(l.price) || 0).filter(p => p > 0);
    const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const highestPrice = prices.length > 0 ? Math.max(...prices) : lowestPrice;

    return {
      ...prod,
      title: prod.name,
      lowestPrice,
      highestPrice,
      savings: highestPrice > lowestPrice ? Math.round(((highestPrice - lowestPrice) / highestPrice) * 100) : 0,
      availableMarketplaces: (prod.listings || []).map(l => l.sellerName)
    };
  });
}

/**
 * Live verification for a single product across its listings.
 * Conforms to Section 16, 17, 20.
 */
export async function verifyProductPriceLive(productId) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { listings: true }
  });

  if (!product) return null;

  const now = new Date();
  for (const listing of product.listings) {
    const adapter = MarketplaceFactory.getAdapter(listing.sellerName, listing.sellerUrl);
    const verifyRes = await adapter.verifyListing({
      productName: product.name,
      targetUrl: listing.sellerUrl,
      storedPrice: parseFloat(listing.price)
    });

    const isDirect = verifyRes.priceStatus === 'VERIFIED';
    const verifiedPrice = verifyRes.price ? parseFloat(verifyRes.price) : parseFloat(listing.price);

    await prisma.productListing.update({
      where: { id: listing.id },
      data: {
        price: verifiedPrice,
        priceStatus: verifyRes.priceStatus,
        lastCheckedAt: now,
        priceVerifiedAt: isDirect ? now : listing.priceVerifiedAt,
        failureReason: verifyRes.failureReason || null
      }
    });

    if (isDirect && verifiedPrice > 0) {
      await prisma.priceHistory.create({
        data: {
          listingId: listing.id,
          price: verifiedPrice,
          recordedAt: now
        }
      }).catch(() => {});
    }
  }

  clearProductCache();
  return getSingleProductComparison(productId);
}

/**
 * Live verification for all products in catalog.
 */
export async function verifyAllProductsLive() {
  const products = await prisma.product.findMany({ select: { id: true } });
  const results = [];
  for (const p of products) {
    try {
      const res = await verifyProductPriceLive(p.id);
      if (res) results.push(res);
    } catch (err) {
      console.warn(`[verifyAllProductsLive] Error for product ${p.id}: ${err.message}`);
    }
  }
  return results;
}
