/**
 * AlertBanner Component
 * Requirements: 10.4
 * 
 * Displays alerts at the top of the dashboard:
 * - Shows count of alerts by severity
 * - Displays most critical alerts
 * - Supports dismissing/expanding alerts
 */

import React, { useState } from 'react';
import { Alert, AlertSeverity } from '../types';
import './AlertBanner.css';

export interface AlertBannerProps {
  alerts: Alert[];
  onDismiss?: (alertId: string) => void;
  onViewDetails?: (alert: Alert) => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  alerts,
  onDismiss,
  onViewDetails,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // Filter out dismissed alerts
  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.alertId));

  if (visibleAlerts.length === 0) {
    return null;
  }

  // Count alerts by severity
  const alertCounts = visibleAlerts.reduce((acc, alert) => {
    acc[alert.severity] = (acc[alert.severity] || 0) + 1;
    return acc;
  }, {} as Record<AlertSeverity, number>);

  // Get most critical alerts (top 3)
  const sortedAlerts = [...visibleAlerts].sort((a, b) => {
    const severityOrder = {
      [AlertSeverity.CRITICAL]: 4,
      [AlertSeverity.ERROR]: 3,
      [AlertSeverity.WARNING]: 2,
      [AlertSeverity.INFO]: 1,
    };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });

  const topAlerts = isExpanded ? sortedAlerts : sortedAlerts.slice(0, 3);

  const handleDismiss = (alertId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedAlerts(prev => new Set(prev).add(alertId));
    onDismiss?.(alertId);
  };

  const handleViewDetails = (alert: Alert, e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails?.(alert);
  };

  const getSeverityIcon = (severity: AlertSeverity): string => {
    switch (severity) {
      case AlertSeverity.CRITICAL:
        return '🔴';
      case AlertSeverity.ERROR:
        return '⚠️';
      case AlertSeverity.WARNING:
        return '⚡';
      case AlertSeverity.INFO:
        return 'ℹ️';
      default:
        return '📌';
    }
  };

  const getSeverityLabel = (severity: AlertSeverity): string => {
    switch (severity) {
      case AlertSeverity.CRITICAL:
        return '严重';
      case AlertSeverity.ERROR:
        return '错误';
      case AlertSeverity.WARNING:
        return '警告';
      case AlertSeverity.INFO:
        return '信息';
      default:
        return '';
    }
  };

  return (
    <div className="alert-banner">
      <div className="alert-banner-header">
        <div className="alert-banner-summary">
          <span className="alert-banner-icon">⚠️</span>
          <span className="alert-banner-title">
            发现 {visibleAlerts.length} 个预警
          </span>
          <div className="alert-counts">
            {alertCounts[AlertSeverity.CRITICAL] > 0 && (
              <span className="alert-count critical">
                严重 {alertCounts[AlertSeverity.CRITICAL]}
              </span>
            )}
            {alertCounts[AlertSeverity.ERROR] > 0 && (
              <span className="alert-count error">
                错误 {alertCounts[AlertSeverity.ERROR]}
              </span>
            )}
            {alertCounts[AlertSeverity.WARNING] > 0 && (
              <span className="alert-count warning">
                警告 {alertCounts[AlertSeverity.WARNING]}
              </span>
            )}
            {alertCounts[AlertSeverity.INFO] > 0 && (
              <span className="alert-count info">
                信息 {alertCounts[AlertSeverity.INFO]}
              </span>
            )}
          </div>
        </div>
        <button
          className="alert-banner-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? '收起' : '展开'}
        >
          {isExpanded ? '收起 ▲' : '展开 ▼'}
        </button>
      </div>

      <div className="alert-banner-list">
        {topAlerts.map(alert => (
          <div
            key={alert.alertId}
            className={`alert-item ${alert.severity}`}
          >
            <span className="alert-item-icon">
              {getSeverityIcon(alert.severity)}
            </span>
            <div className="alert-item-content">
              <div className="alert-item-header">
                <span className="alert-item-severity">
                  {getSeverityLabel(alert.severity)}
                </span>
                <span className="alert-item-time">
                  {alert.timestamp.toLocaleString('zh-CN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="alert-item-message">{alert.message}</p>
            </div>
            <div className="alert-item-actions">
              {onViewDetails && (
                <button
                  className="alert-item-button"
                  onClick={(e) => handleViewDetails(alert, e)}
                  aria-label="查看详情"
                >
                  详情
                </button>
              )}
              <button
                className="alert-item-dismiss"
                onClick={(e) => handleDismiss(alert.alertId, e)}
                aria-label="关闭"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {!isExpanded && sortedAlerts.length > 3 && (
        <div className="alert-banner-footer">
          还有 {sortedAlerts.length - 3} 个预警未显示
        </div>
      )}
    </div>
  );
};
