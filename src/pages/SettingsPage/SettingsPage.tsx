// src/pages/SettingsPage/SettingsPage.tsx

import React, { useState, useRef, useEffect } from 'react';
import './SettingsPage.css';
import { settingsData } from '../../data/mockSettings';

// Import the kebab menu icon if you have one, or we can use text '...'
import kebabIcon from '../../assets/images/kebaicon.png'; // Placeholder

const SettingsPage: React.FC = () => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (cardId: string) => {
    setOpenMenuId(openMenuId === cardId ? null : cardId);
  };

  return (
    <div className="settings-page">
      <div className="settings-grid">
        {settingsData.map(card => (
          <div key={card.id} className={`settings-card card-${card.type}`}>
            <div className="card-header">
              <h3 className="card-title">{card.title}</h3>
              {card.hasMenu && (
                <div className="kebab-menu-container" ref={openMenuId === card.id ? menuRef : null}>
                  <button className="kebab-btn" onClick={() => handleMenuClick(card.id)}>
                    {/* Using text fallback if icon is not available */}
                    {kebabIcon ? <img src={kebabIcon} alt="options" /> : '...'}
                  </button>
                  {openMenuId === card.id && (
                    <div className="kebab-dropdown">
                      <a href="#">Themes</a>
                      <a href="#">Background color</a>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="card-icon-wrapper">
              <img src={card.icon} alt={card.title} className="card-icon" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;