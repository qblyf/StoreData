# TrendLineChart Component

折线图组件，用于显示指标随时间变化的趋势。

## 功能特性

- ✅ 使用 Recharts 库实现
- ✅ 显示指标随时间变化趋势
- ✅ 支持多条线对比（实际值 vs 目标值）
- ✅ 支持时间粒度切换（日、周、月）
- ✅ 响应式设计，适配不同屏幕尺寸
- ✅ 交互式工具提示
- ✅ 自定义图表高度
- ✅ 处理空值和缺失数据

## 使用方法

### 基本用法

```tsx
import { TrendLineChart } from './components/TrendLineChart';
import { TimeGranularity } from './types';

const data = [
  {
    timestamp: new Date('2024-01-01'),
    actual: 50000,
    target: 45000,
    label: '01-01',
  },
  {
    timestamp: new Date('2024-01-02'),
    actual: 52000,
    target: 45000,
    label: '01-02',
  },
];

function MyComponent() {
  return (
    <TrendLineChart
      title="毛利趋势"
      data={data}
      unit="元"
      granularity={TimeGranularity.DAY}
    />
  );
}
```

### 带时间粒度切换

```tsx
import { useState } from 'react';
import { TrendLineChart } from './components/TrendLineChart';
import { TimeGranularity } from './types';

function MyComponent() {
  const [granularity, setGranularity] = useState(TimeGranularity.DAY);

  return (
    <TrendLineChart
      title="毛利趋势"
      data={data}
      unit="元"
      granularity={granularity}
      onGranularityChange={setGranularity}
    />
  );
}
```

### 使用 Mock 数据生成器

```tsx
import { useState, useEffect } from 'react';
import { TrendLineChart } from './components/TrendLineChart';
import { TimeGranularity } from './types';
import { generateTimeSeriesData } from './data/mockDataGenerator';
import { convertToTrendData } from './utils/chartHelpers';

function MyComponent() {
  const [granularity, setGranularity] = useState(TimeGranularity.DAY);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    // 生成最近30天的数据
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const metricValues = generateTimeSeriesData(
      'store1',
      startDate,
      endDate,
      TimeGranularity.DAY
    );

    const chartData = convertToTrendData(
      metricValues,
      'gross_profit',
      granularity
    );

    setTrendData(chartData);
  }, [granularity]);

  return (
    <TrendLineChart
      title="毛利趋势"
      data={trendData}
      unit="元"
      granularity={granularity}
      onGranularityChange={setGranularity}
    />
  );
}
```

## Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `title` | `string` | 是 | - | 图表标题 |
| `data` | `TrendChartDataPoint[]` | 是 | - | 趋势数据点数组 |
| `unit` | `string` | 是 | - | 指标单位（如 '元', '%', '人'） |
| `granularity` | `TimeGranularity` | 是 | - | 当前时间粒度 |
| `onGranularityChange` | `(granularity: TimeGranularity) => void` | 否 | - | 时间粒度变化回调 |
| `height` | `number` | 否 | `400` | 图表高度（像素） |
| `showTarget` | `boolean` | 否 | `true` | 是否显示目标线 |

## 数据格式

### TrendChartDataPoint

```typescript
interface TrendChartDataPoint {
  timestamp: Date;        // 时间戳
  actual: number | null;  // 实际值
  target?: number | null; // 目标值（可选）
  label: string;          // 显示标签
}
```

## 工具函数

### formatDateLabel

根据时间粒度格式化日期标签：

```typescript
import { formatDateLabel } from './utils/chartHelpers';
import { TimeGranularity } from './types';

const label = formatDateLabel(new Date('2024-01-15'), TimeGranularity.DAY);
// 返回: "01-15"
```

### convertToTrendData

将 MetricValue 数组转换为 TrendChartDataPoint 数组：

```typescript
import { convertToTrendData } from './utils/chartHelpers';
import { TimeGranularity } from './types';

const trendData = convertToTrendData(
  metricValues,
  'gross_profit',
  TimeGranularity.DAY
);
```

### aggregateByGranularity

按时间粒度聚合指标数据：

```typescript
import { aggregateByGranularity } from './utils/chartHelpers';
import { TimeGranularity } from './types';

const aggregated = aggregateByGranularity(
  metricValues,
  'gross_profit',
  TimeGranularity.WEEK
);
```

## 样式定制

组件使用 CSS 类名，可以通过覆盖样式进行定制：

```css
/* 修改图表容器样式 */
.trend-line-chart {
  background: #f5f5f5;
  border-radius: 12px;
}

/* 修改标题样式 */
.chart-title {
  color: #1890ff;
  font-size: 20px;
}

/* 修改粒度按钮样式 */
.granularity-btn.active {
  background: #52c41a;
  border-color: #52c41a;
}
```

## 注意事项

1. **空值处理**: 组件会正确处理 `null` 值，在图表中显示为断点
2. **目标线**: 只有当数据中包含目标值且 `showTarget` 为 `true` 时才显示目标线
3. **响应式**: 图表会自动适应容器宽度，建议在外层容器设置合适的宽度
4. **性能**: 对于大量数据点（>100个），建议使用 `aggregateByGranularity` 进行聚合

## 相关需求

- Requirements 5.6: 支持按时间周期（日、周、月）汇总利润指标
- Requirements 10.3: 支持按时间周期设置目标值

## 测试

组件包含完整的单元测试，覆盖以下场景：

- 基本渲染
- 时间粒度切换
- 空数据处理
- 空值处理
- 目标线显示/隐藏
- 自定义高度
- 不同单位格式化

运行测试：

```bash
npm test -- TrendLineChart.test.tsx
```
