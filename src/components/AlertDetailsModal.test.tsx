/**
 * AlertDetailsModal Component Tests
 * Requirements: 10.4
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AlertDetailsModal } from './AlertDetailsModal';
import { Alert, AlertSeverity } from '../types';

describe('AlertDetailsModal', () => {
  const mockAlert: Alert = {
    alertId: 'alert-1',
    storeId: 'store-001',
    metricId: 'gross_profit',
    severity: AlertSeverity.CRITICAL,
    message: '毛利未达标：实际值 30000.00，目标值 50000.00，低于目标 40.0%',
    threshold: 50000,
    actualValue: 30000,
    timestamp: new Date('2024-01-15T10:00:00'),
  };

  it('should not render when isOpen is false', () => {
    const { container } = render(
      <AlertDetailsModal
        alert={mockAlert}
        isOpen={false}
        onClose={vi.fn()}
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('should render modal when isOpen is true', () => {
    render(
      <AlertDetailsModal
        alert={mockAlert}
        isOpen={true}
        onClose={vi.fn()}
      />
    );
    
    expect(screen.getByText('预警详情')).toBeInTheDocument();
  });

  it('should display alert message', () => {
    render(
      <AlertDetailsModal
        alert={mockAlert}
        isOpen={true}
        onClose={vi.fn()}
      />
    );
    
    expect(screen.getByText(mockAlert.message)).toBeInTheDocument();
  });

  it('should display severity level', () => {
    render(
      <AlertDetailsModal
        alert={mockAlert}
        isOpen={true}
        onClose={vi.fn()}
      />
    );
    
    expect(screen.getByText('严重')).toBeInTheDocument();
  });

  it('should display metric and store names when provided', () => {
    render(
      <AlertDetailsModal
        alert={mockAlert}
        isOpen={true}
        onClose={vi.fn()}
        metricName="毛利"
        storeName="旗舰店"
      />
    );
    
    expect(screen.getByText('毛利')).toBeInTheDocument();
    expect(screen.getByText('旗舰店')).toBeInTheDocument();
  });

  it('should display target and actual values', () => {
    render(
      <AlertDetailsModal
        alert={mockAlert}
        isOpen={true}
        onClose={vi.fn()}
      />
    );
    
    expect(screen.getByText('50000.00')).toBeInTheDocument();
    expect(screen.getByText('30000.00')).toBeInTheDocument();
  });

  it('should calculate and display gap percentage', () => {
    render(
      <AlertDetailsModal
        alert={mockAlert}
        isOpen={true}
        onClose={vi.fn()}
      />
    );
    
    // Gap percentage should be 40%
    expect(screen.getByText('40.0%')).toBeInTheDocument();
  });

  it('should display recommendations', () => {
    render(
      <AlertDetailsModal
        alert={mockAlert}
        isOpen={true}
        onClose={vi.fn()}
      />
    );
    
    expect(screen.getByText(/立即采取行动/)).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <AlertDetailsModal
        alert={mockAlert}
        isOpen={true}
        onClose={onClose}
      />
    );
    
    const closeButton = screen.getByRole('button', { name: /关闭/ });
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('should call onClose when "知道了" button is clicked', () => {
    const onClose = vi.fn();
    render(
      <AlertDetailsModal
        alert={mockAlert}
        isOpen={true}
        onClose={onClose}
      />
    );
    
    const confirmButton = screen.getByRole('button', { name: /知道了/ });
    fireEvent.click(confirmButton);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('should call onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(
      <AlertDetailsModal
        alert={mockAlert}
        isOpen={true}
        onClose={onClose}
      />
    );
    
    const backdrop = screen.getByText('预警详情').closest('.alert-modal-backdrop');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it('should show different recommendations based on severity', () => {
    const warningAlert: Alert = {
      ...mockAlert,
      severity: AlertSeverity.WARNING,
    };
    
    render(
      <AlertDetailsModal
        alert={warningAlert}
        isOpen={true}
        onClose={vi.fn()}
      />
    );
    
    expect(screen.getByText(/密切关注指标变化趋势/)).toBeInTheDocument();
  });
});
