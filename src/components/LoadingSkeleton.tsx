/**
 * LoadingSkeleton Component
 * 
 * Provides skeleton screen loading effects for better UX
 */

import React from 'react';
import './LoadingSkeleton.css';

export interface LoadingSkeletonProps {
  type?: 'card' | 'chart' | 'table' | 'text';
  count?: number;
  height?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'card',
  count = 1,
  height,
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton-header">
              <div className="skeleton-title"></div>
            </div>
            <div className="skeleton-value"></div>
            <div className="skeleton-bar"></div>
            <div className="skeleton-text"></div>
          </div>
        );
      
      case 'chart':
        return (
          <div className="skeleton-chart" style={{ height: height || 400 }}>
            <div className="skeleton-chart-header">
              <div className="skeleton-title"></div>
            </div>
            <div className="skeleton-chart-body">
              <div className="skeleton-chart-bars">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="skeleton-bar" style={{ height: `${Math.random() * 60 + 40}%` }}></div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'table':
        return (
          <div className="skeleton-table">
            <div className="skeleton-table-header">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton-table-cell"></div>
              ))}
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton-table-row">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="skeleton-table-cell"></div>
                ))}
              </div>
            ))}
          </div>
        );
      
      case 'text':
        return (
          <div className="skeleton-text-block">
            <div className="skeleton-text"></div>
            <div className="skeleton-text" style={{ width: '80%' }}></div>
            <div className="skeleton-text" style={{ width: '60%' }}></div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="loading-skeleton">
      {[...Array(count)].map((_, i) => (
        <React.Fragment key={i}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </div>
  );
};
