# Design Document: 门店数据指标看板

## Overview

门店数据指标看板是基于业务指标逻辑关系系统构建的可视化数据展示平台。该看板为门店管理者、财务分析师和运营人员提供实时的业务洞察，通过直观的图表和数据展示，帮助用户快速了解门店的经营状况、财务表现和目标达成情况。

### 核心功能

- **实时指标展示**: 展示财务指标（利润、毛利、成本、费用）和业务指标（客流、成交率、产出效率）
- **可视化呈现**: 通过图表、趋势线、仪表盘等形式直观展示数据
- **多维度分析**: 支持按时间、门店类型、门店级别等维度筛选和对比数据
- **目标监控**: 实时显示指标目标完成率，提供预警和异常提示
- **多门店对比**: 支持横向对比多个门店的指标表现

### 技术特点

- 基于已有的指标计算引擎和依赖关系管理系统
- 利用指标缓存机制实现快速数据加载
- 响应式设计，支持多种设备访问
- 实时数据更新，无需手动刷新

## Architecture

### 系统架构

看板系统采用三层架构设计：

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Dashboard UI │  │ Chart Widgets│  │ Filter Panel │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────┐
│                     Business Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Dashboard    │  │ Metric       │  │ Alert        │  │
│  │ Service      │  │ Aggregator   │  │ Service      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────┐
│                      Data Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Metric       │  │ Cache        │  │ Store        │  │
│  │ Calculator   │  │ Manager      │  │ Repository   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 架构层次说明

**Presentation Layer (展示层)**
- Dashboard UI: 看板主界面，负责整体布局和用户交互
- Chart Widgets: 可复用的图表组件（折线图、柱状图、饼图、仪表盘等）
- Filter Panel: 筛选面板，提供时间、门店、指标类型等筛选条件

**Business Layer (业务层)**
- Dashboard Service: 看板业务逻辑，协调数据获取和展示
- Metric Aggregator: 指标聚合服务，按维度汇总和计算指标
- Alert Service: 预警服务，检测指标异常和目标未达成情况

**Data Layer (数据层)**
- Metric Calculator: 复用现有的指标计算引擎
- Cache Manager: 复用现有的指标缓存机制
- Store Repository: 门店数据访问层

### 数据流

```
User Request → Filter Panel → Dashboard Service
                                    ↓
                          Metric Aggregator
                                    ↓
                    ┌───────────────┴───────────────┐
                    ↓                               ↓
            Cache Manager                   Metric Calculator
                    ↓                               ↓
            Cached Data                     Fresh Calculation
                    └───────────────┬───────────────┘
                                    ↓
                            Dashboard Service
                                    ↓
                            Chart Widgets
                                    ↓
                              User Display
```

## Components and Interfaces

### 核心组件

#### 1. DashboardService

看板服务，负责协调数据获取和业务逻辑。

```typescript
interface DashboardService {
  // 获取看板配置
  getDashboardConfig(userId: string): DashboardConfig;
  
  // 获取指标数据
  getMetricData(request: MetricDataRequest): MetricDataResponse;
  
  // 获取多门店对比数据
  getStoreComparisonData(storeIds: string[], metricIds: string[], timeRange: TimeRange): ComparisonData;
  
  // 获取趋势数据
  getTrendData(storeId: string, metricId: string, timeRange: TimeRange, granularity: TimeGranularity): TrendData;
  
  // 保存看板配置
  saveDashboardConfig(userId: string, config: DashboardConfig): void;
}
```

#### 2. MetricAggregator

指标聚合服务，按不同维度汇总指标数据。

```typescript
interface MetricAggregator {
  // 按时间聚合
  aggregateByTime(storeId: string, metricId: string, timeRange: TimeRange, granularity: TimeGranularity): AggregatedMetric[];
  
  // 按门店类型聚合
  aggregateByStoreType(storeType: string, metricId: string, timeRange: TimeRange): AggregatedMetric;
  
  // 按门店级别聚合
  aggregateByStoreLevel(storeLevel: string, metricId: string, timeRange: TimeRange): AggregatedMetric;
  
  // 计算目标完成率
  calculateTargetCompletion(storeId: string, metricId: string, period: TimePeriod): TargetCompletion;
}
```

#### 3. AlertService

预警服务，检测指标异常和目标未达成。

```typescript
interface AlertService {
  // 检查指标预警
  checkAlerts(storeId: string, metricIds: string[]): Alert[];
  
  // 获取未达标指标
  getUnmetTargets(storeId: string, period: TimePeriod): UnmetTarget[];
  
  // 配置预警规则
  configureAlertRule(rule: AlertRule): void;
  
  // 获取预警历史
  getAlertHistory(storeId: string, timeRange: TimeRange): Alert[];
}
```

#### 4. ChartWidget

图表组件基类，所有图表组件的抽象接口。

```typescript
interface ChartWidget {
  // 渲染图表
  render(data: ChartData, config: ChartConfig): void;
  
  // 更新数据
  updateData(data: ChartData): void;
  
  // 导出图表
  export(format: ExportFormat): Blob;
  
  // 响应用户交互
  onInteraction(event: InteractionEvent): void;
}
```

### 数据接口

#### MetricDataRequest

```typescript
interface MetricDataRequest {
  storeIds: string[];           // 门店ID列表
  metricIds: string[];          // 指标ID列表
  timeRange: TimeRange;         // 时间范围
  dimensions?: string[];        // 维度（可选）
  filters?: FilterCondition[];  // 筛选条件（可选）
}
```

#### MetricDataResponse

```typescript
interface MetricDataResponse {
  data: MetricValue[];          // 指标值列表
  metadata: MetricMetadata[];   // 指标元数据
  timestamp: Date;              // 数据时间戳
  cacheHit: boolean;           // 是否命中缓存
}
```

#### MetricValue

```typescript
interface MetricValue {
  metricId: string;            // 指标ID
  storeId: string;             // 门店ID
  value: number;               // 指标值
  unit: string;                // 单位
  timestamp: Date;             // 时间戳
  target?: number;             // 目标值（可选）
  targetCompletion?: number;   // 目标完成率（可选）
}
```

#### DashboardConfig

```typescript
interface DashboardConfig {
  userId: string;              // 用户ID
  layout: WidgetLayout[];      // 组件布局
  defaultFilters: FilterCondition[]; // 默认筛选条件
  refreshInterval: number;     // 刷新间隔（秒）
  theme: string;               // 主题
}
```

#### WidgetLayout

```typescript
interface WidgetLayout {
  widgetId: string;            // 组件ID
  widgetType: WidgetType;      // 组件类型
  position: Position;          // 位置
  size: Size;                  // 尺寸
  config: WidgetConfig;        // 组件配置
}
```

#### Alert

```typescript
interface Alert {
  alertId: string;             // 预警ID
  storeId: string;             // 门店ID
  metricId: string;            // 指标ID
  severity: AlertSeverity;     // 严重程度
  message: string;             // 预警消息
  threshold: number;           // 阈值
  actualValue: number;         // 实际值
  timestamp: Date;             // 时间戳
}
```

## Data Models

### 核心数据模型

#### DashboardWidget

看板组件模型，表示看板上的一个可视化组件。

```typescript
class DashboardWidget {
  id: string;                  // 组件唯一标识
  type: WidgetType;            // 组件类型（图表、表格、卡片等）
  title: string;               // 组件标题
  metricIds: string[];         // 关联的指标ID
  config: WidgetConfig;        // 组件配置
  position: Position;          // 位置信息
  size: Size;                  // 尺寸信息
  refreshInterval?: number;    // 刷新间隔（秒）
}
```

#### MetricSnapshot

指标快照，表示某个时间点的指标值。

```typescript
class MetricSnapshot {
  snapshotId: string;          // 快照ID
  metricId: string;            // 指标ID
  storeId: string;             // 门店ID
  value: number;               // 指标值
  timestamp: Date;             // 时间戳
  period: TimePeriod;          // 时间周期
  calculationInputs: Record<string, number>; // 计算输入值
}
```

#### TargetSetting

目标设置模型。

```typescript
class TargetSetting {
  targetId: string;            // 目标ID
  metricId: string;            // 指标ID
  storeId?: string;            // 门店ID（可选，为空表示全局）
  storeLevel?: string;         // 门店级别（可选）
  targetValue: number;         // 目标值
  period: TimePeriod;          // 时间周期
  effectiveFrom: Date;         // 生效开始时间
  effectiveTo?: Date;          // 生效结束时间（可选）
}
```

#### ComparisonResult

对比结果模型。

```typescript
class ComparisonResult {
  comparisonId: string;        // 对比ID
  metricId: string;            // 指标ID
  stores: StoreMetricValue[];  // 各门店指标值
  ranking: StoreRanking[];     // 排名
  average: number;             // 平均值
  median: number;              // 中位数
  timestamp: Date;             // 时间戳
}
```

#### StoreMetricValue

门店指标值。

```typescript
class StoreMetricValue {
  storeId: string;             // 门店ID
  storeName: string;           // 门店名称
  storeType: string;           // 门店类型
  storeLevel: string;          // 门店级别
  value: number;               // 指标值
  target?: number;             // 目标值
  deviation?: number;          // 偏差值
}
```

#### TrendPoint

趋势数据点。

```typescript
class TrendPoint {
  timestamp: Date;             // 时间戳
  value: number;               // 指标值
  target?: number;             // 目标值
  movingAverage?: number;      // 移动平均值
}
```

### 枚举类型

```typescript
enum WidgetType {
  LINE_CHART = 'line_chart',           // 折线图
  BAR_CHART = 'bar_chart',             // 柱状图
  PIE_CHART = 'pie_chart',             // 饼图
  GAUGE = 'gauge',                     // 仪表盘
  KPI_CARD = 'kpi_card',               // KPI卡片
  TABLE = 'table',                     // 表格
  HEATMAP = 'heatmap',                 // 热力图
  COMPARISON_BAR = 'comparison_bar'    // 对比柱状图
}

enum TimeGranularity {
  HOUR = 'hour',       // 小时
  DAY = 'day',         // 日
  WEEK = 'week',       // 周
  MONTH = 'month',     // 月
  QUARTER = 'quarter', // 季度
  YEAR = 'year'        // 年
}

enum AlertSeverity {
  INFO = 'info',       // 信息
  WARNING = 'warning', // 警告
  ERROR = 'error',     // 错误
  CRITICAL = 'critical' // 严重
}

enum TimePeriod {
  DAILY = 'daily',     // 日
  WEEKLY = 'weekly',   // 周
  MONTHLY = 'monthly', // 月
  QUARTERLY = 'quarterly', // 季度
  YEARLY = 'yearly'    // 年
}
```

### 数据关系

```
DashboardConfig
    │
    ├─── WidgetLayout[]
    │         │
    │         └─── DashboardWidget
    │                   │
    │                   └─── MetricSnapshot[]
    │
    └─── FilterCondition[]

TargetSetting ──references──> Metric (from existing system)
                               │
MetricSnapshot ──references──> │
                               │
ComparisonResult ──references─> │
```


## Correctness Properties

*属性（Property）是系统在所有有效执行中都应该保持为真的特征或行为——本质上是关于系统应该做什么的形式化陈述。属性是人类可读规范和机器可验证正确性保证之间的桥梁。*

### Property 1: 指标唯一性

*对于任意*创建的指标集合，每个指标的标识符都应该是唯一的，不存在两个指标具有相同的ID。

**Validates: Requirements 1.4**

### Property 2: 指标创建必填字段验证

*对于任意*指标创建请求，如果缺少名称、类别、单位或数据类型中的任何一个字段，系统应该拒绝创建并返回错误。

**Validates: Requirements 1.3**

### Property 3: 指标状态转换

*对于任意*已创建的指标，系统应该支持在启用和禁用状态之间切换，且状态变更应该被正确保存和检索。

**Validates: Requirements 1.5**

### Property 4: 公式语法验证

*对于任意*包含语法错误的计算公式，系统应该在保存时拒绝该公式并返回语法错误提示。

**Validates: Requirements 2.4**

### Property 5: 公式引用验证

*对于任意*引用了不存在指标的计算公式，系统应该拒绝保存并返回指标不存在的错误提示。

**Validates: Requirements 2.5**

### Property 6: 公式版本历史

*对于任意*指标的计算公式，每次修改都应该产生新的版本记录，且所有历史版本都应该可以被查询。

**Validates: Requirements 2.6**

### Property 7: 依赖关系自动识别

*对于任意*包含指标引用的计算公式，系统应该自动识别并记录所有被引用指标作为依赖关系。

**Validates: Requirements 3.1**

### Property 8: 循环依赖检测

*对于任意*会导致循环依赖的指标配置（例如 A 依赖 B，B 依赖 C，C 依赖 A），系统应该检测到循环并拒绝保存配置。

**Validates: Requirements 3.3**

### Property 9: 拓扑排序计算

*对于任意*具有依赖关系的指标集合，系统应该按照拓扑排序的顺序计算指标值，确保被依赖的指标先于依赖它的指标计算。

**Validates: Requirements 3.4**

### Property 10: 依赖关系查询完整性

*对于任意*指标，查询其上游依赖应该返回所有直接和间接依赖的指标，查询其下游依赖应该返回所有直接和间接依赖它的指标。

**Validates: Requirements 3.5, 3.6**

### Property 11: 毛利计算公式

*对于任意*收入、商品成本和调价成本的组合，系统计算的毛利应该等于收入减去商品成本再减去调价成本。

**Validates: Requirements 4.1, 4.5**

### Property 12: 毛利率计算公式

*对于任意*非零收入和对应的毛利，系统计算的毛利率应该等于毛利除以收入。

**Validates: Requirements 4.2**

### Property 13: 占比之和为100%

*对于任意*毛利构成的各业务类型占比，所有占比之和应该等于100%（允许浮点误差在0.01%以内）。

**Validates: Requirements 4.4, 4.6**

### Property 14: 利润计算公式

*对于任意*毛利、工费、租费和其他费用的组合，系统计算的利润应该等于毛利减去工费、租费和其他费用之和。

**Validates: Requirements 5.1**

### Property 15: 利润率计算公式

*对于任意*非零毛利和对应的利润，系统计算的利润率应该等于利润除以毛利，净利率应该等于利润除以收入。

**Validates: Requirements 5.2, 5.3**

### Property 16: 费用占比计算公式

*对于任意*非零毛利和对应的各项费用，系统计算的费用占比应该等于（利润加工费加租费加其他费用）除以毛利。

**Validates: Requirements 5.4**

### Property 17: 费用变更级联更新

*对于任意*费用项的更新，所有依赖该费用的利润相关指标（利润、净利率、利润率、费用占比）都应该被重新计算。

**Validates: Requirements 5.5**

### Property 18: 总费用求和

*对于任意*费用项集合（工费、租费、支付手续费、国补费用、提成费用等），系统计算的总费用应该等于所有费用项的精确求和。

**Validates: Requirements 6.5**

### Property 19: 产出效率计算公式

*对于任意*非零工费和员工人数，毛利工费比应该等于毛利除以工费，人工产出应该等于毛利除以员工人数。

**Validates: Requirements 7.1, 7.2, 7.3**

### Property 20: 员工数变更级联更新

*对于任意*门店的员工人数变更，人工产出指标应该使用新的员工人数重新计算。

**Validates: Requirements 7.4**

### Property 21: 客流转化率计算公式

*对于任意*非零过店客流和进店客流，进店率应该等于进店客流除以过店客流；对于任意非零进店客流和成交客户数，成交率应该等于成交客户数除以进店客流。

**Validates: Requirements 8.3, 8.4**

### Property 22: 门店创建必填字段验证

*对于任意*门店创建请求，如果缺少门店类型或门店级别，系统应该拒绝创建并返回错误。

**Validates: Requirements 9.3**

