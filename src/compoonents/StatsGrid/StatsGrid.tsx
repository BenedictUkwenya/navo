import type React from "react";

interface StatsGridProps {
  currentRate: number | null;
  change: number | null;
  lastUpdated: string | null;
  totalUpdates: number | null;
  isLoading: boolean;
}

const StatsGrid: React.FC<StatsGridProps> = ({
  currentRate,
  change,
  lastUpdated,
  totalUpdates,
  isLoading,
}) => {
  const formatTime = (dateString: string | null) => {
    if (!dateString) return "--";
    return new Date(dateString).toLocaleTimeString();
  };

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">💱</div>
        <div className="stat-value">
          {isLoading
            ? "Loading..."
            : currentRate
            ? `₦${currentRate.toLocaleString()}`
            : "Error"}
        </div>
        <div className="stat-label">Current NGN/GBP Rate</div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">📈</div>
        <div className="stat-value">
          {change !== null
            ? change > 0
              ? `+${change}`
              : change.toString()
            : "--"}
        </div>
        <div className="stat-label">24h Change</div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🕒</div>
        <div className="stat-value">{formatTime(lastUpdated)}</div>
        <div className="stat-label">Last Updated</div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">📊</div>
        <div className="stat-value">{totalUpdates || "--"}</div>
        <div className="stat-label">Total Updates</div>
      </div>
    </div>
  );
};

export default StatsGrid;
