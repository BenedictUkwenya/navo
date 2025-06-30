import React, { useState, useMemo, useEffect } from 'react';
import './SetFxPricingModal.css';
import { FxPricing } from '../../data/mockFxData';
import { IoClose } from 'react-icons/io5';
import { FaChevronDown } from 'react-icons/fa';
import { LuCalendarDays } from 'react-icons/lu';

interface ModalProps {
  onClose: () => void;
  onSave: (pricingData: any) => void;
  editingPricing?: FxPricing | null;
}

const SetFxPricingModal: React.FC<ModalProps> = ({ onClose, onSave, editingPricing }) => {
  const [currencyPair, setCurrencyPair] = useState('USD / NGN');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [baseRate, setBaseRate] = useState<number | ''>('');
  const [markup, setMarkup] = useState<number | ''>('');
  const [minAmount, setMinAmount] = useState<number | ''>('');
  const [maxAmount, setMaxAmount] = useState<number | ''>('');

  useEffect(() => {
    if (editingPricing) {
      const rateString = editingPricing.baseRate.split('₦')[1];
      const baseRateNum = rateString ? parseFloat(rateString.replace(/,/g, '')) : NaN;
      if (!isNaN(baseRateNum)) setBaseRate(baseRateNum);
    }
  }, [editingPricing]);

  const finalRate = useMemo(() => {
    if (baseRate && markup) {
      return (baseRate * (1 + (markup / 100))).toFixed(2);
    }
    return '0.00';
  }, [baseRate, markup]);

  const handleSave = () => {
    onSave({
      id: editingPricing?.id, currencyPair, baseRate: `1 GBP = ₦${baseRate}`,
      finalRate: `₦${finalRate}`,
    });
  };

  const isEditingMode = !!editingPricing;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="fx-pricing-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditingMode ? 'Edit FX Pricing' : 'Set FX Pricing'}</h2>
          <button className="modal-close-btn" onClick={onClose}><IoClose /></button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group"><label>Currency Pair</label><div className="custom-select-wrapper"><input type="text" value={currencyPair} readOnly /><FaChevronDown className="input-icon-right" /></div></div>
            <div className="form-group"><label>Effective Date</label><div className="custom-select-wrapper"><input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} /><LuCalendarDays className="input-icon-right" /></div></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Base Rate</label><input type="number" placeholder="Enter here" value={baseRate} onChange={(e) => setBaseRate(parseFloat(e.target.value) || '')} /></div>
            <div className="form-group"><label>Markup (%)</label><input type="number" placeholder="Enter here" value={markup} onChange={(e) => setMarkup(parseFloat(e.target.value) || '')} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Min Transaction Amount</label><input type="number" placeholder="Enter here" value={minAmount} onChange={(e) => setMinAmount(parseFloat(e.target.value) || '')} /></div>
            <div className="form-group"><label>Max Transaction Amount</label><input type="number" placeholder="Enter here" value={maxAmount} onChange={(e) => setMaxAmount(parseFloat(e.target.value) || '')} /></div>
          </div>
          <div className="final-rate-display">Final Rate shows here <span>(Auto-calculated)</span></div>
          <div className="final-rate-value">₦{finalRate}</div>
        </div>
        <div className="modal-footer">
          {isEditingMode ? ( <button className="set-price-btn" onClick={handleSave}>Update price</button> ) : (
            <> <button className="cancel-btn" onClick={onClose}>Cancel</button> <button className="set-price-btn" onClick={handleSave}>Set price</button> </>
          )}
          {isEditingMode && <button className="cancel-btn" onClick={onClose}>Close</button>}
        </div>
      </div>
    </div>
  );
};

export default SetFxPricingModal;