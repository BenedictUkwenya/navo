import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './PurchaseOrdersPage.css';
import { mockPurchaseOrders } from '../../data/mockPurchaseOrders';

// Import the new icons we'll need
import emptyIcon from '../../assets/images/purchaseicon.png';
import viewDetailsIcon from '../../assets/images/eyeicon.png';
import filterIcon from '../../assets/images/filterIcon.png'; // From your assets list
import searchIcon from '../../assets/images/searchicon.png'; // From your assets list
import prevIcon from '../../assets/images/previcon.png';
import nextIcon from '../../assets/images/nexticon.png';

const ITEMS_PER_PAGE = 9; // Based on your design showing "1-09"

const PurchaseOrderPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State for search term and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // --- Filtering and Memoization ---
  // We use useMemo to avoid re-calculating the filtered list on every single render.
  // It will only re-calculate if the search term or the original orders change.
  const filteredOrders = useMemo(() => {
    if (!searchTerm) {
      return mockPurchaseOrders;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return mockPurchaseOrders.filter(order =>
      order.customerName.toLowerCase().includes(lowercasedSearchTerm) ||
      order.email.toLowerCase().includes(lowercasedSearchTerm) ||
      order.userId.includes(lowercasedSearchTerm)
    );
  }, [searchTerm]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  
  const handleViewDetails = (orderId: string) => {
    navigate(`/purchase-orders/${orderId}`);
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  // --- Empty State View ---
  if (mockPurchaseOrders.length === 0) {
    return (
      <div className="po-page po-page--empty">
        <img src={emptyIcon} alt="No purchase orders" />
        <h3>No purchase order from customer yet</h3>
      </div>
    );
  }

  // --- Table View ---
  return (
    <div className="po-page">
      <div className="po-header">
        <h3>All Purchase Orders</h3>
        <div className="po-controls">
          <button className="filter-btn">
            <img src={filterIcon} alt="Filter" />
          </button>
          <div className="search-bar">
            <img src={searchIcon} alt="Search" className="search-bar-icon" />
            <input
              type="text"
              placeholder="Search by service, location, date"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-btn" onClick={() => setSearchTerm('')}>×</button>
            )}
          </div>
        </div>
      </div>

      <div className="po-table-container">
        <table className="po-table">
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
                <td>{order.userId}</td>
                <td>{order.customerName}</td>
                <td>{order.email}</td>
                <td>{order.phone}</td>
                <td>{order.country}</td>
                <td>{order.totalQuantity}</td>
                <td>{order.category}</td>
                <td>
                  <span className={`status-badge status-${order.status.toLowerCase().replace(' ', '-')}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <img src={viewDetailsIcon} alt="View Details" className="action-icon" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="po-footer">
        <div className="pagination-info">
          Showing {Math.min(indexOfFirstItem + 1, filteredOrders.length)}-{Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length}
        </div>
        <div className="pagination-controls">
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

export default PurchaseOrderPage;