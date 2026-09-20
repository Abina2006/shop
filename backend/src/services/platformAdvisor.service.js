import prisma from '../config/db.js';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let aiClient = null;

function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

/**
 * Category-based platform intelligence profiles
 */
/**
 * Category-based platform intelligence profiles
 */
const CATEGORY_PROFILES = {
  Smartphones: {
    topPlatforms: ['Flipkart', 'Amazon', 'Croma'],
    strengths: {
      Flipkart: ['Flipkart Assured certified', 'Fast transit protection', 'High exchange value for old smartphones', 'Official brand warranties'],
      Amazon: ['Prime 1-2 Day Delivery', 'Hassle-free 7-day replacement', 'Official brand warranty support', 'Amazon Pay Cashback'],
      Croma: ['Tata-backed authorized retail', 'Option for physical store pickup & demo', 'Dedicated technician support'],
    },
    defaultOffers: 'Up to ₹2,000 Instant Bank Discount + No Cost EMI',
    delivery: '1-2 Business Days Express Delivery',
  },
  Computers: {
    topPlatforms: ['Amazon', 'Flipkart', 'Croma'],
    strengths: {
      Amazon: ['Brand-authorized store listings', 'Free doorstep transit insurance', 'Fast Prime dispatch'],
      Flipkart: ['SuperCoins cashback and trade-in bonuses', 'Flipkart Assured safe packaging'],
      Croma: ['In-store technician setup', 'Extended warranty protection plans'],
    },
    defaultOffers: 'Up to ₹5,000 Exchange Bonus + Free Microsoft Office bundle',
    delivery: 'Scheduled doorstep delivery with verification OTP',
  },
  Electronics: {
    topPlatforms: ['Amazon', 'Flipkart', 'Croma'],
    strengths: {
      Amazon: ['Prime 1-2 Day Delivery', 'Hassle-free replacement policy', 'Official brand warranty support'],
      Flipkart: ['High exchange value for old electronics', 'Flipkart Assured quality checks'],
      Croma: ['Authorized brand partner', 'Option for physical store pickup & demo', 'Dedicated technical support'],
    },
    defaultOffers: 'Flat ₹1,500 Instant Discount on Credit Cards + No Cost EMI up to 12 months',
    delivery: 'Next-Day Prime Delivery available',
  },
  Audio: {
    topPlatforms: ['Amazon', 'Flipkart', 'Croma'],
    strengths: {
      Amazon: ['Widest brand selection (Apple, Sony, boAt, JBL)', '1-day fast replacement guarantee', 'Verified buyer review authenticity'],
      Flipkart: ['Competitive pricing on TWS earbuds', 'Exclusive brand launches with SuperCoins'],
      Croma: ['Authorized retail warranty', 'In-store trial demo'],
    },
    defaultOffers: 'Up to 5% Cashback with Amazon Pay / Flipkart Axis Bank Cards',
    delivery: '1-2 Business Days',
  },
  Wearables: {
    topPlatforms: ['Amazon', 'Flipkart', 'Croma'],
    strengths: {
      Amazon: ['Fast 24-hr replacement guarantee', 'Official Apple & Samsung brand hubs'],
      Flipkart: ['Flipkart Assured packaging & swift refund support'],
      Croma: ['Live store trial & fitting assistance'],
    },
    defaultOffers: 'Instant ₹1,000 Off on SBI & ICICI Bank Cards',
    delivery: '1-2 Days Express Delivery',
  },
  Appliances: {
    topPlatforms: ['Amazon', 'Flipkart', 'Croma'],
    strengths: {
      Amazon: ['Doorstep installation assistance', 'Scheduled delivery slots', 'Brand warranty protection'],
      Flipkart: ['Flipkart Assured certified appliances', 'High exchange value'],
      Croma: ['In-store demo and certified technician installation'],
    },
    defaultOffers: 'Flat 10% Instant Bank Discount on Credit Cards',
    delivery: 'Scheduled 1-3 Days Doorstep Delivery',
  },
  Clothing: {
    topPlatforms: ['Meesho', 'Myntra', 'Ajio', 'Flipkart'],
    strengths: {
      Meesho: ['Unbeatable lowest factory-direct prices', 'Free delivery on all ethnic & casual wear', 'Massive budget variety'],
      Myntra: ['Curated top fashion brands', '14-day doorstep size exchange & returns', '100% original guarantee'],
      Ajio: ['Trendy international & streetwear labels', 'Lucrative AJIOMANIA coupon discounts'],
      Flipkart: ['Wide variety and affordable fashion bundles'],
    },
    defaultOffers: 'Up to 60% Off + Flat ₹200 on First Order',
    delivery: '2-4 Business Days with Easy Exchange',
  },
  Fashion: {
    topPlatforms: ['Meesho', 'Myntra', 'Ajio', 'Flipkart'],
    strengths: {
      Meesho: ['Lowest budget pricing for dresses and everyday essentials', 'Direct manufacturer rates without middleman markup'],
      Myntra: ['Original brand guarantee', 'Premium quality checks', '14-day hassle-free returns'],
      Ajio: ['Direct retail discounts', 'Exclusive style drops'],
      Flipkart: ['Flipkart Assured quality checked apparel'],
    },
    defaultOffers: 'Instant 10% Bank Discount on HDFC/ICICI Cards',
    delivery: '2-3 Days Fast Dispatch',
  },
  'Personal Care': {
    topPlatforms: ['Meesho', 'Flipkart', 'Amazon', 'Bigbasket'],
    strengths: {
      Meesho: ['Lowest prices on bulk soaps, cosmetics & daily personal care', 'Free doorstep delivery on budget bundles'],
      Flipkart: ['Flipkart Supermart value packs and swift delivery'],
      Amazon: ['Amazon Fresh / Pantry guaranteed fresh cosmetics and soaps'],
      Bigbasket: ['Express 2-hour grocery delivery', 'Genuine personal care products'],
    },
    defaultOffers: 'Extra 10% Off on Multibuy Combos',
    delivery: '1-3 Business Days',
  },
  Groceries: {
    topPlatforms: ['Meesho', 'Bigbasket', 'Amazon', 'Flipkart'],
    strengths: {
      Meesho: ['Direct farm & mill factory rates on staple groceries, tea & cooking essentials'],
      Bigbasket: ['Superfast doorstep daily grocery delivery', 'Quality check freshness guarantee'],
      Amazon: ['Amazon Fresh slot-based delivery with Prime benefits'],
      Flipkart: ['Flipkart Grocery SuperCoins savings & bank discounts'],
    },
    defaultOffers: 'Flat ₹100 Cashback on Grocery Orders Above ₹999',
    delivery: '1-2 Business Days Express Delivery',
  },
  Footwear: {
    topPlatforms: ['Myntra', 'Nike Official', 'Flipkart', 'Amazon'],
    strengths: {
      Myntra: ['Authentic sneaker authentication', 'Easy size exchanges'],
      'Nike Official': ['Direct manufacturer warranty', 'Exclusive member drops'],
      Flipkart: ['Flipkart Assured genuine footwear'],
      Amazon: ['Fast Prime dispatch', 'Verified seller authenticity'],
    },
    defaultOffers: 'Extra ₹300 Off on Prepaid Orders',
    delivery: '1-3 Business Days',
  },
  General: {
    topPlatforms: ['Flipkart', 'Amazon', 'Meesho'],
    strengths: {
      Flipkart: ['Strong pan-India delivery network and competitive sale events'],
      Amazon: ['Widest product catalog', 'Reliable customer service', 'A-to-z Guarantee protection'],
      Meesho: ['Direct factory prices without middlemen markups'],
    },
    defaultOffers: '10% Instant Savings on Major Credit & Debit Cards',
    delivery: '2-4 Business Days',
  },
};

