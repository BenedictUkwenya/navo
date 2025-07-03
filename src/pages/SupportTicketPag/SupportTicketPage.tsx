import React, { useState, useEffect, useMemo } from 'react';
import './SupportTicketPage.css';
import { getSupportTickets } from '../../services/supportTicketService';
import { SupportTicket } from '../../types/supportTicket';

// Component & Icon Imports
import SupportTicketModal from '../../compoonents/SupportTicketModal/SupportTicketModal';
import emptyIcon from '../../assets/images/support.png';
import viewDetailsIcon from '../../assets/images/eyeicon.png';
import searchIcon from '../../assets/images/searchicon.png';
import filterIcon from '../../assets/images/filterIcon.png';
import prevIcon from '../../assets/images/previcon.png';
import nextIcon from '../../assets/images/nexticon.png';

const ITEMS_PER_PAGE = 9;

const SupportTicketPage: React.FC = () => {
  // --- STATE FOR LIVE DATA ---
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Your existing state for UI controls
  const [activeStatus, setActiveStatus] = useState<'All' | 'Pending' | 'Closed'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // --- DATA FETCHING WITH useEffect ---
  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getSupportTickets(currentPage);
        // The API provides `allOrders`, so we use that.
        setTickets(response.data.allOrders || []);
        setTotalPages(response.data.pagination.totalPages || 1);
      } catch (err) {
        setError('Failed to load support tickets.');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [currentPage]); // Refetch when the page changes

  // Filtering now happens on the live data
  const filteredTickets = useMemo(() => {
    return tickets
      .filter(ticket => {
        // Since API doesn't provide status, we can't filter by it yet.
        // We will keep the UI but the filter won't do anything for now.
        if (activeStatus === 'All') return true;
        // return ticket.status === activeStatus;
        return true;
      })
      .filter(ticket => {
        if (!searchTerm) return true;
        const lower = searchTerm.toLowerCase();
        const fullName = `${ticket.user?.first_name || ''} ${ticket.user?.last_name || ''}`;
        return (
          fullName.toLowerCase().includes(lower) ||
          ticket.user.email.toLowerCase().includes(lower) ||
          ticket.id.toLowerCase().includes(lower)
        );
      });
  }, [activeStatus, searchTerm, tickets]);
  
  // Your handlers remain the same, they work perfectly
  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(p => p + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };
  const handleViewDetails = (ticket: SupportTicket) => { setSelectedTicket(ticket); setIsModalOpen(true); };
  const handleCloseModal = () => setIsModalOpen(false);

  // Render logic for loading and error states
  if (loading) return <div className="page-loading">Loading support tickets...</div>;
  if (error) return <div className="page-error">{error}</div>;

  if (tickets.length === 0 && !loading) {
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
            {(['All', 'Pending', 'Closed'] as const).map(tab => (
              <button key={tab} className={activeStatus === tab ? 'active' : ''} onClick={() => setActiveStatus(tab)}>
                {tab}
              </button>
            ))}
          </div>
          <div className="search-and-filter">
            <button className="filter-btn"><img src={filterIcon} alt="Filter" /></button>
            <div className="page-search-bar"><img src={searchIcon} alt="Search" /><input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          </div>
        </header>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Ticket ID</th>
                <th>Date Created</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map(ticket => (
                <tr key={ticket.id}>
                  <td>{`${ticket.user.first_name} ${ticket.user.last_name}`}</td>
                  <td>{ticket.user.email}</td>
                  <td>{ticket.id}</td>
                  <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  {/* API does not provide status, so we display a placeholder */}
                  <td><span className="status-badge status-pending">Pending</span></td>
                  <td><img src={viewDetailsIcon} alt="View" className="action-icon" onClick={() => handleViewDetails(ticket)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="page-footer">
          <div className="pagination-info">Page {currentPage} of {totalPages}</div>
          <div className="pagination-controls">
            <button onClick={handlePrevPage} disabled={currentPage === 1}><img src={prevIcon} alt="Previous" /></button>
            <button onClick={handleNextPage} disabled={currentPage >= totalPages}><img src={nextIcon} alt="Next" /></button>
          </div>
        </footer>
      </div>

      {selectedTicket && (
        <SupportTicketModal isOpen={isModalOpen} onClose={handleCloseModal} ticket={selectedTicket} />
      )}
    </>
  );
};

export default SupportTicketPage;