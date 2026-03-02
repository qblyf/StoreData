/**
 * Market Brand Module - 市场销量分析与品牌占比
 * 展示门店销量与区域市场销量的对比分析
 */

import React, { useState } from 'react';
import { BrandComparisonChart } from '../BrandComparisonChart';
import { MarketOverviewChart } from '../MarketOverviewChart';
import './ModuleLayout.css';
import './MarketBrandModule.css';

interface MarketShareData {
  brand: string;
  storeSales: number;
  marketSales: number;
  storeShare: number;
  marketShare: number;
  icon: string;
}

export const MarketBrandModule: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  // 门店与市场对比数据
  const marketComparisonData = {
    storeTotalSales: 3600,      // 门店总销量
    marketTotalSales: 45000,    // 区域市场总销量
    storeMarketShare: 8.0,      // 门店市场占有率
    storeRanking: 3,            // 门店在区域排名
    totalCompetitors: 25,       // 区域竞争门店数
  };

  // 各品牌销量对比数据
  const brandData: MarketShareData[] = [
    {
      brand: '苹果',
      storeSales: 1250,
      marketSales: 15000,
      storeShare: 34.7,
      marketShare: 33.3,
      icon: '🍎'
    },
    {
      brand: '华为',
      storeSales: 980,
      marketSales: 12000,
      storeShare: 27.2,
      marketShare: 26.7,
      icon: '📱'
    },
    {
      brand: '小米',
      storeSales: 750,
      marketSales: 9000,
      storeShare: 20.8,
      marketShare: 20.0,
      icon: '📲'
    },
    {
      brand: 'OPPO',
      storeSales: 420,
      marketSales: 5500,
      storeShare: 11.7,
      marketShare: 12.2,
      icon: '📞'
    },
    {
      brand: 'vivo',
      storeSales: 200,
      marketSales: 3500,
      storeShare: 5.6,
      marketShare: 7.8,
      icon: '📳'
    }
  ];

  return (
    <div className="module-layout">
      {/* 市场概览 */}
      <div className="module-section">
        <div className="section-header-with-filter">
          <h2 className="section-title">市场销量对比</h2>
          <div className="period-filter">
            <button 
              className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('month')}
            >
              本月
            </button>
            <button 
              className={`period-btn ${selectedPeriod === 'quarter' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('quarter')}
            >
              本季度
            </button>
            <button 
              className={`period-btn ${selectedPeriod === 'year' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('year')}
            >
              本年
            </button>
          </div>
        </div>

        <MarketOverviewChart
          storeTotalSales={marketComparisonData.storeTotalSales}
          marketTotalSales={marketComparisonData.marketTotalSales}
          storeMarketShare={marketComparisonData.storeMarketShare}
          storeRanking={marketComparisonData.storeRanking}
          totalCompetitors={marketComparisonData.totalCompetitors}
        />
      </div>

      {/* 品牌销量对比分析 */}
      <div className="module-section">
        <h2 className="section-title">品牌销量对比分析</h2>
        <BrandComparisonChart
          title="门店 vs 区域市场销量对比"
          data={brandData.map(brand => ({
            brand: brand.brand,
            icon: brand.icon,
            storeValue: brand.storeSales,
            marketValue: brand.marketSales
          }))}
          unit="台"
          type="sales"
        />
      </div>

      {/* 品牌占比对比分析 */}
      <div className="module-section">
        <h2 className="section-title">品牌占比对比分析</h2>
        <BrandComparisonChart
          title="门店 vs 区域市场占比对比"
          data={brandData.map(brand => ({
            brand: brand.brand,
            icon: brand.icon,
            storeValue: brand.storeShare,
            marketValue: brand.marketShare
          }))}
          unit="%"
          type="percentage"
        />
      </div>

      {/* 市场洞察 */}
      <div className="module-section">
        <h2 className="section-title">市场洞察</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">💡</div>
            <div className="insight-content">
              <h3 className="insight-title">优势品牌</h3>
              <p className="insight-text">
                苹果和华为在门店的占比高于市场平均水平，建议加大库存和促销力度
              </p>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">⚠️</div>
            <div className="insight-content">
              <h3 className="insight-title">待提升品牌</h3>
              <p className="insight-text">
                vivo在门店占比低于市场，建议优化产品陈列和销售策略
              </p>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">🎯</div>
            <div className="insight-content">
              <h3 className="insight-title">市场机会</h3>
              <p className="insight-text">
                门店市场占有率8%，排名第3，有提升空间，建议加强营销推广
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
