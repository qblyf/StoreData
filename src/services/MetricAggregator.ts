/**
 * MetricAggregator Service
 * 
 * Aggregates metric data by different dimensions (store type, store level)
 * and calculates statistics like average and median.
 * 
 * Requirements: 9.4, 9.5
 */

import {
  StoreType,
  StoreLevel,
  MetricValue,
  TimeRange,
} from '../types';
import { mockStores } from '../data/mockStores';

/**
 * Aggregation result with additional statistics
 */
export interface AggregationResult {
  metricId: string;
  dimension: string;
  dimensionValue: string;
  average: number;
  median: number;
  min: number;
  max: number;
  count: number;
  sum: number;
  timestamp: Date;
}

/**
 * MetricAggregator class
 * Provides methods to aggregate metrics by various dimensions
 */
export class MetricAggregator {
  /**
   * Aggregate metrics by store type
   * 
   * @param storeType - The store type to aggregate by
   * @param metricId - The metric ID to aggregate
   * @param metricValues - Array of metric values
   * @param timeRange - Optional time range filter
   * @returns Aggregation result with statistics
   */
  aggregateByStoreType(
    storeType: StoreType,
    metricId: string,
    metricValues: MetricValue[],
    timeRange?: TimeRange
  ): AggregationResult {
    // Get stores of the specified type
    const storesOfType = mockStores.filter(store => store.type === storeType);
    const storeIds = storesOfType.map(store => store.id);

    // Filter metric values for stores of this type
    let filteredValues = metricValues.filter(
      mv => mv.metricId === metricId && storeIds.includes(mv.storeId)
    );

    // Apply time range filter if provided
    if (timeRange) {
      filteredValues = filteredValues.filter(
        mv => mv.timestamp >= timeRange.start && mv.timestamp <= timeRange.end
      );
    }

    // Extract numeric values (filter out nulls)
    const values = filteredValues
      .map(mv => mv.value)
      .filter((v): v is number => v !== null);

    // Calculate statistics
    const stats = this.calculateStatistics(values);

    return {
      metricId,
      dimension: 'storeType',
      dimensionValue: storeType,
      average: stats.average,
      median: stats.median,
      min: stats.min,
      max: stats.max,
      count: stats.count,
      sum: stats.sum,
      timestamp: new Date(),
    };
  }

  /**
   * Aggregate metrics by store level
   * 
   * @param storeLevel - The store level to aggregate by
   * @param metricId - The metric ID to aggregate
   * @param metricValues - Array of metric values
   * @param timeRange - Optional time range filter
   * @returns Aggregation result with statistics
   */
  aggregateByStoreLevel(
    storeLevel: StoreLevel,
    metricId: string,
    metricValues: MetricValue[],
    timeRange?: TimeRange
  ): AggregationResult {
    // Get stores of the specified level
    const storesOfLevel = mockStores.filter(store => store.level === storeLevel);
    const storeIds = storesOfLevel.map(store => store.id);

    // Filter metric values for stores of this level
    let filteredValues = metricValues.filter(
      mv => mv.metricId === metricId && storeIds.includes(mv.storeId)
    );

    // Apply time range filter if provided
    if (timeRange) {
      filteredValues = filteredValues.filter(
        mv => mv.timestamp >= timeRange.start && mv.timestamp <= timeRange.end
      );
    }

    // Extract numeric values (filter out nulls)
    const values = filteredValues
      .map(mv => mv.value)
      .filter((v): v is number => v !== null);

    // Calculate statistics
    const stats = this.calculateStatistics(values);

    return {
      metricId,
      dimension: 'storeLevel',
      dimensionValue: storeLevel,
      average: stats.average,
      median: stats.median,
      min: stats.min,
      max: stats.max,
      count: stats.count,
      sum: stats.sum,
      timestamp: new Date(),
    };
  }

  /**
   * Calculate statistical measures for a set of values
   * 
   * @param values - Array of numeric values
   * @returns Object containing average, median, min, max, count, and sum
   */
  private calculateStatistics(values: number[]): {
    average: number;
    median: number;
    min: number;
    max: number;
    count: number;
    sum: number;
  } {
    if (values.length === 0) {
      return {
        average: 0,
        median: 0,
        min: 0,
        max: 0,
        count: 0,
        sum: 0,
      };
    }

    // Calculate sum
    const sum = values.reduce((acc, val) => acc + val, 0);

    // Calculate average
    const average = sum / values.length;

    // Calculate median
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median =
      sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];

    // Calculate min and max
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      average,
      median,
      min,
      max,
      count: values.length,
      sum,
    };
  }

  /**
   * Aggregate metrics across all stores of a given type
   * Returns aggregation results for all store types
   * 
   * @param metricId - The metric ID to aggregate
   * @param metricValues - Array of metric values
   * @param timeRange - Optional time range filter
   * @returns Array of aggregation results, one per store type
   */
  aggregateAllStoreTypes(
    metricId: string,
    metricValues: MetricValue[],
    timeRange?: TimeRange
  ): AggregationResult[] {
    const storeTypes = [StoreType.FLAGSHIP, StoreType.STANDARD, StoreType.MINI];
    return storeTypes.map(type =>
      this.aggregateByStoreType(type, metricId, metricValues, timeRange)
    );
  }

  /**
   * Aggregate metrics across all stores of a given level
   * Returns aggregation results for all store levels
   * 
   * @param metricId - The metric ID to aggregate
   * @param metricValues - Array of metric values
   * @param timeRange - Optional time range filter
   * @returns Array of aggregation results, one per store level
   */
  aggregateAllStoreLevels(
    metricId: string,
    metricValues: MetricValue[],
    timeRange?: TimeRange
  ): AggregationResult[] {
    const storeLevels = [StoreLevel.A, StoreLevel.B, StoreLevel.C, StoreLevel.D];
    return storeLevels.map(level =>
      this.aggregateByStoreLevel(level, metricId, metricValues, timeRange)
    );
  }
}

/**
 * Default instance for convenience
 */
export const metricAggregator = new MetricAggregator();
