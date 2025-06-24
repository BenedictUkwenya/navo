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

// This type is for the component's internal state (lowercase)
type StatusFilter = 'all' | 'pending' | 'successful' | 'failed';

const TransactionPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        // --- THIS IS THE FIX FOR THE TYPESCRIPT ERROR ---
        // Translate our component's lowercase state to the uppercase format the API needs
        let apiStatus: 'all' | 'SUCCESSFUL' | 'PENDING' | 'FAILED' = 'all';
        if (activeStatus === 'successful') apiStatus = 'SUCCESSFUL';
        else if (activeStatus === 'pending') apiStatus = 'PENDING';
        else if (activeStatus === 'failed') apiStatus = 'FAILED';
        // ---------------------------------------------------

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

  const displayedTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) return [];
    if (!searchTerm) return transactions;
    const lower = searchTerm.toLowerCase();
    return transactions.filter(t =>
      (t.user?.firstName + ' ' + t.user?.lastName).toLowerCase().includes(lower) ||
      t.id?.toLowerCase().includes(lower)
    );
  }, [searchTerm, transactions]);

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  // --- RESTORED EXPORT FUNCTIONS ---
  const handleExportCSV = () => {
    const headers = ["Name", "Transaction ID", "Category", "Amount", "Date", "Type", "Status"];
    const rows = displayedTransactions.map(t => 
      [
        `"${t.user?.firstName || ''} ${t.user?.lastName || ''}"`,
        t.id,
        t.category,
        t.amountPaid,
        t.createdAt,
        t.paymentType,
        t.paymentStatus
      ].join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleExportPDF = () => {
    alert("PDF export functionality placeholder. This would call the getTransactionPdf service.");
  };
  // ------------------------------------

  if (loading) return <div className="page-loading">Loading transactions...</div>;
  if (error) return <div className="page-error">{error}</div>;

  return (
    <>
      <div className="transaction-page">
        <header className="page-header">
          <h3>Transactions</h3>
          <div className="right-controls">
            <div className="export-buttons">
              <button className="export-btn" onClick={handleExportPDF}>PDF <img src={pdfIcon} alt="PDF"/></button>
              <button className="export-btn" onClick={handleExportCSV}>CSV <img src={csvIcon} alt="CSV"/></button>
            </div>
            <div className="transaction-search-bar">
              <img src={searchIcon} alt="Search" />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
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
            <thead>
              <tr><th>Name</th><th>Transaction ID</th><th>Category</th><th>Amount</th><th>Date</th><th>Type</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {displayedTransactions.map(t => (
                <tr key={t.id}>
                  <td>{`${t.user?.firstName || ''} ${t.user?.lastName || 'N/A'}`}</td>
                  <td>{t.id}</td>
                  <td>{t.category || 'N/A'}</td>
                  <td>{typeof t.amountPaid === 'string' ? `₦${parseFloat(t.amountPaid).toLocaleString()}` : 'N/A'}</td>
                  <td>{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td>{t.paymentType || 'N/A'}</td>
                  <td>{t.paymentStatus ? <span className={`status-badge status-${t.paymentStatus.toLowerCase()}`}>{t.paymentStatus}</span> : 'N/A'}</td>
                  <td><img src={viewDetailsIcon} alt="View" className="action-icon" onClick={() => handleViewDetails(t)} /></td>
                </tr>
              ))}
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

      {selectedTransaction && (
        <TransactionDetailsModal
          isOpen={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          transaction={selectedTransaction}
        />
      )}
    </>
  );
};

export default TransactionPage;