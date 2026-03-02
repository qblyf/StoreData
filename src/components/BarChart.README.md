# BarChart Component

## Overview

The `BarChart` component displays bar charts for comparing metrics across multiple stores. It supports both vertical and horizontal orientations, data labels, and target value comparisons.

## Features

- **Multi-store comparison**: Display metrics for multiple stores side by side
- **Dual orientation**: Support both vertical and horizontal bar layouts
- **Data labels**: Optional display of values directly on bars
- **Target comparison**: Show target values alongside actual values
- **Custom colors**: Support for custom bar colors per data point
- **Interactive tooltips**: Hover to see detailed information
- **Responsive design**: Adapts to different screen sizes

## Usage

### Basic Example

```tsx
import { BarChart } from './components/BarChart';

const data = [
  { label: '北京旗舰店', value: 45230 },
  { label: '上海标准店', value: 38500 },
  { label: '广州迷你店', value: 28900 },
];

<BarChart
  title="门店毛利对比"
  data={data}
  unit="元"
/>
```

### With Target Values

```tsx
const dataWithTargets = [
  { label: '北京旗舰店', value: 45230, target: 40000 },
  { label: '上海标准店', value: 38500, target: 42000 },
  { label: '广州迷你店', value: 28900, target: 30000 },
];

<BarChart
  title="门店毛利对比（含目标）"
  data={dataWithTargets}
  unit="元"
  showTarget={true}
/>
```

### Horizontal Orientation

```tsx
<BarChart
  title="门店成交率对比"
  data={data}
  unit="%"
  orientation="horizontal"
  height={300}
/>
```

### Custom Colors

```tsx
const dataWithColors = [
  { label: '北京旗舰店', value: 45230, color: '#1890ff' },
  { label: '上海标准店', value: 38500, color: '#52c41a' },
  { label: '广州迷你店', value: 28900, color: '#faad14' },
];

<BarChart
  title="门店毛利对比（自定义颜色）"
  data={dataWithColors}
  unit="元"
/>
```

### Without Data Labels

```tsx
<BarChart
  title="门店对比"
  data={data}
  unit="元"
  showDataLabels={false}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Required | Chart title |
| `data` | `BarChartDataPoint[]` | Required | Array of data points to display |
| `unit` | `string` | Required | Metric unit (e.g., '元', '%', '人') |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Chart orientation |
| `height` | `number` | `400` | Chart height in pixels |
| `showDataLabels` | `boolean` | `true` | Whether to show data labels on bars |
| `showTarget` | `boolean` | `true` | Whether to show target values |
| `barColor` | `string` | `'#1890ff'` | Default color for bars |
| `targetColor` | `string` | `'#52c41a'` | Color for target bars |

## Data Structure

### BarChartDataPoint

```typescript
interface BarChartDataPoint {
  label: string;        // Store name or category label
  value: number | null; // Actual value (null displays as N/A)
  target?: number | null; // Optional target value
  color?: string;       // Optional custom color for the bar
}
```

## Styling

The component uses CSS classes that can be customized:

- `.bar-chart` - Main container
- `.chart-header` - Header section
- `.chart-title` - Title text
- `.bar-chart-tooltip` - Tooltip container
- `.tooltip-label` - Tooltip label
- `.tooltip-item` - Tooltip item
- `.tooltip-name` - Tooltip metric name
- `.tooltip-value` - Tooltip metric value

## Responsive Behavior

- **Desktop (> 768px)**: Full-size chart with all features
- **Tablet (768px - 480px)**: Adjusted padding and font sizes
- **Mobile (< 480px)**: Compact layout with smaller fonts

## Value Formatting

- Numbers >= 10,000 are displayed as "X.X万" (e.g., "4.5万元")
- Numbers < 10,000 are displayed with thousand separators (e.g., "4,523元")
- Null values are displayed as "N/A"
- Decimal places are automatically adjusted (0-2 digits)

## Examples

### Store Comparison Dashboard

```tsx
import { BarChart } from './components/BarChart';

function StoreComparisonDashboard() {
  const grossProfitData = [
    { label: '北京旗舰店', value: 45230, target: 40000 },
    { label: '上海标准店', value: 38500, target: 42000 },
    { label: '广州迷你店', value: 28900, target: 30000 },
    { label: '深圳标准店', value: 41200, target: 38000 },
  ];

  const conversionRateData = [
    { label: '北京旗舰店', value: 28.5, target: 30 },
    { label: '上海标准店', value: 32.1, target: 30 },
    { label: '广州迷你店', value: 25.8, target: 28 },
    { label: '深圳标准店', value: 29.7, target: 30 },
  ];

  return (
    <div>
      <BarChart
        title="门店毛利对比"
        data={grossProfitData}
        unit="元"
        height={400}
      />
      
      <BarChart
        title="门店成交率对比"
        data={conversionRateData}
        unit="%"
        orientation="horizontal"
        height={300}
      />
    </div>
  );
}
```

## Accessibility

- Semantic HTML structure
- Keyboard navigation support (via Recharts)
- Screen reader friendly tooltips
- High contrast colors for better visibility

## Performance

- Optimized for up to 20 data points
- Efficient re-rendering with React.memo (if needed)
- Responsive container for smooth resizing

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)