### Property 23: 差异化配置隔离

*对于任意*两个不同类型或不同级别的门店，它们应该能够拥有独立的指标配置和目标设置，互不影响。

**Validates: Requirements 9.4, 9.5, 10.2**

### Property 24: 批量修改一致性

*对于任意*同类型门店的批量配置修改，所有指定门店的配置都应该被更新为相同的值。

**Validates: Requirements 9.6**

### Property 25: 目标完成率计算公式

*对于任意*非零目标值和对应的实际值，系统计算的目标完成率应该等于实际值除以目标值。

**Validates: Requirements 10.5**

### Property 26: 未达标状态判断

*对于任意*指标的实际值和目标值，当实际值低于目标值时，系统应该将该指标标记为未达标状态。

**Validates: Requirements 10.4**

### Property 27: 目标值版本管理

*对于任意*指标目标值的修改，系统应该保留历史版本，且所有版本都应该包含生效时间范围。

**Validates: Requirements 10.6**

### Property 28: 市场份额级联更新

*对于任意*门店的市场份额，当市场总量数据更新时，市场份额应该使用新的市场总量重新计算（市场份额 = 门店销量 / 市场总量）。

**Validates: Requirements 11.4**

### Property 29: 数据导入往返一致性

*对于任意*有效的指标数据集合，导出为Excel或CSV格式后再导入，应该得到与原始数据等价的数据集合。

**Validates: Requirements 12.1, 12.2, 12.5, 12.6**

### Property 30: 导入数据验证

*对于任意*包含格式错误或类型错误的导入数据，系统应该拒绝导入并生成包含具体错误信息的错误报告。

**Validates: Requirements 12.3, 12.4**

### Property 31: 导出数据完整性

*对于任意*指标数据的导出，导出文件应该包含指标名称、计算公式和依赖关系信息。

**Validates: Requirements 12.7**

### Property 32: 计算结果缓存

*对于任意*指标的计算完成后，计算结果应该被缓存，且后续查询应该能够从缓存中获取结果。

**Validates: Requirements 13.1**

### Property 33: 缓存失效级联

*对于任意*原始数据的更新，所有直接或间接依赖该数据的指标缓存都应该被标记为失效。

**Validates: Requirements 13.3, 13.4**

### Property 34: 缓存手动刷新

*对于任意*指标的手动缓存刷新操作，该指标应该被重新计算，且缓存应该更新为最新的计算结果。

**Validates: Requirements 13.5**

### Property 35: 缓存命中率计算

*对于任意*时间段内的指标查询，缓存命中率应该等于从缓存返回的查询次数除以总查询次数。

**Validates: Requirements 13.6**

### Property 36: 依赖关系过滤

*对于任意*指标类别的过滤条件，依赖关系图应该只包含属于该类别的指标及其相互之间的依赖关系。

**Validates: Requirements 14.3**

### Property 37: 依赖图数据完整性

*对于任意*指标的依赖关系图节点，该节点应该包含指标的计算公式信息。

**Validates: Requirements 14.4**

### Property 38: 审计日志完整性

*对于任意*指标计算的执行，审计日志应该完整记录计算时间戳、所有输入值、计算公式版本、计算结果值和触发源。

**Validates: Requirements 15.1, 15.2, 15.3, 15.4, 15.5**

### Property 39: 审计日志查询

*对于任意*指标和时间范围的查询条件，系统应该返回该指标在指定时间范围内的所有审计日志记录。

**Validates: Requirements 15.6**


## Error Handling

### 错误分类

系统采用分层的错误处理策略，将错误分为以下类别：

#### 1. 验证错误 (Validation Errors)

**场景**: 用户输入不符合业务规则或数据约束

**处理策略**:
- 在数据进入系统前进行验证
- 返回明确的错误消息，指出具体的验证失败原因
- HTTP状态码: 400 Bad Request
- 不记录为系统错误，记录为用户操作日志

**示例**:
- 创建指标时缺少必填字段
- 计算公式语法错误
- 引用不存在的指标
- 导入数据格式不正确

