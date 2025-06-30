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
import fxIcon from '../../assets/images/fximage.png'; // Using transaction icon as a placeholder for FX
import transactionIcon from '../../assets/images/transactionicon.png';
import supportTicketIcon from '../../assets/images/support.png';
import auditManagementIcon from '../../assets/images/usermagg.png';
import userManagementIcon from '../../assets/images/usermgt.png';
import settingsIcon from '../../assets/images/settings.png';
import logoutIcon from '../../assets/images/logoutIcon.png';

const Sidebar: React.FC = () => {
  const location = useLocation();

  // Helper function to handle active class, including child routes
  const getNavItemClass = (path: string, exact = false) => {
    if (exact) {
        return location.pathname === path ? 'active' : '';
    }
    // For parent routes, check if the current path starts with the given path
    return location.pathname.startsWith(path) && path !== '/' ? 'active' : '';
  };
  
  // Special case for dashboard to avoid it always being active
  const dashboardClass = location.pathname === '/' ? 'active' : '';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Link to="/"><img src={logo} alt="Navo+ Logo" /></Link>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className={dashboardClass}><Link to="/"><img src={dashboardIcon} alt="" /> Dashboard</Link></li>
          <li className={getNavItemClass('/customers')}><Link to="/customers"><img src={customersIcon} alt="" /> Customers</Link></li>
          <li className={getNavItemClass('/shipments')}><Link to="/shipments"><img src={shipmentIcon} alt="" /> Shipments</Link></li>
          <li className={getNavItemClass('/quote-request')}><Link to="/quote-request"><img src={quoteIcon} alt="" /> Quote Request</Link></li>
          <li className={getNavItemClass('/tracking')}><Link to="/tracking"><img src={trackingIcon} alt="" /> Tracking Mgt.</Link></li>
          <li className={getNavItemClass('/purchase-orders')}><Link to="/purchase-orders"><img src={purchaseOrdersIcon} alt="" /> Purchase Orders</Link></li>
          
          {/* === NEW FX LINK ADDED HERE === */}
          <li className={getNavItemClass('/fx')}><Link to="/fx"><img src={fxIcon} alt="" /> FX</Link></li>
          
          <li className={getNavItemClass('/transactions')}><Link to="/transactions"><img src={transactionIcon} alt="" /> Transaction</Link></li>
          <li className={getNavItemClass('/support')}><Link to="/support"><img src={supportTicketIcon} alt="" /> Support Ticket</Link></li>
        </ul>
        <hr className="sidebar-divider" />
        <ul>
          <li className={getNavItemClass('/audit')}><Link to="/audit"><img src={auditManagementIcon} alt="" /> Audit Mgt.</Link></li>
          <li className={getNavItemClass('/user-management')}><Link to="/user-management"><img src={userManagementIcon} alt="" /> User Mgt.</Link></li>
          <li className={getNavItemClass('/settings')}><Link to="/settings"><img src={settingsIcon} alt="" /> Settings</Link></li>
        </ul>
      </nav>
      <div className="sidebar-logout">
        <a href="/login"><img src={logoutIcon} alt="" /> Logout</a>
      </div>
    </aside>
  );
};

export default Sidebar;