# 🚀 URL Shortener Full Stack Application

A complete HTTP URL Shortener Microservice with React frontend and Node.js backend, featuring comprehensive analytics and mandatory logging integration.

## 📋 Project Overview

This project consists of two main components:

1. **Backend Microservice** (`url-shortener-backend/`) - Node.js/Express API
2. **Frontend Application** (`url-shortener-app/`) - React web interface

Both components extensively use the custom logging middleware to satisfy the mandatory logging integration requirement.

## 🏗️ Architecture

```
URL Shortener Project/
├── url-shortener-backend/          # Backend Microservice
│   ├── logging-middleware/         # Custom logging middleware
│   ├── services/                   # Business logic
│   ├── controllers/                # HTTP handlers
│   ├── routes/                     # API routes
│   ├── server.js                   # Main server
│   └── package.json
├── url-shortener-app/              # React Frontend
│   ├── src/
│   │   ├── components/             # React components
│   │   ├── logging-middleware/     # Frontend logging
│   │   └── App.js                  # Main app
│   └── package.json
├── start-backend.bat              # Backend launcher
├── start-url-shortener.bat        # Frontend launcher
├── start-both.bat                 # Full stack launcher
├── test-backend-api.js            # API testing script
└── README.md                      # This file
```

## 🚀 Quick Start

### Option 1: Start Both Services (Recommended)
```bash
# Windows
start-both.bat

# Manual (any OS)
cd url-shortener-backend && npm install && npm run dev
cd url-shortener-app && npm install && npm start
```

### Option 2: Start Services Separately
```bash
# Backend only
cd url-shortener-backend
npm install
npm run dev

# Frontend only (in new terminal)
cd url-shortener-app
npm install
npm start
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 📋 API Endpoints

### Backend Microservice API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/shorturls` | Create shortened URL |
| `GET` | `/shorturls/:shortcode` | Get URL statistics |
| `GET` | `/:shortcode` | Redirect to original URL |
| `GET` | `/health` | Health check |

### Example API Usage

**Create Short URL:**
```bash
curl -X POST http://localhost:5000/shorturls \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/very-long-url",
    "validity": 30,
    "shortcode": "abc123"
  }'
```

**Response:**
```json
{
  "shortLink": "http://localhost:5000/abc123",
  "expiry": "2025-01-01T00:30:00Z"
}
```

## ✅ Requirements Compliance

### Mandatory Requirements ✅
- **Logging Integration**: Extensive use of custom middleware throughout
- **Microservice Architecture**: Single backend service handling all endpoints
- **No Authentication**: Pre-authorized users (no login required)
- **Unique Short Links**: Global uniqueness ensured
- **30-minute Default**: Default validity period
- **Custom Shortcodes**: Optional user-provided codes
- **Redirection**: Proper HTTP redirects

### API Compliance ✅
- **POST /shorturls**: Creates shortened URLs with proper validation
- **GET /shorturls/:shortcode**: Returns comprehensive statistics
- **GET /:shortcode**: Redirects to original URL with click tracking
- **Proper Status Codes**: 201, 200, 302, 404, 410, 409, 400, 500
- **JSON Responses**: Structured API responses
- **Error Handling**: Comprehensive error responses

## 🔧 Features

### Backend Microservice
- **URL Shortening**: Create shortened URLs with custom or auto-generated shortcodes
- **Analytics**: Track clicks, timestamps, sources, and locations
- **Validation**: Comprehensive input validation and error handling
- **Logging**: Extensive logging integration with test server
- **Cleanup**: Automatic cleanup of expired URLs
- **Health Monitoring**: Health check endpoint

### Frontend Application
- **Modern UI**: Material UI design with responsive layout
- **URL Management**: Create up to 5 URLs concurrently
- **Statistics**: Real-time analytics and click tracking
- **Validation**: Client-side validation with error messages
- **Persistence**: Local storage for URL management
- **Logging**: Frontend logging integration

## 📊 Analytics & Statistics

### Click Tracking
- **Total Clicks**: Track number of visits per URL
- **Timestamps**: Exact time of each click
- **Sources**: Referrer information (Direct, Google, etc.)
- **Locations**: Basic geographic detection from User-Agent

### Statistics API
```json
{
  "shortcode": "abc123",
  "originalUrl": "https://example.com",
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

### Test Backend API
```bash
node test-backend-api.js
```

This script tests:
- Health check endpoint
- URL creation with custom shortcodes
- URL creation with auto-generated shortcodes
- Statistics retrieval
- Error handling (invalid URLs, duplicates, non-existent URLs)

### Manual Testing
1. **Start both services** using `start-both.bat`
2. **Open frontend** at http://localhost:3000
3. **Create URLs** using the web interface
4. **Test redirects** by clicking generated short URLs
5. **View statistics** in the Statistics tab

## 📝 Logging Integration

Both frontend and backend extensively use the custom logging middleware:

### Backend Logging Examples
```
[INFO] [backend] [service] Creating short URL for: https://example.com
[INFO] [backend] [service] Generated shortcode: abc123
[INFO] [backend] [controller] Create short URL request received
[INFO] [backend] [route] Create short URL route accessed
```

### Frontend Logging Examples
```
[INFO] [frontend] [component] URL Shortener component loaded
[INFO] [frontend] [component] Starting URL shortening process
[INFO] [frontend] [page] User navigated to: /statistics
```

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

## 🔄 Integration Flow

1. **Frontend** sends POST requests to `/shorturls` to create URLs
2. **Backend** validates input, generates shortcodes, and stores data
3. **Frontend** displays shortened URLs to users
4. **Users** click short URLs, triggering redirects
5. **Backend** tracks clicks and redirects to original URLs
6. **Frontend** fetches updated statistics from `/shorturls/:shortcode`

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

## 📋 Development Notes

### Backend Development
- **ES Modules**: Uses `"type": "module"` for modern JavaScript
- **Async/Await**: Full async support throughout
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Logging**: Every operation is logged to the test server

### Frontend Development
- **React 18**: Latest React features
- **Material UI**: Modern, responsive design
- **React Router**: Client-side routing
- **Local Storage**: Data persistence across sessions

## 🎯 Key Achievements

### Technical Excellence
- ✅ **Microservice Architecture**: Clean separation of concerns
- ✅ **RESTful API**: Proper HTTP methods and status codes
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Validation**: Robust input validation
- ✅ **Logging**: Extensive logging integration

### User Experience
- ✅ **Modern UI**: Material UI design
- ✅ **Responsive Design**: Works on all devices
- ✅ **Real-time Updates**: Live statistics
- ✅ **Intuitive Interface**: Easy to use

### Production Ready
- ✅ **Scalable**: Easy to scale horizontally
- ✅ **Maintainable**: Clean code structure
- ✅ **Testable**: Comprehensive testing
- ✅ **Documented**: Complete documentation

## 🚀 Getting Started

1. **Clone/Download** the project
2. **Run** `start-both.bat` (Windows) or follow manual instructions
3. **Open** http://localhost:3000 in your browser
4. **Start** creating shortened URLs!

## 📞 Support

For any issues or questions:
- Check the individual README files in each component
- Review the API documentation
- Test the backend API using the provided test script
- Check the console logs for debugging information

---

**Built with ❤️ for the Afford Medical Technologies evaluation** 