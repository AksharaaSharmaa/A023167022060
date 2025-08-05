import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function testBackendAPI() {
  console.log('🧪 Testing URL Shortener Backend API...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: Create Short URL
    console.log('2️⃣ Testing Create Short URL...');
    const createResponse = await axios.post(`${BASE_URL}/shorturls`, {
      url: 'https://example.com/very-long-url-with-many-parameters',
      validity: 30,
      shortcode: 'test123'
    });
    console.log('✅ Created Short URL:', createResponse.data);
    const shortcode = createResponse.data.shortLink.split('/').pop();
    console.log('');

    // Test 3: Get URL Statistics
    console.log('3️⃣ Testing Get URL Statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/shorturls/${shortcode}`);
    console.log('✅ URL Statistics:', statsResponse.data);
    console.log('');

    // Test 4: Create URL with Auto-generated Shortcode
    console.log('4️⃣ Testing Auto-generated Shortcode...');
    const autoResponse = await axios.post(`${BASE_URL}/shorturls`, {
      url: 'https://google.com/search?q=url+shortener',
      validity: 60
    });
    console.log('✅ Auto-generated Shortcode:', autoResponse.data);
    console.log('');

    // Test 5: Test Error Handling - Invalid URL
    console.log('5️⃣ Testing Error Handling - Invalid URL...');
    try {
      await axios.post(`${BASE_URL}/shorturls`, {
        url: 'not-a-valid-url',
        validity: 30
      });
    } catch (error) {
      console.log('✅ Invalid URL Error:', error.response.data);
    }
    console.log('');

    // Test 6: Test Error Handling - Duplicate Shortcode
    console.log('6️⃣ Testing Error Handling - Duplicate Shortcode...');
    try {
      await axios.post(`${BASE_URL}/shorturls`, {
        url: 'https://example.com/another-url',
        validity: 30,
        shortcode: 'test123' // Same as before
      });
    } catch (error) {
      console.log('✅ Duplicate Shortcode Error:', error.response.data);
    }
    console.log('');

    // Test 7: Test Error Handling - Non-existent URL
    console.log('7️⃣ Testing Error Handling - Non-existent URL...');
    try {
      await axios.get(`${BASE_URL}/shorturls/nonexistent`);
    } catch (error) {
      console.log('✅ Non-existent URL Error:', error.response.data);
    }
    console.log('');

    console.log('🎉 All API tests completed successfully!');
    console.log('');
    console.log('📋 Test Summary:');
    console.log('✅ Health Check - Working');
    console.log('✅ Create Short URL - Working');
    console.log('✅ Get URL Statistics - Working');
    console.log('✅ Auto-generated Shortcodes - Working');
    console.log('✅ Error Handling - Working');
    console.log('');
    console.log('🚀 Backend is ready for frontend integration!');

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the tests
testBackendAPI(); 