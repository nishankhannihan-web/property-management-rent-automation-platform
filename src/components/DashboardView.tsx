import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertCircle,
  TrendingUp,
  Clock,
  Send,
  Building,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Plus,
  Wrench,
  DollarSign,
} from 'lucide-react';
import { SendReminderModal } from './SendReminderModal';
import { RecordPaymentModal } from './RecordPaymentModal';
import { OnboardingModal } from './OnboardingModal';
import { Tenant } from '../types';

export const DashboardView: React.FC = () => {
  const {
    totalPendingRent,
    overdueRent,
    inGracePeriodRent,
    totalCollectedRent,
    totalExpectedRent,
    collectionRate,
    occupancyRate,
    totalUnitsCount,
    occupiedUnitsCount,
    overdueTenantsCount,
    payments,
    tenants,
    messages,
    maintenanceRequests,
    markPaymentPaid,
    sendBulkRemindersToOverdue,
    isEmptyState,
    setActiveTab,
    resolveMaintenanceTicket,
    selectedStateCode,
  } = useApp();

  const [isBulkReminderOpen, setIsBulkReminderOpen] = useState(false);
  const [selectedTenantForReminder, setSelectedTenantForReminder] = useState<Tenant | undefined>(undefined);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [preselectedTenantId, setPreselectedTenantId] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Overdue payments list
  const overduePayments = payments.filter((p) => p.status === 'overdue');
  const pendingGracePayments = payments.filter((p) => p.status === 'pending');
  const urgentMaintenance = maintenanceRequests.find((m) => m.priority === 'urgent' && m.status !== 'resolved');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleQuickMarkPaid = (paymentId: string, tenantName: string, amount: number) => {
    markPaymentPaid(paymentId, 'ach');
    showToast(`Marked $${amount.toLocaleString()} paid for ${tenantName}. Pending total updated.`);
  };

  const handleSendAllOverdue = () => {
    const res = sendBulkRemindersToOverdue();
    showToast(`Dispatched reminders to ${res.count} overdue tenants ($${res.totalAmount.toLocaleString()}).`);
  };

  // If in EMPTY STATE
  if (isEmptyState) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        {/* Banner */}
        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <Building className="h-7 w-7" />
          </div>

          <div className="space-y-1.5 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-stone-900 dark:text-zinc-100">
              Welcome to RentPulse! Add your first property
            </h2>
            <p className="text-xs text-stone-500 dark:text-zinc-400 leading-relaxed">
              Designed for independent landlords managing 100–300 units. Eliminate spreadsheet chaos, get instant visibility on pending rent, and automate late payment follow-ups in minutes.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="flex items-center rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs transition-colors"
            >
              Start 3-Step Guided Setup
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs font-medium text-stone-700 hover:bg-stone-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              Import CSV Rent Roll
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs mb-1">
              01. The Live North Star Hook
            </div>
            <h3 className="font-semibold text-sm text-stone-900 dark:text-zinc-100">
              Instant Pending Rent Tracker
            </h3>
            <p className="mt-1 text-xs text-stone-500 dark:text-zinc-400">
              Know the exact dollar amount outstanding this month in under 3 seconds without pivot tables.
            </p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-indigo-600 dark:text-indigo-400 font-semibold text-xs mb-1">
              02. Unified Follow-Ups
            </div>
            <h3 className="font-semibold text-sm text-stone-900 dark:text-zinc-100">
              Automated Late-Rent Reminders
            </h3>
            <p className="mt-1 text-xs text-stone-500 dark:text-zinc-400">
              SMS and email reminders trigger automatically based on state statutory grace periods.
            </p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-stone-600 dark:text-zinc-400 font-semibold text-xs mb-1">
              03. Dispute-Proof Records
            </div>
            <h3 className="font-semibold text-sm text-stone-900 dark:text-zinc-100">
              Audit Trails & Tax Export
            </h3>
            <p className="mt-1 text-xs text-stone-500 dark:text-zinc-400">
              Full timestamped proof of notice delivery for eviction court compliance and Schedule E tax prep.
            </p>
          </div>
        </div>

        <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-xs font-medium text-white shadow-xl dark:bg-zinc-100 dark:text-zinc-900 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Critical Action Banner (e.g. Urgent Maintenance or State Grace Expiry) */}
      {urgentMaintenance && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50/80 p-3.5 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-200/80 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold">
                Urgent Maintenance Notice · {urgentMaintenance.propertyName} Unit #{urgentMaintenance.unitNumber}
              </div>
              <div className="text-xs text-amber-800 dark:text-amber-300">
                {urgentMaintenance.title} — {urgentMaintenance.description}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => {
                resolveMaintenanceTicket(urgentMaintenance.id);
                showToast(`Marked ticket #${urgentMaintenance.id} resolved.`);
              }}
              className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 transition-colors shadow-xs"
            >
              Mark Resolved
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className="text-xs text-amber-800 hover:underline dark:text-amber-300"
            >
              View Unit Details
            </button>
          </div>
        </div>
      )}

      {/* TOP ROW: THE HOOK CARD + SECONDARY HEALTH METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* THE HOOK CARD (Col 1-5, Top-Left visual prime real estate) */}
        <div className="lg:col-span-5 rounded-2xl border-2 border-emerald-600/30 bg-white p-6 shadow-sm dark:border-emerald-500/20 dark:bg-zinc-900 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none" />

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider dark:text-emerald-400">
                North Star Metric · September 2026
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-stone-500 dark:text-zinc-400">
                <Clock className="h-3 w-3 text-emerald-600" />
                Live Balance
              </span>
            </div>

            <div className="mt-2 text-xs font-medium text-stone-500 dark:text-zinc-400">
              Total Rent Pending This Month
            </div>

            {/* THE UNMISSABLE LIVE NUMBER */}
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums text-stone-900 dark:text-zinc-50">
                ${totalPendingRent.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-stone-500 dark:text-zinc-400">
                across {overdueTenantsCount + pendingGracePayments.length} units
              </span>
            </div>

            {/* Split breakdown: Overdue vs Grace Period */}
            <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-stone-100 dark:border-zinc-800 text-xs">
              <div className="rounded-lg bg-red-50/70 p-2.5 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40">
                <div className="text-[11px] font-medium text-red-700 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Past Grace Period (Late)
                </div>
                <div className="mt-1 text-base font-bold tabular-nums text-red-900 dark:text-red-200">
                  ${overdueRent.toLocaleString()}
                </div>
                <div className="text-[10px] text-red-600 dark:text-red-400">
                  {overdueTenantsCount} overdue units
                </div>
              </div>

              <div className="rounded-lg bg-stone-50 p-2.5 dark:bg-zinc-800/60 border border-stone-200/80 dark:border-zinc-700">
                <div className="text-[11px] font-medium text-stone-600 dark:text-zinc-300 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-stone-500" />
                  In Grace Period / ACH
                </div>
                <div className="mt-1 text-base font-bold tabular-nums text-stone-800 dark:text-zinc-100">
                  ${inGracePeriodRent.toLocaleString()}
                </div>
                <div className="text-[10px] text-stone-500 dark:text-zinc-400">
                  {pendingGracePayments.length} units processing
                </div>
              </div>
            </div>
          </div>

          {/* NEXT BEST ACTION BUTTON: 1-Click Reminder to All */}
          <div className="mt-5 pt-3">
            <button
              onClick={() => setIsBulkReminderOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-xs group"
            >
              <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              <span>Send 1-Click Reminder to All Overdue ({overdueTenantsCount} Tenants)</span>
            </button>
            <p className="mt-1.5 text-center text-[11px] text-stone-400 dark:text-zinc-500">
              Dispatches compliant SMS & email reminders with Texas § 92.019 statutory grace wording.
            </p>
          </div>
        </div>

        {/* SUPPORTING METRICS (Col 6-12) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Month Rent Collection Progress */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400">
                <span>September Rent Collected</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  {collectionRate.toFixed(1)}% on-time pace
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold tabular-nums text-stone-900 dark:text-zinc-100">
                ${totalCollectedRent.toLocaleString()}
              </div>
              <div className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                of ${totalExpectedRent.toLocaleString()} monthly gross expected
              </div>

              {/* Progress bar */}
              <div className="mt-4 h-2.5 w-full rounded-full bg-stone-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, collectionRate)}%` }}
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-stone-500">AutoPay Enabled:</span>
              <span className="font-semibold text-stone-800 dark:text-zinc-200 font-mono">
                128 / 154 units (83%)
              </span>
            </div>
          </div>

          {/* Card 2: Portfolio Occupancy Rate */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400">
                <span>Portfolio Occupancy</span>
                <span className="text-xs text-stone-600 dark:text-zinc-300 font-medium">6 Properties</span>
              </div>
              <div className="mt-2 text-2xl font-bold tabular-nums text-stone-900 dark:text-zinc-100">
                {occupancyRate.toFixed(1)}%
              </div>
              <div className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                {occupiedUnitsCount} of {totalUnitsCount} units occupied (7 vacant / turnover)
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-stone-600 dark:text-zinc-300">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                <span>147 Leased</span>
                <span className="inline-block h-2 w-2 rounded-full bg-amber-500 ml-2" />
                <span>4 Ready for Move-In</span>
                <span className="inline-block h-2 w-2 rounded-full bg-stone-400 ml-2" />
                <span>3 Make-Ready</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-stone-500">Vacancy Loss (Sep):</span>
              <span className="font-mono text-stone-800 dark:text-zinc-200 font-semibold">$11,550</span>
            </div>
          </div>

          {/* Card 3: Upcoming Lease Renewals */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-stone-400" />
                  Lease Expirations (60 Days)
                </span>
                <span className="text-[11px] font-mono text-amber-700 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                  2 Expiring this Month
                </span>
              </div>

              <div className="mt-2 text-2xl font-bold tabular-nums text-stone-900 dark:text-zinc-100">
                8 Units
              </div>
              <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                Rachel Gallagher (Unit #105, Highland) ends Sep 30.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-zinc-800">
              <button
                onClick={() => setActiveTab('tenants')}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Review Renewal Offers <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4: Open Maintenance & Communications */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Wrench className="h-3.5 w-3.5 text-stone-400" />
                  Service Requests
                </span>
                <span className="text-[11px] font-mono text-red-600 dark:text-red-400 font-semibold">
                  1 Urgent Leak
                </span>
              </div>

              <div className="mt-2 text-2xl font-bold tabular-nums text-stone-900 dark:text-zinc-100">
                4 Active Tickets
              </div>
              <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                Plumbing (1), HVAC (1), Appliance (1), Access (1)
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-between">
              <button
                onClick={() => setActiveTab('messages')}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Open Unified Inbox <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <span className="text-[11px] text-stone-400 font-mono">1 unread</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECOND ROW: OVERDUE TENANTS ACTION LEDGER + RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overdue Action Table (Col 1-8) */}
        <div className="lg:col-span-8 rounded-2xl border border-stone-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-zinc-100">
                Overdue Rent Queue ({overduePayments.length} Units)
              </h3>
              <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                Tenants past state grace period requiring proactive follow-up.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('payments')}
                className="text-xs text-stone-600 hover:text-stone-900 font-medium dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                View Full Ledger →
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 dark:bg-zinc-800/50 dark:border-zinc-800 dark:text-zinc-400">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Tenant & Unit</th>
                  <th className="py-2.5 px-4 font-medium">Property</th>
                  <th className="py-2.5 px-4 font-medium text-right">Amount Past Due</th>
                  <th className="py-2.5 px-4 font-medium text-center">Days Late</th>
                  <th className="py-2.5 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-zinc-800/80">
                {overduePayments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-stone-400">
                      All rents for September are current! Zero overdue accounts.
                    </td>
                  </tr>
                ) : (
                  overduePayments.map((p) => {
                    const tenant = tenants.find((t) => t.id === p.tenantId);
                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-stone-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="font-semibold text-stone-900 dark:text-zinc-100">
                            {p.tenantName}
                          </div>
                          <div className="text-[11px] text-stone-500 dark:text-zinc-400">
                            Unit #{p.unitNumber} · {tenant?.phone || 'No phone'}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-stone-600 dark:text-zinc-400">
                          {p.propertyName}
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-bold text-red-600 dark:text-red-400">
                          ${p.amount.toLocaleString()}
                          {p.lateFeeApplied ? (
                            <span className="block text-[10px] text-stone-400 font-normal">
                              incl. ${p.lateFeeApplied} late fee
                            </span>
                          ) : null}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/40">
                            {p.daysLate}d late
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedTenantForReminder(tenant);
                                setIsBulkReminderOpen(false);
                              }}
                              className="rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-medium text-stone-700 hover:bg-stone-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                              title="Send SMS / Email Reminder"
                            >
                              Send SMS
                            </button>
                            <button
                              onClick={() => handleQuickMarkPaid(p.id, p.tenantName, p.amount)}
                              className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-emerald-700 shadow-xs"
                              title="Mark as Paid"
                            >
                              Mark Paid
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Communication & Audit Trail (Col 9-12) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Inbox Feed */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 dark:text-zinc-100">
                <MessageSquare className="h-4 w-4 text-emerald-600" />
                Recent Tenant Messages
              </div>
              <button
                onClick={() => setActiveTab('messages')}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Inbox ({messages.length})
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {messages.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  onClick={() => setActiveTab('messages')}
                  className="cursor-pointer rounded-lg p-2.5 hover:bg-stone-50 dark:hover:bg-zinc-800/60 transition-colors border border-transparent hover:border-stone-200 dark:hover:border-zinc-700"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-900 dark:text-zinc-100">
                    <span className="truncate">{m.tenantName} ({m.unitNumber})</span>
                    <span className="text-[10px] text-stone-400 font-mono font-normal">
                      {m.timestamp}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-stone-600 dark:text-zinc-400 leading-normal">
                    {m.content}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 text-[10px] text-stone-400">
                    <span className="uppercase font-mono">{m.channel}</span>
                    <span>·</span>
                    <span className={m.read ? 'text-stone-400' : 'text-emerald-600 font-semibold'}>
                      {m.read ? 'Read' : 'New Reply'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Legal & Statutory Notes for Texas */}
          <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 text-xs text-stone-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-stone-800 dark:text-zinc-200 text-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              State Law Safeguard: Texas § 92.019
            </div>
            <p className="text-[11px] leading-relaxed text-stone-500 dark:text-zinc-400">
              Grace period requires 2 full days after due date before charging late fees (limited to 8% for 5+ unit properties). RentPulse handles this automatically so your notices remain 100% admissible in court.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SendReminderModal
        isOpen={isBulkReminderOpen}
        onClose={() => setIsBulkReminderOpen(false)}
        isBulk={true}
      />

      {selectedTenantForReminder && (
        <SendReminderModal
          isOpen={!!selectedTenantForReminder}
          onClose={() => setSelectedTenantForReminder(undefined)}
          tenant={selectedTenantForReminder}
          isBulk={false}
        />
      )}

      <RecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        preselectedTenantId={preselectedTenantId}
      />
    </div>
  );
};
