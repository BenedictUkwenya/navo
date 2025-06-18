 
import React from 'react';
import './SupportTicketModal.css';
import { SupportTicket } from '../../data/mockSupportTickets';

 
import docIcon from '../../assets/images/purchaseicon.png';  

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: SupportTicket;
}

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).replace(',', '');
};

const SupportTicketModal: React.FC<ModalProps> = ({ isOpen, onClose, ticket }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="st-modal-overlay" onClick={onClose}>
      <div className="st-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="st-modal-close-btn" onClick={onClose}>×</button>
        
        <header className="st-modal-header">
          <p className="ticket-status-label">TICKET - {ticket.status.toUpperCase()}</p>
          <h1>{ticket.customerName}</h1>
          <span>Ticket ID: {ticket.ticketId}</span>
        </header>

        <div className="st-modal-details-grid">
          <div>
            <label>Ticket Subject</label>
            <p>{ticket.phone}</p>
          </div>
          <div>
            <label>Customer Complaint</label>
            <p className="complaint-text">{ticket.complaint}</p>
          </div>
          <div>
            <label>Date and time</label>
            <p>{formatDateTime(ticket.dateTime)}</p>
          </div>
        </div>

        {ticket.attachment && (
          <div className="attachment-bar">
            <div className="attachment-info">
              <img src={docIcon} alt="document" />
              <div>
                <span className="attachment-type">{ticket.attachment.type}</span>
                <span className="attachment-name">{ticket.attachment.name}</span>
              </div>
            </div>
            <button className="view-btn">View</button>
          </div>
        )}
        
        {ticket.status === 'Pending' && (
          <div className="response-section">
            <label>Response</label>
            <textarea placeholder="Enter here"></textarea>
          </div>
        )}

        <footer className="st-modal-footer">
          <button className="btn-primary">Close</button>
          {ticket.status === 'Pending' ? (
            <button className="btn-secondary">Reply</button>
          ) : (
            <button className="btn-secondary">Re-open</button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default SupportTicketModal;