/**
 * FilterPanel Component Tests
 * Requirements: 9.4, 9.5, 10.2
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterPanel } from './FilterPanel';
import { Store, StoreType, StoreLevel, MetricCategory } from '../types';

describe('FilterPanel', () => {
  const mockStores: Store[] = [
    {
      id: 'store-001',
      name: '北京旗舰店',
      type: StoreType.FLAGSHIP,
      level: StoreLevel.A,
      employeeCount: 25,
    },
    {
      id: 'store-002',
      name: '上海中心店',
      type: StoreType.FLAGSHIP,
      level: StoreLevel.A,
      employeeCount: 22,
    },
    {
      id: 'store-003',
      name: '深圳标准店',
      type: StoreType.STANDARD,
      level: StoreLevel.B,
      employeeCount: 15,
    },
  ];

  const defaultProps = {
    stores: mockStores,
    selectedStoreIds: ['store-001'],
    onStoreSelectionChange: vi.fn(),
    timeRange: {
      start: new Date('2024-01-01'),
      end: new Date('2024-01-31'),
    },
    onTimeRangeChange: vi.fn(),
    selectedCategories: [MetricCategory.PROFIT],
    onCategoryChange: vi.fn(),
    selectedStoreTypes: [StoreType.FLAGSHIP],
    onStoreTypeChange: vi.fn(),
    selectedStoreLevels: [StoreLevel.A],
    onStoreLevelChange: vi.fn(),
  };

  it('should render filter panel with title', () => {
    render(<FilterPanel {...defaultProps} />);
    expect(screen.getByText('筛选条件')).toBeInTheDocument();
  });

  it('should expand and collapse when toggle button is clicked', () => {
    render(<FilterPanel {...defaultProps} />);
    
    const toggleButton = screen.getByRole('button', { name: /展开筛选面板/ });
    expect(toggleButton).toBeInTheDocument();
    
    // Initially collapsed, should not show store selection
    expect(screen.queryByText('门店选择')).not.toBeInTheDocument();
    
    // Click to expand
    fireEvent.click(toggleButton);
    expect(screen.getByText('门店选择')).toBeInTheDocument();
    
    // Click to collapse
    const collapseButton = screen.getByRole('button', { name: /收起筛选面板/ });
    fireEvent.click(collapseButton);
    expect(screen.queryByText('门店选择')).not.toBeInTheDocument();
  });

  it('should display all stores in the list', () => {
    render(<FilterPanel {...defaultProps} />);
    
    // Expand the panel
    fireEvent.click(screen.getByRole('button', { name: /展开筛选面板/ }));
    
    expect(screen.getByText(/北京旗舰店/)).toBeInTheDocument();
    expect(screen.getByText(/上海中心店/)).toBeInTheDocument();
    expect(screen.getByText(/深圳标准店/)).toBeInTheDocument();
  });

  it('should call onStoreSelectionChange when store is toggled', () => {
    const onStoreSelectionChange = vi.fn();
    render(<FilterPanel {...defaultProps} onStoreSelectionChange={onStoreSelectionChange} />);
    
    // Expand the panel
    fireEvent.click(screen.getByRole('button', { name: /展开筛选面板/ }));
    
    // Find and click the checkbox for store-002
    const checkboxes = screen.getAllByRole('checkbox');
    const store002Checkbox = checkboxes.find(cb => {
      const label = cb.parentElement?.textContent;
      return label?.includes('上海中心店');
    });
    
    if (store002Checkbox) {
      fireEvent.click(store002Checkbox);
      expect(onStoreSelectionChange).toHaveBeenCalledWith(['store-001', 'store-002']);
    }
  });

  it('should select all stores when "全选" button is clicked', () => {
    const onStoreSelectionChange = vi.fn();
    render(<FilterPanel {...defaultProps} onStoreSelectionChange={onStoreSelectionChange} />);
    
    // Expand the panel
    fireEvent.click(screen.getByRole('button', { name: /展开筛选面板/ }));
    
    // Click "全选" button
    const selectAllButton = screen.getByText('全选');
    fireEvent.click(selectAllButton);
    
    expect(onStoreSelectionChange).toHaveBeenCalledWith(['store-001', 'store-002', 'store-003']);
  });

  it('should clear all stores when "清空" button is clicked', () => {
    const onStoreSelectionChange = vi.fn();
    render(<FilterPanel {...defaultProps} onStoreSelectionChange={onStoreSelectionChange} />);
    
    // Expand the panel
    fireEvent.click(screen.getByRole('button', { name: /展开筛选面板/ }));
    
    // Click "清空" button
    const clearButton = screen.getByText('清空');
    fireEvent.click(clearButton);
    
    expect(onStoreSelectionChange).toHaveBeenCalledWith([]);
  });

  it('should call onTimeRangeChange when date is changed', () => {
    const onTimeRangeChange = vi.fn();
    render(<FilterPanel {...defaultProps} onTimeRangeChange={onTimeRangeChange} />);
    
    // Expand the panel
    fireEvent.click(screen.getByRole('button', { name: /展开筛选面板/ }));
    
    // Change start date
    const startDateInput = screen.getByLabelText('开始日期');
    fireEvent.change(startDateInput, { target: { value: '2024-02-01' } });
    
    expect(onTimeRangeChange).toHaveBeenCalled();
  });

  it('should display all metric categories', () => {
    render(<FilterPanel {...defaultProps} />);
    
    // Expand the panel
    fireEvent.click(screen.getByRole('button', { name: /展开筛选面板/ }));
    
    expect(screen.getByText('结算相关')).toBeInTheDocument();
    expect(screen.getByText('主营业务')).toBeInTheDocument();
    expect(screen.getByText('客流相关')).toBeInTheDocument();
    expect(screen.getByText('利润相关')).toBeInTheDocument();
    expect(screen.getByText('收入成本')).toBeInTheDocument();
    expect(screen.getByText('费用')).toBeInTheDocument();
    expect(screen.getByText('产出相关')).toBeInTheDocument();
  });

  it('should call onCategoryChange when category is toggled', () => {
    const onCategoryChange = vi.fn();
    render(<FilterPanel {...defaultProps} onCategoryChange={onCategoryChange} />);
    
    // Expand the panel
    fireEvent.click(screen.getByRole('button', { name: /展开筛选面板/ }));
    
    // Find and click the checkbox for "客流相关"
    const checkboxes = screen.getAllByRole('checkbox');
    const trafficCheckbox = checkboxes.find(cb => {
      const label = cb.parentElement?.textContent;
      return label === '客流相关';
    });
    
    if (trafficCheckbox) {
      fireEvent.click(trafficCheckbox);
      expect(onCategoryChange).toHaveBeenCalledWith([MetricCategory.PROFIT, MetricCategory.TRAFFIC]);
    }
  });

  it('should display all store types', () => {
    render(<FilterPanel {...defaultProps} />);
    
    // Expand the panel
    fireEvent.click(screen.getByRole('button', { name: /展开筛选面板/ }));
    
    expect(screen.getByText('旗舰店')).toBeInTheDocument();
    expect(screen.getByText('标准店')).toBeInTheDocument();
    expect(screen.getByText('迷你店')).toBeInTheDocument();
  });

  it('should call onStoreTypeChange when store type is toggled', () => {
    const onStoreTypeChange = vi.fn();
    render(<FilterPanel {...defaultProps} onStoreTypeChange={onStoreTypeChange} />);
    
    // Expand the panel
    fireEvent.click(screen.getByRole('button', { name: /展开筛选面板/ }));
    
    // Find and click the checkbox for "标准店"
    const checkboxes = screen.getAllByRole('checkbox');
    const standardCheckbox = checkboxes.find(cb => {
      const label = cb.parentElement?.textContent;
      return label === '标准店';
    });
    
    if (standardCheckbox) {
      fireEvent.click(standardCheckbox);
      expect(onStoreTypeChange).toHaveBeenCalledWith([StoreType.FLAGSHIP, StoreType.STANDARD]);
    }
  });

  it('should display all store levels', () => {
    render(<FilterPanel {...defaultProps} />);
    
    // Expand the panel
    fireEvent.click(screen.getByRole('button', { name: /展开筛选面板/ }));
    
    expect(screen.getByText('A级')).toBeInTheDocument();
    expect(screen.getByText('B级')).toBeInTheDocument();
    expect(screen.getByText('C级')).toBeInTheDocument();
    expect(screen.getByText('D级')).toBeInTheDocument();
  });

  it('should call onStoreLevelChange when store level is toggled', () => {
    const onStoreLevelChange = vi.fn();
    render(<FilterPanel {...defaultProps} onStoreLevelChange={onStoreLevelChange} />);
    
    // Expand the panel
    fireEvent.click(screen.getByRole('button', { name: /展开筛选面板/ }));
    
    // Find and click the checkbox for "B级"
    const checkboxes = screen.getAllByRole('checkbox');
    const levelBCheckbox = checkboxes.find(cb => {
      const label = cb.parentElement?.textContent;
      return label === 'B级';
    });
    
    if (levelBCheckbox) {
      fireEvent.click(levelBCheckbox);
      expect(onStoreLevelChange).toHaveBeenCalledWith([StoreLevel.A, StoreLevel.B]);
    }
  });
});
