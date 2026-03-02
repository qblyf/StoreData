# FilterPanel Component

筛选面板组件，为门店数据指标看板提供多维度的数据筛选功能。

## 功能特性

### 1. 门店选择（支持多选）
- 显示所有可用门店列表
- 支持多选门店进行数据对比
- 提供"全选"和"清空"快捷操作
- 显示门店类型和级别信息

### 2. 时间范围选择
- 选择开始日期和结束日期
- 使用原生日期选择器，兼容性好
- 支持自定义时间范围

### 3. 指标类别筛选
- 结算相关
- 主营业务
- 客流相关
- 利润相关
- 收入成本
- 费用
- 产出相关

### 4. 门店类型筛选
- 旗舰店
- 标准店
- 迷你店

### 5. 门店级别筛选
- A级
- B级
- C级
- D级

## 使用示例

```tsx
import { FilterPanel } from './components/FilterPanel';
import { useState } from 'react';

function MyDashboard() {
  const [selectedStoreIds, setSelectedStoreIds] = useState(['store-001']);
  const [timeRange, setTimeRange] = useState({
    start: new Date('2024-01-01'),
    end: new Date('2024-01-31'),
  });
  const [selectedCategories, setSelectedCategories] = useState([
    MetricCategory.PROFIT,
    MetricCategory.TRAFFIC,
  ]);
  const [selectedStoreTypes, setSelectedStoreTypes] = useState([
    StoreType.FLAGSHIP,
  ]);
  const [selectedStoreLevels, setSelectedStoreLevels] = useState([
    StoreLevel.A,
  ]);

  return (
    <FilterPanel
      stores={mockStores}
      selectedStoreIds={selectedStoreIds}
      onStoreSelectionChange={setSelectedStoreIds}
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
      selectedCategories={selectedCategories}
      onCategoryChange={setSelectedCategories}
      selectedStoreTypes={selectedStoreTypes}
      onStoreTypeChange={setSelectedStoreTypes}
      selectedStoreLevels={selectedStoreLevels}
      onStoreLevelChange={setSelectedStoreLevels}
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `stores` | `Store[]` | Yes | 门店列表数据 |
| `selectedStoreIds` | `string[]` | Yes | 当前选中的门店ID列表 |
| `onStoreSelectionChange` | `(storeIds: string[]) => void` | Yes | 门店选择变化回调 |
| `timeRange` | `TimeRange` | Yes | 时间范围 |
| `onTimeRangeChange` | `(timeRange: TimeRange) => void` | Yes | 时间范围变化回调 |
| `selectedCategories` | `MetricCategory[]` | Yes | 选中的指标类别 |
| `onCategoryChange` | `(categories: MetricCategory[]) => void` | Yes | 指标类别变化回调 |
| `selectedStoreTypes` | `StoreType[]` | Yes | 选中的门店类型 |
| `onStoreTypeChange` | `(types: StoreType[]) => void` | Yes | 门店类型变化回调 |
| `selectedStoreLevels` | `StoreLevel[]` | Yes | 选中的门店级别 |
| `onStoreLevelChange` | `(levels: StoreLevel[]) => void` | Yes | 门店级别变化回调 |

## 交互设计

### 展开/收起
- 默认状态为收起，节省屏幕空间
- 点击"展开"按钮显示所有筛选选项
- 点击"收起"按钮隐藏筛选选项
- 按钮文字和图标会根据状态变化

### 多选逻辑
- 所有筛选项都支持多选
- 选中的项目会被高亮显示
- 可以随时添加或移除选项

### 快捷操作
- 门店选择提供"全选"和"清空"按钮
- 按钮会根据当前状态自动禁用（如已全选时禁用"全选"按钮）

## 样式特点

- 使用渐变色主题，与整体看板风格一致
- 响应式设计，适配移动端和桌面端
- 平滑的展开/收起动画
- 自定义滚动条样式
- Hover 效果提升交互体验

## 响应式设计

### 桌面端（>768px）
- 时间范围选择器横向排列
- 门店类型和级别筛选横向排列
- 充分利用屏幕宽度

### 平板端（768px - 480px）
- 时间范围选择器纵向排列
- 保持良好的可读性

### 移动端（<480px）
- 所有筛选项纵向排列
- "全选"和"清空"按钮占满宽度
- 优化触摸操作体验

## 可访问性

- 所有交互元素都有适当的 `aria-label`
- 支持键盘导航
- 使用语义化的 HTML 标签
- 颜色对比度符合 WCAG 标准

## 性能优化

- 使用受控组件模式，状态由父组件管理
- 避免不必要的重渲染
- 事件处理函数使用回调模式

## 需求映射

- **Requirements 9.4**: 支持按门店类型应用不同的指标配置
- **Requirements 9.5**: 支持按门店级别设置不同的最低标准目标
- **Requirements 10.2**: 支持按门店级别设置差异化目标

## 测试覆盖

组件包含完整的单元测试，覆盖以下场景：
- 基本渲染
- 展开/收起功能
- 门店选择（单选、多选、全选、清空）
- 时间范围选择
- 指标类别筛选
- 门店类型筛选
- 门店级别筛选
- 所有回调函数的正确调用

运行测试：
```bash
npm test -- FilterPanel.test.tsx
```
