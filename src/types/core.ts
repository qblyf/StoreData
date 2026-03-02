/**
 * Core type definitions for the Business Metrics Dashboard
 * Based on design.md specifications
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Widget types for dashboard components
 */
export enum WidgetType {
  LINE_CHART = 'line_chart',
  BAR_CHART = 'bar_chart',
  PIE_CHART = 'pie_chart',
  GAUGE = 'gauge',
  KPI_CARD = 'kpi_card',
  TABLE = 'table',
  HEATMAP = 'heatmap',
  COMPARISON_BAR = 'comparison_bar'
}

/**
 * Time granularity for data aggregation
 */
export enum TimeGranularity {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year'
}

/**
 * Alert severity levels
 */
export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

/**
 * Time period for reporting
 */
export enum TimePeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

/**
 * Metric categories
 */
export enum MetricCategory {
  SETTLEMENT = 'settlement',
  MAIN_BUSINESS = 'main_business',
  TRAFFIC = 'traffic',
  PROFIT = 'profit',
  REVENUE_COST = 'revenue_cost',
  EXPENSE = 'expense',
  OUTPUT = 'output'
}

/**
 * Store types
 */
export enum StoreType {
  FLAGSHIP = 'flagship',
  STANDARD = 'standard',
  MINI = 'mini'
}

/**
 * Store levels
 */
export enum StoreLevel {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D'
}

// ============================================================================
// Core Interfaces
// ============================================================================

/**
 * Metric definition
 * Requirements: 1.3, 1.4
 */
export interface Metric {
  id: string;
  name: string;
  category: MetricCategory;
  unit: string;
  dataType: 'number' | 'percent' | 'currency';
  enabled: boolean;
  formula?: string;
  dependencies?: string[];
}

/**
 * Store information
 * Requirements: 9.1, 9.2, 9.3
 */
export interface Store {
  id: string;
  name: string;
  type: StoreType;
  level: StoreLevel;
  employeeCount: number;
}

/**
 * Metric value with metadata
 * Requirements: 1.3, 10.4, 10.5
 */
export interface MetricValue {
  metricId: string;
  storeId: string;
  value: number | null;
  unit: string;
  timestamp: Date;
  target?: number;
  targetCompletion?: number;
}

/**
 * Time range for queries
 */
export interface TimeRange {
  start: Date;
  end: Date;
}

/**
 * Dashboard configuration
 */
export interface DashboardConfig {
  userId: string;
  layout: WidgetLayout[];
  defaultFilters: FilterCondition[];
  refreshInterval: number;
  theme: string;
}

/**
 * Widget layout configuration
 */
export interface WidgetLayout {
  widgetId: string;
  widgetType: WidgetType;
  position: Position;
  size: Size;
  config: WidgetConfig;
}

/**
 * Position in grid
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Size in grid units
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * Widget configuration
 */
export interface WidgetConfig {
  title: string;
  metricIds: string[];
  storeIds?: string[];
  timeRange?: TimeRange;
  [key: string]: any;
}

/**
 * Filter condition
 */
export interface FilterCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'nin';
  value: any;
}

/**
 * Alert information
 * Requirements: 10.4
 */
export interface Alert {
  alertId: string;
  storeId: string;
  metricId: string;
  severity: AlertSeverity;
  message: string;
  threshold: number;
  actualValue: number;
  timestamp: Date;
}

/**
 * Target setting
 * Requirements: 10.1, 10.2, 10.3
 */
export interface TargetSetting {
  targetId: string;
  metricId: string;
  storeId?: string;
  storeLevel?: StoreLevel;
  targetValue: number;
  period: TimePeriod;
  effectiveFrom: Date;
  effectiveTo?: Date;
}

/**
 * Metric snapshot
 */
export interface MetricSnapshot {
  snapshotId: string;
  metricId: string;
  storeId: string;
  value: number | null;
  timestamp: Date;
  period: TimePeriod;
  calculationInputs: Record<string, number>;
}

/**
 * Store metric value for comparison
 */
export interface StoreMetricValue {
  storeId: string;
  storeName: string;
  storeType: StoreType;
  storeLevel: StoreLevel;
  value: number | null;
  target?: number;
  deviation?: number;
}

/**
 * Store ranking
 */
export interface StoreRanking {
  storeId: string;
  rank: number;
  value: number;
}

/**
 * Comparison result
 */
export interface ComparisonResult {
  comparisonId: string;
  metricId: string;
  stores: StoreMetricValue[];
  ranking: StoreRanking[];
  average: number;
  median: number;
  timestamp: Date;
}

/**
 * Trend data point
 */
export interface TrendPoint {
  timestamp: Date;
  value: number | null;
  target?: number;
  movingAverage?: number;
}

/**
 * Trend data
 */
export interface TrendData {
  metricId: string;
  storeId: string;
  points: TrendPoint[];
  granularity: TimeGranularity;
}

/**
 * Aggregated metric
 */
export interface AggregatedMetric {
  metricId: string;
  value: number | null;
  count: number;
  sum: number;
  average: number;
  min: number;
  max: number;
  timestamp: Date;
}

/**
 * Target completion
 * Requirements: 10.5
 */
export interface TargetCompletion {
  metricId: string;
  storeId: string;
  period: TimePeriod;
  targetValue: number;
  actualValue: number;
  completionRate: number;
  isAchieved: boolean;
}

/**
 * Unmet target
 * Requirements: 10.4
 */
export interface UnmetTarget {
  metricId: string;
  metricName: string;
  storeId: string;
  storeName: string;
  targetValue: number;
  actualValue: number;
  gap: number;
  gapPercentage: number;
}

// ============================================================================
// Request/Response Interfaces
// ============================================================================

/**
 * Metric data request
 */
export interface MetricDataRequest {
  storeIds: string[];
  metricIds: string[];
  timeRange: TimeRange;
  dimensions?: string[];
  filters?: FilterCondition[];
}

/**
 * Metric metadata
 */
export interface MetricMetadata {
  metricId: string;
  name: string;
  category: MetricCategory;
  unit: string;
  formula?: string;
}

/**
 * Metric data response
 */
export interface MetricDataResponse {
  data: MetricValue[];
  metadata: MetricMetadata[];
  timestamp: Date;
  cacheHit: boolean;
}

/**
 * Comparison data
 */
export interface ComparisonData {
  metricId: string;
  stores: StoreMetricValue[];
  timeRange: TimeRange;
}

// ============================================================================
// Chart Data Interfaces
// ============================================================================

/**
 * Chart data point
 */
export interface ChartDataPoint {
  label: string;
  value: number | null;
  [key: string]: any;
}

/**
 * Chart data
 */
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

/**
 * Chart dataset
 */
export interface ChartDataset {
  label: string;
  data: (number | null)[];
  color?: string;
  [key: string]: any;
}

/**
 * Chart configuration
 */
export interface ChartConfig {
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  [key: string]: any;
}

/**
 * Export format
 */
export type ExportFormat = 'png' | 'jpg' | 'svg' | 'csv' | 'excel';

/**
 * Interaction event
 */
export interface InteractionEvent {
  type: 'click' | 'hover' | 'select';
  data: any;
}
