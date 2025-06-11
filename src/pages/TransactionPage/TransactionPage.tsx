// src/pages/TransactionPage/TransactionPage.tsx

import React, { useState, useMemo } from 'react';
import './TransactionPage.css';
import { mockTransactions, Transaction, TransactionStatus } from '../../data/mockTransactions';

// Component Imports
import TransactionDetailsModal from '../../compoonents/TransactionDetailsModal/TransactionDetailsModal';

// Icon Imports
import emptyIcon from '../../assets/images/transactionicon.png';
import viewDetailsIcon from '../../assets/images/eyeicon.png';
import searchIcon from '../../assets/images/searchicon.png';
import prevIcon from '../../assets/images/previcon.png';
import nextIcon from '../../assets/images/nexticon.png';
import pdfIcon from '../../assets/images/purchaseicon.png'; 
import csvIcon from '../../assets/images/shipment-icon.png';

const ITEMS_PER_PAGE = 9;

const TransactionPage: React.FC = () => {
  // State for filtering and pagination
  const [activeStatus, setActiveStatus] = useState<TransactionStatus | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // State for managing the details modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Memoized filtering logic for performance
  const filteredTransactions = useMemo(() => {
    return mockTransactions
      .filter(transaction => {
        if (activeStatus === 'All') return true;
        return transaction.status === activeStatus;
      })
      .filter(transaction => {
        if (!searchTerm) return true;
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return (
          transaction.customerName.toLowerCase().includes(lowercasedSearchTerm) ||
          transaction.transactionId.toLowerCase().includes(lowercasedSearchTerm) ||
          transaction.category.toLowerCase().includes(lowercasedSearchTerm)
        );
      });
  }, [activeStatus, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // --- HANDLER FUNCTIONS ---
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // A small delay can make the closing animation smoother before clearing the data
    setTimeout(() => setSelectedTransaction(null), 300);
  };
  
  const handleExportCSV = () => {
    const headers = ["Name", "Transaction ID", "Category", "Amount", "Date", "Type", "Status", "Remark"];
    const rows = filteredTransactions.map(t => 
      [t.customerName, t.transactionId, t.category, t.amount, t.date, t.type, t.status, `"${t.remark}"`].join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    alert("PDF export functionality is a placeholder.");
  };

  // --- UTILITY & HELPER VALUES ---
  const formatCurrency = (amount: number) => `₦${amount.toLocaleString('en-US')}`;
  const getStatusClass = (status: TransactionStatus) => `status-${status.toLowerCase()}`;
  const filterTabs: (TransactionStatus | 'All')[] = ['All', 'Pending', 'Successful', 'Failed'];

  // --- RENDER LOGIC ---

  // Empty state view
  if (mockTransactions.length === 0) {
    return (
      <div className="transaction-page transaction-page--empty">
        <img src={emptyIcon} alt="No transactions" />
        <h2>No transactions recorded yet</h2>
      </div>
    );
  }

  // Main page view
  return (
    <>
      <div className="transaction-page">
        <header className="transaction-header">
          <div className="date-filters">
            <input type="date" />
            <input type="date" />
          </div>
          <div className="right-controls">
            <div className="export-buttons">
              <button className="export-btn" onClick={handleExportPDF}>PDF <img src={pdfIcon} alt="PDF"/></button>
              <button className="export-btn" onClick={handleExportCSV}>CSV <img src={csvIcon} alt="CSV"/></button>
            </div>
            <div className="transaction-search-bar">
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

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Transaction ID</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td data-label="Name">{transaction.customerName}</td>
                  <td data-label="Transaction ID">{transaction.transactionId}</td>
                  <td data-label="Category">{transaction.category}</td>
                  <td data-label="Amount">{formatCurrency(transaction.amount)}</td>
                  <td data-label="Date">{new Date(transaction.date).toLocaleDateString('en-GB')}</td>
                  <td data-label="Type">{transaction.type}</td>
                  <td data-label="Status">
                    <span className={`status-badge ${getStatusClass(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td data-label="Action">
                    <img 
                      src={viewDetailsIcon} 
                      alt="View Details" 
                      className="action-icon"
                      onClick={() => handleViewDetails(transaction)} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="page-footer">
          <div className="pagination-info">
            Showing {filteredTransactions.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length}
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

      {/* Render the modal outside the main page div for proper stacking context */}
      {selectedTransaction && (
        <TransactionDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          transaction={selectedTransaction}
        />
      )}
    </>
  );
};

export default TransactionPage;