/**
 * Generate Rule-based AI platform recommendation
 */
export function generatePlatformAdvice({ product, listings = [], userPreference = 'best_value' }) {
  const category = product?.category || 'General';
  const profile = CATEGORY_PROFILES[category] || CATEGORY_PROFILES.General;

  const isTechCategory = ['Smartphones', 'Computers', 'Electronics', 'Audio', 'Wearables', 'Appliances'].includes(category);
  const isLifestyleCategory = ['Fashion', 'Clothing', 'Personal Care', 'Groceries'].includes(category);

  // Filter listings based on platform specialization rules
  let validListings = listings.filter(l => (parseFloat(l.price) || 0) > 0);

  if (isTechCategory) {
    // For Electronics/Smartphones/Laptops/Audio: prioritize Flipkart, Amazon, Croma
    const techListings = validListings.filter(l => {
      const name = (l.sellerName || '').toLowerCase();
      return name.includes('flipkart') || name.includes('amazon') || name.includes('croma') || name.includes('nike') || name.includes('apple');
    });
    if (techListings.length > 0) {
      validListings = techListings;
    }
  }

  const lowestListing = validListings.length > 0
    ? validListings.reduce((min, cur) => parseFloat(cur.price) < parseFloat(min.price) ? cur : min, validListings[0])
    : null;
  const highestListing = validListings.length > 0
    ? validListings.reduce((max, cur) => parseFloat(cur.price) > parseFloat(max.price) ? cur : max, validListings[0])
    : null;

  // Best Price
  const bestPrice = lowestListing ? parseFloat(lowestListing.price) : 999;
  const maxPrice = highestListing ? parseFloat(highestListing.price) : bestPrice;
  const savings = Math.max(0, maxPrice - bestPrice);
  const savingsPct = maxPrice > 0 ? Math.round((savings / maxPrice) * 100) : 0;

  // Best Seller
  const bestSellerListing = validListings.length > 0
    ? validListings.reduce((top, cur) => (cur.rating || 0) > (top.rating || 0) ? cur : top, validListings[0])
    : null;
  const bestSeller = bestSellerListing?.sellerName || profile.topPlatforms[0];

  // Pick Winning Platform based on actual live listings and domain specialization
  let recommendedPlatform = profile.topPlatforms[0];
  let confidenceScore = 95;
  let reasons = [];

  if (lowestListing) {
    const sellerLower = (lowestListing.sellerName || '').toLowerCase();
    recommendedPlatform = lowestListing.sellerName;

    if (sellerLower.includes('flipkart')) {
      confidenceScore = 96;
      reasons = [
        `Lowest verified market price of ₹${bestPrice.toLocaleString('en-IN')}`,
        'Flipkart Assured certified genuine electronics with brand warranty',
        'High customer rating with easy 7-day replacement support',
        savings > 0 ? `Save ₹${savings.toLocaleString('en-IN')} (${savingsPct}%) compared to other marketplaces` : 'Best verified value on electronics'
      ];
    } else if (sellerLower.includes('amazon')) {
      confidenceScore = 96;
      reasons = [
        `Best verified price of ₹${bestPrice.toLocaleString('en-IN')}`,
        'Prime 1-2 Day Superfast Delivery with transit safety protection',
        'Official manufacturer warranty coverage and hassle-free returns',
        'Highest customer satisfaction and review reliability'
      ];
    } else if (sellerLower.includes('croma')) {
      confidenceScore = 95;
      reasons = [
        `Best price of ₹${bestPrice.toLocaleString('en-IN')} from authorized Tata Croma retail`,
        'Official manufacturer warranty & technician setup assistance',
        'Option for instant in-store pickup and demo',
        'Transparent refund and replacement terms'
      ];
    } else if (sellerLower.includes('meesho')) {
      confidenceScore = 94;
      reasons = [
        `Unbeatable lowest direct-to-consumer price of ₹${bestPrice.toLocaleString('en-IN')}`,
        'Zero shipping fees with verified seller fulfillment',
        'Huge customer volume with positive buyer feedback',
        savings > 0 ? `Save ₹${savings.toLocaleString('en-IN')} (${savingsPct}%) compared to competing stores` : 'Direct factory discount'
      ];
    } else if (sellerLower.includes('myntra')) {
      confidenceScore = 96;
      reasons = [
        '100% Original Brand Guarantee with verified authenticity',
        '14-day hassle-free doorstep size exchange and returns',
        `Lowest available deal at ₹${bestPrice.toLocaleString('en-IN')}`,
        'Highest rating and review volume for fit & quality'
      ];
    } else {
      confidenceScore = 95;
      reasons = [
        `Best verified price of ₹${bestPrice.toLocaleString('en-IN')}`,
        'Fast verified delivery with transit safety',
        'Hassle-free replacement and genuine seller badge',
        'High customer satisfaction score'
      ];
    }
  } else if (isTechCategory) {
    recommendedPlatform = 'Flipkart';
    confidenceScore = 96;
    reasons = [
      'Flipkart Assured verified genuine electronics and authorized warranty',
      'Fast 1-2 day express doorstep shipping with OTP verification',
      'Top-rated tech seller network with easy replacement support',
      'Exclusive bank card instant discounts and SuperCoins cashback'
    ];
  } else if (isLifestyleCategory) {
    recommendedPlatform = 'Meesho';
    confidenceScore = 95;
    reasons = [
      'Unbeatable lowest factory-direct pricing for apparel & cosmetics',
      'Free doorstep shipping on all budget orders',
      'Direct-to-consumer savings without marketplace markups',
      'High order volume with positive buyer satisfaction'
    ];
  }

  const fastestDelivery = profile.delivery;
  const bestOffer = profile.defaultOffers;
  const verdictSummary = `We recommend purchasing from ${recommendedPlatform} with a ${confidenceScore}% confidence rating. It provides the strongest combination of authentic inventory, fast shipping, and favorable price savings.`;

  return {
    recommendedPlatform,
    confidenceScore,
    reasons,
    bestPrice,
    bestPriceStore: lowestListing?.sellerName || recommendedPlatform,
    savingsAmount: savings,
    savingsPercent: savingsPct,
    bestSeller,
    bestSellerRating: bestSellerListing?.rating || 4.7,
    fastestDelivery,
    bestOffer,
    verdictSummary,
    source: 'ShopWise AI Recommendation Engine'
  };
}

