/**
 * Business Module Types
 * 业务分析板块类型定义
 */

export enum BusinessModule {
  OVERALL_SALES = 'overall_sales',           // 整体销售分析
  MARKET_BRAND = 'market_brand',             // 市场销量分析与品牌占比
  MAIN_BUSINESS = 'main_business',           // 主营分析
  OPERATOR = 'operator',                     // 运营商分析
  MEMBERSHIP = 'membership',                 // 付费会员分析
  RECYCLE = 'recycle',                       // 回收分析
  SECONDHAND = 'secondhand',                 // 二手机分析
  SMART_PRODUCTS = 'smart_products',         // 智能产品分析
  ACCESSORIES = 'accessories',               // 配件分析
  REPAIR = 'repair'                          // 维修分析
}

export interface ModuleConfig {
  id: BusinessModule;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
}

export const MODULE_CONFIGS: ModuleConfig[] = [
  {
    id: BusinessModule.OVERALL_SALES,
    name: '业务概览',
    icon: '📊',
    description: '销售、客流、毛利综合分析',
    enabled: true
  },
  {
    id: BusinessModule.MARKET_BRAND,
    name: '市场销量与品牌',
    icon: '🏷️',
    description: '各品牌销量、市场份额分析',
    enabled: true
  },
  {
    id: BusinessModule.MAIN_BUSINESS,
    name: '主营分析',
    icon: '💼',
    description: '主营业务收入、利润分析',
    enabled: true
  },
  {
    id: BusinessModule.OPERATOR,
    name: '运营商分析',
    icon: '📡',
    description: '各运营商业务数据分析',
    enabled: true
  },
  {
    id: BusinessModule.MEMBERSHIP,
    name: '付费会员分析',
    icon: '👥',
    description: '会员增长、转化、留存分析',
    enabled: true
  },
  {
    id: BusinessModule.RECYCLE,
    name: '回收分析',
    icon: '♻️',
    description: '回收量、回收价值分析',
    enabled: true
  },
  {
    id: BusinessModule.SECONDHAND,
    name: '二手机分析',
    icon: '📱',
    description: '二手机销售、库存分析',
    enabled: true
  },
  {
    id: BusinessModule.SMART_PRODUCTS,
    name: '智能产品分析',
    icon: '⌚',
    description: '智能设备销售数据分析',
    enabled: true
  },
  {
    id: BusinessModule.ACCESSORIES,
    name: '配件分析',
    icon: '🔌',
    description: '配件销售、利润贡献分析',
    enabled: true
  },
  {
    id: BusinessModule.REPAIR,
    name: '维修分析',
    icon: '🔧',
    description: '维修量、收入、满意度分析',
    enabled: true
  }
];
