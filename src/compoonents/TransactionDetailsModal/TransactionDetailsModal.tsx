import React from 'react';
import './TransactionDetailsModal.css';
import { Transaction } from '../../types/transaction'; // Use our correct type

// --- ICON IMPORTS ---
import pendingIcon from '../../assets/images/pendingicon.png';
import successIcon from '../../assets/images/completedicon.png';
import failedIcon from '../../assets/images/failedicon.png';
import pdfDownloadIcon from '../../assets/images/purchaseicon.png';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
}

// This helper function now correctly checks paymentStatus
const getStatusAssets = (status: Transaction['paymentStatus']) => {
  if (!status) {
    return { icon: pendingIcon, colorClass: 'pending' };
  }
  switch (status.toUpperCase()) {
    case 'SUCCESSFUL':
      return { icon: successIcon, colorClass: 'successful' };
    case 'PENDING':
      return { icon: pendingIcon, colorClass: 'pending' };
    case 'FAILED':
      return { icon: failedIcon, colorClass: 'failed' };
    default:
      return { icon: pendingIcon, colorClass: 'pending' };
  }
};

// This helper now safely handles the amount, which comes as a string
const formatCurrency = (amountStr: string) => {
  const amountNum = parseFloat(amountStr);
  if (isNaN(amountNum)) {
    return 'N/A';
  }
  return `₦${amountNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatTimestamp = (isoString: string) => {
  if (!isoString) return 'N/A';
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

  // Use the correct status field
  const { icon, colorClass } = getStatusAssets(transaction.paymentStatus);
  
  // Safely construct the customer name
  const customerName = `${transaction.user?.firstName || ''} ${transaction.user?.lastName || 'N/A'}`.trim();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        
        <header className="modal-header">
          <div className="modal-title">
            {/* Use the correct field: paymentType */}
            <p>{transaction.paymentType?.toUpperCase() || 'TRANSACTION'}</p>
            {/* Use the correct field: amountPaid */}
            <h1>{formatCurrency(transaction.amountPaid)}</h1>
            <span>Transaction ID: {transaction.id}</span>
          </div>
          <div className={`modal-status-icon-wrapper ${colorClass}`}>
            <img src={icon} alt={`${transaction.paymentStatus} icon`} />
          </div>
        </header>

        <div className="modal-details">
          <div className="detail-row">
            <span className="detail-label">Sender</span>
            <span className="detail-value">{customerName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Type</span>
            {/* Use the correct field: paymentType */}
            <span className="detail-value status-text-green">{transaction.paymentType || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Channel</span>
            {/* Use optional chaining and a fallback for fields that might not exist */}
            <span className="detail-value">{transaction.channel || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status</span>
            {/* Use the correct field: paymentStatus */}
            <span className={`detail-value status-text ${colorClass}`}>{transaction.paymentStatus || 'UNKNOWN'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Time stamp</span>
            {/* Use the correct field: createdAt */}
            <span className="detail-value">{formatTimestamp(transaction.createdAt)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Category</span>
            <span className="detail-value">{transaction.category || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Remark</span>
            <span className="detail-value">{transaction.remark || 'No remark'}</span>
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