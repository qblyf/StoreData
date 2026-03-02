/**
 * Mock Employee Data Generator
 * 员工数据生成器
 */

import { EmployeePerformance, EmployeePosition, EducationLevel, Medal, TrainingCourse } from '../types/employee';

const employeeNames = [
  '张伟', '李娜', '王芳', '刘强', '陈静',
  '杨洋', '赵敏', '孙浩', '周杰', '吴磊',
  '郑雪', '王磊', '李明', '陈晨', '林峰'
];

const avatarEmojis = [
  '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', '👨‍💻',
  '👩‍💻', '👨‍🔧', '👩‍🔧', '👨‍🏫', '👩‍🏫',
  '👨‍⚕️', '👩‍⚕️', '👨‍🚀', '👩‍🚀', '👨‍🎨'
];

// Available medals
const availableMedals: Omit<Medal, 'earnedDate'>[] = [
  { id: 'sales-champion', name: '销售冠军', icon: '🏆', description: '月度销售业绩第一名', level: 'gold' },
  { id: 'service-star', name: '服务之星', icon: '⭐', description: '客户满意度评分最高', level: 'gold' },
  { id: 'team-player', name: '团队协作', icon: '🤝', description: '优秀团队协作表现', level: 'silver' },
  { id: 'innovation', name: '创新先锋', icon: '💡', description: '提出创新方案并实施', level: 'silver' },
  { id: 'perfect-attendance', name: '全勤奖', icon: '📅', description: '全年无缺勤记录', level: 'bronze' },
  { id: 'fast-learner', name: '学习达人', icon: '📚', description: '完成所有培训课程', level: 'bronze' },
  { id: 'customer-favorite', name: '客户最爱', icon: '❤️', description: '客户指名服务次数最多', level: 'gold' },
  { id: 'mentor', name: '优秀导师', icon: '👨‍🏫', description: '成功培养新员工', level: 'silver' },
  { id: 'problem-solver', name: '问题解决', icon: '🔧', description: '快速解决客户问题', level: 'bronze' },
  { id: 'quality-expert', name: '品质专家', icon: '💎', description: '零投诉记录', level: 'platinum' },
];

// Available training courses
const availableTrainingCourses: Omit<TrainingCourse, 'completedDate' | 'score' | 'status'>[] = [
  { id: 'sales-basic', name: '销售基础技能', category: '销售培训', duration: 8 },
  { id: 'sales-advanced', name: '高级销售技巧', category: '销售培训', duration: 12 },
  { id: 'customer-service', name: '客户服务礼仪', category: '服务培训', duration: 6 },
  { id: 'product-knowledge', name: '产品知识培训', category: '产品培训', duration: 10 },
  { id: 'communication', name: '沟通技巧提升', category: '软技能', duration: 8 },
  { id: 'team-management', name: '团队管理实战', category: '管理培训', duration: 16 },
  { id: 'digital-marketing', name: '数字营销基础', category: '营销培训', duration: 10 },
  { id: 'complaint-handling', name: '投诉处理技巧', category: '服务培训', duration: 6 },
  { id: 'time-management', name: '时间管理', category: '软技能', duration: 4 },
  { id: 'leadership', name: '领导力培养', category: '管理培训', duration: 20 },
  { id: 'data-analysis', name: '数据分析入门', category: '技术培训', duration: 12 },
  { id: 'brand-culture', name: '品牌文化认知', category: '企业文化', duration: 4 },
  { id: 'safety-training', name: '安全生产培训', category: '安全培训', duration: 4 },
  { id: 'financial-basics', name: '财务基础知识', category: '财务培训', duration: 8 },
  { id: 'innovation-thinking', name: '创新思维训练', category: '软技能', duration: 6 },
];

/**
 * Generate random medals for an employee
 */
function generateMedals(performanceMultiplier: number): Medal[] {
  const medalCount = Math.floor(Math.random() * 5) + Math.floor(performanceMultiplier * 2); // 0-7 medals
  const selectedMedals: Medal[] = [];
  const shuffled = [...availableMedals].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < Math.min(medalCount, availableMedals.length); i++) {
    const medal = shuffled[i];
    const monthsAgo = Math.floor(Math.random() * 12);
    const earnedDate = new Date();
    earnedDate.setMonth(earnedDate.getMonth() - monthsAgo);
    
    selectedMedals.push({
      ...medal,
      earnedDate: earnedDate.toISOString().split('T')[0],
    });
  }
  
  return selectedMedals.sort((a, b) => b.earnedDate.localeCompare(a.earnedDate));
}

