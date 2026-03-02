# Requirements Document

## Introduction

本文档定义了业务指标逻辑关系系统的需求。该系统用于管理和计算多个业务指标和财务指标，建立指标之间的逻辑关系和依赖关系，支持门店的业务分析和决策。系统涵盖结算、主营业务、客流、利润、成本、费用等多个维度的指标管理。

## Glossary

- **System**: 业务指标逻辑关系系统
- **Metric**: 指标，用于衡量业务或财务表现的量化数据
- **Business_Metric**: 业务指标，包括结算、主营业务、客流等相关指标
- **Financial_Metric**: 财务指标，包括利润、成本、费用等相关指标
- **Dependency**: 依赖关系，指一个指标的计算需要依赖其他指标的值
- **Calculation_Formula**: 计算公式，定义指标如何从其他指标或原始数据计算得出
- **Store**: 门店，业务运营的基本单位
- **Store_Type**: 门店类型，门店的分类标识
- **Store_Level**: 门店级别，门店的等级分类
- **Metric_Configuration**: 指标配置，定义指标的属性和计算规则
- **Gross_Profit**: 毛利，收入减去商品成本
- **Net_Profit**: 净利润，毛利减去各项费用后的利润
- **Conversion_Rate**: 成交率，成交客户数与进店客流的比率
- **Traffic**: 客流，包括过店客流和进店客流
- **Labor_Cost**: 工费，包括销售费用和管理费用
- **Rent_Cost**: 租费，包括房租待摊和其他相关费用

## Requirements

### Requirement 1: 指标定义管理

**User Story:** 作为系统管理员，我希望能够定义和管理各类指标，以便建立完整的指标体系。

#### Acceptance Criteria

1. THE System SHALL 支持定义业务指标类别（结算相关、主营业务相关、客流相关）
2. THE System SHALL 支持定义财务指标类别（利润相关、收入成本、费用、产出相关）
3. WHEN 创建新指标时，THE System SHALL 要求指定指标名称、类别、单位和数据类型
4. THE System SHALL 为每个指标分配唯一标识符
5. THE System SHALL 支持指标的启用和禁用状态管理

### Requirement 2: 指标计算公式配置

**User Story:** 作为系统管理员，我希望能够配置指标的计算公式，以便系统自动计算派生指标。

#### Acceptance Criteria

1. WHEN 配置指标计算公式时，THE System SHALL 支持引用其他指标作为计算因子
2. THE System SHALL 支持基本数学运算符（加、减、乘、除）
3. THE System SHALL 支持百分比计算和比率计算
4. WHEN 保存计算公式时，THE System SHALL 验证公式的语法正确性
5. IF 公式引用了不存在的指标，THEN THE System SHALL 返回错误提示
6. THE System SHALL 记录每个指标的计算公式版本历史

### Requirement 3: 指标依赖关系管理

**User Story:** 作为系统管理员，我希望系统能够自动识别和管理指标之间的依赖关系，以便确保计算顺序正确。

#### Acceptance Criteria

1. WHEN 配置指标计算公式时，THE System SHALL 自动识别指标依赖关系
2. THE System SHALL 构建指标依赖关系图
3. IF 检测到循环依赖，THEN THE System SHALL 拒绝保存配置并提示错误
4. THE System SHALL 按照依赖关系的拓扑顺序计算指标值
5. WHEN 查询指标时，THE System SHALL 显示该指标依赖的所有上游指标
6. WHEN 查询指标时，THE System SHALL 显示依赖该指标的所有下游指标

### Requirement 4: 毛利相关指标计算

**User Story:** 作为财务分析师，我希望系统能够准确计算毛利相关指标，以便分析业务盈利能力。

#### Acceptance Criteria

1. THE System SHALL 计算总毛利为收入减去商品成本
2. THE System SHALL 计算毛利率为毛利除以收入
3. THE System SHALL 支持按机型分类计算毛利率
4. THE System SHALL 计算毛利构成中各业务类型的占比
5. WHEN 调价发生时，THE System SHALL 将调价成本纳入成本计算
6. THE System SHALL 计算各项业务配比占总毛利的百分比

