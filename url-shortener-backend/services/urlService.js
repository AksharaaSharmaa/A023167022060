import { nanoid } from 'nanoid';
import { Log } from '../logging-middleware/index.js';

// In-memory storage (in production, this would be a database)
const urlDatabase = new Map();

/**
 * URL Service - Handles URL shortening, validation, and analytics
 */
export class UrlService {
  
  /**
   * Create a new shortened URL
   */
  static async createShortUrl(url, validity = 30, shortcode = null) {
    try {
      await Log("backend", "info", "service", `Creating short URL for: ${url}`);
      
      // Validate URL
      if (!this.isValidUrl(url)) {
        await Log("backend", "error", "service", `Invalid URL provided: ${url}`);
        throw new Error('Invalid URL format');
      }

      // Validate validity period
      if (validity <= 0 || validity > 525600) { // Max 1 year
        await Log("backend", "error", "service", `Invalid validity period: ${validity} minutes`);
        throw new Error('Validity must be between 1 and 525600 minutes');
      }

      // Generate or validate shortcode
      let finalShortcode = shortcode;
      if (shortcode) {
        if (!this.isValidShortcode(shortcode)) {
          await Log("backend", "error", "service", `Invalid shortcode format: ${shortcode}`);
          throw new Error('Shortcode must be 3-10 alphanumeric characters');
        }
        
        if (urlDatabase.has(shortcode)) {
          await Log("backend", "error", "service", `Shortcode collision: ${shortcode}`);
          throw new Error('Shortcode already exists');
        }
      } else {
        finalShortcode = this.generateUniqueShortcode();
        await Log("backend", "info", "service", `Generated shortcode: ${finalShortcode}`);
      }

      // Calculate expiry time
      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + validity);

      // Create URL entry
      const urlEntry = {
        id: nanoid(),
        originalUrl: url,
        shortcode: finalShortcode,
        createdAt: new Date().toISOString(),
        expiresAt: expiryDate.toISOString(),
        clicks: 0,
        clickData: []
      };

      // Store in database
      urlDatabase.set(finalShortcode, urlEntry);
      
      await Log("backend", "info", "service", `Successfully created short URL: ${finalShortcode} -> ${url}`);
      
      return {
        shortLink: `http://localhost:5000/${finalShortcode}`,
        expiry: expiryDate.toISOString()
      };

    } catch (error) {
      await Log("backend", "error", "service", `Failed to create short URL: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get URL by shortcode
   */
  static async getUrlByShortcode(shortcode) {
    try {
      await Log("backend", "info", "service", `Looking up URL for shortcode: ${shortcode}`);
      
      const urlEntry = urlDatabase.get(shortcode);
      
      if (!urlEntry) {
        await Log("backend", "error", "service", `Shortcode not found: ${shortcode}`);
        throw new Error('URL not found');
      }

      // Check if URL is expired
      if (new Date(urlEntry.expiresAt) < new Date()) {
        await Log("backend", "warn", "service", `Expired URL accessed: ${shortcode}`);
        throw new Error('URL has expired');
      }

      await Log("backend", "info", "service", `Found URL for shortcode: ${shortcode}`);
      return urlEntry;

    } catch (error) {
      await Log("backend", "error", "service", `Failed to get URL: ${error.message}`);
      throw error;
    }
  }

  /**
   * Track click analytics
   */
  static async trackClick(shortcode, source = 'Direct', location = 'Unknown') {
    try {
      await Log("backend", "info", "service", `Tracking click for shortcode: ${shortcode}`);
      
      const urlEntry = urlDatabase.get(shortcode);
      
      if (!urlEntry) {
        await Log("backend", "error", "service", `Cannot track click - shortcode not found: ${shortcode}`);
        return;
      }

      // Update click count
      urlEntry.clicks += 1;

      // Add click data
      const clickData = {
        timestamp: new Date().toISOString(),
        source: source,
        location: location
      };

      urlEntry.clickData.push(clickData);

      // Update database
      urlDatabase.set(shortcode, urlEntry);
      
      await Log("backend", "info", "service", `Click tracked for ${shortcode}: ${source} from ${location}`);

    } catch (error) {
      await Log("backend", "error", "service", `Failed to track click: ${error.message}`);
    }
  }

  /**
   * Get URL statistics
   */
  static async getUrlStatistics(shortcode) {
    try {
      await Log("backend", "info", "service", `Getting statistics for shortcode: ${shortcode}`);
      
      const urlEntry = urlDatabase.get(shortcode);
      
      if (!urlEntry) {
        await Log("backend", "error", "service", `Shortcode not found for statistics: ${shortcode}`);
        throw new Error('URL not found');
      }

      const statistics = {
        shortcode: urlEntry.shortcode,
        originalUrl: urlEntry.originalUrl,
        createdAt: urlEntry.createdAt,
        expiresAt: urlEntry.expiresAt,
        clicks: urlEntry.clicks,
        clickData: urlEntry.clickData
      };

      await Log("backend", "info", "service", `Retrieved statistics for ${shortcode}: ${urlEntry.clicks} clicks`);
      return statistics;

    } catch (error) {
      await Log("backend", "error", "service", `Failed to get statistics: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate URL format
   */
  static isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate shortcode format
   */
  static isValidShortcode(shortcode) {
    return /^[a-zA-Z0-9]{3,10}$/.test(shortcode);
  }

  /**
   * Generate unique shortcode
   */
  static generateUniqueShortcode() {
    let shortcode;
    do {
      shortcode = nanoid(6); // Generate 6-character shortcode
    } while (urlDatabase.has(shortcode));
    
    return shortcode;
  }

  /**
   * Clean up expired URLs (utility method)
   */
  static async cleanupExpiredUrls() {
    try {
      const now = new Date();
      let cleanedCount = 0;

      for (const [shortcode, urlEntry] of urlDatabase.entries()) {
        if (new Date(urlEntry.expiresAt) < now) {
          urlDatabase.delete(shortcode);
          cleanedCount++;
        }
      }

      if (cleanedCount > 0) {
        await Log("backend", "info", "service", `Cleaned up ${cleanedCount} expired URLs`);
      }

    } catch (error) {
      await Log("backend", "error", "service", `Failed to cleanup expired URLs: ${error.message}`);
    }
  }
} 