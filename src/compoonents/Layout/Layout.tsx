 
import React from 'react';
import Sidebar from '../Sidebar/Sidebar';  
import Header from '../Header/Header';    
import './Layout.css';

 
interface LayoutProps {
  children: React.ReactNode;
  pageTitle: string; 
}

 
const Layout: React.FC<LayoutProps> = ({ children, pageTitle }) => {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content">
        {/*okayyy */}
        <Header title={pageTitle} />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;