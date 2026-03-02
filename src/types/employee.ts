/**
 * Employee Performance Types
 * 员工业绩相关类型定义
 */

export interface AuthorizationLevels {
  personnel: number; // 人事授权 (1-5级)
  finance: number; // 财务授权 (1-5级)
  operations: number; // 运营授权 (1-5级)
  marketing: number; // 营销授权 (1-5级)
  customer: number; // 客户授权 (1-5级)
}

export interface SalaryBreakdown {
  baseSalary: number; // 底工资
  commission: number; // 提成
  workPoints: number; // 工分
  bonus: number; // 奖金
}

export interface EmployeePerformance {
  employeeId: string;
  name: string;
  avatar: string; // 头像URL或emoji
  yearsOfService: number; // 工龄（年）
  education: string; // 学历
  position: string;
  isLeadershipTeam: boolean; // 是否三人班子成员
  authorizationLevels: AuthorizationLevels; // 5项授权能力等级
  salary: number; // 工资总额
  salaryBreakdown: SalaryBreakdown; // 工资构成
  grossProfit: number;
  salaryOutputRatio: number; // 工资产出指标 = 工资总额 / 毛利
  mainBusiness: number;
  mainBusinessSales: number; // 主营销量
  carrier: number;
  carrierSales: number; // 运营商销量
  paidMember: number;
  paidMemberSales: number; // 付费会员销量
  recycling: number;
  recyclingSales: number; // 回收销量
  secondHand: number;
  secondHandSales: number; // 二手销量
  accessories: number;
  accessoriesSales: number; // 配件销量
  smart: number;
  smartSales: number; // 智能销量
  repair: number;
  repairSales: number; // 维修销量
  values: number;
  medals: Medal[]; // 勋章列表
  trainingCourses: TrainingCourse[]; // 培训课程列表
  overallScore: number; // 综合评分 (0-100)
}

export interface Medal {
  id: string;
  name: string;
  icon: string; // emoji图标
  description: string;
  earnedDate: string; // 获得日期
  level?: 'bronze' | 'silver' | 'gold' | 'platinum'; // 勋章等级
}

export interface TrainingCourse {
  id: string;
  name: string;
  category: string; // 课程类别
  completedDate: string; // 完成日期
  duration: number; // 课时（小时）
  score?: number; // 考核分数（可选）
  status: 'completed' | 'in-progress' | 'passed'; // 状态
}

export type EmployeePosition = 
  | '店长'
  | '副店长'
  | '销售主管'
  | '高级销售'
  | '销售顾问'
  | '销售专员';

export type EducationLevel =
  | '博士'
  | '硕士'
  | '本科'
  | '大专'
  | '高中'
  | '中专';
