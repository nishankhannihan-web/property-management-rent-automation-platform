import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Tenant } from '../types';
import {
  Search,
  Filter,
  Users,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Send,
  Plus,
  X,
  FileText,
} from 'lucide-react';
import { SendReminderModal } from './SendReminderModal';
import { RecordPaymentModal } from './RecordPaymentModal';

export const TenantsView: React.FC = () => {
  const { tenants, properties, payments, isEmptyState } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);

  const filteredTenants = tenants.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (propertyFilter !== 'all' && t.propertyId !== propertyFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchUnit = t.unitNumber.toLowerCase().includes(q);
      const matchPhone = t.phone.toLowerCase().includes(q);
      const matchEmail = t.email.toLowerCase().includes(q);
      if (!matchName && !matchUnit && !matchPhone && !matchEmail) return false;
    }
    return true;
  });

  if (isEmptyState) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-500 dark:bg-zinc-800">
          <Users className="h-7 w-7" />
        </div>
        <h2 className="text-lg font-bold text-stone-900 dark:text-zinc-100">
          No Tenants Added Yet
        </h2>
        <p className="text-xs text-stone-500 dark:text-zinc-400 max-w-md mx-auto">
          Add properties or import a spreadsheet rent roll to populate your tenant directory.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-zinc-100">
            Tenant Directory & Leases
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
            Active leases, contact profiles, auto-pay statuses, and payment reliability records.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-stone-500">
          <span>Total Active Leases:</span>
          <span className="font-mono font-bold text-stone-900 dark:text-zinc-100">
            {tenants.length} tenants
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-3 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status selector */}
          <div className="flex items-center rounded-lg bg-stone-100 p-0.5 dark:bg-zinc-800 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white shadow-xs text-stone-900 dark:bg-zinc-700 dark:text-white'
                  : 'text-stone-600 hover:text-stone-900 dark:text-zinc-400'
              }`}
            >
              All Tenants
            </button>
            <button
              onClick={() => setStatusFilter('late')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                statusFilter === 'late'
                  ? 'bg-white shadow-xs text-red-700 dark:bg-zinc-700 dark:text-red-400 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 dark:text-zinc-400'
              }`}
            >
              Past Due ({tenants.filter((t) => t.status === 'late').length})
            </button>
            <button
              onClick={() => setStatusFilter('current')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                statusFilter === 'current'
                  ? 'bg-white shadow-xs text-emerald-700 dark:bg-zinc-700 dark:text-emerald-400 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 dark:text-zinc-400'
              }`}
            >
              Current
            </button>
          </div>

          {/* Property Dropdown */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-stone-400 font-medium">Property:</span>
            <select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs text-stone-800 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              <option value="all">All Properties</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search tenant name, phone, unit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-stone-200 bg-stone-50 pl-8 pr-3 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
      </div>

      {/* Tenants Table */}
      <div className="rounded-2xl border border-stone-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 dark:bg-zinc-800/60 dark:border-zinc-800 dark:text-zinc-400">
              <tr>
                <th className="py-3 px-4 font-semibold">Tenant Name</th>
                <th className="py-3 px-4 font-semibold">Unit & Property</th>
                <th className="py-3 px-4 font-semibold">Contact Info</th>
                <th className="py-3 px-4 font-semibold">Lease Term</th>
                <th className="py-3 px-4 font-semibold text-right">Monthly Rent</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-zinc-800/80">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-stone-400">
                    No tenants match your search filter.
                  </td>
                </tr>
              ) : (
                filteredTenants.map((t) => {
                  const prop = properties.find((p) => p.id === t.propertyId);
                  const isLate = t.status === 'late';

                  return (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTenant(t)}
                      className="cursor-pointer hover:bg-stone-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900 dark:text-zinc-100">
                          {t.name}
                        </div>
                        <div className="text-[11px] text-stone-400">
                          {t.autoPayEnabled ? (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              AutoPay Active
                            </span>
                          ) : (
                            <span className="text-stone-400">Manual Pay</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900 dark:text-zinc-100">
                          Unit #{t.unitNumber}
                        </div>
                        <div className="text-[11px] text-stone-500 dark:text-zinc-400 truncate max-w-xs">
                          {prop?.name}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-stone-600 dark:text-zinc-300">
                        <div className="font-mono text-[11px]">{t.phone}</div>
                        <div className="text-[11px] text-stone-400">{t.email}</div>
                      </td>

                      <td className="py-3 px-4 text-stone-600 dark:text-zinc-300 font-mono text-[11px]">
                        {t.leaseStartDate} → {t.leaseEndDate}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-stone-900 dark:text-zinc-100">
                        ${t.monthlyRent.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {isLate ? (
                          <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50">
                            <AlertCircle className="h-3 w-3" /> Late (${t.balanceDue})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> Current
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTenant(t);
                          }}
                          className="rounded-lg border border-stone-200 px-2.5 py-1 text-[11px] font-medium text-stone-700 hover:bg-stone-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tenant Details Slide-Over Drawer */}
      {selectedTenant && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white p-6 shadow-2xl dark:bg-zinc-900 border-l border-stone-200 dark:border-zinc-800 overflow-y-auto space-y-5 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-stone-200 dark:border-zinc-800">
              <div>
                <span className="text-[10px] font-mono uppercase text-stone-400">
                  Tenant Profile
                </span>
                <h3 className="text-lg font-bold text-stone-900 dark:text-zinc-100">
                  {selectedTenant.name}
                </h3>
                <p className="text-xs text-stone-500">
                  Unit #{selectedTenant.unitNumber} ·{' '}
                  {properties.find((p) => p.id === selectedTenant.propertyId)?.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedTenant(null)}
                className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Financial Status Summary */}
            <div
              className={`rounded-xl border p-4 ${
                selectedTenant.status === 'late'
                  ? 'border-red-200 bg-red-50/50 dark:border-red-950 dark:bg-red-950/20'
                  : 'border-stone-200 bg-stone-50 dark:border-zinc-800 dark:bg-zinc-800/40'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-stone-600 dark:text-zinc-300">Current Balance Due:</span>
                <span
                  className={`font-mono text-base font-bold ${
                    selectedTenant.status === 'late'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-stone-900 dark:text-zinc-100'
                  }`}
                >
                  ${selectedTenant.balanceDue.toLocaleString()}
                </span>
              </div>
              {selectedTenant.status === 'late' && (
                <div className="mt-1 text-[11px] text-red-600 dark:text-red-400">
                  {selectedTenant.daysLate} days past due date (Texas 2-day grace period exceeded)
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setIsReminderOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 shadow-xs"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send Reminder
                </button>
                <button
                  onClick={() => {
                    setIsRecordPaymentOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 shadow-xs"
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  Record Payment
                </button>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 text-xs">
              <h4 className="font-semibold text-stone-900 dark:text-zinc-100">
                Contact & Account Details
              </h4>
              <div className="grid grid-cols-2 gap-3 text-stone-600 dark:text-zinc-300">
                <div>
                  <span className="text-stone-400 block text-[10px]">Phone Number</span>
                  <span className="font-mono">{selectedTenant.phone}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Email Address</span>
                  <span className="truncate block">{selectedTenant.email}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Payment Method</span>
                  <span>{selectedTenant.paymentMethodOnFile}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">AutoPay Status</span>
                  <span>{selectedTenant.autoPayEnabled ? 'Enabled (ACH)' : 'Manual Pay'}</span>
                </div>
              </div>
            </div>

            {/* Lease Information */}
            <div className="space-y-3 text-xs pt-3 border-t border-stone-100 dark:border-zinc-800">
              <h4 className="font-semibold text-stone-900 dark:text-zinc-100">
                Lease Agreement
              </h4>
              <div className="grid grid-cols-2 gap-3 text-stone-600 dark:text-zinc-300">
                <div>
                  <span className="text-stone-400 block text-[10px]">Monthly Rent</span>
                  <span className="font-mono font-bold">${selectedTenant.monthlyRent}/mo</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Term</span>
                  <span className="font-mono">{selectedTenant.leaseStartDate} to {selectedTenant.leaseEndDate}</span>
                </div>
              </div>

              {selectedTenant.notes && (
                <div className="rounded-lg bg-stone-50 p-3 text-[11px] text-stone-600 dark:bg-zinc-800 dark:text-zinc-400 border border-stone-200 dark:border-zinc-700">
                  <span className="font-semibold block text-stone-800 dark:text-zinc-200 mb-0.5">
                    Landlord Notes:
                  </span>
                  {selectedTenant.notes}
                </div>
              )}
            </div>

            {/* Recent Payment History for Tenant */}
            <div className="space-y-3 text-xs pt-3 border-t border-stone-100 dark:border-zinc-800">
              <h4 className="font-semibold text-stone-900 dark:text-zinc-100">
                Payment History
              </h4>
              <div className="space-y-2">
                {payments
                  .filter((p) => p.tenantId === selectedTenant.id)
                  .map((pay) => (
                    <div
                      key={pay.id}
                      className="flex items-center justify-between rounded-lg border border-stone-200 p-2.5 dark:border-zinc-800 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-stone-900 dark:text-zinc-100">
                          {pay.dueDate} Rent
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {pay.status === 'paid' ? `Paid on ${pay.paidDate}` : `${pay.daysLate}d late`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold tabular-nums text-stone-900 dark:text-zinc-100">
                          ${pay.amount.toLocaleString()}
                        </div>
                        <span
                          className={`text-[10px] font-semibold ${
                            pay.status === 'paid'
                              ? 'text-emerald-600'
                              : 'text-red-600'
                          }`}
                        >
                          {pay.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedTenant && (
        <SendReminderModal
          isOpen={isReminderOpen}
          onClose={() => setIsReminderOpen(false)}
          tenant={selectedTenant}
        />
      )}

      {selectedTenant && (
        <RecordPaymentModal
          isOpen={isRecordPaymentOpen}
          onClose={() => setIsRecordPaymentOpen(false)}
          preselectedTenantId={selectedTenant.id}
        />
      )}
    </div>
  );
};
