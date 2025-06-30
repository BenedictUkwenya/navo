import React from 'react';
import './FxTransactionDetailsModal.css';
import { FxTransaction } from '../../data/mockFxTransactions';
import { IoClose } from 'react-icons/io5';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

interface ModalProps {
  onClose: () => void;
  transaction: FxTransaction;
}

const DetailRow: React.FC<{ label: string; value: string | React.ReactNode; valueClass?: string }> = ({ label, value, valueClass }) => (
    <div className="detail-row">
        <span className="detail-label">{label}</span>
        <span className={`detail-value ${valueClass || ''}`}>{value}</span>
    </div>
);

const FxTransactionDetailsModal: React.FC<ModalProps> = ({ onClose, transaction }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="fx-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
            <div className="amount-info">
                <label>Amount Deposited</label>
                <h1>{transaction.amountDeposited}</h1>
                <p className="transaction-id-line">Transaction ID: <span>{transaction.transactionId}</span></p>
                <p className="user-id-line">User ID: <span>{transaction.customerId}</span></p>
            </div>
            <div className={`type-badge type-${transaction.fxType.toLowerCase()}`}>
                {transaction.fxType} {transaction.fxType === 'Buy' ? <FaArrowDown /> : <FaArrowUp />}
            </div>
            <button className="modal-close-btn" onClick={onClose}><IoClose /></button>
        </div>
        
        <div className="modal-body">
            <DetailRow label="Rate used" value={transaction.rateUsed} valueClass="text-blue" />
            <DetailRow label="Recipient Bank Name" value={transaction.recipientBankName} valueClass="text-green" />
            <DetailRow label="Recipient Account number" value={transaction.recipientAccountNumber} valueClass="text-blue" />
            <DetailRow label="Recipient Account Name" value={transaction.recipientAccountName} valueClass="text-orange" />
            
            {/* === THIS IS THE FIX === */}
            {/* Changed from transaction.proofOfPaymentUrl to transaction.proofOfPayment */}
            <DetailRow 
              label="Proof of payment" 
              value={<a href={transaction.proofOfPayment} target="_blank" rel="noopener noreferrer">View</a>} 
              valueClass="text-blue view-link" 
            />
            {/* ======================= */}
        </div>

        <div className="modal-footer">
            <div className="form-group">
                <label>Amount Credited to Recipient</label>
                <input type="text" placeholder="Enter here" />
            </div>
            <div className="footer-buttons">
                <button className="cancel-btn" onClick={onClose}>Cancel</button>
                <button className="approve-btn">Approve Payment</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FxTransactionDetailsModal;