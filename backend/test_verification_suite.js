import { matchProducts } from './src/utils/productMatcher.js';
import { validateImageUrl } from './src/utils/imageValidator.js';
import { validateAndSanitizePrice } from './src/utils/priceValidator.js';

async function runTests() {
  console.log('--- STARTING VERIFICATION SUITE ---');

  // Test 1: Price Validator
  console.log('\n[Test 1] Price Validator');
  console.log('Valid Price:', validateAndSanitizePrice('₹1,499.00', 'Shoes', 'Amazon'));
  console.log('Invalid Price:', validateAndSanitizePrice('Not a number', 'Shoes', 'Amazon'));
  console.log('Anomaly Price:', validateAndSanitizePrice('150', 'MacBook Pro', 'Amazon'));

  // Test 2: Product Matcher
  console.log('\n[Test 2] Product Matcher');
  const catalog = [
    { id: 1, name: 'Apple iPhone 15 Pro (128GB) - Natural Titanium', brand: 'Apple', category: 'Smartphones' },
    { id: 2, name: 'Samsung Galaxy S24 Ultra 5G', brand: 'Samsung', category: 'Smartphones' }
  ];
  
  const scrapedItem = {
    name: 'Apple iPhone 15 Pro 128GB Natural Titanium',
    brand: 'Apple',
    category: 'Smartphones'
  };

  let bestMatch = null;
  for (const item of catalog) {
    const result = matchProducts(scrapedItem, item);
    if (result.matchStatus === 'VERIFIED' || result.matchStatus === 'POSSIBLE_MATCH') {
      if (!bestMatch || result.matchScore > bestMatch.result.matchScore) {
        bestMatch = { product: item, result };
      }
    }
  }

  if (bestMatch) {
    console.log(`Matched with score ${bestMatch.result.matchScore} (${bestMatch.result.matchConfidence}). Target: ${bestMatch.product.name}`);
  } else {
    console.log('No match found.');
  }

  // Test 3: Image Validator
  console.log('\n[Test 3] Image Validator');
  const imgUrl = 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5';
  const imgStatus = await validateImageUrl(imgUrl);
  console.log(`Image Validation Status: ${imgStatus.imageStatus} (${imgStatus.reason})`);

  console.log('\n--- VERIFICATION SUITE COMPLETE ---');
}

runTests().catch(console.error);
