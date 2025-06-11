// src/components/TransactionDetailsModal/TransactionDetailsModal.tsx

import React from 'react';
import './TransactionDetailsModal.css';
import { Transaction, TransactionStatus } from '../../data/mockTransactions';

// --- IMPORTANT: UPDATE WITH YOUR ACTUAL ICON FILENAMES ---
import pendingIcon from '../../assets/images/pendingicon.png';
import successIcon from '../../assets/images/completedicon.png';
import failedIcon from '../../assets/images/failedicon.png';
import pdfDownloadIcon from '../../assets/images/purchaseicon.png'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
}

const getStatusAssets = (status: TransactionStatus) => {
  switch (status) {
    case 'Successful':
      return { icon: successIcon, colorClass: 'successful' };
    case 'Pending':
      return { icon: pendingIcon, colorClass: 'pending' };
    case 'Failed':
      return { icon: failedIcon, colorClass: 'failed' };
    default:
      return { icon: pendingIcon, colorClass: 'pending' };
  }
};

const formatCurrency = (amount: number) => `₦${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatTimestamp = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).replace(',', ',');
};

const TransactionDetailsModal: React.FC<ModalProps> = ({ isOpen, onClose, transaction }) => {
  if (!isOpen) {
    return null;
  }

  const { icon, colorClass } = getStatusAssets(transaction.status);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        
        <header className="modal-header">
          <div className="modal-title">
            <p>TRANSFER</p>
            <h1>{formatCurrency(transaction.amount)}</h1>
            <span>Transaction ID: {transaction.transactionId}</span>
          </div>
          <div className={`modal-status-icon-wrapper ${colorClass}`}>
            <img src={icon} alt={`${transaction.status} icon`} />
          </div>
        </header>

        <div className="modal-details">
          <div className="detail-row">
            <span className="detail-label">Sender</span>
            <span className="detail-value">{transaction.customerName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Type</span>
            <span className={`detail-value status-text-green`}>{transaction.type}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Channel</span>
            <span className="detail-value">{transaction.channel}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status</span>
            <span className={`detail-value status-text ${colorClass}`}>{transaction.status}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Time stamp</span>
            <span className="detail-value">{formatTimestamp(transaction.timestamp)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Category</span>
            <span className="detail-value">{transaction.category}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Remark</span>
            <span className="detail-value">{transaction.remark}</span>
          </div>
        </div>

        <footer className="modal-footer">
          <button className="download-pdf-btn">
            Download PDF
            <img src={pdfDownloadIcon} alt="Download"/>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;