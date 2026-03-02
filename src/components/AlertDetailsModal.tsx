/**
 * AlertDetailsModal Component
 * Requirements: 10.4
 * 
 * Modal for viewing detailed alert information:
 * - Full alert information
 * - Gap percentage and recommendations
 * - Support for viewing multiple alerts
 */

import React from 'react';
import { Alert, AlertSeverity } from '../types';
import './AlertDetailsModal.css';

export interface AlertDetailsModalProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
  metricName?: string;
  storeName?: string;
}

export const AlertDetailsModal: React.FC<AlertDetailsModalProps> = ({
  alert,
  isOpen,
  onClose,
  metricName,
  storeName,
}) => {
  if (!isOpen || !alert) {
    return null;
  }

  const gap = alert.threshold - alert.actualValue;
  const gapPercentage = (gap / alert.threshold) * 100;

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

  const getRecommendations = (severity: AlertSeverity, gapPct: number): string[] => {
    const recommendations: string[] = [];

    if (severity === AlertSeverity.CRITICAL || severity === AlertSeverity.ERROR) {
      recommendations.push('立即采取行动，分析根本原因');
      recommendations.push('检查相关业务流程和数据');
      recommendations.push('与团队讨论改进措施');
    } else if (severity === AlertSeverity.WARNING) {
      recommendations.push('密切关注指标变化趋势');
      recommendations.push('制定预防性改进计划');
    } else {
      recommendations.push('持续监控指标表现');
    }

    if (gapPct > 20) {
      recommendations.push('考虑调整目标值或业务策略');
    }

    return recommendations;
  };

  const recommendations = getRecommendations(alert.severity, gapPercentage);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="alert-modal-backdrop" onClick={handleBackdropClick}>
      <div className="alert-modal">
        <div className="alert-modal-header">
          <div className="alert-modal-title-section">
            <span className="alert-modal-icon">
              {getSeverityIcon(alert.severity)}
            </span>
            <h2 className="alert-modal-title">预警详情</h2>
          </div>
          <button
            className="alert-modal-close"
            onClick={onClose}
            aria-label="关闭"
          >
            ✕
          </button>
        </div>

        <div className="alert-modal-body">
          <div className="alert-detail-section">
            <h3 className="alert-detail-heading">基本信息</h3>
            <div className="alert-detail-grid">
              <div className="alert-detail-item">
                <span className="alert-detail-label">严重程度:</span>
                <span className={`alert-detail-value severity-${alert.severity}`}>
                  {getSeverityLabel(alert.severity)}
                </span>
              </div>
              {storeName && (
                <div className="alert-detail-item">
                  <span className="alert-detail-label">门店:</span>
                  <span className="alert-detail-value">{storeName}</span>
                </div>
              )}
              {metricName && (
                <div className="alert-detail-item">
                  <span className="alert-detail-label">指标:</span>
                  <span className="alert-detail-value">{metricName}</span>
                </div>
              )}
              <div className="alert-detail-item">
                <span className="alert-detail-label">时间:</span>
                <span className="alert-detail-value">
                  {alert.timestamp.toLocaleString('zh-CN')}
                </span>
              </div>
            </div>
          </div>

          <div className="alert-detail-section">
            <h3 className="alert-detail-heading">预警消息</h3>
            <p className="alert-message">{alert.message}</p>
          </div>

          <div className="alert-detail-section">
            <h3 className="alert-detail-heading">数据对比</h3>
            <div className="alert-comparison">
              <div className="alert-comparison-item">
                <span className="alert-comparison-label">目标值</span>
                <span className="alert-comparison-value target">
                  {alert.threshold.toFixed(2)}
                </span>
              </div>
              <div className="alert-comparison-arrow">→</div>
              <div className="alert-comparison-item">
                <span className="alert-comparison-label">实际值</span>
                <span className="alert-comparison-value actual">
                  {alert.actualValue.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="alert-gap-info">
              <div className="alert-gap-item">
                <span className="alert-gap-label">差距:</span>
                <span className="alert-gap-value">
                  {gap.toFixed(2)}
                </span>
              </div>
              <div className="alert-gap-item">
                <span className="alert-gap-label">差距百分比:</span>
                <span className="alert-gap-value highlight">
                  {gapPercentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="alert-detail-section">
            <h3 className="alert-detail-heading">改进建议</h3>
            <ul className="alert-recommendations">
              {recommendations.map((rec, index) => (
                <li key={index} className="alert-recommendation-item">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="alert-modal-footer">
          <button className="alert-modal-button primary" onClick={onClose}>
            知道了
          </button>
        </div>
      </div>
    </div>
  );
};
