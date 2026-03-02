/**
 * BarChart Component
 * 
 * Displays bar charts for comparing metrics across multiple stores with support for:
 * - Horizontal and vertical orientations
 * - Data labels display
 * - Multi-store comparison
 * - Interactive tooltips and legends
 * 
 * Requirements: 支持多门店对比功能
 */

import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  TooltipProps,
  LabelList,
} from 'recharts';
import './BarChart.css';

/**
 * Data point for the bar chart
 */
export interface BarChartDataPoint {
  label: string; // Store name or category label
  value: number | null;
  target?: number | null;
  color?: string; // Optional custom color for the bar
}

/**
 * Props for BarChart component
 */
export interface BarChartProps {
  /** Chart title */
  title: string;
  /** Data points to display */
  data: BarChartDataPoint[];
  /** Metric unit (e.g., '元', '%', '人') */
  unit: string;
  /** Chart orientation */
  orientation?: 'vertical' | 'horizontal';
  /** Height of the chart in pixels */
  height?: number;
  /** Whether to show data labels on bars */
  showDataLabels?: boolean;
  /** Whether to show the target line/bars */
  showTarget?: boolean;
  /** Color for the bars (default: #1890ff) */
  barColor?: string;
  /** Color for the target bars (default: #52c41a) */
  targetColor?: string;
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
 * Format value for data label (shorter format)
 */
function formatDataLabel(value: number | null, unit: string): string {
  if (value === null) {
    return 'N/A';
  }
  
  // For large numbers, use abbreviated format
  if (Math.abs(value) >= 10000) {
    return `${(value / 10000).toFixed(1)}万${unit}`;
  }
  
  return `${value.toFixed(1)}${unit}`;
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
    <div className="bar-chart-tooltip">
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
 * BarChart Component
 */
export const BarChart: React.FC<BarChartProps> = React.memo(({
  title,
  data,
  unit,
  orientation = 'vertical',
  height = 400,
  showDataLabels = true,
  showTarget = true,
  barColor = '#1890ff',
  targetColor = '#52c41a',
}) => {
  // Transform data for Recharts
  const chartData = data.map((point) => ({
    label: point.label,
    实际值: point.value,
    目标值: point.target,
    color: point.color || barColor,
  }));

  // Check if we have any target data
  const hasTargetData = data.some((point) => point.target !== undefined && point.target !== null);
  const shouldShowTarget = showTarget && hasTargetData;

  // Determine if we should use horizontal layout
  const isHorizontal = orientation === 'horizontal';

  return (
    <div className="bar-chart">
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={chartData}
          layout={isHorizontal ? 'horizontal' : 'vertical'}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          
          {isHorizontal ? (
            <>
              <XAxis
                type="number"
                stroke="#666"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => {
                  if (value >= 10000) {
                    return `${(value / 10000).toFixed(1)}万`;
                  }
                  return value.toLocaleString('zh-CN');
                }}
              />
              <YAxis
                type="category"
                dataKey="label"
                stroke="#666"
                style={{ fontSize: '12px' }}
                width={100}
              />
            </>
          ) : (
            <>
              <XAxis
                type="category"
                dataKey="label"
                stroke="#666"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                type="number"
                stroke="#666"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => {
                  if (value >= 10000) {
                    return `${(value / 10000).toFixed(1)}万`;
                  }
                  return value.toLocaleString('zh-CN');
                }}
              />
            </>
          )}
          
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Legend
            wrapperStyle={{ fontSize: '14px' }}
            iconType="rect"
          />
          
          <Bar dataKey="实际值" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            {showDataLabels && (
              <LabelList
                dataKey="实际值"
                position={isHorizontal ? 'right' : 'top'}
                formatter={(value: number) => formatDataLabel(value, unit)}
                style={{ fontSize: '12px', fill: '#666' }}
              />
            )}
          </Bar>
          
          {shouldShowTarget && (
            <Bar
              dataKey="目标值"
              fill={targetColor}
              fillOpacity={0.6}
              radius={[4, 4, 0, 0]}
            >
              {showDataLabels && (
                <LabelList
                  dataKey="目标值"
                  position={isHorizontal ? 'right' : 'top'}
                  formatter={(value: number) => formatDataLabel(value, unit)}
                  style={{ fontSize: '12px', fill: '#666' }}
                />
              )}
            </Bar>
          )}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
});
