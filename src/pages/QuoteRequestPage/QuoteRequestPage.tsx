// src/pages/QuoteRequestPage/QuoteRequestPage.tsx
import React, { useState, useMemo } from 'react';
import './QuoteRequestPage.css';
import { mockQuoteRequests, QuoteRequest } from '../../data/mockQuoteRequest';

// --- IMPORT YOUR ICONS ---
import filterIcon from '../../assets/images/filterIcon.png';
import searchIcon from '../../assets/images/search-icon.jpeg';
import emptyQuoteIcon from '../../assets/images/quote-icon.png';
import prevIcon from '../../assets/images/previcon.png';
import nextIcon from '../../assets/images/nexticon.png';
// --- NEW ICONS FOR TABLE ACTIONS ---
import mailIcon from '../../assets/images/mailicon.png';
import downloadIcon from '../../assets/images/messageicon.png';

const ITEMS_PER_PAGE = 8;

const QuoteRequestPage: React.FC = () => {
  const [requests, setRequests] = useState<QuoteRequest[]>(mockQuoteRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRequests = useMemo(() => {
    if (!searchQuery) return requests;
    return requests.filter(req =>
      req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [requests, searchQuery]);

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const currentRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleEmailQuote = (requestId: string) => {
    alert(`Emailing quote for Request ID: ${requestId}`);
  };

  const handleDownloadQuote = (requestId: string) => {
    alert(`Downloading quote for Request ID: ${requestId}`);
  };

  if (requests.length === 0) {
    // Empty state component is unchanged
    return (
      <div className="quote-request-page empty">
        {/* ... empty state JSX ... */}
      </div>
    );
  }

  return (
    <div className="quote-request-page">
      <div className="page-header">
        <h3>All Quote Requests</h3>
        <div className="controls">
          <button className="filter-button">
            <img src={filterIcon} alt="Filter" />
          </button>
          <div className="table-search-bar">
            <img src={searchIcon} alt="Search" />
            <input
              type="text"
              placeholder="Search by Request ID, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            {/* UPDATED TABLE HEADERS */}
            <tr>
              <th>Request ID</th>
              <th>Email</th>
              <th>Service</th>
              <th>Location From</th>
              <th>Location To</th>
              <th>Goods Type</th>
              <th>Weight</th>
              <th>Date</th>
              <th></th>{/* Empty header for actions */}
            </tr>
          </thead>
          <tbody>
            {currentRequests.map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.email}</td>
                <td>{req.service}</td>
                <td>{req.locationFrom}</td>
                <td>{req.locationTo}</td>
                <td>{req.goodsType}</td>
                <td>{req.weight}</td>
                <td>{req.date}</td>
                {/* UPDATED ACTION ICONS */}
                <td>
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

      <div className="pagination-controls">
        <span className="pagination-info">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredRequests.length)} of {filteredRequests.length}
        </span>
        <div className="pagination-buttons">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            <img src={prevIcon} alt="Previous" />
          </button>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            <img src={nextIcon} alt="Next" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteRequestPage;