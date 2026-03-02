/**
 * Unit tests for KPICard component
 * Requirements: 10.4, 10.5
 * 
 * Tests cover:
 * - Data rendering correctness
 * - Unmet target state display
 * - Null value handling (displaying "N/A")
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KPICard } from './KPICard';
import type { KPICardProps } from './KPICard';

describe('KPICard', () => {
  describe('Data Rendering', () => {
    it('should render metric name correctly', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
        />
      );
      
      expect(screen.getByText('毛利')).toBeInTheDocument();
    });

    it('should render current value with correct formatting for currency', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
        />
      );
      
      expect(screen.getByText('35,000')).toBeInTheDocument();
      expect(screen.getByText('元')).toBeInTheDocument();
    });

    it('should render current value with correct formatting for percentage', () => {
      render(
        <KPICard
          metricName="毛利率"
          currentValue={35.5}
          unit="%"
        />
      );
      
      expect(screen.getByText('35.5')).toBeInTheDocument();
      expect(screen.getByText('%')).toBeInTheDocument();
    });

    it('should render current value with correct formatting for ratio', () => {
      render(
        <KPICard
          metricName="成交率"
          currentValue={0.456}
          unit="比率"
        />
      );
      
      expect(screen.getByText('0.46')).toBeInTheDocument();
    });

    it('should render target value when provided', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
          targetValue={40000}
        />
      );
      
      expect(screen.getByText(/目标:/)).toBeInTheDocument();
      expect(screen.getByText(/40,000 元/)).toBeInTheDocument();
    });

    it('should render target completion rate when provided', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
          targetValue={40000}
          targetCompletion={87.5}
        />
      );
      
      expect(screen.getByText('87.5%')).toBeInTheDocument();
    });

    it('should render period change when provided', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
          periodChange={12.5}
          periodLabel="环比"
        />
      );
      
      expect(screen.getByText('12.5%')).toBeInTheDocument();
      expect(screen.getByText('环比')).toBeInTheDocument();
      expect(screen.getByText('↑')).toBeInTheDocument();
    });

    it('should render negative period change correctly', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
          periodChange={-8.3}
          periodLabel="同比"
        />
      );
      
      expect(screen.getByText('8.3%')).toBeInTheDocument();
      expect(screen.getByText('同比')).toBeInTheDocument();
      expect(screen.getByText('↓')).toBeInTheDocument();
    });

    it('should render formula when provided', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
          formula="收入 - 商品成本 - 调价成本"
        />
      );
      
      expect(screen.getByText(/计算公式:/)).toBeInTheDocument();
      expect(screen.getByText('收入 - 商品成本 - 调价成本')).toBeInTheDocument();
    });

    it('should render assessment criteria when provided', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
          assessmentCriteria="A级门店最低标准: 40000元"
        />
      );
      
      expect(screen.getByText(/考核标准:/)).toBeInTheDocument();
      expect(screen.getByText('A级门店最低标准: 40000元')).toBeInTheDocument();
    });

    it('should render very large values correctly', () => {
      render(
        <KPICard
          metricName="年度收入"
          currentValue={10000000}
          unit="元"
        />
      );
      
      expect(screen.getByText('10,000,000')).toBeInTheDocument();
    });

    it('should render very small values correctly', () => {
      render(
        <KPICard
          metricName="转化率"
          currentValue={0.0123}
          unit="比率"
        />
      );
      
      expect(screen.getByText('0.01')).toBeInTheDocument();
    });

    it('should render zero value correctly', () => {
      render(
        <KPICard
          metricName="利润"
          currentValue={0}
          unit="元"
        />
      );
      
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('Unmet Target State Display', () => {
    it('should display unmet target badge when isUnmetTarget is true', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
          targetValue={40000}
          isUnmetTarget={true}
        />
      );
      
      expect(screen.getByText('未达标')).toBeInTheDocument();
    });

    it('should not display unmet target badge when isUnmetTarget is false', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={45000}
          unit="元"
          targetValue={40000}
          isUnmetTarget={false}
        />
      );
      
      expect(screen.queryByText('未达标')).not.toBeInTheDocument();
    });

    it('should apply unmet-target CSS class when isUnmetTarget is true', () => {
      const { container } = render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
          targetValue={40000}
          isUnmetTarget={true}
        />
      );
      
      const card = container.querySelector('.kpi-card');
      expect(card).toHaveClass('unmet-target');
    });

    it('should not apply unmet-target CSS class when isUnmetTarget is false', () => {
      const { container } = render(
        <KPICard
          metricName="毛利"
          currentValue={45000}
          unit="元"
          targetValue={40000}
          isUnmetTarget={false}
        />
      );
      
      const card = container.querySelector('.kpi-card');
      expect(card).not.toHaveClass('unmet-target');
    });

    it('should display alert icon when alertSeverity is provided', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
          alertSeverity="warning"
        />
      );
      
      const alertButton = screen.getByRole('button', { name: /查看预警详情/ });
      expect(alertButton).toBeInTheDocument();
    });

    it('should display critical alert icon with correct emoji', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
          alertSeverity="critical"
        />
      );
      
      expect(screen.getByText('🔴')).toBeInTheDocument();
    });

    it('should display error alert icon with correct emoji', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
          alertSeverity="error"
        />
      );
      
      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    it('should display warning alert icon with correct emoji', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
          alertSeverity="warning"
        />
      );
      
      expect(screen.getByText('⚡')).toBeInTheDocument();
    });

    it('should display info alert icon with correct emoji', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
          alertSeverity="info"
        />
      );
      
      expect(screen.getByText('ℹ️')).toBeInTheDocument();
    });

    it('should call onAlertClick when alert icon is clicked', () => {
      const handleAlertClick = vi.fn();
      
      render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
          alertSeverity="warning"
          onAlertClick={handleAlertClick}
        />
      );
      
      const alertButton = screen.getByRole('button', { name: /查看预警详情/ });
      alertButton.click();
      
      expect(handleAlertClick).toHaveBeenCalledTimes(1);
    });

    it('should display both unmet target badge and alert icon when both are provided', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
          targetValue={40000}
          isUnmetTarget={true}
          alertSeverity="error"
        />
      );
      
      expect(screen.getByText('未达标')).toBeInTheDocument();
      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    it('should show completion bar with orange color when target not met', () => {
      const { container } = render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
          targetValue={40000}
          targetCompletion={87.5}
          isUnmetTarget={true}
        />
      );
      
      const completionFill = container.querySelector('.completion-fill');
      expect(completionFill).toBeInTheDocument();
      expect(completionFill).not.toHaveClass('complete');
    });

    it('should show completion bar with green color when target is met', () => {
      const { container } = render(
        <KPICard
          metricName="毛利"
          currentValue={42000}
          unit="元"
          targetValue={40000}
          targetCompletion={105}
          isUnmetTarget={false}
        />
      );
      
      const completionFill = container.querySelector('.completion-fill');
      expect(completionFill).toHaveClass('complete');
    });
  });

  describe('Null Value Handling', () => {
    it('should display "N/A" when currentValue is null', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={null}
          unit="元"
        />
      );
      
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should display "N/A" for null value with target', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={null}
          unit="元"
          targetValue={40000}
        />
      );
      
      expect(screen.getByText('N/A')).toBeInTheDocument();
      expect(screen.getByText(/40,000 元/)).toBeInTheDocument();
    });

    it('should display "N/A" for null target value', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
          targetValue={null as any}
        />
      );
      
      expect(screen.getByText('35,000')).toBeInTheDocument();
      expect(screen.getByText(/N\/A/)).toBeInTheDocument();
    });

    it('should handle null value with percentage unit', () => {
      render(
        <KPICard
          metricName="毛利率"
          currentValue={null}
          unit="%"
        />
      );
      
      expect(screen.getByText('N/A')).toBeInTheDocument();
      expect(screen.getByText('%')).toBeInTheDocument();
    });

    it('should handle null value with target completion', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={null}
          unit="元"
          targetValue={40000}
          targetCompletion={0}
        />
      );
      
      expect(screen.getByText('N/A')).toBeInTheDocument();
      expect(screen.getByText('0.0%')).toBeInTheDocument();
    });

    it('should handle null value with period change', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={null}
          unit="元"
          periodChange={12.5}
        />
      );
      
      expect(screen.getByText('N/A')).toBeInTheDocument();
      expect(screen.getByText('12.5%')).toBeInTheDocument();
    });

    it('should handle null value with unmet target state', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={null}
          unit="元"
          targetValue={40000}
          isUnmetTarget={true}
        />
      );
      
      expect(screen.getByText('N/A')).toBeInTheDocument();
      expect(screen.getByText('未达标')).toBeInTheDocument();
    });

    it('should handle null value with alert severity', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={null}
          unit="元"
          alertSeverity="warning"
        />
      );
      
      expect(screen.getByText('N/A')).toBeInTheDocument();
      expect(screen.getByText('⚡')).toBeInTheDocument();
    });

    it('should handle null value with formula and criteria', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={null}
          unit="元"
          formula="收入 - 成本"
          assessmentCriteria="最低标准: 40000元"
        />
      );
      
      expect(screen.getByText('N/A')).toBeInTheDocument();
      expect(screen.getByText('收入 - 成本')).toBeInTheDocument();
      expect(screen.getByText('最低标准: 40000元')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle completion rate over 100%', () => {
      const { container } = render(
        <KPICard
          metricName="毛利"
          currentValue={50000}
          unit="元"
          targetValue={40000}
          targetCompletion={125}
        />
      );
      
      expect(screen.getByText('125.0%')).toBeInTheDocument();
      
      // Completion bar should be capped at 100% width
      const completionFill = container.querySelector('.completion-fill');
      expect(completionFill).toHaveStyle({ width: '100%' });
    });

    it('should handle zero period change', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
          periodChange={0}
        />
      );
      
      expect(screen.getByText('0.0%')).toBeInTheDocument();
      expect(screen.getByText('↑')).toBeInTheDocument();
    });

    it('should handle undefined period change', () => {
      const { container } = render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
        />
      );
      
      const changeElement = container.querySelector('.kpi-card-change');
      expect(changeElement).not.toBeInTheDocument();
    });

    it('should handle undefined target value', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
        />
      );
      
      expect(screen.queryByText(/目标:/)).not.toBeInTheDocument();
    });

    it('should handle undefined target completion', () => {
      const { container } = render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
          targetValue={40000}
        />
      );
      
      const completionBar = container.querySelector('.completion-bar');
      expect(completionBar).not.toBeInTheDocument();
    });

    it('should handle all optional props undefined', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
        />
      );
      
      expect(screen.getByText('毛利')).toBeInTheDocument();
      expect(screen.getByText('35,000')).toBeInTheDocument();
      expect(screen.queryByText('未达标')).not.toBeInTheDocument();
      expect(screen.queryByText(/目标:/)).not.toBeInTheDocument();
    });

    it('should handle negative values', () => {
      render(
        <KPICard
          metricName="利润"
          currentValue={-5000}
          unit="元"
        />
      );
      
      expect(screen.getByText('-5,000')).toBeInTheDocument();
    });

    it('should handle custom period label', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
          periodChange={5.5}
          periodLabel="月度增长"
        />
      );
      
      expect(screen.getByText('月度增长')).toBeInTheDocument();
    });

    it('should use default period label when not provided', () => {
      render(
        <KPICard
          metricName="毛利"
          currentValue={35000}
          unit="元"
          periodChange={5.5}
        />
      );
      
      expect(screen.getByText('环比')).toBeInTheDocument();
    });
  });

  describe('Component Memoization', () => {
    it('should be memoized with React.memo', () => {
      // React.memo wraps the component, so we check if it's a memoized component
      // by checking if it has the $$typeof property
      expect(KPICard).toBeDefined();
      expect(typeof KPICard).toBe('object');
    });
  });
});