#### 2. 业务逻辑错误 (Business Logic Errors)

**场景**: 操作违反业务规则或导致不一致状态

**处理策略**:
- 在业务层检测并阻止操作
- 返回业务相关的错误消息
- HTTP状态码: 422 Unprocessable Entity
- 记录为业务异常日志

**示例**:
- 检测到循环依赖
- 删除被其他指标依赖的指标
- 目标值设置的时间范围重叠

#### 3. 资源未找到错误 (Not Found Errors)

**场景**: 请求的资源不存在

**处理策略**:
- 返回资源未找到的明确消息
- HTTP状态码: 404 Not Found
- 记录为访问日志

**示例**:
- 查询不存在的指标ID
- 访问不存在的门店
- 查询已删除的配置

#### 4. 计算错误 (Calculation Errors)

**场景**: 指标计算过程中发生错误

**处理策略**:
- 捕获计算异常（如除零、溢出）
- 返回计算错误的详细信息
- 标记指标为计算失败状态
- 记录完整的错误堆栈和输入值
- 不影响其他独立指标的计算

**示例**:
- 除零错误（如收入为0时计算毛利率）
- 数值溢出
- 依赖数据缺失

**除零处理规则**:
```typescript
// 对于比率和百分比计算
if (denominator === 0) {
  return null; // 返回null表示无法计算
}

// 对于展示层
if (value === null) {
  display "N/A" or "--"; // 显示为不可用
}
```

#### 5. 缓存错误 (Cache Errors)

**场景**: 缓存操作失败

**处理策略**:
- 缓存失败不应影响核心功能
- 降级到直接计算模式
- 记录缓存错误日志
- 触发缓存健康检查

**示例**:
- 缓存服务不可用
- 缓存数据损坏
- 缓存空间不足

#### 6. 系统错误 (System Errors)

**场景**: 系统内部错误或外部依赖失败

**处理策略**:
- 返回通用错误消息（不暴露内部细节）
- HTTP状态码: 500 Internal Server Error
- 记录完整的错误堆栈和上下文
- 触发告警通知
- 必要时启动自动恢复机制

**示例**:
- 数据库连接失败
- 内存不足
- 未预期的异常

### 错误响应格式

所有错误响应遵循统一的格式：

```typescript
interface ErrorResponse {
  error: {
    code: string;           // 错误代码（如 VALIDATION_ERROR, CIRCULAR_DEPENDENCY）
    message: string;        // 用户友好的错误消息
    details?: any;          // 详细错误信息（可选）
    field?: string;         // 相关字段名（验证错误时）
    timestamp: Date;        // 错误发生时间
    requestId: string;      // 请求ID，用于追踪
  };
}
```

### 错误恢复策略

#### 自动重试

对于临时性错误（如网络超时、数据库连接失败），实施指数退避重试策略：

```typescript
const retryConfig = {
  maxRetries: 3,
  initialDelay: 100,      // 毫秒
  maxDelay: 5000,         // 毫秒
  backoffMultiplier: 2
};
```

#### 降级处理

当某些功能不可用时，提供降级服务：

- 缓存不可用 → 直接计算
- 实时数据不可用 → 使用最近的快照数据
- 复杂聚合失败 → 返回基础指标

#### 事务回滚

对于涉及多个数据修改的操作，使用事务确保原子性：

- 批量导入失败 → 回滚所有导入
- 配置更新失败 → 恢复原配置
- 级联更新失败 → 回滚所有相关更新

### 错误监控和告警

#### 监控指标

- 错误率（按错误类型分类）
- 错误响应时间
- 重试成功率
- 降级触发频率

#### 告警规则

- 错误率超过阈值（如5分钟内错误率>5%）
- 连续系统错误（如连续10次系统错误）
- 关键功能降级（如缓存服务不可用超过5分钟）
- 计算失败率异常（如某指标计算失败率>10%）


## Testing Strategy

### 测试方法概述

门店数据指标看板采用双重测试策略，结合单元测试和基于属性的测试（Property-Based Testing, PBT），确保系统的正确性和可靠性。

