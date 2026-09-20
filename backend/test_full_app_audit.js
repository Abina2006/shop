import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function runAudit() {
  console.log('🧪 RUNNING FULL SHOPWISE AI FEATURE AUDIT...\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Database connection check
  await test('PostgreSQL DB Connection (/api/test-db)', async () => {
    const res = await fetch(`${BASE_URL}/test-db`);
    const json = await res.json();
    if (!json.success || json.message !== 'Database connected successfully') {
      throw new Error(`Expected success, got: ${JSON.stringify(json)}`);
    }
  });

  // 2. Auth Login Test
  let token = '';
  await test('User Authentication (/api/auth/login)', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'vaish@gmail.com', password: 'vaish' })
    });
    const json = await res.json();
    if (!json.success || !json.data.accessToken) {
      throw new Error('Authentication failed');
    }
    token = json.data.accessToken;
  });

  // 3. Product Catalog & Categories Check
  let sampleProductId = '';
  await test('Product Catalog & 20 Categories (/api/products)', async () => {
    const res = await fetch(`${BASE_URL}/products`);
    const json = await res.json();
    if (!json.success || json.data.length < 30) {
      throw new Error(`Insufficient products returned: ${json.data?.length}`);
    }
    sampleProductId = json.data[0].id;
    const categoriesCount = new Set(json.data.map(p => p.category)).size;
    if (categoriesCount < 15) {
      throw new Error(`Categories missing: found only ${categoriesCount}`);
    }
  });

  // 4. Single Product Detail
  await test('Product Detail Endpoint (/api/products/:id)', async () => {
    const res = await fetch(`${BASE_URL}/products/${sampleProductId}`);
    const json = await res.json();
    if (!json.success || !json.data || !json.data.listings) {
      throw new Error('Failed to fetch single product details');
    }
  });

  // 5. Multi-Product Comparison
  await test('Multi-Store Compare API (/api/products/compare?ids=...)', async () => {
    const res = await fetch(`${BASE_URL}/products/compare?ids=${sampleProductId}`);
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) {
      throw new Error('Comparison endpoint failed');
    }
  });

  // 6. AI Platform Advisor
  await test('AI Platform Advisor Engine (/api/platform-advisor/:productId)', async () => {
    const res = await fetch(`${BASE_URL}/platform-advisor/${sampleProductId}`);
    const json = await res.json();
    if (!json.success || !json.data.recommendedPlatform) {
      throw new Error('AI Platform Advisor failed to generate recommendation');
    }
  });

  // 7. Wishlist Endpoint
  await test('User Wishlist Management (/api/wishlist)', async () => {
    const res = await fetch(`${BASE_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error('Wishlist query failed');
    }
  });

  // 8. Price Alerts Endpoint
  await test('Price Alerts System (/api/price-alerts)', async () => {
    const res = await fetch(`${BASE_URL}/price-alerts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error('Price alerts query failed');
    }
  });

  console.log('\n========================================');
  console.log(`📊 AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================\n');
}

runAudit();
