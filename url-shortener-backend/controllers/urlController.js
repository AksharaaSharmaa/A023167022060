import { UrlService } from '../services/urlService.js';
import { Log } from '../logging-middleware/index.js';

/**
 * URL Controller - Handles HTTP requests and responses
 */
export class UrlController {

  /**
   * Create Short URL - POST /shorturls
   */
  static async createShortUrl(req, res) {
    try {
      await Log("backend", "info", "controller", "Create short URL request received");
      
      const { url, validity = 30, shortcode } = req.body;

      // Validate required fields
      if (!url) {
        await Log("backend", "error", "controller", "Missing required field: url");
        return res.status(400).json({
          error: 'URL is required'
        });
      }

      // Create short URL
      const result = await UrlService.createShortUrl(url, validity, shortcode);
      
      await Log("backend", "info", "controller", `Short URL created successfully: ${result.shortLink}`);
      
      // Return 201 Created with the result
      res.status(201).json(result);

    } catch (error) {
      await Log("backend", "error", "controller", `Failed to create short URL: ${error.message}`);
      
      // Handle specific error types
      if (error.message.includes('Invalid URL format')) {
        return res.status(400).json({
          error: 'Invalid URL format'
        });
      }
      
      if (error.message.includes('Validity must be between')) {
        return res.status(400).json({
          error: error.message
        });
      }
      
      if (error.message.includes('Invalid shortcode format')) {
        return res.status(400).json({
          error: error.message
        });
      }
      
      if (error.message.includes('Shortcode already exists')) {
        return res.status(409).json({
          error: error.message
        });
      }

      // Generic error
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get URL Statistics - GET /shorturls/:shortcode
   */
  static async getUrlStatistics(req, res) {
    try {
      const { shortcode } = req.params;
      
      await Log("backend", "info", "controller", `Statistics request received for shortcode: ${shortcode}`);

      // Get statistics
      const statistics = await UrlService.getUrlStatistics(shortcode);
      
      await Log("backend", "info", "controller", `Statistics retrieved successfully for: ${shortcode}`);
      
      res.status(200).json(statistics);

    } catch (error) {
      await Log("backend", "error", "controller", `Failed to get statistics: ${error.message}`);
      
      if (error.message === 'URL not found') {
        return res.status(404).json({
          error: 'URL not found'
        });
      }

      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * Redirect to Original URL - GET /:shortcode
   */
  static async redirectToUrl(req, res) {
    try {
      const { shortcode } = req.params;
      
      await Log("backend", "info", "controller", `Redirect request received for shortcode: ${shortcode}`);

      // Get URL entry
      const urlEntry = await UrlService.getUrlByShortcode(shortcode);
      
      // Track click analytics
      const source = req.get('Referrer') || 'Direct';
      const userAgent = req.get('User-Agent') || '';
      
      // Simple location detection (in production, use IP geolocation)
      let location = 'Unknown';
      if (userAgent.includes('Mobile')) {
        location = 'Mobile Device';
      } else if (userAgent.includes('Windows')) {
        location = 'Windows Desktop';
      } else if (userAgent.includes('Mac')) {
        location = 'Mac Desktop';
      } else if (userAgent.includes('Linux')) {
        location = 'Linux Desktop';
      }

      // Track click asynchronously (don't wait for it)
      UrlService.trackClick(shortcode, source, location);
      
      await Log("backend", "info", "controller", `Redirecting ${shortcode} to: ${urlEntry.originalUrl}`);
      
      // Redirect to original URL
      res.redirect(urlEntry.originalUrl);

    } catch (error) {
      await Log("backend", "error", "controller", `Failed to redirect: ${error.message}`);
      
      if (error.message === 'URL not found') {
        return res.status(404).json({
          error: 'URL not found'
        });
      }
      
      if (error.message === 'URL has expired') {
        return res.status(410).json({
          error: 'URL has expired'
        });
      }

      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * Health Check - GET /health
   */
  static async healthCheck(req, res) {
    try {
      await Log("backend", "info", "controller", "Health check request received");
      
      res.status(200).json({
        status: 'OK',
        message: 'URL Shortener Microservice is running',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      await Log("backend", "error", "controller", `Health check failed: ${error.message}`);
      
      res.status(500).json({
        status: 'ERROR',
        message: 'Service is not healthy',
        timestamp: new Date().toISOString()
      });
    }
  }
} 