/**
 * Generate training courses for an employee
 */
function generateTrainingCourses(performanceMultiplier: number, yearsOfService: number): TrainingCourse[] {
  const baseCount = Math.floor(yearsOfService * 2); // 2 courses per year
  const bonusCount = Math.floor(performanceMultiplier * 2);
  const courseCount = Math.min(baseCount + bonusCount, availableTrainingCourses.length);
  
  const selectedCourses: TrainingCourse[] = [];
  const shuffled = [...availableTrainingCourses].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < courseCount; i++) {
    const course = shuffled[i];
    const monthsAgo = Math.floor(Math.random() * (yearsOfService * 12));
    const completedDate = new Date();
    completedDate.setMonth(completedDate.getMonth() - monthsAgo);
    
    const status: 'completed' | 'in-progress' | 'passed' = 
      Math.random() > 0.9 ? 'in-progress' : Math.random() > 0.3 ? 'passed' : 'completed';
    
    const score = status === 'in-progress' ? undefined : Math.floor(Math.random() * 20) + 80; // 80-100
    
    selectedCourses.push({
      ...course,
      completedDate: completedDate.toISOString().split('T')[0],
      score,
      status,
    });
  }
  
  return selectedCourses.sort((a, b) => b.completedDate.localeCompare(a.completedDate));
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate employee performance data for a store
 */
