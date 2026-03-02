/**
 * Employee Performance Table Component
 * 员工业绩表格组件
 */

import React, { useState } from 'react';
import { EmployeePerformance } from '../types/employee';
import './EmployeePerformanceTable.css';

export interface EmployeePerformanceTableProps {
  employees: EmployeePerformance[];
}

export const EmployeePerformanceTable: React.FC<EmployeePerformanceTableProps> = ({
  employees,
}) => {
  const [clickedSalary, setClickedSalary] = useState<string | null>(null);
  const [clickedMember, setClickedMember] = useState<string | null>(null);
  const [clickedValues, setClickedValues] = useState<string | null>(null);

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('zh-CN', { maximumFractionDigits: 0 });
  };

  const formatScore = (value: number): string => {
    return value.toFixed(1);
  };

  const formatPercent = (value: number): string => {
    return value.toFixed(1) + '%';
  };

  const calculateRatio = (profit: number, mainSales: number): number => {
    return mainSales > 0 ? (profit / mainSales) : 0;
  };

  const formatRatio = (value: number): string => {
    return value.toFixed(0);
  };

  const renderAuthLevel = (level: number): string => {
    return `${level}/5`;
  };

  const getAuthLevelClass = (level: number): string => {
    if (level >= 4) return 'auth-high';
    if (level >= 3) return 'auth-medium';
    return 'auth-low';
  };

  const getOverallScoreClass = (score: number): string => {
    if (score >= 85) return 'score-excellent';
    if (score >= 75) return 'score-good';
    if (score >= 60) return 'score-average';
    return 'score-poor';
  };

  const getMedalLevelClass = (level?: string): string => {
    switch (level) {
      case 'platinum': return 'medal-platinum';
      case 'gold': return 'medal-gold';
      case 'silver': return 'medal-silver';
      case 'bronze': return 'medal-bronze';
      default: return '';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const renderBusinessCell = (profit: number, sales: number, mainSales: number, showSales: boolean = true) => {
    const ratio = calculateRatio(profit, mainSales);
    return (
      <div className="business-cell">
        <span className="business-profit">¥{formatCurrency(profit)}</span>
        <div className="business-details">
          <span className="business-ratio" title="配比">配比:{formatRatio(ratio)}</span>
          {showSales && <span className="business-sales" title="销量">销量:{Math.round(sales)}</span>}
        </div>
      </div>
    );
  };

  // Calculate totals
  const totals = employees.reduce(
    (acc, emp) => ({
      salary: acc.salary + emp.salary,
      grossProfit: acc.grossProfit + emp.grossProfit,
      mainBusiness: acc.mainBusiness + emp.mainBusiness,
      mainBusinessSales: acc.mainBusinessSales + emp.mainBusinessSales,
      carrier: acc.carrier + emp.carrier,
      carrierSales: acc.carrierSales + emp.carrierSales,
      paidMember: acc.paidMember + emp.paidMember + emp.accessories + emp.smart,
      paidMemberSales: acc.paidMemberSales + emp.paidMemberSales + emp.accessoriesSales + emp.smartSales,
      recycling: acc.recycling + emp.recycling,
      recyclingSales: acc.recyclingSales + emp.recyclingSales,
      secondHand: acc.secondHand + emp.secondHand,
      secondHandSales: acc.secondHandSales + emp.secondHandSales,
      accessories: acc.accessories + emp.accessories,
      accessoriesSales: acc.accessoriesSales + emp.accessoriesSales,
      smart: acc.smart + emp.smart,
      smartSales: acc.smartSales + emp.smartSales,
      repair: acc.repair + emp.repair,
      repairSales: acc.repairSales + emp.repairSales,
      values: acc.values + emp.values,
      overallScore: acc.overallScore + emp.overallScore,
    }),
    {
      salary: 0,
      grossProfit: 0,
      mainBusiness: 0,
      mainBusinessSales: 0,
      carrier: 0,
      carrierSales: 0,
      paidMember: 0,
      paidMemberSales: 0,
      recycling: 0,
      recyclingSales: 0,
      secondHand: 0,
      secondHandSales: 0,
      accessories: 0,
      accessoriesSales: 0,
      smart: 0,
      smartSales: 0,
      repair: 0,
      repairSales: 0,
      values: 0,
      overallScore: 0,
    }
  );

  // Calculate average values score and overall score
  const avgValues = employees.length > 0 ? totals.values / employees.length : 0;
  const avgOverallScore = employees.length > 0 ? totals.overallScore / employees.length : 0;

  return (
    <div className="employee-performance-table-container">
      <div className="table-header">
        <h3 className="table-title">员工明细</h3>
        <div className="table-summary">
          <span className="summary-item">
            <span className="summary-label">总人数:</span>
            <span className="summary-value">{employees.length}人</span>
          </span>
          <span className="summary-item">
            <span className="summary-label">总毛利:</span>
            <span className="summary-value highlight">¥{formatCurrency(totals.grossProfit)}</span>
          </span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="employee-performance-table">
          <thead>
            <tr>
              <th className="col-name">姓名</th>
              <th className="col-position">职位</th>
              <th className="col-currency">工资</th>
              <th className="col-currency highlight-col">毛利</th>
              <th className="col-currency">主营</th>
              <th className="col-currency">运营商</th>
              <th className="col-currency">付费会员</th>
              <th className="col-currency">回收</th>
              <th className="col-currency">二手</th>
              <th className="col-currency">维修</th>
              <th className="col-score">价值观</th>
              <th className="col-score highlight-col">综合评分</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <React.Fragment key={employee.employeeId}>
                <tr>
                  <td className="col-name">
                    <div className="name-cell">
                      <span className="name-avatar">{employee.avatar}</span>
                      <div className="name-info">
                        <span className="name-text">{employee.name}</span>
                        <div className="name-details">
                          <span className="detail-badge education">{employee.education}</span>
                          <span className="detail-badge years">{employee.yearsOfService}年</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="col-position">
                    <div className="position-cell">
                      <span className="position-text">{employee.position}</span>
                      {employee.isLeadershipTeam && (
                        <span className="leadership-badge" title="三人班子成员">
                          👑
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="col-currency">
                    <div 
                      className="salary-cell-click"
                      onClick={() => setClickedSalary(clickedSalary === employee.employeeId ? null : employee.employeeId)}
                    >
                      <div className="salary-cell">
                        <span className="salary-total">¥{formatCurrency(employee.salary)}</span>
                        <span className={`salary-output ${employee.salaryOutputRatio > 5 ? 'good' : employee.salaryOutputRatio > 3 ? 'normal' : 'poor'}`}>
                          产出:{employee.salaryOutputRatio.toFixed(2)}倍
                        </span>
                      </div>
                      
                      {/* Salary breakdown tooltip */}
                      {clickedSalary === employee.employeeId && (
                        <div className="salary-tooltip">
                          <div className="salary-tooltip-header">
                            <h4 className="salary-tooltip-title">工资构成明细</h4>
                          </div>
                          <div className="salary-tooltip-content">
                            <div className="salary-tooltip-item">
                              <span className="salary-tooltip-label">底工资</span>
                              <div className="salary-tooltip-value-group">
                                <span className="salary-tooltip-value">¥{formatCurrency(employee.salaryBreakdown.baseSalary)}</span>
                                <span className="salary-tooltip-percent">{formatPercent((employee.salaryBreakdown.baseSalary / employee.salary) * 100)}</span>
                              </div>
                            </div>
                            <div className="salary-tooltip-item">
                              <span className="salary-tooltip-label">提成</span>
                              <div className="salary-tooltip-value-group">
                                <span className="salary-tooltip-value">¥{formatCurrency(employee.salaryBreakdown.commission)}</span>
                                <span className="salary-tooltip-percent">{formatPercent((employee.salaryBreakdown.commission / employee.salary) * 100)}</span>
                              </div>
                            </div>
                            <div className="salary-tooltip-item">
                              <span className="salary-tooltip-label">工分</span>
                              <div className="salary-tooltip-value-group">
                                <span className="salary-tooltip-value">¥{formatCurrency(employee.salaryBreakdown.workPoints)}</span>
                                <span className="salary-tooltip-percent">{formatPercent((employee.salaryBreakdown.workPoints / employee.salary) * 100)}</span>
                              </div>
                            </div>
                            <div className="salary-tooltip-item">
                              <span className="salary-tooltip-label">奖金</span>
                              <div className="salary-tooltip-value-group">
                                <span className="salary-tooltip-value">¥{formatCurrency(employee.salaryBreakdown.bonus)}</span>
                                <span className="salary-tooltip-percent">{formatPercent((employee.salaryBreakdown.bonus / employee.salary) * 100)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="salary-tooltip-footer">
                            <span className="salary-tooltip-formula">
                              工资产出 = ¥{formatCurrency(employee.grossProfit)} ÷ ¥{formatCurrency(employee.salary)} = {employee.salaryOutputRatio.toFixed(2)}倍
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="col-currency highlight-col">{renderBusinessCell(employee.grossProfit, employee.mainBusinessSales, employee.mainBusinessSales, false)}</td>
                  <td className="col-currency">{renderBusinessCell(employee.mainBusiness, employee.mainBusinessSales, employee.mainBusinessSales)}</td>
                  <td className="col-currency">{renderBusinessCell(employee.carrier, employee.carrierSales, employee.mainBusinessSales)}</td>
                  <td className="col-currency">
                    <div 
                      className="member-cell-click"
                      onClick={() => setClickedMember(clickedMember === employee.employeeId ? null : employee.employeeId)}
                    >
                      {renderBusinessCell(
                        employee.paidMember + employee.accessories + employee.smart,
                        employee.paidMemberSales + employee.accessoriesSales + employee.smartSales,
                        employee.mainBusinessSales
                      )}
                      
                      {/* Member breakdown tooltip */}
                      {clickedMember === employee.employeeId && (
                        <div className="member-tooltip">
                          <div className="member-tooltip-header">
                            <h4 className="member-tooltip-title">付费会员明细</h4>
                          </div>
                          <div className="member-tooltip-content">
                            <div className="member-tooltip-item">
                              <span className="member-tooltip-label">付费会员</span>
                              <div className="member-tooltip-value-group">
                                <span className="member-tooltip-value">¥{formatCurrency(employee.paidMember)}</span>
                                <span className="member-tooltip-detail">
                                  配比:{formatRatio(calculateRatio(employee.paidMember, employee.mainBusinessSales))} · 
                                  销量:{Math.round(employee.paidMemberSales)}
                                </span>
                              </div>
                            </div>
                            <div className="member-tooltip-item">
                              <span className="member-tooltip-label">配件</span>
                              <div className="member-tooltip-value-group">
                                <span className="member-tooltip-value">¥{formatCurrency(employee.accessories)}</span>
                                <span className="member-tooltip-detail">
                                  配比:{formatRatio(calculateRatio(employee.accessories, employee.mainBusinessSales))} · 
                                  销量:{Math.round(employee.accessoriesSales)}
                                </span>
                              </div>
                            </div>
                            <div className="member-tooltip-item">
                              <span className="member-tooltip-label">智能</span>
                              <div className="member-tooltip-value-group">
                                <span className="member-tooltip-value">¥{formatCurrency(employee.smart)}</span>
                                <span className="member-tooltip-detail">
                                  配比:{formatRatio(calculateRatio(employee.smart, employee.mainBusinessSales))} · 
                                  销量:{Math.round(employee.smartSales)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="col-currency">{renderBusinessCell(employee.recycling, employee.recyclingSales, employee.mainBusinessSales)}</td>
                  <td className="col-currency">{renderBusinessCell(employee.secondHand, employee.secondHandSales, employee.mainBusinessSales)}</td>
                  <td className="col-currency">{renderBusinessCell(employee.repair, employee.repairSales, employee.mainBusinessSales)}</td>
                  <td className="col-score">
                    <div 
                      className="values-cell-click"
                      onClick={() => setClickedValues(clickedValues === employee.employeeId ? null : employee.employeeId)}
                    >
                      <div className="values-cell">
                        <span className="values-score">{formatScore(employee.values)}</span>
                        <div className="values-badges">
                          {employee.medals.length > 0 && (
                            <span className="medal-count" title="勋章数量">🏅{employee.medals.length}</span>
                          )}
                          {employee.trainingCourses.length > 0 && (
                            <span className="course-count" title="培训课程">📚{employee.trainingCourses.length}</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Values details tooltip */}
                      {clickedValues === employee.employeeId && (
                        <div className="values-tooltip">
                          {/* Medals section */}
                          {employee.medals.length > 0 && (
                            <>
                              <div className="values-tooltip-header medals-header">
                                <h4 className="values-tooltip-title">🏅 勋章墙</h4>
                              </div>
                              <div className="values-tooltip-content">
                                {employee.medals.map((medal) => (
                                  <div key={medal.id} className={`medal-item ${getMedalLevelClass(medal.level)}`}>
                                    <div className="medal-icon">{medal.icon}</div>
                                    <div className="medal-info">
                                      <div className="medal-name">{medal.name}</div>
                                      <div className="medal-description">{medal.description}</div>
                                      <div className="medal-date">获得日期: {formatDate(medal.earnedDate)}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                          
                          {/* Training courses section */}
                          {employee.trainingCourses.length > 0 && (
                            <>
                              <div className="values-tooltip-header courses-header">
                                <h4 className="values-tooltip-title">📚 培训课程</h4>
                              </div>
                              <div className="values-tooltip-content">
                                {employee.trainingCourses.map((course) => (
                                  <div key={course.id} className={`course-item course-${course.status}`}>
                                    <div className="course-header">
                                      <span className="course-name">{course.name}</span>
                                      <span className={`course-status status-${course.status}`}>
                                        {course.status === 'passed' ? '✓ 通过' : course.status === 'completed' ? '✓ 完成' : '进行中'}
                                      </span>
                                    </div>
                                    <div className="course-details">
                                      <span className="course-category">{course.category}</span>
                                      <span className="course-duration">{course.duration}课时</span>
                                      {course.score && <span className="course-score">{course.score}分</span>}
                                    </div>
                                    <div className="course-date">完成日期: {formatDate(course.completedDate)}</div>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="col-score highlight-col">
                    <div className="overall-score-cell">
                      <span className={`overall-score ${getOverallScoreClass(employee.overallScore)}`}>
                        {employee.overallScore.toFixed(1)}
                      </span>
                      <span className="overall-score-label">分</span>
                    </div>
                  </td>
                </tr>
                
                {/* Authorization levels - only visible for leadership team */}
                {employee.isLeadershipTeam && (
                  <tr className="auth-sub-row">
                    <td colSpan={11}>
                      <div className="auth-inline">
                        <span className="auth-inline-label">授权等级:</span>
                        <div className="auth-inline-items">
                          <div className="auth-inline-item">
                            <span className="auth-inline-name">人事</span>
                            <span className={`auth-inline-level ${getAuthLevelClass(employee.authorizationLevels.personnel)}`}>
                              {renderAuthLevel(employee.authorizationLevels.personnel)}
                            </span>
                          </div>
                          <div className="auth-inline-item">
                            <span className="auth-inline-name">财务</span>
                            <span className={`auth-inline-level ${getAuthLevelClass(employee.authorizationLevels.finance)}`}>
                              {renderAuthLevel(employee.authorizationLevels.finance)}
                            </span>
                          </div>
                          <div className="auth-inline-item">
                            <span className="auth-inline-name">运营</span>
                            <span className={`auth-inline-level ${getAuthLevelClass(employee.authorizationLevels.operations)}`}>
                              {renderAuthLevel(employee.authorizationLevels.operations)}
                            </span>
                          </div>
                          <div className="auth-inline-item">
                            <span className="auth-inline-name">营销</span>
                            <span className={`auth-inline-level ${getAuthLevelClass(employee.authorizationLevels.marketing)}`}>
                              {renderAuthLevel(employee.authorizationLevels.marketing)}
                            </span>
                          </div>
                          <div className="auth-inline-item">
                            <span className="auth-inline-name">客户</span>
                            <span className={`auth-inline-level ${getAuthLevelClass(employee.authorizationLevels.customer)}`}>
                              {renderAuthLevel(employee.authorizationLevels.customer)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td className="col-name">合计</td>
              <td className="col-position">-</td>
              <td className="col-currency">
                <div className="salary-cell">
                  <span className="salary-total">¥{formatCurrency(totals.salary)}</span>
                  <span className="salary-output normal">
                    产出:{totals.salary > 0 ? (totals.grossProfit / totals.salary).toFixed(2) : '0.00'}倍
                  </span>
                </div>
              </td>
              <td className="col-currency highlight-col">{renderBusinessCell(totals.grossProfit, totals.mainBusinessSales, totals.mainBusinessSales, false)}</td>
              <td className="col-currency">{renderBusinessCell(totals.mainBusiness, totals.mainBusinessSales, totals.mainBusinessSales)}</td>
              <td className="col-currency">{renderBusinessCell(totals.carrier, totals.carrierSales, totals.mainBusinessSales)}</td>
              <td className="col-currency">{renderBusinessCell(totals.paidMember, totals.paidMemberSales, totals.mainBusinessSales)}</td>
              <td className="col-currency">{renderBusinessCell(totals.recycling, totals.recyclingSales, totals.mainBusinessSales)}</td>
              <td className="col-currency">{renderBusinessCell(totals.secondHand, totals.secondHandSales, totals.mainBusinessSales)}</td>
              <td className="col-currency">{renderBusinessCell(totals.repair, totals.repairSales, totals.mainBusinessSales)}</td>
              <td className="col-score">{formatScore(avgValues)}</td>
              <td className="col-score highlight-col">
                <div className="overall-score-cell">
                  <span className={`overall-score ${getOverallScoreClass(avgOverallScore)}`}>
                    {avgOverallScore.toFixed(1)}
                  </span>
                  <span className="overall-score-label">分</span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
