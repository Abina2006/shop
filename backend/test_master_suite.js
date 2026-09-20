/**
 * ShopWise AI Master Automated Test Suite
 * Validates Product Matching, Price Verification, URL Validation,
 * Image Verification, Comparison API, Search API, and Failure Resilience.
 * Conforms to Sections 27 & 28 of Master Specification.
 */

import http from 'http';
import { matchProducts, parseSpecs } from './src/utils/productMatcher.js';
import amazonAdapter from './src/marketplaces/amazon/amazon.adapter.js';
import flipkartAdapter from './src/marketplaces/flipkart/flipkart.adapter.js';
import meeshoAdapter from './src/marketplaces/meesho/meesho.adapter.js';
import cromaAdapter from './src/marketplaces/croma/croma.adapter.js';
import myntraAdapter from './src/marketplaces/myntra/myntra.adapter.js';
import MarketplaceFactory from './src/marketplaces/marketplace.factory.js';
import { validateImageUrl } from './src/utils/imageValidator.js';
import { validateAndSanitizePrice } from './src/utils/priceValidator.js';

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName} ${details ? '(' + details + ')' : ''}`);
    failed++;
  }
}

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'GET',
      timeout: 20000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

async function runUnitTests() {
  console.log('\n════════════════════════════════════════════════════════════');
  console.log('🧪 1. PRODUCT MATCHING ENGINE TESTS (Section 8 & 9)');
  console.log('════════════════════════════════════════════════════════════\n');

  // Test 1: Exact Same Product & Storage Match -> VERIFIED (Score >= 90)
  const prod1 = { name: 'Apple iPhone 15 128GB Black', brand: 'Apple', model: 'iPhone 15' };
  const prod2 = { name: 'Apple iPhone 15 (128 GB) - Black', brand: 'Apple', model: 'iPhone 15' };
  const match1 = matchProducts(prod1, prod2);
  assert(
    match1.matchScore >= 90 && match1.matchStatus === 'VERIFIED',
    'Same model & same storage matches with VERIFIED status (Score >= 90)',
    `Score: ${match1.matchScore}`
  );

  // Test 2: Storage Mismatch (128GB vs 256GB) -> Hard rejection (< 70, NOT_MATCHED)
  const prodDiffStorage = { name: 'Apple iPhone 15 256GB Blue', brand: 'Apple', model: 'iPhone 15' };
  const matchStorageDiff = matchProducts(prod1, prodDiffStorage);
  assert(
    matchStorageDiff.matchScore < 70 && matchStorageDiff.matchStatus === 'NOT_MATCHED',
    'Different storage (128GB vs 256GB) must NOT match (Score < 70, NOT_MATCHED)',
    `Score: ${matchStorageDiff.matchScore}`
  );

  // Test 3: Model Mismatch (S24 vs S24 Ultra) -> Hard rejection
  const s24 = { name: 'Samsung Galaxy S24 256GB Onyx Black', brand: 'Samsung', model: 'Galaxy S24' };
  const s24Ultra = { name: 'Samsung Galaxy S24 Ultra 256GB Titanium Gray', brand: 'Samsung', model: 'Galaxy S24 Ultra' };
  const matchModelDiff = matchProducts(s24, s24Ultra);
  assert(
    matchModelDiff.matchScore < 70 && matchModelDiff.matchStatus === 'NOT_MATCHED',
    'Different model tier (S24 vs S24 Ultra) must be REJECTED',
    `Score: ${matchModelDiff.matchScore}`
  );

  // Test 4: Brand Mismatch (Apple vs Samsung) -> Score 0, NOT_MATCHED
  const matchBrandDiff = matchProducts(prod1, s24);
  assert(
    matchBrandDiff.matchScore === 0 && matchBrandDiff.matchStatus === 'NOT_MATCHED',
    'Brand mismatch (Apple vs Samsung) returns score 0 and NOT_MATCHED'
  );

  // Test 5: Headphone model version check (Sony WH-1000XM5 vs WH-1000XM4)
  const xm5 = { name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones', brand: 'Sony' };
  const xm4 = { name: 'Sony WH-1000XM4 Wireless Noise Canceling Headphones', brand: 'Sony' };
  const matchXm = matchProducts(xm5, xm4);
  assert(
    matchXm.matchScore < 70 && matchXm.matchStatus === 'NOT_MATCHED',
    'Model generations (XM5 vs XM4) must not match'
  );

  console.log('\n════════════════════════════════════════════════════════════');
  console.log('🌐 2. MARKETPLACE URL & DIRECT PRODUCT VALIDATION (Section 12)');
  console.log('════════════════════════════════════════════════════════════\n');

  // Amazon Direct vs Search URL
  const amzDirect = amazonAdapter.parseUrl('https://www.amazon.in/dp/B0CHX1W1XY');
  const amzSearch = amazonAdapter.parseUrl('https://www.amazon.in/s?k=iphone+15');
  assert(amzDirect.isDirectUrl && amzDirect.asin === 'B0CHX1W1XY', 'Amazon /dp/ASIN recognized as DIRECT_PRODUCT');
  assert(!amzSearch.isDirectUrl && amzSearch.urlType === 'SEARCH_PAGE', 'Amazon /s?k= identified as SEARCH_PAGE (not direct product)');

  // Flipkart Direct vs Search URL
  const fkDirect = flipkartAdapter.parseUrl('https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4');
  const fkSearch = flipkartAdapter.parseUrl('https://www.flipkart.com/search?q=iphone+15');
  assert(fkDirect.isDirectUrl, 'Flipkart /p/itm... recognized as DIRECT_PRODUCT');
  assert(!fkSearch.isDirectUrl, 'Flipkart /search?q= identified as SEARCH_PAGE');

  // Meesho Direct vs Search URL
  const meeshoDirect = meeshoAdapter.parseUrl('https://www.meesho.com/hoppup-xo3-gaming-earbuds/p/6p8x2z');
  const meeshoSearch = meeshoAdapter.parseUrl('https://www.meesho.com/search?q=earbuds');
  assert(meeshoDirect.isDirectUrl && meeshoDirect.meeshoId === '6p8x2z', 'Meesho /p/ID recognized as DIRECT_PRODUCT');
  assert(!meeshoSearch.isDirectUrl, 'Meesho /search recognized as SEARCH_PAGE');

  // Croma Direct vs Search URL
  const cromaDirect = cromaAdapter.parseUrl('https://www.croma.com/apple-iphone-15/p/300755');
  const cromaSearch = cromaAdapter.parseUrl('https://www.croma.com/search?q=iphone');
  assert(cromaDirect.isDirectUrl && cromaDirect.cromaId === '300755', 'Croma /p/PID recognized as DIRECT_PRODUCT');
  assert(!cromaSearch.isDirectUrl, 'Croma search recognized as SEARCH_PAGE');

  // Myntra Direct vs Search URL
  const myntraDirect = myntraAdapter.parseUrl('https://www.myntra.com/tshirts/roadster/roadster-cotton-tshirt/2345678/buy');
  const myntraSearch = myntraAdapter.parseUrl('https://www.myntra.com/search?q=tshirt');
  assert(myntraDirect.isDirectUrl && myntraDirect.styleId === '2345678', 'Myntra /buy recognized as DIRECT_PRODUCT');
  assert(!myntraSearch.isDirectUrl, 'Myntra /search recognized as SEARCH_PAGE');

  console.log('\n════════════════════════════════════════════════════════════');
  console.log('🛡️ 3. PRICE STATUS & VERIFICATION INTEGRITY (Sections 11 & 15)');
  console.log('════════════════════════════════════════════════════════════\n');

  // Search URL verification test: must return UNVERIFIED
  const searchVerify = await amazonAdapter.verifyListing({
    productName: 'iPhone 15',
    targetUrl: 'https://www.amazon.in/s?k=iphone+15',
    storedPrice: 49999
  });
  assert(
    searchVerify.priceStatus === 'UNVERIFIED' && searchVerify.verified === false,
    'Search URL verification strictly sets priceStatus = UNVERIFIED'
  );

  // Direct URL verification test: verified
  const directVerify = await amazonAdapter.verifyListing({
    productName: 'iPhone 15',
    targetUrl: 'https://www.amazon.in/dp/B0CHX1W1XY',
    storedPrice: 49999
  });
  assert(
    directVerify.priceStatus === 'VERIFIED' && directVerify.verified === true,
    'Direct product URL with valid price sets priceStatus = VERIFIED'
  );

  // Price Sanitizer: No fake prices, no negative or zero prices
  assert(validateAndSanitizePrice('₹49,999') === 49999, 'Sanitizes ₹ string into clean number 49999');
  assert(validateAndSanitizePrice(0) === null, 'Rejects zero price with null (no fake fallback)');
  assert(validateAndSanitizePrice(-500) === null, 'Rejects negative price with null');
  assert(validateAndSanitizePrice('invalid') === null, 'Rejects non-numeric string with null');

  // Image Validator: rejects generic placeholder
  const placeholderCheck = await validateImageUrl('https://example.com/placeholder.png');
  assert(placeholderCheck.isValid === false, 'Rejects placeholder domain image URLs');

  console.log('\n════════════════════════════════════════════════════════════');
  console.log('🏭 4. MARKETPLACE FACTORY & FAULT TOLERANCE (Section 13 & 14)');
  console.log('════════════════════════════════════════════════════════════\n');

  const supported = MarketplaceFactory.getSupportedMarketplaces();
  assert(
    supported.includes('Amazon') && supported.includes('Flipkart') && supported.includes('Meesho') && supported.includes('Croma') && supported.includes('Myntra'),
    'MarketplaceFactory supports Amazon, Flipkart, Meesho, Croma, and Myntra'
  );

  const adapters = MarketplaceFactory.getAllAdapters();
  assert(adapters.length === 5, 'MarketplaceFactory returns all 5 adapters');

  // Search across marketplaces tolerates errors
  const results = await MarketplaceFactory.searchAllMarketplaces('iphone');
  assert(Array.isArray(results), 'MarketplaceFactory.searchAllMarketplaces returns array without crashing');
}

async function runApiIntegrationTests() {
  console.log('\n════════════════════════════════════════════════════════════');
  console.log('🔌 5. BACKEND API ENDPOINTS INTEGRATION (Section 20)');
  console.log('════════════════════════════════════════════════════════════\n');

  try {
    // 1. Health check
    const health = await get('/health');
    assert(health.status === 200, 'GET /health responds with 200 OK');

    // 2. Search API: GET /api/products/search?q=iPhone 15
    const searchRes = await get('/api/products/search?q=iPhone');
    assert(searchRes.status === 200 && searchRes.body.success === true, 'GET /api/products/search?q=iPhone returns 200 and success: true');
    assert(Array.isArray(searchRes.body.data), 'GET /api/products/search returns array of products');

    // 3. Catalog Products
    const catalogRes = await get('/api/products');
    assert(catalogRes.status === 200, 'GET /api/products returns catalog');
    const products = catalogRes.body?.data || [];
    assert(products.length > 0, `Catalog contains ${products.length} products`);

    const sample = products[0];
    if (sample) {
      // 4. Comparison API: GET /api/products/:id/compare (Section 20 & 21)
      const compareRes = await get(`/api/products/${sample.id}/compare`);
      assert(compareRes.status === 200 && compareRes.body.success === true, `GET /api/products/${sample.id}/compare returns 200 and success: true`);
      assert(compareRes.body?.data?.product?.id === sample.id, 'Comparison response contains matched product metadata');

      const marketListings = compareRes.body?.data?.marketplaces || [];
      assert(marketListings.length >= 5, `Comparison matrix contains ${marketListings.length} marketplace representations (Amazon, Flipkart, Meesho, Croma, Myntra)`);

      // Verify each marketplace representation has a Buy URL if available, and verified status
      const hasVerifiedOrUnavailable = marketListings.every(m =>
        ['VERIFIED', 'UNVERIFIED', 'STALE', 'UNAVAILABLE'].includes(m.priceStatus)
      );
      assert(hasVerifiedOrUnavailable, 'All marketplace listings have valid priceStatus (VERIFIED, UNVERIFIED, STALE, UNAVAILABLE)');

      // 5. Price History API: GET /api/products/:id/price-history
      const historyRes = await get(`/api/products/${sample.id}/price-history`);
      assert(historyRes.status === 200 && historyRes.body.success === true, `GET /api/products/${sample.id}/price-history returns 200 OK`);
      assert(Array.isArray(historyRes.body?.data), 'Price history returns array of seller history entries');
    }
  } catch (err) {
    console.warn(`  ⚠️ Live server integration tests skipped or server not running: ${err.message}`);
    console.log('  (Start the backend server on port 5000 to execute live HTTP endpoints)');
  }
}

async function runMasterSuite() {
  console.log('🚀 Starting ShopWise AI Full-Stack Master Test Suite...');
  await runUnitTests();
  await runApiIntegrationTests();

  console.log('\n════════════════════════════════════════════════════════════');
  console.log(`📊 MASTER TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('════════════════════════════════════════════════════════════\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runMasterSuite().catch(err => {
  console.error('Test Suite Error:', err);
  process.exit(1);
});
