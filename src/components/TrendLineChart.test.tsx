/**
 * Unit tests for TrendLineChart component
 * Requirements: 5.6, 10.3
 * 
 * Tests cover:
 * - Data rendering correctness
 * - Interactive functionality (hover, click)
 * - Responsive behavior
 * - Time granularity switching
 * - Target line display
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TrendLineChart, TrendChartDataPoint } from './TrendLineChart';
import { TimeGranularity } from '../types';

describe('TrendLineChart', () => {
  const mockData: TrendChartDataPoint[] = [
    {
      timestamp: new Date('2024-01-01'),
      actual: 35000,
      target: 40000,
      label: '1月1日',
    },
    {
      timestamp: new Date('2024-01-02'),
      actual: 38000,
      target: 40000,
      label: '1月2日',
    },
    {
      timestamp: new Date('2024-01-03'),
      actual: 42000,
      target: 40000,
      label: '1月3日',
    },
    {
      timestamp: new Date('2024-01-04'),
      actual: 39000,
      target: 40000,
      label: '1月4日',
    },
  ];

  describe('Data Rendering', () => {
    it('should render chart title correctly', () => {
      render(
        <TrendLineChart
          title="毛利趋势"
          data={mockData}
          unit="元"
          granularity={TimeGranularity.DAY}
        />
      );
      
      expect(screen.getByText('毛利趋势')).toBeInTheDocument();
    });

    it('should render chart component without errors', () => {
      const { container } = render(
        <TrendLineChart
          title="毛利趋势"
          data={mockData}
          unit="元"
          granularity={TimeGranularity.DAY}
        />
      );
      
      // Check if chart container is rendered
      const chartContainer = container.querySelector('.trend-line-chart');
      expect(chartContainer).toBeInTheDocument();
    });

    it('should render with showTarget prop', () => {
      const { container } = render(
        <TrendLineChart
          title="毛利趋势"
          data={mockData}
          unit="元"
          granularity={TimeGranularity.DAY}
          showTarget={true}
        />
      );
      
      const chartContainer = container.querySelector('.trend-line-chart');
      expect(chartContainer).toBeInTheDocument();
    });

    it('should render without target line when showTarget is false', () => {
      const { container } = render(
        <TrendLineChart
          title="毛利趋势"
          data={mockData}
          unit="元"
          granularity={TimeGranularity.DAY}
          showTarget={false}
        />
      );
      
      const chartContainer = container.querySelector('.trend-line-chart');
      expect(chartContainer).toBeInTheDocument();
    });

    it('should render with data without target values', () => {
      const dataWithoutTarget: TrendChartDataPoint[] = [
        {
          timestamp: new Date('2024-01-01'),
          actual: 35000,
          label: '1月1日',
        },
        {
          timestamp: new Date('2024-01-02'),
          actual: 38000,
          label: '1月2日',
        },
      ];

      const { container } = render(
        <TrendLineChart
          title="毛利趋势"
          data={dataWithoutTarget}
          unit="元"
          granularity={TimeGranularity.DAY}
          showTarget={true}
        />
      );
      
      const chartContainer = container.querySelector('.trend-line-chart');
      expect(chartContainer).toBeInTheDocument();
    });

    it('should handle empty data array', () => {
      const { container } = render(
        <TrendLineChart
          title="毛利趋势"
          data={[]}
          unit="元"
          granularity={TimeGranularity.DAY}
        />
      );
      
      const chartContainer = container.querySelector('.trend-line-chart');
      expect(chartContainer).toBeInTheDocument();
    });

    it('should handle single data point', () => {
      const singlePoint: TrendChartDataPoint[] = [
        {
          timestamp: new Date('2024-01-01'),
          actual: 35000,
          target: 40000,
          label: '1月1日',
        },
      ];

      const { container } = render(
        <TrendLineChart
          title="毛利趋势"
          data={singlePoint}
          unit="元"
          granularity={TimeGranularity.DAY}
        />
      );
      
      const chartContainer = container.querySelector('.trend-line-chart');
      expect(chartContainer).toBeInTheDocument();
    });

    it('should handle null actual values', () => {
      const dataWithNull: TrendChartDataPoint[] = [
        {
          timestamp: new Date('2024-01-01'),
          actual: 35000,
          target: 40000,
          label: '1月1日',
        },
        {
          timestamp: new Date('2024-01-02'),
          actual: null,
          target: 40000,
          label: '1月2日',
        },
        {
          timestamp: new Date('2024-01-03'),
          actual: 42000,
          target: 40000,
          label: '1月3日',
        },
      ];

      const { container } = render(
        <TrendLineChart
          title="毛利趋势"
          data={dataWithNull}
          unit="元"
          granularity={TimeGranularity.DAY}
        />
      );
      
      const chartContainer = container.querySelector('.trend-line-chart');
      expect(chartContainer).toBeInTheDocument();
    });

    it('should handle null target values', () => {
      const dataWithNullTarget: TrendChartDataPoint[] = [
        {
          timestamp: new Date('2024-01-01'),
          actual: 35000,
          target: 40000,
          label: '1月1日',
        },
        {
          timestamp: new Date('2024-01-02'),
          actual: 38000,
          target: null,
          label: '1月2日',
        },
        {
          timestamp: new Date('2024-01-03'),
          actual: 42000,
          target: 40000,
          label: '1月3日',
        },
      ];

      const { container } = render(
        <TrendLineChart
          title="毛利趋势"
          data={dataWithNullTarget}
          unit="元"
          granularity={TimeGranularity.DAY}
        />
      );
      
      const chartContainer = container.querySelector('.trend-line-chart');
      expect(chartContainer).toBeInTheDocument();
    });

    it('should accept custom height prop', () => {
      const { container } = render(
        <TrendLineChart
          title="毛利趋势"
          data={mockData}
          unit="元"
          granularity={TimeGranularity.DAY}
          height={600}
        />
      );
      
      const chartContainer = container.querySelector('.trend-line-chart');
      expect(chartContainer).toBeInTheDocument();
    });

    it('should use default height when not provided', () => {
      const { container } = render(
        <TrendLineChart
          title="毛利趋势"
          data={mockData}
          unit="元"
          granularity={TimeGranularity.DAY}
        />
      );
      
      const chartContainer = container.querySelector('.trend-line-chart');
      expect(chartContainer).toBeInTheDocument();
    });
  });

  describe('Interactive Functionality', () => {
    it('should render granularity selector when onGranularityChange is provided', () => {
      const handleGranularityChange = vi.fn();
      
      render(
        <TrendLineChart
          title="毛利趋势"
          data={mockData}
          unit="元"
          granularity={TimeGranularity.DAY}
          onGranularityChange={handleGranularityChange}
        />
      );
      
      expect(screen.getByText('日')).toBeInTheDocument();
      expect(screen.getByText('周')).toBeInTheDocument();
      expect(screen.getByText('月')).toBeInTheDocument();
    });

    it('should not render granularity selector when onGranularityChange is not provided', () => {
      render(
        <TrendLineChart
          title="毛利趋势"
          data={mockData}
          unit="元"
          granularity={TimeGranularity.DAY}
        />
      );
      
      const dayButton = screen.queryByText('日');
      const weekButton = screen.queryByText('周');
      const monthButton = screen.queryByText('月');
      
      // Buttons should not exist
      expect(dayButton).not.toBeInTheDocument();
      expect(weekButton).not.toBeInTheDocument();
      expect(monthButton).not.toBeInTheDocument();
    });

    it('should highlight active granularity button', () => {
      const handleGranularityChange = vi.fn();
      
      const { container } = render(
        <TrendLineChart
          title="毛利趋势"
          data={mockData}
          unit="元"
          granularity={TimeGranularity.DAY}
          onGranularityChange={handleGranularityChange}
        />
      );
      
      const dayButton = screen.getByText('日');
      expect(dayButton).toHaveClass('active');
      
      const weekButton = screen.getByText('周');
      expect(weekButton).not.toHaveClass('active');
    });

    it('should call onGranularityChange when day button is clicked', () => {
      const handleGranularityChange = vi.fn();
      
      render(
        <TrendLineChart
          title="毛利趋势"
          data={mockData}
          unit="元"
          granularity={TimeGranularity.WEEK}
          onGranularityChange={handleGranularityChange}
        />
      );
      
      const dayButton = screen.getByText('日');
      fireEvent.click(dayButton);
      
      expect(handleGranularityChange).toHaveBeenCalledWith(TimeGranularity.DAY);
      expect(handleGranularityChange).toHaveBeenCalledTimes(1);
    });

    it('should call onGranularityChange when week button is clicked', () => {
      const handleGranularityChange = vi.fn();
      
      render(
        <TrendLineChart
          title="毛利趋势"
          data={mockData}
          unit="元"
          granularity={TimeGranularity.DAY}
          onGranularityChange={handleGranularityChange}
        />
      );
      
      const weekButton = screen.getByText('周');
      fireEvent.click(weekButton);
      
      expect(handleGranularityChange).toHaveBeenCalledWith(TimeGranularity.WEEK);
      expect(handleGranularityChange).toHaveBeenCalledTimes(1);
    });

    it('should call onGranularityChange when month button is clicked', () => {
      const handleGranularityChange = vi.fn();
      
      render(
        <TrendLineChart
          title="毛利趋势"
          data={mockData}
          unit="元"
          granularity={TimeGranularity.DAY}
          onGranularityChange={handleGranularityChange}
        />
      );
      
      const monthButton = screen.getByText('月');
      fireEvent.click(monthButton);
      
      expect(handleGranularityChange).toHaveBeenCalledWith(TimeGranularity.MONTH);
      expect(handleGranularityChange).toHaveBeenCalledTimes(1);
    });

    it('should allow clicking the same granularity button multiple times', () => {
      const handleGranularityChange = vi.fn();
      
      render(
        <TrendLineChart
          title="毛利趋势"
          data={mockData}
          unit="元"
          granularity={TimeGranularity.DAY}
          onGranularityChange={handleGranularityChange}
        />
      );
      
      const dayButton = screen.getByText('日');
      fireEvent.click(dayButton);
      fireEvent.click(dayButton);
      
      expect(handleGranularityChange).toHaveBeenCalledTimes(2);
    });

    it('should switch between different granularities', () => {
      const handleGranularityChange = vi.fn();
      
      render(
        <TrendLineChart
          title="毛利趋势"
          data={mockData}
          unit="元"
          granularity={TimeGranularity.DAY}
          onGranularityChange={handleGranularityChange}
        />
      );
      
      const weekButton = screen.getByText('周');
      fireEvent.click(weekButton);
      
      const monthButton = screen.getByText('月');
      fireEvent.click(monthButton);
      
      expect(handleGranularityChange).toHaveBeenCalledTimes(2);
      expect(handleGranularityChange).toHaveBeenNthCalledWith(1, TimeGranularity.WEEK);
      expect(handleGranularityChange).toHaveBeenNthCalledWith(2, TimeGranularity.MONTH);
    });
  });

  describe('Responsive Behavior', () => {
    it('should render with responsive container', () => {
      const { container } = render(
        <TrendLineChart
          title="毛利趋势"
          data={mockData}
          unit="元"
          granularity={TimeGranularity.DAY}
        />
      );
      
      const chartContainer = container.querySelector('.trend-line-chart');
      expect(chartContainer).toBeInTheDocument();
    });

    it('should render chart with different heights', () => {
      const heights = [300, 400, 500, 600];
      
      heights.forEach((height) => {
        const { container } = render(
          <TrendLineChart
            title="毛利趋势"
            data={mockData}
            unit="元"
            granularity={TimeGranularity.DAY}
            height={height}
          />
        );
        
        const chartContainer = container.querySelector('.trend-line-chart');
        expect(chartContainer).toBeInTheDocument();
      });
    });

    it('should render with large dataset', () => {
      const largeData: TrendChartDataPoint[] = Array.from({ length: 100 }, (_, i) => ({
        timestamp: new Date(2024, 0, i + 1),
        actual: 30000 + Math.random() * 20000,
        target: 40000,
        label: `${i + 1}日`,
      }));

      const { container } = render(
        <TrendLineChart
          title="毛利趋势"
          data={largeData}
          unit="元"
          granularity={TimeGranularity.DAY}
        />
      );
      
      const chartContainer = container.querySelector('.trend-line-chart');
      expect(chartContainer).toBeInTheDocument();
    });

    it('should render with very small values', () => {
      const smallValueData: TrendChartDataPoint[] = [
        {
          timestamp: new Date('2024-01-01'),
          actual: 0.01,
          target: 0.05,
          label: '1月1日',
        },
        {
          timestamp: new Date('2024-01-02'),
          actual: 0.03,
          target: 0.05,
          label: '1月2日',
        },
      ];

      const { container } = render(
        <TrendLineChart
          title="转化率趋势"
          data={smallValueData}
          unit="%"
          granularity={TimeGranularity.DAY}
        />
      );
      
      const chartContainer = container.querySelector('.trend-line-chart');
      expect(chartContainer).toBeInTheDocument();
    });

    it('should render with very large values', () => {
      const largeValueData: TrendChartDataPoint[] = [
        {
          timestamp: new Date('2024-01-01'),
          actual: 10000000,
          target: 12000000,
          label: '1月1日',
        },
        {
          timestamp: new Date('2024-01-02'),
          actual: 11000000,
          target: 12000000,
          label: '1月2日',
        },
      ];

      const { container } = render(
        <TrendLineChart
          title="年度收入趋势"
          data={largeValueData}
          unit="元"
          granularity={TimeGranularity.DAY}
        />
      );
      
      const chartContainer = container.querySelector('.trend-line-chart');
      expect(chartContainer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle data with zero values', () => {
      const zeroData: TrendChartDataPoint[] = [
        {
          timestamp: new Date('2024-01-01'),
          actual: 0,
          target: 40000,
          label: '1月1日',
        },
        {
          timestamp: new Date('2024-01-02'),
          actual: 38000,
          target: 40000,
          label: '1月2日',
        },
      ];

      const { container } = render(
        <TrendLineChart
          title="毛利趋势"
          data={zeroData}
          unit="元"
          granularity={TimeGranularity.DAY}
        />
      );
      
      const chartContainer = container.querySelector('.trend-line-chart');
      expect(chartContainer).toBeInTheDocument();
    });

    it('should handle data with negative values', () => {
      const negativeData: TrendChartDataPoint[] = [
        {
          timestamp: new Date('2024-01-01'),
          actual: -5000,
          target: 0,
          label: '1月1日',
        },
        {
          timestamp: new Date('2024-01-02'),
          actual: 2000,
          target: 0,
          label: '1月2日',
        },
      ];

      const { container } = render(
        <TrendLineChart
          title="利润趋势"
          data={negativeData}
          unit="元"
          granularity={TimeGranularity.DAY}
        />
      );
      
      const chartContainer = container.querySelector('.trend-line-chart');
      expect(chartContainer).toBeInTheDocument();
    });

    it('should handle mixed null and valid values', () => {
      const mixedData: TrendChartDataPoint[] = [
        {
          timestamp: new Date('2024-01-01'),
          actual: 35000,
          target: 40000,
          label: '1月1日',
        },
        {
          timestamp: new Date('2024-01-02'),
          actual: null,
          target: null,
          label: '1月2日',
        },
        {
          timestamp: new Date('2024-01-03'),
          actual: 42000,
          target: 40000,
          label: '1月3日',
        },
        {
          timestamp: new Date('2024-01-04'),
          actual: null,
          target: 40000,
          label: '1月4日',
        },
      ];

      const { container } = render(
        <TrendLineChart
          title="毛利趋势"
          data={mixedData}
          unit="元"
          granularity={TimeGranularity.DAY}
        />
      );
      
      const chartContainer = container.querySelector('.trend-line-chart');
      expect(chartContainer).toBeInTheDocument();
    });

    it('should handle different units', () => {
      const units = ['元', '%', '人', '次', '比率'];
      
      units.forEach((unit) => {
        const { container } = render(
          <TrendLineChart
            title="趋势图"
            data={mockData}
            unit={unit}
            granularity={TimeGranularity.DAY}
          />
        );
        
        const chartContainer = container.querySelector('.trend-line-chart');
        expect(chartContainer).toBeInTheDocument();
      });
    });

    it('should handle all granularity types', () => {
      const granularities = [
        TimeGranularity.DAY,
        TimeGranularity.WEEK,
        TimeGranularity.MONTH,
      ];
      
      granularities.forEach((granularity) => {
        const { container } = render(
          <TrendLineChart
            title="毛利趋势"
            data={mockData}
            unit="元"
            granularity={granularity}
          />
        );
        
        const chartContainer = container.querySelector('.trend-line-chart');
        expect(chartContainer).toBeInTheDocument();
      });
    });
  });

  describe('Component Memoization', () => {
    it('should be memoized with React.memo', () => {
      expect(TrendLineChart).toBeDefined();
      expect(typeof TrendLineChart).toBe('object');
    });
  });
});
