import fs from 'fs';

try {
  console.log('🔍 Testing auth token reading...');
  
  const tokenData = JSON.parse(fs.readFileSync('./auth_token.json', 'utf8'));
  console.log('✅ Auth token read successfully!');
  console.log('Token type:', tokenData.token_type);
  console.log('Access token (first 50 chars):', tokenData.access_token.substring(0, 50) + '...');
  console.log('Expires in:', tokenData.expires_in);
  
} catch (error) {
  console.error('❌ Failed to read auth token:', error.message);
} 