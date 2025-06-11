// src/pages/CustomersPage/CustomersPage.tsx

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomersPage.css';
import { mockCustomers, Customer } from '../../data/mockCustomers';

// --- CORRECTED ICON IMPORTS ---
import filterIcon from '../../assets/images/filterIcon.png';
import searchIcon from '../../assets/images/searchicon.png';
import emptyStateIcon from '../../assets/images/emptycustomers.png';
import viewDetailsIcon from '../../assets/images/eyeicon.png';
import prevIcon from '../../assets/images/previcon.png';
import nextIcon from '../../assets/images/nexticon.png';

const ITEMS_PER_PAGE = 9;

const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Memoized filtering logic (remains the same)
  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return mockCustomers;
    const lowercasedQuery = searchQuery.toLowerCase();
    return mockCustomers.filter(customer =>
      customer.name.toLowerCase().includes(lowercasedQuery) ||
      customer.phone.toLowerCase().includes(lowercasedQuery) ||
      customer.status.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery]);

  // Pagination logic (remains the same)
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const currentCustomers = filteredCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleViewDetails = (customerId: string) => navigate(`/customers/${customerId}`);

  if (mockCustomers.length === 0) {
    return (
      <div className="customers-page page--empty">
        <img src={emptyStateIcon} alt="No customers" />
        <h3>No customer has signed up yet</h3>
      </div>
    );
  }

  return (
    <div className="customers-page">
      <header className="page-header">
        <h3>All customers</h3>
        <div className="page-controls">
          <button className="filter-btn">
            <img src={filterIcon} alt="Filter" />
          </button>
          <div className="page-search-bar">
            <img src={searchIcon} alt="Search" />
            <input
              type="text"
              placeholder="Search by name, phone, status"
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
              <th>User ID</th>
              <th>Name</th>
              <th>Phone no.</th>
              <th>Email</th>
              <th>Date Created</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((customer) => (
              <tr key={customer.id}>
                <td data-label="User ID">{customer.id}</td>
                <td data-label="Name">{customer.name}</td>
                <td data-label="Phone no.">{customer.phone}</td>
                <td data-label="Email">{customer.email}</td>
                <td data-label="Date Created">{customer.dateCreated}</td>
                <td data-label="Status">
                  <span className={`status-badge status-${customer.status.toLowerCase()}`}>
                    {customer.status}
                  </span>
                </td>
                <td data-label="Action">
                  <img 
                    src={viewDetailsIcon} 
                    alt="View details" 
                    className="action-icon" 
                    onClick={() => handleViewDetails(customer.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="page-footer">
        <div className="pagination-info">
          Showing {filteredCustomers.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredCustomers.length)} of {filteredCustomers.length}
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

export default CustomersPage;