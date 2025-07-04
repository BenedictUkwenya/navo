import React, { useState, useEffect } from 'react';
import './SetFxPricingModal.css';
import { FxRate } from '../../types/fx';
import { updateRate } from '../../services/fxService';
import { IoClose } from 'react-icons/io5';

interface ModalProps {
  onClose: () => void;
  onSuccess: () => void;
  editingRate: FxRate | null; // Can be null if we were creating
}

const SetFxPricingModal: React.FC<ModalProps> = ({ onClose, onSuccess, editingRate }) => {
  const [buyRate, setBuyRate] = useState<number | ''>('');
  const [sellRate, setSellRate] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingRate) {
      setBuyRate(editingRate.buyRate);
      setSellRate(editingRate.sellRate);
    }
  }, [editingRate]);

  const handleSave = async () => {
    // Guard clause to ensure we are in edit mode
    if (!editingRate) {
        setError("No rate selected to edit.");
        return;
    }
    if (!buyRate || !sellRate) {
      setError('Both Buy and Sell rates are required.');
      return;
    }
    setLoading(true);
    setError(null);
    
    try {
      // === THIS IS THE FIX ===
      // Construct the full object that the updated `updateRate` function expects.
      await updateRate({
        id: editingRate.id,
        fromCurrency: editingRate.fromCurrency,
        toCurrency: editingRate.toCurrency,
        buyRate: buyRate,
        sellRate: sellRate,
      });
      onSuccess();
    } catch (err) {
      const apiError = err as any;
      setError(apiError.response?.data?.message || 'Failed to update the rate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="fx-pricing-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit FX Rate</h2>
          <button className="modal-close-btn" onClick={onClose}><IoClose /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Currency Pair</label>
            <div className="custom-select-wrapper"><input type="text" value={`${editingRate?.fromCurrency} / ${editingRate?.toCurrency}`} readOnly /></div>
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
            {loading ? 'Updating...' : 'Update Rate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetFxPricingModal;