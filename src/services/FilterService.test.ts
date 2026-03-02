/**
 * FilterService Tests
 * Requirements: 9.4, 9.5
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import {
  filterMetrics,
  filterStores,
  filterMetricsByCategories,
  getMetricIdsByCategory,
  saveFilterPreferences,
  loadFilterPreferences,
  clearFilterPreferences,
  getDefaultFilterPreferences,
  FilterPreferences,
} from './FilterService';
import {
  MetricValue,
  Store,
  StoreType,
  StoreLevel,
  MetricCategory,
} from '../types';

describe('FilterService', () => {
  // Mock data
  const mockStores: Store[] = [
    {
      id: 'store-1',
      name: 'Store 1',
      type: StoreType.FLAGSHIP,
      level: StoreLevel.A,
      employeeCount: 10,
    },
    {
      id: 'store-2',
      name: 'Store 2',
      type: StoreType.STANDARD,
      level: StoreLevel.B,
      employeeCount: 8,
    },
    {
      id: 'store-3',
      name: 'Store 3',
      type: StoreType.MINI,
      level: StoreLevel.C,
      employeeCount: 5,
    },
  ];

  const now = new Date('2024-01-15T12:00:00Z');
  const yesterday = new Date('2024-01-14T12:00:00Z');
  const tomorrow = new Date('2024-01-16T12:00:00Z');

  const mockMetrics: MetricValue[] = [
    {
      metricId: 'revenue',
      storeId: 'store-1',
      value: 10000,
      unit: '元',
      timestamp: now,
    },
    {
      metricId: 'revenue',
      storeId: 'store-2',
      value: 8000,
      unit: '元',
      timestamp: now,
    },
    {
      metricId: 'revenue',
      storeId: 'store-3',
      value: 5000,
      unit: '元',
      timestamp: now,
    },
    {
      metricId: 'profit',
      storeId: 'store-1',
      value: 2000,
      unit: '元',
      timestamp: yesterday,
    },
    {
      metricId: 'conversion_rate',
      storeId: 'store-1',
      value: 25,
      unit: '%',
      timestamp: tomorrow,
    },
  ];

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  describe('filterMetrics', () => {
    describe('single filter conditions', () => {
      test('should return all metrics when no filters applied', () => {
        const preferences: FilterPreferences = {
          selectedStoreIds: [],
          timeRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-12-31'),
          },
          selectedCategories: [],
          selectedStoreTypes: [],
          selectedStoreLevels: [],
        };

        const result = filterMetrics(mockMetrics, mockStores, preferences);
        expect(result).toHaveLength(5);
      });

      test('should filter by single store ID', () => {
        const preferences: FilterPreferences = {
          selectedStoreIds: ['store-1'],
          timeRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-12-31'),
          },
          selectedCategories: [],
          selectedStoreTypes: [],
          selectedStoreLevels: [],
        };

        const result = filterMetrics(mockMetrics, mockStores, preferences);
        expect(result).toHaveLength(3);
        expect(result.every((m) => m.storeId === 'store-1')).toBe(true);
      });

      test('should filter by multiple store IDs', () => {
        const preferences: FilterPreferences = {
          selectedStoreIds: ['store-1', 'store-3'],
          timeRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-12-31'),
          },
          selectedCategories: [],
          selectedStoreTypes: [],
          selectedStoreLevels: [],
        };

        const result = filterMetrics(mockMetrics, mockStores, preferences);
        expect(result.length).toBeGreaterThan(0);
        expect(
          result.every((m) => m.storeId === 'store-1' || m.storeId === 'store-3')
        ).toBe(true);
      });

      test('should filter by time range - exact day', () => {
        const preferences: FilterPreferences = {
          selectedStoreIds: [],
          timeRange: {
            start: new Date('2024-01-15T00:00:00Z'),
            end: new Date('2024-01-15T23:59:59Z'),
          },
          selectedCategories: [],
          selectedStoreTypes: [],
          selectedStoreLevels: [],
        };

        const result = filterMetrics(mockMetrics, mockStores, preferences);
        expect(result).toHaveLength(3);
        expect(result.every((m) => m.timestamp.getDate() === 15)).toBe(true);
      });

      test('should filter by time range - exclude future dates', () => {
        const preferences: FilterPreferences = {
          selectedStoreIds: [],
          timeRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-01-15T23:59:59Z'),
          },
          selectedCategories: [],
          selectedStoreTypes: [],
          selectedStoreLevels: [],
        };

        const result = filterMetrics(mockMetrics, mockStores, preferences);
        expect(result.every((m) => m.timestamp <= new Date('2024-01-15T23:59:59Z'))).toBe(true);
        expect(result.some((m) => m.timestamp.getDate() === 16)).toBe(false);
      });

      test('should filter by time range - exclude past dates', () => {
        const preferences: FilterPreferences = {
          selectedStoreIds: [],
          timeRange: {
            start: new Date('2024-01-15T00:00:00Z'),
            end: new Date('2024-12-31'),
          },
          selectedCategories: [],
          selectedStoreTypes: [],
          selectedStoreLevels: [],
        };

        const result = filterMetrics(mockMetrics, mockStores, preferences);
        expect(result.every((m) => m.timestamp >= new Date('2024-01-15T00:00:00Z'))).toBe(true);
        expect(result.some((m) => m.timestamp.getDate() === 14)).toBe(false);
      });

      test('should filter by single store type - FLAGSHIP', () => {
        const preferences: FilterPreferences = {
          selectedStoreIds: [],
          timeRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-12-31'),
          },
          selectedCategories: [],
          selectedStoreTypes: [StoreType.FLAGSHIP],
          selectedStoreLevels: [],
        };

        const result = filterMetrics(mockMetrics, mockStores, preferences);
        expect(result.every((m) => m.storeId === 'store-1')).toBe(true);
      });

      test('should filter by single store type - STANDARD', () => {
        const preferences: FilterPreferences = {
          selectedStoreIds: [],
          timeRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-12-31'),
          },
          selectedCategories: [],
          selectedStoreTypes: [StoreType.STANDARD],
          selectedStoreLevels: [],
        };

        const result = filterMetrics(mockMetrics, mockStores, preferences);
        expect(result.every((m) => m.storeId === 'store-2')).toBe(true);
      });

      test('should filter by single store type - MINI', () => {
        const preferences: FilterPreferences = {
          selectedStoreIds: [],
          timeRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-12-31'),
          },
          selectedCategories: [],
          selectedStoreTypes: [StoreType.MINI],
          selectedStoreLevels: [],
        };

        const result = filterMetrics(mockMetrics, mockStores, preferences);
        expect(result.every((m) => m.storeId === 'store-3')).toBe(true);
      });

      test('should filter by single store level - A', () => {
        const preferences: FilterPreferences = {
          selectedStoreIds: [],
          timeRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-12-31'),
          },
          selectedCategories: [],
          selectedStoreTypes: [],
          selectedStoreLevels: [StoreLevel.A],
        };

        const result = filterMetrics(mockMetrics, mockStores, preferences);
        expect(result.every((m) => m.storeId === 'store-1')).toBe(true);
      });

      test('should filter by multiple store levels - B and C', () => {
        const preferences: FilterPreferences = {
          selectedStoreIds: [],
          timeRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-12-31'),
          },
          selectedCategories: [],
          selectedStoreTypes: [],
          selectedStoreLevels: [StoreLevel.B, StoreLevel.C],
        };

        const result = filterMetrics(mockMetrics, mockStores, preferences);
        expect(
          result.every((m) => m.storeId === 'store-2' || m.storeId === 'store-3')
        ).toBe(true);
      });
    });

    describe('combined filter conditions', () => {
      test('should combine store ID and time range filters', () => {
        const preferences: FilterPreferences = {
          selectedStoreIds: ['store-1'],
          timeRange: {
            start: new Date('2024-01-15T00:00:00Z'),
            end: new Date('2024-01-15T23:59:59Z'),
          },
          selectedCategories: [],
          selectedStoreTypes: [],
          selectedStoreLevels: [],
        };

        const result = filterMetrics(mockMetrics, mockStores, preferences);
        expect(result).toHaveLength(1);
        expect(result[0].storeId).toBe('store-1');
        expect(result[0].timestamp.getDate()).toBe(15);
      });

      test('should combine store type and store level filters', () => {
        const preferences: FilterPreferences = {
          selectedStoreIds: [],
          timeRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-12-31'),
          },
          selectedCategories: [],
          selectedStoreTypes: [StoreType.STANDARD],
          selectedStoreLevels: [StoreLevel.B],
        };

        const result = filterMetrics(mockMetrics, mockStores, preferences);
        expect(result.every((m) => m.storeId === 'store-2')).toBe(true);
      });

      test('should combine store type and time range filters', () => {
        const preferences: FilterPreferences = {
          selectedStoreIds: [],
          timeRange: {
            start: new Date('2024-01-15T00:00:00Z'),
            end: new Date('2024-01-15T23:59:59Z'),
          },
          selectedCategories: [],
          selectedStoreTypes: [StoreType.FLAGSHIP, StoreType.STANDARD],
          selectedStoreLevels: [],
        };

        const result = filterMetrics(mockMetrics, mockStores, preferences);
        expect(result.length).toBeGreaterThan(0);
        expect(
          result.every((m) => m.storeId === 'store-1' || m.storeId === 'store-2')
        ).toBe(true);
        expect(result.every((m) => m.timestamp.getDate() === 15)).toBe(true);
      });

      test('should combine all filter types - store ID, type, level, and time', () => {
        const preferences: FilterPreferences = {
          selectedStoreIds: ['store-1', 'store-2'],
          timeRange: {
            start: new Date('2024-01-15T00:00:00Z'),
            end: new Date('2024-01-15T23:59:59Z'),
          },
          selectedCategories: [],
          selectedStoreTypes: [StoreType.FLAGSHIP, StoreType.STANDARD],
          selectedStoreLevels: [StoreLevel.A],
        };

        const result = filterMetrics(mockMetrics, mockStores, preferences);
        // Should only include store-1 metrics on 2024-01-15
        // (store-2 is excluded by level filter)
        expect(result).toHaveLength(1);
        expect(result[0].storeId).toBe('store-1');
        expect(result[0].metricId).toBe('revenue');
      });

      test('should handle conflicting filters - no results', () => {
        const preferences: FilterPreferences = {
          selectedStoreIds: ['store-1'],
          timeRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-12-31'),
          },
          selectedCategories: [],
          selectedStoreTypes: [StoreType.MINI], // store-1 is FLAGSHIP, not MINI
          selectedStoreLevels: [],
        };

        const result = filterMetrics(mockMetrics, mockStores, preferences);
        expect(result).toHaveLength(0);
      });

      test('should handle multiple store types with level filter', () => {
        const preferences: FilterPreferences = {
          selectedStoreIds: [],
          timeRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-12-31'),
          },
          selectedCategories: [],
          selectedStoreTypes: [StoreType.STANDARD, StoreType.MINI],
          selectedStoreLevels: [StoreLevel.B, StoreLevel.C],
        };

        const result = filterMetrics(mockMetrics, mockStores, preferences);
        expect(
          result.every((m) => m.storeId === 'store-2' || m.storeId === 'store-3')
        ).toBe(true);
      });
    });

    describe('filter result correctness', () => {
      test('should return empty array when no metrics match', () => {
        const preferences: FilterPreferences = {
          selectedStoreIds: ['non-existent-store'],
          timeRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-12-31'),
          },
          selectedCategories: [],
          selectedStoreTypes: [],
          selectedStoreLevels: [],
        };

        const result = filterMetrics(mockMetrics, mockStores, preferences);
        expect(result).toHaveLength(0);
      });

      test('should preserve metric data integrity after filtering', () => {
        const preferences: FilterPreferences = {
          selectedStoreIds: ['store-1'],
          timeRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-12-31'),
          },
          selectedCategories: [],
          selectedStoreTypes: [],
          selectedStoreLevels: [],
        };

        const result = filterMetrics(mockMetrics, mockStores, preferences);
        
        // Verify all properties are preserved
        result.forEach((metric) => {
          expect(metric).toHaveProperty('metricId');
          expect(metric).toHaveProperty('storeId');
          expect(metric).toHaveProperty('value');
          expect(metric).toHaveProperty('unit');
          expect(metric).toHaveProperty('timestamp');
          expect(metric.storeId).toBe('store-1');
        });
      });

      test('should not modify original metrics array', () => {
        const originalLength = mockMetrics.length;
        const originalMetrics = [...mockMetrics];

        const preferences: FilterPreferences = {
          selectedStoreIds: ['store-1'],
          timeRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-12-31'),
          },
          selectedCategories: [],
          selectedStoreTypes: [],
          selectedStoreLevels: [],
        };

        filterMetrics(mockMetrics, mockStores, preferences);

        expect(mockMetrics).toHaveLength(originalLength);
        expect(mockMetrics).toEqual(originalMetrics);
      });

      test('should handle empty metrics array', () => {
        const preferences: FilterPreferences = {
          selectedStoreIds: [],
          timeRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-12-31'),
          },
          selectedCategories: [],
          selectedStoreTypes: [],
          selectedStoreLevels: [],
        };

        const result = filterMetrics([], mockStores, preferences);
        expect(result).toHaveLength(0);
      });

      test('should handle empty stores array', () => {
        const preferences: FilterPreferences = {
          selectedStoreIds: [],
          timeRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-12-31'),
          },
          selectedCategories: [],
          selectedStoreTypes: [],
          selectedStoreLevels: [],
        };

        const result = filterMetrics(mockMetrics, [], preferences);
        expect(result).toHaveLength(0);
      });

      test('should correctly filter by time range boundaries - inclusive start', () => {
        const preferences: FilterPreferences = {
          selectedStoreIds: [],
          timeRange: {
            start: new Date('2024-01-15T12:00:00Z'),
            end: new Date('2024-12-31'),
          },
          selectedCategories: [],
          selectedStoreTypes: [],
          selectedStoreLevels: [],
        };

        const result = filterMetrics(mockMetrics, mockStores, preferences);
        
        // Should include metrics at exactly the start time
        const hasExactStartTime = result.some(
          (m) => m.timestamp.getTime() === new Date('2024-01-15T12:00:00Z').getTime()
        );
        expect(hasExactStartTime).toBe(true);
      });

      test('should correctly filter by time range boundaries - inclusive end', () => {
        const preferences: FilterPreferences = {
          selectedStoreIds: [],
          timeRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-01-15T12:00:00Z'),
          },
          selectedCategories: [],
          selectedStoreTypes: [],
          selectedStoreLevels: [],
        };

        const result = filterMetrics(mockMetrics, mockStores, preferences);
        
        // Should include metrics at exactly the end time
        const hasExactEndTime = result.some(
          (m) => m.timestamp.getTime() === new Date('2024-01-15T12:00:00Z').getTime()
        );
        expect(hasExactEndTime).toBe(true);
      });

      test('should validate Requirements 9.4 - different store types get different configurations', () => {
        // Test that FLAGSHIP stores can be filtered separately
        const flagshipPrefs: FilterPreferences = {
          selectedStoreIds: [],
          timeRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-12-31'),
          },
          selectedCategories: [],
          selectedStoreTypes: [StoreType.FLAGSHIP],
          selectedStoreLevels: [],
        };

        const flagshipResults = filterMetrics(mockMetrics, mockStores, flagshipPrefs);
        expect(flagshipResults.every((m) => {
          const store = mockStores.find((s) => s.id === m.storeId);
          return store?.type === StoreType.FLAGSHIP;
        })).toBe(true);

        // Test that STANDARD stores can be filtered separately
        const standardPrefs: FilterPreferences = {
          ...flagshipPrefs,
          selectedStoreTypes: [StoreType.STANDARD],
        };

        const standardResults = filterMetrics(mockMetrics, mockStores, standardPrefs);
        expect(standardResults.every((m) => {
          const store = mockStores.find((s) => s.id === m.storeId);
          return store?.type === StoreType.STANDARD;
        })).toBe(true);

        // Verify they return different results
        expect(flagshipResults).not.toEqual(standardResults);
      });

      test('should validate Requirements 9.5 - different store levels get different configurations', () => {
        // Test that Level A stores can be filtered separately
        const levelAPrefs: FilterPreferences = {
          selectedStoreIds: [],
          timeRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-12-31'),
          },
          selectedCategories: [],
          selectedStoreTypes: [],
          selectedStoreLevels: [StoreLevel.A],
        };

        const levelAResults = filterMetrics(mockMetrics, mockStores, levelAPrefs);
        expect(levelAResults.every((m) => {
          const store = mockStores.find((s) => s.id === m.storeId);
          return store?.level === StoreLevel.A;
        })).toBe(true);

        // Test that Level B stores can be filtered separately
        const levelBPrefs: FilterPreferences = {
          ...levelAPrefs,
          selectedStoreLevels: [StoreLevel.B],
        };

        const levelBResults = filterMetrics(mockMetrics, mockStores, levelBPrefs);
        expect(levelBResults.every((m) => {
          const store = mockStores.find((s) => s.id === m.storeId);
          return store?.level === StoreLevel.B;
        })).toBe(true);

        // Verify they return different results
        expect(levelAResults).not.toEqual(levelBResults);
      });
    });
  });

  describe('filterStores', () => {
    test('should return all stores when no filters applied', () => {
      const result = filterStores(mockStores, [], []);
      expect(result).toHaveLength(3);
    });

    test('should filter by store type', () => {
      const result = filterStores(mockStores, [StoreType.FLAGSHIP], []);
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(StoreType.FLAGSHIP);
    });

    test('should filter by store level', () => {
      const result = filterStores(mockStores, [], [StoreLevel.A, StoreLevel.B]);
      expect(result).toHaveLength(2);
      expect(result.every((s) => s.level === 'A' || s.level === 'B')).toBe(true);
    });

    test('should filter by both type and level', () => {
      const result = filterStores(
        mockStores,
        [StoreType.STANDARD],
        [StoreLevel.B]
      );
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('store-2');
    });
  });

  describe('getMetricIdsByCategory', () => {
    test('should return traffic metrics for TRAFFIC category', () => {
      const result = getMetricIdsByCategory(MetricCategory.TRAFFIC);
      expect(result).toContain('passing_traffic');
      expect(result).toContain('entering_traffic');
      expect(result).toContain('conversion_rate');
    });

    test('should return profit metrics for PROFIT category', () => {
      const result = getMetricIdsByCategory(MetricCategory.PROFIT);
      expect(result).toContain('profit');
      expect(result).toContain('net_profit_margin');
    });

    test('should return empty array for unknown category', () => {
      const result = getMetricIdsByCategory('unknown' as MetricCategory);
      expect(result).toEqual([]);
    });
  });

  describe('filterMetricsByCategories', () => {
    test('should return all metrics when no categories selected', () => {
      const result = filterMetricsByCategories(mockMetrics, []);
      expect(result).toHaveLength(5);
    });

    test('should filter by single category', () => {
      const result = filterMetricsByCategories(mockMetrics, [
        MetricCategory.TRAFFIC,
      ]);
      expect(result.every((m) => m.metricId === 'conversion_rate')).toBe(true);
    });

    test('should filter by multiple categories', () => {
      const result = filterMetricsByCategories(mockMetrics, [
        MetricCategory.MAIN_BUSINESS,
        MetricCategory.PROFIT,
      ]);
      expect(result.length).toBeGreaterThan(0);
      expect(
        result.every(
          (m) => m.metricId === 'revenue' || m.metricId === 'profit'
        )
      ).toBe(true);
    });
  });

  describe('localStorage operations', () => {
    test('should save and load filter preferences', () => {
      const preferences: FilterPreferences = {
        selectedStoreIds: ['store-1', 'store-2'],
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31'),
        },
        selectedCategories: [MetricCategory.PROFIT, MetricCategory.TRAFFIC],
        selectedStoreTypes: [StoreType.FLAGSHIP],
        selectedStoreLevels: [StoreLevel.A, StoreLevel.B],
      };

      saveFilterPreferences(preferences);
      const loaded = loadFilterPreferences();

      expect(loaded).not.toBeNull();
      expect(loaded!.selectedStoreIds).toEqual(preferences.selectedStoreIds);
      expect(loaded!.timeRange.start.toISOString()).toBe(
        preferences.timeRange.start.toISOString()
      );
      expect(loaded!.timeRange.end.toISOString()).toBe(
        preferences.timeRange.end.toISOString()
      );
      expect(loaded!.selectedCategories).toEqual(preferences.selectedCategories);
      expect(loaded!.selectedStoreTypes).toEqual(preferences.selectedStoreTypes);
      expect(loaded!.selectedStoreLevels).toEqual(preferences.selectedStoreLevels);
    });

    test('should return null when no preferences saved', () => {
      const loaded = loadFilterPreferences();
      expect(loaded).toBeNull();
    });

    test('should clear filter preferences', () => {
      const preferences = getDefaultFilterPreferences();
      saveFilterPreferences(preferences);
      
      expect(loadFilterPreferences()).not.toBeNull();
      
      clearFilterPreferences();
      expect(loadFilterPreferences()).toBeNull();
    });

    test('should handle corrupted localStorage data', () => {
      localStorage.setItem('filterPreferences', 'invalid json');
      const loaded = loadFilterPreferences();
      expect(loaded).toBeNull();
    });
  });

  describe('getDefaultFilterPreferences', () => {
    test('should return default preferences with 30-day range', () => {
      const defaults = getDefaultFilterPreferences();
      
      expect(defaults.selectedStoreIds).toEqual([]);
      expect(defaults.selectedCategories).toEqual([]);
      expect(defaults.selectedStoreTypes).toEqual([]);
      expect(defaults.selectedStoreLevels).toEqual([]);
      
      const daysDiff = Math.floor(
        (defaults.timeRange.end.getTime() - defaults.timeRange.start.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      expect(daysDiff).toBe(30);
    });
  });
});
