/**
 * Repair Module - 维修分析
 */

import React from 'react';
import { KPICard } from '../KPICard';
import './ModuleLayout.css';
import './SharedCharts.css';

export const RepairModule: React.FC = () => {
  const repairData = [
    { metricName: '维修单量', currentValue: 450, unit: '单', periodChange: 8.5 },
    { metricName: '维修收入', currentValue: 68000, unit: '元', periodChange: 12.3 },
    { metricName: '平均维修价', currentValue: 151, unit: '元', periodChange: 3.5 },
    { metricName: '客户满意度', currentValue: 92.5, unit: '%', periodChange: 1.8 }
  ];

  const trendData = [
    { period: '第1周', value: 98 },
    { period: '第2周', value: 115 },
    { period: '第3周', value: 108 },
    { period: '第4周', value: 129 },
  ];

  return (
    <div className="module-layout">
      <div className="module-section">
        <h2 className="section-title">维修业务指标</h2>
        <div className="kpi-grid">
          {repairData.map((item, index) => (
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
        <h2 className="section-title">维修量趋势</h2>
        <div className="simple-bar-chart">
          <div className="bar-chart-header">
            <h4 className="bar-chart-title">近30天维修量趋势</h4>
            <span className="bar-chart-unit">单位: 单</span>
          </div>
          <div className="bar-chart-bars">
            {trendData.map((item, index) => (
              <div key={index} className="bar-item">
                <div className="bar-label">{item.period}</div>
                <div className="bar-container">
                  <div 
                    className="bar-fill warning"
                    style={{ width: `${(item.value / 129) * 100}%` }}
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
