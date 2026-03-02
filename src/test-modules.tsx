/**
 * Test page for business modules
 * 用于测试业务模块是否能正常渲染
 */

import React from 'react';
import { OverallSalesModule } from './components/modules/OverallSalesModule';

export const TestModules: React.FC = () => {
  return (
    <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
      <h1>业务模块测试页面</h1>
      <p>如果下面能看到"整体销售分析"模块的内容，说明模块渲染正常。</p>
      <hr />
      <OverallSalesModule />
    </div>
  );
};
