import { Router } from 'express';
import { 
  scrapeProduct, 
  listProducts, 
  getProduct, 
  getProductAISummary, 
  getComparison, 
  streamLiveUpdates,
  syncProductPriceHandler,
  syncAllProductsHandler,
  getSmartAdvisorHandler,
  createPriceAlertHandler,
  getBudgetAdvisorHandler,
  getPriceHistoryHandler,
  verifyPriceHandler,
  searchProductsHandler,
  getSingleProductCompareHandler,
  verifySingleProductHandler,
  verifyAllProductsHandler
} from './product.controller.js';

const router = Router();

// GET  /api/products/search - Robust multi-marketplace & catalog search (Section 7 & 20)
router.get('/search', searchProductsHandler);

// GET  /api/products/budget-advisor - AI Product Recommendation within user budget
router.get('/budget-advisor', getBudgetAdvisorHandler);

// GET  /api/products/live-stream - Server-Sent Events (SSE) real-time stream
router.get('/live-stream', streamLiveUpdates);

// POST /api/products/verify-all - Verify all products in catalog live
router.post('/verify-all', verifyAllProductsHandler);

// POST /api/products/sync-all-live - Sync all products with live market prices
router.post('/sync-all-live', syncAllProductsHandler);

// POST /api/products/:id/sync-live-price - Sync single product live market prices
router.post('/:id/sync-live-price', syncProductPriceHandler);

// POST /api/products/:id/verify - Live verification of single product
router.post('/:id/verify', verifySingleProductHandler);

// GET  /api/products/:id/smart-advisor - AI Smart Shopping Assistant & Price History Graph
router.get('/:id/smart-advisor', getSmartAdvisorHandler);

// POST /api/products/:id/price-alert - Create price drop notification alert
router.post('/:id/price-alert', createPriceAlertHandler);

// POST /api/products/scrape  – paste URL to trigger Scrapy
router.post('/scrape', scrapeProduct);

// GET  /api/products/compare – compare multiple products (?ids=1,2,3)
router.get('/compare', getComparison);

// GET  /api/products/:id/compare – dedicated single-product comparison across Amazon, Flipkart, Meesho, Croma, Myntra (Section 20 & 21)
router.get('/:id/compare', getSingleProductCompareHandler);

// GET  /api/products/:id/price-history – real recorded price history for chart
router.get('/:id/price-history', getPriceHistoryHandler);

// GET  /api/products/:id/verify-price – honest verification status + marketplace links
router.get('/:id/verify-price', verifyPriceHandler);

// GET  /api/products/:id/ai-summary – AI review breakdown & sentiment
router.get('/:id/ai-summary', getProductAISummary);

// GET  /api/products          – list all scraped products
router.get('/', listProducts);

// GET  /api/products/:id      – get single product + reviews
router.get('/:id', getProduct);

export default router;
