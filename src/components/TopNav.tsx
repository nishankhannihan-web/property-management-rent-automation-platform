import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Plus,
  ShieldCheck,
  Bell,
  ExternalLink,
} from 'lucide-react';
import { RecordPaymentModal } from './RecordPaymentModal';
import { OnboardingModal } from './OnboardingModal';

export const TopNav: React.FC = () => {
  const {
    activeTab,
    selectedStateCode,
    setSelectedStateCode,
    overdueTenantsCount,
    isEmptyState,
  } = useApp();

  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Overview & Collection Health';
      case 'payments':
        return 'Rent Ledger & Transactions';
      case 'reminders':
        return 'Automated Rent Reminders';
      case 'tenants':
        return 'Tenant Directory & Leases';
      case 'properties':
        return 'Properties & Unit Inventory';
      case 'messages':
        return 'Unified Communications Hub';
      case 'reports':
        return 'Financial Reports & Schedule E';
      case 'settings':
        return 'Account & State Compliance';
      case 'portal':
        return 'Tenant Portal Preview';
      default:
        return 'Dashboard';
    }
  };

  return (
    <>
      <header className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-stone-200 bg-white dark:border-zinc-800 dark:bg-[#18181B] transition-colors">
        {/* Left: Breadcrumbs & State Compliance Badge */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-stone-500 dark:text-zinc-400">
            <span className="font-semibold text-stone-900 dark:text-zinc-100">RentPulse</span>
            <span className="mx-2 text-stone-300 dark:text-zinc-600">/</span>
            <span>{isEmptyState ? 'New Organization' : 'Austin Portfolio'}</span>
            <span className="mx-2 text-stone-300 dark:text-zinc-600">/</span>
            <span className="text-stone-800 dark:text-zinc-200 font-medium">
              {getBreadcrumbTitle()}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-100 text-stone-600 text-[11px] font-mono dark:bg-zinc-800 dark:text-zinc-300">
            <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
            <span>State Law:</span>
            <select
              value={selectedStateCode}
              onChange={(e) => setSelectedStateCode(e.target.value)}
              className="bg-transparent font-semibold text-stone-800 dark:text-zinc-100 focus:outline-hidden cursor-pointer"
            >
              <option value="TX">Texas (2-Day Grace)</option>
              <option value="CA">California (3-Day Notice)</option>
              <option value="NY">New York (5-Day Grace)</option>
              <option value="FL">Florida (3-Day Statutory)</option>
            </select>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="hidden md:flex items-center relative w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search tenant, unit, or receipt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-stone-200 bg-stone-50/70 pl-9 pr-3 py-1.5 text-xs text-stone-800 placeholder-stone-400 focus:border-stone-400 focus:bg-white focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 dark:focus:border-zinc-600"
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="hidden sm:flex items-center rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <span>Setup Guide</span>
          </button>

          <button
            onClick={() => setIsRecordPaymentOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Record Payment</span>
          </button>

          {/* User profile avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-stone-200 dark:border-zinc-800">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-800 text-white font-semibold text-xs dark:bg-zinc-700">
              SV
            </div>
            <div className="hidden xl:block text-left text-xs leading-tight">
              <div className="font-semibold text-stone-900 dark:text-zinc-100">Sam Vance</div>
              <div className="text-[10px] text-stone-500 dark:text-zinc-400">154 Units Owner</div>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <RecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
      />
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </>
  );
};
