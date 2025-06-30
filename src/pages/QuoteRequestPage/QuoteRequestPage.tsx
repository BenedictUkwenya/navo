import React, { useState, useEffect, useMemo } from 'react';
import './QuoteRequestPage.css';
import { getQuotes } from '../../services/quoteService';
import { Quote } from '../../types/quote';

// --- ICON IMPORTS ---
import filterIcon from '../../assets/images/filterIcon.png';
import searchIcon from '../../assets/images/searchicon.png';
import emptyQuoteIcon from '../../assets/images/quote-icon.png';
import prevIcon from '../../assets/images/previcon.png';
import nextIcon from '../../assets/images/nexticon.png';
import mailIcon from '../../assets/images/mailicon.png';
import downloadIcon from '../../assets/images/messageicon.png';

const QuoteRequestPage: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getQuotes(currentPage);
        setQuotes(response.data.quotes || []);
        setTotalPages(response.data.pagination.totalPages || 1);
        setTotalItems(response.data.pagination.totalItems || 0);
      } catch (err) {
        setError('Failed to load quote requests.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, [currentPage]);

  // Client-side filtering (can be moved to backend later)
  const filteredQuotes = useMemo(() => {
    if (!searchQuery) return quotes;
    const lower = searchQuery.toLowerCase();
    return quotes.filter(q => q.email.toLowerCase().includes(lower) || q.id.toLowerCase().includes(lower));
  }, [searchQuery, quotes]);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(p => p + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };
  const handleEmailQuote = (id: string) => alert(`Emailing quote for ID: ${id}`);
  const handleDownloadQuote = (id: string) => alert(`Downloading quote for ID: ${id}`);

  if (loading) return <div className="page-loading">Loading Quote Requests...</div>;
  if (error) return <div className="page-error">{error}</div>;

  if (quotes.length === 0 && !loading) {
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
          <button className="filter-btn"><img src={filterIcon} alt="Filter" /></button>
          <div className="page-search-bar">
            <img src={searchIcon} alt="Search" />
            <input type="text" placeholder="Search by Request ID, email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
            {filteredQuotes.map((quote) => (
              <tr key={quote.id}>
                <td data-label="Request ID">{quote.id}</td>
                <td data-label="Email">{quote.email}</td>
                <td data-label="Service">{quote.serviceType}</td>
                <td data-label="Location From">{quote.locationFrom}</td>
                <td data-label="Location To">{quote.locationTo}</td>
                <td data-label="Goods Type">{quote.goodsType}</td>
                <td data-label="Weight">{`${quote.weight}kg`}</td>
                <td data-label="Date">{new Date(quote.createdAt).toLocaleDateString()}</td>
                <td data-label="Action">
                  <div className="action-icons-container">
                    <img src={mailIcon} alt="Email" className="action-icon" onClick={() => handleEmailQuote(quote.id)} />
                    <img src={downloadIcon} alt="Download" className="action-icon" onClick={() => handleDownloadQuote(quote.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="page-footer">
        <div className="pagination-info">Showing page {currentPage} of {totalPages} ({totalItems} items)</div>
        <div className="pagination-controls">
          <button onClick={handlePrevPage} disabled={currentPage === 1}><img src={prevIcon} alt="Previous" /></button>
          <button onClick={handleNextPage} disabled={currentPage >= totalPages}><img src={nextIcon} alt="Next" /></button>
        </div>
      </footer>
    </div>
  );
};

export default QuoteRequestPage;