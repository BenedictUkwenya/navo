import React from 'react';
import './SupportTicketModal.css';
import { SupportTicket } from '../../types/supportTicket';

// Icon Imports
import docIcon from '../../assets/images/purchaseicon.png';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: SupportTicket;
}

const formatDateTime = (isoString: string | undefined) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  }).replace(',', '');
};

const SupportTicketModal: React.FC<ModalProps> = ({ isOpen, onClose, ticket }) => {
  if (!isOpen) {
    return null;
  }

  // Safely construct the name and get the status
  const customerName = `${ticket.user?.first_name || ''} ${ticket.user?.last_name || ''}`.trim() || 'N/A';
  // Default to 'Open' if the API doesn't provide a status
  const status = ticket.status || 'Open'; 

  return (
    <div className="st-modal-overlay" onClick={onClose}>
      <div className="st-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="st-modal-close-btn" onClick={onClose}>×</button>
        
        <header className="st-modal-header">
          <p className="ticket-status-label">TICKET - {status.toUpperCase()}</p>
          <h1>{customerName}</h1>
          <span>Ticket ID: {ticket.id}</span>
        </header>

        <div className="st-modal-details-grid">
          <div><label>Ticket Subject</label><p>Customer Support Request</p></div>
          <div><label>Customer Complaint</label><p className="complaint-text">Details for this ticket are not available via the current API.</p></div>
          <div><label>Date and time</label><p>{formatDateTime(ticket.createdAt)}</p></div>
        </div>

        {/* Since API doesn't provide attachments, this will be hidden */}
        {/* {ticket.attachment && ( ... )} */}
        
        {/* === THIS IS THE FIX === */}
        {/* We check for statuses that allow a reply, like 'Open' or 'In Progress' */}
        {(status === 'Open' || status === 'In Progress') && (
          <div className="response-section">
            <label>Response</label>
            <textarea placeholder="Enter here"></textarea>
          </div>
        )}

        <footer className="st-modal-footer">
          <button className="btn-primary" onClick={onClose}>Close</button>
          {/* We use the same condition to decide which button to show */}
          {(status === 'Open' || status === 'In Progress') ? (
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