/**
 * BarChart Component Examples
 * 
 * Demonstrates various use cases of the BarChart component
 */

import React, { useState } from 'react';
import { BarChart, BarChartDataPoint } from '../components/BarChart';

/**
 * Example 1: Basic vertical bar chart
 */
export const BasicBarChartExample: React.FC = () => {
  const data: BarChartDataPoint[] = [
    { label: '北京旗舰店', value: 45230 },
    { label: '上海标准店', value: 38500 },
    { label: '广州迷你店', value: 28900 },
    { label: '深圳标准店', value: 41200 },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <BarChart
        title="门店毛利对比"
        data={data}
        unit="元"
      />
    </div>
  );
};

/**
 * Example 2: Bar chart with target values
 */
export const BarChartWithTargetsExample: React.FC = () => {
  const data: BarChartDataPoint[] = [
    { label: '北京旗舰店', value: 45230, target: 40000 },
    { label: '上海标准店', value: 38500, target: 42000 },
    { label: '广州迷你店', value: 28900, target: 30000 },
    { label: '深圳标准店', value: 41200, target: 38000 },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <BarChart
        title="门店毛利对比（含目标）"
        data={data}
        unit="元"
        showTarget={true}
      />
    </div>
  );
};

/**
 * Example 3: Horizontal bar chart
 */
export const HorizontalBarChartExample: React.FC = () => {
  const data: BarChartDataPoint[] = [
    { label: '北京旗舰店', value: 28.5, target: 30 },
    { label: '上海标准店', value: 32.1, target: 30 },
    { label: '广州迷你店', value: 25.8, target: 28 },
    { label: '深圳标准店', value: 29.7, target: 30 },
    { label: '成都标准店', value: 31.2, target: 30 },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <BarChart
        title="门店成交率对比"
        data={data}
        unit="%"
        orientation="horizontal"
        height={350}
      />
    </div>
  );
};

/**
 * Example 4: Bar chart with custom colors
 */
export const CustomColorBarChartExample: React.FC = () => {
  const data: BarChartDataPoint[] = [
    { label: '北京旗舰店', value: 45230, color: '#1890ff' },
    { label: '上海标准店', value: 38500, color: '#52c41a' },
    { label: '广州迷你店', value: 28900, color: '#faad14' },
    { label: '深圳标准店', value: 41200, color: '#13c2c2' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <BarChart
        title="门店毛利对比（自定义颜色）"
        data={data}
        unit="元"
        showDataLabels={true}
      />
    </div>
  );
};

/**
 * Example 5: Bar chart without data labels
 */
export const NoLabelsBarChartExample: React.FC = () => {
  const data: BarChartDataPoint[] = [
    { label: '北京旗舰店', value: 1809 },
    { label: '上海标准店', value: 1654 },
    { label: '广州迷你店', value: 1423 },
    { label: '深圳标准店', value: 1756 },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <BarChart
        title="人工产出对比"
        data={data}
        unit="元/人"
        showDataLabels={false}
      />
    </div>
  );
};

/**
 * Example 6: Bar chart with null values
 */
export const NullValuesBarChartExample: React.FC = () => {
  const data: BarChartDataPoint[] = [
    { label: '北京旗舰店', value: 45230 },
    { label: '上海标准店', value: null }, // No data available
    { label: '广州迷你店', value: 28900 },
    { label: '深圳标准店', value: 41200 },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <BarChart
        title="门店毛利对比（含缺失数据）"
        data={data}
        unit="元"
      />
    </div>
  );
};

/**
 * Example 7: Interactive bar chart with state
 */
export const InteractiveBarChartExample: React.FC = () => {
  const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>('vertical');
  const [showLabels, setShowLabels] = useState(true);
  const [showTarget, setShowTarget] = useState(true);

  const data: BarChartDataPoint[] = [
    { label: '北京旗舰店', value: 45230, target: 40000 },
    { label: '上海标准店', value: 38500, target: 42000 },
    { label: '广州迷你店', value: 28900, target: 30000 },
    { label: '深圳标准店', value: 41200, target: 38000 },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <label style={{ marginRight: '8px' }}>方向:</label>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as 'vertical' | 'horizontal')}
            style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #d9d9d9' }}
          >
            <option value="vertical">垂直</option>
            <option value="horizontal">水平</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
            />
            显示数据标签
          </label>
        </div>
        
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={showTarget}
              onChange={(e) => setShowTarget(e.target.checked)}
            />
            显示目标值
          </label>
        </div>
      </div>

      <BarChart
        title="门店毛利对比（交互式）"
        data={data}
        unit="元"
        orientation={orientation}
        showDataLabels={showLabels}
        showTarget={showTarget}
        height={orientation === 'horizontal' ? 350 : 400}
      />
    </div>
  );
};

