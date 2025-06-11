// src/pages/Dashboard/Dashboard.tsx

import React, { useState } from 'react';
import './Dashboard.css';
import { mockStatCards, mockRecentTransactions, mockUserData } from '../../data/mockDashboardData';

// --- ICON IMPORTS ---
// This is the correct way to load images in React
import totalShipmentsIcon from '../../assets/images/total-shipment.png';
import totalCustomersIcon from '../../assets/images/customers.png';
import completedShipmentsIcon from '../../assets/images/completedShipment.png';
import transactionCardIcon from '../../assets/images/transactionicon.png';
import shop4meCardIcon from '../../assets/images/shop4me.png';
import statusPendingIcon from '../../assets/images/pendingicon.png';
import statusCompletedIcon from '../../assets/images/completedicon.png';
import statusFailedIcon from '../../assets/images/failedicon.png';

// Create a map to link card IDs to their imported icons
const statCardIcons: { [key: string]: string } = {
  'total-shipments': totalShipmentsIcon,
  'total-customers': totalCustomersIcon,
  'completed-shipments': completedShipmentsIcon,
};

const statusIcons = {
  pending: statusPendingIcon,
  completed: statusCompletedIcon,
  failed: statusFailedIcon,
};

type TransactionStatusFilter = 'all' | 'pending' | 'failed' | 'completed';

const Dashboard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<TransactionStatusFilter>('all');

  const filteredTransactions = activeFilter === 'all'
    ? mockRecentTransactions
    : mockRecentTransactions.filter(tx => tx.status === activeFilter);

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <h2>Welcome, {mockUserData.name}</h2>
      </div>

      <div className="stats-grid">
        {mockStatCards.map(card => (
          <div key={card.id} className={`stat-card card-${card.color}`}>
            <div className="card-icon-bg">
              <img src={statCardIcons[card.id]} alt="" />
            </div>
            <p className="card-title">{card.title}</p>
            <div className="card-value-row">
              <h3 className="card-value">{card.value}</h3>
              <span className="percentage-badge">{card.percentageChange}</span>
            </div>
          </div>
        ))}

        <div className="stat-card card-orange transaction-card">
           <div className="transaction-card-header">
             <div className="card-icon-bg">
               <img src={transactionCardIcon} alt="transaction icon" />
             </div>
             <div className="currency-toggle">
               <button className="active">NGN</button>
               <button>GBP</button>
             </div>
           </div>
           <p className="card-title">Total Transaction</p>
           <h3 className="card-value">₦2,050,000.00</h3>
        </div>
      </div>

      <div className="main-content-grid">
        <div className="recent-transactions-card">
          <div className="card-header">
            <h4>Recent Shipment Transaction</h4>
            <a href="#" className="see-all-link">See all</a>
          </div>
          <div className="transactions-tabs">
            <button className={activeFilter === 'all' ? 'active' : ''} onClick={() => setActiveFilter('all')}>All</button>
            <button className={activeFilter === 'pending' ? 'active' : ''} onClick={() => setActiveFilter('pending')}>Pending</button>
            <button className={activeFilter === 'failed' ? 'active' : ''} onClick={() => setActiveFilter('failed')}>Failed</button>
            <button className={activeFilter === 'completed' ? 'active' : ''} onClick={() => setActiveFilter('completed')}>Completed</button>
          </div>
          <ul className="transactions-list">
            {filteredTransactions.map(tx => (
              <li key={tx.id}>
                <div className={`tx-status-icon ${tx.status}`}>
                  <img src={statusIcons[tx.status]} alt={tx.status} />
                </div>
                <div className="tx-details">
                  <p className="tx-description">{tx.description}</p>
                  <p className="tx-id">{tx.trackingId}</p>
                </div>
                <div className="tx-info">
                   <p className="tx-date">{tx.date}</p>
                   <p className="tx-time">{tx.time}</p>
                </div>
                <div className="tx-amount">{tx.amount}</div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="shop4me-card">
           <div className="card-icon-bg">
             <img src={shop4meCardIcon} alt="shop for me icon" />
           </div>
           <p className="card-title">Total Shop4me Request</p>
           <h3 className="card-value">50</h3>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;