export function generateEmployeePerformance(storeId: string, employeeCount: number): EmployeePerformance[] {
  const employees: EmployeePerformance[] = [];
  
  for (let i = 0; i < employeeCount; i++) {
    let position: EmployeePosition;
    let salaryBase: number;
    let performanceMultiplier: number;
    let isLeadershipTeam: boolean;
    let education: EducationLevel;
    let yearsOfService: number;
    let authLevels: { personnel: number; finance: number; operations: number; marketing: number; customer: number };
    
    // Assign position based on hierarchy
    if (i === 0) {
      position = '店长';
      salaryBase = 8000;
      performanceMultiplier = 1.5;
      isLeadershipTeam = true;
      education = ['本科', '硕士'][randomInRange(0, 1)] as EducationLevel;
      yearsOfService = randomInRange(5, 15);
      authLevels = {
        personnel: 5,
        finance: 5,
        operations: 5,
        marketing: 5,
        customer: 5,
      };
    } else if (i === 1) {
      position = '副店长';
      salaryBase = 7000;
      performanceMultiplier = 1.3;
      isLeadershipTeam = true;
      education = ['本科', '大专'][randomInRange(0, 1)] as EducationLevel;
      yearsOfService = randomInRange(3, 10);
      authLevels = {
        personnel: 4,
        finance: 4,
        operations: 5,
        marketing: 4,
        customer: 5,
      };
    } else if (i === 2) {
      position = '销售主管';
      salaryBase = 6000;
      performanceMultiplier = 1.2;
      isLeadershipTeam = true;
      education = ['本科', '大专'][randomInRange(0, 1)] as EducationLevel;
      yearsOfService = randomInRange(2, 8);
      authLevels = {
        personnel: 3,
        finance: 3,
        operations: 4,
        marketing: 4,
        customer: 4,
      };
    } else if (i < 5) {
      position = '高级销售';
      salaryBase = 5000;
      performanceMultiplier = 1.1;
      isLeadershipTeam = false;
      education = ['大专', '本科'][randomInRange(0, 1)] as EducationLevel;
      yearsOfService = randomInRange(2, 6);
      authLevels = {
        personnel: 2,
        finance: 2,
        operations: 3,
        marketing: 3,
        customer: 3,
      };
    } else if (i < 8) {
      position = '销售顾问';
      salaryBase = 4500;
      performanceMultiplier = 1.0;
      isLeadershipTeam = false;
      education = ['大专', '高中', '中专'][randomInRange(0, 2)] as EducationLevel;
      yearsOfService = randomInRange(1, 4);
      authLevels = {
        personnel: 1,
        finance: 1,
        operations: 2,
        marketing: 2,
        customer: 3,
      };
    } else {
      position = '销售专员';
      salaryBase = 4000;
      performanceMultiplier = 0.9;
      isLeadershipTeam = false;
      education = ['高中', '中专', '大专'][randomInRange(0, 2)] as EducationLevel;
      yearsOfService = randomInRange(0, 3);
      authLevels = {
        personnel: 1,
        finance: 1,
        operations: 1,
        marketing: 2,
        customer: 2,
      };
    }
    
    // Generate salary breakdown
    const baseSalary = randomInRange(salaryBase - 500, salaryBase + 500);
    
    // Generate performance data with some randomness
    const mainBusiness = randomFloat(15000, 45000) * performanceMultiplier;
    const mainBusinessSales = randomInRange(5, 20) * performanceMultiplier;
    
    const carrier = randomFloat(3000, 12000) * performanceMultiplier;
    const carrierSales = randomInRange(2, 10) * performanceMultiplier;
    
    const paidMember = randomFloat(2000, 8000) * performanceMultiplier;
    const paidMemberSales = randomInRange(1, 8) * performanceMultiplier;
    
    const recycling = randomFloat(1000, 5000) * performanceMultiplier;
    const recyclingSales = randomInRange(1, 5) * performanceMultiplier;
    
    const secondHand = randomFloat(2000, 10000) * performanceMultiplier;
    const secondHandSales = randomInRange(1, 8) * performanceMultiplier;
    
    const accessories = randomFloat(1500, 6000) * performanceMultiplier;
    const accessoriesSales = randomInRange(10, 40) * performanceMultiplier;
    
    const smart = randomFloat(2000, 8000) * performanceMultiplier;
    const smartSales = randomInRange(2, 10) * performanceMultiplier;
    
    const repair = randomFloat(1000, 4000) * performanceMultiplier;
    const repairSales = randomInRange(5, 20) * performanceMultiplier;
    
    const grossProfit = mainBusiness + carrier + paidMember + recycling + 
                       secondHand + accessories + smart + repair;
    
    // Calculate commission based on gross profit (5-10%)
    const commission = grossProfit * randomFloat(0.05, 0.10);
    
    // Work points (工分) based on performance
    const workPoints = randomFloat(500, 2000) * performanceMultiplier;
    
    // Bonus (奖金) - random bonus
    const bonus = randomFloat(300, 1500) * performanceMultiplier;
    
    const totalSalary = baseSalary + commission + workPoints + bonus;
    
    // Calculate salary output ratio (毛利/工资)
    const salaryOutputRatio = totalSalary > 0 ? grossProfit / totalSalary : 0;
    
    // Values score (价值观评分)
    const values = randomFloat(3.5, 5.0);
    
    // Generate medals
    const medals = generateMedals(performanceMultiplier);
    
    // Generate training courses
    const trainingCourses = generateTrainingCourses(performanceMultiplier, yearsOfService);
    
    // Calculate overall score (综合评分)
    // Business performance (70%): based on gross profit and salary output ratio
    // Values score (30%): based on values rating
    const businessScore = Math.min(100, (grossProfit / 50000) * 50 + (salaryOutputRatio / 5) * 50);
    const overallScore = (businessScore * 0.7 + values * 20 * 0.3);
    
    employees.push({
      employeeId: `${storeId}-emp-${i + 1}`,
      name: employeeNames[i % employeeNames.length],
      avatar: avatarEmojis[i % avatarEmojis.length],
      yearsOfService,
      education,
      position,
      isLeadershipTeam,
      authorizationLevels: authLevels,
      salary: totalSalary,
      salaryBreakdown: {
        baseSalary,
        commission,
        workPoints,
        bonus,
      },
      grossProfit,
      salaryOutputRatio,
      mainBusiness,
      mainBusinessSales,
      carrier,
      carrierSales,
      paidMember,
      paidMemberSales,
      recycling,
      recyclingSales,
      secondHand,
      secondHandSales,
      accessories,
      accessoriesSales,
      smart,
      smartSales,
      repair,
      repairSales,
      values,
      medals,
      trainingCourses,
      overallScore,
    });
  }
  
  return employees;
}

/**
 * Get employee performance for all stores
 */
export function getAllEmployeePerformance(): Map<string, EmployeePerformance[]> {
  const employeeMap = new Map<string, EmployeePerformance[]>();
  
  // Generate for common store IDs
  const storeConfigs = [
    { id: 'store-001', count: 8 },
    { id: 'store-002', count: 6 },
    { id: 'store-003', count: 10 },
    { id: 'store-004', count: 5 },
    { id: 'store-005', count: 7 },
  ];
  
  storeConfigs.forEach(config => {
    employeeMap.set(config.id, generateEmployeePerformance(config.id, config.count));
  });
  
  return employeeMap;
}
