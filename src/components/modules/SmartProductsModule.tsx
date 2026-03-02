/**
 * Smart Products Module - 智能产品分析
 */

import React from 'react';
import { KPICard } from '../KPICard';
import './ModuleLayout.css';
import './SharedCharts.css';

export const SmartProductsModule: React.FC = () => {
  const smartData = [
    { metricName: '智能手表', currentValue: 180, unit: '台', periodChange: 25.3 },
    { metricName: '智能耳机', currentValue: 320, unit: '台', periodChange: 18.5 },
    { metricName: '智能音箱', currentValue: 95, unit: '台', periodChange: 12.8 },
    { metricName: '其他智能设备', currentValue: 150, unit: '台', periodChange: 8.5 }
  ];

  const comparisonData = [
    { name: '智能耳机', value: 320, color: 'primary' },
    { name: '智能手表', value: 180, color: 'info' },
    { name: '其他设备', value: 150, color: 'warning' },
    { name: '智能音箱', value: 95, color: 'success' },
  ];

  return (
    <div className="module-layout">
      <div className="module-section">
        <h2 className="section-title">智能产品销量</h2>
        <div className="kpi-grid">
          {smartData.map((item, index) => (
            <KPICard
              key={index}
              metricName={item.metricName}
              currentValue={item.currentValue}
              unit={item.unit}
              periodChange={item.periodChange}
            />
          ))}
        </div>
      </div>

      <div className="module-section">
        <h2 className="section-title">智能产品销量对比</h2>
        <div className="simple-bar-chart">
          <div className="bar-chart-header">
            <h4 className="bar-chart-title">各类智能产品销量对比</h4>
            <span className="bar-chart-unit">单位: 台</span>
          </div>
          <div className="bar-chart-bars">
            {comparisonData.map((item, index) => (
              <div key={index} className="bar-item">
                <div className="bar-label">{item.name}</div>
                <div className="bar-container">
                  <div 
                    className={`bar-fill ${item.color}`}
                    style={{ width: `${(item.value / 320) * 100}%` }}
                  >
                    <span className="bar-value">{item.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
