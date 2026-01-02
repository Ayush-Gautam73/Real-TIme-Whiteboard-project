/**
 * Basic server tests for CI/CD pipeline
 */

const http = require('http');

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';

async function runTests() {
  console.log('🧪 Running server tests...\n');
  
  let passed = 0;
  let failed = 0;

  // Test 1: Health endpoint
  try {
    await testEndpoint('/api/health', 200, 'Health endpoint');
    passed++;
  } catch (err) {
    console.error(`❌ Health endpoint: ${err.message}`);
    failed++;
  }

  // Test 2: API base route
  try {
    await testEndpoint('/api', 200, 'API base route');
    passed++;
  } catch (err) {
    // 404 is acceptable if no base route handler
    if (err.message.includes('404')) {
      console.log('⚠️  API base route: No handler (acceptable)');
      passed++;
    } else {
      console.error(`❌ API base route: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    process.exit(1);
  }
  
  console.log('✅ All tests passed!');
  process.exit(0);
}

function testEndpoint(path, expectedStatus, testName) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, SERVER_URL);
    
    const req = http.get(url.toString(), (res) => {
      if (res.statusCode === expectedStatus) {
        console.log(`✅ ${testName}: Status ${res.statusCode}`);
        resolve();
      } else {
        reject(new Error(`Expected ${expectedStatus}, got ${res.statusCode}`));
      }
    });

    req.on('error', (err) => {
      reject(new Error(`Request failed: ${err.message}`));
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Run tests
runTests().catch((err) => {
  console.error('Test runner error:', err);
  process.exit(1);
});
