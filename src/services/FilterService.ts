/**
 * FilterService - Handles data filtering logic
 * Requirements: 9.4, 9.5
 */

import {
  MetricValue,
  Store,
  StoreType,
  StoreLevel,
  MetricCategory,
  TimeRange,
} from '../types';

/**
 * Filter preferences that can be saved to localStorage
 */
export interface FilterPreferences {
  selectedStoreIds: string[];
  timeRange: TimeRange;
  selectedCategories: MetricCategory[];
  selectedStoreTypes: StoreType[];
  selectedStoreLevels: StoreLevel[];
}

/**
 * Filter metrics based on selected criteria
 */
export function filterMetrics(
  metrics: MetricValue[],
  stores: Store[],
  preferences: FilterPreferences
): MetricValue[] {
  const {
    selectedStoreIds,
    timeRange,
    selectedStoreTypes,
    selectedStoreLevels,
  } = preferences;

  // Create a set of valid store IDs based on type and level filters
  const validStoreIds = new Set<string>();
  
  for (const store of stores) {
    // Check if store matches type filter (if any types selected)
    const matchesType =
      selectedStoreTypes.length === 0 || selectedStoreTypes.includes(store.type);
    
    // Check if store matches level filter (if any levels selected)
    const matchesLevel =
      selectedStoreLevels.length === 0 || selectedStoreLevels.includes(store.level);
    
    // Check if store is in selected stores (if any stores selected)
    const matchesSelection =
      selectedStoreIds.length === 0 || selectedStoreIds.includes(store.id);
    
    if (matchesType && matchesLevel && matchesSelection) {
      validStoreIds.add(store.id);
    }
  }

  // Filter metrics
  return metrics.filter((metric) => {
    // Filter by store
    if (!validStoreIds.has(metric.storeId)) {
      return false;
    }

    // Filter by time range
    const metricTime = metric.timestamp.getTime();
    const startTime = timeRange.start.getTime();
    const endTime = timeRange.end.getTime();
    
    if (metricTime < startTime || metricTime > endTime) {
      return false;
    }

    // Filter by category (if categories are selected)
    // Note: This requires metric metadata to determine category
    // For now, we'll skip category filtering at the metric value level
    // Category filtering should be done at the metric definition level

    return true;
  });
}

/**
 * Filter stores based on type and level
 */
export function filterStores(
  stores: Store[],
  selectedTypes: StoreType[],
  selectedLevels: StoreLevel[]
): Store[] {
  return stores.filter((store) => {
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(store.type);
    const matchesLevel =
      selectedLevels.length === 0 || selectedLevels.includes(store.level);
    return matchesType && matchesLevel;
  });
}

/**
 * Get metric IDs by category
 */
export function getMetricIdsByCategory(category: MetricCategory): string[] {
  const categoryMap: Record<MetricCategory, string[]> = {
    [MetricCategory.SETTLEMENT]: ['revenue'],
    [MetricCategory.MAIN_BUSINESS]: [
      'revenue',
      'gross_profit',
      'gross_profit_margin',
    ],
    [MetricCategory.TRAFFIC]: [
      'passing_traffic',
      'entering_traffic',
      'entry_rate',
      'transaction_count',
      'conversion_rate',
    ],
    [MetricCategory.PROFIT]: [
      'profit',
      'net_profit_margin',
      'profit_margin',
      'gross_profit',
    ],
    [MetricCategory.REVENUE_COST]: [
      'revenue',
      'product_cost',
      'adjustment_cost',
      'total_cost',
    ],
    [MetricCategory.EXPENSE]: [
      'labor_cost',
      'rent_cost',
      'other_expenses',
      'total_expenses',
      'expense_ratio',
    ],
    [MetricCategory.OUTPUT]: [
      'output_per_employee',
      'labor_output_ratio',
    ],
  };

  return categoryMap[category] || [];
}

/**
 * Filter metrics by categories
 */
export function filterMetricsByCategories(
  metrics: MetricValue[],
  selectedCategories: MetricCategory[]
): MetricValue[] {
  if (selectedCategories.length === 0) {
    return metrics;
  }

  // Get all metric IDs for selected categories
  const validMetricIds = new Set<string>();
  for (const category of selectedCategories) {
    const metricIds = getMetricIdsByCategory(category);
    metricIds.forEach((id) => validMetricIds.add(id));
  }

  return metrics.filter((metric) => validMetricIds.has(metric.metricId));
}

/**
 * Save filter preferences to localStorage
 */
export function saveFilterPreferences(preferences: FilterPreferences): void {
  try {
    const serialized = {
      selectedStoreIds: preferences.selectedStoreIds,
      timeRange: {
        start: preferences.timeRange.start.toISOString(),
        end: preferences.timeRange.end.toISOString(),
      },
      selectedCategories: preferences.selectedCategories,
      selectedStoreTypes: preferences.selectedStoreTypes,
      selectedStoreLevels: preferences.selectedStoreLevels,
    };
    localStorage.setItem('filterPreferences', JSON.stringify(serialized));
  } catch (error) {
    console.error('Failed to save filter preferences:', error);
  }
}

/**
 * Load filter preferences from localStorage
 */
export function loadFilterPreferences(): FilterPreferences | null {
  try {
    const stored = localStorage.getItem('filterPreferences');
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);
    return {
      selectedStoreIds: parsed.selectedStoreIds || [],
      timeRange: {
        start: new Date(parsed.timeRange.start),
        end: new Date(parsed.timeRange.end),
      },
      selectedCategories: parsed.selectedCategories || [],
      selectedStoreTypes: parsed.selectedStoreTypes || [],
      selectedStoreLevels: parsed.selectedStoreLevels || [],
    };
  } catch (error) {
    console.error('Failed to load filter preferences:', error);
    return null;
  }
}

/**
 * Clear filter preferences from localStorage
 */
export function clearFilterPreferences(): void {
  try {
    localStorage.removeItem('filterPreferences');
  } catch (error) {
    console.error('Failed to clear filter preferences:', error);
  }
}

/**
 * Get default filter preferences
 */
export function getDefaultFilterPreferences(): FilterPreferences {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  return {
    selectedStoreIds: [],
    timeRange: {
      start: thirtyDaysAgo,
      end: now,
    },
    selectedCategories: [],
    selectedStoreTypes: [],
    selectedStoreLevels: [],
  };
}
