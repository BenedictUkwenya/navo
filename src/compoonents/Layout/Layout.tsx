// src/compoonents/Layout/Layout.tsx

import React from 'react';
import Sidebar from '../Sidebar/Sidebar'; // Corrected path if you rename 'compoonents'
import Header from '../Header/Header';   // Corrected path if you rename 'compoonents'
import './Layout.css';

// We need to accept the title here and also the children
interface LayoutProps {
  children: React.ReactNode;
  pageTitle: string; // Add pageTitle prop
}

// Accept pageTitle as a prop
const Layout: React.FC<LayoutProps> = ({ children, pageTitle }) => {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content">
        {/* Pass the pageTitle down to the Header */}
        <Header title={pageTitle} />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;