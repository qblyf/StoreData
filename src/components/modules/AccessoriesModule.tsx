/**
 * Accessories Module - 配件分析
 */

import React from 'react';
import { KPICard } from '../KPICard';
import './ModuleLayout.css';
import './SharedCharts.css';

export const AccessoriesModule: React.FC = () => {
  const accessoriesData = [
    { metricName: '配件销量', currentValue: 1580, unit: '件', periodChange: 15.8 },
    { metricName: '配件收入', currentValue: 45000, unit: '元', periodChange: 18.2 },
    { metricName: '配件利润率', currentValue: 35.5, unit: '%', periodChange: 2.3 },
    { metricName: '配件占比', currentValue: 3.6, unit: '%', periodChange: 0.5 }
  ];

  const distributionData = [
    { name: '手机壳', value: 520, color: 'primary' },
    { name: '充电器', value: 380, color: 'info' },
    { name: '数据线', value: 420, color: 'success' },
    { name: '耳机', value: 260, color: 'warning' },
  ];

  return (
    <div className="module-layout">
      <div className="module-section">
        <h2 className="section-title">配件业务指标</h2>
        <div className="kpi-grid">
          {accessoriesData.map((item, index) => (
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
        <h2 className="section-title">配件销量分布</h2>
        <div className="simple-bar-chart">
          <div className="bar-chart-header">
            <h4 className="bar-chart-title">各类配件销量对比</h4>
            <span className="bar-chart-unit">单位: 件</span>
          </div>
          <div className="bar-chart-bars">
            {distributionData.map((item, index) => (
              <div key={index} className="bar-item">
                <div className="bar-label">{item.name}</div>
                <div className="bar-container">
                  <div 
                    className={`bar-fill ${item.color}`}
                    style={{ width: `${(item.value / 520) * 100}%` }}
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
