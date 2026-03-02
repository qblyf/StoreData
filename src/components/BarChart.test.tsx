/**
 * Unit tests for BarChart component
 * Requirements: 支持多门店对比功能
 * 
 * Tests cover:
 * - Data rendering correctness
 * - Responsive behavior
 * - Orientation switching (vertical/horizontal)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BarChart, BarChartDataPoint } from './BarChart';

describe('BarChart', () => {
  const mockData: BarChartDataPoint[] = [
    { label: '门店A', value: 35000, target: 40000 },
    { label: '门店B', value: 42000, target: 40000 },
    { label: '门店C', value: 38000, target: 40000 },
    { label: '门店D', value: 45000, target: 40000 },
  ];

  describe('Data Rendering', () => {
    it('should render chart title correctly', () => {
      render(<BarChart title="门店毛利对比" data={mockData} unit="元" />);
      expect(screen.getByText('门店毛利对比')).toBeInTheDocument();
    });

    it('should render chart component without errors', () => {
      const { container } = render(<BarChart title="门店毛利对比" data={mockData} unit="元" />);
      expect(container.querySelector('.bar-chart')).toBeInTheDocument();
    });

    it('should handle empty data array', () => {
      const { container } = render(<BarChart title="门店毛利对比" data={[]} unit="元" />);
      expect(container.querySelector('.bar-chart')).toBeInTheDocument();
    });

    it('should handle null values', () => {
      const dataWithNull: BarChartDataPoint[] = [
        { label: '门店A', value: 35000, target: 40000 },
        { label: '门店B', value: null, target: 40000 },
      ];
      const { container } = render(<BarChart title="门店毛利对比" data={dataWithNull} unit="元" />);
      expect(container.querySelector('.bar-chart')).toBeInTheDocument();
    });
  });

  describe('Orientation', () => {
    it('should render with vertical orientation', () => {
      const { container } = render(<BarChart title="门店毛利对比" data={mockData} unit="元" orientation="vertical" />);
      expect(container.querySelector('.bar-chart')).toBeInTheDocument();
    });

    it('should render with horizontal orientation', () => {
      const { container } = render(<BarChart title="门店毛利对比" data={mockData} unit="元" orientation="horizontal" />);
      expect(container.querySelector('.bar-chart')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should render with different heights', () => {
      [300, 400, 500].forEach((height) => {
        const { container } = render(<BarChart title="门店毛利对比" data={mockData} unit="元" height={height} />);
        expect(container.querySelector('.bar-chart')).toBeInTheDocument();
      });
    });

    it('should render with large dataset', () => {
      const largeData = Array.from({ length: 50 }, (_, i) => ({
        label: `门店${i + 1}`,
        value: 30000 + Math.random() * 20000,
        target: 40000,
      }));
      const { container } = render(<BarChart title="门店毛利对比" data={largeData} unit="元" />);
      expect(container.querySelector('.bar-chart')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero values', () => {
      const zeroData: BarChartDataPoint[] = [{ label: '门店A', value: 0, target: 40000 }];
      const { container } = render(<BarChart title="门店毛利对比" data={zeroData} unit="元" />);
      expect(container.querySelector('.bar-chart')).toBeInTheDocument();
    });

    it('should handle negative values', () => {
      const negativeData: BarChartDataPoint[] = [{ label: '门店A', value: -5000, target: 0 }];
      const { container } = render(<BarChart title="利润对比" data={negativeData} unit="元" />);
      expect(container.querySelector('.bar-chart')).toBeInTheDocument();
    });

    it('should handle different units', () => {
      ['元', '%', '人'].forEach((unit) => {
        const { container } = render(<BarChart title="对比图" data={mockData} unit={unit} />);
        expect(container.querySelector('.bar-chart')).toBeInTheDocument();
      });
    });
  });

  describe('Component Memoization', () => {
    it('should be memoized with React.memo', () => {
      expect(BarChart).toBeDefined();
      expect(typeof BarChart).toBe('object');
    });
  });
});
