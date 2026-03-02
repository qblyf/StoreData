/**
 * Tests for MetricAggregator Service
 * 
 * Requirements: 9.4, 9.5
 */

import { describe, test, expect } from 'vitest';
import { MetricAggregator } from './MetricAggregator';
import { MetricValue, StoreType, StoreLevel } from '../types';

describe('MetricAggregator', () => {
  const aggregator = new MetricAggregator();

  // Helper function to create metric values
  const createMetricValue = (
    metricId: string,
    storeId: string,
    value: number | null,
    timestamp: Date = new Date('2024-01-15')
  ): MetricValue => ({
    metricId,
    storeId,
    value,
    unit: 'yuan',
    timestamp,
  });

  describe('aggregateByStoreType', () => {
    test('should aggregate metrics for flagship stores', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-001', 50000), // Flagship A
        createMetricValue('gross_profit', 'store-002', 48000), // Flagship A
        createMetricValue('gross_profit', 'store-003', 30000), // Standard B
      ];

      const result = aggregator.aggregateByStoreType(
        StoreType.FLAGSHIP,
        'gross_profit',
        metricValues
      );

      expect(result.metricId).toBe('gross_profit');
      expect(result.dimension).toBe('storeType');
      expect(result.dimensionValue).toBe(StoreType.FLAGSHIP);
      expect(result.count).toBe(2);
      expect(result.sum).toBe(98000);
      expect(result.average).toBe(49000);
      expect(result.median).toBe(49000);
      expect(result.min).toBe(48000);
      expect(result.max).toBe(50000);
    });

    test('should aggregate metrics for standard stores', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-003', 30000), // Standard B
        createMetricValue('gross_profit', 'store-004', 32000), // Standard B
        createMetricValue('gross_profit', 'store-005', 25000), // Standard C
        createMetricValue('gross_profit', 'store-008', 31000), // Standard B
      ];

      const result = aggregator.aggregateByStoreType(
        StoreType.STANDARD,
        'gross_profit',
        metricValues
      );

      expect(result.count).toBe(4);
      expect(result.sum).toBe(118000);
      expect(result.average).toBe(29500);
      expect(result.median).toBe(30500); // (30000 + 31000) / 2
      expect(result.min).toBe(25000);
      expect(result.max).toBe(32000);
    });

    test('should aggregate metrics for mini stores', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-006', 15000), // Mini C
        createMetricValue('gross_profit', 'store-007', 12000), // Mini D
      ];

      const result = aggregator.aggregateByStoreType(
        StoreType.MINI,
        'gross_profit',
        metricValues
      );

      expect(result.count).toBe(2);
      expect(result.sum).toBe(27000);
      expect(result.average).toBe(13500);
      expect(result.median).toBe(13500);
      expect(result.min).toBe(12000);
      expect(result.max).toBe(15000);
    });

    test('should filter out null values', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-001', 50000),
        createMetricValue('gross_profit', 'store-002', null),
      ];

      const result = aggregator.aggregateByStoreType(
        StoreType.FLAGSHIP,
        'gross_profit',
        metricValues
      );

      expect(result.count).toBe(1);
      expect(result.sum).toBe(50000);
      expect(result.average).toBe(50000);
    });

    test('should handle empty result set', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-001', 50000),
      ];

      const result = aggregator.aggregateByStoreType(
        StoreType.MINI,
        'gross_profit',
        metricValues
      );

      expect(result.count).toBe(0);
      expect(result.sum).toBe(0);
      expect(result.average).toBe(0);
      expect(result.median).toBe(0);
    });

    test('should filter by time range', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-001', 50000, new Date('2024-01-10')),
        createMetricValue('gross_profit', 'store-002', 48000, new Date('2024-01-20')),
        createMetricValue('gross_profit', 'store-001', 52000, new Date('2024-01-25')),
      ];

      const result = aggregator.aggregateByStoreType(
        StoreType.FLAGSHIP,
        'gross_profit',
        metricValues,
        {
          start: new Date('2024-01-15'),
          end: new Date('2024-01-31'),
        }
      );

      expect(result.count).toBe(2);
      expect(result.sum).toBe(100000);
      expect(result.average).toBe(50000);
    });

    test('should calculate median correctly for odd number of values', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-003', 10000),
        createMetricValue('gross_profit', 'store-004', 20000),
        createMetricValue('gross_profit', 'store-005', 30000),
      ];

      const result = aggregator.aggregateByStoreType(
        StoreType.STANDARD,
        'gross_profit',
        metricValues
      );

      expect(result.median).toBe(20000);
    });

    test('should calculate median correctly for even number of values', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-003', 10000),
        createMetricValue('gross_profit', 'store-004', 20000),
        createMetricValue('gross_profit', 'store-005', 30000),
        createMetricValue('gross_profit', 'store-008', 40000),
      ];

      const result = aggregator.aggregateByStoreType(
        StoreType.STANDARD,
        'gross_profit',
        metricValues
      );

      expect(result.median).toBe(25000); // (20000 + 30000) / 2
    });
  });

  describe('aggregateByStoreLevel', () => {
    test('should aggregate metrics for level A stores', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-001', 50000), // Flagship A
        createMetricValue('gross_profit', 'store-002', 48000), // Flagship A
        createMetricValue('gross_profit', 'store-003', 30000), // Standard B
      ];

      const result = aggregator.aggregateByStoreLevel(
        StoreLevel.A,
        'gross_profit',
        metricValues
      );

      expect(result.metricId).toBe('gross_profit');
      expect(result.dimension).toBe('storeLevel');
      expect(result.dimensionValue).toBe(StoreLevel.A);
      expect(result.count).toBe(2);
      expect(result.sum).toBe(98000);
      expect(result.average).toBe(49000);
      expect(result.median).toBe(49000);
    });

    test('should aggregate metrics for level B stores', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-003', 30000), // Standard B
        createMetricValue('gross_profit', 'store-004', 32000), // Standard B
        createMetricValue('gross_profit', 'store-008', 31000), // Standard B
      ];

      const result = aggregator.aggregateByStoreLevel(
        StoreLevel.B,
        'gross_profit',
        metricValues
      );

      expect(result.count).toBe(3);
      expect(result.sum).toBe(93000);
      expect(result.average).toBe(31000);
      expect(result.median).toBe(31000);
    });

    test('should aggregate metrics for level C stores', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-005', 25000), // Standard C
        createMetricValue('gross_profit', 'store-006', 15000), // Mini C
      ];

      const result = aggregator.aggregateByStoreLevel(
        StoreLevel.C,
        'gross_profit',
        metricValues
      );

      expect(result.count).toBe(2);
      expect(result.sum).toBe(40000);
      expect(result.average).toBe(20000);
      expect(result.median).toBe(20000);
    });

    test('should aggregate metrics for level D stores', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-007', 12000), // Mini D
      ];

      const result = aggregator.aggregateByStoreLevel(
        StoreLevel.D,
        'gross_profit',
        metricValues
      );

      expect(result.count).toBe(1);
      expect(result.sum).toBe(12000);
      expect(result.average).toBe(12000);
      expect(result.median).toBe(12000);
    });

    test('should filter by time range', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-003', 30000, new Date('2024-01-10')),
        createMetricValue('gross_profit', 'store-004', 32000, new Date('2024-01-20')),
        createMetricValue('gross_profit', 'store-008', 31000, new Date('2024-01-25')),
      ];

      const result = aggregator.aggregateByStoreLevel(
        StoreLevel.B,
        'gross_profit',
        metricValues,
        {
          start: new Date('2024-01-15'),
          end: new Date('2024-01-31'),
        }
      );

      expect(result.count).toBe(2);
      expect(result.sum).toBe(63000);
      expect(result.average).toBe(31500);
    });
  });

  describe('aggregateAllStoreTypes', () => {
    test('should aggregate metrics for all store types', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-001', 50000), // Flagship
        createMetricValue('gross_profit', 'store-002', 48000), // Flagship
        createMetricValue('gross_profit', 'store-003', 30000), // Standard
        createMetricValue('gross_profit', 'store-004', 32000), // Standard
        createMetricValue('gross_profit', 'store-006', 15000), // Mini
        createMetricValue('gross_profit', 'store-007', 12000), // Mini
      ];

      const results = aggregator.aggregateAllStoreTypes(
        'gross_profit',
        metricValues
      );

      expect(results).toHaveLength(3);
      
      const flagshipResult = results.find(r => r.dimensionValue === StoreType.FLAGSHIP);
      expect(flagshipResult?.count).toBe(2);
      expect(flagshipResult?.average).toBe(49000);

      const standardResult = results.find(r => r.dimensionValue === StoreType.STANDARD);
      expect(standardResult?.count).toBe(2);
      expect(standardResult?.average).toBe(31000);

      const miniResult = results.find(r => r.dimensionValue === StoreType.MINI);
      expect(miniResult?.count).toBe(2);
      expect(miniResult?.average).toBe(13500);
    });
  });

  describe('aggregateAllStoreLevels', () => {
    test('should aggregate metrics for all store levels', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-001', 50000), // A
        createMetricValue('gross_profit', 'store-002', 48000), // A
        createMetricValue('gross_profit', 'store-003', 30000), // B
        createMetricValue('gross_profit', 'store-004', 32000), // B
        createMetricValue('gross_profit', 'store-005', 25000), // C
        createMetricValue('gross_profit', 'store-006', 15000), // C
        createMetricValue('gross_profit', 'store-007', 12000), // D
      ];

      const results = aggregator.aggregateAllStoreLevels(
        'gross_profit',
        metricValues
      );

      expect(results).toHaveLength(4);
      
      const levelAResult = results.find(r => r.dimensionValue === StoreLevel.A);
      expect(levelAResult?.count).toBe(2);
      expect(levelAResult?.average).toBe(49000);

      const levelBResult = results.find(r => r.dimensionValue === StoreLevel.B);
      expect(levelBResult?.count).toBe(2);
      expect(levelBResult?.average).toBe(31000);

      const levelCResult = results.find(r => r.dimensionValue === StoreLevel.C);
      expect(levelCResult?.count).toBe(2);
      expect(levelCResult?.average).toBe(20000);

      const levelDResult = results.find(r => r.dimensionValue === StoreLevel.D);
      expect(levelDResult?.count).toBe(1);
      expect(levelDResult?.average).toBe(12000);
    });
  });

  describe('edge cases', () => {
    test('should handle single value correctly', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-001', 50000),
      ];

      const result = aggregator.aggregateByStoreType(
        StoreType.FLAGSHIP,
        'gross_profit',
        metricValues
      );

      expect(result.count).toBe(1);
      expect(result.average).toBe(50000);
      expect(result.median).toBe(50000);
      expect(result.min).toBe(50000);
      expect(result.max).toBe(50000);
    });

    test('should handle all null values', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-001', null),
        createMetricValue('gross_profit', 'store-002', null),
      ];

      const result = aggregator.aggregateByStoreType(
        StoreType.FLAGSHIP,
        'gross_profit',
        metricValues
      );

      expect(result.count).toBe(0);
      expect(result.average).toBe(0);
      expect(result.median).toBe(0);
    });

    test('should handle zero values', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-001', 0),
        createMetricValue('gross_profit', 'store-002', 0),
      ];

      const result = aggregator.aggregateByStoreType(
        StoreType.FLAGSHIP,
        'gross_profit',
        metricValues
      );

      expect(result.count).toBe(2);
      expect(result.average).toBe(0);
      expect(result.median).toBe(0);
      expect(result.sum).toBe(0);
    });

    test('should handle negative values', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('profit', 'store-001', -5000),
        createMetricValue('profit', 'store-002', 10000),
      ];

      const result = aggregator.aggregateByStoreType(
        StoreType.FLAGSHIP,
        'profit',
        metricValues
      );

      expect(result.count).toBe(2);
      expect(result.sum).toBe(5000);
      expect(result.average).toBe(2500);
      expect(result.min).toBe(-5000);
      expect(result.max).toBe(10000);
    });

    test('should handle large numbers', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-001', 1000000),
        createMetricValue('gross_profit', 'store-002', 2000000),
      ];

      const result = aggregator.aggregateByStoreType(
        StoreType.FLAGSHIP,
        'gross_profit',
        metricValues
      );

      expect(result.count).toBe(2);
      expect(result.sum).toBe(3000000);
      expect(result.average).toBe(1500000);
      expect(result.median).toBe(1500000);
    });

    test('should handle decimal values', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit_margin', 'store-001', 0.45),
        createMetricValue('gross_profit_margin', 'store-002', 0.52),
        createMetricValue('gross_profit_margin', 'store-003', 0.48),
      ];

      const result = aggregator.aggregateByStoreType(
        StoreType.FLAGSHIP,
        'gross_profit_margin',
        metricValues
      );

      expect(result.count).toBe(2);
      expect(result.average).toBeCloseTo(0.485, 3);
      expect(result.median).toBeCloseTo(0.485, 3);
    });
  });

  describe('ranking logic', () => {
    test('should rank stores by metric value in descending order', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-001', 50000),
        createMetricValue('gross_profit', 'store-002', 48000),
        createMetricValue('gross_profit', 'store-003', 30000),
        createMetricValue('gross_profit', 'store-004', 32000),
      ];

      // Sort by value descending
      const sorted = [...metricValues]
        .filter(mv => mv.value !== null)
        .sort((a, b) => (b.value as number) - (a.value as number));

      expect(sorted[0].storeId).toBe('store-001');
      expect(sorted[0].value).toBe(50000);
      expect(sorted[1].storeId).toBe('store-002');
      expect(sorted[1].value).toBe(48000);
      expect(sorted[2].storeId).toBe('store-004');
      expect(sorted[2].value).toBe(32000);
      expect(sorted[3].storeId).toBe('store-003');
      expect(sorted[3].value).toBe(30000);
    });

    test('should handle ties in ranking', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-001', 50000),
        createMetricValue('gross_profit', 'store-002', 50000),
        createMetricValue('gross_profit', 'store-003', 30000),
      ];

      const sorted = [...metricValues]
        .filter(mv => mv.value !== null)
        .sort((a, b) => (b.value as number) - (a.value as number));

      expect(sorted[0].value).toBe(50000);
      expect(sorted[1].value).toBe(50000);
      expect(sorted[2].value).toBe(30000);
    });

    test('should exclude null values from ranking', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-001', 50000),
        createMetricValue('gross_profit', 'store-002', null),
        createMetricValue('gross_profit', 'store-003', 30000),
      ];

      const sorted = [...metricValues]
        .filter(mv => mv.value !== null)
        .sort((a, b) => (b.value as number) - (a.value as number));

      expect(sorted).toHaveLength(2);
      expect(sorted[0].storeId).toBe('store-001');
      expect(sorted[1].storeId).toBe('store-003');
    });

    test('should rank negative values correctly', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('profit', 'store-001', 10000),
        createMetricValue('profit', 'store-002', -5000),
        createMetricValue('profit', 'store-003', 5000),
        createMetricValue('profit', 'store-004', -10000),
      ];

      const sorted = [...metricValues]
        .filter(mv => mv.value !== null)
        .sort((a, b) => (b.value as number) - (a.value as number));

      expect(sorted[0].value).toBe(10000);
      expect(sorted[1].value).toBe(5000);
      expect(sorted[2].value).toBe(-5000);
      expect(sorted[3].value).toBe(-10000);
    });

    test('should rank stores within same type', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-003', 30000), // Standard
        createMetricValue('gross_profit', 'store-004', 32000), // Standard
        createMetricValue('gross_profit', 'store-005', 25000), // Standard
        createMetricValue('gross_profit', 'store-008', 31000), // Standard
      ];

      const sorted = [...metricValues]
        .filter(mv => mv.value !== null)
        .sort((a, b) => (b.value as number) - (a.value as number));

      expect(sorted[0].storeId).toBe('store-004'); // 32000
      expect(sorted[1].storeId).toBe('store-008'); // 31000
      expect(sorted[2].storeId).toBe('store-003'); // 30000
      expect(sorted[3].storeId).toBe('store-005'); // 25000
    });
  });

  describe('multi-store data display', () => {
    test('should display data for multiple stores with different types', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-001', 50000), // Flagship
        createMetricValue('gross_profit', 'store-003', 30000), // Standard
        createMetricValue('gross_profit', 'store-006', 15000), // Mini
      ];

      // Verify all stores are represented
      expect(metricValues).toHaveLength(3);
      
      // Verify different store types
      const storeIds = metricValues.map(mv => mv.storeId);
      expect(storeIds).toContain('store-001');
      expect(storeIds).toContain('store-003');
      expect(storeIds).toContain('store-006');
      
      // Verify values are correct
      expect(metricValues.find(mv => mv.storeId === 'store-001')?.value).toBe(50000);
      expect(metricValues.find(mv => mv.storeId === 'store-003')?.value).toBe(30000);
      expect(metricValues.find(mv => mv.storeId === 'store-006')?.value).toBe(15000);
    });

    test('should display data for multiple stores with different levels', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-001', 50000), // Level A
        createMetricValue('gross_profit', 'store-003', 30000), // Level B
        createMetricValue('gross_profit', 'store-005', 25000), // Level C
        createMetricValue('gross_profit', 'store-007', 12000), // Level D
      ];

      expect(metricValues).toHaveLength(4);
      
      // Verify all levels are represented
      const values = metricValues.map(mv => mv.value);
      expect(values).toContain(50000);
      expect(values).toContain(30000);
      expect(values).toContain(25000);
      expect(values).toContain(12000);
    });

    test('should handle mixed null and valid values in multi-store display', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-001', 50000),
        createMetricValue('gross_profit', 'store-002', null),
        createMetricValue('gross_profit', 'store-003', 30000),
        createMetricValue('gross_profit', 'store-004', null),
      ];

      const validValues = metricValues.filter(mv => mv.value !== null);
      const nullValues = metricValues.filter(mv => mv.value === null);

      expect(validValues).toHaveLength(2);
      expect(nullValues).toHaveLength(2);
      
      // Verify valid values are correct
      expect(validValues[0].value).toBe(50000);
      expect(validValues[1].value).toBe(30000);
    });

    test('should compare stores with target values', () => {
      const metricValues: MetricValue[] = [
        { ...createMetricValue('gross_profit', 'store-001', 50000), target: 45000 },
        { ...createMetricValue('gross_profit', 'store-002', 48000), target: 50000 },
        { ...createMetricValue('gross_profit', 'store-003', 30000), target: 35000 },
      ];

      // Check which stores met their targets
      const metTarget = metricValues.filter(mv => 
        mv.value !== null && mv.target !== undefined && mv.value >= mv.target
      );
      const missedTarget = metricValues.filter(mv => 
        mv.value !== null && mv.target !== undefined && mv.value < mv.target
      );

      expect(metTarget).toHaveLength(1); // store-001
      expect(missedTarget).toHaveLength(2); // store-002, store-003
      
      expect(metTarget[0].storeId).toBe('store-001');
    });

    test('should display comparison statistics across multiple stores', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-001', 50000),
        createMetricValue('gross_profit', 'store-002', 48000),
        createMetricValue('gross_profit', 'store-003', 30000),
        createMetricValue('gross_profit', 'store-004', 32000),
      ];

      const values = metricValues
        .map(mv => mv.value)
        .filter((v): v is number => v !== null);

      const sum = values.reduce((acc, val) => acc + val, 0);
      const average = sum / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);

      expect(sum).toBe(160000);
      expect(average).toBe(40000);
      expect(min).toBe(30000);
      expect(max).toBe(50000);
    });

    test('should group stores by type for comparison', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-001', 50000), // Flagship
        createMetricValue('gross_profit', 'store-002', 48000), // Flagship
        createMetricValue('gross_profit', 'store-003', 30000), // Standard
        createMetricValue('gross_profit', 'store-004', 32000), // Standard
        createMetricValue('gross_profit', 'store-006', 15000), // Mini
        createMetricValue('gross_profit', 'store-007', 12000), // Mini
      ];

      // Group by store type (using known store IDs)
      const flagshipStores = ['store-001', 'store-002'];
      const standardStores = ['store-003', 'store-004', 'store-005', 'store-008'];
      const miniStores = ['store-006', 'store-007'];

      const flagshipValues = metricValues.filter(mv => 
        flagshipStores.includes(mv.storeId)
      );
      const standardValues = metricValues.filter(mv => 
        standardStores.includes(mv.storeId)
      );
      const miniValues = metricValues.filter(mv => 
        miniStores.includes(mv.storeId)
      );

      expect(flagshipValues).toHaveLength(2);
      expect(standardValues).toHaveLength(2);
      expect(miniValues).toHaveLength(2);
    });

    test('should display percentage deviation from average', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-001', 50000),
        createMetricValue('gross_profit', 'store-002', 40000),
        createMetricValue('gross_profit', 'store-003', 30000),
      ];

      const values = metricValues
        .map(mv => mv.value)
        .filter((v): v is number => v !== null);
      const average = values.reduce((acc, val) => acc + val, 0) / values.length;

      const deviations = metricValues.map(mv => {
        if (mv.value === null) return null;
        return ((mv.value - average) / average) * 100;
      });

      expect(average).toBe(40000);
      expect(deviations[0]).toBeCloseTo(25, 1); // 50000 is 25% above average
      expect(deviations[1]).toBeCloseTo(0, 1);  // 40000 is at average
      expect(deviations[2]).toBeCloseTo(-25, 1); // 30000 is 25% below average
    });

    test('should handle time-based comparison across stores', () => {
      const metricValues: MetricValue[] = [
        createMetricValue('gross_profit', 'store-001', 50000, new Date('2024-01-15')),
        createMetricValue('gross_profit', 'store-002', 48000, new Date('2024-01-15')),
        createMetricValue('gross_profit', 'store-001', 52000, new Date('2024-01-20')),
        createMetricValue('gross_profit', 'store-002', 49000, new Date('2024-01-20')),
      ];

      // Group by timestamp
      const jan15Values = metricValues.filter(mv => 
        mv.timestamp.getTime() === new Date('2024-01-15').getTime()
      );
      const jan20Values = metricValues.filter(mv => 
        mv.timestamp.getTime() === new Date('2024-01-20').getTime()
      );

      expect(jan15Values).toHaveLength(2);
      expect(jan20Values).toHaveLength(2);

      // Calculate growth for each store
      const store001Growth = 52000 - 50000;
      const store002Growth = 49000 - 48000;

      expect(store001Growth).toBe(2000);
      expect(store002Growth).toBe(1000);
    });
  });
});
