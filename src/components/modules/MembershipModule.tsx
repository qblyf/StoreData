/**
 * Membership Module - 付费会员分析
 */

import React from 'react';
import { KPICard } from '../KPICard';
import './ModuleLayout.css';
import './SharedCharts.css';

export const MembershipModule: React.FC = () => {
  const memberData = [
    { metricName: '会员总数', currentValue: 12580, unit: '人', periodChange: 15.3 },
    { metricName: '新增会员', currentValue: 580, unit: '人', periodChange: 8.5 },
    { metricName: '会员转化率', currentValue: 12.5, unit: '%', periodChange: 2.1 },
    { metricName: '会员留存率', currentValue: 85.3, unit: '%', periodChange: 1.8 }
  ];

  const trendData = [
    { period: '第1周', value: 120 },
    { period: '第2周', value: 145 },
    { period: '第3周', value: 138 },
    { period: '第4周', value: 177 },
  ];

  return (
    <div className="module-layout">
      <div className="module-section">
        <h2 className="section-title">会员核心指标</h2>
        <div className="kpi-grid">
          {memberData.map((item, index) => (
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
        <h2 className="section-title">会员增长趋势</h2>
        <div className="simple-bar-chart">
          <div className="bar-chart-header">
            <h4 className="bar-chart-title">近30天会员增长趋势</h4>
            <span className="bar-chart-unit">单位: 人</span>
          </div>
          <div className="bar-chart-bars">
            {trendData.map((item, index) => (
              <div key={index} className="bar-item">
                <div className="bar-label">{item.period}</div>
                <div className="bar-container">
                  <div 
                    className="bar-fill purple"
                    style={{ width: `${(item.value / 177) * 100}%` }}
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
