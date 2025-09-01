import type React from "react";

interface CurrentRateDisplayProps {
  rate: number | null;
  lastUpdated: string | null;
  isLoading: boolean;
}

const CurrentRateDisplay: React.FC<CurrentRateDisplayProps> = ({
  rate,
  lastUpdated,
  isLoading,
}) => {
  return (
    <div className="card">
      <div className="card-header">Current Exchange Rate</div>
      <div className="card-content">
        <div className="current-rate">
          <div className="rate-pair">NGN → GBP</div>
          <div className="rate-value">
            {isLoading
              ? "Loading..."
              : rate
              ? `₦${rate.toLocaleString()}`
              : "Error"}
          </div>
          <div className="rate-updated">
            {lastUpdated
              ? `Updated ${new Date(lastUpdated).toLocaleString()}`
              : "Fetching data..."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentRateDisplay;
