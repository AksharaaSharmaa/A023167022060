import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link, ContentCopy, Analytics } from '@mui/icons-material';
import UrlShortener from './components/UrlShortener';
import UrlStatistics from './components/UrlStatistics';
import RedirectHandler from './components/RedirectHandler';
import { Log } from './logging-middleware/index.js';
import './styles.css';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Log page navigation
    Log("frontend", "info", "page", `User navigated to: ${location.pathname}`);
  }, [location]);

  const handleNavigation = (path) => {
    Log("frontend", "info", "component", `Navigation button clicked: ${path}`);
  };

  return (
    <div className="App">
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ minHeight: '70px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Link sx={{ mr: 1, color: 'primary.main' }} />
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                flexGrow: 1, 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.025em'
              }}
            >
              LinkForge
            </Typography>
          </Box>
          <Button 
            variant="text"
            component={RouterLink} 
            to="/"
            startIcon={<ContentCopy />}
            onClick={() => handleNavigation('/')}
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                color: 'primary.main'
              }
            }}
          >
            Shorten URLs
          </Button>
          <Button 
            variant="text"
            component={RouterLink} 
            to="/statistics"
            startIcon={<Analytics />}
            onClick={() => handleNavigation('/statistics')}
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                color: 'primary.main'
              }
            }}
          >
            Statistics
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 6, mb: 6, minHeight: 'calc(100vh - 200px)' }}>
        <Routes>
          <Route path="/" element={<UrlShortener />} />
          <Route path="/statistics" element={<UrlStatistics />} />
          <Route path="/:shortCode" element={<RedirectHandler />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App; 