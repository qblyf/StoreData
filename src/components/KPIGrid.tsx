/**
 * KPI Grid Component - Tab-based Pages
 * Requirements: 4.1, 4.2, 5.1, 5.2, 7.2, 8.4
 * 
 * Displays metrics organized by three dimensions (as separate pages):
 * - Financial: Revenue, costs, profits, margins (财务分析)
 * - Business: Traffic, conversion, sales performance (业务分析)
 * - Action: Employee productivity and efficiency (动作分析)
 */

import React, { useMemo, useState, useCallback } from 'react';
import { KPICard } from './KPICard';
import { FinancialSummary } from './FinancialSummary';
import { EmployeePerformanceTable } from './EmployeePerformanceTable';
import { SalesFunnel } from './SalesFunnel';
import { BusinessGrossProfitFlow } from './BusinessGrossProfitFlow';
import { TrendLineChart } from './TrendLineChart';
import { BarChart } from './BarChart';
import { MetricValue, TargetSetting, Alert, AlertSeverity, TimeGranularity } from '../types';
import { getAllEmployeePerformance } from '../data/mockEmployees';
import {
  MarketBrandModule,
  MainBusinessModule,
  OperatorModule,
  MembershipModule,
  RecycleModule,
  SecondhandModule,
  SmartProductsModule,
  AccessoriesModule,
  RepairModule
} from './modules';
import './KPIGrid.css';

// Type for sub-metrics
interface SubMetric {
  metricId: string;
  metricName: string;
  unit: string;
  formula: string;
}

// Type for metric configuration
interface MetricConfig {
  metricId: string;
  metricName: string;
  unit: string;
  hasTarget: boolean;
  description: string;
  formula: string;
  assessmentCriteria: string;
  subMetrics?: SubMetric[];
}

export interface KPIGridProps {
  metricValues: MetricValue[];
  targetSettings: TargetSetting[];
  storeId: string;
  activeTab: 'financial' | 'business' | 'action';
  alerts?: Alert[];
  onAlertClick?: (alert: Alert) => void;
}

// Business sub-tab type
type BusinessSubTab = 'overview' | 'market_brand' | 'main_business' | 
  'operator' | 'membership' | 'recycle' | 'secondhand' | 'smart_products' | 
  'accessories' | 'repair';

