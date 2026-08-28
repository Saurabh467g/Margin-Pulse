import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { Footer } from './components/layout/Footer';
import { OpportunityDetailModal } from './components/common/OpportunityDetailModal';
import { TargetSolverModal } from './components/common/TargetSolverModal';

import { OverviewModule } from './components/modules/OverviewModule';
import { OpportunitiesModule } from './components/modules/OpportunitiesModule';
import { RevenueLeakageModule } from './components/modules/RevenueLeakageModule';
import { CostIntelligenceModule } from './components/modules/CostIntelligenceModule';
import { ContractIntelligenceModule } from './components/modules/ContractIntelligenceModule';
import { CapacityWasteModule } from './components/modules/CapacityWasteModule';
import { ServiceLinesModule } from './components/modules/ServiceLinesModule';
import { WhatIfSimulatorModule } from './components/modules/WhatIfSimulatorModule';
import { ActionsKanbanModule } from './components/modules/ActionsKanbanModule';
import { DataHealthModule } from './components/modules/DataHealthModule';
import { AuditLogModule } from './components/modules/AuditLogModule';

const MainLayout: React.FC = () => {
  const { activeModule } = useStore();

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'overview':
        return <OverviewModule />;
      case 'opportunities':
        return <OpportunitiesModule />;
      case 'revenue-leakage':
        return <RevenueLeakageModule />;
      case 'cost-intelligence':
        return <CostIntelligenceModule />;
      case 'contract-intelligence':
        return <ContractIntelligenceModule />;
      case 'capacity-waste':
        return <CapacityWasteModule />;
      case 'service-lines':
        return <ServiceLinesModule />;
      case 'what-if':
        return <WhatIfSimulatorModule />;
      case 'actions':
        return <ActionsKanbanModule />;
      case 'data-health':
        return <DataHealthModule />;
      case 'audit-log':
        return <AuditLogModule />;
      default:
        return <OverviewModule />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50/30 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Clean Minimalism Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white dark:bg-slate-950">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-50/50 dark:bg-black transition-colors duration-200">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderActiveModule()}
            <Footer />
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <OpportunityDetailModal />
      <TargetSolverModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
