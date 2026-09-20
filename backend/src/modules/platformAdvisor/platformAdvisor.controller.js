import { getPlatformRecommendation } from '../../services/platformAdvisor.service.js';
import prisma from '../../config/db.js';


/**
 * POST /api/platform-advisor
 * Body: { productId, productName, category, price, listings, preference }
 */
export async function getAdvice(req, res) {
  try {
    const { productId, productName, category, price, listings, preference } = req.body;

    if (!productId && !productName && !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either a productId, productName, or category.'
      });
    }

    const advice = await getPlatformRecommendation({
      productId,
      productName,
      category,
      price: parseFloat(price) || undefined,
      listings: Array.isArray(listings) ? listings : [],
      userPreference: preference || 'best_value',
    });

    return res.status(200).json({
      success: true,
      data: advice
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Platform Advisor analysis failed.'
    });
  }
}

/**
 * GET /api/platform-advisor/:productId
 */
export async function getStoredAdvice(req, res) {
  try {
    const { productId } = req.params;
    const queryId = req.query.productId || productId;

    // Check if valid UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(queryId);

    if (isUuid) {
      const stored = await prisma.platformRecommendation.findFirst({
        where: { productId: queryId },
        include: {
          product: {
            include: {
              listings: true,
            }
          }
        }
      });

      if (stored) {
        return res.status(200).json({
          success: true,
          data: stored
        });
      }
    }

    // If not stored or not UUID, generate on the fly
    const freshAdvice = await getPlatformRecommendation({ productId: isUuid ? queryId : undefined, productName: !isUuid ? queryId : undefined });
    return res.status(200).json({
      success: true,
      data: freshAdvice
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
