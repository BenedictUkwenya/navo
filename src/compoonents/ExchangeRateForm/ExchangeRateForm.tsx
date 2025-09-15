"use client";

import type React from "react";
import { useState } from "react";
import type { ExchangeRate } from "../../types/exchange-rate";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

interface ExchangeRateFormProps {
  onSubmit: (
    data: Omit<ExchangeRate, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  onFetchLatest: () => Promise<void>;
  isLoading: boolean;
  isFetching: boolean;
}

const ExchangeRateForm: React.FC<ExchangeRateFormProps> = ({
  onSubmit,
  onFetchLatest,
  isLoading,
  isFetching,
}) => {
  const [formData, setFormData] = useState({
    fromCurrency: "NGN",
    toCurrency: "GBP",
    newRate: "",
    effectiveDate: new Date().toISOString().slice(0, 16),
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const rateData: Omit<ExchangeRate, "id" | "created_at" | "updated_at"> = {
      rate: Number.parseFloat(formData.newRate),
      from_currency: formData.fromCurrency,
      to_currency: formData.toCurrency,
      effective_date: formData.effectiveDate,
      notes: formData.notes || undefined,
    };

    await onSubmit(rateData);

    // Reset form
    setFormData({
      fromCurrency: "NGN",
      toCurrency: "GBP",
      newRate: "",
      effectiveDate: new Date().toISOString().slice(0, 16),
      notes: "",
    });
  };

  const setFetchedRate = (rate: number) => {
    setFormData((prev) => ({
      ...prev,
      newRate: rate.toString(),
    }));
  };

  return (
    <div className="card">
      <div className="card-header">Update Exchange Rate</div>
      <div className="card-content">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">From Currency</label>
              <select
                className="form-input"
                name="fromCurrency"
                value={formData.fromCurrency}
                onChange={handleInputChange}
              >
                <option value="NGN">Nigerian Naira (NGN)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">To Currency</label>
              <select
                className="form-input"
                name="toCurrency"
                value={formData.toCurrency}
                onChange={handleInputChange}
              >
                <option value="GBP">British Pound (GBP)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">New Rate</label>
              <input
                type="number"
                className="form-input"
                name="newRate"
                value={formData.newRate}
                onChange={handleInputChange}
                step="0.01"
                placeholder="1250.75"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Effective Date</label>
              <input
                type="datetime-local"
                className="form-input"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Notes</label>
              <textarea
                className="form-input"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Reason for rate change..."
              />
            </div>
          </div>

          <div className="action-buttons">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Rate</span>
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onFetchLatest}
              disabled={isFetching}
            >
              {isFetching ? (
                <>
                  <LoadingSpinner size="small" />
                  <span>Fetching...</span>
                </>
              ) : (
                <span>Fetch Latest</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExchangeRateForm;
