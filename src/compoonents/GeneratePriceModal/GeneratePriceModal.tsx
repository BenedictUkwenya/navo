import React, { useState } from 'react';
import './GeneratePriceModal.css';
import { CartItem, CartSubItem } from '../../data/mockPurchaseOrders';

interface GeneratePriceModalProps {
  item: CartItem;
  onClose: () => void;
  onSave: (cartItemId: string, updatedSubItems: CartSubItem[]) => void;
}

const GeneratePriceModal: React.FC<GeneratePriceModalProps> = ({ item, onClose, onSave }) => {
  const [prices, setPrices] = useState<{ [key: string]: string }>({});

  const handlePriceChange = (itemName: string, value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setPrices(prev => ({ ...prev, [itemName]: value }));
    }
  };

  const handleUpdatePrice = () => {
    const updatedSubItems = item.subItems.map(subItem => ({
      ...subItem,
      price: parseFloat(prices[subItem.name] || '0'),
    }));
    onSave(item.id, updatedSubItems);
  };

  const isFormValid = item.subItems.every(subItem => prices[subItem.name] && parseFloat(prices[subItem.name]) >= 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Generate Price</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="price-inputs-grid">
            {item.subItems.map(subItem => (
              <div key={subItem.name} className="price-input-group">
                <label htmlFor={subItem.name}>{subItem.name}</label>
                <input
                  type="text"
                  id={subItem.name}
                  placeholder="Enter here"
                  value={prices[subItem.name] || ''}
                  onChange={(e) => handlePriceChange(subItem.name, e.target.value)}
                  autoComplete="off"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button 
            className="update-price-btn" 
            onClick={handleUpdatePrice} 
            disabled={!isFormValid}
            title={isFormValid ? "Save prices" : "Please enter a valid price for all items"}
          >
            Update Price
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneratePriceModal;