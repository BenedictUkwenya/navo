// src/components/Sidebar/Sidebar.tsx
import React from 'react';
// 1. Import Link and useLocation from react-router-dom
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

// Your icon imports are perfect, they remain the same.
import logo from '../../assets/images/navo-logo.png';
import dashboardIcon from '../../assets/images/dashboardicon.png';
import customersIcon from '../../assets/images/customers.png';
import shipmentIcon from '../../assets/images/shipment-icon.png';
import quoteIcon from '../../assets/images/quote-icon.png';
import trackingIcon from '../../assets/images/trackingicon.png';
import purchaseOrdersIcon from '../../assets/images/purchaseicon.png';
import transactionIcon from '../../assets/images/transactionicon.png';
import supportTicketIcon from '../../assets/images/support.png';
import auditManagementIcon from '../../assets/images/usermagg.png';
import userManagementIcon from '../../assets/images/usermgt.png';
import settingsIcon from '../../assets/images/settings.png';
import logoutIcon from '../../assets/images/logoutIcon.png';

const Sidebar: React.FC = () => {
  // 2. Get the current location object. location.pathname gives us the current URL path.
  const location = useLocation();

  // Helper function to make the class logic cleaner
  const getNavItemClass = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        {/* The logo can also be a link to the dashboard */}
        <Link to="/">
          <img src={logo} alt="Navo+ Logo" />
        </Link>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {/* 3. Replace <a> with <Link> and use the helper to set the active class */}
          <li className={getNavItemClass('/')}>
            <Link to="/"><img src={dashboardIcon} alt="" /> Dashboard</Link>
            </li>
          <li className={getNavItemClass('/customers')}>
            <Link to="/customers"><img src={customersIcon} alt="" /> Customers</Link>
          </li>
          {/* Add paths for all other pages, even if they aren't created yet */}
          <li className={getNavItemClass('/shipments')}>
            <Link to="/shipments"><img src={shipmentIcon} alt="" /> Shipments</Link>
          </li>
          <li className={getNavItemClass('/quote-request')}>
            <Link to="/quote-request"><img src={quoteIcon} alt="" /> Quote Request</Link>
          </li>
          <li className={getNavItemClass('/tracking')}>
            <Link to="/tracking"><img src={trackingIcon} alt="" /> Tracking Mgt.</Link>
          </li>
          <li className={getNavItemClass('/purchase-orders')}>
            <Link to="/purchase-orders"><img src={purchaseOrdersIcon} alt="" /> Purchase Orders</Link>
          </li>
          <li className={getNavItemClass('/transactions')}>
            <Link to="/transactions"><img src={transactionIcon} alt="" /> Transaction</Link>
          </li>
          <li className={getNavItemClass('/support')}>
            <Link to="/support"><img src={supportTicketIcon} alt="" /> Support Ticket</Link>
          </li>
        </ul>
        <hr className="sidebar-divider" />
        <ul>
          <li className={getNavItemClass('/audit')}>
            <Link to="/audit"><img src={auditManagementIcon} alt="" /> Audit Mgt.</Link>
          </li>
          <li className={getNavItemClass('/user-management')}>
            <Link to="/user-management"><img src={userManagementIcon} alt="" /> User Mgt.</Link>
          </li>
          <li className={getNavItemClass('/settings')}>
            <Link to="/settings"><img src={settingsIcon} alt="" /> Settings</Link>
          </li>
        </ul>
      </nav>
      <div className="sidebar-logout">
        {/* The logout button usually triggers a function, not just a link.
            For now, an <a> tag is fine, but it could also be a <button>. */}
        <a href="/login"><img src={logoutIcon} alt="" /> Logout</a>
      </div>
    </aside>
  );
};

export default Sidebar;