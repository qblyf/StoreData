/**
 * Property-Based Tests for MetricCalculator
 * 
 * These tests verify that calculation formulas hold true across all valid inputs
 * using fast-check library with at least 100 iterations per property.
 * 
 * Task 2.4: 编写指标计算公式的属性测试
 */

import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { MetricCalculator } from './MetricCalculator';

const calculator = new MetricCalculator();

// ============================================================================
// Custom Arbitraries (Generators)
// ============================================================================

/**
 * Generator for non-negative financial values
 * Includes edge cases: 0, small values, normal values, large values
 */
const financialValueArbitrary = fc.oneof(
  fc.constant(0),                           // Zero edge case
  fc.double({ min: 0.01, max: 100, noNaN: true }),      // Small values
  fc.double({ min: 100, max: 1000000, noNaN: true }),   // Normal values
  fc.double({ min: 1000000, max: 100000000, noNaN: true }) // Large values
);

/**
 * Generator for positive integers (employee count, customer count)
 */
const positiveIntegerArbitrary = fc.oneof(
  fc.constant(1),                          // Minimum value
  fc.integer({ min: 1, max: 10 }),        // Small counts
  fc.integer({ min: 10, max: 100 }),      // Normal counts
  fc.integer({ min: 100, max: 1000 })     // Large counts
);

/**
 * Generator for non-negative integers (traffic counts)
 */
const nonNegativeIntegerArbitrary = fc.oneof(
  fc.constant(0),                          // Zero edge case
  fc.integer({ min: 1, max: 100 }),       // Small counts
  fc.integer({ min: 100, max: 10000 }),   // Normal counts
  fc.integer({ min: 10000, max: 1000000 }) // Large counts
);

// ============================================================================
// Property 11: 毛利计算公式
// ============================================================================

describe('Property-Based Tests - Metric Calculation Formulas', () => {
  /**
   * Feature: business-metrics-logic-system
   * Property 11: 毛利计算公式
   * 
   * 对于任意收入、商品成本和调价成本的组合，
   * 系统计算的毛利应该等于收入减去商品成本再减去调价成本。
   * 
   * **Validates: Requirements 4.1, 4.5**
   */
  test('Property 11: Gross profit calculation formula', () => {
    fc.assert(
      fc.property(
        fc.record({
          revenue: financialValueArbitrary,
          productCost: financialValueArbitrary,
          adjustmentCost: financialValueArbitrary
        }),
        (data) => {
          const result = calculator.calculateGrossProfit(
            data.revenue,
            data.productCost,
            data.adjustmentCost
          );
          
          const expected = data.revenue - data.productCost - data.adjustmentCost;
          
          // Use toBeCloseTo to handle floating point precision issues
          expect(result).toBeCloseTo(expected, 10);
        }
      ),
      { numRuns: 100 }
    );
  });

  // ============================================================================
  // Property 12: 毛利率计算公式
  // ============================================================================

  /**
   * Feature: business-metrics-logic-system
   * Property 12: 毛利率计算公式
   * 
   * 对于任意非零收入和对应的毛利，
   * 系统计算的毛利率应该等于毛利除以收入。
   * 
   * **Validates: Requirements 4.2**
   */
  test('Property 12: Gross profit margin calculation formula', () => {
    fc.assert(
      fc.property(
        fc.record({
          grossProfit: financialValueArbitrary,
          revenue: fc.double({ min: 0.01, max: 100000000, noNaN: true }) // Non-zero revenue
        }),
        (data) => {
          const result = calculator.calculateGrossProfitMargin(
            data.grossProfit,
            data.revenue
          );
          
          const expected = (data.grossProfit / data.revenue) * 100;
          
          expect(result).not.toBeNull();
          expect(result).toBeCloseTo(expected, 10);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 12 (Edge Case): Gross profit margin with zero revenue
   * 
   * When revenue is zero, the system should return null
   */
  test('Property 12 (Edge Case): Gross profit margin returns null for zero revenue', () => {
    fc.assert(
      fc.property(
        financialValueArbitrary,
        (grossProfit) => {
          const result = calculator.calculateGrossProfitMargin(grossProfit, 0);
          expect(result).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  // ============================================================================
  // Property 14: 利润计算公式
  // ============================================================================

  /**
   * Feature: business-metrics-logic-system
   * Property 14: 利润计算公式
   * 
   * 对于任意毛利、工费、租费和其他费用的组合，
   * 系统计算的利润应该等于毛利减去工费、租费和其他费用之和。
   * 
   * **Validates: Requirements 5.1**
   */
  test('Property 14: Profit calculation formula', () => {
    fc.assert(
      fc.property(
        fc.record({
          grossProfit: financialValueArbitrary,
          laborCost: financialValueArbitrary,
          rentCost: financialValueArbitrary,
          otherExpenses: financialValueArbitrary
        }),
        (data) => {
          const result = calculator.calculateProfit(
            data.grossProfit,
            data.laborCost,
            data.rentCost,
            data.otherExpenses
          );
          
          const expected = data.grossProfit - data.laborCost - data.rentCost - data.otherExpenses;
          
          expect(result).toBeCloseTo(expected, 10);
        }
      ),
      { numRuns: 100 }
    );
  });

  // ============================================================================
  // Property 15: 利润率计算公式
  // ============================================================================

  /**
   * Feature: business-metrics-logic-system
   * Property 15: 利润率计算公式
   * 
   * 对于任意非零毛利和对应的利润，系统计算的利润率应该等于利润除以毛利，
   * 净利率应该等于利润除以收入。
   * 
   * **Validates: Requirements 5.2, 5.3**
   */
  test('Property 15a: Profit margin (profit/gross profit) calculation formula', () => {
    fc.assert(
      fc.property(
        fc.record({
          profit: financialValueArbitrary,
          grossProfit: fc.double({ min: 0.01, max: 100000000, noNaN: true }) // Non-zero gross profit
        }),
        (data) => {
          const result = calculator.calculateProfitMargin(
            data.profit,
            data.grossProfit
          );
          
          const expected = (data.profit / data.grossProfit) * 100;
          
          expect(result).not.toBeNull();
          expect(result).toBeCloseTo(expected, 10);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 15b: Net profit margin (profit/revenue) calculation formula', () => {
    fc.assert(
      fc.property(
        fc.record({
          profit: financialValueArbitrary,
          revenue: fc.double({ min: 0.01, max: 100000000, noNaN: true }) // Non-zero revenue
        }),
        (data) => {
          const result = calculator.calculateNetProfitMargin(
            data.profit,
            data.revenue
          );
          
          const expected = (data.profit / data.revenue) * 100;
          
          expect(result).not.toBeNull();
          expect(result).toBeCloseTo(expected, 10);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 15 (Edge Cases): Profit margin with zero denominators
   */
  test('Property 15 (Edge Case): Profit margin returns null for zero gross profit', () => {
    fc.assert(
      fc.property(
        financialValueArbitrary,
        (profit) => {
          const result = calculator.calculateProfitMargin(profit, 0);
          expect(result).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 15 (Edge Case): Net profit margin returns null for zero revenue', () => {
    fc.assert(
      fc.property(
        financialValueArbitrary,
        (profit) => {
          const result = calculator.calculateNetProfitMargin(profit, 0);
          expect(result).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  // ============================================================================
  // Property 19: 产出效率计算公式
  // ============================================================================

  /**
   * Feature: business-metrics-logic-system
   * Property 19: 产出效率计算公式
   * 
   * 对于任意非零工费和员工人数，毛利工费比应该等于毛利除以工费，
   * 人工产出应该等于毛利除以员工人数。
   * 
   * **Validates: Requirements 7.1, 7.2, 7.3**
   */
  test('Property 19a: Labor output ratio (gross profit/labor cost) calculation formula', () => {
    fc.assert(
      fc.property(
        fc.record({
          grossProfit: financialValueArbitrary,
          laborCost: fc.double({ min: 0.01, max: 100000000, noNaN: true }) // Non-zero labor cost
        }),
        (data) => {
          const result = calculator.calculateLaborOutputRatio(
            data.grossProfit,
            data.laborCost
          );
          
          const expected = data.grossProfit / data.laborCost;
          
          expect(result).not.toBeNull();
          expect(result).toBeCloseTo(expected, 10);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 19b: Output per employee (gross profit/employee count) calculation formula', () => {
    fc.assert(
      fc.property(
        fc.record({
          grossProfit: financialValueArbitrary,
          employeeCount: positiveIntegerArbitrary // Non-zero employee count
        }),
        (data) => {
          const result = calculator.calculateOutputPerEmployee(
            data.grossProfit,
            data.employeeCount
          );
          
          const expected = data.grossProfit / data.employeeCount;
          
          expect(result).not.toBeNull();
          expect(result).toBeCloseTo(expected, 10);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 19 (Edge Cases): Output efficiency with zero denominators
   */
  test('Property 19 (Edge Case): Labor output ratio returns null for zero labor cost', () => {
    fc.assert(
      fc.property(
        financialValueArbitrary,
        (grossProfit) => {
          const result = calculator.calculateLaborOutputRatio(grossProfit, 0);
          expect(result).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 19 (Edge Case): Output per employee returns null for zero employee count', () => {
    fc.assert(
      fc.property(
        financialValueArbitrary,
        (grossProfit) => {
          const result = calculator.calculateOutputPerEmployee(grossProfit, 0);
          expect(result).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  // ============================================================================
  // Property 21: 客流转化率计算公式
  // ============================================================================

  /**
   * Feature: business-metrics-logic-system
   * Property 21: 客流转化率计算公式
   * 
   * 对于任意非零过店客流和进店客流，进店率应该等于进店客流除以过店客流；
   * 对于任意非零进店客流和成交客户数，成交率应该等于成交客户数除以进店客流。
   * 
   * **Validates: Requirements 8.3, 8.4**
   */
  test('Property 21a: Entry rate (entering traffic/passing traffic) calculation formula', () => {
    fc.assert(
      fc.property(
        fc.record({
          enteringTraffic: nonNegativeIntegerArbitrary,
          passingTraffic: fc.integer({ min: 1, max: 1000000 }) // Non-zero passing traffic
        }),
        (data) => {
          const result = calculator.calculateEntryRate(
            data.enteringTraffic,
            data.passingTraffic
          );
          
          const expected = (data.enteringTraffic / data.passingTraffic) * 100;
          
          expect(result).not.toBeNull();
          expect(result).toBeCloseTo(expected, 10);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 21b: Conversion rate (transaction count/entering traffic) calculation formula', () => {
    fc.assert(
      fc.property(
        fc.record({
          transactionCount: nonNegativeIntegerArbitrary,
          enteringTraffic: fc.integer({ min: 1, max: 1000000 }) // Non-zero entering traffic
        }),
        (data) => {
          const result = calculator.calculateConversionRate(
            data.transactionCount,
            data.enteringTraffic
          );
          
          const expected = (data.transactionCount / data.enteringTraffic) * 100;
          
          expect(result).not.toBeNull();
          expect(result).toBeCloseTo(expected, 10);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 21 (Edge Cases): Traffic conversion rates with zero denominators
   */
  test('Property 21 (Edge Case): Entry rate returns null for zero passing traffic', () => {
    fc.assert(
      fc.property(
        nonNegativeIntegerArbitrary,
        (enteringTraffic) => {
          const result = calculator.calculateEntryRate(enteringTraffic, 0);
          expect(result).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 21 (Edge Case): Conversion rate returns null for zero entering traffic', () => {
    fc.assert(
      fc.property(
        nonNegativeIntegerArbitrary,
        (transactionCount) => {
          const result = calculator.calculateConversionRate(transactionCount, 0);
          expect(result).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });
});
