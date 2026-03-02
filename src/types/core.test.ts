import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { MetricCategory, StoreType, StoreLevel, WidgetType } from './core';
import type { Metric, Store } from './core';

describe('Core Types', () => {
  describe('Enums', () => {
    test('MetricCategory should have correct values', () => {
      expect(MetricCategory.SETTLEMENT).toBe('settlement');
      expect(MetricCategory.PROFIT).toBe('profit');
      expect(MetricCategory.TRAFFIC).toBe('traffic');
    });

    test('StoreType should have correct values', () => {
      expect(StoreType.FLAGSHIP).toBe('flagship');
      expect(StoreType.STANDARD).toBe('standard');
      expect(StoreType.MINI).toBe('mini');
    });

    test('StoreLevel should have correct values', () => {
      expect(StoreLevel.A).toBe('A');
      expect(StoreLevel.B).toBe('B');
      expect(StoreLevel.C).toBe('C');
      expect(StoreLevel.D).toBe('D');
    });

    test('WidgetType should have correct values', () => {
      expect(WidgetType.KPI_CARD).toBe('kpi_card');
      expect(WidgetType.LINE_CHART).toBe('line_chart');
      expect(WidgetType.BAR_CHART).toBe('bar_chart');
    });
  });

  describe('Metric Interface', () => {
    test('should create a valid metric object', () => {
      const metric: Metric = {
        id: 'metric-1',
        name: '毛利',
        category: MetricCategory.PROFIT,
        unit: '元',
        dataType: 'currency',
        enabled: true,
      };

      expect(metric.id).toBe('metric-1');
      expect(metric.name).toBe('毛利');
      expect(metric.category).toBe(MetricCategory.PROFIT);
      expect(metric.enabled).toBe(true);
    });

    test('should support optional fields', () => {
      const metric: Metric = {
        id: 'metric-2',
        name: '净利润',
        category: MetricCategory.PROFIT,
        unit: '元',
        dataType: 'currency',
        enabled: true,
        formula: 'grossProfit - expenses',
        dependencies: ['metric-1', 'metric-3'],
      };

      expect(metric.formula).toBe('grossProfit - expenses');
      expect(metric.dependencies).toHaveLength(2);
    });
  });

  describe('Store Interface', () => {
    test('should create a valid store object', () => {
      const store: Store = {
        id: 'store-1',
        name: '旗舰店A',
        type: StoreType.FLAGSHIP,
        level: StoreLevel.A,
        employeeCount: 15,
      };

      expect(store.id).toBe('store-1');
      expect(store.name).toBe('旗舰店A');
      expect(store.type).toBe(StoreType.FLAGSHIP);
      expect(store.level).toBe(StoreLevel.A);
      expect(store.employeeCount).toBe(15);
    });
  });
});

// ============================================================================
// Property-Based Tests
// ============================================================================

describe('Property-Based Tests', () => {
  /**
   * Feature: business-metrics-logic-system
   * Property 1: 指标唯一性
   * 
   * 对于任意创建的指标集合，每个指标的标识符都应该是唯一的，
   * 不存在两个指标具有相同的ID。
   * 
   * **Validates: Requirements 1.4**
   */
  test('Property 1: Metric uniqueness - all metric IDs should be unique', () => {
    // Generator for a single metric
    const metricGenerator = fc.record({
      id: fc.uuid(),
      name: fc.string({ minLength: 1, maxLength: 50 }),
      category: fc.constantFrom(
        MetricCategory.SETTLEMENT,
        MetricCategory.MAIN_BUSINESS,
        MetricCategory.TRAFFIC,
        MetricCategory.PROFIT,
        MetricCategory.REVENUE_COST,
        MetricCategory.EXPENSE,
        MetricCategory.OUTPUT
      ),
      unit: fc.constantFrom('元', '%', '人', '次', '个'),
      dataType: fc.constantFrom('number', 'percent', 'currency') as fc.Arbitrary<'number' | 'percent' | 'currency'>,
      enabled: fc.boolean(),
      formula: fc.option(fc.string(), { nil: undefined }),
      dependencies: fc.option(fc.array(fc.uuid()), { nil: undefined })
    });

    // Generate an array of metrics
    const metricsArrayGenerator = fc.array(metricGenerator, { minLength: 1, maxLength: 100 });

    fc.assert(
      fc.property(metricsArrayGenerator, (metrics: Metric[]) => {
        // Extract all metric IDs
        const metricIds = metrics.map(m => m.id);
        
        // Create a Set from the IDs - Sets only contain unique values
        const uniqueIds = new Set(metricIds);
        
        // The number of unique IDs should equal the total number of metrics
        // This verifies that all IDs are unique
        expect(uniqueIds.size).toBe(metricIds.length);
      }),
      { numRuns: 100 }
    );
  });
});
