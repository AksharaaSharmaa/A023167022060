import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
  Alert,
  Grid,
  Button
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ContentCopy as CopyIcon,
  OpenInNew as OpenIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Log } from '../logging-middleware/index.js';

const UrlStatistics = () => {
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [stats, setStats] = useState({
    totalUrls: 0,
    totalClicks: 0,
    activeUrls: 0,
    expiredUrls: 0
  });

  useEffect(() => {
    Log("frontend", "info", "component", "URL Statistics component loaded");
    loadUrls();
  }, []);

  const loadUrls = async () => {
    try {
      const stored = localStorage.getItem('shortenedUrls');
      if (stored) {
        const urls = JSON.parse(stored);
        
        // Fetch updated statistics from backend for each URL
        const updatedUrls = await Promise.all(
          urls.map(async (url) => {
            try {
              const response = await fetch(`http://localhost:5000/shorturls/${url.shortCode}`);
              if (response.ok) {
                const stats = await response.json();
                return {
                  ...url,
                  clicks: stats.clicks,
                  clickData: stats.clickData || []
                };
              }
            } catch (error) {
              Log("frontend", "warn", "component", `Failed to fetch stats for ${url.shortCode}: ${error.message}`);
            }
            return url;
          })
        );
        
        setShortenedUrls(updatedUrls);
        calculateStats(updatedUrls);
        Log("frontend", "info", "component", `Loaded ${updatedUrls.length} URLs from storage with updated stats`);
      }
    } catch (error) {
      Log("frontend", "error", "component", `Failed to load URLs: ${error.message}`);
    }
  };

  const calculateStats = (urls) => {
    const now = new Date();
    const stats = {
      totalUrls: urls.length,
      totalClicks: urls.reduce((sum, url) => sum + url.clicks, 0),
      activeUrls: urls.filter(url => new Date(url.expiresAt) > now).length,
      expiredUrls: urls.filter(url => new Date(url.expiresAt) <= now).length
    };
    setStats(stats);
  };

  const toggleRowExpansion = (urlId) => {
    setExpandedRows(prev => ({
      ...prev,
      [urlId]: !prev[urlId]
    }));
    Log("frontend", "info", "component", `Toggled expansion for URL ${urlId}`);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Log("frontend", "info", "component", `Copied to clipboard: ${text}`);
  };

  const openUrl = (url) => {
    window.open(url, '_blank');
    Log("frontend", "info", "component", `Opened URL: ${url}`);
  };

  const deleteUrl = (urlId) => {
    const updatedUrls = shortenedUrls.filter(url => url.id !== urlId);
    setShortenedUrls(updatedUrls);
    localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
    calculateStats(updatedUrls);
    Log("frontend", "info", "component", `Deleted URL ${urlId}`);
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getClickSource = (click) => {
    return click.source || 'Direct';
  };

  const getLocation = (click) => {
    return click.location || 'Unknown';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        URL Statistics
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Analytics and insights for all your shortened URLs
      </Typography>

      {shortenedUrls.length === 0 ? (
        <Alert severity="info">
          No shortened URLs found. Create some URLs on the main page to see statistics here.
        </Alert>
      ) : (
        <>
          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total URLs
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalUrls}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total Clicks
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalClicks}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Active URLs
                  </Typography>
                  <Typography variant="h4" component="div" color="success.main">
                    {stats.activeUrls}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Expired URLs
                  </Typography>
                  <Typography variant="h4" component="div" color="error.main">
                    {stats.expiredUrls}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* URLs Table */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                All Shortened URLs
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Short URL</TableCell>
                      <TableCell>Original URL</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Expires</TableCell>
                      <TableCell>Clicks</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {shortenedUrls.map((url) => (
                      <React.Fragment key={url.id}>
                        <TableRow>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="body2" color="primary">
                                {url.shortUrl}
                              </Typography>
                              <Tooltip title="Copy URL">
                                <IconButton 
                                  size="small" 
                                  onClick={() => copyToClipboard(url.shortUrl)}
                                >
                                  <CopyIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  maxWidth: 200, 
                                  overflow: 'hidden', 
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {url.longUrl}
                              </Typography>
                              <Tooltip title="Open URL">
                                <IconButton 
                                  size="small" 
                                  onClick={() => openUrl(url.longUrl)}
                                >
                                  <OpenIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                          <TableCell>{formatDate(url.createdAt)}</TableCell>
                          <TableCell>{formatDate(url.expiresAt)}</TableCell>
                          <TableCell>{url.clicks}</TableCell>
                          <TableCell>
                            <Chip 
                              label={isExpired(url.expiresAt) ? "Expired" : "Active"}
                              color={isExpired(url.expiresAt) ? "error" : "success"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box display="flex" gap={1}>
                              <Tooltip title="View Details">
                                <IconButton 
                                  size="small" 
                                  onClick={() => toggleRowExpansion(url.id)}
                                >
                                  {expandedRows[url.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete URL">
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => deleteUrl(url.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                        
                        {/* Expanded Row with Click Details */}
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                            <Collapse in={expandedRows[url.id]} timeout="auto" unmountOnExit>
                              <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                  Click Analytics
                                </Typography>
                                {url.clickData && url.clickData.length > 0 ? (
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Timestamp</TableCell>
                                        <TableCell>Source</TableCell>
                                        <TableCell>Location</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {url.clickData.map((click, index) => (
                                        <TableRow key={index}>
                                          <TableCell>{formatDate(click.timestamp)}</TableCell>
                                          <TableCell>{getClickSource(click)}</TableCell>
                                          <TableCell>{getLocation(click)}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                ) : (
                                  <Typography variant="body2" color="text.secondary">
                                    No clicks recorded yet.
                                  </Typography>
                                )}
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default UrlStatistics; 