### Requirement 5: 利润相关指标计算

**User Story:** 作为财务分析师，我希望系统能够计算净利润和利润率，以便评估门店盈利状况。

#### Acceptance Criteria

1. THE System SHALL 计算利润为毛利减去工费、租费和其他费用
2. THE System SHALL 计算净利率为利润除以收入
3. THE System SHALL 计算利润率为利润除以毛利
4. THE System SHALL 计算费用占比为（利润加工费加租费加其他费用）除以毛利
5. WHEN 任一费用项更新时，THE System SHALL 重新计算利润相关指标
6. THE System SHALL 支持按时间周期（日、周、月）汇总利润指标

### Requirement 6: 费用指标管理

**User Story:** 作为财务分析师，我希望系统能够分类管理各项费用，以便进行成本控制分析。

#### Acceptance Criteria

1. THE System SHALL 分类记录工费（销售费用、管理费用）
2. THE System SHALL 分类记录租费（房租待摊、其他费用）
3. THE System SHALL 记录支付手续费和国补费用
4. THE System SHALL 记录提成费用
5. THE System SHALL 计算总费用为所有费用项之和
6. THE System SHALL 支持按费用类别查询和统计

### Requirement 7: 产出效率指标计算

**User Story:** 作为运营经理，我希望系统能够计算人工产出和毛利产出效率，以便评估人员效能。

#### Acceptance Criteria

1. THE System SHALL 计算毛利工费比为毛利除以工费
2. THE System SHALL 计算人工产出为毛利除以员工人数
3. THE System SHALL 计算毛利工费产出为毛利除以工费
4. WHEN 员工人数变化时，THE System SHALL 更新人工产出指标
5. THE System SHALL 支持按营业员统计个人销售产出
6. THE System SHALL 支持按职员统计销售销量

### Requirement 8: 客流相关指标管理

**User Story:** 作为运营经理，我希望系统能够管理客流数据和成交率，以便分析客户转化效果。

#### Acceptance Criteria

1. THE System SHALL 记录过店客流数量
2. THE System SHALL 记录进店客流数量
3. THE System SHALL 计算进店率为进店客流除以过店客流
4. THE System SHALL 计算成交率为成交客户数除以进店客流
5. THE System SHALL 记录直播和视频拍摄活动数据
6. THE System SHALL 记录企微转发次数
7. THE System SHALL 记录京东和美团平台排名

### Requirement 9: 门店配置管理

**User Story:** 作为系统管理员，我希望能够配置门店类型和级别，以便对不同门店应用不同的指标标准。

#### Acceptance Criteria

1. THE System SHALL 支持定义门店类型
2. THE System SHALL 支持定义门店级别
3. WHEN 创建门店时，THE System SHALL 要求指定门店类型和级别
4. WHERE 门店类型不同，THE System SHALL 支持应用不同的指标配置
5. WHERE 门店级别不同，THE System SHALL 支持设置不同的最低标准目标
6. THE System SHALL 支持批量修改同类型门店的配置

### Requirement 10: 指标目标管理

**User Story:** 作为运营经理，我希望能够设置指标的目标值，以便监控业务目标达成情况。

#### Acceptance Criteria

1. THE System SHALL 支持为每个指标设置最低标准目标值
2. WHERE 门店级别已配置，THE System SHALL 支持按门店级别设置差异化目标
3. THE System SHALL 支持按时间周期设置目标值
4. WHEN 实际指标值低于目标值时，THE System SHALL 标记为未达标状态
5. THE System SHALL 计算目标完成率为实际值除以目标值
6. THE System SHALL 支持目标值的历史版本管理

### Requirement 11: 市场份额指标

**User Story:** 作为市场分析师，我希望系统能够记录和分析市场份额数据，以便了解竞争地位。

