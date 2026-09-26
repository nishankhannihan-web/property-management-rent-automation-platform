import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  ShieldCheck,
  CreditCard,
  Users,
  FileText,
  Lock,
  Download,
  CheckCircle2,
  Database,
  RefreshCw,
} from 'lucide-react';
import { STATE_COMPLIANCE_CONFIGS } from '../data/mockData';

export const SettingsView: React.FC = () => {
  const {
    auditLogs,
    selectedStateCode,
    setSelectedStateCode,
    userRole,
    setUserRole,
    resetToDemoData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'compliance' | 'audit' | 'payments' | 'team'>('compliance');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentCompliance = STATE_COMPLIANCE_CONFIGS[selectedStateCode] || STATE_COMPLIANCE_CONFIGS['TX'];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const exportAuditLogCSV = () => {
    const headers = ['Timestamp', 'Actor', 'Category', 'Action Taken', 'Details', 'System IP / Daemon'];
    const rows = auditLogs.map((log) => [
      `"${log.timestamp}"`,
      `"${log.actor}"`,
      log.category.toUpperCase(),
      `"${log.action}"`,
      `"${log.details.replace(/"/g, '""')}"`,
      log.ipAddress || 'System',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RentPulse_Dispute_Audit_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported dispute-proof audit log CSV.');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-xs font-medium text-white shadow-xl dark:bg-zinc-100 dark:text-zinc-900 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-zinc-100">
            Settings, State Compliance & Audit Logs
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
            US state statutory parameters, Plaid/Stripe payment security, and dispute-proof records.
          </p>
        </div>

        <button
          onClick={() => {
            resetToDemoData();
            showToast('Reset portfolio data to 154-unit demo.');
          }}
          className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <RefreshCw className="h-3.5 w-3.5 text-stone-400" />
          <span>Reset Demo Portfolio</span>
        </button>
      </div>

      {/* Sub-nav Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-zinc-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('compliance')}
          className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
            activeTab === 'compliance'
              ? 'bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'text-stone-600 hover:text-stone-900 dark:text-zinc-400'
          }`}
        >
          US State Law Compliance
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
            activeTab === 'audit'
              ? 'bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'text-stone-600 hover:text-stone-900 dark:text-zinc-400'
          }`}
        >
          Dispute-Proof Audit Trail ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
            activeTab === 'payments'
              ? 'bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'text-stone-600 hover:text-stone-900 dark:text-zinc-400'
          }`}
        >
          Bank & Gateway (Plaid/Stripe)
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
            activeTab === 'team'
              ? 'bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'text-stone-600 hover:text-stone-900 dark:text-zinc-400'
          }`}
        >
          Team & RBAC Permissions
        </button>
      </div>

      {/* Tab 1: State Law Compliance */}
      {activeTab === 'compliance' && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-zinc-100">
                  Select Governing US State Jurisdiction
                </h3>
                <p className="text-xs text-stone-500 dark:text-zinc-400">
                  Landlord-tenant laws vary heavily by state. RentPulse enforces legal grace periods and late fee ceilings automatically.
                </p>
              </div>

              <select
                value={selectedStateCode}
                onChange={(e) => {
                  setSelectedStateCode(e.target.value);
                  showToast(`Updated legal jurisdiction to ${e.target.value}.`);
                }}
                className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="TX">Texas (Tex. Prop. Code § 92.019)</option>
                <option value="CA">California (Cal. Civ. Code § 1950.5)</option>
                <option value="NY">New York (N.Y. Real Prop. Law § 238-a)</option>
                <option value="FL">Florida (Fla. Stat. § 83.56)</option>
              </select>
            </div>

            {/* Jurisdiction Parameters Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-stone-100 dark:border-zinc-800 text-xs">
              <div className="rounded-xl bg-stone-50 p-3.5 dark:bg-zinc-800/60">
                <span className="text-stone-400 block text-[10px]">Mandatory Grace Period</span>
                <span className="font-bold text-sm font-mono text-stone-900 dark:text-zinc-100">
                  {currentCompliance.mandatoryGracePeriodDays} Full Days
                </span>
                <p className="text-[11px] text-stone-500 mt-1">
                  Late fees cannot be legally assessed until after day {currentCompliance.mandatoryGracePeriodDays}.
                </p>
              </div>

              <div className="rounded-xl bg-stone-50 p-3.5 dark:bg-zinc-800/60">
                <span className="text-stone-400 block text-[10px]">Max Statutory Late Fee</span>
                <span className="font-bold text-sm font-mono text-stone-900 dark:text-zinc-100">
                  {currentCompliance.maxLateFeeType === 'flat'
                    ? `$${currentCompliance.maxLateFeeValue} Flat Cap`
                    : `${currentCompliance.maxLateFeeValue}% of Monthly Rent`}
                </span>
                <p className="text-[11px] text-stone-500 mt-1">
                  Enforced on all automated invoices to prevent illegal penalty disputes.
                </p>
              </div>

              <div className="rounded-xl bg-stone-50 p-3.5 dark:bg-zinc-800/60">
                <span className="text-stone-400 block text-[10px]">Statutory Reference</span>
                <span className="font-bold text-xs font-mono text-emerald-700 dark:text-emerald-400">
                  {currentCompliance.statutoryReference}
                </span>
                <p className="text-[11px] text-stone-500 mt-1">
                  Pre-configured legal citation inserted into demand letters.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Dispute-Proof Audit Trail */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-zinc-100">
                Dispute-Proof Immutable Audit Ledger
              </h3>
              <p className="text-xs text-stone-500 dark:text-zinc-400">
                Timestamped records of every payment, fee waiver, and reminder sent for justice of the peace / eviction court defense.
              </p>
            </div>
            <button
              onClick={exportAuditLogCSV}
              className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Audit Trail CSV</span>
            </button>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 dark:bg-zinc-800/60 dark:border-zinc-800 dark:text-zinc-400">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Timestamp</th>
                    <th className="py-2.5 px-4 font-semibold">Actor</th>
                    <th className="py-2.5 px-4 font-semibold">Category</th>
                    <th className="py-2.5 px-4 font-semibold">Action</th>
                    <th className="py-2.5 px-4 font-semibold">Details & Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-zinc-800/80">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50/70 dark:hover:bg-zinc-800/30">
                      <td className="py-3 px-4 font-mono text-[11px] text-stone-500">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-900 dark:text-zinc-100">
                        {log.actor}
                      </td>
                      <td className="py-3 px-4">
                        <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-mono uppercase text-stone-600 dark:bg-zinc-800 dark:text-zinc-300">
                          {log.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-stone-800 dark:text-zinc-200">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 text-stone-600 dark:text-zinc-400 text-[11px]">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Banking & Payment Gateway */}
      {activeTab === 'payments' && (
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-zinc-100">
                Payment Processor & Bank Integration (PCI-DSS Scoped)
              </h3>
              <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                Stripe Connect & Plaid tokenization. Zero credit card numbers or account routing secrets are touched by RentPulse.
              </p>
            </div>
            <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-mono font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
              Active / Healthy
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-stone-100 dark:border-zinc-800 text-xs">
            <div className="rounded-xl border border-stone-200 p-4 dark:border-zinc-800 space-y-2">
              <div className="font-semibold text-stone-900 dark:text-zinc-100">
                Operating Escrow Account
              </div>
              <p className="text-stone-500 text-[11px]">
                JPMorgan Chase NA ••••4892
              </p>
              <div className="text-[11px] text-emerald-600 font-mono">
                ACH Fee: $0.00 / capped at $5 · Next-day payout active
              </div>
            </div>

            <div className="rounded-xl border border-stone-200 p-4 dark:border-zinc-800 space-y-2">
              <div className="font-semibold text-stone-900 dark:text-zinc-100">
                Security Deposit Escrow Account
              </div>
              <p className="text-stone-500 text-[11px]">
                Frost Bank Escrow Trust ••••1102
              </p>
              <div className="text-[11px] text-stone-500 font-mono">
                Interest-bearing trust compliant with Texas Property Code § 92.103
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Team & Roles */}
      {activeTab === 'team' && (
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 dark:text-zinc-100">
              Team Members & Scoped Access
            </h3>
            <span className="text-xs text-stone-400">3 Team Seats Used</span>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-zinc-800 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-stone-900 dark:text-zinc-100">Sam Vance (You)</span>
                <span className="block text-[11px] text-stone-400">sam@vanceproperties.com</span>
              </div>
              <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-700 dark:bg-zinc-800 dark:text-zinc-300">
                Owner / Landlord (Full Access)
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-stone-900 dark:text-zinc-100">Morgan Keller</span>
                <span className="block text-[11px] text-stone-400">morgan@vanceproperties.com</span>
              </div>
              <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-700 dark:bg-zinc-800 dark:text-zinc-300">
                Property Manager (No Bank Edits)
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-stone-900 dark:text-zinc-100">Hector Ruiz</span>
                <span className="block text-[11px] text-stone-400">hector.maint@gmail.com</span>
              </div>
              <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-700 dark:bg-zinc-800 dark:text-zinc-300">
                Maintenance Tech (Tickets Only)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
