# MetricAggregator Service

## Overview

The `MetricAggregator` service provides functionality to aggregate metric data by different dimensions (store type and store level) and calculate statistical measures like average, median, min, max, sum, and count.

**Requirements**: 9.4, 9.5

## Features

- Aggregate metrics by store type (Flagship, Standard, Mini)
- Aggregate metrics by store level (A, B, C, D)
- Calculate statistical measures: average, median, min, max, sum, count
- Support time range filtering
- Handle null values gracefully
- Batch aggregation for all types/levels

## Usage

### Basic Usage

```typescript
import { metricAggregator } from './services';
import { StoreType, StoreLevel, MetricValue } from './types';

// Sample metric values
const metricValues: MetricValue[] = [
  {
    metricId: 'gross_profit',
    storeId: 'store-001',
    value: 50000,
    unit: 'yuan',
    timestamp: new Date('2024-01-15'),
  },
  // ... more values
];

// Aggregate by store type
const flagshipResult = metricAggregator.aggregateByStoreType(
  StoreType.FLAGSHIP,
  'gross_profit',
  metricValues
);

console.log(flagshipResult);
// {
//   metricId: 'gross_profit',
//   dimension: 'storeType',
//   dimensionValue: 'flagship',
//   average: 49000,
//   median: 49000,
//   min: 48000,
//   max: 50000,
//   count: 2,
//   sum: 98000,
//   timestamp: Date
// }
```

### Aggregate by Store Level

```typescript
// Aggregate by store level
const levelAResult = metricAggregator.aggregateByStoreLevel(
  StoreLevel.A,
  'gross_profit',
  metricValues
);

console.log(levelAResult);
// {
//   metricId: 'gross_profit',
//   dimension: 'storeLevel',
//   dimensionValue: 'A',
//   average: 49000,
//   median: 49000,
//   min: 48000,
//   max: 50000,
//   count: 2,
//   sum: 98000,
//   timestamp: Date
// }
```

### Time Range Filtering

```typescript
// Aggregate with time range filter
const result = metricAggregator.aggregateByStoreType(
  StoreType.FLAGSHIP,
  'gross_profit',
  metricValues,
  {
    start: new Date('2024-01-01'),
    end: new Date('2024-01-31'),
  }
);
```

### Batch Aggregation

```typescript
// Aggregate for all store types at once
const allTypeResults = metricAggregator.aggregateAllStoreTypes(
  'gross_profit',
  metricValues
);

// Returns array with results for Flagship, Standard, and Mini stores
console.log(allTypeResults.length); // 3

// Aggregate for all store levels at once
const allLevelResults = metricAggregator.aggregateAllStoreLevels(
  'gross_profit',
  metricValues
);

// Returns array with results for A, B, C, and D levels
console.log(allLevelResults.length); // 4
```

## API Reference

### `aggregateByStoreType(storeType, metricId, metricValues, timeRange?)`

Aggregates metrics for stores of a specific type.

**Parameters:**
- `storeType` (StoreType): The store type to aggregate by (FLAGSHIP, STANDARD, MINI)
- `metricId` (string): The metric ID to aggregate
- `metricValues` (MetricValue[]): Array of metric values
- `timeRange` (TimeRange, optional): Time range filter

**Returns:** `AggregationResult`

### `aggregateByStoreLevel(storeLevel, metricId, metricValues, timeRange?)`

Aggregates metrics for stores of a specific level.

**Parameters:**
- `storeLevel` (StoreLevel): The store level to aggregate by (A, B, C, D)
- `metricId` (string): The metric ID to aggregate
- `metricValues` (MetricValue[]): Array of metric values
- `timeRange` (TimeRange, optional): Time range filter

**Returns:** `AggregationResult`

### `aggregateAllStoreTypes(metricId, metricValues, timeRange?)`

Aggregates metrics for all store types.

**Parameters:**
- `metricId` (string): The metric ID to aggregate
- `metricValues` (MetricValue[]): Array of metric values
- `timeRange` (TimeRange, optional): Time range filter

