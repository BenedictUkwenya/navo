// src/compoonents/Header/Header.tsx

import React from "react";
import "./Header.css";
import { useSelector } from "react-redux";
// --- ICON IMPORTS ---
import searchIcon from "../../assets/images/searchicon.png";
import notificationIcon from "../../assets/images/notificationicon.png";
import chevronDownIcon from "../../assets/images/chevron-down.webp";
import userAvatar from "../../assets/images/profilepic.png";
import { FiMenu } from "react-icons/fi"; // A standard, clean hamburger menu icon from react-icons
import { RootState } from "../../redux/store";

// To use FiMenu, you'll need to install react-icons:
// npm install react-icons

// The Header's props now include the onMenuClick function
interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <header className="header">
      {/* This button is only visible on mobile (controlled by CSS) */}
      {/* When clicked, it calls the function passed down from Layout */}
      <button className="mobile-menu-btn" onClick={onMenuClick}>
        <FiMenu />
      </button>

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
          <span className="user-name">{user?.name || "Guest"}</span>
          <img src={chevronDownIcon} alt="Dropdown" className="chevron-down" />
        </div>
      </div>
    </header>
  );
};

export default Header;
