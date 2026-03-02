/**
 * EmptyState Component
 * 
 * Displays a friendly message when there's no data to show
 */

import React from 'react';
import './EmptyState.css';

export interface EmptyStateProps {
  icon?: string;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📊',
  title = '暂无数据',
  description = '当前没有可显示的数据，请尝试调整筛选条件或稍后再试。',
  action,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-content">
        <div className="empty-state-icon">{icon}</div>
        <h3 className="empty-state-title">{title}</h3>
        <p className="empty-state-description">{description}</p>
        {action && (
          <button className="empty-state-action" onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};
