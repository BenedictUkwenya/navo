// src/pages/SettingsPage/SettingsPage.tsx

import React, { useState, useEffect } from 'react';
import './SettingsPage.css';

// Your existing mock data and icons
import { settingsData } from '../../data/mockSettings';
import kebabIcon from '../../assets/images/kebaicon.png'; 

// === NEW IMPORTS ===
import { getCurrentServiceFee, ServiceFee } from '../../services/serviceFeeService';
import UpdateServiceFeeModal from '../../compoonents/UpdateServiceFeeModal/UpdateServiceFeeModal';
import feeIcon from '../../assets/images/purchaseicon.png'; // Using a placeholder icon

const SettingsPage: React.FC = () => {
  // === NEW STATE FOR LIVE DATA ===
  const [serviceFee, setServiceFee] = useState<ServiceFee | null>(null);
  const [loadingFee, setLoadingFee] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Your existing state for mock data menus
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // === NEW EFFECT TO FETCH LIVE DATA ===
  useEffect(() => {
    const fetchFee = async () => {
      setLoadingFee(true);
      try {
        const feeData = await getCurrentServiceFee();
        setServiceFee(feeData);
      } catch (err) {
        console.error("Could not load service fee data.", err);
      } finally {
        setLoadingFee(false);
      }
    };
    fetchFee();
  }, []);

  const handleUpdateSuccess = (updatedFee: ServiceFee) => {
    setServiceFee(updatedFee);
    setIsModalOpen(false);
  };

  // Your existing menu logic (no changes needed)
  // ...

  return (
    <div className="settings-page">
      <h1 className="page-main-title">Settings</h1>
      <div className="settings-grid">
        
        {/* === RENDER THE NEW, LIVE SERVICE FEE CARD === */}
        <div className="settings-card card-live-data">
          <div className="card-header">
            <h3 className="card-title">Service Fee</h3>
          </div>
          <div className="card-content">
            {loadingFee ? (
              <p className="loading-text">Loading...</p>
            ) : serviceFee ? (
              <>
                <p className="live-data-value">{serviceFee.percentage}%</p>
                <button className="update-link" onClick={() => setIsModalOpen(true)}>
                  Update Fee
                </button>
              </>
            ) : (
              <p className="error-text">Could not load fee.</p>
            )}
          </div>
          <div className="card-icon-wrapper">
            <img src={feeIcon} alt="Service Fee" className="card-icon" />
          </div>
        </div>

        {/* Your existing loop for mock data cards */}
        {settingsData.map(card => (
          <div key={card.id} className={`settings-card card-${card.type}`}>
            <div className="card-header">
              <h3 className="card-title">{card.title}</h3>
              {/* Kebab menu logic remains the same */}
            </div>
            <div className="card-icon-wrapper">
              <img src={card.icon} alt={card.title} className="card-icon" />
            </div>
          </div>
        ))}

      </div>

      {/* The modal, which only renders when needed */}
      {isModalOpen && serviceFee && (
        <UpdateServiceFeeModal
          currentPercentage={serviceFee.percentage}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default SettingsPage;