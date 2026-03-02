/**
 * MetricCalculator - Core calculation engine for business metrics
 * 
 * Requirements: 4.1, 4.2, 5.1, 5.2, 5.3, 5.4, 7.1, 7.2, 7.3, 8.3, 8.4
 * 
 * This class provides methods to calculate various financial and business metrics
 * with proper handling of division by zero cases (returns null).
 */

import {
  FinancialData,
  CalculatedFinancialMetrics,
  CalculatedTrafficMetrics,
  CalculatedOutputMetrics,
  TrafficData,
} from '../types/calculation';

export class MetricCalculator {
  /**
   * Calculate gross profit
   * Formula: 毛利 = 收入 - 商品成本 - 调价成本
   * 
   * Requirements: 4.1, 4.5
   * 
   * @param revenue - 收入
   * @param productCost - 商品成本
   * @param adjustmentCost - 调价成本
   * @returns Gross profit or null if calculation is invalid
   */
  calculateGrossProfit(
    revenue: number,
    productCost: number,
    adjustmentCost: number
  ): number {
    return revenue - productCost - adjustmentCost;
  }

  /**
   * Calculate gross profit margin
   * Formula: 毛利率 = (毛利 / 收入) × 100%
   * 
   * Requirements: 4.2
   * 
   * @param grossProfit - 毛利
   * @param revenue - 收入
   * @returns Gross profit margin as percentage or null if revenue is zero
   */
  calculateGrossProfitMargin(grossProfit: number, revenue: number): number | null {
    if (revenue === 0) {
      return null;
    }
    return (grossProfit / revenue) * 100;
  }

  /**
   * Calculate profit (net profit)
   * Formula: 利润 = 毛利 - 工费 - 租费 - 其他费用
   * 
   * Requirements: 5.1
   * 
   * @param grossProfit - 毛利
   * @param laborCost - 工费（人工成本）
   * @param rentCost - 租费
   * @param otherExpenses - 其他费用
   * @returns Net profit
   */
  calculateProfit(
    grossProfit: number,
    laborCost: number,
    rentCost: number,
    otherExpenses: number
  ): number {
    return grossProfit - laborCost - rentCost - otherExpenses;
  }

  /**
   * Calculate net profit margin
   * Formula: 净利率 = (利润 / 收入) × 100%
   * 
   * Requirements: 5.2
   * 
   * @param profit - 利润
   * @param revenue - 收入
   * @returns Net profit margin as percentage or null if revenue is zero
   */
  calculateNetProfitMargin(profit: number, revenue: number): number | null {
    if (revenue === 0) {
      return null;
    }
    return (profit / revenue) * 100;
  }

  /**
   * Calculate profit margin (profit to gross profit ratio)
   * Formula: 利润率 = (利润 / 毛利) × 100%
   * 
   * Requirements: 5.3
   * 
   * @param profit - 利润
   * @param grossProfit - 毛利
   * @returns Profit margin as percentage or null if gross profit is zero
   */
  calculateProfitMargin(profit: number, grossProfit: number): number | null {
    if (grossProfit === 0) {
      return null;
    }
    return (profit / grossProfit) * 100;
  }

  /**
   * Calculate expense ratio
   * Formula: 费用占比 = (利润 + 工费 + 租费 + 其他费用) / 毛利 × 100%
   * 
   * Note: This formula essentially calculates (Total Expenses / Gross Profit) × 100%
   * since (Profit + All Expenses) = Gross Profit
   * 
   * Requirements: 5.4
   * 
   * @param profit - 利润
   * @param laborCost - 工费
   * @param rentCost - 租费
   * @param otherExpenses - 其他费用
   * @param grossProfit - 毛利
   * @returns Expense ratio as percentage or null if gross profit is zero
   */
  calculateExpenseRatio(
    profit: number,
    laborCost: number,
    rentCost: number,
    otherExpenses: number,
    grossProfit: number
  ): number | null {
    if (grossProfit === 0) {
      return null;
    }
    return ((profit + laborCost + rentCost + otherExpenses) / grossProfit) * 100;
  }

  /**
   * Calculate labor output ratio (gross profit to labor cost ratio)
   * Formula: 毛利工费比 = 毛利 / 工费
   * 
   * Requirements: 7.1, 7.3
   * 
   * @param grossProfit - 毛利
   * @param laborCost - 工费
   * @returns Labor output ratio or null if labor cost is zero
   */
  calculateLaborOutputRatio(grossProfit: number, laborCost: number): number | null {
    if (laborCost === 0) {
      return null;
    }
    return grossProfit / laborCost;
  }

