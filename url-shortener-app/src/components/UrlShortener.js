import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { Log } from '../logging-middleware/index.js';

const UrlShortener = () => {
  const [urls, setUrls] = useState([
    { id: 1, longUrl: '', validity: 30, shortCode: '', isSubmitted: false }
  ]);
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    Log("frontend", "info", "component", "URL Shortener component loaded");
  }, []);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateShortCode = (code) => {
    if (!code) return true; // Optional field
    return /^[a-zA-Z0-9]{3,10}$/.test(code);
  };

  const validateValidity = (minutes) => {
    return minutes > 0 && minutes <= 525600; // Max 1 year
  };

  const addUrlField = () => {
    if (urls.length >= 5) {
      Log("frontend", "warn", "component", "User attempted to add more than 5 URL fields");
      return;
    }
    
    const newId = Math.max(...urls.map(u => u.id)) + 1;
    setUrls([...urls, { 
      id: newId, 
      longUrl: '', 
      validity: 30, 
      shortCode: '', 
      isSubmitted: false 
    }]);
    
    Log("frontend", "info", "component", `Added URL field ${newId}`);
  };

  const removeUrlField = (id) => {
    setUrls(urls.filter(url => url.id !== id));
    setShortenedUrls(shortenedUrls.filter(url => url.originalId !== id));
    Log("frontend", "info", "component", `Removed URL field ${id}`);
  };

  const updateUrl = (id, field, value) => {
    setUrls(urls.map(url => 
      url.id === id ? { ...url, [field]: value } : url
    ));
    
    // Clear errors when user starts typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: { ...prev[id], [field]: '' } }));
    }
  };

  const validateAll = () => {
    const newErrors = {};
    let isValid = true;

    urls.forEach(url => {
      if (!url.longUrl.trim()) {
        newErrors[url.id] = { ...newErrors[url.id], longUrl: 'URL is required' };
        isValid = false;
      } else if (!validateUrl(url.longUrl)) {
        newErrors[url.id] = { ...newErrors[url.id], longUrl: 'Please enter a valid URL' };
        isValid = false;
      }

      if (!validateValidity(url.validity)) {
        newErrors[url.id] = { ...newErrors[url.id], validity: 'Validity must be between 1 and 525600 minutes' };
        isValid = false;
      }

      if (!validateShortCode(url.shortCode)) {
        newErrors[url.id] = { ...newErrors[url.id], shortCode: 'Shortcode must be 3-10 alphanumeric characters' };
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const shortenUrls = async () => {
    Log("frontend", "info", "component", "Starting URL shortening process");
    
    if (!validateAll()) {
      Log("frontend", "error", "component", "Validation failed for URL shortening");
      return;
    }

    const newShortenedUrls = [];
    
    for (const url of urls) {
      if (!url.longUrl.trim()) continue;
      
      try {
        // Call backend API to create short URL
        const response = await fetch('http://localhost:5000/shorturls', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: url.longUrl,
            validity: parseInt(url.validity),
            shortcode: url.shortCode || undefined
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create short URL');
        }

        const result = await response.json();
        
        // Extract shortcode from the returned shortLink
        const shortCode = result.shortLink.split('/').pop();
        
        const shortenedUrl = {
          id: Date.now() + Math.random(),
          originalId: url.id,
          longUrl: url.longUrl,
          shortCode: shortCode,
          shortUrl: result.shortLink,
          createdAt: new Date().toISOString(),
          expiresAt: result.expiry,
          clicks: 0,
          clickData: []
        };
        
        newShortenedUrls.push(shortenedUrl);
        
        // Mark as submitted
        setUrls(prev => prev.map(u => 
          u.id === url.id ? { ...u, isSubmitted: true } : u
        ));
        
        Log("frontend", "info", "component", `Successfully shortened URL: ${url.longUrl} -> ${shortCode}`);
        
      } catch (error) {
        Log("frontend", "error", "component", `Failed to shorten URL: ${error.message}`);
        setErrors(prev => ({ 
          ...prev, 
          [url.id]: { ...prev[url.id], general: error.message } 
        }));
      }
    }
    
    setShortenedUrls(prev => [...prev, ...newShortenedUrls]);
    setSuccessMessage(`Successfully shortened ${newShortenedUrls.length} URL(s)!`);
    
    // Store in localStorage for persistence
    const allUrls = [...shortenedUrls, ...newShortenedUrls];
    localStorage.setItem('shortenedUrls', JSON.stringify(allUrls));
    
    Log("frontend", "info", "component", `URL shortening completed. Total URLs: ${allUrls.length}`);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Log("frontend", "info", "component", `Copied to clipboard: ${text}`);
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Shorten up to 5 URLs at once. Each URL will expire in 30 minutes by default.
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">URLs to Shorten</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addUrlField}
              disabled={urls.length >= 5}
            >
              Add URL ({urls.length}/5)
            </Button>
          </Box>

          {urls.map((url, index) => (
            <Box key={url.id} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">URL #{index + 1}</Typography>
                {urls.length > 1 && (
                  <IconButton 
                    color="error" 
                    onClick={() => removeUrlField(url.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Long URL"
                    value={url.longUrl}
                    onChange={(e) => updateUrl(url.id, 'longUrl', e.target.value)}
                    error={!!errors[url.id]?.longUrl}
                    helperText={errors[url.id]?.longUrl}
                    placeholder="https://example.com/very-long-url"
                    disabled={url.isSubmitted}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Validity (minutes)"
                    type="number"
                    value={url.validity}
                    onChange={(e) => updateUrl(url.id, 'validity', e.target.value)}
                    error={!!errors[url.id]?.validity}
                    helperText={errors[url.id]?.validity}
                    inputProps={{ min: 1, max: 525600 }}
                    disabled={url.isSubmitted}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Custom Shortcode (optional)"
                    value={url.shortCode}
                    onChange={(e) => updateUrl(url.id, 'shortCode', e.target.value)}
                    error={!!errors[url.id]?.shortCode}
                    helperText={errors[url.id]?.shortCode}
                    placeholder="abc123"
                    disabled={url.isSubmitted}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}

          <Button
            variant="contained"
            size="large"
            onClick={shortenUrls}
            disabled={urls.every(url => !url.longUrl.trim())}
            startIcon={<LinkIcon />}
            fullWidth
          >
            Shorten URLs
          </Button>
        </CardContent>
      </Card>

      {shortenedUrls.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Shortened URLs
            </Typography>
            <Grid container spacing={2}>
              {shortenedUrls.map((shortUrl) => (
                <Grid item xs={12} key={shortUrl.id}>
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle2" color="primary">
                        {shortUrl.shortUrl}
                      </Typography>
                      <Tooltip title="Copy URL">
                        <IconButton 
                          size="small" 
                          onClick={() => copyToClipboard(shortUrl.shortUrl)}
                        >
                          <CopyIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {shortUrl.longUrl}
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Chip 
                        label={`Expires: ${new Date(shortUrl.expiresAt).toLocaleString()}`}
                        color={isExpired(shortUrl.expiresAt) ? "error" : "default"}
                        size="small"
                      />
                      <Chip 
                        label={`Clicks: ${shortUrl.clicks}`}
                        color="primary"
                        size="small"
                      />
                      <Chip 
                        label={`Created: ${new Date(shortUrl.createdAt).toLocaleString()}`}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default UrlShortener; 