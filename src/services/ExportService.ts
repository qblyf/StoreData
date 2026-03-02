/**
 * ExportService - Handles data and chart export operations
 * Requirements: 12.5, 12.6, 12.7
 */

import { MetricValue, TargetSetting } from '../types';

export interface ExportData {
  metricName: string;
  currentValue: string;
  unit: string;
  targetValue: string;
  completionRate: string;
  formula: string;
}

export class ExportService {
  /**
   * Export metric data to CSV format
   * Requirements: 12.6, 12.7
   * 
   * CSV Format includes:
   * - 指标名称 (Metric Name)
   * - 当前值 (Current Value)
   * - 单位 (Unit)
   * - 目标值 (Target Value)
   * - 完成率 (Completion Rate)
   * - 计算公式 (Formula)
   */
  static exportToCSV(
    metricValues: MetricValue[],
    targetSettings: TargetSetting[],
    metricDefinitions: Map<string, { name: string; formula?: string }>
  ): void {
    // Prepare export data
    const exportData: ExportData[] = metricValues.map(mv => {
      const target = targetSettings.find(
        t => t.metricId === mv.metricId && (!t.storeId || t.storeId === mv.storeId)
      );
      const metricDef = metricDefinitions.get(mv.metricId);
      
      return {
        metricName: metricDef?.name || mv.metricId,
        currentValue: mv.value !== null ? mv.value.toFixed(2) : 'N/A',
        unit: mv.unit,
        targetValue: target?.targetValue?.toFixed(2) || 'N/A',
        completionRate: mv.targetCompletion !== undefined 
          ? `${(mv.targetCompletion * 100).toFixed(1)}%` 
          : 'N/A',
        formula: metricDef?.formula || 'N/A'
      };
    });

    // Create CSV content with UTF-8 BOM for Chinese characters
    const BOM = '\uFEFF';
    const headers = ['指标名称', '当前值', '单位', '目标值', '完成率', '计算公式'];
    const csvRows = [
      headers.join(','),
      ...exportData.map(row => [
        this.escapeCSV(row.metricName),
        this.escapeCSV(row.currentValue),
        this.escapeCSV(row.unit),
        this.escapeCSV(row.targetValue),
        this.escapeCSV(row.completionRate),
        this.escapeCSV(row.formula)
      ].join(','))
    ];
    
    const csvContent = BOM + csvRows.join('\n');

    // Create and download file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `指标数据_${timestamp}.csv`;
    
    this.downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
  }

  /**
   * Export chart as PNG image
   * Uses html2canvas to capture the chart element
   */
  static async exportChartToPNG(elementId: string, chartName: string = '图表'): Promise<void> {
    const element = document.getElementById(elementId);
    
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    try {
      // Dynamically import html2canvas to reduce bundle size
      const html2canvas = await import('html2canvas');
      
      const canvas = await html2canvas.default(element, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        logging: false,
        useCORS: true
      });

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Failed to create image blob');
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `${chartName}_${timestamp}.png`;
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (error) {
      console.error('Failed to export chart:', error);
      throw new Error('导出图表失败，请稍后重试');
    }
  }

  /**
   * Escape CSV field values
   * Handles commas, quotes, and newlines
   */
  private static escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /**
   * Download file helper
   */
  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
