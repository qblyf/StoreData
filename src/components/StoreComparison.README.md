# StoreComparison Component

## Overview

The `StoreComparison` component displays side-by-side comparison of key metrics across multiple stores. It provides visual and tabular representations of store performance with rankings, averages, and deviation analysis.

## Features

- **Comparison Bar Chart**: Horizontal bar chart showing metric values across stores
- **Statistics Summary**: Display of average, median, maximum, and minimum values
- **Ranking Table**: Detailed table with store rankings and performance metrics
- **Color-Coded Rankings**: Visual indicators for top, middle, and bottom performers
- **Deviation Analysis**: Shows how each store deviates from target values
- **Responsive Design**: Adapts to different screen sizes

## Usage

```tsx
import { StoreComparison } from './components/StoreComparison';
import { ComparisonResult } from './types';

function MyComponent() {
  const comparisonResult: ComparisonResult = {
    comparisonId: 'comp-001',
    metricId: 'gross_profit',
    stores: [
      {
        storeId: 'store-001',
        storeName: '北京旗舰店',
        storeType: 'flagship',
        storeLevel: 'A',
        value: 150000,
        target: 140000,
        deviation: 10000,
      },
      // ... more stores
    ],
    ranking: [
      { storeId: 'store-001', rank: 1, value: 150000 },
      // ... more rankings
    ],
    average: 120000,
    median: 115000,
    timestamp: new Date(),
  };

  return (
    <StoreComparison
      comparisonResult={comparisonResult}
      metricName="毛利"
      unit="元"
      height={400}
    />
  );
}
```

## Props

### `comparisonResult` (required)
- Type: `ComparisonResult`
- Description: The comparison data containing store metrics, rankings, and statistics

### `metricName` (required)
- Type: `string`
- Description: Display name of the metric being compared

### `unit` (required)
- Type: `string`
- Description: Unit of measurement (e.g., '元', '%', '人')

### `height` (optional)
- Type: `number`
- Default: `400`
- Description: Height of the bar chart in pixels

## Data Structure

### ComparisonResult

```typescript
interface ComparisonResult {
  comparisonId: string;        // Unique identifier for this comparison
  metricId: string;            // ID of the metric being compared
  stores: StoreMetricValue[];  // Array of store metric values
  ranking: StoreRanking[];     // Array of store rankings
  average: number;             // Average value across all stores
  median: number;              // Median value across all stores
  timestamp: Date;             // Timestamp of the comparison
}
```

### StoreMetricValue

```typescript
interface StoreMetricValue {
  storeId: string;             // Store identifier
  storeName: string;           // Store display name
  storeType: StoreType;        // Store type (flagship, standard, mini)
  storeLevel: StoreLevel;      // Store level (A, B, C, D)
  value: number | null;        // Actual metric value
  target?: number;             // Target value (optional)
  deviation?: number;          // Deviation from target (optional)
}
```

### StoreRanking

```typescript
interface StoreRanking {
  storeId: string;             // Store identifier
  rank: number;                // Ranking position (1 = best)
  value: number;               // Value used for ranking
}
```

## Visual Elements

### Statistics Cards

The component displays four key statistics:
- **Average**: Mean value across all stores
- **Median**: Middle value when stores are sorted
- **Maximum**: Highest performing store value
- **Minimum**: Lowest performing store value

### Color Coding

Rankings are color-coded for quick visual identification:
- **Green (#52c41a)**: Rank 1 (best performer)
- **Blue (#1890ff)**: Rank 2
- **Orange (#faad14)**: Rank 3
- **Red (#ff4d4f)**: Bottom 2 performers
- **Gray (#8c8c8c)**: Middle performers

### Ranking Table

The table displays:
- Rank badge with color coding
- Store name, type, and level
- Actual value vs target value
- Deviation (positive in green, negative in red)

## Styling

The component uses CSS classes for styling:
- `.store-comparison`: Main container
- `.comparison-header`: Title and subtitle section
- `.comparison-stats`: Statistics cards grid
- `.comparison-chart`: Bar chart container
- `.comparison-table`: Ranking table
- `.rank-badge`: Colored rank indicator
- `.deviation-cell`: Deviation value with color coding

## Responsive Behavior

- **Desktop (>768px)**: Full layout with 4-column statistics grid
- **Tablet (768px)**: 2-column statistics grid, scrollable table
- **Mobile (<480px)**: Single column statistics, compact table

## Null Value Handling

The component handles null values gracefully:
- Null values display as "N/A"
- Statistics calculations exclude null values
- Charts and tables show "-" for missing target/deviation values

## Requirements

Based on design document ComparisonResult model:
- Displays multiple store metrics side-by-side
- Shows rankings and average values
- Uses comparison bar charts
- Supports target value comparison
- Calculates and displays deviation from targets

## Dependencies

- React
- BarChart component (for visualization)
- Type definitions from `../types`
- CSS for styling

## Example Use Cases

1. **Financial Comparison**: Compare gross profit, net profit, or revenue across stores
2. **Performance Metrics**: Compare conversion rates, traffic, or sales across locations
3. **Efficiency Analysis**: Compare output per employee or labor ratios
4. **Target Achievement**: Identify which stores are meeting or missing targets
5. **Regional Analysis**: Compare stores within a region or market

## Notes

- The component automatically sorts stores by ranking in the table
- Bar chart colors match the ranking colors for consistency
- All numeric values are formatted with thousand separators for readability
- Large numbers (≥10,000) are abbreviated in chart labels (e.g., "15万元")
- Timestamps are formatted in Chinese locale
