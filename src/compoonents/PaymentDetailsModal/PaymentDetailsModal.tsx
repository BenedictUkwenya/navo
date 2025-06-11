import React from 'react';
import './PaymentDetailsModal.css';
import { PurchaseOrder } from '../../data/mockPurchaseOrders';
import completedIcon from '../../assets/images/completedicon.png';

interface PaymentDetailsModalProps {
  order: PurchaseOrder;
  onClose: () => void;
  onConfirm: () => void;
}

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({ order, onClose, onConfirm }) => {
  const totalCost = order.cartItems.reduce((acc, item) => acc + (item.totalCost || 0), 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Payment Details</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body payment-details-body">
          <div className="payment-info-row">
            <span>Total Cost of Order</span>
            <span className="payment-amount">₦{totalCost.toLocaleString()}</span>
          </div>
          <div className="payment-info-row">
            <span>Payment Status</span>
            <div className="payment-status-chip">
              <img src={completedIcon} alt="Completed" />
              <span>Completed</span>
            </div>
          </div>
          <div className="payment-info-row">
            <span>Paid on</span>
            <span>{new Date(order.paymentDetails!.paymentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
        <div className="modal-footer">
          <button className="confirm-btn" onClick={onConfirm}>
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;