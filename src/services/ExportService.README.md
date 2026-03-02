# ExportService

数据和图表导出服务，支持将指标数据导出为 CSV 格式，以及将图表导出为 PNG 图片。

## 功能特性

### 1. CSV 数据导出

将当前视图的指标数据导出为 CSV 格式文件。

**特性：**
- UTF-8 编码（带 BOM），完美支持中文字符
- 包含完整的指标信息：名称、当前值、单位、目标值、完成率、计算公式
- 自动处理 CSV 特殊字符（逗号、引号、换行符）
- 文件名包含时间戳，便于归档管理
- 支持 null 值处理（显示为 "N/A"）

**导出格式：**
```csv
指标名称,当前值,单位,目标值,完成率,计算公式
收入,100000.00,元,120000.00,83.3%,N/A
毛利,35000.00,元,40000.00,87.5%,revenue - product_cost - adjustment_cost
成交率,15.50,%,20.00,77.5%,transaction_count / entering_traffic
```

**Requirements:** 12.5, 12.6, 12.7

### 2. PNG 图表导出

将看板图表导出为高质量 PNG 图片。

**特性：**
- 使用 html2canvas 库进行截图
- 2倍分辨率，确保图片清晰度
- 白色背景，适合打印和分享
- 支持跨域资源（CORS）
- 文件名包含图表名称和时间戳

**Requirements:** 12.5

## 使用方法

### 在 Dashboard 组件中使用

```typescript
import { ExportService } from '../services/ExportService';
import { mockMetrics } from '../data';

// 导出 CSV 数据
const handleExportData = () => {
  const metricDefinitions = new Map(
    mockMetrics.map(m => [m.id, { name: m.name, formula: m.formula }])
  );
  
  ExportService.exportToCSV(
    metricValues,
    targetSettings,
    metricDefinitions
  );
};

// 导出图表为 PNG
const handleExportChart = async () => {
  try {
    await ExportService.exportChartToPNG('dashboard-content', '门店指标看板');
  } catch (error) {
    console.error('导出失败:', error);
  }
};
```

### API 参考

#### `exportToCSV(metricValues, targetSettings, metricDefinitions)`

导出指标数据为 CSV 格式。

**参数：**
- `metricValues: MetricValue[]` - 指标值数组
- `targetSettings: TargetSetting[]` - 目标设置数组
- `metricDefinitions: Map<string, { name: string; formula?: string }>` - 指标定义映射

**返回值：** `void` - 自动触发文件下载

**示例：**
```typescript
const metricDefinitions = new Map([
  ['revenue', { name: '收入', formula: undefined }],
  ['gross_profit', { name: '毛利', formula: 'revenue - product_cost - adjustment_cost' }]
]);

ExportService.exportToCSV(metricValues, targetSettings, metricDefinitions);
```

#### `exportChartToPNG(elementId, chartName)`

导出图表为 PNG 图片。

**参数：**
- `elementId: string` - 要导出的 DOM 元素 ID
- `chartName: string` - 图表名称（用于文件名，默认为 "图表"）

**返回值：** `Promise<void>` - 异步操作，完成后自动触发文件下载

**示例：**
```typescript
await ExportService.exportChartToPNG('dashboard-content', '门店指标看板');
```

**错误处理：**
```typescript
try {
  await ExportService.exportChartToPNG('my-chart', '销售趋势');
} catch (error) {
  if (error.message.includes('not found')) {
    console.error('找不到指定的图表元素');
  } else {
    console.error('导出失败:', error);
  }
}
```

## 文件命名规则

### CSV 文件
格式：`指标数据_YYYY-MM-DDTHH-MM-SS.csv`

示例：`指标数据_2024-01-15T14-30-25.csv`

### PNG 文件
格式：`{chartName}_YYYY-MM-DDTHH-MM-SS.png`

示例：`门店指标看板_2024-01-15T14-30-25.png`

## 依赖项

- **html2canvas** (^1.4.1) - 用于图表截图功能
  ```bash
  npm install html2canvas
  ```

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**注意：** 图表导出功能需要浏览器支持 Canvas API 和 Blob API。

## 错误处理

### CSV 导出错误

CSV 导出过程中的错误会被捕获并记录到控制台。常见错误：
- 数据格式不正确
- 浏览器不支持 Blob API

### PNG 导出错误

PNG 导出可能遇到的错误：
- `Element with id "xxx" not found` - 找不到指定的 DOM 元素
- `导出图表失败，请稍后重试` - html2canvas 渲染失败

**建议：**
- 确保要导出的元素已经渲染完成
- 检查元素 ID 是否正确
- 确保元素在视口内可见

## 性能考虑

### CSV 导出
- 轻量级操作，即使大量数据也能快速完成
- 内存占用小，适合导出大量指标

### PNG 导出
- 需要渲染整个 DOM 元素，可能需要几秒钟
- 建议在导出时显示加载指示器
- 大型图表可能占用较多内存

## 测试

运行单元测试：
```bash
npm test -- ExportService.test.ts
```

测试覆盖：
- CSV 格式正确性
- 特殊字符转义
- null 值处理
- 文件名格式
- 目标值匹配逻辑
- 错误处理

## 未来改进

可能的功能增强：
- [ ] 支持 Excel 格式导出（.xlsx）
- [ ] 支持 PDF 格式导出
- [ ] 批量导出多个图表
- [ ] 自定义 CSV 列选择
- [ ] 导出进度提示
- [ ] 导出历史记录

## 相关文档

- [Requirements Document](../../.kiro/specs/business-metrics-logic-system/requirements.md) - 需求 12.5, 12.6, 12.7
- [Design Document](../../.kiro/specs/business-metrics-logic-system/design.md) - 导出功能设计
- [Dashboard Component](../components/Dashboard.tsx) - 使用示例
