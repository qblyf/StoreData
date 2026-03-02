/**
 * Business Gross Profit Flow Component
 * 业务毛利链路图
 * 
 * 展示总毛利的构成：
 * 总毛利 = 主营毛利 + 运营商预估酬金 + 配件毛利 + 智能毛利 + 保险毛利 + 二手毛利 + 付费会员毛利
 */

import React from 'react';
import './BusinessGrossProfitFlow.css';

export interface BusinessGrossProfitFlowProps {
  // 各项毛利
  mainBusinessGrossProfit: number | null;      // 主营毛利
  operatorCommission: number | null;           // 运营商预估酬金
  accessoriesGrossProfit: number | null;       // 配件毛利
  smartProductsGrossProfit: number | null;     // 智能毛利
  insuranceGrossProfit: number | null;         // 保险毛利
  secondhandGrossProfit: number | null;        // 二手毛利
  membershipGrossProfit: number | null;        // 付费会员毛利
  
  // 总毛利
  totalGrossProfit: number | null;             // 总毛利
  
  // 目标值（可选）
  totalGrossProfitTarget?: number;
}

export const BusinessGrossProfitFlow: React.FC<BusinessGrossProfitFlowProps> = React.memo(({
  mainBusinessGrossProfit,
  operatorCommission,
  accessoriesGrossProfit,
  smartProductsGrossProfit,
  insuranceGrossProfit,
  secondhandGrossProfit,
  membershipGrossProfit,
  totalGrossProfit,
  totalGrossProfitTarget,
}) => {
  // Format currency value
  const formatCurrency = (value: number | null): string => {
    if (value === null) return 'N/A';
    return value.toLocaleString('zh-CN', { maximumFractionDigits: 0 });
  };

  // Calculate percentage of total
  const calculatePercentage = (value: number | null): string => {
    if (value === null || totalGrossProfit === null || totalGrossProfit === 0) return '0.0';
    return ((value / totalGrossProfit) * 100).toFixed(1);
  };

  // Calculate target completion
  const calculateTargetCompletion = (): number | null => {
    if (totalGrossProfit === null || !totalGrossProfitTarget) return null;
    return (totalGrossProfit / totalGrossProfitTarget) * 100;
  };

  const targetCompletion = calculateTargetCompletion();

  // Gross profit items
  const grossProfitItems = [
    { 
      label: '主营毛利', 
      value: mainBusinessGrossProfit, 
      icon: '💼',
      color: '#667eea'
    },
    { 
      label: '运营商预估酬金', 
      value: operatorCommission, 
      icon: '📡',
      color: '#764ba2'
    },
    { 
      label: '配件毛利', 
      value: accessoriesGrossProfit, 
      icon: '🔌',
      color: '#f093fb'
    },
    { 
      label: '智能毛利', 
      value: smartProductsGrossProfit, 
      icon: '⌚',
      color: '#4facfe'
    },
    { 
      label: '保险毛利', 
      value: insuranceGrossProfit, 
      icon: '🛡️',
      color: '#43e97b'
    },
    { 
      label: '二手毛利', 
      value: secondhandGrossProfit, 
      icon: '📱',
      color: '#fa709a'
    },
    { 
      label: '付费会员毛利', 
      value: membershipGrossProfit, 
      icon: '👥',
      color: '#fee140'
    },
  ];

  return (
    <div className="business-gross-profit-flow">
      <div className="flow-header">
        <h3 className="flow-title">业务毛利构成链路</h3>
        <p className="flow-subtitle">
          总毛利 = 主营毛利 + 运营商预估酬金 + 配件毛利 + 智能毛利 + 保险毛利 + 二手毛利 + 付费会员毛利
        </p>
      </div>

      <div className="flow-content">
        {/* Gross Profit Items */}
        <div className="flow-items">
          {grossProfitItems.map((item, index) => (
            <React.Fragment key={item.label}>
              <div className="flow-item" style={{ borderColor: item.color }}>
                <div className="flow-item-header">
                  <span className="flow-item-icon">{item.icon}</span>
                  <span className="flow-item-label">{item.label}</span>
                </div>
                <div className="flow-item-value">
                  <span className="value-amount">{formatCurrency(item.value)}</span>
                  <span className="value-unit">元</span>
                </div>
                <div className="flow-item-percentage">
                  占比: {calculatePercentage(item.value)}%
                </div>
              </div>
              
              {index < grossProfitItems.length - 1 && (
                <div className="flow-connector">
                  <span className="connector-symbol">+</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Equals Symbol */}
        <div className="flow-equals">
          <span className="equals-symbol">=</span>
        </div>

        {/* Total Gross Profit */}
        <div className="flow-total">
          <div className="total-card">
            <div className="total-header">
              <span className="total-icon">💰</span>
              <span className="total-label">总毛利</span>
            </div>
            <div className="total-value">
              <span className="total-amount">{formatCurrency(totalGrossProfit)}</span>
              <span className="total-unit">元</span>
            </div>
            
            {totalGrossProfitTarget && (
              <div className="total-target">
                <div className="target-info">
                  <span className="target-label">目标:</span>
                  <span className="target-value">{formatCurrency(totalGrossProfitTarget)}元</span>
                </div>
                {targetCompletion !== null && (
                  <div className="target-completion">
                    <div className="completion-bar">
                      <div 
                        className={`completion-fill ${targetCompletion >= 100 ? 'complete' : ''}`}
                        style={{ width: `${Math.min(targetCompletion, 100)}%` }}
                      />
                    </div>
                    <span className="completion-text">{targetCompletion.toFixed(1)}%</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="flow-summary">
        <div className="summary-item">
          <span className="summary-label">业务线数量</span>
          <span className="summary-value">{grossProfitItems.length}个</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">最大贡献</span>
          <span className="summary-value">
            {grossProfitItems.reduce((max, item) => 
              (item.value || 0) > (max.value || 0) ? item : max
            ).label}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">平均毛利</span>
          <span className="summary-value">
            {formatCurrency(
              totalGrossProfit !== null 
                ? totalGrossProfit / grossProfitItems.length 
                : null
            )}元
          </span>
        </div>
      </div>
    </div>
  );
});
