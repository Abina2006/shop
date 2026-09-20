import MarketplaceFactory from './src/marketplaces/marketplace.factory.js';
import amazonAdapter from './src/marketplaces/amazon/amazon.adapter.js';
import flipkartAdapter from './src/marketplaces/flipkart/flipkart.adapter.js';
import meeshoAdapter from './src/marketplaces/meesho/meesho.adapter.js';
import cromaAdapter from './src/marketplaces/croma/croma.adapter.js';
import myntraAdapter from './src/marketplaces/myntra/myntra.adapter.js';

async function runAdapterTests() {
  console.log('🧪 Running Marketplace Adapters & URL Validation Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Adapter Factory Lookup Test
  assert(MarketplaceFactory.getAdapter('Amazon').marketplace === 'Amazon', 'Factory resolves Amazon adapter');
  assert(MarketplaceFactory.getAdapter('Flipkart').marketplace === 'Flipkart', 'Factory resolves Flipkart adapter');
  assert(MarketplaceFactory.getAdapter('Meesho').marketplace === 'Meesho', 'Factory resolves Meesho adapter');
  assert(MarketplaceFactory.getAdapter('Croma').marketplace === 'Croma', 'Factory resolves Croma adapter');
  assert(MarketplaceFactory.getAdapter('Myntra').marketplace === 'Myntra', 'Factory resolves Myntra adapter');

  // 2. Direct vs Search URL Parsing Test
  const amazonDirect = amazonAdapter.parseUrl('https://www.amazon.in/dp/B0CHX1W1XY');
  assert(amazonDirect.isDirectUrl === true && amazonDirect.asin === 'B0CHX1W1XY', 'Amazon /dp/ ASIN parsed as direct product URL');

  const amazonSearch = amazonAdapter.parseUrl('https://www.amazon.in/s?k=iphone+15');
  assert(amazonSearch.isDirectUrl === false && amazonSearch.urlType === 'SEARCH_PAGE', 'Amazon /s? search page identified correctly');

  const flipkartDirect = flipkartAdapter.parseUrl('https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac2b85e2a208');
  assert(flipkartDirect.isDirectUrl === true && flipkartDirect.fsn === 'itm6ac2b85e2a208', 'Flipkart /p/ FSN parsed as direct product URL');

  const flipkartSearch = flipkartAdapter.parseUrl('https://www.flipkart.com/search?q=iphone+15');
  assert(flipkartSearch.isDirectUrl === false, 'Flipkart /search search page identified correctly');

  // 3. Search URL Verification Flagging (Section 12: Search URLs marked UNVERIFIED)
  const verifySearchRes = await amazonAdapter.verifyListing({
    productName: 'iPhone 15',
    targetUrl: 'https://www.amazon.in/s?k=iphone+15',
    storedPrice: 49999
  });
  assert(verifySearchRes.priceStatus === 'UNVERIFIED', 'Search result URL verified listing is marked UNVERIFIED');
  assert(verifySearchRes.failureReason === 'SEARCH_URL_NOT_DIRECT_PRODUCT', 'Failure reason correctly flags SEARCH_URL_NOT_DIRECT_PRODUCT');

  // 4. Direct Product Listing Verification
  const verifyDirectRes = await amazonAdapter.verifyListing({
    productName: 'iPhone 15',
    targetUrl: 'https://www.amazon.in/dp/B0CHX1W1XY',
    storedPrice: 49999
  });
  assert(verifyDirectRes.priceStatus === 'VERIFIED', 'Direct product URL with price is marked VERIFIED');
  assert(verifyDirectRes.price === 49999, 'Direct product URL retains verified price');

  console.log(`\n========================================`);
  console.log(`📊 ADAPTERS TEST SUITE COMPLETE: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runAdapterTests();