#### Acceptance Criteria

1. THE System SHALL 记录门店的市场份额数据
2. THE System SHALL 支持按区域统计市场份额
3. THE System SHALL 支持按产品类别统计市场份额
4. WHEN 市场总量数据更新时，THE System SHALL 重新计算市场份额
5. THE System SHALL 支持市场份额的趋势分析
6. THE System SHALL 支持与竞争对手的市场份额对比

### Requirement 12: 指标数据导入导出

**User Story:** 作为数据分析师，我希望能够导入导出指标数据，以便与其他系统集成和进行离线分析。

#### Acceptance Criteria

1. THE System SHALL 支持从 Excel 文件导入指标原始数据
2. THE System SHALL 支持从 CSV 文件导入指标原始数据
3. WHEN 导入数据时，THE System SHALL 验证数据格式和数据类型
4. IF 导入数据包含错误，THEN THE System SHALL 生成错误报告并拒绝导入
5. THE System SHALL 支持导出指标数据为 Excel 格式
6. THE System SHALL 支持导出指标数据为 CSV 格式
7. WHEN 导出数据时，THE System SHALL 包含指标名称、计算公式和依赖关系信息

### Requirement 13: 指标计算结果缓存

**User Story:** 作为系统用户，我希望系统能够快速响应指标查询请求，以便提高工作效率。

#### Acceptance Criteria

1. WHEN 指标计算完成后，THE System SHALL 缓存计算结果
2. WHEN 查询已缓存的指标时，THE System SHALL 在 100 毫秒内返回结果
3. WHEN 依赖的原始数据更新时，THE System SHALL 使相关指标缓存失效
4. THE System SHALL 按照依赖关系级联更新受影响的指标缓存
5. THE System SHALL 支持手动刷新指标缓存
6. THE System SHALL 记录缓存命中率用于性能监控

### Requirement 14: 指标逻辑关系可视化

**User Story:** 作为系统管理员，我希望能够可视化查看指标之间的逻辑关系，以便理解指标体系结构。

#### Acceptance Criteria

1. THE System SHALL 以图形方式展示指标依赖关系
2. WHEN 选择某个指标时，THE System SHALL 高亮显示其所有依赖路径
3. THE System SHALL 支持按指标类别过滤依赖关系图
4. THE System SHALL 在依赖关系图中显示计算公式
5. THE System SHALL 支持导出依赖关系图为图片格式
6. THE System SHALL 支持交互式探索指标关系（点击节点展开详情）

### Requirement 15: 指标计算审计日志

**User Story:** 作为审计人员，我希望系统能够记录指标计算的审计日志，以便追溯数据来源和计算过程。

#### Acceptance Criteria

1. WHEN 指标计算执行时，THE System SHALL 记录计算时间戳
2. THE System SHALL 记录参与计算的所有输入值
3. THE System SHALL 记录使用的计算公式版本
4. THE System SHALL 记录计算结果值
5. THE System SHALL 记录触发计算的用户或系统事件
6. THE System SHALL 支持按指标、时间范围查询审计日志
7. THE System SHALL 保留审计日志至少 3 年

---

## 指标逻辑关系说明

### 核心计算链路

```
原始数据层:
- 收入
- 商品成本
- 调价成本
- 各项费用（工费、租费、其他费用）
- 客流数据
- 员工人数

↓

一级派生指标:
- 毛利 = 收入 - 商品成本 - 调价成本
- 总费用 = 工费 + 租费 + 其他费用

↓

二级派生指标:
- 利润 = 毛利 - 总费用
- 毛利率 = 毛利 / 收入
- 进店率 = 进店客流 / 过店客流
- 成交率 = 成交客户数 / 进店客流

↓

三级派生指标:
- 净利率 = 利润 / 收入
- 利润率 = 利润 / 毛利
- 人工产出 = 毛利 / 员工人数
- 毛利工费比 = 毛利 / 工费
- 目标完成率 = 实际值 / 目标值
```

