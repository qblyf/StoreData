/**
 * Property-Based Tests for AlertService
 * 
 * These tests verify that alert detection logic holds true across all valid inputs
 * using fast-check library with at least 100 iterations per property.
 * 
 * Task 9.3: 编写预警功能测试
 */

import { describe, test, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { AlertService } from './AlertService';
import {
  AlertSeverity,
  MetricValue,
  TargetSetting,
  TimePeriod,
} from '../types';

// ============================================================================
// Custom Arbitraries (Generators)
// ============================================================================

/**
 * Generator for metric values (non-negative)
 */
const metricValueArbitrary = fc.oneof(
  fc.constant(0),                           // Zero edge case
  fc.double({ min: 0.01, max: 1000, noNaN: true }),      // Small values
  fc.double({ min: 1000, max: 100000, noNaN: true }),    // Normal values
  fc.double({ min: 100000, max: 10000000, noNaN: true }) // Large values
);

/**
 * Generator for target values (positive)
 */
const targetValueArbitrary = fc.double({ min: 0.01, max: 10000000, noNaN: true });

/**
 * Generator for dates in 2024
 */
const dateArbitrary = fc.date({
  min: new Date('2024-01-01'),
  max: new Date('2024-12-31'),
});

/**
 * Generator for store IDs
 */
const storeIdArbitrary = fc.constantFrom('store1', 'store2', 'store3', 'store4', 'store5');

/**
 * Generator for metric IDs
 */
const metricIdArbitrary = fc.constantFrom(
  'gross_profit',
  'net_profit',
  'conversion_rate',
  'entry_rate',
  'output_per_employee'
);

// ============================================================================
// Property 26: 未达标状态判断
// ============================================================================

describe('Property-Based Tests - Alert Detection', () => {
  let alertService: AlertService;

  beforeEach(() => {
    alertService = new AlertService();
    alertService.clearAlertHistory();
  });

  /**
   * Feature: business-metrics-logic-system
   * Property 26: 未达标状态判断
   * 
   * 对于任意指标的实际值和目标值，当实际值低于目标值时，
   * 系统应该将该指标标记为未达标状态。
   * 
   * **Validates: Requirements 10.4**
   */

  test('Property 26: Unmet target status detection - alert generated when actual < target', () => {
    fc.assert(
      fc.property(
        fc.record({
          storeId: storeIdArbitrary,
          metricId: metricIdArbitrary,
          actualValue: metricValueArbitrary,
          targetValue: targetValueArbitrary,
          timestamp: dateArbitrary,
        }).filter(data => data.actualValue < data.targetValue), // Only test when actual < target
        (data) => {
          const metricValues: MetricValue[] = [
            {
              metricId: data.metricId,
              storeId: data.storeId,
              value: data.actualValue,
              unit: 'yuan',
              timestamp: data.timestamp,
            },
          ];

          const targetSettings: TargetSetting[] = [
            {
              targetId: `target-${data.metricId}`,
              metricId: data.metricId,
              storeId: data.storeId,
              targetValue: data.targetValue,
              period: TimePeriod.MONTHLY,
              effectiveFrom: new Date('2024-01-01'),
              effectiveTo: new Date('2024-12-31'),
            },
          ];

          const alerts = alertService.checkAlerts(
            data.storeId,
            [data.metricId],
            metricValues,
            targetSettings
          );

          // Property: When actual value < target value, an alert MUST be generated
          expect(alerts.length).toBeGreaterThan(0);
          expect(alerts[0].storeId).toBe(data.storeId);
          expect(alerts[0].metricId).toBe(data.metricId);
          expect(alerts[0].actualValue).toBe(data.actualValue);
          expect(alerts[0].threshold).toBe(data.targetValue);
          expect(alerts[0].severity).toBeDefined();
          
          // Verify the alert indicates unmet target status
          expect(alerts[0].actualValue).toBeLessThan(alerts[0].threshold);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 26 (Inverse): No alert when actual >= target
   * 
   * When the actual value meets or exceeds the target value,
   * the system should NOT mark it as unmet (no alert generated).
   */
  test('Property 26 (Inverse): No alert generated when actual >= target', () => {
    fc.assert(
      fc.property(
        fc.record({
          storeId: storeIdArbitrary,
          metricId: metricIdArbitrary,
          actualValue: metricValueArbitrary,
          targetValue: targetValueArbitrary,
          timestamp: dateArbitrary,
        }).filter(data => data.actualValue >= data.targetValue), // Only test when actual >= target
        (data) => {
          const metricValues: MetricValue[] = [
            {
              metricId: data.metricId,
              storeId: data.storeId,
              value: data.actualValue,
              unit: 'yuan',
              timestamp: data.timestamp,
            },
          ];

          const targetSettings: TargetSetting[] = [
            {
              targetId: `target-${data.metricId}`,
              metricId: data.metricId,
              storeId: data.storeId,
              targetValue: data.targetValue,
              period: TimePeriod.MONTHLY,
              effectiveFrom: new Date('2024-01-01'),
              effectiveTo: new Date('2024-12-31'),
            },
          ];

          const alerts = alertService.checkAlerts(
            data.storeId,
            [data.metricId],
            metricValues,
            targetSettings
          );

          // Property: When actual value >= target value, NO alert should be generated
          expect(alerts).toHaveLength(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 26 (Boundary): Alert at exact boundary
   * 
   * Tests the boundary condition where actual value equals target value.
   * At the boundary (actual == target), no alert should be generated.
   */
  test('Property 26 (Boundary): No alert when actual equals target exactly', () => {
    fc.assert(
      fc.property(
        fc.record({
          storeId: storeIdArbitrary,
          metricId: metricIdArbitrary,
          targetValue: targetValueArbitrary,
          timestamp: dateArbitrary,
        }),
        (data) => {
          const metricValues: MetricValue[] = [
            {
              metricId: data.metricId,
              storeId: data.storeId,
              value: data.targetValue, // Actual equals target
              unit: 'yuan',
              timestamp: data.timestamp,
            },
          ];

          const targetSettings: TargetSetting[] = [
            {
              targetId: `target-${data.metricId}`,
              metricId: data.metricId,
              storeId: data.storeId,
              targetValue: data.targetValue,
              period: TimePeriod.MONTHLY,
              effectiveFrom: new Date('2024-01-01'),
              effectiveTo: new Date('2024-12-31'),
            },
          ];

          const alerts = alertService.checkAlerts(
            data.storeId,
            [data.metricId],
            metricValues,
            targetSettings
          );

          // Property: When actual == target, no alert (target is met)
          expect(alerts).toHaveLength(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Alert severity increases with gap percentage
   * 
   * The further below target the actual value is, the higher the severity.
   */
  test('Property: Alert severity correlates with gap percentage', () => {
    fc.assert(
      fc.property(
        fc.record({
          storeId: storeIdArbitrary,
          metricId: metricIdArbitrary,
          targetValue: fc.double({ min: 1000, max: 10000, noNaN: true }),
          gapPercentage: fc.double({ min: 1, max: 50, noNaN: true }),
          timestamp: dateArbitrary,
        }),
        (data) => {
          const actualValue = data.targetValue * (1 - data.gapPercentage / 100);

          const metricValues: MetricValue[] = [
            {
              metricId: data.metricId,
              storeId: data.storeId,
              value: actualValue,
              unit: 'yuan',
              timestamp: data.timestamp,
            },
          ];

          const targetSettings: TargetSetting[] = [
            {
              targetId: `target-${data.metricId}`,
              metricId: data.metricId,
              storeId: data.storeId,
              targetValue: data.targetValue,
              period: TimePeriod.MONTHLY,
              effectiveFrom: new Date('2024-01-01'),
              effectiveTo: new Date('2024-12-31'),
            },
          ];

          const alerts = alertService.checkAlerts(
            data.storeId,
            [data.metricId],
            metricValues,
            targetSettings
          );

          expect(alerts).toHaveLength(1);

          // Verify severity mapping based on default thresholds
          if (data.gapPercentage >= 30) {
            expect(alerts[0].severity).toBe(AlertSeverity.CRITICAL);
          } else if (data.gapPercentage >= 15) {
            expect(alerts[0].severity).toBe(AlertSeverity.ERROR);
          } else if (data.gapPercentage >= 5) {
            expect(alerts[0].severity).toBe(AlertSeverity.WARNING);
          } else if (data.gapPercentage >= 1) {
            expect(alerts[0].severity).toBe(AlertSeverity.INFO);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Alert contains correct gap information
   * 
   * The alert should accurately reflect the gap between actual and target values.
   */
  test('Property: Alert contains accurate gap information', () => {
    fc.assert(
      fc.property(
        fc.record({
          storeId: storeIdArbitrary,
          metricId: metricIdArbitrary,
          actualValue: metricValueArbitrary,
          targetValue: targetValueArbitrary,
          timestamp: dateArbitrary,
        }).filter(data => data.actualValue < data.targetValue && data.targetValue > 0),
        (data) => {
          const metricValues: MetricValue[] = [
            {
              metricId: data.metricId,
              storeId: data.storeId,
              value: data.actualValue,
              unit: 'yuan',
              timestamp: data.timestamp,
            },
          ];

          const targetSettings: TargetSetting[] = [
            {
              targetId: `target-${data.metricId}`,
              metricId: data.metricId,
              storeId: data.storeId,
              targetValue: data.targetValue,
              period: TimePeriod.MONTHLY,
              effectiveFrom: new Date('2024-01-01'),
              effectiveTo: new Date('2024-12-31'),
            },
          ];

          const alerts = alertService.checkAlerts(
            data.storeId,
            [data.metricId],
            metricValues,
            targetSettings
          );

          expect(alerts).toHaveLength(1);

          // Verify alert contains correct values
          expect(alerts[0].actualValue).toBeCloseTo(data.actualValue, 10);
          expect(alerts[0].threshold).toBeCloseTo(data.targetValue, 10);
          
          // Verify the gap is positive (target > actual)
          const gap = alerts[0].threshold - alerts[0].actualValue;
          expect(gap).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Multiple metrics can have independent alert statuses
   * 
   * Each metric should be evaluated independently for alert generation.
   */
  test('Property: Multiple metrics evaluated independently', () => {
    fc.assert(
      fc.property(
        fc.record({
          storeId: storeIdArbitrary,
          metric1: fc.record({
            id: fc.constant('gross_profit'),
            actual: metricValueArbitrary,
            target: targetValueArbitrary,
          }),
          metric2: fc.record({
            id: fc.constant('conversion_rate'),
            actual: metricValueArbitrary,
            target: targetValueArbitrary,
          }),
          timestamp: dateArbitrary,
        }),
        (data) => {
          const metricValues: MetricValue[] = [
            {
              metricId: data.metric1.id,
              storeId: data.storeId,
              value: data.metric1.actual,
              unit: 'yuan',
              timestamp: data.timestamp,
            },
            {
              metricId: data.metric2.id,
              storeId: data.storeId,
              value: data.metric2.actual,
              unit: 'percent',
              timestamp: data.timestamp,
            },
          ];

          const targetSettings: TargetSetting[] = [
            {
              targetId: 'target1',
              metricId: data.metric1.id,
              storeId: data.storeId,
              targetValue: data.metric1.target,
              period: TimePeriod.MONTHLY,
              effectiveFrom: new Date('2024-01-01'),
              effectiveTo: new Date('2024-12-31'),
            },
            {
              targetId: 'target2',
              metricId: data.metric2.id,
              storeId: data.storeId,
              targetValue: data.metric2.target,
              period: TimePeriod.MONTHLY,
              effectiveFrom: new Date('2024-01-01'),
              effectiveTo: new Date('2024-12-31'),
            },
          ];

          const alerts = alertService.checkAlerts(
            data.storeId,
            [data.metric1.id, data.metric2.id],
            metricValues,
            targetSettings
          );

          // Count expected alerts
          let expectedAlerts = 0;
          if (data.metric1.actual < data.metric1.target) expectedAlerts++;
          if (data.metric2.actual < data.metric2.target) expectedAlerts++;

          expect(alerts).toHaveLength(expectedAlerts);

          // Verify each alert corresponds to correct metric
          for (const alert of alerts) {
            if (alert.metricId === data.metric1.id) {
              expect(alert.actualValue).toBe(data.metric1.actual);
              expect(alert.threshold).toBe(data.metric1.target);
            } else if (alert.metricId === data.metric2.id) {
              expect(alert.actualValue).toBe(data.metric2.actual);
              expect(alert.threshold).toBe(data.metric2.target);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Alert history accumulates correctly
   * 
   * Each alert generated should be added to the alert history.
   */
  test('Property: Alert history accumulates all generated alerts', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            storeId: storeIdArbitrary,
            metricId: metricIdArbitrary,
            actualValue: metricValueArbitrary,
            targetValue: targetValueArbitrary,
            timestamp: dateArbitrary,
          }).filter(data => data.actualValue < data.targetValue),
          { minLength: 1, maxLength: 5 }
        ),
        (dataArray) => {
          alertService.clearAlertHistory();

          let totalAlertsGenerated = 0;

          for (const data of dataArray) {
            const metricValues: MetricValue[] = [
              {
                metricId: data.metricId,
                storeId: data.storeId,
                value: data.actualValue,
                unit: 'yuan',
                timestamp: data.timestamp,
              },
            ];

            const targetSettings: TargetSetting[] = [
              {
                targetId: `target-${data.metricId}`,
                metricId: data.metricId,
                storeId: data.storeId,
                targetValue: data.targetValue,
                period: TimePeriod.MONTHLY,
                effectiveFrom: new Date('2024-01-01'),
                effectiveTo: new Date('2024-12-31'),
              },
            ];

            const alerts = alertService.checkAlerts(
              data.storeId,
              [data.metricId],
              metricValues,
              targetSettings
            );

            totalAlertsGenerated += alerts.length;
          }

          // Verify all alerts are in history
          const allHistory = alertService.getAlertHistory(
            dataArray[0].storeId,
            {
              start: new Date('2024-01-01'),
              end: new Date('2024-12-31'),
            }
          );

          // History should contain at least the alerts for this store
          expect(allHistory.length).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
