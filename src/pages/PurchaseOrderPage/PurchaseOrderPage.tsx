import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './PurchaseOrdersPage.css';
import { getOrders } from '../../services/purchaseOrderService';
import { Order } from '../../types/order';

// --- ICON IMPORTS ---
import emptyIcon from '../../assets/images/purchaseicon.png';
import viewDetailsIcon from '../../assets/images/eyeicon.png';
import filterIcon from '../../assets/images/filterIcon.png';
import searchIcon from '../../assets/images/searchicon.png';
import prevIcon from '../../assets/images/previcon.png';
import nextIcon from '../../assets/images/nexticon.png';

const PurchaseOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getOrders(currentPage);
        // Correctly access the nested data
        setOrders(response.data.allOrders || []);
        setTotalPages(response.data.pagination.totalPages || 1);
      } catch (err) {
        setError('Failed to load purchase orders.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentPage]);

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    const lower = searchTerm.toLowerCase();
    return orders.filter(order =>
      (`${order.user?.firstName || ''} ${order.user?.lastName || ''}`).toLowerCase().includes(lower) ||
      order.user?.email.toLowerCase().includes(lower) ||
      order.id.toLowerCase().includes(lower)
    );
  }, [searchTerm, orders]);

  const handleViewDetails = (orderId: string) => navigate(`/purchase-orders/${orderId}`);

  if (loading) return <div className="page-loading">Loading Purchase Orders...</div>;
  if (error) return <div className="page-error">{error}</div>;
  if (orders.length === 0 && !loading) {
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
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </header>
      <div className="table-container">
        <table className="data-table">
          <thead><tr><th>Order ID</th><th>Name</th><th>Email</th><th>Date Created</th><th>Action</th></tr></thead>
          <tbody>
            {filteredOrders.map(order => {
              const fullName = `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() || 'N/A';
              return (
                <tr key={order.id}>
                  <td data-label="Order ID">{order.id}</td>
                  <td data-label="Name">{fullName}</td>
                  <td data-label="Email">{order.user.email}</td>
                  <td data-label="Date Created">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td data-label="Action"><img src={viewDetailsIcon} alt="View" className="action-icon" onClick={() => handleViewDetails(order.id)} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <footer className="page-footer">
        <div className="pagination-info">Page {currentPage} of {totalPages}</div>
        <div className="pagination-controls">
          <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}><img src={prevIcon} alt="Previous" /></button>
          <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages}><img src={nextIcon} alt="Next" /></button>
        </div>
      </footer>
    </div>
  );
};

export default PurchaseOrdersPage;