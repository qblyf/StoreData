/**
 * Unit tests for AlertService
 * Requirements: 10.4
 * 
 * Tests the alert detection and target monitoring functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AlertService } from './AlertService';
import {
  Alert,
  AlertSeverity,
  MetricValue,
  TargetSetting,
  TimePeriod,
  TimeRange,
  UnmetTarget,
} from '../types';

describe('AlertService', () => {
  let alertService: AlertService;

  beforeEach(() => {
    alertService = new AlertService();
    alertService.clearAlertHistory();
  });

  describe('checkAlerts', () => {
    it('should generate alert when metric value is below target', () => {
      const storeId = 'store1';
      const metricId = 'gross_profit';
      const timestamp = new Date('2024-01-15');

      const metricValues: MetricValue[] = [
        {
          metricId,
          storeId,
          value: 8000,
          unit: 'yuan',
          timestamp,
        },
      ];

      const targetSettings: TargetSetting[] = [
        {
          targetId: 'target1',
          metricId,
          storeId,
          targetValue: 10000,
          period: TimePeriod.MONTHLY,
          effectiveFrom: new Date('2024-01-01'),
        },
      ];

      const alerts = alertService.checkAlerts(
        storeId,
        [metricId],
        metricValues,
        targetSettings
      );

      expect(alerts).toHaveLength(1);
      expect(alerts[0].storeId).toBe(storeId);
      expect(alerts[0].metricId).toBe(metricId);
      expect(alerts[0].actualValue).toBe(8000);
      expect(alerts[0].threshold).toBe(10000);
      expect(alerts[0].severity).toBeDefined();
    });

    it('should not generate alert when metric value meets or exceeds target', () => {
      const storeId = 'store1';
      const metricId = 'gross_profit';
      const timestamp = new Date('2024-01-15');

      const metricValues: MetricValue[] = [
        {
          metricId,
          storeId,
          value: 12000,
          unit: 'yuan',
          timestamp,
        },
      ];

      const targetSettings: TargetSetting[] = [
        {
          targetId: 'target1',
          metricId,
          storeId,
          targetValue: 10000,
          period: TimePeriod.MONTHLY,
          effectiveFrom: new Date('2024-01-01'),
        },
      ];

      const alerts = alertService.checkAlerts(
        storeId,
        [metricId],
        metricValues,
        targetSettings
      );

      expect(alerts).toHaveLength(0);
    });

    it('should not generate alert when metric value equals target', () => {
      const storeId = 'store1';
      const metricId = 'gross_profit';
      const timestamp = new Date('2024-01-15');

      const metricValues: MetricValue[] = [
        {
          metricId,
          storeId,
          value: 10000,
          unit: 'yuan',
          timestamp,
        },
      ];

      const targetSettings: TargetSetting[] = [
        {
          targetId: 'target1',
          metricId,
          storeId,
          targetValue: 10000,
          period: TimePeriod.MONTHLY,
          effectiveFrom: new Date('2024-01-01'),
        },
      ];

      const alerts = alertService.checkAlerts(
        storeId,
        [metricId],
        metricValues,
        targetSettings
      );

      expect(alerts).toHaveLength(0);
    });

    it('should skip metrics with null values', () => {
      const storeId = 'store1';
      const metricId = 'gross_profit';
      const timestamp = new Date('2024-01-15');

      const metricValues: MetricValue[] = [
        {
          metricId,
          storeId,
          value: null,
          unit: 'yuan',
          timestamp,
        },
      ];

      const targetSettings: TargetSetting[] = [
        {
          targetId: 'target1',
          metricId,
          storeId,
          targetValue: 10000,
          period: TimePeriod.MONTHLY,
          effectiveFrom: new Date('2024-01-01'),
        },
      ];

      const alerts = alertService.checkAlerts(
        storeId,
        [metricId],
        metricValues,
        targetSettings
      );

      expect(alerts).toHaveLength(0);
    });

    it('should skip metrics without target settings', () => {
      const storeId = 'store1';
      const metricId = 'gross_profit';
      const timestamp = new Date('2024-01-15');

      const metricValues: MetricValue[] = [
        {
          metricId,
          storeId,
          value: 8000,
          unit: 'yuan',
          timestamp,
        },
      ];

      const targetSettings: TargetSetting[] = [];

      const alerts = alertService.checkAlerts(
        storeId,
        [metricId],
        metricValues,
        targetSettings
      );

      expect(alerts).toHaveLength(0);
    });

    it('should handle multiple metrics', () => {
      const storeId = 'store1';
      const timestamp = new Date('2024-01-15');

      const metricValues: MetricValue[] = [
        {
          metricId: 'gross_profit',
          storeId,
          value: 8000,
          unit: 'yuan',
          timestamp,
        },
        {
          metricId: 'conversion_rate',
          storeId,
          value: 25,
          unit: 'percent',
          timestamp,
        },
      ];

      const targetSettings: TargetSetting[] = [
        {
          targetId: 'target1',
          metricId: 'gross_profit',
          storeId,
          targetValue: 10000,
          period: TimePeriod.MONTHLY,
          effectiveFrom: new Date('2024-01-01'),
        },
        {
          targetId: 'target2',
          metricId: 'conversion_rate',
          storeId,
          targetValue: 30,
          period: TimePeriod.MONTHLY,
          effectiveFrom: new Date('2024-01-01'),
        },
      ];

      const alerts = alertService.checkAlerts(
        storeId,
        ['gross_profit', 'conversion_rate'],
        metricValues,
        targetSettings
      );

      expect(alerts).toHaveLength(2);
      expect(alerts.map(a => a.metricId)).toContain('gross_profit');
      expect(alerts.map(a => a.metricId)).toContain('conversion_rate');
    });

    it('should determine severity based on gap percentage', () => {
      const storeId = 'store1';
      const metricId = 'gross_profit';
      const timestamp = new Date('2024-01-15');

      // Test different severity levels
      const testCases = [
        { value: 9900, target: 10000, expectedSeverity: AlertSeverity.INFO }, // 1% below
        { value: 9200, target: 10000, expectedSeverity: AlertSeverity.WARNING }, // 8% below
        { value: 8000, target: 10000, expectedSeverity: AlertSeverity.ERROR }, // 20% below
        { value: 6000, target: 10000, expectedSeverity: AlertSeverity.CRITICAL }, // 40% below
      ];

      for (const testCase of testCases) {
        alertService.clearAlertHistory();

        const metricValues: MetricValue[] = [
          {
            metricId,
            storeId,
            value: testCase.value,
            unit: 'yuan',
            timestamp,
          },
        ];

        const targetSettings: TargetSetting[] = [
          {
            targetId: 'target1',
            metricId,
            storeId,
            targetValue: testCase.target,
            period: TimePeriod.MONTHLY,
            effectiveFrom: new Date('2024-01-01'),
          },
        ];

        const alerts = alertService.checkAlerts(
          storeId,
          [metricId],
          metricValues,
          targetSettings
        );

        expect(alerts).toHaveLength(1);
        expect(alerts[0].severity).toBe(testCase.expectedSeverity);
      }
    });

    it('should respect target effective date range', () => {
      const storeId = 'store1';
      const metricId = 'gross_profit';

      const metricValues: MetricValue[] = [
        {
          metricId,
          storeId,
          value: 8000,
          unit: 'yuan',
          timestamp: new Date('2024-01-15'),
        },
      ];

      // Target effective from Feb 1
      const targetSettings: TargetSetting[] = [
        {
          targetId: 'target1',
          metricId,
          storeId,
          targetValue: 10000,
          period: TimePeriod.MONTHLY,
          effectiveFrom: new Date('2024-02-01'),
        },
      ];

      const alerts = alertService.checkAlerts(
        storeId,
        [metricId],
        metricValues,
        targetSettings
      );

      // Should not generate alert because target is not yet effective
      expect(alerts).toHaveLength(0);
    });

    it('should respect target expiration date', () => {
      const storeId = 'store1';
      const metricId = 'gross_profit';

      const metricValues: MetricValue[] = [
        {
          metricId,
          storeId,
          value: 8000,
          unit: 'yuan',
          timestamp: new Date('2024-02-15'),
        },
      ];

      // Target expired on Jan 31
      const targetSettings: TargetSetting[] = [
        {
          targetId: 'target1',
          metricId,
          storeId,
          targetValue: 10000,
          period: TimePeriod.MONTHLY,
          effectiveFrom: new Date('2024-01-01'),
          effectiveTo: new Date('2024-01-31'),
        },
      ];

      const alerts = alertService.checkAlerts(
        storeId,
        [metricId],
        metricValues,
        targetSettings
      );

      // Should not generate alert because target has expired
      expect(alerts).toHaveLength(0);
    });
  });

  describe('getUnmetTargets', () => {
    it('should return unmet targets for a store', () => {
      const storeId = 'store1';
      const period = TimePeriod.MONTHLY;

      const metricValues: MetricValue[] = [
        {
          metricId: 'gross_profit',
          storeId,
          value: 8000,
          unit: 'yuan',
          timestamp: new Date('2024-01-15'),
        },
        {
          metricId: 'conversion_rate',
          storeId,
          value: 25,
          unit: 'percent',
          timestamp: new Date('2024-01-15'),
        },
      ];

      const targetSettings: TargetSetting[] = [
        {
          targetId: 'target1',
          metricId: 'gross_profit',
          storeId,
          targetValue: 10000,
          period,
          effectiveFrom: new Date('2024-01-01'),
        },
        {
          targetId: 'target2',
          metricId: 'conversion_rate',
          storeId,
          targetValue: 30,
          period,
          effectiveFrom: new Date('2024-01-01'),
        },
      ];

      const storeNames = new Map([['store1', 'Flagship Store']]);
      const metricNames = new Map([
        ['gross_profit', 'Gross Profit'],
        ['conversion_rate', 'Conversion Rate'],
      ]);

      const unmetTargets = alertService.getUnmetTargets(
        storeId,
        period,
        metricValues,
        targetSettings,
        storeNames,
        metricNames
      );

      expect(unmetTargets).toHaveLength(2);
      
      const grossProfitTarget = unmetTargets.find(t => t.metricId === 'gross_profit');
      expect(grossProfitTarget).toBeDefined();
      expect(grossProfitTarget!.actualValue).toBe(8000);
      expect(grossProfitTarget!.targetValue).toBe(10000);
      expect(grossProfitTarget!.gap).toBe(2000);
      expect(grossProfitTarget!.gapPercentage).toBe(20);

      const conversionTarget = unmetTargets.find(t => t.metricId === 'conversion_rate');
      expect(conversionTarget).toBeDefined();
      expect(conversionTarget!.actualValue).toBe(25);
      expect(conversionTarget!.targetValue).toBe(30);
      expect(conversionTarget!.gap).toBe(5);
      expect(conversionTarget!.gapPercentage).toBeCloseTo(16.67, 1);
    });

    it('should not return targets that are met', () => {
      const storeId = 'store1';
      const period = TimePeriod.MONTHLY;

      const metricValues: MetricValue[] = [
        {
          metricId: 'gross_profit',
          storeId,
          value: 12000,
          unit: 'yuan',
          timestamp: new Date('2024-01-15'),
        },
      ];

      const targetSettings: TargetSetting[] = [
        {
          targetId: 'target1',
          metricId: 'gross_profit',
          storeId,
          targetValue: 10000,
          period,
          effectiveFrom: new Date('2024-01-01'),
        },
      ];

      const storeNames = new Map([['store1', 'Flagship Store']]);
      const metricNames = new Map([['gross_profit', 'Gross Profit']]);

      const unmetTargets = alertService.getUnmetTargets(
        storeId,
        period,
        metricValues,
        targetSettings,
        storeNames,
        metricNames
      );

      expect(unmetTargets).toHaveLength(0);
    });

    it('should skip metrics with null values', () => {
      const storeId = 'store1';
      const period = TimePeriod.MONTHLY;

      const metricValues: MetricValue[] = [
        {
          metricId: 'gross_profit',
          storeId,
          value: null,
          unit: 'yuan',
          timestamp: new Date('2024-01-15'),
        },
      ];

      const targetSettings: TargetSetting[] = [
        {
          targetId: 'target1',
          metricId: 'gross_profit',
          storeId,
          targetValue: 10000,
          period,
          effectiveFrom: new Date('2024-01-01'),
        },
      ];

      const storeNames = new Map([['store1', 'Flagship Store']]);
      const metricNames = new Map([['gross_profit', 'Gross Profit']]);

      const unmetTargets = alertService.getUnmetTargets(
        storeId,
        period,
        metricValues,
        targetSettings,
        storeNames,
        metricNames
      );

      expect(unmetTargets).toHaveLength(0);
    });
  });

  describe('getAlertHistory', () => {
    it('should return alerts within time range', () => {
      const storeId = 'store1';
      const metricId = 'gross_profit';

      // Generate some alerts
      const metricValues: MetricValue[] = [
        {
          metricId,
          storeId,
          value: 8000,
          unit: 'yuan',
          timestamp: new Date('2024-01-15'),
        },
      ];

      const targetSettings: TargetSetting[] = [
        {
          targetId: 'target1',
          metricId,
          storeId,
          targetValue: 10000,
          period: TimePeriod.MONTHLY,
          effectiveFrom: new Date('2024-01-01'),
        },
      ];

      alertService.checkAlerts(storeId, [metricId], metricValues, targetSettings);

      const timeRange: TimeRange = {
        start: new Date('2024-01-01'),
        end: new Date('2024-01-31'),
      };

      const history = alertService.getAlertHistory(storeId, timeRange);

      expect(history).toHaveLength(1);
      expect(history[0].storeId).toBe(storeId);
      expect(history[0].metricId).toBe(metricId);
    });

    it('should not return alerts outside time range', () => {
      const storeId = 'store1';
      const metricId = 'gross_profit';

      // Generate alert in January
      const metricValues: MetricValue[] = [
        {
          metricId,
          storeId,
          value: 8000,
          unit: 'yuan',
          timestamp: new Date('2024-01-15'),
        },
      ];

      const targetSettings: TargetSetting[] = [
        {
          targetId: 'target1',
          metricId,
          storeId,
          targetValue: 10000,
          period: TimePeriod.MONTHLY,
          effectiveFrom: new Date('2024-01-01'),
        },
      ];

      alertService.checkAlerts(storeId, [metricId], metricValues, targetSettings);

      // Query for February
      const timeRange: TimeRange = {
        start: new Date('2024-02-01'),
        end: new Date('2024-02-29'),
      };

      const history = alertService.getAlertHistory(storeId, timeRange);

      expect(history).toHaveLength(0);
    });
  });

  describe('configureAlertRule', () => {
    it('should configure custom alert rule', () => {
      const rule = {
        ruleId: 'rule1',
        metricId: 'gross_profit',
        storeId: 'store1',
        severityThresholds: [
          { severity: AlertSeverity.CRITICAL, percentageBelowTarget: 50 },
          { severity: AlertSeverity.ERROR, percentageBelowTarget: 25 },
          { severity: AlertSeverity.WARNING, percentageBelowTarget: 10 },
          { severity: AlertSeverity.INFO, percentageBelowTarget: 5 },
        ],
        enabled: true,
      };

      alertService.configureAlertRule(rule);

      // Test that custom rule is applied
      const storeId = 'store1';
      const metricId = 'gross_profit';
      const timestamp = new Date('2024-01-15');

      const metricValues: MetricValue[] = [
        {
          metricId,
          storeId,
          value: 8000,
          unit: 'yuan',
          timestamp,
        },
      ];

      const targetSettings: TargetSetting[] = [
        {
          targetId: 'target1',
          metricId,
          storeId,
          targetValue: 10000,
          period: TimePeriod.MONTHLY,
          effectiveFrom: new Date('2024-01-01'),
        },
      ];

      const alerts = alertService.checkAlerts(
        storeId,
        [metricId],
        metricValues,
        targetSettings
      );

      expect(alerts).toHaveLength(1);
      // 20% below should be ERROR with default thresholds, but WARNING with custom rule (10-25% range)
      expect(alerts[0].severity).toBe(AlertSeverity.WARNING);
    });
  });

  describe('clearAlertHistory', () => {
    it('should clear all alert history', () => {
      const storeId = 'store1';
      const metricId = 'gross_profit';

      // Generate some alerts
      const metricValues: MetricValue[] = [
        {
          metricId,
          storeId,
          value: 8000,
          unit: 'yuan',
          timestamp: new Date('2024-01-15'),
        },
      ];

      const targetSettings: TargetSetting[] = [
        {
          targetId: 'target1',
          metricId,
          storeId,
          targetValue: 10000,
          period: TimePeriod.MONTHLY,
          effectiveFrom: new Date('2024-01-01'),
        },
      ];

      alertService.checkAlerts(storeId, [metricId], metricValues, targetSettings);

      const timeRange: TimeRange = {
        start: new Date('2024-01-01'),
        end: new Date('2024-01-31'),
      };

      let history = alertService.getAlertHistory(storeId, timeRange);
      expect(history).toHaveLength(1);

      alertService.clearAlertHistory();

      history = alertService.getAlertHistory(storeId, timeRange);
      expect(history).toHaveLength(0);
    });
  });
});
