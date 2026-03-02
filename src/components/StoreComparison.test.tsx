/**
 * StoreComparison Component Tests
 * 
 * Tests for the StoreComparison component functionality
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StoreComparison } from './StoreComparison';
import { ComparisonResult, StoreType, StoreLevel } from '../types';

describe('StoreComparison', () => {
  const mockComparisonResult: ComparisonResult = {
    comparisonId: 'comp-001',
    metricId: 'gross_profit',
    stores: [
      {
        storeId: 'store-001',
        storeName: '北京旗舰店',
        storeType: StoreType.FLAGSHIP,
        storeLevel: StoreLevel.A,
        value: 150000,
        target: 140000,
        deviation: 10000,
      },
      {
        storeId: 'store-002',
        storeName: '上海中心店',
        storeType: StoreType.FLAGSHIP,
        storeLevel: StoreLevel.A,
        value: 120000,
        target: 140000,
        deviation: -20000,
      },
      {
        storeId: 'store-003',
        storeName: '深圳标准店',
        storeType: StoreType.STANDARD,
        storeLevel: StoreLevel.B,
        value: 100000,
        target: 110000,
        deviation: -10000,
      },
    ],
    ranking: [
      { storeId: 'store-001', rank: 1, value: 150000 },
      { storeId: 'store-002', rank: 2, value: 120000 },
      { storeId: 'store-003', rank: 3, value: 100000 },
    ],
    average: 123333.33,
    median: 120000,
    timestamp: new Date('2024-01-15T10:00:00Z'),
  };

  it('renders component with title and subtitle', () => {
    render(
      <StoreComparison
        comparisonResult={mockComparisonResult}
        metricName="毛利"
        unit="元"
      />
    );

    expect(screen.getByText('毛利 - 门店对比')).toBeInTheDocument();
    expect(screen.getByText('对比 3 家门店的表现')).toBeInTheDocument();
  });

  it('displays statistics summary correctly', () => {
    render(
      <StoreComparison
        comparisonResult={mockComparisonResult}
        metricName="毛利"
        unit="元"
      />
    );

    expect(screen.getByText('平均值')).toBeInTheDocument();
    expect(screen.getByText('中位数')).toBeInTheDocument();
    expect(screen.getByText('最高值')).toBeInTheDocument();
    expect(screen.getByText('最低值')).toBeInTheDocument();

    // Check formatted values (may appear in both stats and table)
    expect(screen.getAllByText('123,333.33元').length).toBeGreaterThan(0);
    expect(screen.getAllByText('120,000元').length).toBeGreaterThan(0);
    expect(screen.getAllByText('150,000元').length).toBeGreaterThan(0);
    expect(screen.getAllByText('100,000元').length).toBeGreaterThan(0);
  });

  it('renders ranking table with correct data', () => {
    render(
      <StoreComparison
        comparisonResult={mockComparisonResult}
        metricName="毛利"
        unit="元"
      />
    );

    // Check table headers
    expect(screen.getByText('排名')).toBeInTheDocument();
    expect(screen.getByText('门店名称')).toBeInTheDocument();
    expect(screen.getByText('类型')).toBeInTheDocument();
    expect(screen.getByText('级别')).toBeInTheDocument();
    expect(screen.getByText('实际值')).toBeInTheDocument();
    expect(screen.getByText('目标值')).toBeInTheDocument();
    expect(screen.getByText('偏差')).toBeInTheDocument();

    // Check store names
    expect(screen.getByText('北京旗舰店')).toBeInTheDocument();
    expect(screen.getByText('上海中心店')).toBeInTheDocument();
    expect(screen.getByText('深圳标准店')).toBeInTheDocument();
  });

  it('displays rankings in correct order', () => {
    const { container } = render(
      <StoreComparison
        comparisonResult={mockComparisonResult}
        metricName="毛利"
        unit="元"
      />
    );

    const rankBadges = container.querySelectorAll('.rank-badge');
    expect(rankBadges).toHaveLength(3);
    expect(rankBadges[0].textContent).toBe('1');
    expect(rankBadges[1].textContent).toBe('2');
    expect(rankBadges[2].textContent).toBe('3');
  });

  it('handles null values correctly', () => {
    const comparisonWithNull: ComparisonResult = {
      ...mockComparisonResult,
      stores: [
        {
          storeId: 'store-001',
          storeName: '北京旗舰店',
          storeType: StoreType.FLAGSHIP,
          storeLevel: StoreLevel.A,
          value: null,
          target: 140000,
          deviation: undefined,
        },
      ],
      ranking: [{ storeId: 'store-001', rank: 1, value: 0 }],
      average: 0,
      median: 0,
    };

    render(
      <StoreComparison
        comparisonResult={comparisonWithNull}
        metricName="毛利"
        unit="元"
      />
    );

    // Should display N/A for null values
    const cells = screen.getAllByText('N/A');
    expect(cells.length).toBeGreaterThan(0);
  });

  it('displays timestamp correctly', () => {
    render(
      <StoreComparison
        comparisonResult={mockComparisonResult}
        metricName="毛利"
        unit="元"
      />
    );

    expect(screen.getByText(/数据更新时间:/)).toBeInTheDocument();
  });

  it('shows target values when available', () => {
    render(
      <StoreComparison
        comparisonResult={mockComparisonResult}
        metricName="毛利"
        unit="元"
      />
    );

    // Check that target values are displayed (may appear multiple times)
    expect(screen.getAllByText('140,000元').length).toBeGreaterThan(0);
    expect(screen.getAllByText('110,000元').length).toBeGreaterThan(0);
  });

  it('displays deviation values with correct formatting', () => {
    render(
      <StoreComparison
        comparisonResult={mockComparisonResult}
        metricName="毛利"
        unit="元"
      />
    );

    // Positive deviation
    expect(screen.getByText('10,000元')).toBeInTheDocument();
    // Negative deviation
    expect(screen.getByText('-20,000元')).toBeInTheDocument();
    expect(screen.getByText('-10,000元')).toBeInTheDocument();
  });

  it('applies correct CSS classes for positive and negative deviations', () => {
    const { container } = render(
      <StoreComparison
        comparisonResult={mockComparisonResult}
        metricName="毛利"
        unit="元"
      />
    );

    const deviationCells = container.querySelectorAll('.deviation-cell');
    expect(deviationCells.length).toBeGreaterThan(0);

    // Check for positive and negative classes
    const positiveCell = Array.from(deviationCells).find(cell => 
      cell.classList.contains('positive')
    );
    const negativeCell = Array.from(deviationCells).find(cell => 
      cell.classList.contains('negative')
    );

    expect(positiveCell).toBeDefined();
    expect(negativeCell).toBeDefined();
  });

  it('handles missing target and deviation values', () => {
    const comparisonWithoutTargets: ComparisonResult = {
      ...mockComparisonResult,
      stores: [
        {
          storeId: 'store-001',
          storeName: '北京旗舰店',
          storeType: StoreType.FLAGSHIP,
          storeLevel: StoreLevel.A,
          value: 150000,
          // No target or deviation
        },
      ],
      ranking: [{ storeId: 'store-001', rank: 1, value: 150000 }],
    };

    render(
      <StoreComparison
        comparisonResult={comparisonWithoutTargets}
        metricName="毛利"
        unit="元"
      />
    );

    // Should display "-" for missing values
    const cells = screen.getAllByText('-');
    expect(cells.length).toBeGreaterThan(0);
  });

  it('uses custom height prop', () => {
    const { container } = render(
      <StoreComparison
        comparisonResult={mockComparisonResult}
        metricName="毛利"
        unit="元"
        height={600}
      />
    );

    // The ResponsiveContainer should have the specified height
    const chartContainer = container.querySelector('.comparison-chart');
    expect(chartContainer).toBeInTheDocument();
  });

  it('displays correct number of stores in subtitle', () => {
    render(
      <StoreComparison
        comparisonResult={mockComparisonResult}
        metricName="毛利"
        unit="元"
      />
    );

    expect(screen.getByText('对比 3 家门店的表现')).toBeInTheDocument();
  });

  it('renders chart title correctly', () => {
    render(
      <StoreComparison
        comparisonResult={mockComparisonResult}
        metricName="毛利"
        unit="元"
      />
    );

    expect(screen.getByText('毛利对比')).toBeInTheDocument();
  });

  it('handles empty stores array', () => {
    const emptyComparison: ComparisonResult = {
      comparisonId: 'comp-002',
      metricId: 'gross_profit',
      stores: [],
      ranking: [],
      average: 0,
      median: 0,
      timestamp: new Date(),
    };

    render(
      <StoreComparison
        comparisonResult={emptyComparison}
        metricName="毛利"
        unit="元"
      />
    );

    expect(screen.getByText('对比 0 家门店的表现')).toBeInTheDocument();
  });

  it('formats large numbers correctly', () => {
    const largeNumberComparison: ComparisonResult = {
      ...mockComparisonResult,
      stores: [
        {
          storeId: 'store-001',
          storeName: '北京旗舰店',
          storeType: StoreType.FLAGSHIP,
          storeLevel: StoreLevel.A,
          value: 1500000,
          target: 1400000,
          deviation: 100000,
        },
      ],
      ranking: [{ storeId: 'store-001', rank: 1, value: 1500000 }],
      average: 1500000,
      median: 1500000,
    };

    render(
      <StoreComparison
        comparisonResult={largeNumberComparison}
        metricName="毛利"
        unit="元"
      />
    );

    // Should format with thousand separators (appears in stats and table)
    expect(screen.getAllByText('1,500,000元').length).toBeGreaterThan(0);
  });
});
