// src/compoonents/Sidebar/Sidebar.tsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

// --- ICON IMPORTS ---
import logo from '../../assets/images/navo-logo.png';
import dashboardIcon from '../../assets/images/dashboardicon.png';
import customersIcon from '../../assets/images/customers.png';
import shipmentIcon from '../../assets/images/shipment-icon.png';
import quoteIcon from '../../assets/images/quote-icon.png';
import trackingIcon from '../../assets/images/trackingicon.png';
import purchaseOrdersIcon from '../../assets/images/purchaseicon.png';
import fxIcon from '../../assets/images/fximage.png';
import transactionIcon from '../../assets/images/transactionicon.png';
import supportTicketIcon from '../../assets/images/support.png';
import auditManagementIcon from '../../assets/images/usermagg.png';
import userManagementIcon from '../../assets/images/usermgt.png';
import settingsIcon from '../../assets/images/settings.png';
import logoutIcon from '../../assets/images/logoutIcon.png';

// The Sidebar's props now include `isOpen` and `onClose`
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const getNavItemClass = (path: string) => {
    // This logic is simplified for clarity, your original was also fine.
    return location.pathname.startsWith(path) && path !== '/' ? 'active' : '';
  };
  
  const dashboardClass = location.pathname === '/' || location.pathname === '/dashboard' ? 'active' : '';

  // A single handler to close the sidebar. We'll attach this to all links.
  const handleLinkClick = () => {
    onClose();
  };

  return (
    // The `sidebar` class is now combined with an `open` class when `isOpen` is true
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <Link to="/" onClick={handleLinkClick}>
          <img src={logo} alt="Navo+ Logo" />
        </Link>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {/* Every <Link> now has an onClick handler to close the mobile menu */}
          <li className={dashboardClass}><Link to="/dashboard" onClick={handleLinkClick}><img src={dashboardIcon} alt="" /> Dashboard</Link></li>
          <li className={getNavItemClass('/customers')}><Link to="/customers" onClick={handleLinkClick}><img src={customersIcon} alt="" /> Customers</Link></li>
          <li className={getNavItemClass('/shipments')}><Link to="/shipments" onClick={handleLinkClick}><img src={shipmentIcon} alt="" /> Shipments</Link></li>
          <li className={getNavItemClass('/quote-request')}><Link to="/quote-request" onClick={handleLinkClick}><img src={quoteIcon} alt="" /> Quote Request</Link></li>
          <li className={getNavItemClass('/tracking')}><Link to="/tracking" onClick={handleLinkClick}><img src={trackingIcon} alt="" /> Tracking Mgt.</Link></li>
          <li className={getNavItemClass('/purchase-orders')}><Link to="/purchase-orders" onClick={handleLinkClick}><img src={purchaseOrdersIcon} alt="" /> Purchase Orders</Link></li>
          <li className={getNavItemClass('/fx')}><Link to="/fx" onClick={handleLinkClick}><img src={fxIcon} alt="" /> FX</Link></li>
          <li className={getNavItemClass('/transactions')}><Link to="/transactions" onClick={handleLinkClick}><img src={transactionIcon} alt="" /> Transaction</Link></li>
          <li className={getNavItemClass('/support')}><Link to="/support" onClick={handleLinkClick}><img src={supportTicketIcon} alt="" /> Support Ticket</Link></li>
        </ul>
        <hr className="sidebar-divider" />
        <ul>
          <li className={getNavItemClass('/audit')}><Link to="/audit" onClick={handleLinkClick}><img src={auditManagementIcon} alt="" /> Audit Mgt.</Link></li>
          <li className={getNavItemClass('/user-management')}><Link to="/user-management" onClick={handleLinkClick}><img src={userManagementIcon} alt="" /> User Mgt.</Link></li>
          <li className={getNavItemClass('/settings')}><Link to="/settings" onClick={handleLinkClick}><img src={settingsIcon} alt="" /> Settings</Link></li>
        </ul>
      </nav>
      <div className="sidebar-logout">
        <a href="/login"><img src={logoutIcon} alt="" /> Logout</a>
      </div>
    </aside>
  );
};

export default Sidebar;