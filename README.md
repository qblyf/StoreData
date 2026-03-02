# 门店数据指标看板 (Business Metrics Dashboard)

基于业务指标逻辑关系系统的可视化数据展示平台。

## 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Recharts** - 图表库
- **Vitest** - 测试框架
- **fast-check** - 属性测试库

## 项目结构

```
├── src/
│   ├── types/           # 类型定义
│   │   ├── core.ts      # 核心类型（Metric, Store, MetricValue 等）
│   │   ├── calculation.ts # 计算相关类型
│   │   └── index.ts     # 类型导出
│   ├── components/      # React 组件（待实现）
│   ├── services/        # 业务逻辑服务（待实现）
│   ├── utils/           # 工具函数（待实现）
│   ├── App.tsx          # 主应用组件
│   ├── main.tsx         # 应用入口
│   └── index.css        # 全局样式
├── index.html           # HTML 模板
├── package.json         # 依赖配置
├── tsconfig.json        # TypeScript 配置
└── vite.config.ts       # Vite 配置
```

## 开始使用

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 运行测试

```bash
# 运行所有测试
npm test

# 运行测试（监听模式）
npm run test:watch

# 仅运行属性测试
npm run test:property
```

## 核心功能

- ✅ 项目基础结构
- ✅ 核心类型定义
- ⏳ 模拟数据生成器
- ⏳ 指标计算引擎
- ⏳ KPI 卡片组件
- ⏳ 趋势图表组件
- ⏳ 筛选和交互功能
- ⏳ 门店对比功能
- ⏳ 预警和目标监控

## 需求覆盖

本项目实现了以下需求：

- Requirements 1.3, 1.4: 指标定义管理
- Requirements 4.1, 4.2: 毛利相关指标计算
- Requirements 5.1-5.4: 利润相关指标计算
- Requirements 7.1-7.3: 产出效率指标计算
- Requirements 8.3, 8.4: 客流相关指标管理
- Requirements 9.1-9.3: 门店配置管理
- Requirements 10.1-10.5: 指标目标管理

详见 `.kiro/specs/business-metrics-logic-system/requirements.md`

## 开发指南

### 类型定义

所有核心类型定义在 `src/types/` 目录下：

- `core.ts`: 核心数据模型（Metric, Store, MetricValue, DashboardConfig 等）
- `calculation.ts`: 计算相关类型（FinancialData, CalculatedMetrics 等）

### 测试策略

项目采用双重测试策略：

1. **单元测试**: 验证特定示例和边界情况
2. **属性测试**: 使用 fast-check 验证通用属性（每个测试至少 100 次迭代）

所有属性测试必须标记对应的设计文档属性编号。

## License

Private
