/**
 * Main Business Module - 主营分析
 */

import React from 'react';
import { KPICard } from '../KPICard';
import './ModuleLayout.css';
import './SharedCharts.css';

export const MainBusinessModule: React.FC = () => {
  const mainBusinessData = [
    { metricName: '主营收入', currentValue: 850000, unit: '元', periodChange: 10.5, targetValue: 800000, targetCompletion: 106.3 },
    { metricName: '主营利润', currentValue: 180000, unit: '元', periodChange: 12.3, targetValue: 170000, targetCompletion: 105.9 },
    { metricName: '利润率', currentValue: 21.2, unit: '%', periodChange: 1.5, targetValue: 20, targetCompletion: 106.0 },
    { metricName: '主营占比', currentValue: 68, unit: '%', periodChange: 2.1 }
  ];

  const trendData = [
    { period: '第1周', value: 195000 },
    { period: '第2周', value: 210000 },
    { period: '第3周', value: 205000 },
    { period: '第4周', value: 240000 },
  ];

  return (
    <div className="module-layout">
      <div className="module-section">
        <h2 className="section-title">主营业务指标</h2>
        <div className="kpi-grid">
          {mainBusinessData.map((item, index) => (
            <KPICard
              key={index}
              metricName={item.metricName}
              currentValue={item.currentValue}
              unit={item.unit}
              periodChange={item.periodChange}
              targetValue={item.targetValue}
              targetCompletion={item.targetCompletion}
            />
          ))}
        </div>
      </div>

      <div className="module-section">
        <h2 className="section-title">主营收入趋势</h2>
        <div className="simple-bar-chart">
          <div className="bar-chart-header">
            <h4 className="bar-chart-title">近30天主营收入趋势</h4>
            <span className="bar-chart-unit">单位: 元</span>
          </div>
          <div className="bar-chart-bars">
            {trendData.map((item, index) => (
              <div key={index} className="bar-item">
                <div className="bar-label">{item.period}</div>
                <div className="bar-container">
                  <div 
                    className="bar-fill success"
                    style={{ width: `${(item.value / 240000) * 100}%` }}
                  >
                    <span className="bar-value">{item.value.toLocaleString()}</span>
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
