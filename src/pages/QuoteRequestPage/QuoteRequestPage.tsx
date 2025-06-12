// src/pages/QuoteRequestPage/QuoteRequestPage.tsx

import React, { useState, useMemo } from 'react';
import './QuoteRequestPage.css';
import { mockQuoteRequests, QuoteRequest } from '../../data/mockQuoteRequest';

// --- CORRECTED & STANDARDIZED ICON IMPORTS ---
import filterIcon from '../../assets/images/filterIcon.png';
import searchIcon from '../../assets/images/searchicon.png';
import emptyQuoteIcon from '../../assets/images/quote-icon.png';
import prevIcon from '../../assets/images/previcon.png';
import nextIcon from '../../assets/images/nexticon.png';
import mailIcon from '../../assets/images/mailicon.png';
import downloadIcon from '../../assets/images/messageicon.png'; // Assuming this is your download icon

const ITEMS_PER_PAGE = 8;

const QuoteRequestPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Memoized filtering logic (no changes needed)
  const filteredRequests = useMemo(() => {
    if (!searchQuery) return mockQuoteRequests;
    const lowercasedQuery = searchQuery.toLowerCase();
    return mockQuoteRequests.filter(req =>
      req.email.toLowerCase().includes(lowercasedQuery) ||
      req.id.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery]);

  // Pagination logic (no changes needed)
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const currentRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleEmailQuote = (id: string) => alert(`Emailing quote for ID: ${id}`);
  const handleDownloadQuote = (id: string) => alert(`Downloading quote for ID: ${id}`);

  if (mockQuoteRequests.length === 0) {
    return (
      <div className="quote-request-page page--empty">
        <img src={emptyQuoteIcon} alt="No quote requests" />
        <h3>No quote requests have been made yet</h3>
      </div>
    );
  }

  return (
    <div className="quote-request-page">
      <header className="page-header">
        <h3>All Quote Requests</h3>
        <div className="page-controls">
          <button className="filter-btn">
            <img src={filterIcon} alt="Filter" />
          </button>
          <div className="page-search-bar">
            <img src={searchIcon} alt="Search" />
            <input
              type="text"
              placeholder="Search by Request ID, email..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>
      </header>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Email</th>
              <th>Service</th>
              <th>Location From</th>
              <th>Location To</th>
              <th>Goods Type</th>
              <th>Weight</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.map((req) => (
              <tr key={req.id}>
                <td data-label="Request ID">{req.id}</td>
                <td data-label="Email">{req.email}</td>
                <td data-label="Service">{req.service}</td>
                <td data-label="Location From">{req.locationFrom}</td>
                <td data-label="Location To">{req.locationTo}</td>
                <td data-label="Goods Type">{req.goodsType}</td>
                <td data-label="Weight">{req.weight}</td>
                <td data-label="Date">{req.date}</td>
                <td data-label="Action">
                  <div className="action-icons-container">
                    <img 
                      src={mailIcon} 
                      alt="Email quote" 
                      className="action-icon" 
                      onClick={() => handleEmailQuote(req.id)}
                    />
                    <img 
                      src={downloadIcon} 
                      alt="Download quote" 
                      className="action-icon" 
                      onClick={() => handleDownloadQuote(req.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="page-footer">
        <div className="pagination-info">
          Showing {filteredRequests.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredRequests.length)} of {filteredRequests.length}
        </div>
        <div className="pagination-controls">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            <img src={prevIcon} alt="Previous" />
          </button>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            <img src={nextIcon} alt="Next" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default QuoteRequestPage;