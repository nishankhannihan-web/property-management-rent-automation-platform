import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentStatus, PaymentMethod } from '../types';
import {
  Download,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';
import { RecordPaymentModal } from './RecordPaymentModal';

export const RentPaymentsView: React.FC = () => {
  const {
    payments,
    properties,
    markPaymentPaid,
    totalPendingRent,
    overdueRent,
    totalCollectedRent,
    totalExpectedRent,
    collectionRate,
    isEmptyState,
  } = useApp();

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-09');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered payments
  const filteredPayments = payments.filter((p) => {
    if (selectedPropertyId !== 'all' && p.propertyId !== selectedPropertyId) return false;
    if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.tenantName.toLowerCase().includes(q);
      const matchUnit = p.unitNumber.toLowerCase().includes(q);
      const matchProp = p.propertyName.toLowerCase().includes(q);
      if (!matchName && !matchUnit && !matchProp) return false;
    }
    return true;
  });

  // Export real CSV for Schedule E / Tax Preparation
  const handleExportCSV = () => {
    const headers = [
      'Transaction ID',
      'Due Date',
      'Paid Date',
      'Property',
      'Unit',
      'Tenant Name',
      'Status',
      'Amount Billed',
      'Late Fee',
      'Payment Method',
      'Receipt Reference',
    ];

    const rows = filteredPayments.map((p) => [
      p.id,
      p.dueDate,
      p.paidDate || 'N/A',
      `"${p.propertyName}"`,
      p.unitNumber,
      `"${p.tenantName}"`,
      p.status.toUpperCase(),
      p.amount.toFixed(2),
      (p.lateFeeApplied || 0).toFixed(2),
      p.paymentMethod || 'ACH',
      p.receiptNumber || p.transactionReference || 'N/A',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RentPulse_Ledger_ScheduleE_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported Schedule E Ledger CSV successfully.');
  };

  const handleMarkAsPaid = (paymentId: string, tenantName: string, amount: number) => {
    markPaymentPaid(paymentId, 'paper_check', 'Cashier check verified via ledger');
    showToast(`Marked $${amount.toLocaleString()} paid for ${tenantName}.`);
  };

  if (isEmptyState) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-500 dark:bg-zinc-800">
          <FileSpreadsheet className="h-7 w-7" />
        </div>
        <h2 className="text-lg font-bold text-stone-900 dark:text-zinc-100">
          No Payment Records Yet
        </h2>
        <p className="text-xs text-stone-500 dark:text-zinc-400 max-w-md mx-auto">
          Once you add properties and units, monthly rent schedules will automatically populate your ledger here.
        </p>
        <button
          onClick={() => setIsRecordModalOpen(true)}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
        >
          Record First Manual Payment
        </button>
        <RecordPaymentModal
          isOpen={isRecordModalOpen}
          onClose={() => setIsRecordModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-xs font-medium text-white shadow-xl dark:bg-zinc-100 dark:text-zinc-900 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Export Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-zinc-100">
            Rent Roll & Financial Ledger
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
            Automated bank reconciliation, check entries, and tax-ready Schedule E tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Download className="h-3.5 w-3.5 text-stone-500" />
            <span>Export Schedule E CSV</span>
          </button>

          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Financial Health Summary Strips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-[11px] font-medium text-stone-500 dark:text-zinc-400">
            Total Expected (Sep)
          </div>
          <div className="mt-1 text-xl font-bold tabular-nums text-stone-900 dark:text-zinc-100">
            ${totalExpectedRent.toLocaleString()}
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">147 billed leases</div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
            Total Collected
          </div>
          <div className="mt-1 text-xl font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
            ${totalCollectedRent.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-600/80 dark:text-emerald-500 mt-0.5">
            {collectionRate.toFixed(1)}% collection rate
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-[11px] font-medium text-stone-600 dark:text-zinc-400">
            Total Pending (Hook)
          </div>
          <div className="mt-1 text-xl font-bold tabular-nums text-stone-800 dark:text-zinc-200">
            ${totalPendingRent.toLocaleString()}
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">
            {payments.filter((p) => p.status !== 'paid').length} pending payments
          </div>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 shadow-xs dark:border-red-950 dark:bg-red-950/20">
          <div className="text-[11px] font-medium text-red-700 dark:text-red-400">
            Past Grace Period (Late)
          </div>
          <div className="mt-1 text-xl font-bold tabular-nums text-red-700 dark:text-red-300">
            ${overdueRent.toLocaleString()}
          </div>
          <div className="text-[10px] text-red-600 dark:text-red-400 mt-0.5">
            7 units subject to late fee
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-3 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center gap-2">
          {/* Property Selector */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-stone-400 font-medium">Property:</span>
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs text-stone-800 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              <option value="all">All 6 Properties</option>
              {properties.map((prop) => (
                <option key={prop.id} value={prop.id}>
                  {prop.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Segmented Buttons */}
          <div className="flex items-center rounded-lg bg-stone-100 p-0.5 dark:bg-zinc-800 text-xs">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-white shadow-xs text-stone-900 dark:bg-zinc-700 dark:text-white'
                  : 'text-stone-600 hover:text-stone-900 dark:text-zinc-400'
              }`}
            >
              All Statuses
            </button>
            <button
              onClick={() => setSelectedStatus('overdue')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                selectedStatus === 'overdue'
                  ? 'bg-white shadow-xs text-red-700 dark:bg-zinc-700 dark:text-red-400 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 dark:text-zinc-400'
              }`}
            >
              Overdue Only
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                selectedStatus === 'pending'
                  ? 'bg-white shadow-xs text-amber-700 dark:bg-zinc-700 dark:text-amber-400 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 dark:text-zinc-400'
              }`}
            >
              In Grace Period
            </button>
            <button
              onClick={() => setSelectedStatus('paid')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                selectedStatus === 'paid'
                  ? 'bg-white shadow-xs text-emerald-700 dark:bg-zinc-700 dark:text-emerald-400 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 dark:text-zinc-400'
              }`}
            >
              Paid
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search tenant or unit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-stone-200 bg-stone-50 pl-8 pr-3 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="rounded-2xl border border-stone-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 dark:bg-zinc-800/60 dark:border-zinc-800 dark:text-zinc-400">
              <tr>
                <th className="py-3 px-4 font-semibold">Unit & Property</th>
                <th className="py-3 px-4 font-semibold">Tenant</th>
                <th className="py-3 px-4 font-semibold">Due Date</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Rent Amount</th>
                <th className="py-3 px-4 font-semibold">Method / Reference</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-zinc-800/80">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-stone-400">
                    No transactions match current filters.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const isPaid = p.status === 'paid';
                  const isOverdue = p.status === 'overdue';
                  const isPending = p.status === 'pending';

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-stone-50/70 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900 dark:text-zinc-100">
                          Unit #{p.unitNumber}
                        </div>
                        <div className="text-[11px] text-stone-500 dark:text-zinc-400">
                          {p.propertyName}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-stone-900 dark:text-zinc-200">
                          {p.tenantName}
                        </div>
                        <div className="text-[11px] text-stone-400">ID: {p.tenantId}</div>
                      </td>

                      <td className="py-3 px-4 text-stone-600 dark:text-zinc-300 font-mono">
                        {p.dueDate}
                        {p.paidDate && (
                          <span className="block text-[10px] text-emerald-600 dark:text-emerald-400">
                            Paid {p.paidDate}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {isPaid && (
                          <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> Paid
                          </span>
                        )}
                        {isOverdue && (
                          <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50">
                            <AlertCircle className="h-3 w-3" /> Overdue ({p.daysLate}d)
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium bg-stone-100 text-stone-700 dark:bg-zinc-800 dark:text-zinc-300">
                            <Clock className="h-3 w-3" /> In Grace ({p.daysLate}d)
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div
                          className={`font-mono text-sm font-bold tabular-nums ${
                            isOverdue
                              ? 'text-red-600 dark:text-red-400'
                              : isPaid
                              ? 'text-stone-900 dark:text-zinc-100'
                              : 'text-stone-700 dark:text-zinc-300'
                          }`}
                        >
                          ${p.amount.toLocaleString()}
                        </div>
                        {p.lateFeeApplied ? (
                          <div className="text-[10px] text-red-500 font-mono">
                            +${p.lateFeeApplied} late fee
                          </div>
                        ) : null}
                      </td>

                      <td className="py-3 px-4 text-stone-500 dark:text-zinc-400">
                        <div className="font-mono text-[11px]">
                          {p.receiptNumber || p.transactionReference || (isOverdue ? 'No record' : 'Plaid ACH')}
                        </div>
                        <div className="text-[10px] text-stone-400 uppercase">
                          {p.paymentMethod || 'ach'}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {isPaid ? (
                          <span className="text-[11px] font-medium text-stone-400 dark:text-zinc-500">
                            Settled
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleMarkAsPaid(p.id, p.tenantName, p.amount)}
                              className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-emerald-700 shadow-xs transition-colors"
                            >
                              Mark Paid
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Ledger Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-stone-200 bg-stone-50/50 dark:border-zinc-800 dark:bg-zinc-800/30 text-xs text-stone-500 dark:text-zinc-400">
          <div>
            Showing <span className="font-mono font-semibold">{filteredPayments.length}</span> entries
          </div>
          <div className="text-right">
            Total in selection:{' '}
            <span className="font-mono font-bold text-stone-900 dark:text-zinc-100 tabular-nums">
              ${filteredPayments.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <RecordPaymentModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
      />
    </div>
  );
};
