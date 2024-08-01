import React from 'react';
import { Box } from '@mui/material';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="app">
      <Sidebar />
      <main className="content">
        <Topbar />
        <Box flex="1" p={2} sx={{ overflowY: 'auto' }}>
          {children}
        </Box>
      </main>
    </div>
  );
};

export default Layout;
