# FilterService

## Overview

FilterService provides comprehensive data filtering capabilities for the business metrics dashboard. It handles filtering metrics by store, time range, category, store type, and store level, and persists user preferences to localStorage.

**Requirements:** 9.4, 9.5

## Features

- **Multi-dimensional Filtering**: Filter data by store, time range, metric category, store type, and store level
- **Preference Persistence**: Save and load filter preferences from localStorage
- **Flexible Filtering**: Combine multiple filter criteria with AND logic
- **Category Mapping**: Map metric categories to specific metric IDs

## API Reference

### Core Filtering Functions

#### `filterMetrics(metrics, stores, preferences)`

Filters metric values based on comprehensive filter preferences.

**Parameters:**
- `metrics: MetricValue[]` - Array of metric values to filter
- `stores: Store[]` - Array of available stores
- `preferences: FilterPreferences` - Filter criteria

**Returns:** `MetricValue[]` - Filtered metrics

**Example:**
```typescript
const preferences: FilterPreferences = {
  selectedStoreIds: ['store-1', 'store-2'],
  timeRange: { start: new Date('2024-01-01'), end: new Date('2024-01-31') },
  selectedCategories: [MetricCategory.PROFIT],
  selectedStoreTypes: [StoreType.FLAGSHIP],
  selectedStoreLevels: [StoreLevel.A],
};

const filtered = filterMetrics(allMetrics, stores, preferences);
```

#### `filterStores(stores, selectedTypes, selectedLevels)`

Filters stores based on type and level.

**Parameters:**
- `stores: Store[]` - Array of stores to filter
- `selectedTypes: StoreType[]` - Store types to include (empty = all)
- `selectedLevels: StoreLevel[]` - Store levels to include (empty = all)

**Returns:** `Store[]` - Filtered stores

#### `filterMetricsByCategories(metrics, selectedCategories)`

Filters metrics based on their category.

**Parameters:**
- `metrics: MetricValue[]` - Array of metric values
- `selectedCategories: MetricCategory[]` - Categories to include (empty = all)

**Returns:** `MetricValue[]` - Filtered metrics

### Category Mapping

#### `getMetricIdsByCategory(category)`

Returns metric IDs associated with a specific category.

**Parameters:**
- `category: MetricCategory` - The metric category

**Returns:** `string[]` - Array of metric IDs

**Category Mappings:**
- `SETTLEMENT`: revenue
- `MAIN_BUSINESS`: revenue, gross_profit, gross_profit_margin
- `TRAFFIC`: passing_traffic, entering_traffic, entry_rate, transaction_count, conversion_rate
- `PROFIT`: profit, net_profit_margin, profit_margin, gross_profit
- `REVENUE_COST`: revenue, product_cost, adjustment_cost, total_cost
- `EXPENSE`: labor_cost, rent_cost, other_expenses, total_expenses, expense_ratio
- `OUTPUT`: output_per_employee, labor_output_ratio

### Preference Management

#### `saveFilterPreferences(preferences)`

Saves filter preferences to localStorage.

**Parameters:**
- `preferences: FilterPreferences` - Preferences to save

**Storage Key:** `filterPreferences`

#### `loadFilterPreferences()`

Loads filter preferences from localStorage.

**Returns:** `FilterPreferences | null` - Loaded preferences or null if none exist

#### `clearFilterPreferences()`

Clears saved filter preferences from localStorage.

#### `getDefaultFilterPreferences()`

Returns default filter preferences (30-day time range, no filters).

**Returns:** `FilterPreferences` - Default preferences

## Data Types

### FilterPreferences

```typescript
interface FilterPreferences {
  selectedStoreIds: string[];
  timeRange: TimeRange;
  selectedCategories: MetricCategory[];
  selectedStoreTypes: StoreType[];
  selectedStoreLevels: StoreLevel[];
}
```

## Filter Logic

### Store Filtering

