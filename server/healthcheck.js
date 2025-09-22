const http = require('http');

const options = {
  host: 'localhost',
  port: process.env.PORT || 5000,
  path: '/api/health',
  timeout: 5000
};

const request = http.request(options, (res) => {
  console.log(`Health check status: ${res.statusCode}`);
  if (res.statusCode === 200) {
    console.log('✅ Server health check passed');
    process.exit(0);
  } else {
    console.log('❌ Server health check failed - wrong status code');
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.error('❌ Health check failed:', err.message);
  process.exit(1);
});

request.on('timeout', () => {
  console.error('❌ Health check timeout');
  request.destroy();
  process.exit(1);
});

request.setTimeout(5000);
request.end();