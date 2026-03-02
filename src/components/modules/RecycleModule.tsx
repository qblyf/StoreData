/**
 * Recycle Module - 回收分析
 */

import React from 'react';
import { KPICard } from '../KPICard';
import './ModuleLayout.css';
import './SharedCharts.css';

export const RecycleModule: React.FC = () => {
  const recycleData = [
    { metricName: '回收量', currentValue: 350, unit: '台', periodChange: 12.5 },
    { metricName: '回收金额', currentValue: 125000, unit: '元', periodChange: 15.8 },
    { metricName: '平均回收价', currentValue: 357, unit: '元', periodChange: 2.9 },
    { metricName: '回收转化率', currentValue: 8.5, unit: '%', periodChange: 1.2 }
  ];

  const trendData = [
    { period: '第1周', value: 78 },
    { period: '第2周', value: 92 },
    { period: '第3周', value: 85 },
    { period: '第4周', value: 95 },
  ];

  return (
    <div className="module-layout">
      <div className="module-section">
        <h2 className="section-title">回收业务指标</h2>
        <div className="kpi-grid">
          {recycleData.map((item, index) => (
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
        <h2 className="section-title">回收趋势</h2>
        <div className="simple-bar-chart">
          <div className="bar-chart-header">
            <h4 className="bar-chart-title">近30天回收量趋势</h4>
            <span className="bar-chart-unit">单位: 台</span>
          </div>
          <div className="bar-chart-bars">
            {trendData.map((item, index) => (
              <div key={index} className="bar-item">
                <div className="bar-label">{item.period}</div>
                <div className="bar-container">
                  <div 
                    className="bar-fill cyan"
                    style={{ width: `${(item.value / 95) * 100}%` }}
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
