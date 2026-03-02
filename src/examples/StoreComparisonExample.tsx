/**
 * StoreComparison Component Example
 * 
 * Demonstrates usage of the StoreComparison component with sample data
 */

import React, { useState } from 'react';
import { StoreComparison } from '../components/StoreComparison';
import { ComparisonResult, StoreMetricValue, StoreRanking, StoreType, StoreLevel } from '../types';

/**
 * Generate sample comparison data for demonstration
 */
function generateSampleComparison(metricId: string): ComparisonResult {
  const stores: StoreMetricValue[] = [
    {
      storeId: 'store-001',
      storeName: '北京旗舰店',
      storeType: StoreType.FLAGSHIP,
      storeLevel: StoreLevel.A,
      value: 150000,
      target: 140000,
      deviation: 10000,
    },
    {
      storeId: 'store-002',
      storeName: '上海中心店',
      storeType: StoreType.FLAGSHIP,
      storeLevel: StoreLevel.A,
      value: 145000,
      target: 140000,
      deviation: 5000,
    },
    {
      storeId: 'store-003',
      storeName: '深圳标准店',
      storeType: StoreType.STANDARD,
      storeLevel: StoreLevel.B,
      value: 120000,
      target: 110000,
      deviation: 10000,
    },
    {
      storeId: 'store-004',
      storeName: '广州标准店',
      storeType: StoreType.STANDARD,
      storeLevel: StoreLevel.B,
      value: 115000,
      target: 110000,
      deviation: 5000,
    },
    {
      storeId: 'store-005',
      storeName: '成都标准店',
      storeType: StoreType.STANDARD,
      storeLevel: StoreLevel.C,
      value: 95000,
      target: 90000,
      deviation: 5000,
    },
    {
      storeId: 'store-006',
      storeName: '杭州迷你店',
      storeType: StoreType.MINI,
      storeLevel: StoreLevel.C,
      value: 75000,
      target: 70000,
      deviation: 5000,
    },
    {
      storeId: 'store-007',
      storeName: '南京迷你店',
      storeType: StoreType.MINI,
      storeLevel: StoreLevel.D,
      value: 65000,
      target: 70000,
      deviation: -5000,
    },
    {
      storeId: 'store-008',
      storeName: '武汉标准店',
      storeType: StoreType.STANDARD,
      storeLevel: StoreLevel.B,
      value: 110000,
      target: 110000,
      deviation: 0,
    },
  ];

  // Sort by value to create rankings
  const sortedStores = [...stores].sort((a, b) => (b.value || 0) - (a.value || 0));
  const ranking: StoreRanking[] = sortedStores.map((store, index) => ({
    storeId: store.storeId,
    rank: index + 1,
    value: store.value || 0,
  }));

  // Calculate statistics
  const validValues = stores.map(s => s.value).filter((v): v is number => v !== null);
  const average = validValues.reduce((sum, v) => sum + v, 0) / validValues.length;
  const sortedValues = [...validValues].sort((a, b) => a - b);
  const median = sortedValues[Math.floor(sortedValues.length / 2)];

  return {
    comparisonId: `comp-${metricId}-${Date.now()}`,
    metricId,
    stores,
    ranking,
    average,
    median,
    timestamp: new Date(),
  };
}

/**
 * Example metrics for comparison
 */
const exampleMetrics = [
  { id: 'gross_profit', name: '毛利', unit: '元' },
  { id: 'net_profit', name: '净利润', unit: '元' },
  { id: 'gross_profit_margin', name: '毛利率', unit: '%' },
  { id: 'conversion_rate', name: '成交率', unit: '%' },
  { id: 'output_per_employee', name: '人均产出', unit: '元' },
];

/**
 * StoreComparisonExample Component
 */
export const StoreComparisonExample: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState(exampleMetrics[0]);
  const [comparisonData, setComparisonData] = useState<ComparisonResult>(
    generateSampleComparison(exampleMetrics[0].id)
  );

  const handleMetricChange = (metricId: string) => {
    const metric = exampleMetrics.find(m => m.id === metricId);
    if (metric) {
      setSelectedMetric(metric);
      setComparisonData(generateSampleComparison(metric.id));
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '24px', color: '#262626' }}>
          门店对比示例
        </h1>

        {/* Metric Selector */}
        <div style={{ 
          marginBottom: '24px', 
          padding: '16px', 
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <label 
            htmlFor="metric-select" 
            style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: 600,
              color: '#262626'
            }}
          >
            选择对比指标:
          </label>
          <select
            id="metric-select"
            value={selectedMetric.id}
            onChange={(e) => handleMetricChange(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '14px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
            }}
          >
            {exampleMetrics.map(metric => (
              <option key={metric.id} value={metric.id}>
                {metric.name} ({metric.unit})
              </option>
            ))}
          </select>
        </div>

        {/* StoreComparison Component */}
        <StoreComparison
          comparisonResult={comparisonData}
          metricName={selectedMetric.name}
          unit={selectedMetric.unit}
          height={450}
        />

        {/* Usage Instructions */}
        <div style={{
          marginTop: '32px',
          padding: '24px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ marginTop: 0, color: '#262626' }}>使用说明</h2>
          <ul style={{ color: '#595959', lineHeight: '1.8' }}>
            <li>选择不同的指标查看各门店的对比情况</li>
            <li>图表使用颜色编码显示排名：绿色(第1名)、蓝色(第2名)、橙色(第3名)、红色(末位)</li>
            <li>统计卡片显示平均值、中位数、最高值和最低值</li>
            <li>排名表格显示详细的门店信息、实际值、目标值和偏差</li>
            <li>偏差为正值(绿色)表示超过目标，负值(红色)表示未达标</li>
          </ul>

          <h3 style={{ color: '#262626' }}>组件特性</h3>
          <ul style={{ color: '#595959', lineHeight: '1.8' }}>
            <li><strong>响应式设计</strong>: 自动适配不同屏幕尺寸</li>
            <li><strong>交互式图表</strong>: 鼠标悬停显示详细数据</li>
            <li><strong>智能排序</strong>: 自动按性能排名排序</li>
            <li><strong>空值处理</strong>: 优雅处理缺失数据，显示为 "N/A"</li>
            <li><strong>数值格式化</strong>: 自动添加千位分隔符，大数字使用万为单位</li>
          </ul>

          <h3 style={{ color: '#262626' }}>代码示例</h3>
          <pre style={{
            backgroundColor: '#f5f5f5',
            padding: '16px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '13px',
            lineHeight: '1.6'
          }}>
{`import { StoreComparison } from './components/StoreComparison';

<StoreComparison
  comparisonResult={comparisonData}
  metricName="毛利"
  unit="元"
  height={400}
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default StoreComparisonExample;
