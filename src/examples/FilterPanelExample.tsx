/**
 * FilterPanel Example
 * 
 * Demonstrates how to use the FilterPanel component
 * with state management and data filtering
 */

import React, { useState } from 'react';
import { FilterPanel } from '../components/FilterPanel';
import { mockStores } from '../data/mockStores';
import { MetricCategory, StoreType, StoreLevel, TimeRange } from '../types';

export const FilterPanelExample: React.FC = () => {
  // State for all filter options
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>(['store-001']);
  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: new Date('2024-01-01'),
    end: new Date('2024-01-31'),
  });
  const [selectedCategories, setSelectedCategories] = useState<MetricCategory[]>([
    MetricCategory.PROFIT,
    MetricCategory.TRAFFIC,
  ]);
  const [selectedStoreTypes, setSelectedStoreTypes] = useState<StoreType[]>([
    StoreType.FLAGSHIP,
    StoreType.STANDARD,
  ]);
  const [selectedStoreLevels, setSelectedStoreLevels] = useState<StoreLevel[]>([
    StoreLevel.A,
    StoreLevel.B,
  ]);

  // Get filtered stores based on type and level
  const filteredStores = mockStores.filter(store => {
    const typeMatch = selectedStoreTypes.length === 0 || selectedStoreTypes.includes(store.type);
    const levelMatch = selectedStoreLevels.length === 0 || selectedStoreLevels.includes(store.level);
    return typeMatch && levelMatch;
  });

  // Get selected stores
  const selectedStores = mockStores.filter(store => selectedStoreIds.includes(store.id));

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>FilterPanel 组件示例</h1>
      
      <FilterPanel
        stores={mockStores}
        selectedStoreIds={selectedStoreIds}
        onStoreSelectionChange={setSelectedStoreIds}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        selectedCategories={selectedCategories}
        onCategoryChange={setSelectedCategories}
        selectedStoreTypes={selectedStoreTypes}
        onStoreTypeChange={setSelectedStoreTypes}
        selectedStoreLevels={selectedStoreLevels}
        onStoreLevelChange={setSelectedStoreLevels}
      />

      {/* Display current filter state */}
      <div style={{ 
        marginTop: '24px', 
        padding: '20px', 
        background: '#f5f5f5', 
        borderRadius: '8px' 
      }}>
        <h2>当前筛选状态</h2>
        
        <div style={{ marginBottom: '16px' }}>
          <h3>选中的门店 ({selectedStores.length})</h3>
          <ul>
            {selectedStores.map(store => (
              <li key={store.id}>
                {store.name} - {store.type} - {store.level}级
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <h3>时间范围</h3>
          <p>
            从 {timeRange.start.toLocaleDateString('zh-CN')} 
            到 {timeRange.end.toLocaleDateString('zh-CN')}
          </p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <h3>指标类别 ({selectedCategories.length})</h3>
          <p>{selectedCategories.join(', ') || '未选择'}</p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <h3>门店类型 ({selectedStoreTypes.length})</h3>
          <p>{selectedStoreTypes.join(', ') || '未选择'}</p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <h3>门店级别 ({selectedStoreLevels.length})</h3>
          <p>{selectedStoreLevels.join(', ') || '未选择'}</p>
        </div>

        <div>
          <h3>符合类型和级别筛选的门店 ({filteredStores.length})</h3>
          <ul>
            {filteredStores.map(store => (
              <li key={store.id}>
                {store.name} - {store.type} - {store.level}级
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Usage tips */}
      <div style={{ 
        marginTop: '24px', 
        padding: '20px', 
        background: '#e3f2fd', 
        borderRadius: '8px' 
      }}>
        <h2>使用提示</h2>
        <ul>
          <li>点击"展开"按钮查看所有筛选选项</li>
          <li>门店选择支持多选，可以对比多个门店的数据</li>
          <li>使用"全选"和"清空"按钮快速操作</li>
          <li>时间范围可以自定义选择</li>
          <li>指标类别、门店类型和级别都支持多选</li>
          <li>筛选条件会实时更新下方的显示内容</li>
        </ul>
      </div>
    </div>
  );
};

export default FilterPanelExample;
