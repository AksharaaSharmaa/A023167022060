import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link, ContentCopy, Analytics } from '@mui/icons-material';
import UrlShortener from './components/UrlShortener';
import UrlStatistics from './components/UrlStatistics';
import RedirectHandler from './components/RedirectHandler';
import { Log } from './logging-middleware/index.js';

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
      <AppBar position="static">
        <Toolbar>
          <Link sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
            startIcon={<ContentCopy />}
            onClick={() => handleNavigation('/')}
          >
            Shorten URLs
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/statistics"
            startIcon={<Analytics />}
            onClick={() => handleNavigation('/statistics')}
          >
            Statistics
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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