**单元测试**: 验证特定示例、边界情况和错误条件
**属性测试**: 验证跨所有输入的通用属性

两种测试方法互补，共同提供全面的测试覆盖：
- 单元测试捕获具体的错误和已知的边界情况
- 属性测试通过随机化输入验证通用正确性

### 属性测试框架

根据项目技术栈选择合适的属性测试库：

**TypeScript/JavaScript**: 使用 `fast-check` 库
```bash
npm install --save-dev fast-check
```

**Python**: 使用 `hypothesis` 库
```bash
pip install hypothesis
```

**Java**: 使用 `jqwik` 库
```xml
<dependency>
    <groupId>net.jqwik</groupId>
    <artifactId>jqwik</artifactId>
    <version>1.7.4</version>
    <scope>test</scope>
</dependency>
```

### 属性测试配置

每个属性测试必须配置为运行至少100次迭代，以确保充分的随机输入覆盖：

```typescript
// TypeScript with fast-check
fc.assert(
  fc.property(
    fc.record({
      revenue: fc.double({ min: 0, max: 1000000 }),
      cost: fc.double({ min: 0, max: 1000000 })
    }),
    (data) => {
      // 测试逻辑
    }
  ),
  { numRuns: 100 } // 最少100次迭代
);
```

### 属性测试标记

每个属性测试必须使用注释标记，引用设计文档中的对应属性：

```typescript
/**
 * Feature: business-metrics-logic-system
 * Property 11: 毛利计算公式
 * 
 * 对于任意收入、商品成本和调价成本的组合，
 * 系统计算的毛利应该等于收入减去商品成本再减去调价成本。
 */
test('Property 11: Gross profit calculation formula', () => {
  fc.assert(
    fc.property(
      fc.record({
        revenue: fc.double({ min: 0, max: 1000000 }),
        productCost: fc.double({ min: 0, max: 1000000 }),
        adjustmentCost: fc.double({ min: 0, max: 1000000 })
      }),
      (data) => {
        const grossProfit = calculateGrossProfit(
          data.revenue,
          data.productCost,
          data.adjustmentCost
        );
        const expected = data.revenue - data.productCost - data.adjustmentCost;
        expect(grossProfit).toBeCloseTo(expected, 2);
      }
    ),
    { numRuns: 100 }
  );
});
```

### 测试分层策略

#### 1. 单元测试 (Unit Tests)

**目标**: 测试单个组件或函数的正确性

**覆盖范围**:
- 指标计算函数
- 数据验证逻辑
- 依赖关系解析
- 缓存管理
- 错误处理

**示例**:
```typescript
describe('MetricCalculator', () => {
  test('should calculate gross profit correctly', () => {
    const result = calculateGrossProfit(10000, 6000, 500);
    expect(result).toBe(3500);
  });

  test('should handle zero revenue', () => {
    const result = calculateGrossProfitMargin(0, 0);
    expect(result).toBeNull();
  });

  test('should reject negative values', () => {
    expect(() => calculateGrossProfit(-100, 50, 0))
      .toThrow('Revenue cannot be negative');
  });
});
```

#### 2. 属性测试 (Property-Based Tests)

**目标**: 验证系统在所有有效输入下的通用属性

**覆盖范围**:
- 所有39个正确性属性（见Correctness Properties部分）
- 计算公式的数学正确性
- 依赖关系的一致性
- 缓存的正确性
- 数据导入导出的往返一致性

**生成器策略**:

```typescript
// 指标数据生成器
const metricDataGenerator = fc.record({
  metricId: fc.uuid(),
  value: fc.double({ min: 0, max: 1000000, noNaN: true }),
  timestamp: fc.date({ min: new Date('2020-01-01'), max: new Date() })
});

// 门店数据生成器
const storeGenerator = fc.record({
  storeId: fc.uuid(),
  storeType: fc.constantFrom('flagship', 'standard', 'mini'),
  storeLevel: fc.constantFrom('A', 'B', 'C', 'D'),
  employeeCount: fc.integer({ min: 1, max: 50 })
});

// 计算公式生成器（无循环依赖）
const formulaGenerator = fc.record({
  operator: fc.constantFrom('+', '-', '*', '/'),
  operands: fc.array(fc.uuid(), { minLength: 2, maxLength: 5 })
});
```

