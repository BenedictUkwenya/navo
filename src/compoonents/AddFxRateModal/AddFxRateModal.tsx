import React, { useState } from "react";
import { createExchangeRate } from "../../services/exchangeRate";
import "./AddFxRateModal.css";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddFxRateModal: React.FC<ModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fromCurrency: "NGN",
    toCurrency: "GBP",
    buyRate: "",
    sellRate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.buyRate || !formData.sellRate) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createExchangeRate({
        fromCurrency: formData.fromCurrency,
        toCurrency: formData.toCurrency,
        buyRate: Number(formData.buyRate),
        sellRate: Number(formData.sellRate),
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to create new rate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="fx-pricing-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New FX Rate</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <IoClose />
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSave} className="create-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">From Currency</label>
                <select
                  name="fromCurrency"
                  value={formData.fromCurrency}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="NGN">Nigerian Naira (NGN)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">To Currency</label>
                <select
                  name="toCurrency"
                  value={formData.toCurrency}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="GBP">British Pound (GBP)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="NGN">Nigerian Naira (NGN)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Buy Rate</label>
                <input
                  type="number"
                  name="buyRate"
                  value={formData.buyRate}
                  onChange={handleInputChange}
                  placeholder="1250.75"
                  step="0.01"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sell Rate</label>
                <input
                  type="number"
                  name="sellRate"
                  value={formData.sellRate}
                  onChange={handleInputChange}
                  placeholder="1260.50"
                  step="0.01"
                  className="form-input"
                  required
                />
              </div>
            </div>
            {error && <p className="modal-error">{error}</p>}
            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Creating..." : "Create Rate"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFxRateModal;
