// src/compoonents/Header/Header.tsx

import React from 'react';
import './Header.css';
import { mockUserData } from '../../data/mockDashboardData';

// --- IMPORT ALL ICONS CORRECTLY ---
import searchIcon from '../../assets/images/searchicon.png'; // Using your consistent search icon
import notificationIcon from '../../assets/images/notificationicon.png';
import chevronDownIcon from '../../assets/images/chevron-down.png';
import userAvatar from '../../assets/images/profilepic.png'; // Import the user avatar

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="header">
      <div className="header-title">
        <h1>{title}</h1>
      </div>
      <div className="header-controls">
        <div className="search-bar">
          <img src={searchIcon} alt="Search" />
          <input type="text" placeholder="Search" />
        </div>
        <div className="notification-icon">
          <img src={notificationIcon} alt="Notifications" />
          <span className="notification-badge">2</span>
        </div>
        <div className="user-profile">
          {/* Use the imported avatar image variable here */}
          <img src={userAvatar} alt="User Avatar" className="avatar" />
          <span className="user-name">{mockUserData.name}</span>
          <img src={chevronDownIcon} alt="Dropdown" className="chevron-down" />
        </div>
      </div>
    </header>
  );
};

export default Header;