import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { OpenInNew as OpenIcon } from '@mui/icons-material';
import { Log } from '../logging-middleware/index.js';

const RedirectHandler = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [urlData, setUrlData] = useState(null);

  useEffect(() => {
    Log("frontend", "info", "component", `Redirect handler loaded for shortcode: ${shortCode}`);
    handleRedirect();
  }, [shortCode]);

  const handleRedirect = async () => {
    try {
      // Redirect to backend for proper handling
      Log("frontend", "info", "component", `Redirecting to backend for shortcode: ${shortCode}`);
      window.location.href = `http://localhost:5000/${shortCode}`;

    } catch (error) {
      Log("frontend", "error", "component", `Redirect error: ${error.message}`);
      setError('Failed to process redirect');
      setLoading(false);
    }
  };

  const trackClick = async (url) => {
    try {
      // Get user's location (simplified)
      const location = await getUserLocation();
      
      // Get referrer/source
      const source = document.referrer || 'Direct';
      
      const clickData = {
        timestamp: new Date().toISOString(),
        source: source,
        location: location
      };

      // Update stored data
      const stored = localStorage.getItem('shortenedUrls');
      const urls = JSON.parse(stored);
      const updatedUrls = urls.map(u => {
        if (u.id === url.id) {
          return {
            ...u,
            clicks: u.clicks + 1,
            clickData: [...(u.clickData || []), clickData]
          };
        }
        return u;
      });

      localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
      
      Log("frontend", "info", "component", `Click tracked for URL ${url.shortCode}: ${clickData.source} from ${clickData.location}`);
      
    } catch (error) {
      Log("frontend", "error", "component", `Failed to track click: ${error.message}`);
    }
  };

  const getUserLocation = async () => {
    try {
      // In a real app, you'd use a geolocation service
      // For demo purposes, return a mock location
      const locations = ['New York, USA', 'London, UK', 'Tokyo, Japan', 'Sydney, Australia', 'Toronto, Canada'];
      return locations[Math.floor(Math.random() * locations.length)];
    } catch (error) {
      return 'Unknown';
    }
  };

  const handleManualRedirect = () => {
    if (urlData) {
      Log("frontend", "info", "component", `Manual redirect to: ${urlData.longUrl}`);
      window.location.href = urlData.longUrl;
    }
  };

  const goHome = () => {
    Log("frontend", "info", "component", "User navigated back to home");
    navigate('/');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Card sx={{ maxWidth: 400, textAlign: 'center' }}>
          <CardContent>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Redirecting...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You will be redirected shortly
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Card sx={{ maxWidth: 400, textAlign: 'center' }}>
          <CardContent>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button variant="contained" onClick={goHome}>
              Go Home
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
      <Card sx={{ maxWidth: 400, textAlign: 'center' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Redirecting to:
          </Typography>
          <Typography variant="body2" color="primary" sx={{ mb: 2, wordBreak: 'break-all' }}>
            {urlData?.longUrl}
          </Typography>
          <Button
            variant="contained"
            startIcon={<OpenIcon />}
            onClick={handleManualRedirect}
            sx={{ mr: 1 }}
          >
            Go Now
          </Button>
          <Button variant="outlined" onClick={goHome}>
            Cancel
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RedirectHandler; 