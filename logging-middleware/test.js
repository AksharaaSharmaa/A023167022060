import Log from './index.js';

async function testLogging() {
  console.log('Testing Logging Middleware...\n');

  // Test 1: Data type mismatch error in handler
  console.log('Test 1: Data type mismatch error in handler');
  await Log("backend", "error", "handler", "received string, expected bool");
  console.log('');

  // Test 2: Critical database connection failure
  console.log('Test 2: Critical database connection failure');
  await Log("backend", "fatal", "db", "Critical database connection failure.");
  console.log('');

  // Test 3: Additional examples with valid packages
  console.log('Test 3: Additional logging examples');
  await Log("frontend", "info", "api", "User login successful");
  await Log("backend", "warn", "service", "Rate limit approaching threshold");
  await Log("backend", "debug", "controller", "Request processed successfully");
  await Log("backend", "info", "repository", "Database query executed");
  await Log("backend", "error", "route", "Invalid route accessed");
  
  console.log('\n✅ All logging tests completed!');
}

testLogging(); 