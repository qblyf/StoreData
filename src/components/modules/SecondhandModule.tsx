/**
 * Secondhand Module - 二手机分析
 */

import React from 'react';
import { KPICard } from '../KPICard';
import './ModuleLayout.css';
import './SharedCharts.css';

export const SecondhandModule: React.FC = () => {
  const secondhandData = [
    { metricName: '二手机销量', currentValue: 280, unit: '台', periodChange: 18.5 },
    { metricName: '销售金额', currentValue: 98000, unit: '元', periodChange: 20.3 },
    { metricName: '库存量', currentValue: 150, unit: '台', periodChange: -5.2 },
    { metricName: '周转率', currentValue: 1.87, unit: '次', periodChange: 0.3 }
  ];

  const trendData = [
    { period: '第1周', value: 62 },
    { period: '第2周', value: 75 },
    { period: '第3周', value: 68 },
    { period: '第4周', value: 75 },
  ];

  return (
    <div className="module-layout">
      <div className="module-section">
        <h2 className="section-title">二手机业务指标</h2>
        <div className="kpi-grid">
          {secondhandData.map((item, index) => (
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
        <h2 className="section-title">二手机销售趋势</h2>
        <div className="simple-bar-chart">
          <div className="bar-chart-header">
            <h4 className="bar-chart-title">近30天二手机销售趋势</h4>
            <span className="bar-chart-unit">单位: 台</span>
          </div>
          <div className="bar-chart-bars">
            {trendData.map((item, index) => (
              <div key={index} className="bar-item">
                <div className="bar-label">{item.period}</div>
                <div className="bar-container">
                  <div 
                    className="bar-fill magenta"
                    style={{ width: `${(item.value / 75) * 100}%` }}
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
