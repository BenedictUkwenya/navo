import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./FXPage.css";

// Import all necessary components and services
import SetFxPricingModal from "../../compoonents/SetFxPricingModal/SetFxPricingModal";
import AddFxRateModal from "../../compoonents/AddFxRateModal/AddFxRateModal";
import { MessageType } from "../../types/exchange-rate";
import {
  getRateHistory,
  getFxTransactions,
  downloadFxTransactionsPDF,
} from "../../services/fxService";
import { FxRate, FxTransaction } from "../../types/fx";

// Icon Imports
import { FiEdit2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoEyeOutline, IoSearchOutline } from "react-icons/io5";
import {
  PiCurrencyCircleDollarBold,
  PiPaperPlaneTiltBold,
} from "react-icons/pi";
import { TfiFilter } from "react-icons/tfi";
import { LuCalendarDays } from "react-icons/lu";
import { GoDownload } from "react-icons/go";
import {
  createExchangeRate,
  getLatestExchangeRate,
  getExchangeRateChartData,
} from "../../services/exchangeRate";
import { toast, ToastContainer } from "react-toastify";

type FxTab = "pricing" | "transaction";
interface CurrencyPair {
  from: string;
  to: string;
  label: string;
  rate: number | null;
  change: number | null;
  lastUpdated: string | null;
  isActive: boolean;
}

interface RateHistory {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  buyRate: string;
  sellRate: string;
  createdAt: string;
  updatedAt: string;
  adminId: string | null;
}

