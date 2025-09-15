"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

interface ChartData {
  date: string;
  rate: number;
  timestamp: string;
}

interface ChartProps {
  data: ChartData[];
  period: string;
  summary: {
    totalEntries: number;
    latestRate: number;
    oldestRate: number;
    averageRate: number;
  };
  onPeriodChange?: (days: number) => void;
}

const ExchangeRateChart: React.FC<ChartProps> = ({
  data,
  period,
  summary,
  onPeriodChange,
}) => {
  // Calculate chart dimensions and scales
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Add resize observer
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Update chart dimensions to use container width
  const chartDimensions = useMemo(() => {
    const width = Math.max(containerWidth, 300); // minimum width of 300px
    const height = Math.min(width * 0.4, 400); // responsive height with max
    const padding = { top: 20, right: 30, bottom: 40, left: 60 };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const rates = data.map((d) => d.rate);
    const minRate = Math.min(...rates);
    const maxRate = Math.max(...rates);
    const rateRange = maxRate - minRate;
    const paddedMin = minRate - rateRange * 0.1;
    const paddedMax = maxRate + rateRange * 0.1;

    return {
      width,
      height,
      padding,
      chartWidth,
      chartHeight,
      minRate: paddedMin,
      maxRate: paddedMax,
      rateRange: paddedMax - paddedMin,
    };
  }, [data, containerWidth]);

  // Generate SVG path for the line chart
  const linePath = useMemo(() => {
    if (data.length === 0) return "";

    const { chartWidth, chartHeight, minRate, rateRange } = chartDimensions;

    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * chartWidth;
      const y = chartHeight - ((item.rate - minRate) / rateRange) * chartHeight;
      return `${x},${y}`;
    });

    return `M ${points.join(" L ")}`;
  }, [data, chartDimensions]);

  // Generate area path for gradient fill
  const areaPath = useMemo(() => {
    if (data.length === 0) return "";

    const { chartWidth, chartHeight, minRate, rateRange } = chartDimensions;

    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * chartWidth;
      const y = chartHeight - ((item.rate - minRate) / rateRange) * chartHeight;
      return `${x},${y}`;
    });

    const firstPoint = points[0].split(",");
    const lastPoint = points[points.length - 1].split(",");

    return `M ${firstPoint[0]},${chartHeight} L ${points.join(" L ")} L ${
      lastPoint[0]
    },${chartHeight} Z`;
  }, [data, chartDimensions]);

  // Generate Y-axis labels
  const yAxisLabels = useMemo(() => {
    const { minRate, maxRate, chartHeight } = chartDimensions;
    const labelCount = 5;
    const labels = [];

    for (let i = 0; i < labelCount; i++) {
      const value = minRate + (maxRate - minRate) * (i / (labelCount - 1));
      const y =
        chartHeight - ((value - minRate) / (maxRate - minRate)) * chartHeight;
      labels.push({
        value: Math.round(value * 100) / 100,
        y: y,
      });
    }

    return labels;
  }, [chartDimensions]);

  // Generate X-axis labels (show every 5th day)
  const xAxisLabels = useMemo(() => {
    const { chartWidth } = chartDimensions;
    const labels = [];
    const step = Math.max(1, Math.floor(data.length / 6)); // Show ~6 labels max

    for (let i = 0; i < data.length; i += step) {
      const x = (i / (data.length - 1)) * chartWidth;
      const date = new Date(data[i].date);
      const label = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      labels.push({
        label,
        x,
      });
    }

    return labels;
  }, [data, chartDimensions]);

  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-placeholder">
          <p>No chart data available</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="chart-container">
      <div className="chart-header">
        <div className="chart-title">Exchange Rate Trend ({period})</div>
        <div className="chart-summary">
          <div className="summary-item">
            <span className="label">Latest:</span>
            <span className="value">
              ₦{summary?.latestRate.toLocaleString()}
            </span>
          </div>
          <div className="summary-item">
            <span className="label">Average:</span>
            <span className="value">
              ₦{summary?.averageRate.toLocaleString()}
            </span>
          </div>
          <div className="summary-item">
            <span className="label">Entries:</span>
            <span className="value">{summary?.totalEntries}</span>
          </div>
        </div>
      </div>

      <div className="chart-controls">
        <div className="period-selector">
          <button
            className={`period-btn ${period === "7 days" ? "active" : ""}`}
            onClick={() => onPeriodChange && onPeriodChange(7)}
          >
            7D
          </button>
          <button
            className={`period-btn ${period === "30 days" ? "active" : ""}`}
            onClick={() => onPeriodChange && onPeriodChange(30)}
          >
            30D
          </button>
          <button
            className={`period-btn ${period === "90 days" ? "active" : ""}`}
            onClick={() => onPeriodChange && onPeriodChange(90)}
          >
            90D
          </button>
        </div>
      </div>

      <div className="chart-wrapper">
        <svg
          width={chartDimensions.width}
          height={chartDimensions.height}
          className="rate-chart"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.05" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor="#000"
                floodOpacity="0.1"
              />
            </filter>
          </defs>

          <g
            transform={`translate(${chartDimensions.padding.left}, ${chartDimensions.padding.top})`}
          >
            {/* Grid lines */}
            {yAxisLabels.map((label, index) => (
              <line
                key={index}
                x1="0"
                y1={label.y}
                x2={chartDimensions.chartWidth}
                y2={label.y}
                stroke="#f0f0f0"
                strokeWidth="1"
              />
            ))}

            {/* Area fill */}
            <path d={areaPath} fill="url(#areaGradient)" />

            {/* Main line */}
            <path
              d={linePath}
              fill="none"
              stroke="#ff6b35"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#shadow)"
            />

            {/* Data points */}
            {data.map((item, index) => {
              const x =
                (index / (data.length - 1)) * chartDimensions.chartWidth;
              const y =
                chartDimensions.chartHeight -
                ((item.rate - chartDimensions.minRate) /
                  chartDimensions.rateRange) *
                  chartDimensions.chartHeight;

              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#ff6b35"
                  stroke="white"
                  strokeWidth="2"
                  className="chart-point"
                />
              );
            })}

            {/* Y-axis labels */}
            {yAxisLabels.map((label, index) => (
              <text
                key={index}
                x="-10"
                y={label.y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#666"
              >
                ₦{label.value.toLocaleString()}
              </text>
            ))}

            {/* X-axis labels */}
            {xAxisLabels.map((label, index) => (
              <text
                key={index}
                x={label.x}
                y={chartDimensions.chartHeight + 20}
                textAnchor="middle"
                fontSize="12"
                fill="#666"
              >
                {label.label}
              </text>
            ))}

            {/* X-axis line */}
            <line
              x1="0"
              y1={chartDimensions.chartHeight}
              x2={chartDimensions.chartWidth}
              y2={chartDimensions.chartHeight}
              stroke="#e0e0e0"
              strokeWidth="1"
            />

            {/* Y-axis line */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2={chartDimensions.chartHeight}
              stroke="#e0e0e0"
              strokeWidth="1"
            />
          </g>
        </svg>
      </div>

      {/* Chart summary stats */}
      <div className="chart-stats">
        <div className="stat-item">
          <span className="stat-label">Latest:</span>
          <span className="stat-value latest">
            ₦{summary?.latestRate.toLocaleString()}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Average:</span>
          <span className="stat-value average">
            ₦{summary?.averageRate.toLocaleString()}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Highest:</span>
          <span className="stat-value highest">
            ₦{Math.max(...data?.map((d) => d.rate)).toLocaleString()}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Lowest:</span>
          <span className="stat-value lowest">
            ₦{Math.min(...data?.map((d) => d.rate)).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExchangeRateChart;
