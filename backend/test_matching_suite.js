import { matchProducts, parseSpecs } from './src/utils/productMatcher.js';

function runMatchingTests() {
  console.log('🧪 Running Product Matcher & Variant Test Suite...\n');
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

  // 1. Exact Match Test (Same Brand, Model, Storage)
  const prodA = { name: 'Apple iPhone 15', brand: 'Apple', model: 'iPhone 15', variant: '128GB Black' };
  const prodB = { name: 'Apple iPhone 15 128GB Black', brand: 'Apple', model: 'iPhone 15', variant: '128GB Black' };
  const match1 = matchProducts(prodA, prodB);
  assert(match1.matchScore >= 90, `Exact match score >= 90% (Got ${match1.matchScore}%)`);
  assert(match1.matchStatus === 'VERIFIED', `Match status is VERIFIED (Got ${match1.matchStatus})`);

  // 2. Variant Mismatch Hard Rejection Test (128GB vs 256GB)
  const prod128 = { name: 'Apple iPhone 15 128GB', brand: 'Apple', model: 'iPhone 15', variant: '128GB' };
  const prod256 = { name: 'Apple iPhone 15 256GB', brand: 'Apple', model: 'iPhone 15', variant: '256GB' };
  const matchStorage = matchProducts(prod128, prod256);
  assert(matchStorage.matchStatus === 'NOT_MATCHED', `Storage mismatch (128GB vs 256GB) is NOT_MATCHED (Got ${matchStorage.matchStatus})`);
  assert(matchStorage.isVariantMatch === false, 'Variant match flag is false');

  // 3. Model Mismatch Test (iPhone 15 vs iPhone 15 Pro)
  const prodStandard = { name: 'Apple iPhone 15', brand: 'Apple', model: 'iPhone 15' };
  const prodPro = { name: 'Apple iPhone 15 Pro', brand: 'Apple', model: 'iPhone 15 Pro' };
  const matchModel = matchProducts(prodStandard, prodPro);
  assert(matchModel.matchStatus === 'NOT_MATCHED', `Model mismatch (iPhone 15 vs iPhone 15 Pro) is NOT_MATCHED (Got ${matchModel.matchStatus})`);

  // 4. Brand Mismatch Test (iPhone 15 vs Galaxy S24)
  const prodApple = { name: 'Apple iPhone 15', brand: 'Apple' };
  const prodSamsung = { name: 'Samsung Galaxy S24', brand: 'Samsung' };
  const matchBrand = matchProducts(prodApple, prodSamsung);
  assert(matchBrand.matchScore === 0 && matchBrand.matchStatus === 'NOT_MATCHED', 'Brand mismatch score is 0% NOT_MATCHED');

  // 5. Spec Parser Test
  const specs = parseSpecs('Sony WH-1000XM5 Wireless Headphones 30 Hours Battery Black');
  assert(specs.modelKey === 'wh-1000xm5', `Model key extracted correctly: ${specs.modelKey}`);
  assert(specs.color === 'black', `Color extracted correctly: ${specs.color}`);

  console.log(`\n========================================`);
  console.log(`📊 MATCHING TEST SUITE COMPLETE: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runMatchingTests();
