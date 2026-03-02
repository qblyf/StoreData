/**
 * Sales Funnel Component
 * 销售漏斗组件 - 展示过店客流 → 进店客流 → 主营销量的转化流程
 */

import React from 'react';
import './SalesFunnel.css';

export interface SalesFunnelProps {
  passingTraffic: number | null; // 过店客流
  enteringTraffic: number | null; // 进店客流
  mainBusinessSales: number | null; // 主营销量
}

export const SalesFunnel: React.FC<SalesFunnelProps> = ({
  passingTraffic,
  enteringTraffic,
  mainBusinessSales,
}) => {
  // Calculate conversion rates
  const entryRate = passingTraffic && enteringTraffic 
    ? (enteringTraffic / passingTraffic) * 100 
    : 0;
  
  const conversionRate = enteringTraffic && mainBusinessSales 
    ? (mainBusinessSales / enteringTraffic) * 100 
    : 0;

  // Calculate percentages for visual representation
  const maxValue = passingTraffic || 1000;
  const passingPercent = 100;
  const enteringPercent = enteringTraffic ? (enteringTraffic / maxValue) * 100 : 0;
  const salesPercent = mainBusinessSales ? (mainBusinessSales / maxValue) * 100 : 0;

  const formatNumber = (value: number | null): string => {
    if (value === null) return 'N/A';
    return value.toLocaleString('zh-CN', { maximumFractionDigits: 0 });
  };

  const formatPercent = (value: number): string => {
    return value.toFixed(1) + '%';
  };

  return (
    <div className="sales-funnel-container">
      <div className="funnel-header">
        <h3 className="funnel-title">📊 销售转化漏斗</h3>
        <p className="funnel-description">过店 → 进店 → 成交 全流程转化分析</p>
      </div>

      <div className="funnel-visualization">
        {/* Stage 1: Passing Traffic */}
        <div className="funnel-stage stage-1">
          <div className="funnel-bar" style={{ width: `${passingPercent}%` }}>
            <div className="funnel-bar-content">
              <div className="funnel-stage-info">
                <span className="funnel-stage-icon">🚶</span>
                <span className="funnel-stage-label">过店客流</span>
              </div>
              <div className="funnel-stage-value">
                <span className="funnel-value-number">{formatNumber(passingTraffic)}</span>
                <span className="funnel-value-unit">人</span>
              </div>
            </div>
          </div>
          <div className="funnel-stage-percent">100%</div>
        </div>

        {/* Conversion Arrow 1 */}
        <div className="funnel-arrow">
          <div className="arrow-line"></div>
          <div className="arrow-label">
            <span className="arrow-rate">{formatPercent(entryRate)}</span>
            <span className="arrow-text">进店率</span>
          </div>
        </div>

        {/* Stage 2: Entering Traffic */}
        <div className="funnel-stage stage-2">
          <div className="funnel-bar" style={{ width: `${enteringPercent}%` }}>
            <div className="funnel-bar-content">
              <div className="funnel-stage-info">
                <span className="funnel-stage-icon">🏪</span>
                <span className="funnel-stage-label">进店客流</span>
              </div>
              <div className="funnel-stage-value">
                <span className="funnel-value-number">{formatNumber(enteringTraffic)}</span>
                <span className="funnel-value-unit">人</span>
              </div>
            </div>
          </div>
          <div className="funnel-stage-percent">{formatPercent(entryRate)}</div>
        </div>

        {/* Conversion Arrow 2 */}
        <div className="funnel-arrow">
          <div className="arrow-line"></div>
          <div className="arrow-label">
            <span className="arrow-rate">{formatPercent(conversionRate)}</span>
            <span className="arrow-text">成交率</span>
          </div>
        </div>

        {/* Stage 3: Main Business Sales */}
        <div className="funnel-stage stage-3">
          <div className="funnel-bar" style={{ width: `${salesPercent}%` }}>
            <div className="funnel-bar-content">
              <div className="funnel-stage-info">
                <span className="funnel-stage-icon">💰</span>
                <span className="funnel-stage-label">主营销量</span>
              </div>
              <div className="funnel-stage-value">
                <span className="funnel-value-number">{formatNumber(mainBusinessSales)}</span>
                <span className="funnel-value-unit">单</span>
              </div>
            </div>
          </div>
          <div className="funnel-stage-percent">{formatPercent(conversionRate)}</div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="funnel-summary">
        <div className="summary-item">
          <span className="summary-label">总转化率</span>
          <span className="summary-value">
            {mainBusinessSales && passingTraffic 
              ? formatPercent((mainBusinessSales / passingTraffic) * 100)
              : 'N/A'}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">流失客流</span>
          <span className="summary-value">
            {passingTraffic && enteringTraffic 
              ? formatNumber(passingTraffic - enteringTraffic) + '人'
              : 'N/A'}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">未成交客流</span>
          <span className="summary-value">
            {enteringTraffic && mainBusinessSales 
              ? formatNumber(enteringTraffic - mainBusinessSales) + '人'
              : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};