/**
 * Example 8: Multiple bar charts comparison
 */
export const MultipleBarChartsExample: React.FC = () => {
  const grossProfitData: BarChartDataPoint[] = [
    { label: '北京旗舰店', value: 45230, target: 40000 },
    { label: '上海标准店', value: 38500, target: 42000 },
    { label: '广州迷你店', value: 28900, target: 30000 },
    { label: '深圳标准店', value: 41200, target: 38000 },
  ];

  const conversionRateData: BarChartDataPoint[] = [
    { label: '北京旗舰店', value: 28.5, target: 30 },
    { label: '上海标准店', value: 32.1, target: 30 },
    { label: '广州迷你店', value: 25.8, target: 28 },
    { label: '深圳标准店', value: 29.7, target: 30 },
  ];

  const outputData: BarChartDataPoint[] = [
    { label: '北京旗舰店', value: 1809 },
    { label: '上海标准店', value: 1654 },
    { label: '广州迷你店', value: 1423 },
    { label: '深圳标准店', value: 1756 },
  ];

  return (
    <div style={{ padding: '20px', display: 'grid', gap: '24px' }}>
      <BarChart
        title="门店毛利对比"
        data={grossProfitData}
        unit="元"
        height={350}
      />
      
      <BarChart
        title="门店成交率对比"
        data={conversionRateData}
        unit="%"
        orientation="horizontal"
        height={300}
      />
      
      <BarChart
        title="人工产出对比"
        data={outputData}
        unit="元/人"
        height={350}
        barColor="#722ed1"
      />
    </div>
  );
};

/**
 * All examples in one component
 */
export const AllBarChartExamples: React.FC = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '40px' }}>BarChart Component Examples</h1>
      
      <section style={{ marginBottom: '60px' }}>
        <h2>1. Basic Bar Chart</h2>
        <BasicBarChartExample />
      </section>
      
      <section style={{ marginBottom: '60px' }}>
        <h2>2. Bar Chart with Targets</h2>
        <BarChartWithTargetsExample />
      </section>
      
      <section style={{ marginBottom: '60px' }}>
        <h2>3. Horizontal Bar Chart</h2>
        <HorizontalBarChartExample />
      </section>
      
      <section style={{ marginBottom: '60px' }}>
        <h2>4. Custom Colors</h2>
        <CustomColorBarChartExample />
      </section>
      
      <section style={{ marginBottom: '60px' }}>
        <h2>5. Without Data Labels</h2>
        <NoLabelsBarChartExample />
      </section>
      
      <section style={{ marginBottom: '60px' }}>
        <h2>6. With Null Values</h2>
        <NullValuesBarChartExample />
      </section>
      
      <section style={{ marginBottom: '60px' }}>
        <h2>7. Interactive Controls</h2>
        <InteractiveBarChartExample />
      </section>
      
      <section style={{ marginBottom: '60px' }}>
        <h2>8. Multiple Charts</h2>
        <MultipleBarChartsExample />
      </section>
    </div>
  );
};
