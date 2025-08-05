const axios = require('axios');

// Your credentials from the successful registration
const credentials = {
  email: "akshara.sharma.contact@gmail.com",
  name: "akshara sharma",
  rollNo: "a023167022060",
  accessCode: "yvhdda",
  clientID: "7bceb25f-a102-4778-a83f-cce20ff755e3",
  clientSecret: "SUYxRRyqrzfcFxeZ"
};

async function getAuthToken() {
  try {
    console.log('Requesting authorization token...');
    console.log('Using credentials:', credentials);
    
    const response = await axios.post('http://20.244.56.144/evaluation-service/auth', credentials);
    
    console.log('✅ Authorization successful!');
    console.log('Token Type:', response.data.token_type);
    console.log('Access Token:', response.data.access_token);
    console.log('Expires In:', response.data.expires_in);
    
    // Save the token to a file for future use
    const fs = require('fs');
    fs.writeFileSync('auth_token.json', JSON.stringify(response.data, null, 2));
    console.log('✅ Token saved to auth_token.json');
    
  } catch (error) {
    console.error('❌ Authorization failed!');
    console.error('Error:', error.response?.data || error.message);
  }
}

// Run the authorization
getAuthToken(); 