import React, { useState } from 'react';
// === THIS IS THE FIX: Import the correct function ===
import { createRate } from '../../services/fxService'; 
import './AddFxRateModal.css';
import { IoClose } from 'react-icons/io5';

interface ModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddFxRateModal: React.FC<ModalProps> = ({ onClose, onSuccess }) => {
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [buyRate, setBuyRate] = useState<number | ''>('');
  const [sellRate, setSellRate] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!fromCurrency || !toCurrency || !buyRate || !sellRate) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // === THIS IS THE FIX: Call the correct service function ===
      // This sends the data to the POST /rate endpoint to create a new rate.
      await createRate({ fromCurrency, toCurrency, buyRate, sellRate });
      onSuccess();
    } catch (err) {
      const apiError = err as any;
      setError(apiError.response?.data?.message || 'Failed to create new rate. This pair might already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="fx-pricing-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New FX Rate</h2>
          <button className="modal-close-btn" onClick={onClose}><IoClose /></button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group"><label>From Currency (e.g., USD)</label><input type="text" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value.toUpperCase())} /></div>
            <div className="form-group"><label>To Currency (e.g., NGN)</label><input type="text" value={toCurrency} onChange={(e) => setToCurrency(e.target.value.toUpperCase())} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Buy Rate</label><input type="number" placeholder="Enter buy rate" value={buyRate} onChange={(e) => setBuyRate(parseFloat(e.target.value) || '')} /></div>
            <div className="form-group"><label>Sell Rate</label><input type="number" placeholder="Enter sell rate" value={sellRate} onChange={(e) => setSellRate(parseFloat(e.target.value) || '')} /></div>
          </div>
          {error && <p className="modal-error">{error}</p>}
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="set-price-btn" onClick={handleSave} disabled={loading}>
            {loading ? 'Creating...' : 'Create Rate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFxRateModal;