/**
 * Chart Helper Utilities
 * 
 * Provides utility functions for formatting and transforming data for charts
 */

import { MetricValue, TimeGranularity } from '../types';
import { TrendChartDataPoint } from '../components/TrendLineChart';

/**
 * Format date based on time granularity
 */
export function formatDateLabel(date: Date, granularity: TimeGranularity): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  switch (granularity) {
    case TimeGranularity.HOUR:
      const hour = String(date.getHours()).padStart(2, '0');
      return `${month}-${day} ${hour}:00`;
    
    case TimeGranularity.DAY:
      return `${month}-${day}`;
    
    case TimeGranularity.WEEK:
      // Calculate week number
      const weekNum = getWeekNumber(date);
      return `第${weekNum}周`;
    
    case TimeGranularity.MONTH:
      return `${year}-${month}`;
    
    case TimeGranularity.QUARTER:
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      return `${year}Q${quarter}`;
    
    case TimeGranularity.YEAR:
      return `${year}`;
    
    default:
      return `${year}-${month}-${day}`;
  }
}

/**
 * Get week number of the year
 */
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Convert MetricValue array to TrendChartDataPoint array
 * Groups by timestamp and extracts actual and target values
 */
export function convertToTrendData(
  metricValues: MetricValue[],
  metricId: string,
  granularity: TimeGranularity
): TrendChartDataPoint[] {
  // Group by timestamp
  const groupedByTime = new Map<number, MetricValue>();
  
  for (const mv of metricValues) {
    if (mv.metricId === metricId) {
      const timeKey = mv.timestamp.getTime();
      groupedByTime.set(timeKey, mv);
    }
  }
  
  // Convert to TrendChartDataPoint array and sort by timestamp
  const trendData: TrendChartDataPoint[] = Array.from(groupedByTime.values())
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .map((mv) => ({
      timestamp: mv.timestamp,
      actual: mv.value,
      target: mv.target,
      label: formatDateLabel(mv.timestamp, granularity),
    }));
  
  return trendData;
}

/**
 * Aggregate metric values by time granularity
 * Useful for converting daily data to weekly or monthly
 */
export function aggregateByGranularity(
  metricValues: MetricValue[],
  metricId: string,
  granularity: TimeGranularity
): MetricValue[] {
  // Group by time period
  const groups = new Map<string, MetricValue[]>();
  
  for (const mv of metricValues) {
    if (mv.metricId === metricId) {
      const periodKey = getPeriodKey(mv.timestamp, granularity);
      if (!groups.has(periodKey)) {
        groups.set(periodKey, []);
      }
      groups.get(periodKey)!.push(mv);
    }
  }
  
  // Aggregate each group
  const aggregated: MetricValue[] = [];
  
  for (const [, values] of groups.entries()) {
    if (values.length === 0) continue;
    
    // Calculate average for the period
    const validValues = values.filter(v => v.value !== null);
    const sum = validValues.reduce((acc, v) => acc + (v.value as number), 0);
    const avg = validValues.length > 0 ? sum / validValues.length : null;
    
    // Use the first timestamp in the period
    const firstValue = values[0];
    
    aggregated.push({
      metricId: firstValue.metricId,
      storeId: firstValue.storeId,
      value: avg,
      unit: firstValue.unit,
      timestamp: firstValue.timestamp,
      target: firstValue.target,
    });
  }
  
  return aggregated.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

/**
 * Get period key for grouping
 */
function getPeriodKey(date: Date, granularity: TimeGranularity): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  switch (granularity) {
    case TimeGranularity.HOUR:
      return `${year}-${month}-${day}-${date.getHours()}`;
    
    case TimeGranularity.DAY:
      return `${year}-${month}-${day}`;
    
    case TimeGranularity.WEEK:
      const weekNum = getWeekNumber(date);
      return `${year}-W${weekNum}`;
    
    case TimeGranularity.MONTH:
      return `${year}-${month}`;
    
    case TimeGranularity.QUARTER:
      const quarter = Math.floor(month / 3);
      return `${year}-Q${quarter}`;
    
    case TimeGranularity.YEAR:
      return `${year}`;
    
    default:
      return `${year}-${month}-${day}`;
  }
}