/**
 * Full AI Platform Advisor evaluation (with Gemini AI enhancement if available)
 */
export async function getPlatformRecommendation({ productId, productName, category, price, listings = [] }) {
  let product = null;

  if (productId) {
    product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        listings: {
          include: { reviews: { take: 5, orderBy: { scrapedAt: 'desc' } } },
          orderBy: { price: 'asc' },
        },
      },
    });
    if (product && product.listings) {
      listings = product.listings;
    }
  }

  const name = product?.name || productName || 'Selected Product';
  const cat = product?.category || category || 'General';

  // Compute baseline analysis
  const baseAdvice = generatePlatformAdvice({ product: { name, category: cat }, listings });

  const client = getAIClient();
  let finalAdvice = baseAdvice;

  if (client) {
    try {
      const storeList = listings.map(l => `- ${l.sellerName}: ₹${l.price} (Rating: ${l.rating || 4.5}★, Reviews: ${l.reviewCount || 0})`).join('\n');
      const prompt = `You are an expert e-commerce platform shopping advisor. Recommend the BEST e-commerce platform (e.g. Amazon, Flipkart, Meesho, Myntra, Croma, Ajio) to purchase the following product.
      
Product: "${name}"
Category: "${cat}"
Base Price: ₹${price || baseAdvice.bestPrice}

Available Stores & Listings:
${storeList || 'Standard major Indian marketplaces'}

Rules:
- If Clothing/Fashion: recommend Meesho (if ultra-budget), Myntra (if branded/premium), or Ajio.
- If Electronics/Laptops: recommend Amazon, Flipkart, or Croma.
- If Audio/Wearables: recommend Amazon, Flipkart, or Meesho.
- Provide a confidence score between 85 and 98.
- Provide 4 clear bullet points for 'reasons' why this platform is best.

Return valid JSON with schema:
{
  "recommendedPlatform": "Platform Name",
  "confidenceScore": number,
  "reasons": ["reason 1", "reason 2", "reason 3", "reason 4"],
  "bestPrice": number,
  "bestSeller": "Seller Name",
  "fastestDelivery": "Delivery time string",
  "bestOffer": "Best discount/offer string",
  "verdictSummary": "A concise 2-sentence summary of why to buy here."
}`;

      const response = await client.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const parsed = JSON.parse(response.text.trim());
      finalAdvice = {
        ...baseAdvice,
        ...parsed,
        source: 'Google Gemini AI Advisor',
      };
    } catch (err) {
      console.warn('Gemini Advisor fallback active:', err.message);
    }
  }

  // Persist recommendation in PostgreSQL if product exists
  if (product?.id) {
    try {
      const existing = await prisma.platformRecommendation.findFirst({
        where: { productId: product.id },
      });

      if (existing) {
        await prisma.platformRecommendation.update({
          where: { id: existing.id },
          data: {
            recommendedPlatform: finalAdvice.recommendedPlatform,
            confidenceScore: finalAdvice.confidenceScore,
            reasons: finalAdvice.reasons,
            bestPrice: finalAdvice.bestPrice,
            bestSeller: finalAdvice.bestSeller,
            fastestDelivery: finalAdvice.fastestDelivery,
            bestOffer: finalAdvice.bestOffer,
            verdictSummary: finalAdvice.verdictSummary,
          },
        });
      } else {
        await prisma.platformRecommendation.create({
          data: {
            productId: product.id,
            recommendedPlatform: finalAdvice.recommendedPlatform,
            confidenceScore: finalAdvice.confidenceScore,
            reasons: finalAdvice.reasons,
            bestPrice: finalAdvice.bestPrice,
            bestSeller: finalAdvice.bestSeller,
            fastestDelivery: finalAdvice.fastestDelivery,
            bestOffer: finalAdvice.bestOffer,
            verdictSummary: finalAdvice.verdictSummary,
          },
        });
      }
    } catch (dbErr) {
      console.warn('Could not save platform recommendation to database:', dbErr.message);
    }
  }

  return finalAdvice;
}
