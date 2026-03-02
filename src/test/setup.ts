/**
 * Test setup file
 * Configures testing environment and utilities
 */

import '@testing-library/jest-dom';

// Mock ResizeObserver for Recharts
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
