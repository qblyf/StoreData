/**
 * Calculation-related type definitions
 * Based on requirements for metric calculations
 */

/**
 * Raw financial data inputs
 * Requirements: 4.1, 4.5, 5.1
 */
export interface FinancialData {
  revenue: number;
  productCost: number;
  adjustmentCost: number;
  laborCost: number;
  rentCost: number;
  otherExpenses: number;
}

/**
 * Labor cost breakdown
 * Requirements: 6.1
 */
export interface LaborCost {
  salesExpense: number;
  managementExpense: number;
}

/**
 * Rent cost breakdown
 * Requirements: 6.2
 */
export interface RentCost {
  rentAmortization: number;
  otherFees: number;
}

/**
 * Other expenses
 * Requirements: 6.3, 6.4
 */
export interface OtherExpenses {
  paymentFees: number;
  subsidyFees: number;
  commissionFees: number;
}

/**
 * Traffic data
 * Requirements: 8.1, 8.2
 */
export interface TrafficData {
  passingTraffic: number;
  enteringTraffic: number;
  transactionCount: number;
}

/**
 * Calculated financial metrics
 * Requirements: 4.1, 4.2, 5.1, 5.2, 5.3, 5.4
 */
export interface CalculatedFinancialMetrics {
  grossProfit: number | null;
  grossProfitMargin: number | null;
  profit: number | null;
  netProfitMargin: number | null;
  profitMargin: number | null;
  expenseRatio: number | null;
}

/**
 * Calculated traffic metrics
 * Requirements: 8.3, 8.4
 */
export interface CalculatedTrafficMetrics {
  entryRate: number | null;
  conversionRate: number | null;
}

/**
 * Calculated output metrics
 * Requirements: 7.1, 7.2, 7.3
 */
export interface CalculatedOutputMetrics {
  laborOutputRatio: number | null;
  outputPerEmployee: number | null;
  profitPerLabor: number | null;
}

/**
 * Complete calculated metrics
 */
export interface CalculatedMetrics {
  financial: CalculatedFinancialMetrics;
  traffic: CalculatedTrafficMetrics;
  output: CalculatedOutputMetrics;
}

/**
 * Calculation input for a specific metric
 */
export interface CalculationInput {
  metricId: string;
  inputs: Record<string, number>;
  timestamp: Date;
}

/**
 * Calculation result
 */
export interface CalculationResult {
  metricId: string;
  value: number | null;
  inputs: Record<string, number>;
  formula: string;
  timestamp: Date;
  error?: string;
}
