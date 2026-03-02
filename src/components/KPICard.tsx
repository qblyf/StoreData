/**
 * KPI Card Component
 * Requirements: 10.4, 10.5
 * 
 * Displays a single KPI metric with:
 * - Metric name, current value, and unit
 * - Target value and completion rate
 * - Period-over-period change (YoY/MoM)
 * - Highlight for unmet targets
 */

import React from 'react';
import './KPICard.css';

export interface KPICardProps {
  metricName: string;
  currentValue: number | null;
  unit: string;
  targetValue?: number;
  targetCompletion?: number;
  periodChange?: number;
  periodLabel?: string;
  isUnmetTarget?: boolean;
  assessmentCriteria?: string;
  formula?: string;
  alertSeverity?: 'info' | 'warning' | 'error' | 'critical';
  onAlertClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = React.memo(({
  metricName,
  currentValue,
  unit,
  targetValue,
  targetCompletion,
  periodChange,
  periodLabel = '环比',
  isUnmetTarget = false,
  assessmentCriteria,
  formula,
  alertSeverity,
  onAlertClick,
}) => {
  const formatValue = (value: number | null): string => {
    if (value === null) return 'N/A';
    
    // Format based on unit
    if (unit === '元' || unit === '元/人') {
      return value.toLocaleString('zh-CN', { maximumFractionDigits: 0 });
    } else if (unit === '%') {
      return value.toFixed(1);
    } else {
      return value.toLocaleString('zh-CN', { maximumFractionDigits: 2 });
    }
  };

  const formatPercentage = (value: number): string => {
    return value.toFixed(1);
  };

  const getChangeClass = (change: number | undefined): string => {
    if (change === undefined) return '';
    return change >= 0 ? 'positive' : 'negative';
  };

  const getChangeIcon = (change: number | undefined): string => {
    if (change === undefined) return '';
    return change >= 0 ? '↑' : '↓';
  };

  const getAlertIcon = (severity: string | undefined): string => {
    if (!severity) return '';
    switch (severity) {
      case 'critical':
        return '🔴';
      case 'error':
        return '⚠️';
      case 'warning':
        return '⚡';
      case 'info':
        return 'ℹ️';
      default:
        return '';
    }
  };

  return (
    <div className={`kpi-card ${isUnmetTarget ? 'unmet-target' : ''}`}>
      <div className="kpi-card-header">
        <h3 className="kpi-card-title">{metricName}</h3>
        <div className="kpi-card-badges">
          {isUnmetTarget && <span className="warning-badge">未达标</span>}
          {alertSeverity && (
            <button
              className={`alert-icon-button ${alertSeverity}`}
              onClick={onAlertClick}
              aria-label="查看预警详情"
              title="点击查看预警详情"
            >
              {getAlertIcon(alertSeverity)}
            </button>
          )}
        </div>
      </div>
      
      <div className="kpi-card-value">
        <span className="value">{formatValue(currentValue)}</span>
        <span className="unit">{unit}</span>
      </div>

      {targetValue !== undefined && (
        <div className="kpi-card-target">
          <span className="target-label">目标: </span>
          <span className="target-value">{formatValue(targetValue)} {unit}</span>
        </div>
      )}

      {targetCompletion !== undefined && (
        <div className="kpi-card-completion">
          <div className="completion-bar">
            <div 
              className={`completion-fill ${targetCompletion >= 100 ? 'complete' : ''}`}
              style={{ width: `${Math.min(targetCompletion, 100)}%` }}
            />
          </div>
          <span className="completion-text">{formatPercentage(targetCompletion)}%</span>
        </div>
      )}

      {periodChange !== undefined && (
        <div className={`kpi-card-change ${getChangeClass(periodChange)}`}>
          <span className="change-icon">{getChangeIcon(periodChange)}</span>
          <span className="change-value">{Math.abs(periodChange).toFixed(1)}%</span>
          <span className="change-label">{periodLabel}</span>
        </div>
      )}

      {formula && (
        <div className="kpi-card-formula">
          <span className="formula-label">计算公式: </span>
          <span className="formula-text">{formula}</span>
        </div>
      )}

      {assessmentCriteria && (
        <div className="kpi-card-criteria">
          <span className="criteria-label">考核标准: </span>
          <span className="criteria-text">{assessmentCriteria}</span>
        </div>
      )}
    </div>
  );
});
