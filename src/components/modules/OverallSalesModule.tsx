/**
 * Overall Sales Module - 业务概览
 */

import React from 'react';
import { TrendLineChart } from '../TrendLineChart';
import { BarChart } from '../BarChart';
import { KPICard } from '../KPICard';
import { BusinessGrossProfitFlow } from '../BusinessGrossProfitFlow';
import { TimeGranularity } from '../../types';
import './ModuleLayout.css';

export const OverallSalesModule: React.FC = () => {
  const kpiData = [
    { metricName: '总销售额', currentValue: 1250000, unit: '元', periodChange: 12.5, targetValue: 1200000, targetCompletion: 104.2 },
    { metricName: '销售订单数', currentValue: 3580, unit: '单', periodChange: 8.3, targetValue: 3500, targetCompletion: 102.3 },
    { metricName: '客单价', currentValue: 349, unit: '元', periodChange: 3.8, targetValue: 340, targetCompletion: 102.6 },
    { metricName: '同比增长', currentValue: 15.2, unit: '%', periodChange: 2.1 }
  ];

  const trafficKpiData = [
    { metricName: '总客流量', currentValue: 8650, unit: '人', periodChange: 6.8, targetValue: 8500, targetCompletion: 101.8 },
    { metricName: '进店客流', currentValue: 5420, unit: '人', periodChange: 5.2, targetValue: 5300, targetCompletion: 102.3 },
    { metricName: '成交客流', currentValue: 3580, unit: '人', periodChange: 8.3, targetValue: 3500, targetCompletion: 102.3 },
    { metricName: '转化率', currentValue: 66.1, unit: '%', periodChange: 2.9, targetValue: 65.0, targetCompletion: 101.7 }
  ];

  return (
    <div className="module-layout">
      <div className="module-section">
        <h2 className="section-title">销售核心指标</h2>
        <div className="kpi-grid">
          {kpiData.map((kpi, index) => (
            <KPICard
              key={index}
              metricName={kpi.metricName}
              currentValue={kpi.currentValue}
              unit={kpi.unit}
              periodChange={kpi.periodChange}
              targetValue={kpi.targetValue}
              targetCompletion={kpi.targetCompletion}
            />
          ))}
        </div>
      </div>

      <div className="module-section">
        <h2 className="section-title">客流核心指标</h2>
        <div className="kpi-grid">
          {trafficKpiData.map((kpi, index) => (
            <KPICard
              key={index}
              metricName={kpi.metricName}
              currentValue={kpi.currentValue}
              unit={kpi.unit}
              periodChange={kpi.periodChange}
              targetValue={kpi.targetValue}
              targetCompletion={kpi.targetCompletion}
            />
          ))}
        </div>
      </div>

      <div className="module-section">
        <BusinessGrossProfitFlow
          mainBusinessGrossProfit={62104}
          operatorCommission={11465}
          accessoriesGrossProfit={7644}
          smartProductsGrossProfit={5733}
          insuranceGrossProfit={3822}
          secondhandGrossProfit={2866}
          membershipGrossProfit={1911}
          totalGrossProfit={95545}
          totalGrossProfitTarget={100000}
        />
      </div>

      <div className="module-section">
        <h2 className="section-title">销售趋势</h2>
        <TrendLineChart
          title="近30天销售趋势"
          data={[]}
          unit="元"
          granularity={TimeGranularity.DAY}
          height={300}
        />
      </div>

      <div className="module-section">
        <h2 className="section-title">销售对比</h2>
        <BarChart
          title="各门店销售对比"
          data={[]}
          unit="元"
          height={300}
        />
      </div>
    </div>
  );
};
