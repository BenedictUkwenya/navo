import React, { useState, useEffect, useMemo } from 'react';
import './FXPage.css';

// Import all necessary components and services
import SetFxPricingModal from '../../compoonents/SetFxPricingModal/SetFxPricingModal';
import AddFxRateModal from '../../compoonents/AddFxRateModal/AddFxRateModal';
import { getRateHistory, getFxTransactions, downloadFxTransactionsPDF } from '../../services/fxService';
import { FxRate, FxTransaction } from '../../types/fx';

// Icon Imports
import { FiEdit2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { IoEyeOutline, IoSearchOutline } from 'react-icons/io5';
import { PiCurrencyCircleDollarBold, PiPaperPlaneTiltBold } from 'react-icons/pi';
import { TfiFilter } from 'react-icons/tfi';
import { LuCalendarDays } from 'react-icons/lu';
import { GoDownload } from "react-icons/go";

type FxTab = 'pricing' | 'transaction';

// Main Page Component
const FXPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FxTab>('pricing');

  return (
    <div className="fx-page">
      <div className="page-content-wrapper">
        <div className="fx-tabs">
          <button className={activeTab === 'pricing' ? 'active' : ''} onClick={() => setActiveTab('pricing')}>FX Pricing</button>
          <button className={activeTab === 'transaction' ? 'active' : ''} onClick={() => setActiveTab('transaction')}>FX Transaction</button>
        </div>
        <div className="fx-content">
          {activeTab === 'pricing' && <FxPricingTab />}
          {activeTab === 'transaction' && <FxTransactionTab />}
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT for FX Pricing Tab ---
const FxPricingTab: React.FC = () => {
  const [fxPricings, setFxPricings] = useState<FxRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCurrency, setFromCurrency] = useState('NGN');
  const [toCurrency, setToCurrency] = useState('GBP');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<FxRate | null>(null);

  const fetchRateHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRateHistory(fromCurrency, toCurrency);
      setFxPricings(response.results || []);
    } catch (err) {
      setError(`No rates found for ${fromCurrency}/${toCurrency}.`);
      setFxPricings([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchRateHistory(); }, [fromCurrency, toCurrency]);

  const handleOpenEditModal = (rate: FxRate) => { setEditingRate(rate); setIsEditModalOpen(true); };
  const handleCloseModals = () => { setIsAddModalOpen(false); setIsEditModalOpen(false); setEditingRate(null); };
  const handleSaveSuccess = (newOrUpdatedRate?: FxRate) => {
    handleCloseModals();
    if (newOrUpdatedRate && !fxPricings.some(p => p.id === newOrUpdatedRate.id)) {
      setFxPricings(current => [newOrUpdatedRate, ...current]);
    } else {
      fetchRateHistory();
    }
  };

  if (loading) return <div className="page-loading">Loading...</div>;
  if (error && fxPricings.length === 0) return <div className="page-error">{error}</div>;

  return (
    <div className="fx-pricing-list">
      <div className="list-header">
        <h3>FX Pricing History</h3>
        <div className="fx-filters">
          <div className="form-group"><label>From</label><select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}><option>NGN</option><option>GBP</option><option>USD</option></select></div>
          <div className="form-group"><label>To</label><select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}><option>GBP</option><option>NGN</option><option>USD</option></select></div>
          <button className="action-button primary" onClick={() => setIsAddModalOpen(true)}>+ Add New Rate</button>
        </div>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead><tr><th>Currency Pair</th><th>Buy Rate</th><th>Sell Rate</th><th>Last Updated</th><th>Action</th></tr></thead>
          <tbody>
            {fxPricings.map(p => (
              <tr key={p.id}>
                <td>{`${p.fromCurrency} / ${p.toCurrency}`}</td><td>{p.buyRate}</td><td>{p.sellRate}</td>
                <td>{new Date(p.updatedAt).toLocaleString()}</td>
                <td className="action-cell"><FiEdit2 className="action-icon" onClick={() => handleOpenEditModal(p)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && fxPricings.length === 0 && <div className="no-data-message">{error || 'No rates found for this pair.'}</div>}
      </div>
      {isEditModalOpen && editingRate && <SetFxPricingModal onClose={handleCloseModals} onSuccess={handleSaveSuccess} editingRate={editingRate} />}
      {isAddModalOpen && <AddFxRateModal onClose={handleCloseModals} onSuccess={handleSaveSuccess} />}
    </div>
  );
};

// --- SUB-COMPONENT for FX Transactions Tab ---
const FxTransactionTab: React.FC = () => {
    const [transactions, setTransactions] = useState<FxTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getFxTransactions();
                setTransactions(response.results || []);
            } catch (err) { setError("Failed to load FX transactions."); }
            finally { setLoading(false); }
        };
        fetchTransactions();
    }, []);

    const handleExportCSV = () => {
      const headers = ["Name", "Customer ID", "Transaction Ref", "FX Type", "Rate", "Amount", "Status", "Recipient Bank", "Account Name", "Account Number"];
      const rows = transactions.map(t => [
          `"${t.user.firstName || ''} ${t.user.lastName || ''}"`, t.userId, t.transaction.transactionReference,
          `${t.fromCurrency} -> ${t.toCurrency}`, t.currentRate, `${t.transaction.currency} ${t.amount}`,
          t.transaction.paymentStatus, t.recipientBankName || 'N/A',
          t.recipientAccountName || 'N/A', t.recipientAccountNumber || 'N/A'
      ].join(','));
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", "fx-transactions.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleExportPDF = async () => {
      alert("Generating PDF... this may take a moment.");
      try {
          // Assuming the PDF endpoint doesn't need a specific user ID for a general report
          const blob = await downloadFxTransactionsPDF(); 
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = "fx_transactions_report.pdf";
          document.body.appendChild(a);
          a.click();
          a.remove();
      } catch (err) {
          alert("Failed to download PDF report.");
          console.error(err);
      }
  };

    if (loading) return <div className="page-loading">Loading transactions...</div>;
    if (error) return <div className="page-error">{error}</div>;

    return (
        <div className="fx-transaction-list">
            <header className="transaction-header">
                <div className="date-filters">
                    <div className="input-with-icon"><input type="date" /><LuCalendarDays /></div>
                    <div className="input-with-icon"><input type="date" /><LuCalendarDays /></div>
                </div>
                <div className="right-controls">
                    <div className="export-buttons">
                        <button className="export-btn pdf" onClick={handleExportPDF}>PDF <GoDownload /></button>
                        <button className="export-btn csv" onClick={handleExportCSV}>CSV <GoDownload /></button>
                    </div>
                    <div className="transaction-search-bar"><IoSearchOutline /><input type="text" placeholder="Search..." /></div>
                </div>
            </header>

            {transactions.length === 0 ? (
                <div className="fx-empty-state"><div className="icon-wrapper"><PiPaperPlaneTiltBold /></div><h3>No FX Transactions have been made yet</h3></div>
            ) : (
                <>
                    <div className="table-container">
                        <table className="data-table">
                            <thead><tr><th>Name</th><th>Customer ID</th><th>Transaction ID</th><th>FX Type</th><th>Rate</th><th>Time Stamp</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
                            <tbody>
                                {transactions.map(t => {
                                    const fullName = `${t.user?.firstName || ''} ${t.user?.lastName || ''}`.trim() || t.user.email;
                                    const amount = `${t.transaction.currency} ${parseFloat(t.transaction.amountPaid).toLocaleString()}`;
                                    return (
                                        <tr key={t.id}>
                                            <td>{fullName}</td><td>{t.userId}</td><td>{t.transaction.transactionReference}</td>
                                            <td>{`${t.fromCurrency} → ${t.toCurrency}`}</td><td>{t.currentRate}</td>
                                            <td>{new Date(t.createdAt).toLocaleString()}</td><td>{amount}</td>
                                            <td><span className={`status-badge status-${t.transaction.paymentStatus.toLowerCase()}`}>{t.transaction.paymentStatus}</span></td>
                                            <td className="action-cell"><IoEyeOutline className="action-icon" /></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <footer className="page-footer">
                        <div className="pagination-info">Showing 1-{transactions.length} of {transactions.length}</div>
                        <div className="pagination-controls"><button disabled><FiChevronLeft /></button><button disabled><FiChevronRight /></button></div>
                    </footer>
                </>
            )}
        </div>
    );
};

export default FXPage;