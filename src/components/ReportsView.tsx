import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  Download,
  DollarSign,
  TrendingUp,
  Percent,
  Calendar,
  FileSpreadsheet,
  ShieldCheck,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    totalExpectedRent,
    totalCollectedRent,
    totalPendingRent,
    overdueRent,
    collectionRate,
    occupancyRate,
    totalUnitsCount,
    occupiedUnitsCount,
    isEmptyState,
  } = useApp();

  const handleExportScheduleE = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Tax Year,2026',
        'Entity,Vance Property Holdings LLC',
        'Total Units,154',
        '',
        'Schedule E Line Item,Amount (USD)',
        'Line 3: Rents Received,' + totalCollectedRent,
        'Line 4: Royalties,0',
        'Line 5: Advertising,1850',
        'Line 6: Auto and Travel,1420',
        'Line 7: Cleaning and Maintenance,14800',
        'Line 8: Commissions,0',
        'Line 9: Insurance,18400',
        'Line 10: Legal and Other Professional Fees,2200',
        'Line 11: Management Fees,0',
        'Line 12: Mortgage Interest Paid to Banks,64500',
        'Line 13: Other Interest,0',
        'Line 14: Repairs,9200',
        'Line 15: Supplies,1100',
        'Line 16: Taxes,32400',
        'Line 17: Utilities,6800',
        'Line 18: Depreciation Expense,28500',
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RentPulse_Schedule_E_2026_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isEmptyState) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-500 dark:bg-zinc-800">
          <BarChart3 className="h-7 w-7" />
        </div>
        <h2 className="text-lg font-bold text-stone-900 dark:text-zinc-100">
          No Financial Reports Available
        </h2>
        <p className="text-xs text-stone-500 dark:text-zinc-400 max-w-md mx-auto">
          Add properties to generate monthly cash flow statements, late payment trend analytics, and Schedule E tax exports.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-zinc-100">
            Financial & Tax Reports
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
            Cash flow performance, historical collection pacing, and CPA-ready Schedule E breakdowns.
          </p>
        </div>

        <button
          onClick={handleExportScheduleE}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Download Schedule E Tax CSV</span>
        </button>
      </div>

      {/* Cash Flow Statement Card */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900 dark:text-zinc-100">
            Monthly Cash Flow Statement · September 2026
          </h3>
          <span className="text-xs text-stone-400 font-mono">154 Units Total</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="rounded-xl bg-stone-50 p-3.5 dark:bg-zinc-800/50">
            <span className="text-[11px] text-stone-500 dark:text-zinc-400">
              Gross Scheduled Rent
            </span>
            <div className="mt-1 text-lg font-bold font-mono text-stone-900 dark:text-zinc-100">
              ${totalExpectedRent.toLocaleString()}
            </div>
            <span className="text-[10px] text-stone-400">100% potential</span>
          </div>

          <div className="rounded-xl bg-stone-50 p-3.5 dark:bg-zinc-800/50">
            <span className="text-[11px] text-stone-500 dark:text-zinc-400">
              Vacancy Loss (7 units)
            </span>
            <div className="mt-1 text-lg font-bold font-mono text-amber-700 dark:text-amber-400">
              -$11,550
            </div>
            <span className="text-[10px] text-stone-400">4.5% vacancy rate</span>
          </div>

          <div className="rounded-xl bg-emerald-50/60 p-3.5 dark:bg-emerald-950/20">
            <span className="text-[11px] text-emerald-800 dark:text-emerald-300">
              Net Collected Rent
            </span>
            <div className="mt-1 text-lg font-bold font-mono text-emerald-700 dark:text-emerald-400">
              ${totalCollectedRent.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-600">
              {collectionRate.toFixed(1)}% collected on-time
            </span>
          </div>

          <div className="rounded-xl bg-red-50/60 p-3.5 dark:bg-red-950/20">
            <span className="text-[11px] text-red-800 dark:text-red-300">
              Outstanding Pending
            </span>
            <div className="mt-1 text-lg font-bold font-mono text-red-700 dark:text-red-400">
              ${totalPendingRent.toLocaleString()}
            </div>
            <span className="text-[10px] text-red-600">
              ${overdueRent.toLocaleString()} overdue
            </span>
          </div>
        </div>
      </div>

      {/* 12-Month Collection Efficiency Pacing Graph */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-zinc-100">
              Collection Pacing by Day of Month
            </h3>
            <p className="text-xs text-stone-500 dark:text-zinc-400">
              Demonstrates effectiveness of RentPulse automated reminders compared to previous manual follow-ups.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 inline-block" />
              With RentPulse (Current)
            </span>
            <span className="flex items-center gap-1.5 text-stone-400">
              <span className="h-2.5 w-2.5 rounded-full bg-stone-300 inline-block" />
              Old Spreadsheet Pacing
            </span>
          </div>
        </div>

        {/* Visualized Pacing Bars */}
        <div className="space-y-3 pt-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-stone-700 dark:text-zinc-300">
                Day 1 (Due Date - AutoPay Trigger)
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                83% Collected ($228,000)
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-stone-100 dark:bg-zinc-800 overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: '83%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-stone-700 dark:text-zinc-300">
                Day 3 (Grace Period Warning Dispatched)
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                88.5% Collected ($243,300)
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-stone-100 dark:bg-zinc-800 overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: '88.5%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-stone-700 dark:text-zinc-300">
                Day 5 (Late Fee Assessment + Legal Notice)
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                96% Target ($263,000)
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-stone-100 dark:bg-zinc-800 overflow-hidden">
              <div className="h-full bg-emerald-600/70 rounded-full" style={{ width: '96%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