  /**
   * Calculate output per employee
   * Formula: 人工产出 = 毛利 / 员工人数
   * 
   * Requirements: 7.2
   * 
   * @param grossProfit - 毛利
   * @param employeeCount - 员工人数
   * @returns Output per employee or null if employee count is zero
   */
  calculateOutputPerEmployee(grossProfit: number, employeeCount: number): number | null {
    if (employeeCount === 0) {
      return null;
    }
    return grossProfit / employeeCount;
  }

  /**
   * Calculate entry rate (store entry conversion from passing traffic)
   * Formula: 进店率 = (进店客流 / 过店客流) × 100%
   * 
   * Requirements: 8.3
   * 
   * @param enteringTraffic - 进店客流
   * @param passingTraffic - 过店客流
   * @returns Entry rate as percentage or null if passing traffic is zero
   */
  calculateEntryRate(enteringTraffic: number, passingTraffic: number): number | null {
    if (passingTraffic === 0) {
      return null;
    }
    return (enteringTraffic / passingTraffic) * 100;
  }

  /**
   * Calculate conversion rate (transaction conversion from entering traffic)
   * Formula: 成交率 = (成交客户数 / 进店客流) × 100%
   * 
   * Requirements: 8.4
   * 
   * @param transactionCount - 成交客户数
   * @param enteringTraffic - 进店客流
   * @returns Conversion rate as percentage or null if entering traffic is zero
   */
  calculateConversionRate(transactionCount: number, enteringTraffic: number): number | null {
    if (enteringTraffic === 0) {
      return null;
    }
    return (transactionCount / enteringTraffic) * 100;
  }

  /**
   * Calculate all financial metrics from raw financial data
   * 
   * Requirements: 4.1, 4.2, 5.1, 5.2, 5.3, 5.4
   * 
   * @param data - Raw financial data
   * @returns Calculated financial metrics
   */
  calculateFinancialMetrics(data: FinancialData): CalculatedFinancialMetrics {
    const grossProfit = this.calculateGrossProfit(
      data.revenue,
      data.productCost,
      data.adjustmentCost
    );

    const grossProfitMargin = this.calculateGrossProfitMargin(grossProfit, data.revenue);

    const profit = this.calculateProfit(
      grossProfit,
      data.laborCost,
      data.rentCost,
      data.otherExpenses
    );

    const netProfitMargin = this.calculateNetProfitMargin(profit, data.revenue);
    const profitMargin = this.calculateProfitMargin(profit, grossProfit);
    const expenseRatio = this.calculateExpenseRatio(
      profit,
      data.laborCost,
      data.rentCost,
      data.otherExpenses,
      grossProfit
    );

    return {
      grossProfit,
      grossProfitMargin,
      profit,
      netProfitMargin,
      profitMargin,
      expenseRatio,
    };
  }

  /**
   * Calculate all traffic metrics from raw traffic data
   * 
   * Requirements: 8.3, 8.4
   * 
   * @param data - Raw traffic data
   * @returns Calculated traffic metrics
   */
  calculateTrafficMetrics(data: TrafficData): CalculatedTrafficMetrics {
    const entryRate = this.calculateEntryRate(data.enteringTraffic, data.passingTraffic);
    const conversionRate = this.calculateConversionRate(
      data.transactionCount,
      data.enteringTraffic
    );

    return {
      entryRate,
      conversionRate,
    };
  }

  /**
   * Calculate all output efficiency metrics
   * 
   * Requirements: 7.1, 7.2, 7.3
   * 
   * @param grossProfit - 毛利
   * @param laborCost - 工费
   * @param employeeCount - 员工人数
   * @returns Calculated output metrics
   */
  calculateOutputMetrics(
    grossProfit: number,
    laborCost: number,
    employeeCount: number
  ): CalculatedOutputMetrics {
    const laborOutputRatio = this.calculateLaborOutputRatio(grossProfit, laborCost);
    const outputPerEmployee = this.calculateOutputPerEmployee(grossProfit, employeeCount);
    const profitPerLabor = laborOutputRatio; // Same as laborOutputRatio

    return {
      laborOutputRatio,
      outputPerEmployee,
      profitPerLabor,
    };
  }
}

// Export a singleton instance for convenience
export const metricCalculator = new MetricCalculator();
