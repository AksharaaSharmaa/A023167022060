import Log from './logging-middleware/index.js';

async function testLoggingWithServer() {
  console.log('🧪 Testing Logging Middleware with Test Server...\n');

  try {
    // Test with valid backend package
    console.log('📝 Testing backend handler error...');
    const result1 = await Log("backend", "error", "handler", "received string, expected bool");
    console.log('Result:', result1);
    console.log('');

    // Test with valid frontend package
    console.log('📝 Testing frontend component info...');
    const result2 = await Log("frontend", "info", "component", "User login successful");
    console.log('Result:', result2);
    console.log('');

    // Test with database package
    console.log('📝 Testing backend db fatal...');
    const result3 = await Log("backend", "fatal", "db", "Critical database connection failure.");
    console.log('Result:', result3);
    console.log('');

    console.log('✅ All tests completed! Check the results above.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLoggingWithServer(); 