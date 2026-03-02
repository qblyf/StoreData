# Mock Data Module

This module provides mock data generation for the Business Metrics Dashboard.

## Overview

The mock data module includes:

1. **Metric Definitions** (`mockMetrics.ts`) - Predefined business and financial metrics
2. **Store Data** (`mockStores.ts`) - Sample store information
3. **Data Generator** (`mockDataGenerator.ts`) - Functions to generate metric values and time series data

## Usage

### Generate Current Snapshot

Get current metric values for all stores:

```typescript
import { generateCurrentSnapshot } from './data';

const snapshot = generateCurrentSnapshot();
// Returns MetricValue[] with current data for all stores
```

### Generate Time Series Data

Generate historical data for a specific store:

```typescript
import { generateTimeSeriesData, TimeGranularity } from './data';

const storeId = 'store-001';
const startDate = new Date('2024-01-01');
const endDate = new Date('2024-01-31');

const timeSeries = generateTimeSeriesData(
  storeId,
  startDate,
  endDate,
  TimeGranularity.DAY
);
// Returns MetricValue[] with daily data for the specified period
```

### Get Specific Metric Value

Retrieve a specific metric value from a dataset:

```typescript
import { getMetricValue, generateCurrentSnapshot } from './data';

const snapshot = generateCurrentSnapshot();
const revenue = getMetricValue(snapshot, 'store-001', 'revenue');
// Returns MetricValue | undefined
```

### Generate Target Settings

Get target settings for all stores and key metrics:

```typescript
import { generateTargetSettings } from './data';

const targets = generateTargetSettings();
// Returns TargetSetting[] with monthly targets
```

### Access Store and Metric Definitions

```typescript
import { mockStores, mockMetrics, getStoreById, getMetricById } from './data';

// Get all stores
console.log(mockStores);

// Get specific store
const store = getStoreById('store-001');

// Get all metrics
console.log(mockMetrics);

// Get specific metric
const metric = getMetricById('gross_profit');
```

## Metric Calculations

The data generator implements the following calculations according to requirements:

### Financial Metrics

- **Gross Profit** = Revenue - Product Cost - Adjustment Cost (Req 4.1)
- **Gross Profit Margin** = (Gross Profit / Revenue) × 100% (Req 4.2)
- **Profit** = Gross Profit - Labor Cost - Rent Cost - Other Expenses (Req 5.1)
- **Net Profit Margin** = (Profit / Revenue) × 100% (Req 5.2)
- **Profit Margin** = (Profit / Gross Profit) × 100% (Req 5.3)
- **Expense Ratio** = (Profit + Labor Cost + Rent Cost + Other Expenses) / Gross Profit × 100% (Req 5.4)

### Output Metrics

- **Labor Output Ratio** = Gross Profit / Labor Cost (Req 7.1, 7.3)
- **Output Per Employee** = Gross Profit / Employee Count (Req 7.2)

### Traffic Metrics

- **Entry Rate** = (Entering Traffic / Passing Traffic) × 100% (Req 8.3)
- **Conversion Rate** = (Transaction Count / Entering Traffic) × 100% (Req 8.4)

## Division by Zero Handling

All ratio calculations handle division by zero gracefully by returning `null` when the denominator is zero. This ensures the application can display "N/A" or similar indicators in the UI.

## Data Characteristics

### Store Types and Levels

The generator creates realistic data based on store characteristics:

- **Flagship stores** (Level A): Highest revenue and traffic
- **Standard stores** (Level B/C): Medium revenue and traffic
- **Mini stores** (Level C/D): Lower revenue and traffic

### Randomization

All generated values include ±20% randomness to simulate real-world variance while maintaining realistic proportions:

- Product cost: 45-55% of revenue
- Adjustment cost: 2-5% of revenue
- Labor cost: 12-18% of revenue
- Rent cost: 8-12% of revenue
- Other expenses: 3-6% of revenue
- Entry rate: 30-50% of passing traffic
- Conversion rate: 20-40% of entering traffic

## Testing

Run tests with:

```bash
npm test -- mockDataGenerator.test.ts
```

The test suite verifies:
- Data generation for all stores
- Correct metric calculations
- Time series generation
- Division by zero handling
- Target settings generation
