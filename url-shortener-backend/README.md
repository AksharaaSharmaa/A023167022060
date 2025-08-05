# URL Shortener Backend Microservice

A robust HTTP URL Shortener Microservice built with Node.js and Express, featuring comprehensive analytics and mandatory logging integration.

## 🚀 Features

### ✅ **Core Functionality**
- **URL Shortening**: Create shortened URLs with custom or auto-generated shortcodes
- **Custom Shortcodes**: Optional user-provided shortcodes (3-10 alphanumeric characters)
- **Validity Period**: Configurable expiry time (default: 30 minutes)
- **Unique Shortcodes**: Automatic generation ensuring global uniqueness
- **Redirection**: Automatic redirects to original URLs

### ✅ **Analytics & Statistics**
- **Click Tracking**: Track total clicks for each URL
- **Detailed Analytics**: Timestamp, source, and location for each click
- **Real-time Statistics**: Comprehensive analytics API endpoint
- **Geographic Data**: Basic location detection from User-Agent

### ✅ **Logging Integration**
- **Mandatory Logging**: Extensively uses custom logging middleware
- **No Console Logging**: All logging goes through the middleware
- **Structured Logs**: Proper stack, level, package, and message format
- **API Integration**: Logs sent to test server with authentication

### ✅ **Error Handling**
- **Robust Validation**: Comprehensive input validation
- **HTTP Status Codes**: Appropriate status codes for all scenarios
- **Descriptive Errors**: Clear error messages for debugging
- **Global Error Handler**: Centralized error handling

## 📋 API Endpoints

### **1. Create Short URL**
```
POST /shorturls
Content-Type: application/json

{
  "url": "https://very-long-url.com/with/many/parameters",
  "validity": 30,
  "shortcode": "abc123"
}
```

**Response (201 Created):**
```json
{
  "shortLink": "http://localhost:5000/abc123",
  "expiry": "2025-01-01T00:30:00Z"
}
```

### **2. Get URL Statistics**
```
GET /shorturls/:shortcode
```

**Response (200 OK):**
```json
{
  "shortcode": "abc123",
  "originalUrl": "https://very-long-url.com/with/many/parameters",
  "createdAt": "2025-01-01T00:00:00Z",
  "expiresAt": "2025-01-01T00:30:00Z",
  "clicks": 5,
  "clickData": [
    {
      "timestamp": "2025-01-01T00:15:00Z",
      "source": "Direct",
      "location": "Windows Desktop"
    }
  ]
}
```

### **3. Redirect to Original URL**
```
GET /:shortcode
```

**Response:** HTTP 302 Redirect to original URL

### **4. Health Check**
```
GET /health
```

**Response (200 OK):**
```json
{
  "status": "OK",
  "message": "URL Shortener Microservice is running",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

## 🏗️ Project Structure

```
url-shortener-backend/
├── logging-middleware/
│   └── index.js              # Custom logging middleware
├── services/
│   └── urlService.js         # Business logic for URL operations
├── controllers/
│   └── urlController.js      # HTTP request/response handling
├── routes/
│   └── urlRoutes.js          # API route definitions
├── server.js                 # Main server file
├── package.json
└── README.md
```

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
cd url-shortener-backend
npm install
```

### 2. Start the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## 🔧 Configuration

### Environment Variables
- `PORT`: Server port (default: 5000)

### Logging Configuration
- **Stack**: `backend` (for all backend operations)
- **Levels**: `debug`, `info`, `warn`, `error`, `fatal`
- **Packages**: `service`, `controller`, `route`, `middleware`, `config`

## 📊 Data Storage

### Current Implementation
- **In-Memory Storage**: Uses Map for URL storage
- **Automatic Cleanup**: Expired URLs cleaned up every hour
- **Production Ready**: Can be easily replaced with database

### Data Structure
```javascript
{
  id: "unique-id",
  originalUrl: "https://example.com",
  shortcode: "abc123",
  createdAt: "2025-01-01T00:00:00Z",
  expiresAt: "2025-01-01T00:30:00Z",
  clicks: 0,
  clickData: []
}
```

## 🔒 Security & Validation

