import React, { useState } from 'react';
import './ParcelCheckinModal.css';

interface ParcelCheckinModalProps {
  onClose: () => void;
  onConfirm: (trackingInfo: { trackingNumber: string; courier: string }) => void;
}

const ParcelCheckinModal: React.FC<ParcelCheckinModalProps> = ({ onClose, onConfirm }) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courier, setCourier] = useState('');

  const handleConfirm = () => {
    onConfirm({ trackingNumber, courier });
  };

  const isFormValid = trackingNumber.trim() !== '' && courier.trim() !== '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Double Parcel Check-in</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p className="modal-description">
            Enter tracking number for this shipment, and also the name of courier service.
          </p>
          <div className="checkin-form">
            <div className="checkin-input-group">
              <label htmlFor="trackingNumber">Tracking Number</label>
              <input
                type="text"
                id="trackingNumber"
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
            <div className="checkin-input-group">
              <label htmlFor="courier">Name of Courier Service</label>
              <input
                type="text"
                id="courier"
                placeholder="Enter courier service"
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="confirm-btn" onClick={handleConfirm} disabled={!isFormValid}>
            Confirm Check-in
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParcelCheckinModal;