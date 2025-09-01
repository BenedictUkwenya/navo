import type React from "react";
import type { RateHistory, PaginationData } from "../../types/exchange-rate";
import Pagination from "../Pagination/Pagination";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

interface RateHistoryTableProps {
  history: RateHistory[];
  pagination: PaginationData | null;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

const RateHistoryTable: React.FC<RateHistoryTableProps> = ({
  history,
  pagination,
  isLoading,
  onPageChange,
}) => {
  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={6} style={{ textAlign: "center", padding: "40px" }}>
            <LoadingSpinner />
            <div style={{ marginTop: "10px" }}>Loading history...</div>
          </td>
        </tr>
      );
    }

    if (history.length === 0) {
      return (
        <tr>
          <td
            colSpan={6}
            style={{ textAlign: "center", padding: "40px", color: "#666" }}
          >
            No rate history found
          </td>
        </tr>
      );
    }

    return history.map((item) => {
      const date = new Date(item.created_at).toLocaleString();
      const rate = `₦${Number.parseFloat(
        item.rate.toString()
      ).toLocaleString()}`;
      const change = item.change || 0;
      const changeClass =
        change > 0 ? "change-positive" : change < 0 ? "change-negative" : "";
      const changeText = change > 0 ? `+${change}%` : `${change}%`;
      const status = item.is_active ? "active" : "inactive";

      return (
        <tr key={item.id}>
          <td>{date}</td>
          <td>
            {item.from_currency} → {item.to_currency}
          </td>
          <td>{rate}</td>
          <td className={`change-indicator ${changeClass}`}>{changeText}</td>
          <td>
            <span className={`status-badge status-${status}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </td>
          <td>{item.notes || "--"}</td>
        </tr>
      );
    });
  };

  return (
    <div className="card">
      <div className="card-header">Recent Rate Changes</div>
      <div className="card-content">
        <table className="history-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Currency Pair</th>
              <th>Rate</th>
              <th>Change</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>{renderTableContent()}</tbody>
        </table>

        {pagination && (
          <Pagination pagination={pagination} onPageChange={onPageChange} />
        )}
      </div>
    </div>
  );
};

export default RateHistoryTable;
