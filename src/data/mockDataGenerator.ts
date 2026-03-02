/**
 * Mock data generator for metrics
 * Requirements: 4.1, 4.2, 5.1, 5.2, 7.1, 7.2, 8.3, 8.4
 */

import { MetricValue, TimeGranularity, TargetSetting, TimePeriod } from '../types';
import { mockStores } from './mockStores';

/**
 * Raw data for a single time point
 */
interface RawDataPoint {
  storeId: string;
  timestamp: Date;
  revenue: number;
  productCost: number;
  adjustmentCost: number;
  laborCost: number;
  rentCost: number;
  otherExpenses: number;
  marketingExpenses: number;
  fixedAssets: number;
  passingTraffic: number;
  enteringTraffic: number;
  transactionCount: number;
}

/**
 * Generate random number within range
 */
function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random float within range
 */
function randomFloat(min: number, max: number, decimals: number = 2): number {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

/**
 * Calculate gross profit
 * Requirements: 4.1, 4.5
 */
function calculateGrossProfit(revenue: number, productCost: number, adjustmentCost: number): number {
  return revenue - productCost - adjustmentCost;
}

/**
 * Calculate gross profit margin
 * Requirements: 4.2
 */
function calculateGrossProfitMargin(grossProfit: number, revenue: number): number | null {
  if (revenue === 0) return null;
  return (grossProfit / revenue) * 100;
}

/**
 * Calculate profit
 * Requirements: 5.1
 */
function calculateProfit(
  grossProfit: number,
  laborCost: number,
  rentCost: number,
  otherExpenses: number
): number {
  return grossProfit - laborCost - rentCost - otherExpenses;
}

/**
 * Calculate net profit margin
 * Requirements: 5.2
 */
function calculateNetProfitMargin(profit: number, revenue: number): number | null {
  if (revenue === 0) return null;
  return (profit / revenue) * 100;
}

/**
 * Calculate profit margin
 * Requirements: 5.3
 */
function calculateProfitMargin(profit: number, grossProfit: number): number | null {
  if (grossProfit === 0) return null;
  return (profit / grossProfit) * 100;
}

/**
 * Calculate expense ratio
 * Requirements: 5.4
 */
function calculateExpenseRatio(
  profit: number,
  laborCost: number,
  rentCost: number,
  otherExpenses: number,
  grossProfit: number
): number | null {
  if (grossProfit === 0) return null;
  return ((profit + laborCost + rentCost + otherExpenses) / grossProfit) * 100;
}

/**
 * Calculate labor output ratio
 * Requirements: 7.1, 7.3
 */
function calculateLaborOutputRatio(grossProfit: number, laborCost: number): number | null {
  if (laborCost === 0) return null;
  return grossProfit / laborCost;
}

/**
 * Calculate rent output ratio
 * Requirements: 7.2
 * Formula: 租费产出 = 毛利 ÷ 租费
 */
function calculateRentOutputRatio(grossProfit: number, rentCost: number): number | null {
  if (rentCost === 0) return null;
  return grossProfit / rentCost;
}

/**
 * Calculate rent traffic cost
 * Requirements: 7.2
 * Formula: 租费客流 = (租费 + 营销费用) ÷ 进店人数
 */
function calculateRentTrafficCost(rentCost: number, marketingExpenses: number, enteringTraffic: number): number | null {
  if (enteringTraffic === 0) return null;
  return (rentCost + marketingExpenses) / enteringTraffic;
}

/**
 * Calculate return on investment (ROI)
 * Requirements: 5.1
 * Formula: 投资回报率 = 利润 ÷ 固定资产 × 100%
 */
function calculateROI(profit: number, fixedAssets: number): number | null {
  if (fixedAssets === 0) return null;
  return (profit / fixedAssets) * 100;
}

/**
 * Calculate output per employee
 * Requirements: 7.2
 */
function calculateOutputPerEmployee(grossProfit: number, employeeCount: number): number | null {
  if (employeeCount === 0) return null;
  return grossProfit / employeeCount;
}

/**
 * Calculate entry rate
 * Requirements: 8.3
 */
function calculateEntryRate(enteringTraffic: number, passingTraffic: number): number | null {
  if (passingTraffic === 0) return null;
  return (enteringTraffic / passingTraffic) * 100;
}

/**
 * Calculate conversion rate
 * Requirements: 8.4
 */
function calculateConversionRate(transactionCount: number, enteringTraffic: number): number | null {
  if (enteringTraffic === 0) return null;
  return (transactionCount / enteringTraffic) * 100;
}

/**
 * Generate raw data for a store at a specific time
 */
function generateRawDataPoint(storeId: string, timestamp: Date): RawDataPoint {
  const store = mockStores.find(s => s.id === storeId);
  if (!store) {
    throw new Error(`Store not found: ${storeId}`);
  }

  // Base values depend on store type and level
  let revenueBase = 50000;
  let trafficBase = 200;
  
  // Adjust based on store type
  switch (store.type) {
    case 'flagship':
      revenueBase = 150000;
      trafficBase = 500;
      break;
    case 'standard':
      revenueBase = 80000;
      trafficBase = 300;
      break;
    case 'mini':
      revenueBase = 40000;
      trafficBase = 150;
      break;
  }
  
  // Adjust based on store level
  switch (store.level) {
    case 'A':
      revenueBase *= 1.2;
      trafficBase *= 1.2;
      break;
    case 'B':
      revenueBase *= 1.0;
      trafficBase *= 1.0;
      break;
    case 'C':
      revenueBase *= 0.8;
      trafficBase *= 0.8;
      break;
    case 'D':
      revenueBase *= 0.6;
      trafficBase *= 0.6;
      break;
  }

  // Add some randomness (±20%)
  const revenue = randomFloat(revenueBase * 0.8, revenueBase * 1.2);
  const productCost = randomFloat(revenue * 0.45, revenue * 0.55); // 45-55% of revenue
  const adjustmentCost = randomFloat(revenue * 0.02, revenue * 0.05); // 2-5% of revenue
  const laborCost = randomFloat(revenue * 0.12, revenue * 0.18); // 12-18% of revenue
  const rentCost = randomFloat(revenue * 0.08, revenue * 0.12); // 8-12% of revenue
  const otherExpenses = randomFloat(revenue * 0.03, revenue * 0.06); // 3-6% of revenue
  const marketingExpenses = randomFloat(revenue * 0.02, revenue * 0.04); // 2-4% of revenue
  
  // Fixed assets based on store type (装修、设备等固定资产投入)
  let fixedAssetsBase = 300000; // 基础固定资产
  switch (store.type) {
    case 'flagship':
      fixedAssetsBase = 800000;
      break;
    case 'standard':
      fixedAssetsBase = 500000;
      break;
    case 'mini':
      fixedAssetsBase = 250000;
      break;
  }
  const fixedAssets = randomFloat(fixedAssetsBase * 0.9, fixedAssetsBase * 1.1);
  
  const passingTraffic = randomInRange(Math.floor(trafficBase * 0.8), Math.floor(trafficBase * 1.2));
  const enteringTraffic = randomInRange(Math.floor(passingTraffic * 0.3), Math.floor(passingTraffic * 0.5));
  const transactionCount = randomInRange(Math.floor(enteringTraffic * 0.2), Math.floor(enteringTraffic * 0.4));

  return {
    storeId,
    timestamp,
    revenue,
    productCost,
    adjustmentCost,
    laborCost,
    rentCost,
    otherExpenses,
    marketingExpenses,
    fixedAssets,
    passingTraffic,
    enteringTraffic,
    transactionCount,
  };
}

/**
 * Generate metric values from raw data
 */
function generateMetricValuesFromRawData(rawData: RawDataPoint, employeeCount: number): MetricValue[] {
  const { storeId, timestamp, revenue, productCost, adjustmentCost, laborCost, rentCost, otherExpenses, marketingExpenses, fixedAssets, passingTraffic, enteringTraffic, transactionCount } = rawData;
  
  // Calculate derived metrics
  const grossProfit = calculateGrossProfit(revenue, productCost, adjustmentCost);
  const grossProfitMargin = calculateGrossProfitMargin(grossProfit, revenue);
  const profit = calculateProfit(grossProfit, laborCost, rentCost, otherExpenses);
  const netProfitMargin = calculateNetProfitMargin(profit, revenue);
  const profitMargin = calculateProfitMargin(profit, grossProfit);
  const roi = calculateROI(profit, fixedAssets);
  const expenseRatio = calculateExpenseRatio(profit, laborCost, rentCost, otherExpenses, grossProfit);
  const laborOutputRatio = calculateLaborOutputRatio(grossProfit, laborCost);
  const rentOutputRatio = calculateRentOutputRatio(grossProfit, rentCost);
  const rentTrafficCost = calculateRentTrafficCost(rentCost, marketingExpenses, enteringTraffic);
  const outputPerEmployee = calculateOutputPerEmployee(grossProfit, employeeCount);
  const entryRate = calculateEntryRate(enteringTraffic, passingTraffic);
  const conversionRate = calculateConversionRate(transactionCount, enteringTraffic);
  
  const totalCost = productCost + adjustmentCost;
  const totalExpenses = laborCost + rentCost + otherExpenses;
  
  // Calculate additional traffic metrics
  const totalTraffic = passingTraffic + enteringTraffic;
  const trafficConversionRate = totalTraffic > 0 ? (transactionCount / totalTraffic) * 100 : null;

  return [
    // Raw metrics
    { metricId: 'revenue', storeId, value: revenue, unit: '元', timestamp },
    { metricId: 'product_cost', storeId, value: productCost, unit: '元', timestamp },
    { metricId: 'adjustment_cost', storeId, value: adjustmentCost, unit: '元', timestamp },
    { metricId: 'labor_cost', storeId, value: laborCost, unit: '元', timestamp },
    { metricId: 'rent_cost', storeId, value: rentCost, unit: '元', timestamp },
    { metricId: 'other_expenses', storeId, value: otherExpenses, unit: '元', timestamp },
    { metricId: 'marketing_expenses', storeId, value: marketingExpenses, unit: '元', timestamp },
    { metricId: 'fixed_assets', storeId, value: fixedAssets, unit: '元', timestamp },
    { metricId: 'passing_traffic', storeId, value: passingTraffic, unit: '人', timestamp },
    { metricId: 'entering_traffic', storeId, value: enteringTraffic, unit: '人', timestamp },
    { metricId: 'transaction_count', storeId, value: transactionCount, unit: '人', timestamp },
    { metricId: 'total_traffic', storeId, value: totalTraffic, unit: '人', timestamp },
    { metricId: 'traffic_conversion_rate', storeId, value: trafficConversionRate, unit: '%', timestamp },
    
    // Calculated metrics
    { metricId: 'gross_profit', storeId, value: grossProfit, unit: '元', timestamp },
    { metricId: 'gross_profit_margin', storeId, value: grossProfitMargin, unit: '%', timestamp },
    { metricId: 'profit', storeId, value: profit, unit: '元', timestamp },
    { metricId: 'net_profit_margin', storeId, value: netProfitMargin, unit: '%', timestamp },
    { metricId: 'profit_margin', storeId, value: profitMargin, unit: '%', timestamp },
    { metricId: 'roi', storeId, value: roi, unit: '%', timestamp },
    { metricId: 'total_cost', storeId, value: totalCost, unit: '元', timestamp },
    { metricId: 'total_expenses', storeId, value: totalExpenses, unit: '元', timestamp },
    { metricId: 'expense_ratio', storeId, value: expenseRatio, unit: '%', timestamp },
    { metricId: 'labor_output_ratio', storeId, value: laborOutputRatio, unit: '倍', timestamp },
    { metricId: 'rent_output_ratio', storeId, value: rentOutputRatio, unit: '倍', timestamp },
    { metricId: 'rent_traffic_cost', storeId, value: rentTrafficCost, unit: '元/人', timestamp },
    { metricId: 'output_per_employee', storeId, value: outputPerEmployee, unit: '元/人', timestamp },
    { metricId: 'entry_rate', storeId, value: entryRate, unit: '%', timestamp },
    { metricId: 'conversion_rate', storeId, value: conversionRate, unit: '%', timestamp },
    
    // Action metrics - 运营分析
    { metricId: 'inspection_score', storeId, value: randomFloat(85, 98), unit: '分', timestamp },
    { metricId: 'customer_complaint', storeId, value: randomInRange(0, 5), unit: '件', timestamp },
    { metricId: 'complaint_resolution_rate', storeId, value: randomFloat(85, 100), unit: '%', timestamp },
    { metricId: 'display_quality', storeId, value: randomFloat(80, 95), unit: '分', timestamp },
    { metricId: 'hygiene_score', storeId, value: randomFloat(85, 98), unit: '分', timestamp },
    { metricId: 'user_rating', storeId, value: randomFloat(4.0, 5.0, 1), unit: '分', timestamp },
    
    // Action metrics - 营销分析
    { metricId: 'marketing_score', storeId, value: randomFloat(80, 95), unit: '分', timestamp },
    { metricId: 'wechat_followers', storeId, value: randomInRange(200, 800), unit: '人', timestamp },
    { metricId: 'wechat_engagement', storeId, value: randomFloat(50, 80), unit: '%', timestamp },
    { metricId: 'douyin_views', storeId, value: randomInRange(50000, 200000), unit: '次', timestamp },
    { metricId: 'local_marketing', storeId, value: randomInRange(300, 800), unit: '人', timestamp },
    { metricId: 'instant_retail', storeId, value: randomFloat(80, 95), unit: '分', timestamp },
    { metricId: 'meituan_orders', storeId, value: randomInRange(50, 200), unit: '单', timestamp },
    { metricId: 'jd_sales', storeId, value: randomFloat(10000, 50000), unit: '元', timestamp },
    
    // Action metrics - 人员分析
    { metricId: 'employee_satisfaction', storeId, value: randomFloat(3.5, 5.0, 1), unit: '分', timestamp },
    
    // Action metrics - 员工成长分析
    { metricId: 'team_development', storeId, value: randomFloat(80, 95), unit: '分', timestamp },
    { metricId: 'training_hours', storeId, value: randomFloat(6, 15), unit: '小时', timestamp },
    { metricId: 'certification_pass', storeId, value: randomInRange(1, 5), unit: '人', timestamp },
    { metricId: 'leadership_team', storeId, value: randomFloat(75, 95), unit: '分', timestamp },
    { metricId: 'case_contribution', storeId, value: randomInRange(0, 3), unit: '个', timestamp },
    { metricId: 'team_building', storeId, value: randomInRange(0, 2), unit: '次', timestamp },
    
    // Business Gross Profit metrics - 业务毛利构成
    { metricId: 'main_business_gross_profit', storeId, value: grossProfit * 0.65, unit: '元', timestamp }, // 主营毛利占65%
    { metricId: 'operator_commission', storeId, value: grossProfit * 0.12, unit: '元', timestamp }, // 运营商预估酬金占12%
    { metricId: 'accessories_gross_profit', storeId, value: grossProfit * 0.08, unit: '元', timestamp }, // 配件毛利占8%
    { metricId: 'smart_products_gross_profit', storeId, value: grossProfit * 0.06, unit: '元', timestamp }, // 智能毛利占6%
    { metricId: 'insurance_gross_profit', storeId, value: grossProfit * 0.04, unit: '元', timestamp }, // 保险毛利占4%
    { metricId: 'secondhand_gross_profit', storeId, value: grossProfit * 0.03, unit: '元', timestamp }, // 二手毛利占3%
    { metricId: 'membership_gross_profit', storeId, value: grossProfit * 0.02, unit: '元', timestamp }, // 付费会员毛利占2%
    { metricId: 'total_business_gross_profit', storeId, value: grossProfit, unit: '元', timestamp }, // 总毛利
  ];
}

/**
 * Generate time series data for a store
 */
export function generateTimeSeriesData(
  storeId: string,
  startDate: Date,
  endDate: Date,
  granularity: TimeGranularity = TimeGranularity.DAY
): MetricValue[] {
  const store = mockStores.find(s => s.id === storeId);
  if (!store) {
    throw new Error(`Store not found: ${storeId}`);
  }

  const allMetricValues: MetricValue[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const rawData = generateRawDataPoint(storeId, new Date(currentDate));
    const metricValues = generateMetricValuesFromRawData(rawData, store.employeeCount);
    allMetricValues.push(...metricValues);
    
    // Increment date based on granularity
    switch (granularity) {
      case TimeGranularity.HOUR:
        currentDate.setHours(currentDate.getHours() + 1);
        break;
      case TimeGranularity.DAY:
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case TimeGranularity.WEEK:
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case TimeGranularity.MONTH:
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      case TimeGranularity.QUARTER:
        currentDate.setMonth(currentDate.getMonth() + 3);
        break;
      case TimeGranularity.YEAR:
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        break;
    }
  }
  
  return allMetricValues;
}

/**
 * Generate current snapshot data for all stores
 */
export function generateCurrentSnapshot(): MetricValue[] {
  const now = new Date();
  const allMetricValues: MetricValue[] = [];
  
  for (const store of mockStores) {
    const rawData = generateRawDataPoint(store.id, now);
    const metricValues = generateMetricValuesFromRawData(rawData, store.employeeCount);
    allMetricValues.push(...metricValues);
  }
  
  return allMetricValues;
}

/**
 * Generate target settings for metrics
 * Requirements: 10.1, 10.2
 */
export function generateTargetSettings(): TargetSetting[] {
  const targets: TargetSetting[] = [];
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // Define targets for all metrics with reasonable values
  const metricTargets = [
    // Financial metrics
    { metricId: 'revenue', targetValue: 120000 }, // 营业收入目标
    { metricId: 'gross_profit', targetValue: 50000 }, // 毛利目标
    { metricId: 'gross_profit_margin', targetValue: 40 }, // 40% 毛利率
    { metricId: 'profit', targetValue: 15000 }, // 净利润目标
    { metricId: 'net_profit_margin', targetValue: 15 }, // 15% 净利率
    { metricId: 'profit_margin', targetValue: 30 }, // 30% 利润率
    { metricId: 'total_cost', targetValue: 60000 }, // 总成本控制目标
    { metricId: 'total_expenses', targetValue: 25000 }, // 总费用控制目标
    
    // Business metrics
    { metricId: 'total_traffic', targetValue: 700 }, // 总客流量目标
    { metricId: 'passing_traffic', targetValue: 500 }, // 过店客流目标
    { metricId: 'entering_traffic', targetValue: 200 }, // 进店客流目标
    { metricId: 'entry_rate', targetValue: 40 }, // 40% 进店率
    { metricId: 'transaction_count', targetValue: 60 }, // 成交客户数目标
    { metricId: 'conversion_rate', targetValue: 30 }, // 30% 成交率
    { metricId: 'traffic_conversion_rate', targetValue: 10 }, // 10% 客流转化率
    
    // Business Gross Profit
    { metricId: 'total_business_gross_profit', targetValue: 50000 }, // 总业务毛利目标
    
    // Personnel metrics
    { metricId: 'labor_cost', targetValue: 15000 }, // 人工成本控制目标
    { metricId: 'output_per_employee', targetValue: 2000 }, // 人均产出目标
    { metricId: 'labor_output_ratio', targetValue: 3 }, // 3x 人效比
  ];
  
  for (const store of mockStores) {
    for (const { metricId, targetValue } of metricTargets) {
      // Adjust target based on store type and level
      let adjustedTarget = targetValue;
      
      // Store type adjustment
      switch (store.type) {
        case 'flagship':
          adjustedTarget *= 1.5; // 旗舰店目标提高50%
          break;
        case 'standard':
          adjustedTarget *= 1.0; // 标准店保持基准
          break;
        case 'mini':
          adjustedTarget *= 0.6; // 迷你店目标降低40%
          break;
      }
      
      // Store level adjustment
      switch (store.level) {
        case 'A':
          adjustedTarget *= 1.2; // A级店目标提高20%
          break;
        case 'B':
          adjustedTarget *= 1.0; // B级店保持基准
          break;
        case 'C':
          adjustedTarget *= 0.8; // C级店目标降低20%
          break;
        case 'D':
          adjustedTarget *= 0.6; // D级店目标降低40%
          break;
      }
      
      targets.push({
        targetId: `target-${store.id}-${metricId}`,
        metricId,
        storeId: store.id,
        targetValue: Math.round(adjustedTarget * 100) / 100, // 保留2位小数
        period: TimePeriod.MONTHLY,
        effectiveFrom: startOfMonth,
      });
    }
  }
  
  return targets;
}

/**
 * Get metric value by store and metric ID
 */
export function getMetricValue(
  metricValues: MetricValue[],
  storeId: string,
  metricId: string,
  timestamp?: Date
): MetricValue | undefined {
  return metricValues.find(
    mv =>
      mv.storeId === storeId &&
      mv.metricId === metricId &&
      (!timestamp || mv.timestamp.getTime() === timestamp.getTime())
  );
}
