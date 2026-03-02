/**
 * TrendLineChart Component
 * 
 * Displays metric trends over time with support for:
 * - Multiple lines comparison (actual vs target values)
 * - Time granularity switching (day, week, month)
 * - Interactive tooltips and legends
 * 
 * Requirements: 5.6, 10.3
 */

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { TimeGranularity } from '../types';
import './TrendLineChart.css';

/**
 * Data point for the trend chart
 */
export interface TrendChartDataPoint {
  timestamp: Date;
  actual: number | null;
  target?: number | null;
  label: string; // Formatted date string for display
}

/**
 * Props for TrendLineChart component
 */
export interface TrendLineChartProps {
  /** Chart title */
  title: string;
  /** Data points to display */
  data: TrendChartDataPoint[];
  /** Metric unit (e.g., '元', '%', '人') */
  unit: string;
  /** Current time granularity */
  granularity: TimeGranularity;
  /** Callback when granularity changes */
  onGranularityChange?: (granularity: TimeGranularity) => void;
  /** Height of the chart in pixels */
  height?: number;
  /** Whether to show the target line */
  showTarget?: boolean;
}

/**
 * Format value with unit for display
 */
function formatValue(value: number | null, unit: string): string {
  if (value === null) {
    return 'N/A';
  }
  
  // Format large numbers with thousand separators
  const formatted = value.toLocaleString('zh-CN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  return `${formatted}${unit}`;
}

/**
 * Custom tooltip component
 */
const CustomTooltip: React.FC<TooltipProps<number, string> & { unit: string }> = ({
  active,
  payload,
  label,
  unit,
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="trend-chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="tooltip-item" style={{ color: entry.color }}>
          <span className="tooltip-name">{entry.name}:</span>{' '}
          <span className="tooltip-value">
            {formatValue(entry.value as number | null, unit)}
          </span>
        </p>
      ))}
    </div>
  );
};

/**
 * TrendLineChart Component
 */
export const TrendLineChart: React.FC<TrendLineChartProps> = React.memo(({
  title,
  data,
  unit,
  granularity,
  onGranularityChange,
  height = 400,
  showTarget = true,
}) => {
  // Transform data for Recharts
  const chartData = data.map((point) => ({
    label: point.label,
    实际值: point.actual,
    目标值: point.target,
  }));

  // Check if we have any target data
  const hasTargetData = data.some((point) => point.target !== undefined && point.target !== null);
  const shouldShowTarget = showTarget && hasTargetData;

  return (
    <div className="trend-line-chart">
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        {onGranularityChange && (
          <div className="granularity-selector">
            <button
              className={`granularity-btn ${granularity === TimeGranularity.DAY ? 'active' : ''}`}
              onClick={() => onGranularityChange(TimeGranularity.DAY)}
            >
              日
            </button>
            <button
              className={`granularity-btn ${granularity === TimeGranularity.WEEK ? 'active' : ''}`}
              onClick={() => onGranularityChange(TimeGranularity.WEEK)}
            >
              周
            </button>
            <button
              className={`granularity-btn ${granularity === TimeGranularity.MONTH ? 'active' : ''}`}
              onClick={() => onGranularityChange(TimeGranularity.MONTH)}
            >
              月
            </button>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="label"
            stroke="#666"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#666"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => {
              // Format Y-axis values
              if (value >= 10000) {
                return `${(value / 10000).toFixed(1)}万`;
              }
              return value.toLocaleString('zh-CN');
            }}
          />
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Legend
            wrapperStyle={{ fontSize: '14px' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="实际值"
            stroke="#1890ff"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            connectNulls={false}
          />
          {shouldShowTarget && (
            <Line
              type="monotone"
              dataKey="目标值"
              stroke="#52c41a"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});
