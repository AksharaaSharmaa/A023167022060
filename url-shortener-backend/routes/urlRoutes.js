import express from 'express';
import { UrlController } from '../controllers/urlController.js';
import { Log } from '../logging-middleware/index.js';

const router = express.Router();

/**
 * URL Routes - Define API endpoints
 */

// Health check endpoint
router.get('/health', async (req, res) => {
  await Log("backend", "info", "route", "Health check route accessed");
  await UrlController.healthCheck(req, res);
});

// Create short URL - POST /shorturls
router.post('/shorturls', async (req, res) => {
  await Log("backend", "info", "route", "Create short URL route accessed");
  await UrlController.createShortUrl(req, res);
});

// Get URL statistics - GET /shorturls/:shortcode
router.get('/shorturls/:shortcode', async (req, res) => {
  await Log("backend", "info", "route", `Statistics route accessed for: ${req.params.shortcode}`);
  await UrlController.getUrlStatistics(req, res);
});

// Redirect to original URL - GET /:shortcode
router.get('/:shortcode', async (req, res) => {
  await Log("backend", "info", "route", `Redirect route accessed for: ${req.params.shortcode}`);
  await UrlController.redirectToUrl(req, res);
});

// 404 handler for undefined routes
router.use('*', async (req, res) => {
  await Log("backend", "warn", "route", `404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.method} ${req.originalUrl} does not exist`
  });
});

export default router; 