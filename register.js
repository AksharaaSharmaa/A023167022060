const axios = require('axios');

// Your credentials - UPDATE THESE WITH YOUR ACTUAL INFORMATION
const credentials = {
  email: "akshara.sharma.contact@gmail.com",           // Replace with your email
  name: "Akshara Sharma",                    // Replace with your name
  mobileNo: "9717194402",                    // Replace with your mobile number
  githubUsername: "AksharaaSharmaa",    // Replace with your GitHub username
  rollNo: "A023167022060",                // Replace with your roll number
  accessCode: "yvhdda"                       // This is the access code from the API docs
};

async function register() {
  try {
    console.log('Sending registration request...');
    console.log('Credentials:', credentials);
    
    const response = await axios.post('http://20.244.56.144/evaluation-service/register', credentials);
    
    console.log('✅ Registration successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Registration failed!');
    console.error('Error:', error.response?.data || error.message);
  }
}

// Run the registration
register(); 