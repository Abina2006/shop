import prisma from '../../config/db.js';
import { sendPriceDropEmail } from '../../services/emailAlert.service.js';


/**
 * GET /api/price-alerts
 * Query: ?userId=... or ?email=...
 */
export async function getPriceAlerts(req, res) {
  try {
    const { userId, email } = req.query;

    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }
    if (!user && email) {
      user = await prisma.user.findUnique({ where: { email } });
    }
    if (!user) {
      user = await prisma.user.findFirst();
    }

    if (!user) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const alerts = await prisma.priceAlert.findMany({
      where: { userId: user.id },
      include: {
        listing: {
          include: {
            product: {
              include: {
                listings: { orderBy: { price: 'asc' } }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = alerts.map(alert => {
      const product = alert.listing?.product || {};
      const allListings = product.listings || [alert.listing];
      const lowestListing = allListings[0] || alert.listing;
      const currentPrice = parseFloat(lowestListing.price) || parseFloat(alert.listing.price) || 0;
      const targetPrice = parseFloat(alert.targetPrice);
      const isTriggered = currentPrice <= targetPrice;
      const priceDifference = Math.max(0, currentPrice - targetPrice);
      const savingsUnderTarget = targetPrice - currentPrice;

      return {
        id: alert.id,
        productId: product.id,
        productName: product.name,
        category: product.category,
        brand: product.brand,
        imageUrl: product.imageUrl,
        currentPrice,
        targetPrice,
        isTriggered,
        priceDifference,
        savingsUnderTarget,
        isActive: alert.isActive,
        winningStore: lowestListing.sellerName,
        winningUrl: lowestListing.sellerUrl,
        deliveryTime: lowestListing.deliveryTime || '2-3 Days',
        offers: lowestListing.offers || 'Bank Offers Available',
        createdAt: alert.createdAt,
        userEmail: user.email
      };
    });

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (err) {
    console.error('Error fetching price alerts:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * POST /api/price-alerts
 * Body: { productId, productUrl, targetPrice, email, userId }
 */
export async function createPriceAlert(req, res) {
  try {
    const { productId, productUrl, url, targetPrice, email, userId } = req.body;
    const inputUrl = productUrl || url || '';

    if ((!productId && !inputUrl) || !targetPrice) {
      return res.status(400).json({ success: false, message: 'Product selection or valid Product URL and target price are required.' });
    }

    let product = null;
    let primaryListing = null;

    if (productId) {
      product = await prisma.product.findUnique({
        where: { id: productId },
        include: { listings: { orderBy: { price: 'asc' } } }
      });
      if (product && product.listings.length > 0) {
        primaryListing = product.listings[0];
      }
    }

    // If URL was provided or product was not found by ID
    if (!product && inputUrl) {
      // 1. Check if an existing listing matches this sellerUrl
      const matchedListing = await prisma.productListing.findFirst({
        where: {
          sellerUrl: {
            contains: inputUrl.split('?')[0],
            mode: 'insensitive'
          }
        },
        include: { product: true }
      });

      if (matchedListing) {
        primaryListing = matchedListing;
        product = matchedListing.product;
      } else {
        // 2. Extract seller & clean title from URL
        let sellerName = 'Flipkart';
        if (inputUrl.includes('amazon')) sellerName = 'Amazon';
        else if (inputUrl.includes('meesho')) sellerName = 'Meesho';
        else if (inputUrl.includes('croma')) sellerName = 'Croma';
        else if (inputUrl.includes('myntra')) sellerName = 'Myntra';

        // Extract title from URL slug
        let extractedName = 'Imported E-Commerce Product';
        try {
          const urlObj = new URL(inputUrl);
          const pathSegments = urlObj.pathname.split('/').filter(Boolean);
          if (pathSegments.length > 0) {
            const rawSlug = pathSegments[0].replace(/[-_]/g, ' ');
            if (rawSlug.length > 3 && !rawSlug.startsWith('p') && !rawSlug.startsWith('dp')) {
              extractedName = decodeURIComponent(rawSlug)
                .replace(/\b\w/g, l => l.toUpperCase())
                .substring(0, 75);
            }
          }
        } catch (e) {
          // fallback
        }

        // Create new product in catalog
        product = await prisma.product.create({
          data: {
            name: extractedName,
            category: 'General',
            brand: sellerName,
            imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600',
            description: `Imported listing from ${sellerName} via URL tracking.`
          }
        });

        const estPrice = parseFloat(targetPrice) ? parseFloat(targetPrice) * 1.15 : 1999;

        primaryListing = await prisma.productListing.create({
          data: {
            productId: product.id,
            sellerName,
            sellerUrl: inputUrl,
            price: estPrice,
            currency: 'INR',
            rating: 4.4,
            reviewCount: 150,
            deliveryTime: '2-4 Days',
            offers: 'Bank & UPI Discounts Available'
          }
        });

        // Add initial price history
        await prisma.priceHistory.create({
          data: {
            listingId: primaryListing.id,
            price: estPrice,
            recordedAt: new Date()
          }
        });
      }
    }

    if (!product || !primaryListing) {
      return res.status(404).json({ success: false, message: 'Could not locate or initialize product for this price alert.' });
    }

    // Find or create user
    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }
    if (!user && email) {
      user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: email.split('@')[0],
            email: email,
            passwordHash: '$2a$10$/9bAJ5jyKGbOJgQvvUCCyO92XudUgmnSYhw5/egkEJtKCz9o1o5Ne'
          }
        });
      }
    }
    if (!user) {
      user = await prisma.user.findFirst();
    }

    // Check if an alert already exists for this user and listing
    let alert = await prisma.priceAlert.findFirst({
      where: {
        userId: user.id,
        listingId: primaryListing.id
      }
    });

    if (alert) {
      alert = await prisma.priceAlert.update({
        where: { id: alert.id },
        data: {
          targetPrice: parseFloat(targetPrice),
          isActive: true
        }
      });
    } else {
      alert = await prisma.priceAlert.create({
        data: {
          userId: user.id,
          listingId: primaryListing.id,
          targetPrice: parseFloat(targetPrice),
          isActive: true
        }
      });
    }

    return res.status(201).json({
      success: true,
      message: `Price drop alert activated for ₹${Number(alert.targetPrice).toLocaleString('en-IN')}!`,
      data: alert
    });
  } catch (err) {
    console.error('Error creating price alert:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * PATCH /api/price-alerts/:id/toggle
 */
export async function togglePriceAlert(req, res) {
  try {
    const { id } = req.params;
    const existing = await prisma.priceAlert.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Price alert not found.' });
    }

    const updated = await prisma.priceAlert.update({
      where: { id },
      data: { isActive: !existing.isActive }
    });

    return res.status(200).json({
      success: true,
      message: `Alert ${updated.isActive ? 'resumed' : 'paused'}.`,
      data: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * PATCH /api/price-alerts/:id
 * Body: { targetPrice }
 */
export async function updatePriceAlert(req, res) {
  try {
    const { id } = req.params;
    const { targetPrice } = req.body;
    if (!targetPrice) {
      return res.status(400).json({ success: false, message: 'Target price is required.' });
    }

    const updated = await prisma.priceAlert.update({
      where: { id },
      data: { targetPrice: parseFloat(targetPrice) }
    });

    return res.status(200).json({
      success: true,
      message: `Target price updated to ₹${Number(updated.targetPrice).toLocaleString('en-IN')}!`,
      data: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * DELETE /api/price-alerts/:id
 */
export async function deletePriceAlert(req, res) {
  try {
    const { id } = req.params;
    await prisma.priceAlert.delete({ where: { id } });
    return res.status(200).json({
      success: true,
      message: 'Price alert removed.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * POST /api/price-alerts/:id/test-trigger
 */
export async function testTriggerPriceAlert(req, res) {
  try {
    const { id } = req.params;
    const alert = await prisma.priceAlert.findUnique({
      where: { id },
      include: {
        user: true,
        listing: {
          include: { product: true }
        }
      }
    });

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Price alert not found.' });
    }

    await sendPriceDropEmail({
      userEmail: alert.user.email,
      productName: alert.listing.product.name,
      storeName: alert.listing.sellerName,
      currentPrice: parseFloat(alert.listing.price),
      targetPrice: parseFloat(alert.targetPrice),
      storeUrl: alert.listing.sellerUrl
    });

    return res.status(200).json({
      success: true,
      message: `Simulated price drop alert dispatched to ${alert.user.email}!`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
