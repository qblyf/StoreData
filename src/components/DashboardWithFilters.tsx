/**
 * Dashboard with Integrated Filtering
 * 
 * Enhanced dashboard that includes FilterPanel and applies filtering logic
 * Requirements: 9.4, 9.5
 */

import React, { useState, useEffect, useMemo } from 'react';
import { KPIGrid } from './KPIGrid';
import { FilterPanel } from './FilterPanel';
import {
  MetricValue,
  TargetSetting,
  StoreType,
  StoreLevel,
  MetricCategory,
  TimeRange,
} from '../types';
import { generateTargetSettings, generateTimeSeriesData } from '../data';
import { mockStores } from '../data/mockStores';
import {
  filterMetrics,
  filterMetricsByCategories,
  saveFilterPreferences,
  loadFilterPreferences,
  FilterPreferences,
} from '../services/FilterService';
import './Dashboard.css';

type TabType = 'financial' | 'business' | 'action';

export const DashboardWithFilters: React.FC = () => {
  const [allMetricValues, setAllMetricValues] = useState<MetricValue[]>([]);
  const [targetSettings, setTargetSettings] = useState<TargetSetting[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('financial');
  const [isLoading, setIsLoading] = useState(true);

  // Filter state
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    return { start: thirtyDaysAgo, end: now };
  });
  const [selectedCategories, setSelectedCategories] = useState<MetricCategory[]>([]);
  const [selectedStoreTypes, setSelectedStoreTypes] = useState<StoreType[]>([]);
  const [selectedStoreLevels, setSelectedStoreLevels] = useState<StoreLevel[]>([]);

  // Load data on mount
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      try {
        // Load filter preferences from localStorage
        const savedPreferences = loadFilterPreferences();
        if (savedPreferences) {
          setSelectedStoreIds(savedPreferences.selectedStoreIds);
          setTimeRange(savedPreferences.timeRange);
          setSelectedCategories(savedPreferences.selectedCategories);
          setSelectedStoreTypes(savedPreferences.selectedStoreTypes);
          setSelectedStoreLevels(savedPreferences.selectedStoreLevels);
        } else {
          // Set default: select first store
          if (mockStores.length > 0) {
            setSelectedStoreIds([mockStores[0].id]);
          }
        }

        // Generate time series data for all stores
        const allMetrics: MetricValue[] = [];
        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);

        for (const store of mockStores) {
          const storeMetrics = generateTimeSeriesData(store.id, thirtyDaysAgo, now);
          allMetrics.push(...storeMetrics);
        }

        const targets = generateTargetSettings();
        setAllMetricValues(allMetrics);
        setTargetSettings(targets);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save filter preferences whenever they change
  useEffect(() => {
    if (!isLoading) {
      const preferences: FilterPreferences = {
        selectedStoreIds,
        timeRange,
        selectedCategories,
        selectedStoreTypes,
        selectedStoreLevels,
      };
      saveFilterPreferences(preferences);
    }
  }, [
    selectedStoreIds,
    timeRange,
    selectedCategories,
    selectedStoreTypes,
    selectedStoreLevels,
    isLoading,
  ]);

  // Apply filters to metrics
  const filteredMetrics = useMemo(() => {
    const preferences: FilterPreferences = {
      selectedStoreIds,
      timeRange,
      selectedCategories,
      selectedStoreTypes,
      selectedStoreLevels,
    };

    // First filter by store, time, type, and level
    let filtered = filterMetrics(allMetricValues, mockStores, preferences);

    // Then filter by categories if any selected
    if (selectedCategories.length > 0) {
      filtered = filterMetricsByCategories(filtered, selectedCategories);
    }

    return filtered;
  }, [
    allMetricValues,
    selectedStoreIds,
    timeRange,
    selectedCategories,
    selectedStoreTypes,
    selectedStoreLevels,
  ]);

  // Get the most recent metrics for display
  const currentMetrics = useMemo(() => {
    if (filteredMetrics.length === 0) return [];

    // Group by store and metric, keep only the most recent
    const metricMap = new Map<string, MetricValue>();
    
    for (const metric of filteredMetrics) {
      const key = `${metric.storeId}-${metric.metricId}`;
      const existing = metricMap.get(key);
      
      if (!existing || metric.timestamp > existing.timestamp) {
        metricMap.set(key, metric);
      }
    }

    return Array.from(metricMap.values());
  }, [filteredMetrics]);

  // Get selected store for single-store view
  const selectedStoreId = selectedStoreIds.length === 1 ? selectedStoreIds[0] : null;
  const selectedStore = selectedStoreId
    ? mockStores.find((s) => s.id === selectedStoreId)
    : null;

  const tabs = [
    { id: 'financial' as TabType, label: '财务分析', icon: '💰' },
    { id: 'business' as TabType, label: '业务分析', icon: '📊' },
    { id: 'action' as TabType, label: '动作分析', icon: '⚡' },
  ];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">门店数据指标看板</h1>
          <p className="dashboard-subtitle">实时监控门店经营状况和业务表现</p>
        </div>
      </header>

      {/* Filter Panel */}
      <FilterPanel
        stores={mockStores}
        selectedStoreIds={selectedStoreIds}
        onStoreSelectionChange={setSelectedStoreIds}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        selectedCategories={selectedCategories}
        onCategoryChange={setSelectedCategories}
        selectedStoreTypes={selectedStoreTypes}
        onStoreTypeChange={setSelectedStoreTypes}
        selectedStoreLevels={selectedStoreLevels}
        onStoreLevelChange={setSelectedStoreLevels}
      />

      {/* Store Info Bar (when single store selected) */}
      {selectedStore && (
        <div className="dashboard-toolbar">
          <div className="store-info">
            <span className="store-info-item">
              <span className="store-info-label">门店:</span>
              <span className="store-info-value">{selectedStore.name}</span>
            </span>
            <span className="store-info-item">
              <span className="store-info-label">类型:</span>
              <span className="store-info-value">{selectedStore.type}</span>
            </span>
            <span className="store-info-item">
              <span className="store-info-label">级别:</span>
              <span className="store-info-value">{selectedStore.level}级</span>
            </span>
            <span className="store-info-item">
              <span className="store-info-label">员工:</span>
              <span className="store-info-value">{selectedStore.employeeCount}人</span>
            </span>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <nav className="dashboard-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="dashboard-main">
        {isLoading ? (
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>
            <p>加载数据中...</p>
          </div>
        ) : filteredMetrics.length === 0 ? (
          <div className="dashboard-empty">
            <p>没有符合筛选条件的数据</p>
            <p className="dashboard-empty-hint">请调整筛选条件后重试</p>
          </div>
        ) : (
          <KPIGrid
            metricValues={currentMetrics}
            targetSettings={targetSettings}
            storeId={selectedStoreId || ''}
            activeTab={activeTab}
          />
        )}
      </main>

      <footer className="dashboard-footer">
        <p className="dashboard-footer-text">
          数据更新时间: {new Date().toLocaleString('zh-CN')} | 
          显示 {filteredMetrics.length} 条数据记录
        </p>
      </footer>
    </div>
  );
};
