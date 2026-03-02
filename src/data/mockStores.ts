/**
 * Mock store data
 * Requirements: 9.1, 9.2, 9.3
 */

import { Store, StoreType, StoreLevel } from '../types';

/**
 * Predefined store data for the dashboard
 */
export const mockStores: Store[] = [
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
  {
    id: 'store-004',
    name: '广州标准店',
    type: StoreType.STANDARD,
    level: StoreLevel.B,
    employeeCount: 18,
  },
  {
    id: 'store-005',
    name: '成都标准店',
    type: StoreType.STANDARD,
    level: StoreLevel.C,
    employeeCount: 12,
  },
  {
    id: 'store-006',
    name: '杭州迷你店',
    type: StoreType.MINI,
    level: StoreLevel.C,
    employeeCount: 8,
  },
  {
    id: 'store-007',
    name: '南京迷你店',
    type: StoreType.MINI,
    level: StoreLevel.D,
    employeeCount: 6,
  },
  {
    id: 'store-008',
    name: '武汉标准店',
    type: StoreType.STANDARD,
    level: StoreLevel.B,
    employeeCount: 16,
  },
];

/**
 * Get store by ID
 */
export function getStoreById(id: string): Store | undefined {
  return mockStores.find(s => s.id === id);
}

/**
 * Get stores by type
 */
export function getStoresByType(type: StoreType): Store[] {
  return mockStores.filter(s => s.type === type);
}

/**
 * Get stores by level
 */
export function getStoresByLevel(level: StoreLevel): Store[] {
  return mockStores.filter(s => s.level === level);
}

/**
 * Get all store IDs
 */
export function getAllStoreIds(): string[] {
  return mockStores.map(s => s.id);
}
