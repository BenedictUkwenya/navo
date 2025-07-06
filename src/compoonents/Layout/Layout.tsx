// src/compoonents/Layout/Layout.tsx

import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

const Layout: React.FC<LayoutProps> = ({ children, pageTitle }) => {
  // NEW: State to manage the mobile sidebar's visibility. It's closed by default.
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout-container">
      {/*
        The Sidebar now receives two new props:
        - `isOpen`: A boolean to control its visibility on mobile.
        - `onClose`: A function to tell the Layout to close the sidebar.
      */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* 
        This overlay appears when the mobile menu is open, covering the main content.
        Clicking it will close the sidebar.
      */}
      {isSidebarOpen && <div className="mobile-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <div className="main-content">
        {/*
          The Header now receives a new prop:
          - `onMenuClick`: A function to tell the Layout to open the sidebar.
        */}
        <Header title={pageTitle} onMenuClick={() => setSidebarOpen(true)} />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;