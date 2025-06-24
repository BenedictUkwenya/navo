import React, { useState, useEffect } from 'react';
import './QuoteRequestPage.css';
import { getQuotes, deleteQuote } from '../../services/quoteService';
import { Quote } from '../../types/quote';

// --- ICON IMPORTS ---
import filterIcon from '../../assets/images/filterIcon.png';
import searchIcon from '../../assets/images/searchicon.png';
import emptyQuoteIcon from '../../assets/images/quote-icon.png';
import prevIcon from '../../assets/images/previcon.png';
import nextIcon from '../../assets/images/nexticon.png';
import mailIcon from '../../assets/images/mailicon.png';
import downloadIcon from '../../assets/images/messageicon.png';
import deleteIcon from '../../assets/images/kebaicon.png'; // Assuming this is your delete/kebab icon

const QuoteRequestPage: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuotes, setTotalQuotes] = useState(0);

  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getQuotes(currentPage);
      setQuotes(response.quotes);
      setTotalPages(response.totalPages);
      setTotalQuotes(response.total);
    } catch (err) {
      setError('Failed to load quote requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [currentPage]);

  const handleDeleteQuote = async (quoteId: string) => {
    // Optimistic UI: Remove the quote from the list immediately
    setQuotes(prevQuotes => prevQuotes.filter(q => q.id !== quoteId));
    try {
      await deleteQuote(quoteId);
      // Optional: show a success notification
      alert(`Quote ${quoteId} deleted successfully.`);
      // Refetch the data to ensure consistency, especially if pagination changes
      fetchQuotes(); 
    } catch (err) {
      // If the delete fails, revert the UI change
      setError('Failed to delete quote. Please refresh and try again.');
      fetchQuotes(); // Re-fetch to get the original state
    }
  };

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };

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
          <div className="page-search-bar"><img src={searchIcon} alt="Search" /><input type="text" placeholder="Search..."/></div>
        </div>
      </header>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr><th>Request ID</th><th>Email</th><th>Service</th><th>Location From</th><th>Location To</th><th>Goods Type</th><th>Weight</th><th>Date</th><th>Action</th></tr>
          </thead>
          <tbody>
            {quotes.map((req) => (
              <tr key={req.id}>
                <td data-label="Request ID">{req.id}</td>
                <td data-label="Email">{req.email}</td>
                <td data-label="Service">{req.service}</td>
                <td data-label="Location From">{req.locationFrom}</td>
                <td data-label="Location To">{req.locationTo}</td>
                <td data-label="Goods Type">{req.goodsType}</td>
                <td data-label="Weight">{req.weight}</td>
                <td data-label="Date">{new Date(req.date).toLocaleDateString()}</td>
                <td data-label="Action">
                  <div className="action-icons-container">
                    <img src={mailIcon} alt="Email" className="action-icon" onClick={() => alert(`Emailing ${req.id}`)} />
                    <img src={downloadIcon} alt="Download" className="action-icon" onClick={() => alert(`Downloading ${req.id}`)} />
                    <img src={deleteIcon} alt="Delete" className="action-icon" onClick={() => handleDeleteQuote(req.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="page-footer">
        <div className="pagination-info">Showing page {currentPage} of {totalPages}</div>
        <div className="pagination-controls">
          <button onClick={handlePrevPage} disabled={currentPage === 1}><img src={prevIcon} alt="Previous" /></button>
          <button onClick={handleNextPage} disabled={currentPage >= totalPages}><img src={nextIcon} alt="Next" /></button>
        </div>
      </footer>
    </div>
  );
};

export default QuoteRequestPage;