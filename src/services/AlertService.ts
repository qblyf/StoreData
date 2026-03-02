/**
 * AlertService - Alert and target monitoring service
 * 
 * Requirements: 10.4
 * 
 * This service detects when metrics fall below target values and generates
 * alerts with appropriate severity levels.
 */

import {
  Alert,
  AlertSeverity,
  MetricValue,
  TargetSetting,
  TimePeriod,
  TimeRange,
  UnmetTarget,
} from '../types';

/**
 * Alert rule configuration
 */
export interface AlertRule {
  ruleId: string;
  metricId: string;
  storeId?: string; // Optional - applies to all stores if not specified
  severityThresholds: SeverityThreshold[];
  enabled: boolean;
}

/**
 * Severity threshold configuration
 * Defines at what percentage below target each severity level triggers
 */
export interface SeverityThreshold {
  severity: AlertSeverity;
  percentageBelowTarget: number; // e.g., 10 means 10% below target
}

/**
 * Default severity thresholds
 * - INFO: 1-5% below target
 * - WARNING: 5-15% below target
 * - ERROR: 15-30% below target
 * - CRITICAL: >30% below target
 */
const DEFAULT_SEVERITY_THRESHOLDS: SeverityThreshold[] = [
  { severity: AlertSeverity.CRITICAL, percentageBelowTarget: 30 },
  { severity: AlertSeverity.ERROR, percentageBelowTarget: 15 },
  { severity: AlertSeverity.WARNING, percentageBelowTarget: 5 },
  { severity: AlertSeverity.INFO, percentageBelowTarget: 1 },
];

export class AlertService {
  private alertRules: Map<string, AlertRule> = new Map();
  private alertHistory: Alert[] = [];

  /**
   * Check alerts for specified metrics
   * 
   * Requirements: 10.4
   * 
   * @param storeId - Store ID to check
   * @param metricIds - Metric IDs to check
   * @param metricValues - Current metric values
   * @param targetSettings - Target settings for metrics
   * @returns Array of alerts
   */
  checkAlerts(
    storeId: string,
    metricIds: string[],
    metricValues: MetricValue[],
    targetSettings: TargetSetting[]
  ): Alert[] {
    const alerts: Alert[] = [];

    for (const metricId of metricIds) {
      // Find current metric value
      const metricValue = metricValues.find(
        mv => mv.storeId === storeId && mv.metricId === metricId
      );

      if (!metricValue || metricValue.value === null) {
        continue; // Skip if no value available
      }

      // Use the metric value's timestamp for checking target effectiveness and alert timestamp
      const timestamp = metricValue.timestamp;

      // Find applicable target
      const target = this.findApplicableTarget(storeId, metricId, targetSettings, timestamp);

      if (!target) {
        continue; // Skip if no target defined
      }

      // Check if metric is below target
      if (metricValue.value < target.targetValue) {
        const alert = this.generateAlert(
          storeId,
          metricId,
          metricValue.value,
          target.targetValue,
          timestamp
        );

        alerts.push(alert);
        this.alertHistory.push(alert);
      }
    }

    return alerts;
  }

  /**
   * Get unmet targets for a store in a specific period
   * 
   * Requirements: 10.4
   * 
   * @param storeId - Store ID
   * @param period - Time period
   * @param metricValues - Current metric values
   * @param targetSettings - Target settings
   * @param storeNames - Map of store IDs to names
   * @param metricNames - Map of metric IDs to names
   * @returns Array of unmet targets
   */
  getUnmetTargets(
    storeId: string,
    period: TimePeriod,
    metricValues: MetricValue[],
    targetSettings: TargetSetting[],
    storeNames: Map<string, string>,
    metricNames: Map<string, string>
  ): UnmetTarget[] {
    const unmetTargets: UnmetTarget[] = [];
    const now = new Date();

    // Get all targets for this store and period
    const storeTargets = targetSettings.filter(
      ts =>
        ts.storeId === storeId &&
        ts.period === period &&
        this.isTargetEffective(ts, now)
    );

    for (const target of storeTargets) {
      // Find current metric value
      const metricValue = metricValues.find(
        mv => mv.storeId === storeId && mv.metricId === target.metricId
      );

      if (!metricValue || metricValue.value === null) {
        continue;
      }

      // Check if below target
      if (metricValue.value < target.targetValue) {
        const gap = target.targetValue - metricValue.value;
        const gapPercentage = (gap / target.targetValue) * 100;

        unmetTargets.push({
          metricId: target.metricId,
          metricName: metricNames.get(target.metricId) || target.metricId,
          storeId,
          storeName: storeNames.get(storeId) || storeId,
          targetValue: target.targetValue,
          actualValue: metricValue.value,
          gap,
          gapPercentage,
        });
      }
    }

    return unmetTargets;
  }

  /**
   * Configure an alert rule
   * 
   * @param rule - Alert rule configuration
   */
  configureAlertRule(rule: AlertRule): void {
    this.alertRules.set(rule.ruleId, rule);
  }

  /**
   * Get alert history for a store within a time range
   * 
   * @param storeId - Store ID
   * @param timeRange - Time range to query
   * @returns Array of historical alerts
   */
  getAlertHistory(storeId: string, timeRange: TimeRange): Alert[] {
    return this.alertHistory.filter(
      alert =>
        alert.storeId === storeId &&
        alert.timestamp >= timeRange.start &&
        alert.timestamp <= timeRange.end
    );
  }

