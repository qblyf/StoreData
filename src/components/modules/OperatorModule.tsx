/**
 * Operator Module - 运营商分析
 */

import React from 'react';
import { KPICard } from '../KPICard';
import './ModuleLayout.css';
import './SharedCharts.css';

export const OperatorModule: React.FC = () => {
  const operatorData = [
    { metricName: '中国移动', currentValue: 450, unit: '单', periodChange: 8.5 },
    { metricName: '中国联通', currentValue: 320, unit: '单', periodChange: 5.2 },
    { metricName: '中国电信', currentValue: 280, unit: '单', periodChange: 3.8 }
  ];

  const comparisonData = [
    { name: '中国移动', value: 450, color: 'primary' },
    { name: '中国联通', value: 320, color: 'info' },
    { name: '中国电信', value: 280, color: 'success' },
  ];

  return (
    <div className="module-layout">
      <div className="module-section">
        <h2 className="section-title">运营商业务量</h2>
        <div className="kpi-grid">
          {operatorData.map((op, index) => (
            <KPICard
              key={index}
              metricName={op.metricName}
              currentValue={op.currentValue}
              unit={op.unit}
              periodChange={op.periodChange}
            />
          ))}
        </div>
      </div>

      <div className="module-section">
        <h2 className="section-title">运营商业务对比</h2>
        <div className="simple-bar-chart">
          <div className="bar-chart-header">
            <h4 className="bar-chart-title">各运营商业务量对比</h4>
            <span className="bar-chart-unit">单位: 单</span>
          </div>
          <div className="bar-chart-bars">
            {comparisonData.map((item, index) => (
              <div key={index} className="bar-item">
                <div className="bar-label">{item.name}</div>
                <div className="bar-container">
                  <div 
                    className={`bar-fill ${item.color}`}
                    style={{ width: `${(item.value / 450) * 100}%` }}
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
