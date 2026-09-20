import http from 'http';

function get(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'GET',
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function post(path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        ...headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runTestSuite() {
  console.log('🧪 Starting Full ShopWise AI Backend Automated Test Suite...\n');
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

  try {
    // 1. Health Check
    const health = await get('/health');
    assert(health.status === 200 && health.body.status === 'success', 'GET /health endpoint operational');

    // 2. Auth Login
    const login = await post('/api/auth/login', {
      email: 'abinaa059@gmail.com',
      password: 'Abina@2006'
    });
    assert(login.status === 200 && login.body.success === true, 'POST /api/auth/login authenticates user');
    const token = login.body?.data?.accessToken;
    assert(Boolean(token), 'JWT Token generated successfully');

    // 3. Products List
    const productsRes = await get('/api/products');
    assert(productsRes.status === 200 && productsRes.body.success === true, 'GET /api/products returns catalog');
    const products = productsRes.body?.data?.products || productsRes.body?.data || [];
    assert(products.length > 0, `Catalog contains ${products.length} products`);

    // Pick sample product
    const sample = products[0];
    if (sample) {
      // 4. Product Details
      const detailRes = await get(`/api/products/${sample.id}`);
      assert(detailRes.status === 200, `GET /api/products/${sample.id} returns product details`);
      const listings = detailRes.body?.data?.listings || [];
      assert(listings.length > 0, `Product "${sample.name}" has ${listings.length} store listings`);

      // 5. AI Sentiment Summary
      const aiRes = await get(`/api/products/${sample.id}/ai-summary`);
      assert(aiRes.status === 200 && aiRes.body.success === true, 'GET /api/products/:id/ai-summary computes review sentiment');

      // 6. Platform Advisor Recommendation
      const advisorRes = await get(`/api/platform-advisor/${sample.id}`);
      assert(advisorRes.status === 200 && advisorRes.body.success === true, 'GET /api/platform-advisor/:id evaluates best app store');
    }

    // 7. Authenticated Wishlist
    if (token) {
      const wishlistRes = await get('/api/wishlist', { Authorization: `Bearer ${token}` });
      assert(wishlistRes.status === 200, 'GET /api/wishlist authenticated user access verified');

      // 8. Authenticated Price Alerts
      const alertsRes = await get('/api/price-alerts', { Authorization: `Bearer ${token}` });
      assert(alertsRes.status === 200, 'GET /api/price-alerts authenticated user access verified');
    }

  } catch (err) {
    console.error('⚠️ Test suite execution error:', err.message);
    failed++;
  }

  console.log(`\n========================================`);
  console.log(`📊 TEST SUITE COMPLETE: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
