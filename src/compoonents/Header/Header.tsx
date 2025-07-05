// src/compoonents/Header/Header.tsx

import React from 'react';
import './Header.css';

// --- ICON IMPORTS ---
import searchIcon from '../../assets/images/searchicon.png';
import notificationIcon from '../../assets/images/notificationicon.png';
import chevronDownIcon from '../../assets/images/chevron-down.webp';
import userAvatar from '../../assets/images/profilepic.png'; 

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  // This is the simple version that does not depend on AuthContext
  // We can add the dropdown functionality back later without the context if needed.
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
          <img src={userAvatar} alt="User Avatar" className="avatar" />
          <span className="user-name">Oladapo</span> {/* Using a static name for now */}
          <img src={chevronDownIcon} alt="Dropdown" className="chevron-down" />
        </div>
      </div>
    </header>
  );
};

export default Header;