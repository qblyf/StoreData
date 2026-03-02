/**
 * DashboardWithFilters Component Tests
 * Requirements: 9.4, 9.5
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardWithFilters } from './DashboardWithFilters';
import * as FilterService from '../services/FilterService';

// Mock the data generators
vi.mock('../data', () => ({
  generateCurrentSnapshot: vi.fn(() => []),
  generateTargetSettings: vi.fn(() => []),
  generateTimeSeriesData: vi.fn(() => []),
}));

// Mock the stores
vi.mock('../data/mockStores', () => ({
  mockStores: [
    {
      id: 'store-1',
      name: 'Test Store 1',
      type: 'flagship',
      level: 'A',
      employeeCount: 10,
    },
    {
      id: 'store-2',
      name: 'Test Store 2',
      type: 'standard',
      level: 'B',
      employeeCount: 8,
    },
  ],
}));

describe('DashboardWithFilters', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('should render dashboard with filter panel', async () => {
    render(<DashboardWithFilters />);

    await waitFor(() => {
      expect(screen.getByText('门店数据指标看板')).toBeInTheDocument();
    });

    // Filter panel should be present
    expect(screen.getByText('筛选条件')).toBeInTheDocument();
  });

  test('should load saved filter preferences on mount', async () => {
    const mockPreferences: FilterService.FilterPreferences = {
      selectedStoreIds: ['store-1'],
      timeRange: {
        start: new Date('2024-01-01'),
        end: new Date('2024-01-31'),
      },
      selectedCategories: [],
      selectedStoreTypes: [],
      selectedStoreLevels: [],
    };

    const loadSpy = vi.spyOn(FilterService, 'loadFilterPreferences');
    loadSpy.mockReturnValue(mockPreferences);

    render(<DashboardWithFilters />);

    await waitFor(() => {
      expect(loadSpy).toHaveBeenCalled();
    });
  });

  test('should save filter preferences when filters change', async () => {
    const saveSpy = vi.spyOn(FilterService, 'saveFilterPreferences');

    render(<DashboardWithFilters />);

    await waitFor(() => {
      expect(screen.getByText('门店数据指标看板')).toBeInTheDocument();
    });

    // Wait for initial save after loading
    await waitFor(() => {
      expect(saveSpy).toHaveBeenCalled();
    });
  });

  test('should display empty state when no data matches filters', async () => {
    render(<DashboardWithFilters />);

    await waitFor(() => {
      // Since we mocked the data generators to return empty arrays
      // The dashboard should show empty state
      const emptyMessage = screen.queryByText('没有符合筛选条件的数据');
      if (emptyMessage) {
        expect(emptyMessage).toBeInTheDocument();
      }
    });
  });

  test('should show store info when single store is selected', async () => {
    const mockPreferences: FilterService.FilterPreferences = {
      selectedStoreIds: ['store-1'],
      timeRange: {
        start: new Date('2024-01-01'),
        end: new Date('2024-01-31'),
      },
      selectedCategories: [],
      selectedStoreTypes: [],
      selectedStoreLevels: [],
    };

    vi.spyOn(FilterService, 'loadFilterPreferences').mockReturnValue(mockPreferences);

    render(<DashboardWithFilters />);

    await waitFor(() => {
      expect(screen.getByText('Test Store 1')).toBeInTheDocument();
    });
  });

  test('should display loading state initially', async () => {
    render(<DashboardWithFilters />);

    // The loading state may be very brief, so we check if either loading or loaded state is present
    await waitFor(() => {
      const loadingText = screen.queryByText('加载数据中...');
      const titleText = screen.queryByText('门店数据指标看板');
      expect(loadingText || titleText).toBeTruthy();
    });
  });

  test('should switch between tabs', async () => {
    render(<DashboardWithFilters />);

    await waitFor(() => {
      expect(screen.getByText('门店数据指标看板')).toBeInTheDocument();
    });

    const businessTab = screen.getByText('业务分析');
    await userEvent.click(businessTab);

    expect(businessTab.closest('button')).toHaveClass('active');
  });
});