Stores are included if they match ALL of the following criteria:
1. Store ID is in `selectedStoreIds` (or no stores selected)
2. Store type is in `selectedStoreTypes` (or no types selected)
3. Store level is in `selectedStoreLevels` (or no levels selected)

### Metric Filtering

Metrics are included if they match ALL of the following criteria:
1. Store ID passes store filtering
2. Timestamp is within `timeRange` (inclusive)
3. Metric ID is in selected categories (or no categories selected)

### Time Range Filtering

Time filtering is inclusive on both ends:
- `metric.timestamp >= timeRange.start`
- `metric.timestamp <= timeRange.end`

## Usage Examples

### Basic Filtering

```typescript
import { filterMetrics, FilterPreferences } from '../services/FilterService';

const preferences: FilterPreferences = {
  selectedStoreIds: ['store-1'],
  timeRange: {
    start: new Date('2024-01-01'),
    end: new Date('2024-01-31'),
  },
  selectedCategories: [],
  selectedStoreTypes: [],
  selectedStoreLevels: [],
};

const filtered = filterMetrics(allMetrics, stores, preferences);
```

### Category Filtering

```typescript
import { filterMetricsByCategories, MetricCategory } from '../services/FilterService';

const profitMetrics = filterMetricsByCategories(metrics, [
  MetricCategory.PROFIT,
  MetricCategory.REVENUE_COST,
]);
```

### Persistence

```typescript
import {
  saveFilterPreferences,
  loadFilterPreferences,
  getDefaultFilterPreferences,
} from '../services/FilterService';

// Save preferences
const preferences = getDefaultFilterPreferences();
preferences.selectedStoreIds = ['store-1', 'store-2'];
saveFilterPreferences(preferences);

// Load preferences
const loaded = loadFilterPreferences();
if (loaded) {
  console.log('Loaded preferences:', loaded);
} else {
  console.log('No saved preferences, using defaults');
}
```

### Integration with React

```typescript
import React, { useState, useEffect, useMemo } from 'react';
import {
  filterMetrics,
  loadFilterPreferences,
  saveFilterPreferences,
  getDefaultFilterPreferences,
} from '../services/FilterService';

function MyDashboard() {
  const [preferences, setPreferences] = useState(() => {
    return loadFilterPreferences() || getDefaultFilterPreferences();
  });

  // Save preferences when they change
  useEffect(() => {
    saveFilterPreferences(preferences);
  }, [preferences]);

  // Apply filters
  const filteredData = useMemo(() => {
    return filterMetrics(allMetrics, stores, preferences);
  }, [allMetrics, stores, preferences]);

  return (
    <div>
      {/* Render filtered data */}
    </div>
  );
}
```

## Error Handling

All localStorage operations are wrapped in try-catch blocks and log errors to console:

- `saveFilterPreferences`: Logs error if save fails, but doesn't throw
- `loadFilterPreferences`: Returns null if load fails or data is corrupted
- `clearFilterPreferences`: Logs error if clear fails, but doesn't throw

## Performance Considerations

- **Memoization**: Use `useMemo` in React to avoid re-filtering on every render
- **Filtering Order**: Store/time filtering happens first, then category filtering
- **Set Operations**: Uses `Set` for efficient store ID lookups
- **Time Comparison**: Uses `getTime()` for efficient timestamp comparison

## Testing

The FilterService includes comprehensive unit tests covering:
- All filtering functions
- localStorage operations
- Edge cases (empty arrays, null values, corrupted data)
- Filter combinations

Run tests:
```bash
npm test FilterService.test.ts
```

## Related Components

- **FilterPanel**: UI component for selecting filter criteria
- **DashboardWithFilters**: Dashboard component that integrates filtering
- **MetricCalculator**: Calculates metric values that are filtered

## Future Enhancements

Potential improvements:
- Add OR logic support for filters
- Support for custom date ranges (last 7 days, last month, etc.)
- Filter presets (save named filter configurations)
- Advanced filtering (greater than, less than, between)
- Filter history (undo/redo filter changes)
