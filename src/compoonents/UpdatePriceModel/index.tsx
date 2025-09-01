import React, { useState } from "react";
import "./UpdatePriceModel.css";

interface UpdatePriceModalProps {
  item: {
    item: string;
    amount: number;
    currency: string;
  };
  onClose: () => void;
  onSave: (newPrice: number) => void;
}

const UpdatePriceModal: React.FC<UpdatePriceModalProps> = ({
  item,
  onClose,
  onSave,
}) => {
  const [price, setPrice] = useState(item.amount.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(Number(price));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Update Cart Price</h2>
          <button onClick={onClose} className="close-btn">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="price-input-group">
            <label>Item</label>
            <p className="item-name">{item.item}</p>

            <label>Current Price</label>
            <p className="current-price">
              {item.currency === "GBP"
                ? "£"
                : item.currency === "USD"
                ? "$"
                : item.currency === "EUR"
                ? "€"
                : item.currency === "NGN"
                ? "₦"
                : item.currency}
              {item.amount}
            </p>

            <label>New Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
              required
              className="price-input"
            />
          </div>
          <button type="submit" className="update-price-btn">
            Update Price
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePriceModal;