**边界情况处理**:

属性测试应该包含边界情况的生成器：

```typescript
// 包含边界值的生成器
const revenueGenerator = fc.oneof(
  fc.constant(0),                    // 零值
  fc.double({ min: 0.01, max: 1 }), // 极小值
  fc.double({ min: 1, max: 1000 }), // 正常值
  fc.double({ min: 1000000, max: 10000000 }) // 极大值
);
```

#### 3. 集成测试 (Integration Tests)

**目标**: 测试多个组件协同工作的正确性

**覆盖范围**:
- Dashboard Service 与 Metric Calculator 的集成
- Metric Aggregator 与 Cache Manager 的集成
- Alert Service 与 Metric Calculator 的集成
- 数据导入导出流程

**示例**:
```typescript
describe('Dashboard Integration', () => {
  test('should fetch and aggregate metrics correctly', async () => {
    const request = {
      storeIds: ['store1', 'store2'],
      metricIds: ['gross_profit', 'net_profit'],
      timeRange: { start: '2024-01-01', end: '2024-01-31' }
    };
    
    const response = await dashboardService.getMetricData(request);
    
    expect(response.data).toHaveLength(4); // 2 stores * 2 metrics
    expect(response.cacheHit).toBeDefined();
  });
});
```

#### 4. 端到端测试 (E2E Tests)

**目标**: 从用户角度测试完整的业务流程

**覆盖范围**:
- 用户登录并查看看板
- 筛选和对比门店数据
- 查看趋势图表
- 导出数据报告
- 配置预警规则

**工具**: Playwright 或 Cypress

```typescript
test('user can view store comparison dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  await page.selectOption('#store-filter', ['store1', 'store2']);
  await page.click('#apply-filter');
  
  const chartData = await page.locator('.comparison-chart').textContent();
  expect(chartData).toContain('store1');
  expect(chartData).toContain('store2');
});
```

### 测试数据管理

#### 测试数据生成

使用工厂模式生成测试数据：

```typescript
class MetricFactory {
  static create(overrides?: Partial<Metric>): Metric {
    return {
      id: faker.datatype.uuid(),
      name: faker.commerce.productName(),
      category: faker.helpers.arrayElement(['business', 'financial']),
      unit: faker.helpers.arrayElement(['yuan', 'percent', 'count']),
      dataType: 'number',
      enabled: true,
      ...overrides
    };
  }
}
```

#### 测试数据隔离

- 每个测试使用独立的数据集
- 测试前清理数据库
- 测试后恢复初始状态
- 使用事务回滚确保隔离

### 性能测试

#### 响应时间测试

验证关键操作的性能要求：

```typescript
test('cached metric query should respond within 100ms', async () => {
  const startTime = Date.now();
  await metricService.getMetricValue('metric1', 'store1');
  const duration = Date.now() - startTime;
  
  expect(duration).toBeLessThan(100);
});
```

#### 负载测试

使用 k6 或 JMeter 进行负载测试：

```javascript
// k6 script
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 100,        // 100个虚拟用户
  duration: '5m',  // 持续5分钟
};

export default function() {
  let response = http.get('http://api.example.com/metrics');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

### 测试覆盖率目标

- 代码覆盖率: ≥ 80%
- 分支覆盖率: ≥ 75%
- 属性测试覆盖: 100%（所有39个属性都有对应测试）
- 关键路径覆盖: 100%

### 持续集成

测试应该集成到CI/CD流程中：

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run unit tests
        run: npm test
      - name: Run property tests
        run: npm run test:property
      - name: Run integration tests
        run: npm run test:integration
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

### 测试维护

- 定期审查和更新测试用例
- 删除过时或重复的测试
- 重构测试代码以提高可维护性
- 记录复杂测试的意图和背景
- 监控测试执行时间，优化慢速测试

