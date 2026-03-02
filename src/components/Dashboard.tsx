/**
 * Dashboard Main Component with Tab Navigation
 * 
 * Three separate pages:
 * - Financial: Revenue, costs, profits, margins (财务分析)
 * - Business: Traffic, conversion, sales performance (业务分析)
 * - Action: Employee productivity and efficiency (动作分析)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { KPIGrid } from './KPIGrid';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorBoundary } from './ErrorBoundary';
import { EmptyState } from './EmptyState';
import { AlertBanner } from './AlertBanner';
import { AlertDetailsModal } from './AlertDetailsModal';
import { MetricValue, TargetSetting, Alert } from '../types';
import { generateCurrentSnapshot, generateTargetSettings, mockMetrics } from '../data';
import { mockStores } from '../data/mockStores';
import { alertService } from '../services/AlertService';
import { ExportService } from '../services/ExportService';
import './Dashboard.css';

type TabType = 'financial' | 'business' | 'action';

export const Dashboard: React.FC = () => {
  const [metricValues, setMetricValues] = useState<MetricValue[]>([]);
  const [targetSettings, setTargetSettings] = useState<TargetSetting[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('store-001');
  const [activeTab, setActiveTab] = useState<TabType>('financial');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulate network delay for demo
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const snapshot = generateCurrentSnapshot();
        const targets = generateTargetSettings();
        setMetricValues(snapshot);
        setTargetSettings(targets);

        // Check for alerts
        const metricIds = [...new Set(snapshot.map(mv => mv.metricId))];
        const storeAlerts = alertService.checkAlerts(
          selectedStoreId,
          metricIds,
          snapshot,
          targets
        );
        setAlerts(storeAlerts);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err instanceof Error ? err.message : '加载数据失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedStoreId]);

  // Retry loading data
  const handleRetry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      try {
        const snapshot = generateCurrentSnapshot();
        const targets = generateTargetSettings();
        setMetricValues(snapshot);
        setTargetSettings(targets);

        // Check for alerts
        const metricIds = [...new Set(snapshot.map(mv => mv.metricId))];
        const storeAlerts = alertService.checkAlerts(
          selectedStoreId,
          metricIds,
          snapshot,
          targets
        );
        setAlerts(storeAlerts);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err instanceof Error ? err.message : '加载数据失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, [selectedStoreId]);

  // Get selected store info - memoized
  const selectedStore = React.useMemo(
    () => mockStores.find(s => s.id === selectedStoreId),
    [selectedStoreId]
  );

  // Memoize store change handler
  const handleStoreChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStoreId(e.target.value);
  }, []);

  // Memoize tab change handler
  const handleTabChange = useCallback((tabId: TabType) => {
    setActiveTab(tabId);
  }, []);

  // Handle alert view details
  const handleViewAlertDetails = useCallback((alert: Alert) => {
    setSelectedAlert(alert);
    setIsAlertModalOpen(true);
  }, []);

  // Handle alert dismiss
  const handleDismissAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(a => a.alertId !== alertId));
  }, []);

  // Handle close alert modal
  const handleCloseAlertModal = useCallback(() => {
    setIsAlertModalOpen(false);
    setSelectedAlert(null);
  }, []);

  // Handle export data to CSV
  const handleExportData = useCallback(() => {
    setIsExporting(true);
    try {
      // Create metric definitions map
      const metricDefinitions = new Map(
        mockMetrics.map(m => [m.id, { name: m.name, formula: m.formula }])
      );

      // Filter metrics for current store
      const storeMetrics = metricValues.filter(mv => mv.storeId === selectedStoreId);

      ExportService.exportToCSV(storeMetrics, targetSettings, metricDefinitions);
      
      // Show success message (you could add a toast notification here)
      console.log('数据导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出数据失败，请稍后重试');
    } finally {
      setIsExporting(false);
    }
  }, [metricValues, targetSettings, selectedStoreId]);

  // Handle export chart to PNG
  const handleExportChart = useCallback(async () => {
    setIsExporting(true);
    try {
      // Export the main dashboard content
      await ExportService.exportChartToPNG('dashboard-content', '门店指标看板');
      
      // Show success message
      console.log('图表导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出图表失败，请稍后重试');
    } finally {
      setIsExporting(false);
    }
  }, []);

  // Get metric name for alert
  const getMetricName = (metricId: string): string => {
    const metricNames: Record<string, string> = {
      revenue: '营业收入',
      gross_profit: '毛利',
      gross_profit_margin: '毛利率',
      profit: '净利润',
      net_profit_margin: '净利率',
      profit_margin: '利润率',
      conversion_rate: '成交率',
      output_per_employee: '人均产出',
    };
    return metricNames[metricId] || metricId;
  };

  // Get store name
  const getStoreName = (storeId: string): string => {
    const store = mockStores.find(s => s.id === storeId);
    return store?.name || storeId;
  };

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

      <div className="dashboard-toolbar">
        <div className="store-selector">
          <label htmlFor="store-select" className="store-selector-label">
            选择门店:
          </label>
          <select
            id="store-select"
            className="store-selector-dropdown"
            value={selectedStoreId}
            onChange={handleStoreChange}
          >
            {mockStores.map(store => (
              <option key={store.id} value={store.id}>
                {store.name} ({store.type} - {store.level}级)
              </option>
            ))}
          </select>
        </div>

        {selectedStore && (
          <div className="store-info">
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
        )}

        <div className="export-buttons">
          <button
            className="export-button"
            onClick={handleExportData}
            disabled={isExporting || isLoading || metricValues.length === 0}
            title="导出当前视图数据为CSV格式"
          >
            <span className="export-icon">📊</span>
            <span className="export-label">导出数据</span>
          </button>
          <button
            className="export-button"
            onClick={handleExportChart}
            disabled={isExporting || isLoading || metricValues.length === 0}
            title="导出图表为PNG图片"
          >
            <span className="export-icon">📷</span>
            <span className="export-label">导出图表</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <nav className="dashboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="dashboard-main">
        <ErrorBoundary>
          {isLoading ? (
            <div className="dashboard-loading">
              <LoadingSkeleton type="card" count={6} />
            </div>
          ) : error ? (
            <EmptyState
              icon="⚠️"
              title="加载失败"
              description={error}
              action={{
                label: '重试',
                onClick: handleRetry,
              }}
            />
          ) : metricValues.length === 0 ? (
            <EmptyState
              icon="📊"
              title="暂无数据"
              description="当前没有可显示的数据，请稍后再试。"
              action={{
                label: '刷新',
                onClick: handleRetry,
              }}
            />
          ) : (
            <div id="dashboard-content">
              {alerts.length > 0 && (
                <AlertBanner
                  alerts={alerts}
                  onDismiss={handleDismissAlert}
                  onViewDetails={handleViewAlertDetails}
                />
              )}
              <KPIGrid
                metricValues={metricValues}
                targetSettings={targetSettings}
                storeId={selectedStoreId}
                activeTab={activeTab}
                alerts={alerts}
                onAlertClick={handleViewAlertDetails}
              />
            </div>
          )}
        </ErrorBoundary>
      </main>

      <AlertDetailsModal
        alert={selectedAlert}
        isOpen={isAlertModalOpen}
        onClose={handleCloseAlertModal}
        metricName={selectedAlert ? getMetricName(selectedAlert.metricId) : undefined}
        storeName={selectedAlert ? getStoreName(selectedAlert.storeId) : undefined}
      />

      <footer className="dashboard-footer">
        <p className="dashboard-footer-text">
          数据更新时间: {new Date().toLocaleString('zh-CN')}
        </p>
      </footer>
    </div>
  );
};
