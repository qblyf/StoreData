/**
 * Alert Components Example
 * 
 * Demonstrates the usage of AlertBanner and AlertDetailsModal components
 * with sample alert data.
 */

import React, { useState } from 'react';
import { AlertBanner } from '../components/AlertBanner';
import { AlertDetailsModal } from '../components/AlertDetailsModal';
import { Alert, AlertSeverity } from '../types';

// Sample alert data
const sampleAlerts: Alert[] = [
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
    metricId: 'net_profit_margin',
    severity: AlertSeverity.ERROR,
    message: '净利率未达标：实际值 12.50，目标值 18.00，低于目标 30.6%',
    threshold: 18,
    actualValue: 12.5,
    timestamp: new Date('2024-01-15T10:15:00'),
  },
  {
    alertId: 'alert-3',
    storeId: 'store-001',
    metricId: 'conversion_rate',
    severity: AlertSeverity.WARNING,
    message: '成交率未达标：实际值 35.00，目标值 40.00，低于目标 12.5%',
    threshold: 40,
    actualValue: 35,
    timestamp: new Date('2024-01-15T10:30:00'),
  },
  {
    alertId: 'alert-4',
    storeId: 'store-001',
    metricId: 'output_per_employee',
    severity: AlertSeverity.INFO,
    message: '人均产出未达标：实际值 48000.00，目标值 50000.00，低于目标 4.0%',
    threshold: 50000,
    actualValue: 48000,
    timestamp: new Date('2024-01-15T10:45:00'),
  },
];

// Metric name mapping
const metricNames: Record<string, string> = {
  gross_profit: '毛利',
  net_profit_margin: '净利率',
  conversion_rate: '成交率',
  output_per_employee: '人均产出',
};

export const AlertComponentsExample: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(sampleAlerts);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDismiss = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.alertId !== alertId));
  };

  const handleViewDetails = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAlert(null);
  };

  const handleResetAlerts = () => {
    setAlerts(sampleAlerts);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Alert Components Example</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleResetAlerts}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Reset Alerts
        </button>
      </div>

      <section style={{ marginBottom: '40px' }}>
        <h2>AlertBanner Component</h2>
        <p>Displays alerts at the top of the dashboard with severity counts and expandable list.</p>
        
        {alerts.length > 0 ? (
          <AlertBanner
            alerts={alerts}
            onDismiss={handleDismiss}
            onViewDetails={handleViewDetails}
          />
        ) : (
          <div
            style={{
              padding: '20px',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            No alerts to display. Click "Reset Alerts" to restore sample data.
          </div>
        )}
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Alert Severity Levels</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: '#fff1f0', borderLeft: '4px solid #d32f2f', borderRadius: '4px' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#d32f2f' }}>🔴 CRITICAL</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>&gt;30% below target</p>
          </div>
          <div style={{ padding: '16px', backgroundColor: '#fff7e6', borderLeft: '4px solid #f57c00', borderRadius: '4px' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#f57c00' }}>⚠️ ERROR</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>15-30% below target</p>
          </div>
          <div style={{ padding: '16px', backgroundColor: '#fffbe6', borderLeft: '4px solid #fbc02d', borderRadius: '4px' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#fbc02d' }}>⚡ WARNING</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>5-15% below target</p>
          </div>
          <div style={{ padding: '16px', backgroundColor: '#e6f7ff', borderLeft: '4px solid #1976d2', borderRadius: '4px' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>ℹ️ INFO</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>1-5% below target</p>
          </div>
        </div>
      </section>

      <section>
        <h2>AlertDetailsModal Component</h2>
        <p>Click "详情" button on any alert above to view the modal with detailed information.</p>
        <p>Or click the buttons below to preview different severity levels:</p>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {sampleAlerts.map(alert => (
            <button
              key={alert.alertId}
              onClick={() => handleViewDetails(alert)}
              style={{
                padding: '10px 16px',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              View {alert.severity.toUpperCase()} Alert
            </button>
          ))}
        </div>
      </section>

      <AlertDetailsModal
        alert={selectedAlert}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        metricName={selectedAlert ? metricNames[selectedAlert.metricId] : undefined}
        storeName="旗舰店"
      />
    </div>
  );
};

export default AlertComponentsExample;
