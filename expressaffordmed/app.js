const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { email, name, mobileNo, githubUsername, rollNo, accessCode } = req.body;
    
    // Validate required fields
    if (!email || !name || !mobileNo || !githubUsername || !rollNo || !accessCode) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: email, name, mobileNo, githubUsername, rollNo, accessCode'
      });
    }

    // Call the external registration API
    const response = await axios.post('http://20.244.56.144/evaluation-service/register', {
      email,
      name,
      mobileNo,
      githubUsername,
      rollNo,
      accessCode
    });

    console.log('Registration successful:', response.data);
    res.json({
      success: true,
      data: response.data,
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || 'Registration failed',
      error: error.response?.data || error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Registration endpoint: http://localhost:${PORT}/api/register`);
});
