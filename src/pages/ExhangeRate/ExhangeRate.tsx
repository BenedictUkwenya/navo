"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";

import "./ExhangeRate.css";
import { MessageType } from "../../types/exchange-rate";
import ExchangeRateChart from "../../compoonents/ExchangeRateChart/ExchangeRateChart";
import { ExchangeRateAPI } from "../../services/Exchnage";
import {
  createExchangeRate,
  getLatestExchangeRate,
  getExchangeRateChartData,
} from "../../services/exchangeRate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const ExhangeRate: React.FC = () => {
  // Available currency pairs - only NGN to GBP is active
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

  // State management - fixed to NGN → GBP
  const [selectedPair, setSelectedPair] = useState<CurrencyPair>(
    currencyPairs[0]
  );
  const [allPairs, setAllPairs] = useState<CurrencyPair[]>(currencyPairs);
  const [totalRates, setTotalRates] = useState<number>(0);
  const [activePairs, setActivePairs] = useState<number>(1);
  const [chartData, setChartData] = useState<any>(null);
  const [message, setMessage] = useState<MessageType | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [history, setHistory] = useState<RateHistory[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    fromCurrency: "NGN",
    toCurrency: "GBP",
    buyRate: "",
    sellRate: "",
  });

  // Update form state
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    id: "",
    fromCurrency: "NGN",
    toCurrency: "GBP",
    buyRate: "",
    sellRate: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Show message function
  const showMessage = useCallback(
    (text: string, type: MessageType["type"] = "info") => {
      setMessage({ text, type });
      setTimeout(() => setMessage(null), 5000);
    },
    []
  );

  // Fetch rate for specific pair - only works for active pairs
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
        const latestRate = response[0]; // Get the most recent rate
        const buyRate = Number(latestRate.buyRate);
        const sellRate = Number(latestRate.sellRate);
        const averageRate = (buyRate + sellRate) / 2;

        // Calculate rate change percentage (using buy rate)
        const previousRate = response[1]
          ? Number(response[1].buyRate)
          : buyRate;
        const change = ((buyRate - previousRate) / previousRate) * 100;

        return {
          ...pair,
          rate: averageRate,
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

  // Fetch all currency pairs
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

      const activePairsCount = updatedPairs.filter(
        (p) => p.rate !== null
      ).length;
      setActivePairs(activePairsCount);
    } catch (error) {
      console.error("Error fetching all rates:", error);
    }
  }, [currencyPairs, selectedPair, fetchRateForPair]);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Fetch rate history
  const fetchRateHistory = useCallback(
    async (retries = 3, backoff = 1000): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await getLatestExchangeRate();
        if (response && Array.isArray(response)) {
          setHistory(response);
          setTotalRates(response.length);
        }
      } catch (error: any) {
        console.error("Error fetching rate history:", error);

        if (error.message?.includes("Too many requests") && retries > 0) {
          toast.info("Rate limit reached, retrying in a moment...");
          await delay(backoff);
          return fetchRateHistory(retries - 1, backoff * 2);
        }

        toast.error("Failed to fetch rate history");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Fetch chart data
  const fetchChartData = useCallback(
    async (days = 30) => {
      try {
        const response = await getExchangeRateChartData({
          fromCurrency: selectedPair.from,
          toCurrency: selectedPair.to,
          days,
        });
        console.log("this is response data ", response);

        if (response && response.data) {
          setChartData({
            period: `${days} days`,
            data: response.data,
            summary: response.data.summary,
          });
        } else {
          toast.error("Failed to load chart data");
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
        toast.error("Failed to load chart data");
      }
    },
    [selectedPair]
  );

  // Add this function after fetchChartData
  const handlePeriodChange = useCallback(
    (days: number) => {
      fetchChartData(days);
    },
    [fetchChartData]
  );

  // useEffect(() => {
  //   fetchChartData(30); // Default to 30 days
  // }, [fetchChartData]);

  // Handle currency pair selection - only allow active pairs
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

  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle update form input change
  const handleUpdateInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleCreateRate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.buyRate || !formData.sellRate) {
      toast.error("Please enter both buy and sell rates", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    try {
      setIsCreating(true);
      const rateData = {
        fromCurrency: formData.fromCurrency,
        toCurrency: formData.toCurrency,
        buyRate: Number(formData.buyRate),
        sellRate: Number(formData.sellRate),
      };

      await createExchangeRate(rateData);

      toast.success("Exchange rate created successfully! 🎉", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      setFormData({
        fromCurrency: selectedPair.from,
        toCurrency: selectedPair.to,
        buyRate: "",
        sellRate: "",
      });
      setShowCreateForm(false);

      // Refresh data
      fetchAllRates();
      fetchRateHistory();
      fetchChartData();
    } catch (error: any) {
      toast.error(error.message || "Failed to create exchange rate 😕", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Handle update rate
  const handleUpdateRate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!updateFormData.buyRate || !updateFormData.sellRate) {
      toast.error("Please enter both buy and sell rates");
      return;
    }

    try {
      setIsUpdating(true);
      const rateData = {
        id: updateFormData.id, // Include the id in the update
        fromCurrency: updateFormData.fromCurrency,
        toCurrency: updateFormData.toCurrency,
        buyRate: Number(updateFormData.buyRate),
        sellRate: Number(updateFormData.sellRate),
      };

      await createExchangeRate(rateData);
      toast.success("Exchange rate updated successfully!");

      // Reset form and refresh data
      setUpdateFormData({
        id: "",
        fromCurrency: "NGN",
        toCurrency: "GBP",
        buyRate: "",
        sellRate: "",
        // notes: "",
      });
      setShowUpdateForm(false);

      // Refresh data
      fetchAllRates();
      fetchRateHistory();
      fetchChartData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update exchange rate");
    } finally {
      setIsUpdating(false);
    }
  };

  // Fetch current rate for update form
  const fetchCurrentRateForUpdate = async () => {
    try {
      const response = await getLatestExchangeRate();
      if (response && response.length > 0) {
        const currentRate = response[0]; // Get the most recent rate
        setUpdateFormData({
          id: currentRate.id,
          fromCurrency: currentRate.fromCurrency,
          toCurrency: currentRate.toCurrency,
          buyRate: currentRate.buyRate,
          sellRate: currentRate.sellRate,
          // notes: `Previous rates - Buy: ${currentRate.buyRate}, Sell: ${currentRate.sellRate}`,
        });
        toast.success("Current rate loaded successfully");
      } else {
        toast.warning("No current rate found");
      }
    } catch (error) {
      toast.error("Failed to fetch current rate");
      console.error("Error fetching current rate:", error);
    }
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

  const calculateRateChange = (rates: RateHistory[]) => {
    const validRates = rates.filter((rate) => Number(rate.buyRate) > 0);
    if (validRates.length < 2) return 0;

    const newest = Number(validRates[0].buyRate);
    const previous = Number(validRates[1].buyRate);
    return ((newest - previous) / previous) * 100;
  };

  // Initialize data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchAllRates(),
          fetchRateHistory(),
          fetchChartData(30), // Default to 30 days
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load some data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [fetchRateHistory]);

  // useEffect(() => {
  //   fetchChartData(30); // Default to 30 days
  // }, []);

  return (
    <div className="exchange-rate-page">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {/* Currency Pair Selector */}
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

      {/* Message */}
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

      {/* Exchange Rate Chart */}
      {chartData && (
        <div className="chart-section">
          <ExchangeRateChart
            data={chartData.data}
            period={chartData.period}
            summary={chartData.summary}
            onPeriodChange={handlePeriodChange}
          />
        </div>
      )}

      {/* Create Rate Section */}
      <div className="create-section">
        <div className="section-header">
          <h3 className="section-title">Create New Rate</h3>
          <button
            className="create-btn"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? "Cancel" : "+ Create Rate"}
          </button>
        </div>

        {showCreateForm && (
          <div className="create-form-card">
            <form onSubmit={handleCreateRate} className="create-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">From Currency</label>
                  <select
                    name="fromCurrency"
                    value={formData.fromCurrency}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="NGN">Nigerian Naira (NGN)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">To Currency</label>
                  <select
                    name="toCurrency"
                    value={formData.toCurrency}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="GBP">British Pound (GBP)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="NGN">Nigerian Naira (NGN)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Buy Rate</label>
                  <input
                    type="number"
                    name="buyRate"
                    value={formData.buyRate}
                    onChange={handleInputChange}
                    placeholder="1250.75"
                    step="0.01"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Sell Rate</label>
                  <input
                    type="number"
                    name="sellRate"
                    value={formData.sellRate}
                    onChange={handleInputChange}
                    placeholder="1260.50"
                    step="0.01"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isCreating}
                >
                  {isCreating ? "Creating..." : "Create Rate"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Update Rate Section */}
      <div className="create-section">
        <div className="section-header">
          <h3 className="section-title">Update Exchange Rate</h3>
          <div className="header-actions">
            <button
              className="fetch-current-btn"
              onClick={fetchCurrentRateForUpdate}
              disabled={!showUpdateForm}
            >
              Fetch Current
            </button>
            <button
              className="create-btn update-btn"
              onClick={() => setShowUpdateForm(!showUpdateForm)}
            >
              {showUpdateForm ? "Cancel" : "Update Rate"}
            </button>
          </div>
        </div>

        {showUpdateForm && (
          <div className="create-form-card">
            <div className="form-header">
              <h4>Update Existing Rate (Creates Historical Entry)</h4>
              <p className="form-description">
                This will update the current rate and create a new historical
                entry
              </p>
              {updateFormData.id && (
                <div className="current-rate-info">
                  <p>Current Rate ID: {updateFormData.id}</p>
                  <p>
                    Current Buy Rate: ₦
                    {Number(updateFormData.buyRate).toLocaleString()}
                  </p>
                  <p>
                    Current Sell Rate: ₦
                    {Number(updateFormData.sellRate).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={handleUpdateRate} className="create-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">From Currency</label>
                  <select
                    name="fromCurrency"
                    value={updateFormData.fromCurrency}
                    onChange={handleUpdateInputChange}
                    className="form-select"
                    disabled // Disable since we only support NGN to GBP
                  >
                    <option value="NGN">Nigerian Naira (NGN)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">To Currency</label>
                  <select
                    name="toCurrency"
                    value={updateFormData.toCurrency}
                    onChange={handleUpdateInputChange}
                    className="form-select"
                    disabled // Disable since we only support NGN to GBP
                  >
                    <option value="GBP">British Pound (GBP)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Buy Rate</label>
                  <input
                    type="number"
                    name="buyRate"
                    value={updateFormData.buyRate}
                    onChange={handleUpdateInputChange}
                    placeholder="1250.75"
                    step="0.01"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Sell Rate</label>
                  <input
                    type="number"
                    name="sellRate"
                    value={updateFormData.sellRate}
                    onChange={handleUpdateInputChange}
                    placeholder="1260.50"
                    step="0.01"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* <div className="form-group">
                <label className="form-label">Update Notes</label>
                <textarea
                  name="notes"
                  value={updateFormData.notes}
                  onChange={handleUpdateInputChange}
                  placeholder="Reason for rate update..."
                  className="form-textarea"
                  rows={3}
                />
              </div> */}

              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-btn update-submit-btn"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Rate"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Recent Rates Section */}
      <div className="recent-section">
        <div className="section-header">
          <h3 className="section-title">Recent Rate Changes</h3>
          <button className="see-all-btn">See all</button>
        </div>

        <div className="tabs">
          {/* <button
            className={`tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All
          </button> */}
          {/* <button
            className={`tab ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            Active
          </button>
          <button
            className={`tab ${activeTab === "inactive" ? "active" : ""}`}
            onClick={() => setActiveTab("inactive")}
          >
            Inactive
          </button> */}
        </div>

        <div className="rate-list">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading recent rates...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📈</div>
              <h4>No Rate History</h4>
              <p>No exchange rate updates have been recorded yet.</p>
              <button
                className="create-btn"
                onClick={() => setShowCreateForm(true)}
              >
                Create First Rate
              </button>
            </div>
          ) : (
            history.map((item, index) => (
              <div key={item.id} className="rate-item">
                <div className="rate-icon">💱</div>
                <div className="rate-details">
                  <div className="rate-title">
                    Rate Update {item.fromCurrency} → {item.toCurrency}
                  </div>
                  <div className="rate-subtitle">
                    Buy: ₦{Number(item.buyRate).toLocaleString()} • Sell: ₦
                    {Number(item.sellRate).toLocaleString()}
                  </div>
                </div>
                <div className="rate-meta">
                  <div className="rate-date">
                    {new Date(item.createdAt).toLocaleDateString()}
                    <br />
                    {new Date(item.createdAt).toLocaleTimeString()}
                  </div>
                  <div className="rate-amount">
                    ₦{Number(item.buyRate).toLocaleString()} / ₦
                    {Number(item.sellRate).toLocaleString()}
                  </div>
                </div>
                <div className="rate-status">
                  <div className="status-number">{index + 1}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ExhangeRate;
