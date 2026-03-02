/**
 * Business Module Dashboard
 * 业务分析模块化看板
 */

import React, { useState, useCallback } from 'react';
import { BusinessModule, MODULE_CONFIGS } from '../types/business-modules';
import {
  OverallSalesModule,
  MarketBrandModule,
  MainBusinessModule,
  OperatorModule,
  MembershipModule,
  RecycleModule,
  SecondhandModule,
  SmartProductsModule,
  AccessoriesModule,
  RepairModule
} from './modules';
import './BusinessModuleDashboard.css';

export const BusinessModuleDashboard: React.FC = () => {
  const [activeModule, setActiveModule] = useState<BusinessModule>(BusinessModule.OVERALL_SALES);

  const handleModuleChange = useCallback((moduleId: BusinessModule) => {
    setActiveModule(moduleId);
  }, []);

  const renderModule = () => {
    switch (activeModule) {
      case BusinessModule.OVERALL_SALES:
        return <OverallSalesModule />;
      case BusinessModule.MARKET_BRAND:
        return <MarketBrandModule />;
      case BusinessModule.MAIN_BUSINESS:
        return <MainBusinessModule />;
      case BusinessModule.OPERATOR:
        return <OperatorModule />;
      case BusinessModule.MEMBERSHIP:
        return <MembershipModule />;
      case BusinessModule.RECYCLE:
        return <RecycleModule />;
      case BusinessModule.SECONDHAND:
        return <SecondhandModule />;
      case BusinessModule.SMART_PRODUCTS:
        return <SmartProductsModule />;
      case BusinessModule.ACCESSORIES:
        return <AccessoriesModule />;
      case BusinessModule.REPAIR:
        return <RepairModule />;
      default:
        return <div>模块未找到</div>;
    }
  };

  return (
    <div className="business-module-dashboard">
      <header className="module-header">
        <h1 className="module-title">业务分析看板</h1>
        <p className="module-subtitle">多维度业务数据分析与监控</p>
      </header>

      <nav className="module-navigation">
        <div className="module-tabs">
          {MODULE_CONFIGS.filter(m => m.enabled).map(module => (
            <button
              key={module.id}
              className={`module-tab ${activeModule === module.id ? 'active' : ''}`}
              onClick={() => handleModuleChange(module.id)}
              title={module.description}
            >
              <span className="module-icon">{module.icon}</span>
              <span className="module-name">{module.name}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="module-content">
        {renderModule()}
      </main>
    </div>
  );
};
