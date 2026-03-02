/**
 * Market Overview Chart Component
 * 市场概览图表 - 展示门店与市场的对比数据
 */

import React from 'react';
import './MarketOverviewChart.css';

interface MarketOverviewChartProps {
  storeTotalSales: number;
  marketTotalSales: number;
  storeMarketShare: number;
  storeRanking: number;
  totalCompetitors: number;
}

export const MarketOverviewChart: React.FC<MarketOverviewChartProps> = ({
  storeTotalSales,
  marketTotalSales,
  storeMarketShare,
  storeRanking,
  totalCompetitors
}) => {
  // 计算其他门店的销量
  const otherStoresSales = marketTotalSales - storeTotalSales;
  const storePercent = (storeTotalSales / marketTotalSales) * 100;
  const othersPercent = 100 - storePercent;

  return (
    <div className="market-overview-chart">
      {/* 销量对比图表 */}
      <div className="market-chart-section">
        <h3 className="market-chart-title">门店 vs 区域市场销量</h3>
        <div className="market-sales-comparison">
          <div className="sales-bar-chart">
            <div className="sales-bar-item">
              <div className="sales-bar-label">
                <span className="sales-icon">🏪</span>
                <span className="sales-text">本门店</span>
              </div>
              <div className="sales-bar-container">
                <div 
                  className="sales-bar store-sales-bar"
                  style={{ width: `${storePercent}%` }}
                >
                  <span className="sales-value">
                    {storeTotalSales.toLocaleString()}台
                  </span>
                </div>
                <span className="sales-percent">{storeMarketShare}%</span>
              </div>
            </div>
            <div className="sales-bar-item">
              <div className="sales-bar-label">
                <span className="sales-icon">🏬</span>
                <span className="sales-text">其他门店</span>
              </div>
              <div className="sales-bar-container">
                <div 
                  className="sales-bar others-sales-bar"
                  style={{ width: `${othersPercent}%` }}
                >
                  <span className="sales-value">
                    {otherStoresSales.toLocaleString()}台
                  </span>
                </div>
                <span className="sales-percent">{(100 - storeMarketShare).toFixed(1)}%</span>
              </div>
            </div>
          </div>
          
          <div className="market-total-info">
            <div className="total-label">区域市场总销量</div>
            <div className="total-value">
              <span className="total-number">{marketTotalSales.toLocaleString()}</span>
              <span className="total-unit">台</span>
            </div>
            <div className="total-detail">{totalCompetitors} 家竞争门店</div>
          </div>
        </div>
      </div>

      {/* 市场占有率饼图 */}
      <div className="market-chart-section">
        <h3 className="market-chart-title">市场占有率</h3>
        <div className="market-share-chart">
          <div className="pie-chart-container">
            <svg viewBox="0 0 200 200" className="pie-chart">
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#e8e8e8"
                strokeWidth="40"
              />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#1890ff"
                strokeWidth="40"
                strokeDasharray={`${storeMarketShare * 5.03} ${(100 - storeMarketShare) * 5.03}`}
                strokeDashoffset="125.7"
                transform="rotate(-90 100 100)"
                className="pie-chart-segment"
              />
              <text
                x="100"
                y="95"
                textAnchor="middle"
                className="pie-chart-value"
              >
                {storeMarketShare}%
              </text>
              <text
                x="100"
                y="115"
                textAnchor="middle"
                className="pie-chart-label"
              >
                市场份额
              </text>
            </svg>
          </div>
          
          <div className="market-ranking-info">
            <div className="ranking-badge">
              <span className="ranking-icon">🏆</span>
              <div className="ranking-content">
                <div className="ranking-label">区域排名</div>
                <div className="ranking-value">
                  <span className="ranking-number">#{storeRanking}</span>
                  <span className="ranking-total">/ {totalCompetitors}</span>
                </div>
              </div>
            </div>
            
            <div className="ranking-progress">
              <div className="progress-label">排名位置</div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar"
                  style={{ width: `${((totalCompetitors - storeRanking + 1) / totalCompetitors) * 100}%` }}
                />
              </div>
              <div className="progress-text">
                前 {Math.round((storeRanking / totalCompetitors) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
