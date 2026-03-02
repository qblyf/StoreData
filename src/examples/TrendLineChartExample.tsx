/**
 * TrendLineChart Usage Example
 * 
 * Demonstrates how to use the TrendLineChart component with mock data
 */

import React, { useState, useEffect } from 'react';
import { TrendLineChart } from '../components/TrendLineChart';
import { TimeGranularity } from '../types';
import { generateTimeSeriesData } from '../data/mockDataGenerator';
import { convertToTrendData } from '../utils/chartHelpers';

/**
 * Example component showing TrendLineChart usage
 */
export const TrendLineChartExample: React.FC = () => {
  const [granularity, setGranularity] = useState<TimeGranularity>(TimeGranularity.DAY);
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    // Generate time series data for the last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    // Generate data for store1
    const metricValues = generateTimeSeriesData(
      'store1',
      startDate,
      endDate,
      TimeGranularity.DAY
    );

    // Convert to trend chart data for gross profit metric
    const chartData = convertToTrendData(
      metricValues,
      'gross_profit',
      granularity
    );

    setTrendData(chartData);
  }, [granularity]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>趋势图表示例</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <TrendLineChart
          title="毛利趋势"
          data={trendData}
          unit="元"
          granularity={granularity}
          onGranularityChange={setGranularity}
          height={400}
          showTarget={true}
        />
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>使用说明</h3>
        <ul>
          <li>点击"日"、"周"、"月"按钮切换时间粒度</li>
          <li>鼠标悬停在图表上查看详细数据</li>
          <li>蓝色实线表示实际值，绿色虚线表示目标值</li>
          <li>支持显示多条线进行对比</li>
        </ul>
      </div>
    </div>
  );
};
