# AlertDetailsModal Component

## Overview

The AlertDetailsModal component provides a detailed view of alert information in a modal dialog, helping users understand the gap between actual and target values and providing actionable recommendations.

## Requirements

- **Requirement 10.4**: WHEN 实际指标值低于目标值时，THE System SHALL 标记为未达标状态

## Features

- **Full Alert Information**: Displays complete alert details including severity, message, and timestamp
- **Data Comparison**: Visual comparison of target vs actual values
- **Gap Analysis**: Shows absolute gap and percentage below target
- **Recommendations**: Provides context-aware improvement suggestions based on severity
- **Responsive Design**: Works on desktop and mobile devices
- **Backdrop Click**: Close modal by clicking outside

## Usage

```tsx
import { AlertDetailsModal } from './components/AlertDetailsModal';
import { Alert } from './types';

function Dashboard() {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedAlert(null);
  };

  return (
    <AlertDetailsModal
      alert={selectedAlert}
      isOpen={isModalOpen}
      onClose={handleClose}
      metricName="毛利"
      storeName="旗舰店"
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `alert` | `Alert \| null` | Yes | Alert object to display details for |
| `isOpen` | `boolean` | Yes | Controls modal visibility |
| `onClose` | `() => void` | Yes | Callback when modal is closed |
| `metricName` | `string` | No | Human-readable metric name |
| `storeName` | `string` | No | Human-readable store name |

## Modal Sections

### 1. Basic Information
- Severity level with color coding
- Store name (if provided)
- Metric name (if provided)
- Alert timestamp

### 2. Alert Message
- Full alert message from AlertService
- Formatted for readability

### 3. Data Comparison
- Visual comparison showing:
  - Target value (green)
  - Actual value (red)
  - Gap amount
  - Gap percentage

### 4. Recommendations
Context-aware suggestions based on severity:

**CRITICAL/ERROR**:
- 立即采取行动，分析根本原因
- 检查相关业务流程和数据
- 与团队讨论改进措施
- (If gap >20%) 考虑调整目标值或业务策略

**WARNING**:
- 密切关注指标变化趋势
- 制定预防性改进计划

**INFO**:
- 持续监控指标表现

## Closing Behavior

The modal can be closed by:
1. Clicking the X button in the header
2. Clicking the "知道了" button in the footer
3. Clicking the backdrop (outside the modal)
4. Pressing ESC key (browser default)

## Styling

The component uses `AlertDetailsModal.css` for styling with:
- Backdrop overlay with fade-in animation
- Modal slide-up animation
- Color-coded severity indicators
- Responsive layout for mobile devices
- Clear visual hierarchy

## Accessibility

- Proper ARIA labels for buttons
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Semantic HTML structure

## Integration

The AlertDetailsModal is integrated into the Dashboard component and is triggered when:
1. User clicks "详情" button in AlertBanner
2. User clicks alert icon on KPICard

The modal receives alert data and displays comprehensive information to help users understand and address the issue.
