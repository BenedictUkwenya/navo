import React, { useState, useMemo } from 'react';
import './FXPage.css';
import SetFxPricingModal from '../../compoonents/SetFxPricingModal/SetFxPricingModal';
import FxTransactionDetailsModal from '../../compoonents/FxTransactionDetailsModal/FxTransactionDetailsModal';
import { mockFxPricings, FxPricing } from '../../data/mockFxData';
import { mockFxTransactions, FxTransaction, FxTransactionStatus } from '../../data/mockFxTransactions';

// Icon Imports
import { PiCurrencyCircleDollarBold, PiPaperPlaneTiltBold } from 'react-icons/pi';
import { TfiFilter } from 'react-icons/tfi';
import { IoSearchOutline, IoEyeOutline } from 'react-icons/io5';
import { LuCalendarDays } from 'react-icons/lu';
import { FiEdit2 } from 'react-icons/fi'; // A better edit icon

type FxTab = 'pricing' | 'transaction';

const FXPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FxTab>('pricing');
  
  // State for FX Pricing Tab
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [fxPricings, setFxPricings] = useState(mockFxPricings);
  const [editingPricing, setEditingPricing] = useState<FxPricing | null>(null);

  // State for FX Transaction Tab
  const [fxTransactions, setFxTransactions] = useState(mockFxTransactions);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<FxTransaction | null>(null);
  const [activeTxStatus, setActiveTxStatus] = useState<FxTransactionStatus | 'All'>('All');

  // --- Handlers for Pricing Tab ---
  const handleOpenEditPricing = (p: FxPricing) => { setEditingPricing(p); setShowPricingModal(true); };
  const handleOpenNewPricing = () => { setEditingPricing(null); setShowPricingModal(true); };
  const handleClosePricingModal = () => { setShowPricingModal(false); setEditingPricing(null); };
  const handleSavePricing = (data: any) => { /* ... save logic ... */ handleClosePricingModal(); };

  // --- Handlers for Transaction Tab ---
  const handleViewTransactionDetails = (t: FxTransaction) => { setSelectedTransaction(t); setShowDetailsModal(true); };
  
  const filteredFxTransactions = useMemo(() => {
    return fxTransactions.filter(t => activeTxStatus === 'All' || t.status === activeTxStatus);
  }, [activeTxStatus, fxTransactions]);

  // --- RENDER LOGIC FOR TABS ---
  const renderContent = (): React.ReactNode => {
    if (activeTab === 'pricing') {
      return (
        <div className="fx-pricing-content">
          <div className="list-header">
            <h3>FX Pricing</h3>
            <button className="action-button primary" onClick={handleOpenNewPricing}>+ Add New</button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead><tr><th>Currency Pair</th><th>Base Rate</th><th>Final Rate</th><th>Time Stamp</th><th>Last Updated</th><th></th></tr></thead>
              <tbody>
                {fxPricings.map(p => (
                  <tr key={p.id}>
                    <td>{p.currencyPair}</td><td>{p.baseRate}</td><td>{p.finalRate}</td>
                    <td>{new Date(p.timestamp).toLocaleString()}</td><td>{new Date(p.lastUpdated).toLocaleString()}</td>
                    <td className="action-cell"><FiEdit2 className="action-icon" onClick={() => handleOpenEditPricing(p)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    if (activeTab === 'transaction') {
      if (fxTransactions.length === 0) {
        return (
          <div className="fx-empty-state">
            <div className="icon-wrapper"><PiPaperPlaneTiltBold /></div>
            <h3>No FX Transactions done yet</h3>
          </div>
        );
      }
      return (
        <div className="fx-transaction-list">
          <div className="filter-tabs">
            {(['All', 'Pending', 'Successful', 'Failed'] as const).map(tab => (
              <button key={tab} className={activeTxStatus === tab ? 'active' : ''} onClick={() => setActiveTxStatus(tab)}>
                {tab}
              </button>
            ))}
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead><tr><th>Name</th><th>Customer ID</th><th>Transaction ID</th><th>FX Type</th><th>Rate</th><th>Time Stamp</th><th>Amount</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {filteredFxTransactions.map(t => (
                  <tr key={t.id}>
                    <td>{t.customerName}</td><td>{t.customerId}</td><td>{t.transactionId}</td><td>{t.fxType}</td>
                    <td>{t.rate}</td><td>{t.timestamp}</td><td>{t.amount}</td>
                    <td><span className={`status-badge status-${t.status.toLowerCase()}`}>{t.status}</span></td>
                    <td className="action-cell"><IoEyeOutline className="action-icon" onClick={() => handleViewTransactionDetails(t)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fx-page">
      {/* This header is no longer needed as the title is handled by the main Layout */}
      <div className="page-content-wrapper">
        <div className="page-controls-header">
            <div className="date-filters">
                <div className="input-with-icon"><input type="text" placeholder="Dates from" /><LuCalendarDays /></div>
                <div className="input-with-icon"><input type="text" placeholder="Dates to" /><LuCalendarDays /></div>
            </div>
            <div className="filter-and-search">
                <button className="filter-btn small"><TfiFilter /></button>
                <div className="input-with-icon"><IoSearchOutline /><input type="text" placeholder="Search by Category, Transaction type, Name" /></div>
            </div>
        </div>
        <div className="fx-tabs">
            <button className={activeTab === 'pricing' ? 'active' : ''} onClick={() => setActiveTab('pricing')}>FX Pricing</button>
            <button className={activeTab === 'transaction' ? 'active' : ''} onClick={() => setActiveTab('transaction')}>FX Transaction</button>
        </div>
        <div className="fx-content">
            {renderContent()}
        </div>
      </div>
      {showPricingModal && <SetFxPricingModal onClose={handleClosePricingModal} onSave={handleSavePricing} editingPricing={editingPricing} />}
      {showDetailsModal && selectedTransaction && <FxTransactionDetailsModal onClose={() => setShowDetailsModal(false)} transaction={selectedTransaction} />}
    </div>
  );
};

export default FXPage;