/**
 * Export Functionality Example
 * Demonstrates how to use ExportService for CSV and PNG exports
 */

import React, { useState } from 'react';
import { ExportService } from '../services/ExportService';
import { MetricValue, TargetSetting, TimePeriod } from '../types';

export const ExportExample: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  // Sample data
  const sampleMetrics: MetricValue[] = [
    {
      metricId: 'revenue',
      storeId: 'store-001',
      value: 100000,
      unit: '元',
      timestamp: new Date(),
      target: 120000,
      targetCompletion: 0.833,
    },
    {
      metricId: 'gross_profit',
      storeId: 'store-001',
      value: 35000,
      unit: '元',
      timestamp: new Date(),
      target: 40000,
      targetCompletion: 0.875,
    },
    {
      metricId: 'conversion_rate',
      storeId: 'store-001',
      value: 15.5,
      unit: '%',
      timestamp: new Date(),
      target: 20,
      targetCompletion: 0.775,
    },
  ];

  const sampleTargets: TargetSetting[] = [
    {
      targetId: 'target-1',
      metricId: 'revenue',
      targetValue: 120000,
      period: TimePeriod.MONTHLY,
      effectiveFrom: new Date('2024-01-01'),
    },
    {
      targetId: 'target-2',
      metricId: 'gross_profit',
      targetValue: 40000,
      period: TimePeriod.MONTHLY,
      effectiveFrom: new Date('2024-01-01'),
    },
  ];

  const metricDefinitions = new Map([
    ['revenue', { name: '收入', formula: undefined }],
    ['gross_profit', { name: '毛利', formula: 'revenue - product_cost - adjustment_cost' }],
    ['conversion_rate', { name: '成交率', formula: 'transaction_count / entering_traffic' }],
  ]);

  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      ExportService.exportToCSV(sampleMetrics, sampleTargets, metricDefinitions);
      alert('CSV 导出成功！');
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请稍后重试');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPNG = async () => {
    setIsExporting(true);
    try {
      await ExportService.exportChartToPNG('export-demo-content', '示例图表');
      alert('图表导出成功！');
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请稍后重试');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>导出功能示例</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>功能说明</h2>
        <ul>
          <li>导出数据：将指标数据导出为 CSV 格式文件</li>
          <li>导出图表：将当前视图导出为 PNG 图片</li>
        </ul>
      </div>

      <div id="export-demo-content" style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3>示例数据</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>指标名称</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>当前值</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>目标值</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>完成率</th>
            </tr>
          </thead>
          <tbody>
            {sampleMetrics.map((metric, index) => {
              const def = metricDefinitions.get(metric.metricId);
              return (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{def?.name || metric.metricId}</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>
                    {metric.value !== null ? `${metric.value.toFixed(2)} ${metric.unit}` : 'N/A'}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>
                    {metric.target ? `${metric.target.toFixed(2)} ${metric.unit}` : 'N/A'}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>
                    {metric.targetCompletion !== undefined 
                      ? `${(metric.targetCompletion * 100).toFixed(1)}%` 
                      : 'N/A'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleExportCSV}
          disabled={isExporting}
          style={{
            padding: '12px 24px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isExporting ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            opacity: isExporting ? 0.5 : 1,
          }}
        >
          📊 导出数据 (CSV)
        </button>
        
        <button
          onClick={handleExportPNG}
          disabled={isExporting}
          style={{
            padding: '12px 24px',
            background: '#764ba2',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isExporting ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            opacity: isExporting ? 0.5 : 1,
          }}
        >
          📷 导出图表 (PNG)
        </button>
      </div>

      {isExporting && (
        <div style={{ marginTop: '20px', color: '#666' }}>
          正在导出，请稍候...
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>使用说明</h3>
        <ol>
          <li>点击"导出数据"按钮，将示例数据导出为 CSV 文件</li>
          <li>点击"导出图表"按钮，将上方表格导出为 PNG 图片</li>
          <li>导出的文件会自动下载到浏览器默认下载目录</li>
          <li>文件名包含时间戳，便于管理和归档</li>
        </ol>
      </div>
    </div>
  );
};
