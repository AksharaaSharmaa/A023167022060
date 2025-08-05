# URL Shortener Web App

A React-based URL shortener application with comprehensive analytics and logging integration.

## Features

### ✅ **Core Functionality**
- **URL Shortening**: Shorten up to 5 URLs concurrently
- **Custom Shortcodes**: Optional custom shortcodes (3-10 alphanumeric characters)
- **Validity Period**: Configurable expiry time (default: 30 minutes)
- **Unique Shortcodes**: Automatic generation ensuring uniqueness
- **Client-side Routing**: Handles redirects for shortened URLs

### ✅ **Analytics & Statistics**
- **Click Tracking**: Track total clicks for each URL
- **Detailed Analytics**: Timestamp, source, and location for each click
- **Real-time Statistics**: Total URLs, clicks, active/expired counts
- **Expandable Details**: View detailed click data for each URL

### ✅ **User Experience**
- **Material UI Design**: Modern, responsive interface
- **Error Handling**: Comprehensive client-side validation
- **Copy to Clipboard**: One-click URL copying
- **Status Indicators**: Visual status for active/expired URLs
- **Responsive Design**: Works on desktop and mobile

### ✅ **Logging Integration**
- **Extensive Logging**: Uses custom logging middleware throughout
- **No Console Logging**: All logging goes through the middleware
- **Structured Logs**: Proper stack, level, package, and message format
- **API Integration**: Logs sent to test server

## Project Structure

```
url-shortener-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── UrlShortener.js      # Main URL shortening interface
│   │   ├── UrlStatistics.js     # Analytics and statistics page
│   │   └── RedirectHandler.js   # Handles short URL redirects
│   ├── logging-middleware/
│   │   └── index.js             # Logging middleware for API calls
│   ├── App.js                   # Main app with routing
│   └── index.js                 # App entry point
├── package.json
└── README.md
```

## Installation & Setup

### 1. Install Dependencies
```bash
cd url-shortener-app
npm install
```

### 2. Start the Application
```bash
npm start
```

The application will run on `http://localhost:3000`

## Usage

### **URL Shortener Page (`/`)**
1. **Add URLs**: Click "Add URL" to add up to 5 URL fields
2. **Enter Details**: 
   - Long URL (required)
   - Validity period in minutes (optional, default: 30)
   - Custom shortcode (optional)
3. **Validate**: Client-side validation ensures proper format
4. **Shorten**: Click "Shorten URLs" to generate short links
5. **Copy**: Use copy button to copy short URLs

### **Statistics Page (`/statistics`)**
1. **Overview Cards**: See total URLs, clicks, active/expired counts
2. **URL Table**: View all shortened URLs with details
3. **Expand Details**: Click expand button to see click analytics
4. **Actions**: Copy, open, or delete URLs

### **Short URL Redirects (`/:shortCode`)**
1. **Automatic Redirect**: Access short URLs to be redirected
2. **Click Tracking**: Each visit is tracked with analytics
3. **Expiry Check**: Expired URLs show error message

## Technical Implementation

### **Logging Middleware Integration**
The application extensively uses the custom logging middleware:

```javascript
import { Log } from '../logging-middleware/index.js';

// Examples of logging throughout the app:
Log("frontend", "info", "component", "URL Shortener component loaded");
Log("frontend", "error", "component", "Validation failed for URL shortening");
Log("frontend", "warn", "component", "User attempted to add more than 5 URL fields");
```

### **Data Persistence**
- Uses `localStorage` for client-side data persistence
- URLs and analytics persist across browser sessions
- Automatic cleanup of expired URLs

### **Validation**
- **URL Format**: Validates proper URL structure
- **Shortcode**: 3-10 alphanumeric characters
- **Validity**: 1-525600 minutes (max 1 year)
- **Uniqueness**: Ensures shortcodes are unique

### **Analytics Tracking**
- **Click Count**: Increments on each visit
- **Timestamp**: Exact time of each click
- **Source**: Referrer information
- **Location**: Geographic location (mock data for demo)

## API Compliance

### **Logging API**
- ✅ **Protected Route**: Uses Bearer token authentication
- ✅ **Lowercase Values**: All stack, level, package values in lowercase
- ✅ **Valid Packages**: Uses correct package names for frontend
- ✅ **Structured Format**: Proper JSON structure with timestamp

### **Frontend Packages Used**
- `component`: UI components
- `page`: Page navigation
- `state`: State management
- `utils`: Utility functions

## Requirements Met

### ✅ **Mandatory Requirements**
- **Logging Integration**: Extensive use of custom middleware
- **React Application**: Built with React 18
- **No Authentication**: Pre-authorized users (no login required)
- **Unique Short Links**: Automatic uniqueness management
- **30-minute Default**: Default validity period
- **Custom Shortcodes**: Optional user-provided codes
- **Client-side Routing**: Handles redirects properly

### ✅ **General Requirements**
- **Error Handling**: Robust client-side validation
- **localhost:3000**: Runs on specified port
- **User Experience**: Clean, uncluttered UI
- **Material UI**: Uses Material UI framework
- **No Other Libraries**: Only Material UI and React

### ✅ **URL Shortener Page**
- **5 URLs Concurrently**: Add up to 5 URL fields
- **Optional Fields**: Validity and custom shortcode
- **Client-side Validation**: Comprehensive input validation
- **Results Display**: Shows shortened URLs with expiry dates

### ✅ **Statistics Page**
- **All URLs Listed**: Displays all created URLs
- **Creation/Expiry Dates**: Shows timestamps
- **Click Counts**: Total clicks per URL
- **Detailed Analytics**: Expandable click data
- **Source/Location**: Click source and geographic data

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Development Notes

- **No Backend Required**: Fully client-side implementation
- **localStorage**: Data persistence across sessions
- **Mock Analytics**: Location data is simulated
- **Responsive**: Mobile-friendly design
- **Accessible**: Proper ARIA labels and keyboard navigation

## Future Enhancements

- Real geolocation API integration
- QR code generation for short URLs
- Bulk URL import/export
- Advanced analytics charts
- URL categories/tags
- Password protection for URLs 