export const KPIGrid: React.FC<KPIGridProps> = React.memo(({
  metricValues,
  targetSettings,
  storeId,
  activeTab,
  alerts = [],
  onAlertClick,
}) => {
  // Business sub-tab state
  const [activeBusinessSubTab, setActiveBusinessSubTab] = useState<BusinessSubTab>('overview');

  // Handle business sub-tab change
  const handleBusinessSubTabChange = useCallback((subTab: BusinessSubTab) => {
    setActiveBusinessSubTab(subTab);
  }, []);

  // Business sub-tabs configuration
  const businessSubTabs = [
    { id: 'overview' as BusinessSubTab, label: '业务概览', icon: '📊' },
    { id: 'market_brand' as BusinessSubTab, label: '市场品牌', icon: '🏷️' },
    { id: 'main_business' as BusinessSubTab, label: '主营分析', icon: '💼' },
    { id: 'operator' as BusinessSubTab, label: '运营商', icon: '📡' },
    { id: 'membership' as BusinessSubTab, label: '会员', icon: '👥' },
    { id: 'recycle' as BusinessSubTab, label: '回收', icon: '♻️' },
    { id: 'secondhand' as BusinessSubTab, label: '二手机', icon: '📱' },
    { id: 'smart_products' as BusinessSubTab, label: '智能产品', icon: '⌚' },
    { id: 'accessories' as BusinessSubTab, label: '配件', icon: '🔌' },
    { id: 'repair' as BusinessSubTab, label: '维修', icon: '🔧' },
  ];
  // Helper function to get metric value - memoized
  const getMetricValue = useMemo(() => {
    const metricMap = new Map<string, number | null>();
    metricValues.forEach(m => {
      if (m.storeId === storeId) {
        metricMap.set(m.metricId, m.value);
      }
    });
    return (metricId: string): number | null => {
      return metricMap.get(metricId) ?? null;
    };
  }, [metricValues, storeId]);

  // Helper function to get target value - memoized
  const getTargetValue = useMemo(() => {
    const targetMap = new Map<string, number>();
    targetSettings.forEach(t => {
      if (t.storeId === storeId) {
        targetMap.set(t.metricId, t.targetValue);
      }
    });
    return (metricId: string): number | undefined => {
      return targetMap.get(metricId);
    };
  }, [targetSettings, storeId]);

  // Helper function to calculate target completion
  const calculateTargetCompletion = (
    currentValue: number | null,
    targetValue: number | undefined
  ): number | undefined => {
    if (currentValue === null || targetValue === undefined) return undefined;
    return (currentValue / targetValue) * 100;
  };

  // Helper function to check if target is unmet
  const isUnmetTarget = (
    currentValue: number | null,
    targetValue: number | undefined
  ): boolean => {
    if (currentValue === null || targetValue === undefined) return false;
    return currentValue < targetValue;
  };

  // Generate mock period change (for demo purposes)
  const getMockPeriodChange = (): number => {
    return Math.random() * 20 - 5; // Random between -5% and +15%
  };

  // Get alert for a specific metric
  const getAlertForMetric = (metricId: string): Alert | undefined => {
    return alerts.find(alert => alert.metricId === metricId && alert.storeId === storeId);
  };

  // Get alert severity for a metric
  const getAlertSeverity = (metricId: string): AlertSeverity | undefined => {
    const alert = getAlertForMetric(metricId);
    return alert?.severity;
  };

  // Financial Metrics - 利润相关指标（合并显示）
  const financialMetrics: MetricConfig[] = [
    {
      metricId: 'gross_profit',
      metricName: '毛利',
      unit: '元',
      hasTarget: true,
      description: '收入-成本',
      formula: '毛利 = 营业收入 - 总成本',
      assessmentCriteria: '按营业收入的45-55%设定，参考行业标准毛利率水平',
      subMetrics: [
        {
          metricId: 'gross_profit_margin',
          metricName: '毛利率',
          unit: '%',
          formula: '毛利率 = (毛利 ÷ 营业收入) × 100%',
        }
      ]
    },
    {
      metricId: 'labor_cost',
      metricName: '工费',
      unit: '元',
      hasTarget: true,
      description: '人工成本',
      formula: '工费 = 员工工资 + 社保公积金 + 管理费用',
      assessmentCriteria: '按营业收入的12-18%控制，综合考虑人员配置、薪资水平、社保成本',
      subMetrics: [
        {
          metricId: 'labor_output_ratio',
          metricName: '工费产出',
          unit: '倍',
          formula: '工费产出 = 毛利 ÷ 工费',
        }
      ]
    },
    {
      metricId: 'rent_cost',
      metricName: '租费',
      unit: '元',
      hasTarget: true,
      description: '租金成本',
      formula: '租费 = 门店租金 + 物业费',
      assessmentCriteria: '按营业收入的8-12%控制，根据门店位置和面积调整',
      subMetrics: [
        {
          metricId: 'rent_output_ratio',
          metricName: '租费产出',
          unit: '倍',
          formula: '租费产出 = 毛利 ÷ 租费',
        },
        {
          metricId: 'rent_traffic_cost',
          metricName: '租费客流',
          unit: '元/人',
          formula: '租费客流 = (租费 + 营销费用) ÷ 进店人数',
        }
      ]
    },
    {
      metricId: 'total_expenses',
      metricName: '总费用',
      unit: '元',
      hasTarget: true,
      description: '工费+租费+其他',
      formula: '总费用 = 工费 + 租费 + 其他费用',
      assessmentCriteria: '按营业收入的25-35%控制，综合考虑人工、租金、运营成本'
    },
    {
      metricId: 'profit',
      metricName: '利润',
      unit: '元',
      hasTarget: true,
      description: '毛利-费用',
      formula: '净利润 = 毛利 - 总费用',
      assessmentCriteria: '投资回报法：目标净利润=总投资额×期望年回报率(25-35%)÷12个月，确保投资回收期3-4年',
      subMetrics: [
        {
          metricId: 'net_profit_margin',
          metricName: '净利率',
          unit: '%',
          formula: '净利率 = (净利润 ÷ 营业收入) × 100%',
        },
        {
          metricId: 'profit_margin',
          metricName: '利润率',
          unit: '%',
          formula: '利润率 = (净利润 ÷ 毛利) × 100%',
        },
        {
          metricId: 'roi',
          metricName: '投资回报率',
          unit: '%',
          formula: '投资回报率 = (利润 ÷ 固定资产) × 100%',
        }
      ]
    },
  ];

  // Business Metrics - 客流、转化、销售
  const businessMetrics: MetricConfig[] = [
    {
      metricId: 'total_traffic',
      metricName: '总客流量',
      unit: '人',
      hasTarget: true,
      description: '所有客流总和',
      formula: '总客流量 = 过店客流 + 进店客流',
      assessmentCriteria: '综合评估门店位置和吸引力，月度目标根据商圈特点设定'
    },
    {
      metricId: 'passing_traffic',
      metricName: '过店客流',
      unit: '人',
      hasTarget: true,
      description: '经过门店的客流',
      formula: '过店客流 = 统计周期内经过门店的总人数',
      assessmentCriteria: '基于门店位置、商圈人流量、历史数据，按日均客流×营业天数计算'
    },
    {
      metricId: 'entering_traffic',
      metricName: '进店客流',
      unit: '人',
      hasTarget: true,
      description: '进入门店的客流',
      formula: '进店客流 = 统计周期内进入门店的总人数',
      assessmentCriteria: '按过店客流的15-25%设定，参考门店吸引力和陈列效果'
    },
    {
      metricId: 'entry_rate',
      metricName: '进店率',
      unit: '%',
      hasTarget: true,
      description: '进店/过店',
      formula: '进店率 = (进店客流 ÷ 过店客流) × 100%',
      assessmentCriteria: '行业标准20%±5%，根据门店形象、橱窗设计、促销活动调整'
    },
    {
      metricId: 'transaction_count',
      metricName: '成交客户数',
      unit: '人',
      hasTarget: true,
      description: '完成交易的客户',
      formula: '成交客户数 = 统计周期内完成购买的客户总数',
      assessmentCriteria: '按进店客流的30-50%设定，结合销售团队能力和商品竞争力'
    },
    {
      metricId: 'conversion_rate',
      metricName: '成交率',
      unit: '%',
      hasTarget: true,
      description: '成交/进店',
      formula: '成交率 = (成交客户数 ÷ 进店客流) × 100%',
      assessmentCriteria: '行业基准值40%±10%，参考客单价、商品适配度、服务质量'
    },
    {
      metricId: 'traffic_conversion_rate',
      metricName: '客流转化率',
      unit: '%',
      hasTarget: true,
      description: '成交/总客流',
      formula: '客流转化率 = (成交客户数 ÷ 总客流量) × 100%',
      assessmentCriteria: '综合评估整体转化效率，目标8-15%'
    },
  ];

  // Action Metrics - 动作效率（运营、营销、员工成长）
  const actionMetrics: MetricConfig[] = [
    // 运营分析
    {
      metricId: 'inspection_score',
      metricName: '巡检评分',
      unit: '分',
      hasTarget: true,
      description: '门店巡检得分',
      formula: '巡检评分 = 各项巡检指标加权平均分',
      assessmentCriteria: '目标90分以上，包含陈列、卫生、服务等多维度评估',
      subMetrics: [
        {
          metricId: 'customer_complaint',
          metricName: '客诉处理',
          unit: '件',
          formula: '客诉处理 = 统计周期内客户投诉总数，目标每月不超过3件，处理及时率100%',
        },
        {
          metricId: 'display_quality',
          metricName: '展陈质量',
          unit: '分',
          formula: '展陈质量 = 陈列规范度 + 视觉效果 + 更新频率，目标85分以上，定期更新主题陈列',
        },
        {
          metricId: 'hygiene_score',
          metricName: '卫生评分',
          unit: '分',
          formula: '卫生评分 = 门店清洁度 + 产品整洁度 + 环境维护，目标90分以上，每日检查记录',
        }
      ]
    },
    {
      metricId: 'user_rating',
      metricName: '用户评分',
      unit: '分',
      hasTarget: true,
      description: '顾客满意度评分',
      formula: '用户评分 = 各渠道用户评分加权平均',
      assessmentCriteria: '目标4.5分以上（5分制），持续提升服务质量'
    },
    
    // 营销分析
    {
      metricId: 'marketing_score',
      metricName: '运营评分',
      unit: '分',
      hasTarget: true,
      description: '门店运营综合得分',
      formula: '运营评分 = 各项运营指标加权平均分',
      assessmentCriteria: '目标85分以上，包含企业微信、抖音曝光、1公里营销等多维度评估',
      subMetrics: [
        {
          metricId: 'wechat_followers',
          metricName: '企业微信',
          unit: '人',
          formula: '企业微信 = 企业微信好友总数，月增长目标50人，活跃度保持60%以上',
        },
        {
          metricId: 'douyin_views',
          metricName: '抖音曝光',
          unit: '次',
          formula: '抖音曝光 = 统计周期内视频总播放量，月目标10万次播放，提升品牌曝光度',
        },
        {
          metricId: 'local_marketing',
          metricName: '1公里营销',
          unit: '人',
          formula: '1公里营销 = 周边社区营销活动触达人数，月目标触达500人，提升周边知名度',
        }
      ]
    },
    {
      metricId: 'instant_retail',
      metricName: '即时零售',
      unit: '分',
      hasTarget: true,
      description: '即时零售平台综合得分',
      formula: '即时零售 = 各平台订单量和销售额加权平均分',
      assessmentCriteria: '目标85分以上，包含美团订单、京东销售等平台业务评估',
      subMetrics: [
        {
          metricId: 'meituan_orders',
          metricName: '美团订单',
          unit: '单',
          formula: '美团订单 = 统计周期内美团订单总数，月增长目标10%，优化评分和服务',
        },
        {
          metricId: 'jd_sales',
          metricName: '京东销售',
          unit: '元',
          formula: '京东销售 = 统计周期内京东销售总额，月目标根据品类设定，保持稳定增长',
        }
      ]
    },
    
    // 员工成长分析
    {
      metricId: 'team_development',
      metricName: '团队建设',
      unit: '分',
      hasTarget: true,
      description: '团队建设综合得分',
      formula: '团队建设 = 学习培训、认证考核、团队协作、案例贡献等加权平均分',
      assessmentCriteria: '目标85分以上，包含学习时长、通关认证、3人班子、案例贡献、团建活动等多维度评估',
      subMetrics: [
        {
          metricId: 'training_hours',
          metricName: '学习时长',
          unit: '小时',
          formula: '学习时长 = 统计周期内人均培训时长，月人均培训不少于8小时，持续提升能力',
        },
        {
          metricId: 'certification_pass',
          metricName: '通关认证',
          unit: '人',
          formula: '通关认证 = 统计周期内通过各级认证人数，季度目标80%员工完成当前级别认证',
        },
        {
          metricId: 'leadership_team',
          metricName: '3人班子',
          unit: '分',
          formula: '3人班子 = 核心团队协作效能评分，目标85分以上，评估决策效率和执行力',
        },
        {
          metricId: 'case_contribution',
          metricName: '案例贡献',
          unit: '个',
          formula: '案例贡献 = 统计周期内提交的优秀案例数，每月至少1个优秀案例，鼓励创新实践分享',
        },
        {
          metricId: 'team_building',
          metricName: '团建活动',
          unit: '次',
          formula: '团建活动 = 统计周期内团建活动次数，每季度至少1次，增强团队凝聚力',
        }
      ]
    },
  ];

  const renderMetricCards = (metrics: MetricConfig[]) => {
    return metrics.map(card => {
      const currentValue = getMetricValue(card.metricId);
      const targetValue = card.hasTarget ? getTargetValue(card.metricId) : undefined;
      const targetCompletion = calculateTargetCompletion(currentValue, targetValue);
      const unmet = isUnmetTarget(currentValue, targetValue);
      const alertSeverity = getAlertSeverity(card.metricId);
      const alert = getAlertForMetric(card.metricId);

      // Check if this card has sub-metrics
      const hasSubMetrics = card.subMetrics && card.subMetrics.length > 0;

      return (
        <div key={card.metricId} className="kpi-card-wrapper">
          <KPICard
            metricName={card.metricName}
            currentValue={currentValue}
            unit={card.unit}
            targetValue={targetValue}
            targetCompletion={targetCompletion}
            periodChange={getMockPeriodChange()}
            periodLabel="环比"
            isUnmetTarget={unmet}
            formula={card.formula}
            assessmentCriteria={card.assessmentCriteria}
            alertSeverity={alertSeverity}
            onAlertClick={alert && onAlertClick ? () => onAlertClick(alert) : undefined}
          />
          
          {/* Render sub-metrics if they exist */}
          {hasSubMetrics && (
            <div className="sub-metrics">
              {card.subMetrics!.map(subMetric => {
                const subValue = getMetricValue(subMetric.metricId);
                return (
                  <div key={subMetric.metricId} className="sub-metric-item">
                    <div className="sub-metric-header">
                      <span className="sub-metric-name">{subMetric.metricName}</span>
                      <div className="sub-metric-value-container">
                        <span className="sub-metric-value">
                          {subValue !== null ? formatValue(subValue, subMetric.unit) : 'N/A'}
                        </span>
                        <span className="sub-metric-unit">{subMetric.unit}</span>
                      </div>
                    </div>
                    <div className="sub-metric-formula">{subMetric.formula}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    });
  };

  // Helper function to format values
  const formatValue = (value: number, unit: string): string => {
    if (unit === '元' || unit === '元/人') {
      return value.toLocaleString('zh-CN', { maximumFractionDigits: 0 });
    } else if (unit === '%') {
      return value.toFixed(1);
    } else {
      return value.toLocaleString('zh-CN', { maximumFractionDigits: 2 });
    }
  };

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'financial':
        return (
          <div className="kpi-grid-section financial-section">
            <div className="section-header">
              <div className="section-icon">💰</div>
              <div className="section-info">
                <h2 className="section-title">财务数据分析</h2>
                <p className="section-description">收入、成本、利润全链路分析 · 收入 → 成本 → 毛利 → 费用 → 净利润</p>
              </div>
            </div>
            
            {/* Financial Flow Summary */}
            <FinancialSummary
              revenue={getMetricValue('revenue')}
              totalCost={getMetricValue('total_cost')}
              grossProfit={getMetricValue('gross_profit')}
              laborCost={getMetricValue('labor_cost')}
              rentCost={getMetricValue('rent_cost')}
              otherExpenses={getMetricValue('other_expenses')}
              totalExpenses={getMetricValue('total_expenses')}
              profit={getMetricValue('profit')}
              revenueTarget={getTargetValue('revenue')}
              profitTarget={getTargetValue('profit')}
            />
            
            {/* Detailed Metrics */}
            <div className="kpi-grid-cards">
              {renderMetricCards(financialMetrics)}
            </div>
          </div>
        );

      case 'business':
        // Render business module based on sub-tab
        const renderBusinessContent = () => {
          switch (activeBusinessSubTab) {
            case 'overview':
              return (
                <>
                  <div className="section-header">
                    <div className="section-icon">📊</div>
                    <div className="section-info">
                      <h2 className="section-title">业务数据分析</h2>
                      <p className="section-description">销售、客流、转化、毛利综合分析</p>
                    </div>
                  </div>
                  
                  {/* Sales Core Metrics */}
                  <div className="module-section">
                    <h3 className="subsection-title">销售核心指标</h3>
                    <div className="kpi-grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                      <KPICard
                        metricName="营业收入"
                        currentValue={getMetricValue('revenue')}
                        unit="元"
                        targetValue={getTargetValue('revenue')}
                        targetCompletion={calculateTargetCompletion(getMetricValue('revenue'), getTargetValue('revenue'))}
                        periodChange={getMockPeriodChange()}
                        periodLabel="环比"
                      />
                      <KPICard
                        metricName="毛利"
                        currentValue={getMetricValue('gross_profit')}
                        unit="元"
                        targetValue={getTargetValue('gross_profit')}
                        targetCompletion={calculateTargetCompletion(getMetricValue('gross_profit'), getTargetValue('gross_profit'))}
                        periodChange={getMockPeriodChange()}
                        periodLabel="环比"
                      />
                      <KPICard
                        metricName="毛利率"
                        currentValue={getMetricValue('gross_profit_margin')}
                        unit="%"
                        targetValue={getTargetValue('gross_profit_margin')}
                        targetCompletion={calculateTargetCompletion(getMetricValue('gross_profit_margin'), getTargetValue('gross_profit_margin'))}
                        periodChange={getMockPeriodChange()}
                        periodLabel="环比"
                      />
                      <KPICard
                        metricName="净利润"
                        currentValue={getMetricValue('profit')}
                        unit="元"
                        targetValue={getTargetValue('profit')}
                        targetCompletion={calculateTargetCompletion(getMetricValue('profit'), getTargetValue('profit'))}
                        periodChange={getMockPeriodChange()}
                        periodLabel="环比"
                      />
                    </div>
                  </div>
                  
                  {/* Traffic Core Metrics */}
                  <div className="module-section">
                    <h3 className="subsection-title">客流核心指标</h3>
                    <div className="kpi-grid-cards">
                      {renderMetricCards(businessMetrics)}
                    </div>
                  </div>
                  
                  {/* Business Gross Profit Flow */}
                  <div className="module-section">
                    <BusinessGrossProfitFlow
                      mainBusinessGrossProfit={getMetricValue('main_business_gross_profit')}
                      operatorCommission={getMetricValue('operator_commission')}
                      accessoriesGrossProfit={getMetricValue('accessories_gross_profit')}
                      smartProductsGrossProfit={getMetricValue('smart_products_gross_profit')}
                      insuranceGrossProfit={getMetricValue('insurance_gross_profit')}
                      secondhandGrossProfit={getMetricValue('secondhand_gross_profit')}
                      membershipGrossProfit={getMetricValue('membership_gross_profit')}
                      totalGrossProfit={getMetricValue('total_business_gross_profit')}
                      totalGrossProfitTarget={getTargetValue('total_business_gross_profit')}
                    />
                  </div>
                  
                  {/* Sales Trends */}
                  <div className="module-section">
                    <h3 className="subsection-title">销售趋势</h3>
                    <div className="simple-trend-chart">
                      <div className="trend-chart-header">
                        <h4 className="trend-chart-title">近30天销售趋势</h4>
                        <span className="trend-chart-unit">单位: 元</span>
                      </div>
                      <div className="trend-chart-bars">
                        {[
                          { day: '第1周', value: 28000 },
                          { day: '第2周', value: 32000 },
                          { day: '第3周', value: 29500 },
                          { day: '第4周', value: 35000 },
                        ].map((item, index) => (
                          <div key={index} className="trend-bar-item">
                            <div className="trend-bar-label">{item.day}</div>
                            <div className="trend-bar-container">
                              <div 
                                className="trend-bar-fill"
                                style={{ width: `${(item.value / 35000) * 100}%` }}
                              >
                                <span className="trend-bar-value">{item.value.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Sales Comparison */}
                  <div className="module-section">
                    <h3 className="subsection-title">销售对比</h3>
                    <div className="simple-comparison-chart">
                      <div className="comparison-chart-header">
                        <h4 className="comparison-chart-title">各门店销售对比</h4>
                        <span className="comparison-chart-unit">单位: 元</span>
                      </div>
                      <div className="comparison-chart-bars">
                        {[
                          { store: '北京旗舰店', value: 125000, type: 'flagship' },
                          { store: '上海标准店', value: 98000, type: 'standard' },
                          { store: '广州标准店', value: 87000, type: 'standard' },
                          { store: '深圳迷你店', value: 56000, type: 'mini' },
                        ].map((item, index) => (
                          <div key={index} className="comparison-bar-item">
                            <div className="comparison-bar-label">{item.store}</div>
                            <div className="comparison-bar-container">
                              <div 
                                className={`comparison-bar-fill ${item.type}`}
                                style={{ width: `${(item.value / 125000) * 100}%` }}
                              >
                                <span className="comparison-bar-value">{item.value.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              );
            case 'market_brand':
              return <MarketBrandModule />;
            case 'main_business':
              return <MainBusinessModule />;
            case 'operator':
              return <OperatorModule />;
            case 'membership':
              return <MembershipModule />;
            case 'recycle':
              return <RecycleModule />;
            case 'secondhand':
              return <SecondhandModule />;
            case 'smart_products':
              return <SmartProductsModule />;
            case 'accessories':
              return <AccessoriesModule />;
            case 'repair':
              return <RepairModule />;
            default:
              return null;
          }
        };

        return (
          <div className="kpi-grid-section business-section">
            {/* Business Sub-Navigation */}
            <nav className="business-sub-navigation">
              <div className="business-sub-tabs">
                {businessSubTabs.map(subTab => (
                  <button
                    key={subTab.id}
                    className={`business-sub-tab ${activeBusinessSubTab === subTab.id ? 'active' : ''}`}
                    onClick={() => handleBusinessSubTabChange(subTab.id)}
                  >
                    <span className="sub-tab-icon">{subTab.icon}</span>
                    <span className="sub-tab-label">{subTab.label}</span>
                  </button>
                ))}
              </div>
            </nav>
            
            {/* Business Content */}
            <div className="business-content-area">
              {renderBusinessContent()}
            </div>
          </div>
        );

      case 'action':
        // Get employee performance data
        const employeeMap = getAllEmployeePerformance();
        const employees = employeeMap.get(storeId) || [];
        
        // Calculate total main business sales from employees
        const totalMainBusinessSales = employees.reduce((sum, emp) => sum + emp.mainBusinessSales, 0);
        
        return (
          <div className="kpi-grid-section action-section">
            <div className="section-header">
              <div className="section-icon">⚡</div>
              <div className="section-info">
                <h2 className="section-title">动作数据分析</h2>
                <p className="section-description">运营·营销·人员·成长 四维度综合分析 · 全方位评估门店执行力</p>
              </div>
            </div>
            
            {/* Sales Funnel */}
            <SalesFunnel
              passingTraffic={getMetricValue('passing_traffic')}
              enteringTraffic={getMetricValue('entering_traffic')}
              mainBusinessSales={totalMainBusinessSales}
            />
            
            {/* Employee Performance Table */}
            <div className="employee-section">
              <h3 className="subsection-title">� 人员业绩分析</h3>
              <EmployeePerformanceTable employees={employees} />
            </div>
            
            {/* Other Action Metrics */}
            <div className="action-metrics-section">
              <h3 className="subsection-title">📊 运营·营销·成长指标</h3>
              <div className="kpi-grid-cards">
                {renderMetricCards(actionMetrics)}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="kpi-grid">
      {renderTabContent()}
    </div>
  );
});
