/**
 * Tests for mock data generator
 */

import { describe, test, expect } from 'vitest';
import {
  generateCurrentSnapshot,
  generateTimeSeriesData,
  generateTargetSettings,
  getMetricValue,
} from './mockDataGenerator';
import { mockStores } from './mockStores';
import { TimeGranularity } from '../types';

describe('Mock Data Generator', () => {
  describe('generateCurrentSnapshot', () => {
    test('should generate metric values for all stores', () => {
      const snapshot = generateCurrentSnapshot();
      
      // Should have metrics for all stores
      const storeIds = new Set(snapshot.map(mv => mv.storeId));
      expect(storeIds.size).toBe(mockStores.length);
      
      // Should have multiple metrics per store
      expect(snapshot.length).toBeGreaterThan(mockStores.length);
    });

    test('should generate all required metrics', () => {
      const snapshot = generateCurrentSnapshot();
      const metricIds = new Set(snapshot.map(mv => mv.metricId));
      
      // Check for key metrics
      expect(metricIds.has('revenue')).toBe(true);
      expect(metricIds.has('gross_profit')).toBe(true);
      expect(metricIds.has('profit')).toBe(true);
      expect(metricIds.has('conversion_rate')).toBe(true);
    });

    test('should have valid metric values', () => {
      const snapshot = generateCurrentSnapshot();
      
      for (const metricValue of snapshot) {
        expect(metricValue.metricId).toBeTruthy();
        expect(metricValue.storeId).toBeTruthy();
        expect(metricValue.unit).toBeTruthy();
        expect(metricValue.timestamp).toBeInstanceOf(Date);
        
        // Value can be null (for division by zero cases) or a number
        if (metricValue.value !== null) {
          expect(typeof metricValue.value).toBe('number');
        }
      }
    });
  });

  describe('generateTimeSeriesData', () => {
    test('should generate time series data for a store', () => {
      const storeId = mockStores[0].id;
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-07');
      
      const timeSeries = generateTimeSeriesData(storeId, startDate, endDate, TimeGranularity.DAY);
      
      // Should have data for multiple days
      expect(timeSeries.length).toBeGreaterThan(0);
      
      // All data should be for the specified store
      const storeIds = new Set(timeSeries.map(mv => mv.storeId));
      expect(storeIds.size).toBe(1);
      expect(storeIds.has(storeId)).toBe(true);
    });

    test('should generate data with correct time granularity', () => {
      const storeId = mockStores[0].id;
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-03');
      
      const timeSeries = generateTimeSeriesData(storeId, startDate, endDate, TimeGranularity.DAY);
      
      // Get unique timestamps
      const timestamps = new Set(timeSeries.map(mv => mv.timestamp.toISOString()));
      
      // Should have 3 days of data (Jan 1, 2, 3)
      expect(timestamps.size).toBe(3);
    });

    test('should throw error for invalid store ID', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-07');
      
      expect(() => {
        generateTimeSeriesData('invalid-store', startDate, endDate);
      }).toThrow('Store not found');
    });
  });

  describe('generateTargetSettings', () => {
    test('should generate target settings for all stores', () => {
      const targets = generateTargetSettings();
      
      // Should have targets for all stores
      const storeIds = new Set(targets.map(t => t.storeId));
      expect(storeIds.size).toBe(mockStores.length);
    });

    test('should have valid target settings', () => {
      const targets = generateTargetSettings();
      
      for (const target of targets) {
        expect(target.targetId).toBeTruthy();
        expect(target.metricId).toBeTruthy();
        expect(target.storeId).toBeTruthy();
        expect(target.targetValue).toBeGreaterThan(0);
        expect(target.effectiveFrom).toBeInstanceOf(Date);
      }
    });
  });

  describe('getMetricValue', () => {
    test('should retrieve specific metric value', () => {
      const snapshot = generateCurrentSnapshot();
      const storeId = mockStores[0].id;
      const metricId = 'revenue';
      
      const metricValue = getMetricValue(snapshot, storeId, metricId);
      
      expect(metricValue).toBeDefined();
      expect(metricValue?.storeId).toBe(storeId);
      expect(metricValue?.metricId).toBe(metricId);
    });

    test('should return undefined for non-existent metric', () => {
      const snapshot = generateCurrentSnapshot();
      const storeId = mockStores[0].id;
      const metricId = 'non_existent_metric';
      
      const metricValue = getMetricValue(snapshot, storeId, metricId);
      
      expect(metricValue).toBeUndefined();
    });
  });

  describe('Metric calculations', () => {
    test('should calculate gross profit correctly', () => {
      const snapshot = generateCurrentSnapshot();
      const storeId = mockStores[0].id;
      
      const revenue = getMetricValue(snapshot, storeId, 'revenue')?.value;
      const productCost = getMetricValue(snapshot, storeId, 'product_cost')?.value;
      const adjustmentCost = getMetricValue(snapshot, storeId, 'adjustment_cost')?.value;
      const grossProfit = getMetricValue(snapshot, storeId, 'gross_profit')?.value;
      
      expect(revenue).toBeDefined();
      expect(productCost).toBeDefined();
      expect(adjustmentCost).toBeDefined();
      expect(grossProfit).toBeDefined();
      
      if (revenue !== undefined && revenue !== null && 
          productCost !== undefined && productCost !== null && 
          adjustmentCost !== undefined && adjustmentCost !== null && 
          grossProfit !== undefined && grossProfit !== null) {
        const expected = revenue - productCost - adjustmentCost;
        expect(grossProfit).toBeCloseTo(expected, 2);
      }
    });

    test('should calculate profit correctly', () => {
      const snapshot = generateCurrentSnapshot();
      const storeId = mockStores[0].id;
      
      const grossProfit = getMetricValue(snapshot, storeId, 'gross_profit')?.value;
      const laborCost = getMetricValue(snapshot, storeId, 'labor_cost')?.value;
      const rentCost = getMetricValue(snapshot, storeId, 'rent_cost')?.value;
      const otherExpenses = getMetricValue(snapshot, storeId, 'other_expenses')?.value;
      const profit = getMetricValue(snapshot, storeId, 'profit')?.value;
      
      if (grossProfit !== undefined && grossProfit !== null && 
          laborCost !== undefined && laborCost !== null && 
          rentCost !== undefined && rentCost !== null && 
          otherExpenses !== undefined && otherExpenses !== null && 
          profit !== undefined && profit !== null) {
        const expected = grossProfit - laborCost - rentCost - otherExpenses;
        expect(profit).toBeCloseTo(expected, 2);
      }
    });

    test('should handle division by zero gracefully', () => {
      const snapshot = generateCurrentSnapshot();
      
      // All metrics should either have a valid number or null
      for (const metricValue of snapshot) {
        if (metricValue.value !== null) {
          expect(typeof metricValue.value).toBe('number');
          expect(isNaN(metricValue.value)).toBe(false);
        }
      }
    });
  });
});
