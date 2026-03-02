/**
 * Integration Tests for Filtering Logic
 * Tests the complete filtering workflow
 * Requirements: 9.4, 9.5
 */

import { describe, test, expect, beforeEach } from 'vitest';
import {
  filterMetrics,
  filterMetricsByCategories,
  saveFilterPreferences,
  loadFilterPreferences,
  FilterPreferences,
} from './FilterService';
import { generateTimeSeriesData } from '../data/mockDataGenerator';
import { mockStores } from '../data/mockStores';
import {
  MetricCategory,
  StoreType,
  StoreLevel,
  TimeGranularity,
} from '../types';

describe('Filter Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should filter metrics across multiple stores and time periods', () => {
    // Generate test data for multiple stores
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');
    
    const allMetrics = mockStores.flatMap((store) =>
      generateTimeSeriesData(store.id, startDate, endDate, TimeGranularity.DAY)
    );

    expect(allMetrics.length).toBeGreaterThan(0);

    // Filter to only flagship stores
    const preferences: FilterPreferences = {
      selectedStoreIds: [],
      timeRange: { start: startDate, end: endDate },
      selectedCategories: [],
      selectedStoreTypes: [StoreType.FLAGSHIP],
      selectedStoreLevels: [],
    };

    const filtered = filterMetrics(allMetrics, mockStores, preferences);

    // Verify all results are from flagship stores
    const flagshipStoreIds = mockStores
      .filter((s) => s.type === StoreType.FLAGSHIP)
      .map((s) => s.id);

    expect(filtered.every((m) => flagshipStoreIds.includes(m.storeId))).toBe(true);
  });

  test('should filter by time range correctly', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');
    
    const allMetrics = generateTimeSeriesData(
      mockStores[0].id,
      startDate,
      endDate,
      TimeGranularity.DAY
    );

    // Filter to only first week
    const preferences: FilterPreferences = {
      selectedStoreIds: [],
      timeRange: {
        start: new Date('2024-01-01'),
        end: new Date('2024-01-07'),
      },
      selectedCategories: [],
      selectedStoreTypes: [],
      selectedStoreLevels: [],
    };

    const filtered = filterMetrics(allMetrics, mockStores, preferences);

    // Verify all timestamps are within range
    expect(
      filtered.every(
        (m) =>
          m.timestamp >= preferences.timeRange.start &&
          m.timestamp <= preferences.timeRange.end
      )
    ).toBe(true);

    // Should have fewer metrics than the full month
    expect(filtered.length).toBeLessThan(allMetrics.length);
  });

  test('should filter by category correctly', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');
    
    const allMetrics = generateTimeSeriesData(
      mockStores[0].id,
      startDate,
      endDate,
      TimeGranularity.DAY
    );

    // Filter to only profit metrics
    const filtered = filterMetricsByCategories(allMetrics, [
      MetricCategory.PROFIT,
    ]);

    // Verify only profit-related metrics are included
    const profitMetricIds = ['profit', 'net_profit_margin', 'profit_margin', 'gross_profit'];
    expect(filtered.every((m) => profitMetricIds.includes(m.metricId))).toBe(true);
  });

  test('should combine multiple filter criteria', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');
    
    const allMetrics = mockStores.flatMap((store) =>
      generateTimeSeriesData(store.id, startDate, endDate, TimeGranularity.DAY)
    );

    // Complex filter: A-level stores, first week, profit metrics
    const preferences: FilterPreferences = {
      selectedStoreIds: [],
      timeRange: {
        start: new Date('2024-01-01'),
        end: new Date('2024-01-07'),
      },
      selectedCategories: [MetricCategory.PROFIT],
      selectedStoreTypes: [],
      selectedStoreLevels: [StoreLevel.A],
    };

    let filtered = filterMetrics(allMetrics, mockStores, preferences);
    filtered = filterMetricsByCategories(filtered, preferences.selectedCategories);

    // Verify all conditions are met
    const aLevelStoreIds = mockStores
      .filter((s) => s.level === StoreLevel.A)
      .map((s) => s.id);

    expect(filtered.every((m) => aLevelStoreIds.includes(m.storeId))).toBe(true);
    expect(
      filtered.every(
        (m) =>
          m.timestamp >= preferences.timeRange.start &&
          m.timestamp <= preferences.timeRange.end
      )
    ).toBe(true);

    const profitMetricIds = ['profit', 'net_profit_margin', 'profit_margin', 'gross_profit'];
    expect(filtered.every((m) => profitMetricIds.includes(m.metricId))).toBe(true);
  });

  test('should persist and restore filter preferences', () => {
    const preferences: FilterPreferences = {
      selectedStoreIds: [mockStores[0].id, mockStores[1].id],
      timeRange: {
        start: new Date('2024-01-01'),
        end: new Date('2024-01-31'),
      },
      selectedCategories: [MetricCategory.PROFIT, MetricCategory.TRAFFIC],
      selectedStoreTypes: [StoreType.FLAGSHIP, StoreType.STANDARD],
      selectedStoreLevels: [StoreLevel.A, StoreLevel.B],
    };

    // Save preferences
    saveFilterPreferences(preferences);

    // Load preferences
    const loaded = loadFilterPreferences();

    expect(loaded).not.toBeNull();
    expect(loaded!.selectedStoreIds).toEqual(preferences.selectedStoreIds);
    expect(loaded!.selectedCategories).toEqual(preferences.selectedCategories);
    expect(loaded!.selectedStoreTypes).toEqual(preferences.selectedStoreTypes);
    expect(loaded!.selectedStoreLevels).toEqual(preferences.selectedStoreLevels);
    expect(loaded!.timeRange.start.toISOString()).toBe(
      preferences.timeRange.start.toISOString()
    );
    expect(loaded!.timeRange.end.toISOString()).toBe(
      preferences.timeRange.end.toISOString()
    );
  });

  test('should handle empty filter results gracefully', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');
    
    const allMetrics = generateTimeSeriesData(
      mockStores[0].id,
      startDate,
      endDate,
      TimeGranularity.DAY
    );

    // Filter with impossible criteria (future date range)
    const preferences: FilterPreferences = {
      selectedStoreIds: [],
      timeRange: {
        start: new Date('2025-01-01'),
        end: new Date('2025-01-31'),
      },
      selectedCategories: [],
      selectedStoreTypes: [],
      selectedStoreLevels: [],
    };

    const filtered = filterMetrics(allMetrics, mockStores, preferences);

    expect(filtered).toEqual([]);
  });

  test('should filter by specific store IDs', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');
    
    const allMetrics = mockStores.flatMap((store) =>
      generateTimeSeriesData(store.id, startDate, endDate, TimeGranularity.DAY)
    );

    const targetStoreIds = [mockStores[0].id, mockStores[1].id];

    const preferences: FilterPreferences = {
      selectedStoreIds: targetStoreIds,
      timeRange: { start: startDate, end: endDate },
      selectedCategories: [],
      selectedStoreTypes: [],
      selectedStoreLevels: [],
    };

    const filtered = filterMetrics(allMetrics, mockStores, preferences);

    // Verify only selected stores are included
    expect(filtered.every((m) => targetStoreIds.includes(m.storeId))).toBe(true);

    // Verify we have data from both stores
    const uniqueStoreIds = new Set(filtered.map((m) => m.storeId));
    expect(uniqueStoreIds.size).toBe(targetStoreIds.length);
  });

  test('should handle multiple category filters', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');
    
    const allMetrics = generateTimeSeriesData(
      mockStores[0].id,
      startDate,
      endDate,
      TimeGranularity.DAY
    );

    // Filter to profit and traffic metrics
    const filtered = filterMetricsByCategories(allMetrics, [
      MetricCategory.PROFIT,
      MetricCategory.TRAFFIC,
    ]);

    const expectedMetricIds = [
      'profit',
      'net_profit_margin',
      'profit_margin',
      'gross_profit',
      'passing_traffic',
      'entering_traffic',
      'entry_rate',
      'transaction_count',
      'conversion_rate',
    ];

    expect(filtered.every((m) => expectedMetricIds.includes(m.metricId))).toBe(true);
  });
});
