/**
 * StoreComparison Component
 * 
 * Displays side-by-side comparison of key metrics across multiple stores with:
 * - Comparison bar charts showing differences
 * - Rankings and average values
 * - Support for multiple metric comparison
 * 
 * Requirements: 基于设计文档的 ComparisonResult
 */

import React, { useMemo } from 'react';
import { BarChart, BarChartDataPoint } from './BarChart';
import { ComparisonResult } from '../types';
import './StoreComparison.css';

/**
 * Props for StoreComparison component
 */
export interface StoreComparisonProps {
  /** Comparison result data */
  comparisonResult: ComparisonResult;
  /** Metric name for display */
  metricName: string;
  /** Metric unit */
  unit: string;
  /** Chart height in pixels */
  height?: number;
}

/**
 * Format value with unit for display
 */
function formatValue(value: number | null, unit: string): string {
  if (value === null) {
    return 'N/A';
  }
  
  const formatted = value.toLocaleString('zh-CN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  return `${formatted}${unit}`;
}

/**
 * Get color based on ranking (top performers get better colors)
 */
function getRankColor(rank: number, totalStores: number): string {
  if (rank === 1) return '#52c41a'; // Green for #1
  if (rank === 2) return '#1890ff'; // Blue for #2
  if (rank === 3) return '#faad14'; // Orange for #3
  if (rank > totalStores - 2) return '#ff4d4f'; // Red for bottom performers
  return '#8c8c8c'; // Gray for middle performers
}

/**
 * StoreComparison Component
 */
export const StoreComparison: React.FC<StoreComparisonProps> = ({
  comparisonResult,
  metricName,
  unit,
  height = 400,
}) => {
  // Transform data for bar chart
  const chartData: BarChartDataPoint[] = useMemo(() => {
    return comparisonResult.stores.map((store) => {
      const ranking = comparisonResult.ranking.find(r => r.storeId === store.storeId);
      const rank = ranking?.rank || 0;
      
      return {
        label: store.storeName,
        value: store.value,
        target: store.target,
        color: getRankColor(rank, comparisonResult.stores.length),
      };
    });
  }, [comparisonResult]);

  // Sort stores by ranking for the table
  const sortedStores = useMemo(() => {
    return [...comparisonResult.stores].sort((a, b) => {
      const rankA = comparisonResult.ranking.find(r => r.storeId === a.storeId)?.rank || 999;
      const rankB = comparisonResult.ranking.find(r => r.storeId === b.storeId)?.rank || 999;
      return rankA - rankB;
    });
  }, [comparisonResult]);

  // Calculate statistics
  const validValues = comparisonResult.stores
    .map(s => s.value)
    .filter((v): v is number => v !== null);
  
  const hasValidData = validValues.length > 0;
  const average = hasValidData ? comparisonResult.average : null;
  const median = hasValidData ? comparisonResult.median : null;
  const max = hasValidData ? Math.max(...validValues) : null;
  const min = hasValidData ? Math.min(...validValues) : null;

  return (
    <div className="store-comparison">
      <div className="comparison-header">
        <h2 className="comparison-title">{metricName} - 门店对比</h2>
        <p className="comparison-subtitle">
          对比 {comparisonResult.stores.length} 家门店的表现
        </p>
      </div>

      {/* Statistics Summary */}
      <div className="comparison-stats">
        <div className="stat-card">
          <div className="stat-label">平均值</div>
          <div className="stat-value">{formatValue(average, unit)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">中位数</div>
          <div className="stat-value">{formatValue(median, unit)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">最高值</div>
          <div className="stat-value stat-value-high">{formatValue(max, unit)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">最低值</div>
          <div className="stat-value stat-value-low">{formatValue(min, unit)}</div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="comparison-chart">
        <BarChart
          title={`${metricName}对比`}
          data={chartData}
          unit={unit}
          orientation="horizontal"
          height={height}
          showDataLabels={true}
          showTarget={chartData.some(d => d.target !== undefined)}
        />
      </div>

      {/* Ranking Table */}
      <div className="comparison-table-container">
        <h3 className="table-title">排名详情</h3>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>排名</th>
              <th>门店名称</th>
              <th>类型</th>
              <th>级别</th>
              <th>实际值</th>
              <th>目标值</th>
              <th>偏差</th>
            </tr>
          </thead>
          <tbody>
            {sortedStores.map((store) => {
              const ranking = comparisonResult.ranking.find(r => r.storeId === store.storeId);
              const rank = ranking?.rank || '-';
              const deviation = store.deviation !== undefined ? store.deviation : null;
              const hasTarget = store.target !== undefined && store.target !== null;
              
              return (
                <tr key={store.storeId}>
                  <td className="rank-cell">
                    <span 
                      className="rank-badge"
                      style={{ 
                        backgroundColor: typeof rank === 'number' 
                          ? getRankColor(rank, sortedStores.length) 
                          : '#d9d9d9' 
                      }}
                    >
                      {rank}
                    </span>
                  </td>
                  <td className="store-name-cell">{store.storeName}</td>
                  <td>{store.storeType}</td>
                  <td>{store.storeLevel}</td>
                  <td className="value-cell">{formatValue(store.value, unit)}</td>
                  <td className="value-cell">
                    {hasTarget ? formatValue(store.target!, unit) : '-'}
                  </td>
                  <td className={`deviation-cell ${
                    deviation !== null && deviation < 0 ? 'negative' : 
                    deviation !== null && deviation > 0 ? 'positive' : ''
                  }`}>
                    {deviation !== null ? formatValue(deviation, unit) : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="comparison-footer">
        <p className="comparison-timestamp">
          数据更新时间: {comparisonResult.timestamp.toLocaleString('zh-CN')}
        </p>
      </div>
    </div>
  );
};
