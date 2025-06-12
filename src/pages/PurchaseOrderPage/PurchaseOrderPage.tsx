// src/pages/PurchaseOrderPage/PurchaseOrderPage.tsx

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './PurchaseOrdersPage.css'; // Ensure CSS filename is consistent
import { mockPurchaseOrders } from '../../data/mockPurchaseOrders';

// Standardized Icon Imports
import emptyIcon from '../../assets/images/purchaseicon.png';
import viewDetailsIcon from '../../assets/images/eyeicon.png';
import filterIcon from '../../assets/images/filterIcon.png';
import searchIcon from '../../assets/images/searchicon.png';
import prevIcon from '../../assets/images/previcon.png';
import nextIcon from '../../assets/images/nexticon.png';

const ITEMS_PER_PAGE = 9;

const PurchaseOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return mockPurchaseOrders;
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return mockPurchaseOrders.filter(order =>
      order.customerName.toLowerCase().includes(lowercasedSearchTerm) ||
      order.email.toLowerCase().includes(lowercasedSearchTerm) ||
      order.userId.includes(lowercasedSearchTerm)
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const handleViewDetails = (orderId: string) => navigate(`/purchase-orders/${orderId}`);
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  if (mockPurchaseOrders.length === 0) {
    return (
      <div className="purchase-orders-page page--empty">
        <img src={emptyIcon} alt="No purchase orders" />
        <h3>No purchase orders from customers yet</h3>
      </div>
    );
  }

  return (
    <div className="purchase-orders-page">
      <header className="page-header">
        <h3>All Purchase Orders</h3>
        <div className="page-controls">
          <button className="filter-btn"><img src={filterIcon} alt="Filter" /></button>
          <div className="page-search-bar">
            <img src={searchIcon} alt="Search" />
            <input
              type="text"
              placeholder="Search by name, email, ID..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
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
              <th>Email</th>
              <th>Phone Number</th>
              <th>Country</th>
              <th>Quantity</th>
              <th>Category</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map(order => (
              <tr key={order.id} onClick={() => handleViewDetails(order.id)} title="View Details">
                <td data-label="User ID">{order.userId}</td>
                <td data-label="Name">{order.customerName}</td>
                <td data-label="Email">{order.email}</td>
                <td data-label="Phone Number">{order.phone}</td>
                <td data-label="Country">{order.country}</td>
                <td data-label="Quantity">{order.totalQuantity}</td>
                <td data-label="Category">{order.category}</td>
                <td data-label="Status">
                  <span className={`status-badge status-${order.status.toLowerCase().replace(' ', '-')}`}>
                    {order.status}
                  </span>
                </td>
                <td data-label="Action">
                  <img src={viewDetailsIcon} alt="View Details" className="action-icon" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="page-footer">
        <div className="pagination-info">
          Showing {filteredOrders.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length}
        </div>
        <div className="pagination-controls">
          <button onClick={handlePrevPage} disabled={currentPage === 1}><img src={prevIcon} alt="Previous" /></button>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}><img src={nextIcon} alt="Next" /></button>
        </div>
      </footer>
    </div>
  );
};

export default PurchaseOrderPage;