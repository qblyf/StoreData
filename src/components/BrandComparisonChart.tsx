/**
 * Brand Comparison Chart Component
 * 简单直观的品牌对比图表，使用 HTML/CSS 实现
 */

import React from 'react';
import './BrandComparisonChart.css';

interface BrandData {
  brand: string;
  icon: string;
  storeValue: number;
  marketValue: number;
}

interface BrandComparisonChartProps {
  title: string;
  data: BrandData[];
  unit: string;
  type: 'sales' | 'percentage';
}

export const BrandComparisonChart: React.FC<BrandComparisonChartProps> = ({
  title,
  data,
  unit,
  type
}) => {
  // 计算最大值用于比例
  const maxValue = Math.max(
    ...data.map(d => Math.max(d.storeValue, d.marketValue))
  );

  // 格式化数值
  const formatValue = (value: number): string => {
    if (type === 'sales' && value >= 10000) {
      return `${(value / 10000).toFixed(1)}万`;
    }
    return value.toLocaleString('zh-CN', {
      minimumFractionDigits: type === 'percentage' ? 1 : 0,
      maximumFractionDigits: type === 'percentage' ? 1 : 0
    });
  };

  return (
    <div className="brand-comparison-chart">
      <h3 className="brand-chart-title">{title}</h3>
      <div className="brand-chart-content">
        {data.map((brand, index) => {
          const storePercent = (brand.storeValue / maxValue) * 100;
          const marketPercent = (brand.marketValue / maxValue) * 100;

          return (
            <div key={index} className="brand-chart-item">
              <div className="brand-chart-label">
                <span className="brand-icon">{brand.icon}</span>
                <span className="brand-name">{brand.brand}</span>
              </div>
              <div className="brand-chart-bars">
                <div className="brand-chart-bar-row">
                  <span className="bar-label">门店</span>
                  <div className="bar-container">
                    <div 
                      className="bar store-bar"
                      style={{ width: `${storePercent}%` }}
                    >
                      <span className="bar-value">
                        {formatValue(brand.storeValue)}{unit}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="brand-chart-bar-row">
                  <span className="bar-label">市场</span>
                  <div className="bar-container">
                    <div 
                      className="bar market-bar"
                      style={{ width: `${marketPercent}%` }}
                    >
                      <span className="bar-value">
                        {formatValue(brand.marketValue)}{unit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="brand-chart-legend">
        <div className="legend-item">
          <span className="legend-color store-color"></span>
          <span className="legend-text">门店</span>
        </div>
        <div className="legend-item">
          <span className="legend-color market-color"></span>
          <span className="legend-text">区域市场</span>
        </div>
      </div>
    </div>
  );
};
