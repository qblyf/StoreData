/**
 * Financial Summary Component - 7x5 Grid Layout
 * 7 columns x 5 rows grid showing financial calculation flow
 */

import React from 'react';
import './FinancialSummary.css';

export interface FinancialSummaryProps {
  revenue: number | null;
  totalCost: number | null;
  grossProfit: number | null;
  laborCost: number | null;
  rentCost: number | null;
  otherExpenses: number | null;
  totalExpenses: number | null;
  profit: number | null;
  revenueTarget?: number;
  profitTarget?: number;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = React.memo(({
  revenue,
  totalCost,
  grossProfit,
  laborCost,
  rentCost,
  otherExpenses,
  totalExpenses,
  profit,
  revenueTarget,
  profitTarget,
}) => {
  const formatCurrency = (value: number | null): string => {
    if (value === null) return 'N/A';
    return value.toLocaleString('zh-CN', { maximumFractionDigits: 0 });
  };

  const calculatePercentage = (part: number | null, total: number | null): string => {
    if (part === null || total === null || total === 0) return '0%';
    return ((part / total) * 100).toFixed(1) + '%';
  };

  return (
    <div className="financial-summary-grid">
      {/* Row 1 */}
      <div className="grid-cell cell-empty"></div>
      <div className="grid-cell cell-empty"></div>
      
      <div className="grid-cell cell-data revenue-cell">
        <div className="cell-label">营业收入</div>
        <div className="cell-value">{formatCurrency(revenue)}</div>
        <div className="cell-unit">元</div>
        {revenueTarget && (
          <div className="cell-target">目标: {formatCurrency(revenueTarget)}</div>
        )}
      </div>

      <div className="grid-cell cell-operator">−</div>

      <div className="grid-cell cell-data cost-cell">
        <div className="cell-label">总成本</div>
        <div className="cell-value">{formatCurrency(totalCost)}</div>
        <div className="cell-unit">元</div>
        <div className="cell-percentage">{calculatePercentage(totalCost, revenue)}</div>
      </div>

      <div className="grid-cell cell-operator">=</div>

      <div className="grid-cell cell-data gross-profit-cell">
        <div className="cell-label">毛利</div>
        <div className="cell-value highlight">{formatCurrency(grossProfit)}</div>
        <div className="cell-unit">元</div>
        <div className="cell-percentage">{calculatePercentage(grossProfit, revenue)}</div>
      </div>

      {/* Row 2 */}
      <div className="grid-cell cell-empty"></div>
      <div className="grid-cell cell-empty"></div>
      <div className="grid-cell cell-empty"></div>
      <div className="grid-cell cell-empty"></div>
      <div className="grid-cell cell-empty"></div>
      <div className="grid-cell cell-empty"></div>
      <div className="grid-cell cell-operator">−</div>

      {/* Row 3 */}
      <div className="grid-cell cell-data expense-cell">
        <div className="cell-label">工费</div>
        <div className="cell-value">{formatCurrency(laborCost)}</div>
        <div className="cell-unit">元</div>
        <div className="cell-percentage">{calculatePercentage(laborCost, revenue)}</div>
      </div>

      <div className="grid-cell cell-operator">+</div>

      <div className="grid-cell cell-data expense-cell">
        <div className="cell-label">租费</div>
        <div className="cell-value">{formatCurrency(rentCost)}</div>
        <div className="cell-unit">元</div>
        <div className="cell-percentage">{calculatePercentage(rentCost, revenue)}</div>
      </div>

      <div className="grid-cell cell-operator">+</div>

      <div className="grid-cell cell-data expense-cell">
        <div className="cell-label">其它费用</div>
        <div className="cell-value">{formatCurrency(otherExpenses)}</div>
        <div className="cell-unit">元</div>
        <div className="cell-percentage">{calculatePercentage(otherExpenses, revenue)}</div>
      </div>

      <div className="grid-cell cell-operator">=</div>

      <div className="grid-cell cell-data total-expense-cell">
        <div className="cell-label">总费用</div>
        <div className="cell-value">{formatCurrency(totalExpenses)}</div>
        <div className="cell-unit">元</div>
        <div className="cell-percentage">{calculatePercentage(totalExpenses, revenue)}</div>
      </div>

      {/* Row 4 */}
      <div className="grid-cell cell-empty"></div>
      <div className="grid-cell cell-empty"></div>
      <div className="grid-cell cell-empty"></div>
      <div className="grid-cell cell-empty"></div>
      <div className="grid-cell cell-empty"></div>
      <div className="grid-cell cell-empty"></div>
      <div className="grid-cell cell-operator">=</div>

      {/* Row 5 */}
      <div className="grid-cell cell-empty"></div>
      <div className="grid-cell cell-empty"></div>
      <div className="grid-cell cell-empty"></div>
      <div className="grid-cell cell-empty"></div>
      <div className="grid-cell cell-empty"></div>
      <div className="grid-cell cell-empty"></div>

      <div className="grid-cell cell-data profit-cell">
        <div className="cell-label">净利润</div>
        <div className="cell-value highlight">{formatCurrency(profit)}</div>
        <div className="cell-unit">元</div>
        {profitTarget && (
          <div className="cell-target">目标: {formatCurrency(profitTarget)}</div>
        )}
        <div className="cell-percentage">{calculatePercentage(profit, revenue)}</div>
      </div>
    </div>
  );
});