### URL Validation
- Validates proper URL format
- Supports HTTP and HTTPS protocols
- Handles complex URLs with parameters

### Shortcode Validation
- 3-10 alphanumeric characters
- Case-sensitive uniqueness
- Collision detection and handling

### Validity Period
- Minimum: 1 minute
- Maximum: 525,600 minutes (1 year)
- Default: 30 minutes

## 🧪 Testing

### Manual Testing with curl

**Create Short URL:**
```bash
curl -X POST http://localhost:5000/shorturls \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/very-long-url",
    "validity": 30,
    "shortcode": "test123"
  }'
```

**Get Statistics:**
```bash
curl http://localhost:5000/shorturls/test123
```

**Redirect (in browser):**
```
http://localhost:5000/test123
```

## 🔄 Integration with Frontend

The backend is designed to work seamlessly with the React frontend:

1. **Frontend**: Sends POST requests to `/shorturls` to create URLs
2. **Frontend**: Fetches statistics from `/shorturls/:shortcode`
3. **Backend**: Handles all redirects and click tracking
4. **Shared Logging**: Both use the same logging middleware

## 📈 Analytics Features

### Click Tracking
- **Timestamp**: Exact time of each click
- **Source**: Referrer information (Direct, Google, etc.)
- **Location**: Basic geographic detection from User-Agent
- **Real-time Updates**: Statistics updated immediately

### Geographic Detection
- **Mobile Devices**: Detected from User-Agent
- **Desktop Platforms**: Windows, Mac, Linux detection
- **Extensible**: Can be enhanced with IP geolocation

## 🚨 Error Handling

### HTTP Status Codes
- **200**: Success
- **201**: Created (new short URL)
- **302**: Redirect (to original URL)
- **400**: Bad Request (validation errors)
- **404**: Not Found (URL doesn't exist)
- **409**: Conflict (shortcode already exists)
- **410**: Gone (URL expired)
- **500**: Internal Server Error

### Error Response Format
```json
{
  "error": "Error message",
  "message": "Additional details"
}
```

## 🔄 Maintenance

### Automatic Cleanup
- Expired URLs cleaned up every hour
- Memory usage optimized
- Graceful shutdown handling

### Monitoring
- Health check endpoint
- Comprehensive logging
- Error tracking and reporting

## 🚀 Production Considerations

### Database Integration
Replace in-memory storage with:
- **MongoDB**: For document-based storage
- **PostgreSQL**: For relational data
- **Redis**: For high-performance caching

### Scaling
- **Load Balancing**: Multiple server instances
- **Caching**: Redis for frequently accessed URLs
- **CDN**: For global distribution

### Security
- **Rate Limiting**: Prevent abuse
- **Input Sanitization**: Enhanced validation
- **HTTPS**: Secure communication
- **API Keys**: Authentication for admin operations

## 📝 Logging Examples

The service extensively logs all operations:

```
[INFO] [backend] [service] Creating short URL for: https://example.com
[INFO] [backend] [service] Generated shortcode: abc123
[INFO] [backend] [service] Successfully created short URL: abc123 -> https://example.com
[INFO] [backend] [controller] Create short URL request received
[INFO] [backend] [route] Create short URL route accessed
[INFO] [backend] [middleware] POST /shorturls - ::1
```

## ✅ Requirements Compliance

### Mandatory Requirements
- ✅ **Logging Integration**: Extensive use of custom middleware
- ✅ **Microservice Architecture**: Single service handling all endpoints
- ✅ **No Authentication**: Pre-authorized users (no login required)
- ✅ **Unique Short Links**: Global uniqueness ensured
- ✅ **30-minute Default**: Default validity period
- ✅ **Custom Shortcodes**: Optional user-provided codes
- ✅ **Redirection**: Proper HTTP redirects

### API Compliance
- ✅ **POST /shorturls**: Creates shortened URLs
- ✅ **GET /shorturls/:shortcode**: Returns statistics
- ✅ **GET /:shortcode**: Redirects to original URL
- ✅ **Proper Status Codes**: 201, 200, 302, 404, 410, etc.
- ✅ **JSON Responses**: Structured API responses
- ✅ **Error Handling**: Comprehensive error responses 