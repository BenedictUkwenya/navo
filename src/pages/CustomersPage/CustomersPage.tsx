import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomersPage.css';
import { getCustomers } from '../../services/customerService';
import { Customer } from '../../types/customer';

// --- ICON IMPORTS ---
import filterIcon from '../../assets/images/filterIcon.png';
import searchIcon from '../../assets/images/searchicon.png';
import emptyStateIcon from '../../assets/images/emptycustomers.png';
import viewDetailsIcon from '../../assets/images/eyeicon.png';
import prevIcon from '../../assets/images/previcon.png';
import nextIcon from '../../assets/images/nexticon.png';

const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        // `response` is the full API response: { status, data: { ... } }
        const response = await getCustomers(currentPage);
        
        // === THIS IS THE FIX ===
        // Correctly access the nested properties from the response object
        setCustomers(response.data.customers || []);
        setTotalPages(response.data.pagination.totalPages || 1);
        setTotalItems(response.data.pagination.totalItems || 0);
        
      } catch (err) {
        setError('Failed to fetch customers.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCustomers();
  }, [currentPage]);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(p => p + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };
  const handleViewDetails = (customerId: string) => navigate(`/customers/${customerId}`);

  if (loading) return <div className="page-loading">Loading customers...</div>;
  if (error) return <div className="page-error">{error}</div>;

  if (customers.length === 0 && !loading) {
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
        <h3 style={{ color: '#174078' }}>All customers</h3>
        <div className="page-controls">
          <button className="filter-btn" style={{ width: "34px",  height: "34px"}}><img src={filterIcon} alt="Filter"  /></button>
          <div className="page-search-bar"><img src={searchIcon} alt="Search" /><input type="text" placeholder="Search by name, phone, status" /></div>
        </div>
      </header>
      <div className="table-container">
        <table className="data-table">
          <thead><tr><th>User ID</th><th>Name</th><th>Phone no.</th><th>Email</th><th>Date Created</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {customers.map((customer) => {
              const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'N/A';
              
              return (
                <tr key={customer.id}>
                  <td data-label="User ID">{customer.id}</td>
                  <td data-label="Name">{fullName}</td>
                  <td data-label="Phone no.">{customer.phoneNumber || 'N/A'}</td>
                  <td data-label="Email">{customer.email}</td>
                  <td data-label="Date Created">{new Date(customer.createdAt).toLocaleDateString()}</td>
                  <td data-label="Status"><span className={`status-badge status-${customer.isActive ? 'active' : 'inactive'}`}>{customer.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td data-label="Action"><img src={viewDetailsIcon} alt="View details" className="action-icon" onClick={() => handleViewDetails(customer.id)} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <footer className="page-footer">
        <div className="pagination-info">
          Showing page {currentPage} of {totalPages} ({totalItems} total customers)
        </div>
        <div className="pagination-controls">
          <button onClick={handlePrevPage} disabled={currentPage === 1}><img src={prevIcon} alt="Previous" /></button>
          <button onClick={handleNextPage} disabled={currentPage >= totalPages}><img src={nextIcon} alt="Next" /></button>
        </div>
      </footer>
    </div>
  );
};

export default CustomersPage;