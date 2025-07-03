import React, { useState } from 'react';
import './ShipmentPricingModal.css';

interface ModalProps {
  onClose: () => void;
  onSave: (pricingData: { pricePerKg: number, clearanceFee: number, deliveryDays: number }) => void;
  // We can add a loading prop later if the API call is slow
}

const ShipmentPricingModal: React.FC<ModalProps> = ({ onClose, onSave }) => {
  const [pricePerKg, setPricePerKg] = useState<number | ''>('');
  const [clearanceFee, setClearanceFee] = useState<number | ''>('');
  const [deliveryDays, setDeliveryDays] = useState<number | ''>('');

  const handleSaveClick = () => {
    // Basic validation
    if (!pricePerKg || !clearanceFee || !deliveryDays) {
      alert("All fields are required.");
      return;
    }
    onSave({ 
        pricePerKg: Number(pricePerKg), 
        clearanceFee: Number(clearanceFee), 
        deliveryDays: Number(deliveryDays) 
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="pricing-modal-content" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Set Pricing Details</h2>
          <button onClick={onClose} className="modal-close-btn">×</button>
        </header>
        <div className="modal-body">
          <div className="form-group">
            <label>Price Per Kg (GBP)</label>
            <input 
              type="number" 
              placeholder="e.g., 12.5"
              value={pricePerKg} 
              onChange={e => setPricePerKg(Number(e.target.value))} 
            />
          </div>
          <div className="form-group">
            <label>Clearance Fee (GBP)</label>
            <input 
              type="number" 
              placeholder="e.g., 50"
              value={clearanceFee} 
              onChange={e => setClearanceFee(Number(e.target.value))} 
            />
          </div>
          <div className="form-group">
            <label>Estimated Delivery Days</label>
            <input 
              type="number" 
              placeholder="e.g., 7"
              value={deliveryDays} 
              onChange={e => setDeliveryDays(Number(e.target.value))} 
            />
          </div>
        </div>
        <footer className="modal-footer">
          <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="save-btn" onClick={handleSaveClick}>Save Price</button>
        </footer>
      </div>
    </div>
  );
};

export default ShipmentPricingModal;