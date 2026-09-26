import React from 'react';
import { useApp, NavTab } from '../context/AppContext';
import {
  LayoutDashboard,
  CreditCard,
  BellRing,
  Users,
  Building2,
  MessageSquare,
  BarChart3,
  Settings,
  Smartphone,
  Sun,
  Moon,
  Database,
  RotateCcw,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    userRole,
    setUserRole,
    themeMode,
    toggleTheme,
    paletteMode,
    togglePalette,
    isEmptyState,
    setIsEmptyState,
    overdueTenantsCount,
    messages,
    resetToDemoData,
  } = useApp();

  const unreadMessagesCount = messages.filter((m) => !m.read).length;

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string | number; badgeAlert?: boolean }[] = [
    {
      id: 'dashboard',
      label: 'Main Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      id: 'payments',
      label: 'Rent & Ledger',
      icon: <CreditCard className="h-4 w-4" />,
      badge: overdueTenantsCount > 0 ? `${overdueTenantsCount} Late` : undefined,
      badgeAlert: true,
    },
    {
      id: 'reminders',
      label: 'Automated Reminders',
      icon: <BellRing className="h-4 w-4" />,
      badge: 'Active',
    },
    {
      id: 'tenants',
      label: 'Tenants Directory',
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: 'properties',
      label: 'Properties & Units',
      icon: <Building2 className="h-4 w-4" />,
      badge: '6 Props',
    },
    {
      id: 'messages',
      label: 'Communication Hub',
      icon: <MessageSquare className="h-4 w-4" />,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      badgeAlert: true,
    },
    {
      id: 'reports',
      label: 'Financial Reports',
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      id: 'settings',
      label: 'Settings & Legal',
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <aside className="w-64 shrink-0 flex flex-col border-r border-stone-200 bg-[#FAFAF9] text-stone-900 transition-colors dark:border-zinc-800 dark:bg-[#18181B] dark:text-zinc-100 min-h-screen">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-stone-200 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm shadow-xs dark:bg-emerald-600">
            RP
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-stone-900 dark:text-zinc-100">
                RentPulse
              </span>
            </div>
            <div className="text-[11px] text-stone-500 dark:text-zinc-400">
              {isEmptyState ? '0 Units · New Account' : '154 Units · 6 Properties'}
            </div>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-2 pb-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider dark:text-zinc-500">
          Management
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-stone-200/80 text-stone-900 dark:bg-zinc-800 dark:text-white font-semibold'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className={isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400 dark:text-zinc-500'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    item.badgeAlert
                      ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 font-semibold'
                      : 'bg-stone-200/60 text-stone-600 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 px-2 pb-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider dark:text-zinc-500">
          Tenant Experience
        </div>

        <button
          onClick={() => setActiveTab('portal')}
          className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
            activeTab === 'portal'
              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-semibold'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60'
          }`}
        >
          <div className="flex items-center gap-2.5 truncate">
            <Smartphone className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Tenant Portal View</span>
          </div>
          <span className="text-[10px] text-stone-400 font-mono">Mobile</span>
        </button>
      </div>

      {/* Mode Switches & State Controls */}
      <div className="p-3 border-t border-stone-200 dark:border-zinc-800 space-y-2">
        {/* Role Selector */}
        <div className="rounded-lg bg-stone-100/80 p-2 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 dark:text-zinc-400 mb-1.5">
            <span>Role Context:</span>
            <span className="font-semibold text-stone-800 dark:text-zinc-200">
              {userRole === 'landlord' ? 'Owner / Landlord' : userRole === 'property_manager' ? 'Property Mgr' : 'Tenant'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[11px]">
            <button
              onClick={() => setUserRole('landlord')}
              className={`rounded px-1.5 py-1 text-center font-medium transition-colors ${
                userRole === 'landlord'
                  ? 'bg-white shadow-xs text-stone-900 dark:bg-zinc-800 dark:text-white'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-zinc-300'
              }`}
            >
              Landlord
            </button>
            <button
              onClick={() => setUserRole('property_manager')}
              className={`rounded px-1.5 py-1 text-center font-medium transition-colors ${
                userRole === 'property_manager'
                  ? 'bg-white shadow-xs text-stone-900 dark:bg-zinc-800 dark:text-white'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-zinc-300'
              }`}
            >
              Manager
            </button>
          </div>
        </div>

        {/* Empty State / Populated State Toggle */}
        <button
          onClick={() => setIsEmptyState(!isEmptyState)}
          className="w-full flex items-center justify-between rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs text-stone-600 hover:bg-stone-50 transition-colors dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <div className="flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5 text-stone-400" />
            <span className="text-[11px]">View Mode</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            {isEmptyState ? 'Empty State' : '154 Units Live'}
          </span>
        </button>

        {/* Theme and Palette Controls */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-100 text-[11px]"
          >
            {themeMode === 'light' ? (
              <>
                <Moon className="h-3.5 w-3.5" /> Dark Mode
              </>
            ) : (
              <>
                <Sun className="h-3.5 w-3.5" /> Light Mode
              </>
            )}
          </button>

          <button
            onClick={togglePalette}
            className="flex items-center text-[11px] text-stone-500 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            title="Toggle between Option A (Trust Emerald/Indigo) and Option B (Grounded Moss/Terracotta)"
          >
            <span>{paletteMode === 'optionA' ? 'Palette A' : 'Palette B'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
