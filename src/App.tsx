/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { DashboardView } from './components/DashboardView';
import { RentPaymentsView } from './components/RentPaymentsView';
import { RemindersView } from './components/RemindersView';
import { TenantsView } from './components/TenantsView';
import { PropertiesView } from './components/PropertiesView';
import { CommunicationHubView } from './components/CommunicationHubView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { TenantPortalView } from './components/TenantPortalView';

const MainLayout: React.FC = () => {
  const { activeTab, paletteMode, themeMode } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'payments':
        return <RentPaymentsView />;
      case 'reminders':
        return <RemindersView />;
      case 'tenants':
        return <TenantsView />;
      case 'properties':
        return <PropertiesView />;
      case 'messages':
        return <CommunicationHubView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      case 'portal':
        return <TenantPortalView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div
      className={`min-h-screen flex bg-[#FAFAF9] text-[#1C1917] dark:bg-[#18181B] dark:text-[#F4F4F5] ${
        themeMode === 'dark' ? 'dark' : ''
      } ${paletteMode === 'optionB' ? 'font-sans' : 'font-sans'}`}
    >
      {/* Collapsible Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
