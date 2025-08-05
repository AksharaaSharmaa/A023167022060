import express from 'express';
import cors from 'cors';
import urlRoutes from './routes/urlRoutes.js';
import { Log } from './logging-middleware/index.js';
import { UrlService } from './services/urlService.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(async (req, res, next) => {
  await Log("backend", "info", "middleware", `${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Routes
app.use('/', urlRoutes);

// Global error handler
app.use(async (error, req, res, next) => {
  await Log("backend", "error", "middleware", `Global error: ${error.message}`);
  
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on the server'
  });
});

// Start server
app.listen(PORT, async () => {
  await Log("backend", "info", "config", `URL Shortener Microservice started on port ${PORT}`);
  console.log(`🚀 URL Shortener Microservice running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Create short URL: POST http://localhost:${PORT}/shorturls`);
  console.log(`📈 Get statistics: GET http://localhost:${PORT}/shorturls/:shortcode`);
  console.log(`🔄 Redirect: GET http://localhost:${PORT}/:shortcode`);
});

// Cleanup expired URLs every hour
setInterval(async () => {
  await UrlService.cleanupExpiredUrls();
}, 60 * 60 * 1000); // 1 hour

// Graceful shutdown
process.on('SIGTERM', async () => {
  await Log("backend", "info", "config", "Server shutting down gracefully");
  console.log('🛑 Server shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  await Log("backend", "info", "config", "Server interrupted, shutting down");
  console.log('🛑 Server interrupted, shutting down...');
  process.exit(0);
}); 