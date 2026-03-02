/**
 * Mock metric definitions
 * Requirements: 1.1, 1.2, 1.3
 */

import { Metric, MetricCategory } from '../types';

/**
 * Predefined metric definitions for the dashboard
 */
export const mockMetrics: Metric[] = [
  // Business Metrics - Settlement Related
  {
    id: 'revenue',
    name: '收入',
    category: MetricCategory.SETTLEMENT,
    unit: '元',
    dataType: 'currency',
    enabled: true,
  },
  
  // Business Metrics - Main Business Related
  {
    id: 'product_cost',
    name: '商品成本',
    category: MetricCategory.MAIN_BUSINESS,
    unit: '元',
    dataType: 'currency',
    enabled: true,
  },
  {
    id: 'adjustment_cost',
    name: '调价成本',
    category: MetricCategory.MAIN_BUSINESS,
    unit: '元',
    dataType: 'currency',
    enabled: true,
  },
  
  // Business Metrics - Traffic Related
  {
    id: 'passing_traffic',
    name: '过店客流',
    category: MetricCategory.TRAFFIC,
    unit: '人',
    dataType: 'number',
    enabled: true,
  },
  {
    id: 'entering_traffic',
    name: '进店客流',
    category: MetricCategory.TRAFFIC,
    unit: '人',
    dataType: 'number',
    enabled: true,
  },
  {
    id: 'transaction_count',
    name: '成交客户数',
    category: MetricCategory.TRAFFIC,
    unit: '人',
    dataType: 'number',
    enabled: true,
  },
  {
    id: 'entry_rate',
    name: '进店率',
    category: MetricCategory.TRAFFIC,
    unit: '%',
    dataType: 'percent',
    enabled: true,
    formula: 'entering_traffic / passing_traffic',
    dependencies: ['entering_traffic', 'passing_traffic'],
  },
  {
    id: 'conversion_rate',
    name: '成交率',
    category: MetricCategory.TRAFFIC,
    unit: '%',
    dataType: 'percent',
    enabled: true,
    formula: 'transaction_count / entering_traffic',
    dependencies: ['transaction_count', 'entering_traffic'],
  },
  
  // Financial Metrics - Profit Related
  {
    id: 'gross_profit',
    name: '毛利',
    category: MetricCategory.PROFIT,
    unit: '元',
    dataType: 'currency',
    enabled: true,
    formula: 'revenue - product_cost - adjustment_cost',
    dependencies: ['revenue', 'product_cost', 'adjustment_cost'],
  },
  {
    id: 'gross_profit_margin',
    name: '毛利率',
    category: MetricCategory.PROFIT,
    unit: '%',
    dataType: 'percent',
    enabled: true,
    formula: 'gross_profit / revenue',
    dependencies: ['gross_profit', 'revenue'],
  },
  {
    id: 'profit',
    name: '利润',
    category: MetricCategory.PROFIT,
    unit: '元',
    dataType: 'currency',
    enabled: true,
    formula: 'gross_profit - labor_cost - rent_cost - other_expenses',
    dependencies: ['gross_profit', 'labor_cost', 'rent_cost', 'other_expenses'],
  },
  {
    id: 'net_profit_margin',
    name: '净利率',
    category: MetricCategory.PROFIT,
    unit: '%',
    dataType: 'percent',
    enabled: true,
    formula: 'profit / revenue',
    dependencies: ['profit', 'revenue'],
  },
  {
    id: 'profit_margin',
    name: '利润率',
    category: MetricCategory.PROFIT,
    unit: '%',
    dataType: 'percent',
    enabled: true,
    formula: 'profit / gross_profit',
    dependencies: ['profit', 'gross_profit'],
  },
  
  // Financial Metrics - Revenue & Cost
  {
    id: 'total_cost',
    name: '总成本',
    category: MetricCategory.REVENUE_COST,
    unit: '元',
    dataType: 'currency',
    enabled: true,
    formula: 'product_cost + adjustment_cost',
    dependencies: ['product_cost', 'adjustment_cost'],
  },
  
  // Financial Metrics - Expense
  {
    id: 'labor_cost',
    name: '工费',
    category: MetricCategory.EXPENSE,
    unit: '元',
    dataType: 'currency',
    enabled: true,
  },
  {
    id: 'rent_cost',
    name: '租费',
    category: MetricCategory.EXPENSE,
    unit: '元',
    dataType: 'currency',
    enabled: true,
  },
  {
    id: 'other_expenses',
    name: '其他费用',
    category: MetricCategory.EXPENSE,
    unit: '元',
    dataType: 'currency',
    enabled: true,
  },
  {
    id: 'total_expenses',
    name: '总费用',
    category: MetricCategory.EXPENSE,
    unit: '元',
    dataType: 'currency',
    enabled: true,
    formula: 'labor_cost + rent_cost + other_expenses',
    dependencies: ['labor_cost', 'rent_cost', 'other_expenses'],
  },
  {
    id: 'expense_ratio',
    name: '费用占比',
    category: MetricCategory.EXPENSE,
    unit: '%',
    dataType: 'percent',
    enabled: true,
    formula: '(profit + labor_cost + rent_cost + other_expenses) / gross_profit',
    dependencies: ['profit', 'labor_cost', 'rent_cost', 'other_expenses', 'gross_profit'],
  },
  
  // Financial Metrics - Output Related
  {
    id: 'labor_output_ratio',
    name: '毛利工费比',
    category: MetricCategory.OUTPUT,
    unit: '倍',
    dataType: 'number',
    enabled: true,
    formula: 'gross_profit / labor_cost',
    dependencies: ['gross_profit', 'labor_cost'],
  },
  {
    id: 'output_per_employee',
    name: '人工产出',
    category: MetricCategory.OUTPUT,
    unit: '元/人',
    dataType: 'currency',
    enabled: true,
    formula: 'gross_profit / employee_count',
    dependencies: ['gross_profit', 'employee_count'],
  },
];

/**
 * Get metric by ID
 */
export function getMetricById(id: string): Metric | undefined {
  return mockMetrics.find(m => m.id === id);
}

/**
 * Get metrics by category
 */
export function getMetricsByCategory(category: MetricCategory): Metric[] {
  return mockMetrics.filter(m => m.category === category);
}

/**
 * Get all enabled metrics
 */
export function getEnabledMetrics(): Metric[] {
  return mockMetrics.filter(m => m.enabled);
}
