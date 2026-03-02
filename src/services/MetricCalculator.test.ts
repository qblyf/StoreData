/**
 * Unit tests for MetricCalculator
 * Requirements: 4.1, 4.2, 5.1, 5.2, 5.3, 5.4, 7.1, 7.2, 7.3, 8.3, 8.4
 */

import { describe, it, expect } from 'vitest';
import { MetricCalculator } from './MetricCalculator';

describe('MetricCalculator', () => {
  const calculator = new MetricCalculator();

  describe('calculateGrossProfit', () => {
    it('should calculate gross profit correctly', () => {
      const result = calculator.calculateGrossProfit(10000, 6000, 500);
      expect(result).toBe(3500);
    });

    it('should handle zero values', () => {
      const result = calculator.calculateGrossProfit(0, 0, 0);
      expect(result).toBe(0);
    });

    it('should handle negative gross profit', () => {
      const result = calculator.calculateGrossProfit(5000, 6000, 500);
      expect(result).toBe(-1500);
    });

    it('should handle very small values', () => {
      const result = calculator.calculateGrossProfit(0.01, 0.005, 0.002);
      expect(result).toBeCloseTo(0.003, 5);
    });

    it('should handle very large values', () => {
      const result = calculator.calculateGrossProfit(10000000, 6000000, 500000);
      expect(result).toBe(3500000);
    });

    it('should handle extreme large values', () => {
      const result = calculator.calculateGrossProfit(1e10, 6e9, 5e8);
      expect(result).toBe(3.5e9);
    });
  });

  describe('calculateGrossProfitMargin', () => {
    it('should calculate gross profit margin correctly', () => {
      const result = calculator.calculateGrossProfitMargin(3500, 10000);
      expect(result).toBe(35);
    });

    it('should return null when revenue is zero', () => {
      const result = calculator.calculateGrossProfitMargin(0, 0);
      expect(result).toBeNull();
    });

    it('should handle negative margin', () => {
      const result = calculator.calculateGrossProfitMargin(-1500, 10000);
      expect(result).toBe(-15);
    });

    it('should handle very small values', () => {
      const result = calculator.calculateGrossProfitMargin(0.001, 0.01);
      expect(result).toBeCloseTo(10, 2);
    });

    it('should handle very large values', () => {
      const result = calculator.calculateGrossProfitMargin(3500000, 10000000);
      expect(result).toBe(35);
    });

    it('should handle extreme ratios', () => {
      const result = calculator.calculateGrossProfitMargin(9999, 10000);
      expect(result).toBeCloseTo(99.99, 2);
    });
  });

  describe('calculateProfit', () => {
    it('should calculate profit correctly', () => {
      const result = calculator.calculateProfit(10000, 3000, 2000, 1000);
      expect(result).toBe(4000);
    });

    it('should handle zero expenses', () => {
      const result = calculator.calculateProfit(10000, 0, 0, 0);
      expect(result).toBe(10000);
    });

    it('should handle negative profit', () => {
      const result = calculator.calculateProfit(5000, 3000, 2000, 1000);
      expect(result).toBe(-1000);
    });

    it('should handle very small values', () => {
      const result = calculator.calculateProfit(0.1, 0.03, 0.02, 0.01);
      expect(result).toBeCloseTo(0.04, 5);
    });

    it('should handle very large values', () => {
      const result = calculator.calculateProfit(10000000, 3000000, 2000000, 1000000);
      expect(result).toBe(4000000);
    });

    it('should handle all expenses equal to gross profit', () => {
      const result = calculator.calculateProfit(10000, 5000, 3000, 2000);
      expect(result).toBe(0);
    });
  });

  describe('calculateNetProfitMargin', () => {
    it('should calculate net profit margin correctly', () => {
      const result = calculator.calculateNetProfitMargin(4000, 10000);
      expect(result).toBe(40);
    });

    it('should return null when revenue is zero', () => {
      const result = calculator.calculateNetProfitMargin(0, 0);
      expect(result).toBeNull();
    });

    it('should handle negative margin', () => {
      const result = calculator.calculateNetProfitMargin(-1000, 10000);
      expect(result).toBe(-10);
    });

    it('should handle very small values', () => {
      const result = calculator.calculateNetProfitMargin(0.004, 0.01);
      expect(result).toBeCloseTo(40, 2);
    });

    it('should handle very large values', () => {
      const result = calculator.calculateNetProfitMargin(4000000, 10000000);
      expect(result).toBe(40);
    });

    it('should handle near-zero profit margin', () => {
      const result = calculator.calculateNetProfitMargin(1, 1000000);
      expect(result).toBeCloseTo(0.0001, 4);
    });
  });

  describe('calculateProfitMargin', () => {
    it('should calculate profit margin correctly', () => {
      const result = calculator.calculateProfitMargin(4000, 10000);
      expect(result).toBe(40);
    });

    it('should return null when gross profit is zero', () => {
      const result = calculator.calculateProfitMargin(0, 0);
      expect(result).toBeNull();
    });

    it('should handle negative margin', () => {
      const result = calculator.calculateProfitMargin(-1000, 10000);
      expect(result).toBe(-10);
    });

    it('should handle very small values', () => {
      const result = calculator.calculateProfitMargin(0.004, 0.01);
      expect(result).toBeCloseTo(40, 2);
    });

    it('should handle very large values', () => {
      const result = calculator.calculateProfitMargin(4000000, 10000000);
      expect(result).toBe(40);
    });

    it('should handle profit equal to gross profit', () => {
      const result = calculator.calculateProfitMargin(10000, 10000);
      expect(result).toBe(100);
    });
  });

  describe('calculateExpenseRatio', () => {
    it('should calculate expense ratio correctly', () => {
      // profit + laborCost + rentCost + otherExpenses = grossProfit
      // 4000 + 3000 + 2000 + 1000 = 10000
      const result = calculator.calculateExpenseRatio(4000, 3000, 2000, 1000, 10000);
      expect(result).toBe(100);
    });

    it('should return null when gross profit is zero', () => {
      const result = calculator.calculateExpenseRatio(0, 0, 0, 0, 0);
      expect(result).toBeNull();
    });

    it('should handle partial expenses', () => {
      // 5000 + 2000 + 1000 + 500 = 8500, ratio = 8500/10000 = 85%
      const result = calculator.calculateExpenseRatio(5000, 2000, 1000, 500, 10000);
      expect(result).toBe(85);
    });

    it('should handle very small values', () => {
      const result = calculator.calculateExpenseRatio(0.004, 0.003, 0.002, 0.001, 0.01);
      expect(result).toBeCloseTo(100, 2);
    });

    it('should handle very large values', () => {
      const result = calculator.calculateExpenseRatio(4000000, 3000000, 2000000, 1000000, 10000000);
      expect(result).toBe(100);
    });

    it('should handle zero expenses (100% profit)', () => {
      const result = calculator.calculateExpenseRatio(10000, 0, 0, 0, 10000);
      expect(result).toBe(100);
    });
  });

  describe('calculateLaborOutputRatio', () => {
    it('should calculate labor output ratio correctly', () => {
      const result = calculator.calculateLaborOutputRatio(10000, 2000);
      expect(result).toBe(5);
    });

    it('should return null when labor cost is zero', () => {
      const result = calculator.calculateLaborOutputRatio(10000, 0);
      expect(result).toBeNull();
    });

    it('should handle small ratios', () => {
      const result = calculator.calculateLaborOutputRatio(1000, 5000);
      expect(result).toBe(0.2);
    });

    it('should handle very small values', () => {
      const result = calculator.calculateLaborOutputRatio(0.01, 0.002);
      expect(result).toBeCloseTo(5, 2);
    });

    it('should handle very large values', () => {
      const result = calculator.calculateLaborOutputRatio(10000000, 2000000);
      expect(result).toBe(5);
    });

    it('should handle ratio of 1', () => {
      const result = calculator.calculateLaborOutputRatio(5000, 5000);
      expect(result).toBe(1);
    });
  });

  describe('calculateOutputPerEmployee', () => {
    it('should calculate output per employee correctly', () => {
      const result = calculator.calculateOutputPerEmployee(10000, 5);
      expect(result).toBe(2000);
    });

    it('should return null when employee count is zero', () => {
      const result = calculator.calculateOutputPerEmployee(10000, 0);
      expect(result).toBeNull();
    });

    it('should handle single employee', () => {
      const result = calculator.calculateOutputPerEmployee(10000, 1);
      expect(result).toBe(10000);
    });

    it('should handle very small values', () => {
      const result = calculator.calculateOutputPerEmployee(0.01, 5);
      expect(result).toBeCloseTo(0.002, 5);
    });

    it('should handle very large values', () => {
      const result = calculator.calculateOutputPerEmployee(10000000, 50);
      expect(result).toBe(200000);
    });

    it('should handle large employee count', () => {
      const result = calculator.calculateOutputPerEmployee(10000, 100);
      expect(result).toBe(100);
    });
  });

  describe('calculateEntryRate', () => {
    it('should calculate entry rate correctly', () => {
      const result = calculator.calculateEntryRate(200, 500);
      expect(result).toBe(40);
    });

    it('should return null when passing traffic is zero', () => {
      const result = calculator.calculateEntryRate(0, 0);
      expect(result).toBeNull();
    });

    it('should handle 100% entry rate', () => {
      const result = calculator.calculateEntryRate(500, 500);
      expect(result).toBe(100);
    });

    it('should handle very small values', () => {
      const result = calculator.calculateEntryRate(2, 5);
      expect(result).toBe(40);
    });

    it('should handle very large values', () => {
      const result = calculator.calculateEntryRate(200000, 500000);
      expect(result).toBe(40);
    });

    it('should handle low entry rate', () => {
      const result = calculator.calculateEntryRate(1, 1000);
      expect(result).toBe(0.1);
    });
  });

  describe('calculateConversionRate', () => {
    it('should calculate conversion rate correctly', () => {
      const result = calculator.calculateConversionRate(60, 200);
      expect(result).toBe(30);
    });

    it('should return null when entering traffic is zero', () => {
      const result = calculator.calculateConversionRate(0, 0);
      expect(result).toBeNull();
    });

    it('should handle 100% conversion rate', () => {
      const result = calculator.calculateConversionRate(200, 200);
      expect(result).toBe(100);
    });

    it('should handle very small values', () => {
      const result = calculator.calculateConversionRate(3, 10);
      expect(result).toBe(30);
    });

    it('should handle very large values', () => {
      const result = calculator.calculateConversionRate(60000, 200000);
      expect(result).toBe(30);
    });

    it('should handle low conversion rate', () => {
      const result = calculator.calculateConversionRate(1, 1000);
      expect(result).toBe(0.1);
    });
  });

  describe('calculateFinancialMetrics', () => {
    it('should calculate all financial metrics correctly', () => {
      const data = {
        revenue: 10000,
        productCost: 6000,
        adjustmentCost: 500,
        laborCost: 1500,
        rentCost: 1000,
        otherExpenses: 500,
      };

      const result = calculator.calculateFinancialMetrics(data);

      expect(result.grossProfit).toBe(3500);
      expect(result.grossProfitMargin).toBe(35);
      expect(result.profit).toBe(500);
      expect(result.netProfitMargin).toBe(5);
      expect(result.profitMargin).toBeCloseTo(14.29, 1);
      expect(result.expenseRatio).toBe(100);
    });

    it('should handle zero revenue', () => {
      const data = {
        revenue: 0,
        productCost: 0,
        adjustmentCost: 0,
        laborCost: 0,
        rentCost: 0,
        otherExpenses: 0,
      };

      const result = calculator.calculateFinancialMetrics(data);

      expect(result.grossProfit).toBe(0);
      expect(result.grossProfitMargin).toBeNull();
      expect(result.profit).toBe(0);
      expect(result.netProfitMargin).toBeNull();
      expect(result.profitMargin).toBeNull();
      expect(result.expenseRatio).toBeNull();
    });

    it('should handle very small values', () => {
      const data = {
        revenue: 0.1,
        productCost: 0.06,
        adjustmentCost: 0.005,
        laborCost: 0.015,
        rentCost: 0.01,
        otherExpenses: 0.005,
      };

      const result = calculator.calculateFinancialMetrics(data);

      expect(result.grossProfit).toBeCloseTo(0.035, 5);
      expect(result.grossProfitMargin).toBeCloseTo(35, 2);
      expect(result.profit).toBeCloseTo(0.005, 5);
      expect(result.netProfitMargin).toBeCloseTo(5, 2);
    });

    it('should handle very large values', () => {
      const data = {
        revenue: 100000000,
        productCost: 60000000,
        adjustmentCost: 5000000,
        laborCost: 15000000,
        rentCost: 10000000,
        otherExpenses: 5000000,
      };

      const result = calculator.calculateFinancialMetrics(data);

      expect(result.grossProfit).toBe(35000000);
      expect(result.grossProfitMargin).toBe(35);
      expect(result.profit).toBe(5000000);
      expect(result.netProfitMargin).toBe(5);
    });

    it('should handle loss scenario', () => {
      const data = {
        revenue: 10000,
        productCost: 8000,
        adjustmentCost: 1000,
        laborCost: 2000,
        rentCost: 1000,
        otherExpenses: 500,
      };

      const result = calculator.calculateFinancialMetrics(data);

      expect(result.grossProfit).toBe(1000);
      expect(result.grossProfitMargin).toBe(10);
      expect(result.profit).toBe(-2500);
      expect(result.netProfitMargin).toBe(-25);
      expect(result.profitMargin).toBe(-250);
    });
  });

  describe('calculateTrafficMetrics', () => {
    it('should calculate all traffic metrics correctly', () => {
      const data = {
        passingTraffic: 500,
        enteringTraffic: 200,
        transactionCount: 60,
      };

      const result = calculator.calculateTrafficMetrics(data);

      expect(result.entryRate).toBe(40);
      expect(result.conversionRate).toBe(30);
    });

    it('should handle zero traffic', () => {
      const data = {
        passingTraffic: 0,
        enteringTraffic: 0,
        transactionCount: 0,
      };

      const result = calculator.calculateTrafficMetrics(data);

      expect(result.entryRate).toBeNull();
      expect(result.conversionRate).toBeNull();
    });

    it('should handle very small traffic', () => {
      const data = {
        passingTraffic: 10,
        enteringTraffic: 4,
        transactionCount: 1,
      };

      const result = calculator.calculateTrafficMetrics(data);

      expect(result.entryRate).toBe(40);
      expect(result.conversionRate).toBe(25);
    });

    it('should handle very large traffic', () => {
      const data = {
        passingTraffic: 500000,
        enteringTraffic: 200000,
        transactionCount: 60000,
      };

      const result = calculator.calculateTrafficMetrics(data);

      expect(result.entryRate).toBe(40);
      expect(result.conversionRate).toBe(30);
    });

    it('should handle perfect conversion', () => {
      const data = {
        passingTraffic: 100,
        enteringTraffic: 100,
        transactionCount: 100,
      };

      const result = calculator.calculateTrafficMetrics(data);

      expect(result.entryRate).toBe(100);
      expect(result.conversionRate).toBe(100);
    });
  });

  describe('calculateOutputMetrics', () => {
    it('should calculate all output metrics correctly', () => {
      const result = calculator.calculateOutputMetrics(10000, 2000, 5);

      expect(result.laborOutputRatio).toBe(5);
      expect(result.outputPerEmployee).toBe(2000);
      expect(result.profitPerLabor).toBe(5);
    });

    it('should handle zero labor cost', () => {
      const result = calculator.calculateOutputMetrics(10000, 0, 5);

      expect(result.laborOutputRatio).toBeNull();
      expect(result.outputPerEmployee).toBe(2000);
      expect(result.profitPerLabor).toBeNull();
    });

    it('should handle zero employees', () => {
      const result = calculator.calculateOutputMetrics(10000, 2000, 0);

      expect(result.laborOutputRatio).toBe(5);
      expect(result.outputPerEmployee).toBeNull();
      expect(result.profitPerLabor).toBe(5);
    });

    it('should handle very small values', () => {
      const result = calculator.calculateOutputMetrics(0.1, 0.02, 5);

      expect(result.laborOutputRatio).toBeCloseTo(5, 2);
      expect(result.outputPerEmployee).toBeCloseTo(0.02, 5);
      expect(result.profitPerLabor).toBeCloseTo(5, 2);
    });

    it('should handle very large values', () => {
      const result = calculator.calculateOutputMetrics(100000000, 20000000, 500);

      expect(result.laborOutputRatio).toBe(5);
      expect(result.outputPerEmployee).toBe(200000);
      expect(result.profitPerLabor).toBe(5);
    });

    it('should handle single employee', () => {
      const result = calculator.calculateOutputMetrics(10000, 2000, 1);

      expect(result.laborOutputRatio).toBe(5);
      expect(result.outputPerEmployee).toBe(10000);
      expect(result.profitPerLabor).toBe(5);
    });

    it('should handle both zero labor cost and zero employees', () => {
      const result = calculator.calculateOutputMetrics(10000, 0, 0);

      expect(result.laborOutputRatio).toBeNull();
      expect(result.outputPerEmployee).toBeNull();
      expect(result.profitPerLabor).toBeNull();
    });
  });
});