**Returns:** `AggregationResult[]` (one per store type)

### `aggregateAllStoreLevels(metricId, metricValues, timeRange?)`

Aggregates metrics for all store levels.

**Parameters:**
- `metricId` (string): The metric ID to aggregate
- `metricValues` (MetricValue[]): Array of metric values
- `timeRange` (TimeRange, optional): Time range filter

**Returns:** `AggregationResult[]` (one per store level)

## Data Types

### AggregationResult

```typescript
interface AggregationResult {
  metricId: string;        // The metric being aggregated
  dimension: string;       // 'storeType' or 'storeLevel'
  dimensionValue: string;  // The specific type/level value
  average: number;         // Mean value
  median: number;          // Median value
  min: number;             // Minimum value
  max: number;             // Maximum value
  count: number;           // Number of values
  sum: number;             // Sum of all values
  timestamp: Date;         // When aggregation was performed
}
```

## Statistical Calculations

### Average
The arithmetic mean of all values:
```
average = sum / count
```

### Median
The middle value when sorted:
- For odd count: the middle value
- For even count: average of two middle values

### Min/Max
The smallest and largest values in the dataset.

### Sum
The total of all values.

### Count
The number of non-null values included in the aggregation.

## Null Value Handling

The service automatically filters out `null` values before calculating statistics. This ensures that:
- Stores with missing data don't skew the results
- Statistical calculations remain accurate
- Empty result sets return zero values for all statistics

## Edge Cases

### Empty Result Set
When no matching stores or values are found:
```typescript
{
  average: 0,
  median: 0,
  min: 0,
  max: 0,
  count: 0,
  sum: 0
}
```

### Single Value
When only one value exists:
```typescript
{
  average: value,
  median: value,
  min: value,
  max: value,
  count: 1,
  sum: value
}
```

### All Null Values
When all values are null, treated as empty result set.

## Integration with Store Data

The service uses the `mockStores` data to determine which stores belong to each type/level. This ensures:
- Accurate grouping of stores
- Consistent results across aggregations
- Easy maintenance when store data changes

## Performance Considerations

- **Filtering**: Values are filtered by store ID, metric ID, and optionally time range
- **Sorting**: Median calculation requires sorting, O(n log n) complexity
- **Memory**: Creates sorted copy for median calculation
- **Batch Operations**: Use `aggregateAllStoreTypes` or `aggregateAllStoreLevels` for efficiency when aggregating multiple dimensions

## Testing

The service includes comprehensive tests covering:
- Basic aggregation by type and level
- Time range filtering
- Null value handling
- Edge cases (empty, single value, all nulls)
- Statistical accuracy (median for odd/even counts)
- Negative and decimal values
- Large numbers

Run tests with:
```bash
npm test -- MetricAggregator.test.ts
```

## Example Use Cases

### Store Performance Comparison
Compare average gross profit across store types:
```typescript
const results = metricAggregator.aggregateAllStoreTypes(
  'gross_profit',
  metricValues
);

results.forEach(result => {
  console.log(`${result.dimensionValue}: ${result.average}`);
});
```

### Level-Based Benchmarking
Find median performance for each store level:
```typescript
const results = metricAggregator.aggregateAllStoreLevels(
  'net_profit_margin',
  metricValues
);

results.forEach(result => {
  console.log(`Level ${result.dimensionValue} median: ${result.median}`);
});
```

### Time-Based Analysis
Compare monthly performance by store type:
```typescript
const janResult = metricAggregator.aggregateByStoreType(
  StoreType.FLAGSHIP,
  'gross_profit',
  metricValues,
  { start: new Date('2024-01-01'), end: new Date('2024-01-31') }
);

const febResult = metricAggregator.aggregateByStoreType(
  StoreType.FLAGSHIP,
  'gross_profit',
  metricValues,
  { start: new Date('2024-02-01'), end: new Date('2024-02-29') }
);

console.log(`Growth: ${((febResult.average - janResult.average) / janResult.average * 100).toFixed(2)}%`);
```
