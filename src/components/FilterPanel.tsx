/**
 * FilterPanel Component
 * 
 * Provides filtering controls for the dashboard:
 * - Store selection (multi-select)
 * - Time range selection
 * - Metric category filtering
 * - Store type and level filtering
 * 
 * Requirements: 9.4, 9.5, 10.2
 */

import React, { useState } from 'react';
import { Store, StoreType, StoreLevel, MetricCategory, TimeRange } from '../types';
import './FilterPanel.css';

export interface FilterPanelProps {
  stores: Store[];
  selectedStoreIds: string[];
  onStoreSelectionChange: (storeIds: string[]) => void;
  timeRange: TimeRange;
  onTimeRangeChange: (timeRange: TimeRange) => void;
  selectedCategories: MetricCategory[];
  onCategoryChange: (categories: MetricCategory[]) => void;
  selectedStoreTypes: StoreType[];
  onStoreTypeChange: (types: StoreType[]) => void;
  selectedStoreLevels: StoreLevel[];
  onStoreLevelChange: (levels: StoreLevel[]) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = React.memo(({
  stores,
  selectedStoreIds,
  onStoreSelectionChange,
  timeRange,
  onTimeRangeChange,
  selectedCategories,
  onCategoryChange,
  selectedStoreTypes,
  onStoreTypeChange,
  selectedStoreLevels,
  onStoreLevelChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle store selection toggle
  const handleStoreToggle = (storeId: string) => {
    if (selectedStoreIds.includes(storeId)) {
      onStoreSelectionChange(selectedStoreIds.filter(id => id !== storeId));
    } else {
      onStoreSelectionChange([...selectedStoreIds, storeId]);
    }
  };

  // Handle select all stores
  const handleSelectAllStores = () => {
    onStoreSelectionChange(stores.map(s => s.id));
  };

  // Handle clear all stores
  const handleClearAllStores = () => {
    onStoreSelectionChange([]);
  };

  // Handle category toggle
  const handleCategoryToggle = (category: MetricCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  // Handle store type toggle
  const handleStoreTypeToggle = (type: StoreType) => {
    if (selectedStoreTypes.includes(type)) {
      onStoreTypeChange(selectedStoreTypes.filter(t => t !== type));
    } else {
      onStoreTypeChange([...selectedStoreTypes, type]);
    }
  };

  // Handle store level toggle
  const handleStoreLevelToggle = (level: StoreLevel) => {
    if (selectedStoreLevels.includes(level)) {
      onStoreLevelChange(selectedStoreLevels.filter(l => l !== level));
    } else {
      onStoreLevelChange([...selectedStoreLevels, level]);
    }
  };

  // Format date for input
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Handle time range change
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = new Date(e.target.value);
    onTimeRangeChange({ ...timeRange, start: newStart });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = new Date(e.target.value);
    onTimeRangeChange({ ...timeRange, end: newEnd });
  };

  // Category labels
  const categoryLabels: Record<MetricCategory, string> = {
    [MetricCategory.SETTLEMENT]: '结算相关',
    [MetricCategory.MAIN_BUSINESS]: '主营业务',
    [MetricCategory.TRAFFIC]: '客流相关',
    [MetricCategory.PROFIT]: '利润相关',
    [MetricCategory.REVENUE_COST]: '收入成本',
    [MetricCategory.EXPENSE]: '费用',
    [MetricCategory.OUTPUT]: '产出相关',
  };

  // Store type labels
  const storeTypeLabels: Record<StoreType, string> = {
    [StoreType.FLAGSHIP]: '旗舰店',
    [StoreType.STANDARD]: '标准店',
    [StoreType.MINI]: '迷你店',
  };

  return (
    <div className={`filter-panel ${isExpanded ? 'expanded' : ''}`}>
      <div className="filter-panel-header">
        <h3 className="filter-panel-title">筛选条件</h3>
        <button
          className="filter-panel-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? '收起筛选面板' : '展开筛选面板'}
        >
          {isExpanded ? '收起 ▲' : '展开 ▼'}
        </button>
      </div>

      {isExpanded && (
        <div className="filter-panel-content">
          {/* Store Selection */}
          <div className="filter-section">
            <div className="filter-section-header">
              <label className="filter-label">门店选择</label>
              <div className="filter-actions">
                <button
                  className="filter-action-btn"
                  onClick={handleSelectAllStores}
                  disabled={selectedStoreIds.length === stores.length}
                >
                  全选
                </button>
                <button
                  className="filter-action-btn"
                  onClick={handleClearAllStores}
                  disabled={selectedStoreIds.length === 0}
                >
                  清空
                </button>
              </div>
            </div>
            <div className="filter-options">
              {stores.map(store => (
                <label key={store.id} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedStoreIds.includes(store.id)}
                    onChange={() => handleStoreToggle(store.id)}
                  />
                  <span className="filter-checkbox-label">
                    {store.name} ({store.type} - {store.level}级)
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Time Range Selection */}
          <div className="filter-section">
            <label className="filter-label">时间范围</label>
            <div className="filter-date-range">
              <div className="filter-date-input">
                <label htmlFor="start-date" className="filter-date-label">
                  开始日期
                </label>
                <input
                  id="start-date"
                  type="date"
                  className="filter-date-field"
                  value={formatDateForInput(timeRange.start)}
                  onChange={handleStartDateChange}
                />
              </div>
              <div className="filter-date-input">
                <label htmlFor="end-date" className="filter-date-label">
                  结束日期
                </label>
                <input
                  id="end-date"
                  type="date"
                  className="filter-date-field"
                  value={formatDateForInput(timeRange.end)}
                  onChange={handleEndDateChange}
                />
              </div>
            </div>
          </div>

          {/* Metric Category Filtering */}
          <div className="filter-section">
            <label className="filter-label">指标类别</label>
            <div className="filter-options">
              {Object.values(MetricCategory).map(category => (
                <label key={category} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                  />
                  <span className="filter-checkbox-label">
                    {categoryLabels[category]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Store Type Filtering */}
          <div className="filter-section">
            <label className="filter-label">门店类型</label>
            <div className="filter-options filter-options-inline">
              {Object.values(StoreType).map(type => (
                <label key={type} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedStoreTypes.includes(type)}
                    onChange={() => handleStoreTypeToggle(type)}
                  />
                  <span className="filter-checkbox-label">
                    {storeTypeLabels[type]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Store Level Filtering */}
          <div className="filter-section">
            <label className="filter-label">门店级别</label>
            <div className="filter-options filter-options-inline">
              {Object.values(StoreLevel).map(level => (
                <label key={level} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedStoreLevels.includes(level)}
                    onChange={() => handleStoreLevelToggle(level)}
                  />
                  <span className="filter-checkbox-label">
                    {level}级
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
