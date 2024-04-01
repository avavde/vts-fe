// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText } from '@mui/material';
import HomePage from './pages/HomePage';
import TagManagementPage from './pages/TagPage';
import AnchorManagementPage from './pages/AnchorPage';
import BuildingManagementPage from './pages/BuildingPage';
import DataStreamManagementPage from './pages/DataStreamPage';
import ZoneManagementPage from './pages/ZonePage';
import { WebSocketProvider } from './components/WebSocketContext';
import { Box } from '@mui/material';

const drawerWidth = 240;


const App = () => {
  return (
    <Router>
      <WebSocketProvider>
        <AppBar position="fixed"  sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap>
              IoT Systems ISM
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <List>
            {['Главная', 'Управление тегами', 'Управление якорями', 'Управление зданиями', 'Управление потоками данных', 'Управление зонами'].map((text, index) => (
              <ListItem button key={text} component={Link} to={index === 0 ? "/" : `/${text.toLowerCase().replace(/\s+/g, '')}`}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: `${drawerWidth}px` }}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/управлениетегами" element={<TagManagementPage />} />
            <Route path="/управлениеякорями" element={<AnchorManagementPage />} />
            <Route path="/управлениезданиями" element={<BuildingManagementPage />} />
            <Route path="/управлениепотокамиданных" element={<DataStreamManagementPage />} />
            <Route path="/управлениезонами" element={<ZoneManagementPage />} />
          </Routes>
        </Box>
      </WebSocketProvider>
    </Router>
  );
};

export default App;
