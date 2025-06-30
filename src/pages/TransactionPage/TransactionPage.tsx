import React, { useState, useEffect, useMemo } from 'react';
import './TransactionPage.css';
import { getTransactions } from '../../services/transactionService';
import { Transaction } from '../../types/transaction';

// Component & Icon Imports
import TransactionDetailsModal from '../../compoonents/TransactionDetailsModal/TransactionDetailsModal';
import viewDetailsIcon from '../../assets/images/eyeicon.png';
import searchIcon from '../../assets/images/searchicon.png';
import prevIcon from '../../assets/images/previcon.png';
import nextIcon from '../../assets/images/nexticon.png';
import pdfIcon from '../../assets/images/purchaseicon.png';
import csvIcon from '../../assets/images/shipment-icon.png';

type StatusFilter = 'all' | 'pending' | 'successful' | 'failed';

const TransactionPage: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // --- DATA FETCHING ---
  // Find the useEffect hook
useEffect(() => {
  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Translate our component's lowercase state to the format the API needs
      const apiStatus = activeStatus === 'successful'
          ? 'SUCCESSFUL'
          : activeStatus === 'pending'
          ? 'PENDING'
          : activeStatus === 'failed'
          ? 'FAILED'
          : 'all';

      const response = await getTransactions(apiStatus, currentPage);
      setTransactions(response.data.transactions || []);
      setTotalPages(response.data.pagination.totalPages || 1);
    } catch (err) {
      setError('Failed to load transactions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  fetchTransactions();
}, [activeStatus, currentPage]);

// The rest of your component is fine.

  // --- DERIVED STATE ---
  const displayedTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) return [];
    if (!searchTerm) return transactions;
    const lower = searchTerm.toLowerCase();
    return transactions.filter(t =>
      (`${t.user?.firstName || ''} ${t.user?.lastName || ''}`).toLowerCase().includes(lower) ||
      t.id?.toLowerCase().includes(lower) ||
      t.transactionReference?.toLowerCase().includes(lower)
    );
  }, [searchTerm, transactions]);

  // --- HANDLERS ---
  const handleExportCSV = () => { /* ... implementation ... */ };
  const handleExportPDF = () => { /* ... implementation ... */ };

  // === THE RENDER LOGIC HELPER FUNCTION (THE FIX) ===
  const renderTableContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={9} className="table-message">Loading transactions...</td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={9} className="table-message error">{error}</td>
        </tr>
      );
    }

    if (displayedTransactions.length === 0) {
      return (
        <tr>
          <td colSpan={9} className="table-message">No transactions found for this filter.</td>
        </tr>
      );
    }

    return displayedTransactions.map(t => {
      const fullName = `${t.user?.firstName || ''} ${t.user?.lastName || ''}`.trim() || 'N/A';
      const amount = typeof t.amountPaid === 'string' ? `₦${parseFloat(t.amountPaid).toLocaleString()}` : 'N/A';
      const date = t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A';

      return (
        <tr key={t.id}>
          <td>{fullName}</td>
          <td>{t.id}</td>
          <td>{t.transactionReference}</td>
          <td>{t.category}</td>
          <td>{amount}</td>
          <td>{date}</td>
          <td>{t.paymentType}</td>
          <td><span className={`status-badge status-${t.paymentStatus.toLowerCase()}`}>{t.paymentStatus}</span></td>
          <td><img src={viewDetailsIcon} alt="View" className="action-icon" onClick={() => setSelectedTransaction(t)} /></td>
        </tr>
      );
    });
  };

  return (
    <>
      <div className="transaction-page">
        <header className="page-header">
          <h3>Transaction</h3>
          <div className="right-controls">
            <div className="export-buttons"><button className="export-btn" onClick={handleExportPDF}>PDF <img src={pdfIcon} alt="PDF"/></button><button className="export-btn" onClick={handleExportCSV}>CSV <img src={csvIcon} alt="CSV"/></button></div>
            <div className="transaction-search-bar"><img src={searchIcon} alt="Search" /><input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          </div>
        </header>

        <div className="filter-tabs">
          {(['all', 'successful', 'pending', 'failed'] as StatusFilter[]).map(tab => (
            <button key={tab} className={activeStatus === tab ? 'active' : ''} onClick={() => { setActiveStatus(tab); setCurrentPage(1); }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Transaction ID</th><th>Transaction Ref</th><th>Category</th><th>Amount</th><th>Date</th><th>Type</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {renderTableContent()}
            </tbody>
          </table>
        </div>
        
        <footer className="page-footer">
          <div className="pagination-info">Page {currentPage} of {totalPages}</div>
          <div className="pagination-controls">
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}><img src={prevIcon} alt="Prev" /></button>
            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages}><img src={nextIcon} alt="Next" /></button>
          </div>
        </footer>
      </div>

      {selectedTransaction && <TransactionDetailsModal isOpen={!!selectedTransaction} onClose={() => setSelectedTransaction(null)} transaction={selectedTransaction} />}
    </>
  );
};

export default TransactionPage;