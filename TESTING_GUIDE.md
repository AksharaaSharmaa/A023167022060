# 🧪 URL Shortener Application - Complete Testing Guide

## 📋 Prerequisites

Before testing, make sure you have:
- Node.js installed (version 14 or higher)
- Two terminal windows available
- Internet connection for the logging API calls

## 🚀 Quick Start Testing

### Step 1: Launch the Full Application

**Option A: Automated Launch (Recommended)**
```bash
# Double-click or run this file
start-both.bat
```

**Option B: Manual Launch**
```bash
# Terminal 1 - Start Backend
cd url-shortener-backend
npm install
npm run dev

# Terminal 2 - Start Frontend (in a new terminal)
cd url-shortener-app
npm install
npm start
```

### Step 2: Verify Services Are Running

You should see:
- **Backend**: `🚀 URL Shortener Microservice running on http://localhost:5000`
- **Frontend**: `Local: http://localhost:3000`

## 🧪 Testing Scenarios

### 1. Backend API Testing

**Test the Backend API directly:**
```bash
node test-backend-api.js
```

This will test:
- ✅ Health check endpoint
- ✅ Create short URL with custom shortcode
- ✅ Get URL statistics
- ✅ Auto-generated shortcodes
- ✅ Error handling (invalid URLs, duplicates, etc.)

**Manual API Testing with curl:**
```bash
# Health check
curl http://localhost:5000/health

# Create short URL
curl -X POST http://localhost:5000/shorturls \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "validity": 30, "shortcode": "test123"}'

# Get statistics
curl http://localhost:5000/shorturls/test123

# Test redirect (this will redirect you)
curl -L http://localhost:5000/test123
```

### 2. Frontend Testing

**Open your browser and navigate to:** `http://localhost:3000`

#### Test the URL Shortener Page:
1. **Basic URL Shortening:**
   - Enter a long URL (e.g., `https://www.google.com/search?q=url+shortener+example`)
   - Set validity to 30 minutes
   - Click "Shorten URL"
   - Verify the short URL is generated

2. **Custom Shortcode:**
   - Enter a long URL
   - Set validity to 60 minutes
   - Enter a custom shortcode (e.g., `myurl`)
   - Click "Shorten URL"
   - Verify the custom shortcode is used

3. **Multiple URLs:**
   - Add multiple URLs with different settings
   - Test batch shortening
   - Verify all URLs are saved

4. **Validation Testing:**
   - Try invalid URLs (e.g., `not-a-url`)
   - Try empty fields
   - Try invalid shortcodes (e.g., `a` or `toolongshortcode`)
   - Verify error messages appear

#### Test the Statistics Page:
1. **Navigate to Statistics:**
   - Click "Statistics" in the navigation
   - Verify all shortened URLs are displayed

2. **Click Tracking:**
   - Copy a short URL from the statistics page
   - Open it in a new tab
   - Verify it redirects to the original URL
   - Return to statistics and refresh
   - Verify click count increased

3. **Analytics Details:**
   - Click the expand button on any URL
   - Verify click data shows timestamp, source, and location
   - Test multiple clicks from different sources

#### Test the Redirect Handler:
1. **Direct Access:**
   - Copy a short URL (e.g., `http://localhost:3000/test123`)
   - Open it directly in browser
   - Verify it shows the redirect page
   - Verify it redirects after 2 seconds

2. **Expired URLs:**
   - Create a URL with 1-minute validity
   - Wait for it to expire
   - Try to access it
   - Verify "URL expired" message

### 3. End-to-End Testing

#### Complete User Journey:
1. **Create URLs:**
   - Go to `http://localhost:3000`
   - Create 3-4 different URLs with various settings
   - Use both auto-generated and custom shortcodes

2. **Test Redirects:**
   - Copy each short URL
   - Open in new tabs/windows
   - Verify all redirect correctly
   - Test from different browsers/devices

3. **Check Analytics:**
   - Go to Statistics page
   - Verify all URLs are listed
   - Check click counts match your testing
   - Expand URLs to see detailed analytics

4. **Test Error Scenarios:**
   - Try accessing non-existent shortcodes
   - Test expired URLs
   - Verify proper error messages

### 4. Logging Integration Testing

**Check the console logs in both terminals:**

**Backend Terminal:**
- Look for logging messages like:
  ```
  [INFO] [backend] [controller] Create short URL request received
  [INFO] [backend] [service] Creating short URL for: https://example.com
  [INFO] [backend] [route] Create short URL route accessed
  ```

**Frontend Terminal:**
- Look for logging messages like:
  ```
  [INFO] [frontend] [component] URL shortened successfully
  [INFO] [frontend] [component] Statistics page loaded
  [INFO] [frontend] [component] Redirecting to backend for shortcode: test123
  ```

### 5. Performance Testing

**Test with Multiple Requests:**
```bash
# Test backend performance
for i in {1..10}; do
  curl -X POST http://localhost:5000/shorturls \
    -H "Content-Type: application/json" \
    -d "{\"url\": \"https://example$i.com\", \"validity\": 30}"
done
```

**Test Frontend Responsiveness:**
- Create many URLs quickly
- Navigate between pages rapidly
- Test with different screen sizes

## 🔍 Troubleshooting

### Common Issues:

1. **Port Already in Use:**
   ```bash
   # Kill processes on ports 3000 and 5000
   npx kill-port 3000 5000
   ```

2. **Backend Not Starting:**
   - Check if Node.js is installed: `node --version`
   - Verify dependencies: `cd url-shortener-backend && npm install`

3. **Frontend Not Starting:**
   - Check if React dependencies are installed: `cd url-shortener-app && npm install`
   - Clear cache: `npm start -- --reset-cache`

4. **API Calls Failing:**
   - Verify backend is running on port 5000
   - Check CORS settings
   - Verify network connectivity

5. **Logging Not Working:**
   - Check internet connection (logging API is external)
   - Verify auth token is valid
   - Check console for error messages

### Debug Mode:

**Backend Debug:**
```bash
cd url-shortener-backend
DEBUG=* npm run dev
```

**Frontend Debug:**
- Open browser developer tools
- Check Console tab for errors
- Check Network tab for failed requests

## 📊 Expected Results

### Successful Testing Should Show:

1. **Backend API:**
   - All endpoints responding correctly
   - Proper error handling
   - Logging messages in console
   - URLs being shortened and stored

2. **Frontend:**
   - Clean, responsive UI
   - URL shortening working
   - Statistics updating in real-time
   - Proper error messages
   - Smooth navigation

3. **Integration:**
   - Frontend successfully calling backend APIs
   - Redirects working properly
   - Analytics being tracked
   - Data persistence working

## 🎯 Test Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Health check endpoint responds
- [ ] URL shortening works with auto-generated codes
- [ ] URL shortening works with custom codes
- [ ] Error handling works for invalid inputs
- [ ] Statistics page displays URLs correctly
- [ ] Click tracking works
- [ ] Redirects work properly
- [ ] Expired URLs show appropriate messages
- [ ] Logging messages appear in console
- [ ] UI is responsive and user-friendly
- [ ] All navigation works correctly

## 🚀 Next Steps

After successful testing:
1. **Production Deployment:** Consider deploying to cloud platforms
2. **Database Integration:** Replace in-memory storage with a real database
3. **Authentication:** Add user authentication and authorization
4. **Rate Limiting:** Implement API rate limiting
5. **Monitoring:** Add application monitoring and alerting

---

**Happy Testing! 🎉**

If you encounter any issues during testing, check the troubleshooting section above or refer to the individual README files in each project directory. 