/**
 * AlertBanner Component Tests
 * Requirements: 10.4
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AlertBanner } from './AlertBanner';
import { Alert, AlertSeverity } from '../types';

describe('AlertBanner', () => {
  const mockAlerts: Alert[] = [
    {
      alertId: 'alert-1',
      storeId: 'store-001',
      metricId: 'gross_profit',
      severity: AlertSeverity.CRITICAL,
      message: '毛利未达标：实际值 30000.00，目标值 50000.00，低于目标 40.0%',
      threshold: 50000,
      actualValue: 30000,
      timestamp: new Date('2024-01-15T10:00:00'),
    },
    {
      alertId: 'alert-2',
      storeId: 'store-001',
      metricId: 'conversion_rate',
      severity: AlertSeverity.WARNING,
      message: '成交率未达标：实际值 35.00，目标值 40.00，低于目标 12.5%',
      threshold: 40,
      actualValue: 35,
      timestamp: new Date('2024-01-15T10:00:00'),
    },
  ];

  it('should render alert banner with correct alert count', () => {
    render(<AlertBanner alerts={mockAlerts} />);
    
    expect(screen.getByText(/发现 2 个预警/)).toBeInTheDocument();
  });

  it('should display severity counts', () => {
    render(<AlertBanner alerts={mockAlerts} />);
    
    expect(screen.getByText(/严重 1/)).toBeInTheDocument();
    expect(screen.getByText(/警告 1/)).toBeInTheDocument();
  });

  it('should show top 3 alerts by default', () => {
    const manyAlerts = [
      ...mockAlerts,
      { ...mockAlerts[0], alertId: 'alert-3' },
      { ...mockAlerts[0], alertId: 'alert-4' },
    ];
    
    render(<AlertBanner alerts={manyAlerts} onViewDetails={vi.fn()} />);
    
    const alertItems = screen.getAllByRole('button', { name: /详情/ });
    expect(alertItems).toHaveLength(3);
  });

  it('should expand to show all alerts when toggle is clicked', () => {
    const manyAlerts = [
      ...mockAlerts,
      { ...mockAlerts[0], alertId: 'alert-3' },
      { ...mockAlerts[0], alertId: 'alert-4' },
    ];
    
    render(<AlertBanner alerts={manyAlerts} onViewDetails={vi.fn()} />);
    
    const toggleButton = screen.getByRole('button', { name: /展开/ });
    fireEvent.click(toggleButton);
    
    const alertItems = screen.getAllByRole('button', { name: /详情/ });
    expect(alertItems).toHaveLength(4);
  });

  it('should call onDismiss when dismiss button is clicked', () => {
    const onDismiss = vi.fn();
    render(<AlertBanner alerts={mockAlerts} onDismiss={onDismiss} />);
    
    const dismissButtons = screen.getAllByRole('button', { name: /关闭/ });
    fireEvent.click(dismissButtons[0]);
    
    expect(onDismiss).toHaveBeenCalledWith('alert-1');
  });

  it('should call onViewDetails when details button is clicked', () => {
    const onViewDetails = vi.fn();
    render(<AlertBanner alerts={mockAlerts} onViewDetails={onViewDetails} />);
    
    const detailsButtons = screen.getAllByRole('button', { name: /详情/ });
    fireEvent.click(detailsButtons[0]);
    
    expect(onViewDetails).toHaveBeenCalledWith(mockAlerts[0]);
  });

  it('should not render when there are no alerts', () => {
    const { container } = render(<AlertBanner alerts={[]} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should hide dismissed alerts', () => {
    render(<AlertBanner alerts={mockAlerts} />);
    
    const dismissButtons = screen.getAllByRole('button', { name: /关闭/ });
    fireEvent.click(dismissButtons[0]);
    
    expect(screen.getByText(/发现 1 个预警/)).toBeInTheDocument();
  });
});