  /**
   * Clear alert history (useful for testing)
   */
  clearAlertHistory(): void {
    this.alertHistory = [];
  }

  /**
   * Find applicable target for a metric
   * 
   * @param storeId - Store ID
   * @param metricId - Metric ID
   * @param targetSettings - All target settings
   * @param date - Date to check effectiveness
   * @returns Applicable target setting or undefined
   */
  private findApplicableTarget(
    storeId: string,
    metricId: string,
    targetSettings: TargetSetting[],
    date: Date
  ): TargetSetting | undefined {
    // Find targets for this store and metric
    const applicableTargets = targetSettings.filter(
      ts =>
        ts.storeId === storeId &&
        ts.metricId === metricId &&
        this.isTargetEffective(ts, date)
    );

    // Return the most recent effective target
    if (applicableTargets.length > 0) {
      return applicableTargets.sort(
        (a, b) => b.effectiveFrom.getTime() - a.effectiveFrom.getTime()
      )[0];
    }

    return undefined;
  }

  /**
   * Check if a target is effective at a given date
   * 
   * @param target - Target setting
   * @param date - Date to check
   * @returns True if target is effective
   */
  private isTargetEffective(target: TargetSetting, date: Date): boolean {
    const isAfterStart = date >= target.effectiveFrom;
    const isBeforeEnd = !target.effectiveTo || date <= target.effectiveTo;
    return isAfterStart && isBeforeEnd;
  }

  /**
   * Generate an alert for a metric below target
   * 
   * Requirements: 10.4
   * 
   * @param storeId - Store ID
   * @param metricId - Metric ID
   * @param actualValue - Actual metric value
   * @param threshold - Target threshold value
   * @param timestamp - Alert timestamp
   * @returns Generated alert
   */
  private generateAlert(
    storeId: string,
    metricId: string,
    actualValue: number,
    threshold: number,
    timestamp: Date
  ): Alert {
    // Calculate how far below target
    const gap = threshold - actualValue;
    const gapPercentage = (gap / threshold) * 100;

    // Determine severity based on gap percentage
    const severity = this.determineSeverity(metricId, storeId, gapPercentage);

    // Generate alert message
    const message = this.generateAlertMessage(metricId, actualValue, threshold, gapPercentage);

    return {
      alertId: `alert-${storeId}-${metricId}-${timestamp.getTime()}`,
      storeId,
      metricId,
      severity,
      message,
      threshold,
      actualValue,
      timestamp,
    };
  }

  /**
   * Determine alert severity based on gap percentage
   * 
   * @param metricId - Metric ID
   * @param storeId - Store ID
   * @param gapPercentage - Percentage below target
   * @returns Alert severity
   */
  private determineSeverity(
    metricId: string,
    storeId: string,
    gapPercentage: number
  ): AlertSeverity {
    // Check if there's a custom rule for this metric/store
    const customRule = Array.from(this.alertRules.values()).find(
      rule =>
        rule.metricId === metricId &&
        rule.enabled &&
        (!rule.storeId || rule.storeId === storeId)
    );

    const thresholds = customRule?.severityThresholds || DEFAULT_SEVERITY_THRESHOLDS;

    // Find the appropriate severity level
    // Thresholds should be sorted from highest to lowest percentage
    for (const threshold of thresholds) {
      if (gapPercentage >= threshold.percentageBelowTarget) {
        return threshold.severity;
      }
    }

    // Default to INFO if below all thresholds
    return AlertSeverity.INFO;
  }

  /**
   * Generate a human-readable alert message
   * 
   * @param metricId - Metric ID
   * @param actualValue - Actual value
   * @param threshold - Target threshold
   * @param gapPercentage - Percentage below target
   * @returns Alert message
   */
  private generateAlertMessage(
    metricId: string,
    actualValue: number,
    threshold: number,
    gapPercentage: number
  ): string {
    const metricName = this.getMetricDisplayName(metricId);
    const formattedGap = gapPercentage.toFixed(1);

    return `${metricName}未达标：实际值 ${actualValue.toFixed(2)}，目标值 ${threshold.toFixed(2)}，低于目标 ${formattedGap}%`;
  }

  /**
   * Get display name for a metric
   * 
   * @param metricId - Metric ID
   * @returns Display name
   */
  private getMetricDisplayName(metricId: string): string {
    const displayNames: Record<string, string> = {
      revenue: '营业收入',
      gross_profit: '毛利',
      gross_profit_margin: '毛利率',
      profit: '净利润',
      net_profit_margin: '净利率',
      profit_margin: '利润率',
      total_cost: '总成本',
      total_expenses: '总费用',
      passing_traffic: '过店客流',
      entering_traffic: '进店客流',
      entry_rate: '进店率',
      transaction_count: '成交客户数',
      conversion_rate: '成交率',
      labor_cost: '人工成本',
      output_per_employee: '人均产出',
      labor_output_ratio: '人效比',
    };

    return displayNames[metricId] || metricId;
  }
}

// Export a singleton instance for convenience
export const alertService = new AlertService();