// Main Page Component
const FXPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FxTab>("pricing");

  return (
    <div className="fx-page">
      <div className="page-content-wrapper">
        <div className="fx-tabs">
          <button
            className={activeTab === "pricing" ? "active" : ""}
            onClick={() => setActiveTab("pricing")}
          >
            FX Pricing
          </button>
          <button
            className={activeTab === "transaction" ? "active" : ""}
            onClick={() => setActiveTab("transaction")}
          >
            FX Transaction
          </button>
        </div>
        <div className="fx-content">
          {activeTab === "pricing" && <FxPricingTab />}
          {activeTab === "transaction" && <FxTransactionTab />}
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT for FX Pricing Tab ---
const FxPricingTab: React.FC = () => {
  const [fxPricings, setFxPricings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCurrency, setFromCurrency] = useState("NGN");
  const [toCurrency, setToCurrency] = useState("GBP");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<FxRate | null>(null);
  const [currencyPairs] = useState<CurrencyPair[]>([
    {
      from: "NGN",
      to: "GBP",
      label: "NGN → GBP",
      rate: null,
      change: null,
      lastUpdated: null,
      isActive: true,
    },
    {
      from: "NGN",
      to: "USD",
      label: "NGN → USD",
      rate: 755.5,
      change: -1.2,
      lastUpdated: null,
      isActive: false,
    },
    {
      from: "NGN",
      to: "EUR",
      label: "NGN → EUR",
      rate: 825.75,
      change: 0.8,
      lastUpdated: null,
      isActive: false,
    },
    {
      from: "USD",
      to: "GBP",
      label: "USD → GBP",
      rate: 0.79,
      change: 1.5,
      lastUpdated: null,
      isActive: false,
    },
  ]);
  const [selectedPair, setSelectedPair] = useState<CurrencyPair>(
    currencyPairs[0]
  );
  const [message, setMessage] = useState<MessageType | null>(null);
  const [allPairs, setAllPairs] = useState<CurrencyPair[]>(currencyPairs);
  const [totalRates, setTotalRates] = useState<number>(0);
  const [formData, setFormData] = useState({
    fromCurrency: "NGN",
    toCurrency: "GBP",
    buyRate: "",
    sellRate: "",
  });
  const [updateFormData, setUpdateFormData] = useState({
    id: "",
    fromCurrency: "NGN",
    toCurrency: "GBP",
    buyRate: "",
    sellRate: "",
  });
  const [history, setHistory] = useState<RateHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const showMessage = useCallback(
    (text: string, type: MessageType["type"] = "info") => {
      setMessage({ text, type });
      setTimeout(() => setMessage(null), 5000);
    },
    []
  );

  // const fetchRateForPair = useCallback(async (pair: CurrencyPair) => {
  //   if (!pair.isActive) {
  //     return {
  //       ...pair,
  //       lastUpdated: new Date().toISOString(),
  //     };
  //   }

  //   try {
  //     const response = await getLatestExchangeRate();
  //     if (response && response.length > 0) {
  //       const latestRate = response[0];
  //       const buyRate = Number(latestRate.buyRate);
  //       const sellRate = Number(latestRate.sellRate);
  //       const averageRate = (buyRate + sellRate) / 2;

  //       const previousRate = response[1]
  //         ? Number(response[1].buyRate)
  //         : buyRate;
  //       const change = ((buyRate - previousRate) / previousRate) * 100;

  //       return {
  //         ...pair,
  //         rate: averageRate,
  //         change: change,
  //         lastUpdated: latestRate.updatedAt,
  //       };
  //     }
  //     return pair;
  //   } catch (error) {
  //     console.error(`Error fetching rate for ${pair.label}:`, error);
  //     return pair;
  //   }
  // }, []);

  const fetchRateForPair = useCallback(async (pair: CurrencyPair) => {
    if (!pair.isActive) {
      return {
        ...pair,
        lastUpdated: new Date().toISOString(),
      };
    }

    try {
      const response = await getLatestExchangeRate();
      if (response && response.length > 0) {
        const latestRate = response[0];
        const buyRate = Number(latestRate.buyRate);
        const sellRate = Number(latestRate.sellRate);
        // Show buy rate for display instead of average
        const displayRate = buyRate; // Changed from (buyRate + sellRate) / 2

        const previousRate = response[1]
          ? Number(response[1].buyRate)
          : buyRate;
        const change = ((buyRate - previousRate) / previousRate) * 100;

        return {
          ...pair,
          rate: displayRate,
          change: change,
          lastUpdated: latestRate.updatedAt,
        };
      }
      return pair;
    } catch (error) {
      console.error(`Error fetching rate for ${pair.label}:`, error);
      return pair;
    }
  }, []);

  const fetchAllRates = useCallback(async () => {
    try {
      const updatedPairs = await Promise.all(
        currencyPairs.map((pair) => fetchRateForPair(pair))
      );
      setAllPairs(updatedPairs);

      const updatedSelectedPair = updatedPairs.find(
        (p) => p.from === selectedPair.from && p.to === selectedPair.to
      );
      if (updatedSelectedPair) {
        setSelectedPair(updatedSelectedPair);
      }
    } catch (error) {
      console.error("Error fetching all rates:", error);
      toast.error("Failed to fetch rates");
    }
  }, [currencyPairs, selectedPair, fetchRateForPair]);

  useEffect(() => {
    fetchAllRates();
  }, []);

  const handlePairSelection = (pair: CurrencyPair) => {
    if (!pair.isActive) {
      showMessage(`${pair.label} is not available yet. Coming soon!`, "info");
      return;
    }

    setSelectedPair(pair);
    setFormData((prev) => ({
      ...prev,
      fromCurrency: pair.from,
      toCurrency: pair.to,
    }));
    setUpdateFormData((prev) => ({
      ...prev,
      fromCurrency: pair.from,
      toCurrency: pair.to,
    }));
  };

  const fetchRateHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getLatestExchangeRate(); // Change this line to use getLatestExchangeRate
      if (response && Array.isArray(response)) {
        setFxPricings(response);
        setHistory(response);
        setTotalRates(response.length);
      }
    } catch (err) {
      setError(`No rates found for ${fromCurrency}/${toCurrency}.`);
      setFxPricings([]);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [fromCurrency, toCurrency]);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchAllRates(), fetchRateHistory()]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load some data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [fetchRateHistory]);

  const handleOpenEditModal = (rate: FxRate) => {
    setEditingRate(rate);
    setIsEditModalOpen(true);
  };
  const handleCloseModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingRate(null);
  };
  const handleSaveSuccess = (newOrUpdatedRate?: FxRate) => {
    handleCloseModals();
    if (
      newOrUpdatedRate &&
      !fxPricings.some((p) => p.id === newOrUpdatedRate.id)
    ) {
      setFxPricings((current) => [newOrUpdatedRate, ...current]);
    } else {
      fetchRateHistory();
    }
  };
  const calculateRateChange = (rates: RateHistory[]) => {
    const validRates = rates.filter((rate) => Number(rate.buyRate) > 0);
    if (validRates.length < 2) return 0;

    const newest = Number(validRates[0].buyRate);
    const previous = Number(validRates[1].buyRate);
    return ((newest - previous) / previous) * 100;
  };

  const calculateAverageRate = (rates: RateHistory[]) => {
    const validRates = rates.filter(
      (rate) => Number(rate.buyRate) > 0 && Number(rate.sellRate) > 0
    );
    if (validRates.length === 0) return 0;

    const averages = validRates.map(
      (rate) => (Number(rate.buyRate) + Number(rate.sellRate)) / 2
    );
    return averages.reduce((a, b) => a + b, 0) / averages.length;
  };

  if (loading) return <div className="page-loading">Loading...</div>;
  if (error && fxPricings.length === 0)
    return <div className="page-error">{error}</div>;

  return (
    <div className="fx-pricing-list">
      <div className="pair-selector-section">
        <h3 className="selector-title">Select Currency Pair</h3>
        <div className="pair-selector">
          {allPairs.map((pair) => (
            <button
              key={`${pair.from}-${pair.to}`}
              className={`pair-btn ${
                selectedPair.from === pair.from && selectedPair.to === pair.to
                  ? "active"
                  : ""
              } ${!pair.isActive ? "inactive" : ""}`}
              onClick={() => handlePairSelection(pair)}
              disabled={!pair.isActive}
            >
              <div className="pair-label">
                {pair.label}
                {!pair.isActive && (
                  <span className="coming-soon">Coming Soon</span>
                )}
              </div>
              <div className="pair-rate">
                {pair.rate
                  ? pair.from === "USD"
                    ? `$${pair.rate}`
                    : `₦${pair.rate.toLocaleString()}`
                  : "No data"}
              </div>
            </button>
          ))}
        </div>
      </div>

      {message && (
        <div className={`message message-${message.type}`}>{message.text}</div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon orange-icon">📈</div>
          <div className="stat-content">
            <div className="stat-label">Average Rate (All Time)</div>
            {history.length > 0 ? (
              <>
                <div
                  className={`stat-change ${
                    calculateRateChange(history) >= 0 ? "positive" : "negative"
                  }`}
                >
                  {calculateRateChange(history).toFixed(2)}%
                </div>
                <div className="stat-value orange-value">
                  ₦{calculateAverageRate(history).toLocaleString()}
                </div>
              </>
            ) : (
              <div className="stat-value orange-value">Loading...</div>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue-icon">✅</div>
          <div className="stat-content">
            <div className="stat-label">Active Pairs</div>
            <div className="stat-change positive">100%</div>
            <div className="stat-value blue-value">1</div>
            <div className="stat-subtitle">NGN → GBP</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <div className="currency-converter">
              <span className="currency-from">{selectedPair.from}</span>
              <span className="currency-to">{selectedPair.to}</span>
            </div>
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Entries</div>
            <div className="stat-value orange-value">{history.length}</div>
            <div className="stat-subtitle">
              Last updated:{" "}
              {history[0]?.createdAt
                ? new Date(history[0].createdAt).toLocaleString()
                : "N/A"}
            </div>
          </div>
        </div>
      </div>

      <div className="list-header">
        <h3>FX Pricing History</h3>
        <div className="fx-filters">
          <div className="form-group">
            <label>From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              <option>NGN</option>
              <option>GBP</option>
              <option>USD</option>
            </select>
          </div>
          <div className="form-group">
            <label>To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              <option>GBP</option>
              <option>NGN</option>
              <option>USD</option>
            </select>
          </div>
          <button
            className="action-button primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            + Add New Rate
          </button>
        </div>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Currency Pair</th>
              <th>Buy Rate</th>
              <th>Sell Rate</th>
              <th>Last Updated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {fxPricings.map((p) => (
              <tr key={p.id}>
                <td>{`${p.fromCurrency} / ${p.toCurrency}`}</td>
                <td>{p.buyRate}</td>
                <td>{p.sellRate}</td>
                <td>{new Date(p.updatedAt).toLocaleString()}</td>
                <td className="action-cell">
                  <FiEdit2
                    className="action-icon"
                    onClick={() => handleOpenEditModal(p)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && fxPricings.length === 0 && (
          <div className="no-data-message">
            {error || "No rates found for this pair."}
          </div>
        )}
      </div>
      {isEditModalOpen && editingRate && (
        <SetFxPricingModal
          onClose={handleCloseModals}
          onSuccess={handleSaveSuccess}
          editingRate={editingRate}
        />
      )}
      {isAddModalOpen && (
        <AddFxRateModal
          onClose={handleCloseModals}
          onSuccess={handleSaveSuccess}
        />
      )}
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
      } catch (err) {
        setError("Failed to load FX transactions.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleExportCSV = () => {
    const headers = [
      "Name",
      "Customer ID",
      "Transaction Ref",
      "FX Type",
      "Rate",
      "Amount",
      "Status",
      "Recipient Bank",
      "Account Name",
      "Account Number",
    ];
    const rows = transactions.map((t) =>
      [
        `"${t.user.firstName || ""} ${t.user.lastName || ""}"`,
        t.userId,
        t.transaction.transactionReference,
        `${t.fromCurrency} -> ${t.toCurrency}`,
        t.currentRate,
        `${t.transaction.currency} ${t.amount}`,
        t.transaction.paymentStatus,
        t.recipientBankName || "N/A",
        t.recipientAccountName || "N/A",
        t.recipientAccountNumber || "N/A",
      ].join(",")
    );
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
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
      const a = document.createElement("a");
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

  if (loading)
    return <div className="page-loading">Loading transactions...</div>;
  if (error) return <div className="page-error">{error}</div>;

  return (
    <div className="fx-transaction-list">
      <header className="transaction-header">
        <div className="date-filters">
          <div className="input-with-icon">
            <input type="date" />{" "}
          </div>
          <div className="input-with-icon">
            <input type="date" />{" "}
          </div>
        </div>
        <div className="right-controls">
          <div className="export-buttons">
            <button className="export-btn pdf" onClick={handleExportPDF}>
              PDF <GoDownload />
            </button>
            <button className="export-btn csv" onClick={handleExportCSV}>
              CSV <GoDownload />
            </button>
          </div>
          <div className="transaction-search-bar">
            <IoSearchOutline />
            <input type="text" placeholder="Search..." />
          </div>
        </div>
      </header>

      {transactions.length === 0 ? (
        <div className="fx-empty-state">
          <div className="icon-wrapper">
            <PiPaperPlaneTiltBold />
          </div>
          <h3>No FX Transactions have been made yet</h3>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Customer ID</th>
                  <th>Transaction ID</th>
                  <th>FX Type</th>
                  <th>Rate</th>
                  <th>Time Stamp</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => {
                  const fullName =
                    `${t.user?.firstName || ""} ${
                      t.user?.lastName || ""
                    }`.trim() || t.user.email;
                  const amount = `${t.transaction.currency} ${parseFloat(
                    t.transaction.amountPaid
                  ).toLocaleString()}`;
                  return (
                    <tr key={t.id}>
                      <td>{fullName}</td>
                      <td>{t.userId}</td>
                      <td>{t.transaction.transactionReference}</td>
                      <td>{`${t.fromCurrency} → ${t.toCurrency}`}</td>
                      <td>{t.currentRate}</td>
                      <td>{new Date(t.createdAt).toLocaleString()}</td>
                      <td>{amount}</td>
                      <td>
                        <span
                          className={`status-badge status-${t.transaction.paymentStatus.toLowerCase()}`}
                        >
                          {t.transaction.paymentStatus}
                        </span>
                      </td>
                      <td className="action-cell">
                        <IoEyeOutline className="action-icon" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <footer className="page-footer">
            <div className="pagination-info">
              Showing 1-{transactions.length} of {transactions.length}
            </div>
            <div className="pagination-controls">
              <button disabled>
                <FiChevronLeft />
              </button>
              <button disabled>
                <FiChevronRight />
              </button>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default FXPage;
