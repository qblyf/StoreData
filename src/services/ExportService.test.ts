/**
 * ExportService Tests
 * Requirements: 12.5, 12.6, 12.7
 * 
 * Tests CSV format correctness and data completeness
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { ExportService, ExportData } from './ExportService';
import { MetricValue, TargetSetting } from '../types';

describe('ExportService', () => {
  // Mock data
  const mockMetricValues: MetricValue[] = [
    {
      metricId: 'gross_profit',
      storeId: 'store-1',
      value: 35000,
      unit: '元',
      timestamp: new Date('2024-01-15'),
      target: 40000,
      targetCompletion: 0.875,
    },
    {
      metricId: 'net_profit_margin',
      storeId: 'store-1',
      value: 15.5,
      unit: '%',
      timestamp: new Date('2024-01-15'),
      target: 20,
      targetCompletion: 0.775,
    },
    {
      metricId: 'conversion_rate',
      storeId: 'store-2',
      value: 28.3,
      unit: '%',
      timestamp: new Date('2024-01-15'),
    },
  ];

  const mockTargetSettings: TargetSetting[] = [
    {
      targetId: 'target-1',
      metricId: 'gross_profit',
      storeId: 'store-1',
      targetValue: 40000,
      period: 'monthly',
      effectiveFrom: new Date('2024-01-01'),
    },
    {
      targetId: 'target-2',
      metricId: 'net_profit_margin',
      storeId: 'store-1',
      targetValue: 20,
      period: 'monthly',
      effectiveFrom: new Date('2024-01-01'),
    },
  ];

  const mockMetricDefinitions = new Map([
    ['gross_profit', { name: '毛利', formula: '收入 - 商品成本 - 调价成本' }],
    ['net_profit_margin', { name: '净利率', formula: '利润 / 收入 * 100' }],
    ['conversion_rate', { name: '成交率', formula: '成交客户数 / 进店客流 * 100' }],
  ]);

  // Mock DOM methods
  let mockLink: HTMLAnchorElement;
  let createElementSpy: any;
  let createObjectURLSpy: any;
  let revokeObjectURLSpy: any;

  beforeEach(() => {
    // Create mock link element
    mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
    } as any;

    // Mock document.createElement
    createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink);

    // Mock document.body methods
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink);
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink);

    // Mock URL methods - need to define them first in test environment
    if (!URL.createObjectURL) {
      (URL as any).createObjectURL = vi.fn();
    }
    if (!URL.revokeObjectURL) {
      (URL as any).revokeObjectURL = vi.fn();
    }
    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    // Mock Blob constructor
    global.Blob = vi.fn((content, options) => ({
      content,
      options,
    })) as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('CSV Export Format Correctness', () => {
    test('should include UTF-8 BOM for Chinese character support', () => {
      ExportService.exportToCSV(mockMetricValues, mockTargetSettings, mockMetricDefinitions);

      // Get the Blob constructor call
      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      expect(blobConstructorCalls.length).toBeGreaterThan(0);

      const csvContent = blobConstructorCalls[0][0][0] as string;
      expect(csvContent.charCodeAt(0)).toBe(0xfeff); // UTF-8 BOM
    });

    test('should have correct CSV headers in Chinese', () => {
      ExportService.exportToCSV(mockMetricValues, mockTargetSettings, mockMetricDefinitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      const lines = csvContent.split('\n');
      
      // Remove BOM and check headers
      const headers = lines[0].replace('\uFEFF', '');
      expect(headers).toBe('指标名称,当前值,单位,目标值,完成率,计算公式');
    });

    test('should format numeric values with 2 decimal places', () => {
      ExportService.exportToCSV(mockMetricValues, mockTargetSettings, mockMetricDefinitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      const lines = csvContent.split('\n');
      
      // Check second line (first data row)
      expect(lines[1]).toContain('35000.00');
      expect(lines[2]).toContain('15.50');
    });

    test('should format completion rate as percentage with 1 decimal place', () => {
      ExportService.exportToCSV(mockMetricValues, mockTargetSettings, mockMetricDefinitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      const lines = csvContent.split('\n');
      
      expect(lines[1]).toContain('87.5%');
      expect(lines[2]).toContain('77.5%');
    });

    test('should display N/A for null values', () => {
      const metricsWithNull: MetricValue[] = [
        {
          metricId: 'test_metric',
          storeId: 'store-1',
          value: null as any,
          unit: '元',
          timestamp: new Date('2024-01-15'),
        },
      ];

      const definitions = new Map([
        ['test_metric', { name: '测试指标' }],
      ]);

      ExportService.exportToCSV(metricsWithNull, [], definitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      
      expect(csvContent).toContain('N/A');
    });

    test('should display N/A for missing target values', () => {
      ExportService.exportToCSV(mockMetricValues, mockTargetSettings, mockMetricDefinitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      const lines = csvContent.split('\n');
      
      // Third metric has no target
      expect(lines[3]).toContain('N/A');
    });

    test('should display N/A for missing completion rate', () => {
      const metricsWithoutCompletion: MetricValue[] = [
        {
          metricId: 'test_metric',
          storeId: 'store-1',
          value: 100,
          unit: '元',
          timestamp: new Date('2024-01-15'),
        },
      ];

      const definitions = new Map([
        ['test_metric', { name: '测试指标' }],
      ]);

      ExportService.exportToCSV(metricsWithoutCompletion, [], definitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      
      expect(csvContent).toContain('N/A');
    });

    test('should display N/A for missing formula', () => {
      const definitions = new Map([
        ['gross_profit', { name: '毛利' }], // No formula
      ]);

      ExportService.exportToCSV([mockMetricValues[0]], mockTargetSettings, definitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      
      expect(csvContent).toContain('N/A');
    });

    test('should escape CSV special characters - commas', () => {
      const definitions = new Map([
        ['test_metric', { name: '测试指标', formula: 'A + B, C - D' }],
      ]);

      const metrics: MetricValue[] = [
        {
          metricId: 'test_metric',
          storeId: 'store-1',
          value: 100,
          unit: '元',
          timestamp: new Date('2024-01-15'),
        },
      ];

      ExportService.exportToCSV(metrics, [], definitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      
      // Formula with comma should be quoted
      expect(csvContent).toContain('"A + B, C - D"');
    });

    test('should escape CSV special characters - quotes', () => {
      const definitions = new Map([
        ['test_metric', { name: '测试"指标"', formula: 'A + B' }],
      ]);

      const metrics: MetricValue[] = [
        {
          metricId: 'test_metric',
          storeId: 'store-1',
          value: 100,
          unit: '元',
          timestamp: new Date('2024-01-15'),
        },
      ];

      ExportService.exportToCSV(metrics, [], definitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      
      // Quotes should be escaped as double quotes
      expect(csvContent).toContain('测试""指标""');
    });

    test('should escape CSV special characters - newlines', () => {
      const definitions = new Map([
        ['test_metric', { name: '测试指标', formula: 'A + B\nC - D' }],
      ]);

      const metrics: MetricValue[] = [
        {
          metricId: 'test_metric',
          storeId: 'store-1',
          value: 100,
          unit: '元',
          timestamp: new Date('2024-01-15'),
        },
      ];

      ExportService.exportToCSV(metrics, [], definitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      
      // Formula with newline should be quoted
      expect(csvContent).toContain('"A + B\nC - D"');
    });

    test('should use correct MIME type for CSV', () => {
      ExportService.exportToCSV(mockMetricValues, mockTargetSettings, mockMetricDefinitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const mimeType = blobConstructorCalls[0][1]?.type;
      
      expect(mimeType).toBe('text/csv;charset=utf-8;');
    });

    test('should generate filename with timestamp', () => {
      ExportService.exportToCSV(mockMetricValues, mockTargetSettings, mockMetricDefinitions);

      expect(mockLink.download).toMatch(/^指标数据_\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.csv$/);
    });

    test('should have correct number of data rows', () => {
      ExportService.exportToCSV(mockMetricValues, mockTargetSettings, mockMetricDefinitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      const lines = csvContent.split('\n').filter(line => line.trim());
      
      // 1 header + 3 data rows
      expect(lines.length).toBe(4);
    });
  });

  describe('CSV Export Data Completeness', () => {
    test('should include all required columns - Requirements 12.7', () => {
      ExportService.exportToCSV(mockMetricValues, mockTargetSettings, mockMetricDefinitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      const lines = csvContent.split('\n');
      const headers = lines[0].replace('\uFEFF', '').split(',');
      
      expect(headers).toContain('指标名称');
      expect(headers).toContain('当前值');
      expect(headers).toContain('单位');
      expect(headers).toContain('目标值');
      expect(headers).toContain('完成率');
      expect(headers).toContain('计算公式');
    });

    test('should export metric name from definitions', () => {
      ExportService.exportToCSV(mockMetricValues, mockTargetSettings, mockMetricDefinitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      
      expect(csvContent).toContain('毛利');
      expect(csvContent).toContain('净利率');
      expect(csvContent).toContain('成交率');
    });

    test('should use metricId as fallback when name not in definitions', () => {
      const emptyDefinitions = new Map();

      ExportService.exportToCSV(mockMetricValues, mockTargetSettings, emptyDefinitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      
      expect(csvContent).toContain('gross_profit');
      expect(csvContent).toContain('net_profit_margin');
      expect(csvContent).toContain('conversion_rate');
    });

    test('should export current value for all metrics', () => {
      ExportService.exportToCSV(mockMetricValues, mockTargetSettings, mockMetricDefinitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      
      expect(csvContent).toContain('35000.00');
      expect(csvContent).toContain('15.50');
      expect(csvContent).toContain('28.30');
    });

    test('should export unit for all metrics', () => {
      ExportService.exportToCSV(mockMetricValues, mockTargetSettings, mockMetricDefinitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      
      expect(csvContent).toContain('元');
      expect(csvContent).toContain('%');
    });

    test('should export target value when available', () => {
      ExportService.exportToCSV(mockMetricValues, mockTargetSettings, mockMetricDefinitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      
      expect(csvContent).toContain('40000.00');
      expect(csvContent).toContain('20.00');
    });

    test('should match target to correct store and metric', () => {
      const multiStoreMetrics: MetricValue[] = [
        {
          metricId: 'gross_profit',
          storeId: 'store-1',
          value: 35000,
          unit: '元',
          timestamp: new Date('2024-01-15'),
        },
        {
          metricId: 'gross_profit',
          storeId: 'store-2',
          value: 28000,
          unit: '元',
          timestamp: new Date('2024-01-15'),
        },
      ];

      const multiStoreTargets: TargetSetting[] = [
        {
          targetId: 'target-1',
          metricId: 'gross_profit',
          storeId: 'store-1',
          targetValue: 40000,
          period: 'monthly',
          effectiveFrom: new Date('2024-01-01'),
        },
        {
          targetId: 'target-2',
          metricId: 'gross_profit',
          storeId: 'store-2',
          targetValue: 30000,
          period: 'monthly',
          effectiveFrom: new Date('2024-01-01'),
        },
      ];

      ExportService.exportToCSV(multiStoreMetrics, multiStoreTargets, mockMetricDefinitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      const lines = csvContent.split('\n');
      
      // First metric should have target 40000
      expect(lines[1]).toContain('40000.00');
      // Second metric should have target 30000
      expect(lines[2]).toContain('30000.00');
    });

    test('should export formula when available - Requirements 12.7', () => {
      ExportService.exportToCSV(mockMetricValues, mockTargetSettings, mockMetricDefinitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      
      expect(csvContent).toContain('收入 - 商品成本 - 调价成本');
      expect(csvContent).toContain('利润 / 收入 * 100');
      expect(csvContent).toContain('成交客户数 / 进店客流 * 100');
    });

    test('should export completion rate when available', () => {
      ExportService.exportToCSV(mockMetricValues, mockTargetSettings, mockMetricDefinitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      
      expect(csvContent).toContain('87.5%');
      expect(csvContent).toContain('77.5%');
    });

    test('should handle empty metrics array', () => {
      ExportService.exportToCSV([], mockTargetSettings, mockMetricDefinitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      const lines = csvContent.split('\n').filter(line => line.trim());
      
      // Only header row
      expect(lines.length).toBe(1);
    });

    test('should handle empty target settings', () => {
      ExportService.exportToCSV(mockMetricValues, [], mockMetricDefinitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      
      // All targets should be N/A
      const naCount = (csvContent.match(/N\/A/g) || []).length;
      expect(naCount).toBeGreaterThan(0);
    });

    test('should handle empty metric definitions', () => {
      const emptyDefinitions = new Map();

      ExportService.exportToCSV(mockMetricValues, mockTargetSettings, emptyDefinitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      
      // Should use metric IDs as names
      expect(csvContent).toContain('gross_profit');
      expect(csvContent).toContain('net_profit_margin');
    });

    test('should export all metrics without data loss', () => {
      const largeMetricSet: MetricValue[] = Array.from({ length: 100 }, (_, i) => ({
        metricId: `metric_${i}`,
        storeId: `store_${i % 10}`,
        value: Math.random() * 10000,
        unit: '元',
        timestamp: new Date('2024-01-15'),
      }));

      const definitions = new Map(
        largeMetricSet.map((m, i) => [m.metricId, { name: `指标${i}` }])
      );

      ExportService.exportToCSV(largeMetricSet, [], definitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      const lines = csvContent.split('\n').filter(line => line.trim());
      
      // 1 header + 100 data rows
      expect(lines.length).toBe(101);
    });
  });

  describe('CSV Export File Operations', () => {
    test('should create download link', () => {
      ExportService.exportToCSV(mockMetricValues, mockTargetSettings, mockMetricDefinitions);

      expect(createElementSpy).toHaveBeenCalledWith('a');
    });

    test('should set href with blob URL', () => {
      ExportService.exportToCSV(mockMetricValues, mockTargetSettings, mockMetricDefinitions);

      expect(mockLink.href).toBe('blob:mock-url');
    });

    test('should trigger download', () => {
      ExportService.exportToCSV(mockMetricValues, mockTargetSettings, mockMetricDefinitions);

      expect(mockLink.click).toHaveBeenCalled();
    });

    test('should append and remove link from DOM', () => {
      ExportService.exportToCSV(mockMetricValues, mockTargetSettings, mockMetricDefinitions);

      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
      expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
    });

    test('should revoke object URL after download', () => {
      ExportService.exportToCSV(mockMetricValues, mockTargetSettings, mockMetricDefinitions);

      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    });

    test('should create blob with correct content', () => {
      ExportService.exportToCSV(mockMetricValues, mockTargetSettings, mockMetricDefinitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      expect(blobConstructorCalls.length).toBeGreaterThan(0);
      
      const content = blobConstructorCalls[0][0][0] as string;
      expect(content).toBeTruthy();
      expect(content.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle metrics with zero values', () => {
      const metricsWithZero: MetricValue[] = [
        {
          metricId: 'test_metric',
          storeId: 'store-1',
          value: 0,
          unit: '元',
          timestamp: new Date('2024-01-15'),
        },
      ];

      const definitions = new Map([
        ['test_metric', { name: '测试指标' }],
      ]);

      ExportService.exportToCSV(metricsWithZero, [], definitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      
      expect(csvContent).toContain('0.00');
    });

    test('should handle metrics with negative values', () => {
      const metricsWithNegative: MetricValue[] = [
        {
          metricId: 'test_metric',
          storeId: 'store-1',
          value: -1500.75,
          unit: '元',
          timestamp: new Date('2024-01-15'),
        },
      ];

      const definitions = new Map([
        ['test_metric', { name: '测试指标' }],
      ]);

      ExportService.exportToCSV(metricsWithNegative, [], definitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      
      expect(csvContent).toContain('-1500.75');
    });

    test('should handle metrics with very large values', () => {
      const metricsWithLarge: MetricValue[] = [
        {
          metricId: 'test_metric',
          storeId: 'store-1',
          value: 999999999.99,
          unit: '元',
          timestamp: new Date('2024-01-15'),
        },
      ];

      const definitions = new Map([
        ['test_metric', { name: '测试指标' }],
      ]);

      ExportService.exportToCSV(metricsWithLarge, [], definitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      
      expect(csvContent).toContain('999999999.99');
    });

    test('should handle metrics with very small decimal values', () => {
      const metricsWithSmall: MetricValue[] = [
        {
          metricId: 'test_metric',
          storeId: 'store-1',
          value: 0.01,
          unit: '元',
          timestamp: new Date('2024-01-15'),
        },
      ];

      const definitions = new Map([
        ['test_metric', { name: '测试指标' }],
      ]);

      ExportService.exportToCSV(metricsWithSmall, [], definitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      
      expect(csvContent).toContain('0.01');
    });

    test('should handle completion rate of 0%', () => {
      const metricsWithZeroCompletion: MetricValue[] = [
        {
          metricId: 'test_metric',
          storeId: 'store-1',
          value: 0,
          unit: '元',
          timestamp: new Date('2024-01-15'),
          targetCompletion: 0,
        },
      ];

      const definitions = new Map([
        ['test_metric', { name: '测试指标' }],
      ]);

      ExportService.exportToCSV(metricsWithZeroCompletion, [], definitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      
      expect(csvContent).toContain('0.0%');
    });

    test('should handle completion rate over 100%', () => {
      const metricsWithHighCompletion: MetricValue[] = [
        {
          metricId: 'test_metric',
          storeId: 'store-1',
          value: 50000,
          unit: '元',
          timestamp: new Date('2024-01-15'),
          targetCompletion: 1.25,
        },
      ];

      const definitions = new Map([
        ['test_metric', { name: '测试指标' }],
      ]);

      ExportService.exportToCSV(metricsWithHighCompletion, [], definitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      
      expect(csvContent).toContain('125.0%');
    });

    test('should handle global targets (no storeId)', () => {
      const globalTarget: TargetSetting[] = [
        {
          targetId: 'target-global',
          metricId: 'gross_profit',
          targetValue: 35000,
          period: 'monthly',
          effectiveFrom: new Date('2024-01-01'),
        },
      ];

      ExportService.exportToCSV([mockMetricValues[0]], globalTarget, mockMetricDefinitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      
      // Should match global target
      expect(csvContent).toContain('35000.00');
    });

    test('should handle special characters in all fields', () => {
      const specialMetrics: MetricValue[] = [
        {
          metricId: 'test_metric',
          storeId: 'store-1',
          value: 100,
          unit: '元/天',
          timestamp: new Date('2024-01-15'),
        },
      ];

      const specialDefinitions = new Map([
        ['test_metric', { name: '测试"指标"', formula: 'A + B, C - D\nE * F' }],
      ]);

      ExportService.exportToCSV(specialMetrics, [], specialDefinitions);

      const blobConstructorCalls = vi.mocked(global.Blob).mock.calls;
      const csvContent = blobConstructorCalls[0][0][0] as string;
      
      // All special characters should be properly escaped
      expect(csvContent).toContain('测试""指标""');
      expect(csvContent).toContain('"A + B, C - D\nE * F"');
    });
  });
});
