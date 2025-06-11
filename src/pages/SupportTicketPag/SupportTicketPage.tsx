// src/pages/SupportTicketPage/SupportTicketPage.tsx

import React, { useState, useMemo } from 'react';
import './SupportTicketPage.css';

// Data and Type Imports
import { mockSupportTickets, SupportTicket, TicketStatus } from '../../data/mockSupportTickets';

// Component Imports
import SupportTicketModal from '../../compoonents/SupportTicketModal/SupportTicketModal';

// Icon Imports
import emptyIcon from '../../assets/images/support.png';
import viewDetailsIcon from '../../assets/images/eyeicon.png';
import searchIcon from '../../assets/images/searchicon.png';
import filterIcon from '../../assets/images/filterIcon.png';
import prevIcon from '../../assets/images/previcon.png';
import nextIcon from '../../assets/images/nexticon.png';

const ITEMS_PER_PAGE = 9;

const SupportTicketPage: React.FC = () => {
  // State for page filters and pagination
  const [activeStatus, setActiveStatus] = useState<TicketStatus | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // State for the details modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // Memoized filtering logic for performance
  const filteredTickets = useMemo(() => {
    return mockSupportTickets
      .filter(ticket => {
        if (activeStatus === 'All') return true;
        return ticket.status === activeStatus;
      })
      .filter(ticket => {
        if (!searchTerm) return true;
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return (
          ticket.customerName.toLowerCase().includes(lowercasedSearchTerm) ||
          ticket.email.toLowerCase().includes(lowercasedSearchTerm) ||
          ticket.ticketId.toLowerCase().includes(lowercasedSearchTerm) ||
          ticket.title.toLowerCase().includes(lowercasedSearchTerm)
        );
      });
  }, [activeStatus, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
  const currentTickets = filteredTickets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // --- HANDLERS ---
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  
  const handleViewDetails = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Delay clearing the data to allow for closing animation
    setTimeout(() => setSelectedTicket(null), 300);
  };

  // --- HELPERS ---
  const getStatusClass = (status: TicketStatus) => `status-${status.toLowerCase()}`;
  const getPriorityClass = (priority: string) => `priority-${priority.toLowerCase()}`;
  const filterTabs: (TicketStatus | 'All')[] = ['All', 'Pending', 'Closed'];

  // --- RENDER LOGIC ---

  // Empty state view
  if (mockSupportTickets.length === 0) {
    return (
      <div className="support-ticket-page page--empty">
        <img src={emptyIcon} alt="No tickets" />
        <h2>No tickets recorded yet</h2>
      </div>
    );
  }

  return (
    <>
      <div className="support-ticket-page">
        <header className="page-controls-header">
          <div className="filter-tabs">
            {filterTabs.map(tab => (
              <button
                key={tab}
                className={activeStatus === tab ? 'active' : ''}
                onClick={() => { setActiveStatus(tab); setCurrentPage(1); }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="search-and-filter">
            <button className="filter-btn">
              <img src={filterIcon} alt="Filter" />
            </button>
            <div className="page-search-bar">
              <img src={searchIcon} alt="Search" />
              <input
                type="text"
                placeholder="Search by name, ID, status"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
              {searchTerm && <button className="clear-btn" onClick={() => setSearchTerm('')}>×</button>}
            </div>
          </div>
        </header>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Ticket ID</th>
                <th>Ticket Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentTickets.map(ticket => (
                <tr key={ticket.id}>
                  <td data-label="Name">{ticket.customerName}</td>
                  <td data-label="Email">{ticket.email}</td>
                  <td data-label="Ticket ID">{ticket.ticketId}</td>
                  <td data-label="Ticket Title">{ticket.title}</td>
                  <td data-label="Priority">
                    <span className={`priority-badge ${getPriorityClass(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td data-label="Status">
                    <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td data-label="Action">
                    <img
                      src={viewDetailsIcon}
                      alt="View Details"
                      className="action-icon"
                      onClick={() => handleViewDetails(ticket)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="page-footer">
          <div className="pagination-info">
            Showing {filteredTickets.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredTickets.length)} of {filteredTickets.length}
          </div>
          <div className="pagination-controls">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              <img src={prevIcon} alt="Previous" />
            </button>
            <button onClick={handleNextPage} disabled={currentPage >= totalPages}>
              <img src={nextIcon} alt="Next" />
            </button>
          </div>
        </footer>
      </div>

      {/* Conditionally render the modal outside the main page flow */}
      {selectedTicket && (
        <SupportTicketModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          ticket={selectedTicket}
        />
      )}
    </>
  );
};

export default SupportTicketPage;