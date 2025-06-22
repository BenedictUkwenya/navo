// src/pages/Dashboard/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { getDashboardData } from '../../services/dashboardService'
import { DashboardMetrics, DashboardGrowth, RecentTransaction } from '../../types/dashboard';

// --- ICON IMPORTS ---
import totalShipmentsIcon from '../../assets/images/total-shipment.png';
import totalCustomersIcon from '../../assets/images/customers.png';
import completedShipmentsIcon from '../../assets/images/completedShipment.png';
import transactionCardIcon from '../../assets/images/transactionicon.png';
import shop4meCardIcon from '../../assets/images/shop4me.png';
import statusCompletedIcon from '../../assets/images/completedicon.png';
import statusPendingIcon from '../../assets/images/pendingicon.png';
import statusFailedIcon from '../../assets/images/failedicon.png';

type Currency = 'ngn' | 'gbp';

const Dashboard: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [data, setData] = useState<{ metrics: DashboardMetrics; growth: DashboardGrowth } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCurrency, setActiveCurrency] = useState<Currency>('ngn');
  const [activeTxFilter, setActiveTxFilter] = useState('all');

  // --- DATA FETCHING EFFECT ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashboardData = await getDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // The empty array [] ensures this runs only once on component mount

  // --- HELPER FUNCTIONS ---
  const formatCurrency = (amount: number, currency: 'NGN' | 'GBP') => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESSFUL': return statusCompletedIcon;
      case 'PENDING': return statusPendingIcon;
      case 'FAILED': return statusFailedIcon;
      default: return statusPendingIcon;
    }
  };

  // --- RENDER LOGIC ---
  if (loading) {
    return <div className="dashboard-loading">Loading Dashboard...</div>;
  }
  if (error || !data) {
    return <div className="dashboard-error">{error || 'An unknown error occurred.'}</div>;
  }

  const filteredTransactions = data.metrics.recentTransactions.filter(tx => {
    if (activeTxFilter === 'all') return true;
    return tx.status.toLowerCase() === activeTxFilter;
  });

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome"><h2>Welcome, Oladapo</h2></div>
      <div className="stats-grid">
        <div className="stat-card card-blue">
          <div className="card-top-row"><p className="card-title">Total Shipments</p><div className="card-icon-bg"><img src={totalShipmentsIcon} alt="" /></div></div>
          <div className="card-bottom-row"><h3 className="card-value">{data.metrics.totalShipments}</h3><span className="percentage-badge">+{data.growth.shipmentsGrowth}%</span></div>
        </div>
        <div className="stat-card card-orange">
          <div className="card-top-row"><p className="card-title">Total Customers</p><div className="card-icon-bg"><img src={totalCustomersIcon} alt="" /></div></div>
          <div className="card-bottom-row"><h3 className="card-value">{data.metrics.totalCustomers}</h3><span className="percentage-badge">+{data.growth.customersGrowth}%</span></div>
        </div>
        <div className="stat-card card-blue">
          <div className="card-top-row"><p className="card-title">Completed Shipments</p><div className="card-icon-bg"><img src={completedShipmentsIcon} alt="" /></div></div>
          <div className="card-bottom-row"><h3 className="card-value">{data.metrics.completedShipments}</h3><span className="percentage-badge">+{data.growth.completedShipmentsGrowth}%</span></div>
        </div>
        <div className="stat-card card-orange transaction-card">
           <div className="transaction-card-header">
             <div className="card-icon-bg"><img src={transactionCardIcon} alt="transaction" /></div>
             <div className="currency-toggle">
               <button className={activeCurrency === 'ngn' ? 'active' : ''} onClick={() => setActiveCurrency('ngn')}>NGN</button>
               <button className={activeCurrency === 'gbp' ? 'active' : ''} onClick={() => setActiveCurrency('gbp')}>GBP</button>
             </div>
           </div>
           <p className="card-title">Total Transaction</p>
           <h3 className="card-value">{activeCurrency === 'ngn' ? formatCurrency(data.metrics.totalTransactionsNGN, 'NGN') : formatCurrency(data.metrics.totalTransactionsGBP, 'GBP')}</h3>
        </div>
      </div>

      <div className="main-content-grid">
        <div className="recent-transactions-card">
          <div className="card-header"><h4>Recent Shipment Transaction</h4><a href="#" className="see-all-link">See all</a></div>
          <div className="transactions-tabs">
            <button className={activeTxFilter === 'all' ? 'active' : ''} onClick={() => setActiveTxFilter('all')}>All</button>
            <button className={activeTxFilter === 'pending' ? 'active' : ''} onClick={() => setActiveTxFilter('pending')}>Pending</button>
            <button className={activeTxFilter === 'failed' ? 'active' : ''} onClick={() => setActiveTxFilter('failed')}>Failed</button>
            <button className={activeTxFilter === 'successful' ? 'active' : ''} onClick={() => setActiveTxFilter('successful')}>Completed</button>
          </div>
          <ul className="transactions-list">
            {filteredTransactions.map((tx: RecentTransaction) => (
              <li key={tx.id}>
                <div className={`tx-status-icon ${tx.status.toLowerCase()}`}><img src={getStatusIcon(tx.status)} alt={tx.status} /></div>
                <div className="tx-details">
                  <p className="tx-description">{`Payment from ${tx.user.first_name} ${tx.user.last_name}`}</p>
                  <p className="tx-id">{tx.id}</p>
                </div>
                <div className="tx-info">
                   <p className="tx-date">{new Date(tx.createdAt).toLocaleDateString()}</p>
                   <p className="tx-time">{new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="tx-amount">{formatCurrency(tx.amount, tx.currency)}</div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="shop4me-card">
          <div className="card-icon-bg"><img src={shop4meCardIcon} alt="shop for me" /></div>
          <p className="card-title">Total Shop4me Request</p>
          <h3 className="card-value">{data.metrics.totalShopForMeRequests}</h3>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;