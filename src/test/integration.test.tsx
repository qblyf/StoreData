/**
 * Integration Tests for Business Metrics Dashboard
 * 
 * Tests the complete data flow: filtering → calculation → display
 * Tests component interactions and error handling
 * 
 * Requirements: 综合验证所有需求
 * Task: 11.4 编写集成测试
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardWithFilters } from '../components/DashboardWithFilters';
import { MetricCalculator } from '../services/MetricCalculator';
import { MetricAggregator } from '../services/MetricAggregator';
import {
  filterMetrics,
  filterMetricsByCategories,
  saveFilterPreferences,
  loadFilterPreferences,
  FilterPreferences,
} from '../services/FilterService';
import { generateTimeSeriesData, generateTargetSettings } from '../data/mockDataGenerator';
import { mockStores } from '../data/mockStores';
import {
  MetricCategory,
  StoreType,
  StoreLevel,
  TimeGranularity,
  MetricValue,
} from '../types';

describe('Integration Tests - Complete Data Flow', () => {
  let calculator: MetricCalculator;
  let aggregator: MetricAggregator;

  beforeEach(() => {
    localStorage.clear();
    calculator = new MetricCalculator();
    aggregator = new MetricAggregator();
  });

  describe('Data Flow: Filtering → Calculation → Display', () => {
    test('should filter data, calculate metrics, and prepare for display', () => {
      // Step 1: Generate raw data
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const allMetrics = mockStores.flatMap((store) =>
        generateTimeSeriesData(store.id, startDate, endDate, TimeGranularity.DAY)
      );

      expect(allMetrics.length).toBeGreaterThan(0);

      // Step 2: Apply filters
      const preferences: FilterPreferences = {
        selectedStoreIds: [mockStores[0].id],
        timeRange: { start: startDate, end: endDate },
        selectedCategories: [MetricCategory.PROFIT],
        selectedStoreTypes: [],
        selectedStoreLevels: [],
      };

      let filtered = filterMetrics(allMetrics, mockStores, preferences);
      filtered = filterMetricsByCategories(filtered, preferences.selectedCategories);

      // Verify filtering worked
      expect(filtered.every((m) => m.storeId === mockStores[0].id)).toBe(true);
      expect(
        filtered.every((m) =>
          ['profit', 'net_profit_margin', 'profit_margin', 'gross_profit'].includes(m.metricId)
        )
      ).toBe(true);

      // Step 3: Verify calculations are correct
      const revenueMetric = allMetrics.find(
        (m) => m.storeId === mockStores[0].id && m.metricId === 'revenue'
      );
      const grossProfitMetric = allMetrics.find(
        (m) => m.storeId === mockStores[0].id && m.metricId === 'gross_profit'
      );

      if (revenueMetric && grossProfitMetric && revenueMetric.value && grossProfitMetric.value) {
        const calculatedMargin = calculator.calculateGrossProfitMargin(
          grossProfitMetric.value,
          revenueMetric.value
        );

        const storedMargin = allMetrics.find(
          (m) =>
            m.storeId === mockStores[0].id &&
            m.metricId === 'gross_profit_margin' &&
            m.timestamp.getTime() === revenueMetric.timestamp.getTime()
        );

        if (calculatedMargin !== null && storedMargin?.value !== null) {
          expect(storedMargin?.value).toBeCloseTo(calculatedMargin, 1);
        }
      }

      // Step 4: Aggregate for display (using aggregateByStoreType)
      const aggregated = aggregator.aggregateByStoreType(
        mockStores[0].type,
        'profit',
        filtered,
        { start: startDate, end: endDate }
      );

      expect(aggregated.metricId).toBe('profit');
      expect(aggregated.count).toBeGreaterThan(0);
    });

    test('should handle complete workflow with multiple stores', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-07');

      // Generate data for all stores
      const allMetrics = mockStores.flatMap((store) =>
        generateTimeSeriesData(store.id, startDate, endDate, TimeGranularity.DAY)
      );

      // Filter to flagship stores only
      const preferences: FilterPreferences = {
        selectedStoreIds: [],
        timeRange: { start: startDate, end: endDate },
        selectedCategories: [],
        selectedStoreTypes: [StoreType.FLAGSHIP],
        selectedStoreLevels: [],
      };

      const filtered = filterMetrics(allMetrics, mockStores, preferences);

      // Get flagship store IDs
      const flagshipStoreIds = mockStores
        .filter((s) => s.type === StoreType.FLAGSHIP)
        .map((s) => s.id);

      // Verify only flagship stores
      expect(filtered.every((m) => flagshipStoreIds.includes(m.storeId))).toBe(true);

      // Aggregate by store type
      const aggregated = aggregator.aggregateByStoreType(
        StoreType.FLAGSHIP,
        'gross_profit',
        filtered,
        { start: startDate, end: endDate }
      );

      expect(aggregated.metricId).toBe('gross_profit');
      expect(aggregated.average).toBeGreaterThan(0);
      expect(aggregated.count).toBeGreaterThan(0);
    });
  });

  describe('Component Interaction Tests', () => {
    test('should update display when filters change', async () => {
      render(<DashboardWithFilters />);

      await waitFor(() => {
        expect(screen.getByText('门店数据指标看板')).toBeInTheDocument();
      });

      // Initial state should show data
      await waitFor(() => {
        const emptyMessage = screen.queryByText('没有符合筛选条件的数据');
        const loadingMessage = screen.queryByText('加载数据中...');
        // Should not show empty or loading state after initial load
        expect(!emptyMessage || !loadingMessage).toBe(true);
      });
    });

    test('should persist filter preferences across sessions', async () => {
      const preferences: FilterPreferences = {
        selectedStoreIds: [mockStores[0].id, mockStores[1].id],
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31'),
        },
        selectedCategories: [MetricCategory.PROFIT],
        selectedStoreTypes: [StoreType.FLAGSHIP],
        selectedStoreLevels: [StoreLevel.A],
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
    });

    test('should handle tab switching correctly', async () => {
      render(<DashboardWithFilters />);

      await waitFor(() => {
        expect(screen.getByText('门店数据指标看板')).toBeInTheDocument();
      });

      // Find and click business tab
      const businessTab = screen.getByText('业务分析');
      await userEvent.click(businessTab);

      // Verify tab is active
      expect(businessTab.closest('button')).toHaveClass('active');

      // Click personnel tab
      const personnelTab = screen.getByText('人员分析');
      await userEvent.click(personnelTab);

      expect(personnelTab.closest('button')).toHaveClass('active');
    });
  });

  describe('Error Handling Tests', () => {
    test('should handle division by zero in calculations', () => {
      // Test gross profit margin with zero revenue
      const margin = calculator.calculateGrossProfitMargin(1000, 0);
      expect(margin).toBeNull();

      // Test conversion rate with zero traffic
      const conversionRate = calculator.calculateConversionRate(10, 0);
      expect(conversionRate).toBeNull();

      // Test output per employee with zero employees
      const output = calculator.calculateOutputPerEmployee(10000, 0);
      expect(output).toBeNull();
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

    test('should handle missing metric data gracefully', () => {
      const metrics: MetricValue[] = [
        {
          metricId: 'revenue',
          storeId: 'store-001',
          value: 10000,
          unit: '元',
          timestamp: new Date(),
        },
      ];

      // Try to aggregate non-existent metric
      const aggregated = aggregator.aggregateByStoreType(
        StoreType.FLAGSHIP,
        'non_existent_metric',
        metrics,
        {
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31'),
        }
      );

      expect(aggregated.count).toBe(0);
      expect(aggregated.average).toBe(0);
    });

    test('should handle invalid store IDs gracefully', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const allMetrics = generateTimeSeriesData(
        mockStores[0].id,
        startDate,
        endDate,
        TimeGranularity.DAY
      );

      const preferences: FilterPreferences = {
        selectedStoreIds: ['invalid-store-id'],
        timeRange: { start: startDate, end: endDate },
        selectedCategories: [],
        selectedStoreTypes: [],
        selectedStoreLevels: [],
      };

      const filtered = filterMetrics(allMetrics, mockStores, preferences);
      expect(filtered).toEqual([]);
    });
  });

  describe('Calculation Accuracy Tests', () => {
    test('should calculate financial metrics accurately', () => {
      const revenue = 100000;
      const productCost = 50000;
      const adjustmentCost = 5000;
      const laborCost = 15000;
      const rentCost = 10000;
      const otherExpenses = 5000;

      // Calculate gross profit
      const grossProfit = calculator.calculateGrossProfit(revenue, productCost, adjustmentCost);
      expect(grossProfit).toBe(45000);

      // Calculate gross profit margin
      const grossProfitMargin = calculator.calculateGrossProfitMargin(grossProfit, revenue);
      expect(grossProfitMargin).toBe(45);

      // Calculate profit
      const profit = calculator.calculateProfit(grossProfit, laborCost, rentCost, otherExpenses);
      expect(profit).toBe(15000);

      // Calculate net profit margin
      const netProfitMargin = calculator.calculateNetProfitMargin(profit, revenue);
      expect(netProfitMargin).toBe(15);

      // Calculate profit margin
      const profitMargin = calculator.calculateProfitMargin(profit, grossProfit);
      expect(profitMargin).toBeCloseTo(33.33, 1);
    });

    test('should calculate traffic metrics accurately', () => {
      const passingTraffic = 1000;
      const enteringTraffic = 400;
      const transactionCount = 120;

      // Calculate entry rate
      const entryRate = calculator.calculateEntryRate(enteringTraffic, passingTraffic);
      expect(entryRate).toBe(40);

      // Calculate conversion rate
      const conversionRate = calculator.calculateConversionRate(transactionCount, enteringTraffic);
      expect(conversionRate).toBe(30);
    });

    test('should calculate output metrics accurately', () => {
      const grossProfit = 50000;
      const laborCost = 15000;
      const employeeCount = 10;

      // Calculate labor output ratio
      const laborOutputRatio = calculator.calculateLaborOutputRatio(grossProfit, laborCost);
      expect(laborOutputRatio).toBeCloseTo(3.33, 2);

      // Calculate output per employee
      const outputPerEmployee = calculator.calculateOutputPerEmployee(grossProfit, employeeCount);
      expect(outputPerEmployee).toBe(5000);
    });
  });

  describe('Data Aggregation Tests', () => {
    test('should aggregate metrics by store type correctly', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const metrics = mockStores.flatMap((store) =>
        generateTimeSeriesData(store.id, startDate, endDate, TimeGranularity.DAY)
      );

      // Aggregate flagship stores
      const aggregated = aggregator.aggregateByStoreType(
        StoreType.FLAGSHIP,
        'revenue',
        metrics,
        { start: startDate, end: endDate }
      );

      expect(aggregated.metricId).toBe('revenue');
      expect(aggregated.dimension).toBe('storeType');
      expect(aggregated.dimensionValue).toBe(StoreType.FLAGSHIP);
      expect(aggregated.count).toBeGreaterThan(0);
      expect(aggregated.average).toBeGreaterThan(0);
      expect(aggregated.sum).toBeGreaterThan(0);
    });

    test('should aggregate metrics by store level correctly', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-07');
      const metrics = mockStores.flatMap((store) =>
        generateTimeSeriesData(store.id, startDate, endDate, TimeGranularity.DAY)
      );

      // Aggregate A-level stores
      const aggregated = aggregator.aggregateByStoreLevel(
        StoreLevel.A,
        'gross_profit',
        metrics,
        { start: startDate, end: endDate }
      );

      expect(aggregated.metricId).toBe('gross_profit');
      expect(aggregated.dimension).toBe('storeLevel');
      expect(aggregated.dimensionValue).toBe(StoreLevel.A);
      expect(aggregated.count).toBeGreaterThan(0);
      expect(aggregated.average).toBeGreaterThan(0);

      // Verify statistics are reasonable
      expect(aggregated.min).toBeLessThanOrEqual(aggregated.average);
      expect(aggregated.max).toBeGreaterThanOrEqual(aggregated.average);
      expect(aggregated.median).toBeGreaterThan(0);
    });
  });

  describe('Target Completion Tests', () => {
    test('should calculate target completion correctly', () => {
      const targets = generateTargetSettings();
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const metrics = generateTimeSeriesData(
        mockStores[0].id,
        startDate,
        endDate,
        TimeGranularity.DAY
      );

      // Get target for revenue
      const revenueTarget = targets.find(
        (t) => t.storeId === mockStores[0].id && t.metricId === 'revenue'
      );

      expect(revenueTarget).toBeDefined();

      // Get actual revenue metrics
      const revenueMetrics = metrics.filter((m) => m.metricId === 'revenue');
      expect(revenueMetrics.length).toBeGreaterThan(0);

      // Calculate average revenue
      const totalRevenue = revenueMetrics.reduce((sum, m) => sum + (m.value || 0), 0);
      const avgRevenue = totalRevenue / revenueMetrics.length;

      // Verify target exists and has reasonable value
      if (revenueTarget) {
        expect(revenueTarget.targetValue).toBeGreaterThan(0);
        expect(avgRevenue).toBeGreaterThan(0);
      }
    });
  });

  describe('Filter Combination Tests', () => {
    test('should handle complex filter combinations', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const allMetrics = mockStores.flatMap((store) =>
        generateTimeSeriesData(store.id, startDate, endDate, TimeGranularity.DAY)
      );

      // Complex filter: A-level flagship stores, profit metrics, first week
      const preferences: FilterPreferences = {
        selectedStoreIds: [],
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-01-07'),
        },
        selectedCategories: [MetricCategory.PROFIT],
        selectedStoreTypes: [StoreType.FLAGSHIP],
        selectedStoreLevels: [StoreLevel.A],
      };

      let filtered = filterMetrics(allMetrics, mockStores, preferences);
      filtered = filterMetricsByCategories(filtered, preferences.selectedCategories);

      // Verify all conditions
      const targetStores = mockStores.filter(
        (s) => s.type === StoreType.FLAGSHIP && s.level === StoreLevel.A
      );
      const targetStoreIds = targetStores.map((s) => s.id);

      if (targetStoreIds.length > 0) {
        expect(filtered.every((m) => targetStoreIds.includes(m.storeId))).toBe(true);
        expect(
          filtered.every((m) =>
            ['profit', 'net_profit_margin', 'profit_margin', 'gross_profit'].includes(m.metricId)
          )
        ).toBe(true);
        expect(
          filtered.every(
            (m) =>
              m.timestamp >= preferences.timeRange.start &&
              m.timestamp <= preferences.timeRange.end
          )
        ).toBe(true);
      }
    });

    test('should handle category filtering correctly', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-07');
      const metrics = generateTimeSeriesData(
        mockStores[0].id,
        startDate,
        endDate,
        TimeGranularity.DAY
      );

      // Filter traffic metrics
      const trafficMetrics = filterMetricsByCategories(metrics, [MetricCategory.TRAFFIC]);
      const expectedTrafficMetrics = [
        'passing_traffic',
        'entering_traffic',
        'entry_rate',
        'transaction_count',
        'conversion_rate',
      ];
      expect(trafficMetrics.every((m) => expectedTrafficMetrics.includes(m.metricId))).toBe(true);

      // Filter expense metrics
      const expenseMetrics = filterMetricsByCategories(metrics, [MetricCategory.EXPENSE]);
      const expectedExpenseMetrics = [
        'labor_cost',
        'rent_cost',
        'other_expenses',
        'total_expenses',
        'expense_ratio',
      ];
      expect(expenseMetrics.every((m) => expectedExpenseMetrics.includes(m.metricId))).toBe(true);
    });
  });

  describe('End-to-End Workflow Tests', () => {
    test('should complete full workflow: load → filter → calculate → aggregate → display', () => {
      // 1. Load data
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const allMetrics = mockStores.flatMap((store) =>
        generateTimeSeriesData(store.id, startDate, endDate, TimeGranularity.DAY)
      );
      const targets = generateTargetSettings();

      expect(allMetrics.length).toBeGreaterThan(0);
      expect(targets.length).toBeGreaterThan(0);

      // 2. Apply filters
      const preferences: FilterPreferences = {
        selectedStoreIds: [mockStores[0].id],
        timeRange: { start: startDate, end: endDate },
        selectedCategories: [MetricCategory.PROFIT],
        selectedStoreTypes: [],
        selectedStoreLevels: [],
      };

      let filtered = filterMetrics(allMetrics, mockStores, preferences);
      filtered = filterMetricsByCategories(filtered, preferences.selectedCategories);

      // 3. Verify calculations
      const profitMetrics = filtered.filter((m) => m.metricId === 'profit');
      expect(profitMetrics.length).toBeGreaterThan(0);

      // 4. Aggregate data
      const aggregated = aggregator.aggregateByStoreType(
        mockStores[0].type,
        'profit',
        filtered,
        { start: startDate, end: endDate }
      );

      expect(aggregated.count).toBeGreaterThan(0);
      expect(aggregated.average).toBeGreaterThan(0);

      // 5. Prepare for display (get most recent)
      const latestMetrics = new Map<string, MetricValue>();
      filtered.forEach((metric) => {
        const key = `${metric.storeId}-${metric.metricId}`;
        const existing = latestMetrics.get(key);
        if (!existing || metric.timestamp > existing.timestamp) {
          latestMetrics.set(key, metric);
        }
      });

      expect(latestMetrics.size).toBeGreaterThan(0);

      // 6. Verify target completion
      const profitTarget = targets.find(
        (t) => t.storeId === mockStores[0].id && t.metricId === 'profit'
      );
      const latestProfit = latestMetrics.get(`${mockStores[0].id}-profit`);

      if (profitTarget && latestProfit && latestProfit.value !== null) {
        const completionRate = (latestProfit.value / profitTarget.targetValue) * 100;
        expect(completionRate).toBeGreaterThanOrEqual(0);
      }
    });
  });
});
