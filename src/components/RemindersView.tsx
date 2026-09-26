import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ReminderRule } from '../types';
import {
  BellRing,
  Plus,
  Send,
  MessageSquare,
  Mail,
  Smartphone,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Edit2,
  Trash2,
  ChevronDown,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { SendReminderModal } from './SendReminderModal';

export const RemindersView: React.FC = () => {
  const {
    reminderRules,
    deliveryLogs,
    toggleReminderRule,
    updateReminderRule,
    addReminderRule,
    deleteReminderRule,
    overdueTenantsCount,
    sendBulkRemindersToOverdue,
    selectedStateCode,
    isEmptyState,
  } = useApp();

  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ReminderRule | null>(null);
  const [isNewRuleModalOpen, setIsNewRuleModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggle = (id: string, name: string) => {
    toggleReminderRule(id);
    showToast(`Toggled automation rule: "${name}".`);
  };

  const handleBulkDispatch = () => {
    const res = sendBulkRemindersToOverdue();
    showToast(`Dispatched reminders to ${res.count} overdue tenants.`);
  };

  if (isEmptyState) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
          <BellRing className="h-7 w-7" />
        </div>
        <h2 className="text-lg font-bold text-stone-900 dark:text-zinc-100">
          No Reminder Automation Rules Configured
        </h2>
        <p className="text-xs text-stone-500 dark:text-zinc-400 max-w-md mx-auto">
          Set up automated rules to text and email tenants before rent is due, at grace period expiration, and when late fees apply.
        </p>
        <button
          onClick={() => setIsNewRuleModalOpen(true)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 shadow-xs"
        >
          Configure First Automated Rule
        </button>
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

      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-zinc-100">
              Automated Late-Rent Reminders
            </h1>
            <span className="rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 px-2 py-0.5 text-[11px] font-mono font-semibold">
              Core Differentiator
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
            Set it and forget it. RentPulse automatically sequences SMS & Email reminders mapped to statutory grace periods.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleBulkDispatch}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 shadow-xs transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Dispatch Overdue Reminders ({overdueTenantsCount} Units)</span>
          </button>
        </div>
      </div>

      {/* Texas / State Statutory Safeguard Banner */}
      <div className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-stone-600 dark:text-zinc-300">
          <span className="font-semibold text-stone-900 dark:text-zinc-100">
            State Law Safeguard Active ({selectedStateCode} Profile):
          </span>{' '}
          Rules below respect your state's mandatory statutory grace period (Texas requires 2 full days after due date before late fees can be assessed). Delivery logs are permanently stored with exact timestamps to serve as proof of notice in eviction court proceedings.
        </div>
      </div>

      {/* Main Grid: Active Automation Rules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-900 dark:text-zinc-100">
            Active Reminder Rules ({reminderRules.filter((r) => r.enabled).length} Enabled)
          </h2>
          <div className="text-xs text-stone-400">
            Trigger order runs chronologically relative to the 1st of the month.
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {reminderRules.map((rule, idx) => {
            const isLateFeeNotice = rule.includeLateFeeNotice;

            return (
              <div
                key={rule.id}
                className={`rounded-2xl border bg-white p-5 shadow-xs transition-all dark:bg-zinc-900 ${
                  rule.enabled
                    ? 'border-stone-200 dark:border-zinc-800'
                    : 'border-stone-200/60 opacity-60 dark:border-zinc-800/60'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Rule info */}
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-stone-400">
                        Step 0{idx + 1}
                      </span>
                      <h3 className="text-sm font-bold text-stone-900 dark:text-zinc-100">
                        {rule.name}
                      </h3>
                      {rule.enabled ? (
                        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                          Active
                        </span>
                      ) : (
                        <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-500 dark:bg-zinc-800">
                          Paused
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-500 dark:text-zinc-400">
                      {rule.description}
                    </p>

                    {/* Trigger & Channel Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <div className="flex items-center gap-1 rounded bg-stone-100 px-2 py-1 text-[11px] font-medium text-stone-700 dark:bg-zinc-800 dark:text-zinc-300">
                        <Clock className="h-3 w-3 text-stone-400" />
                        <span>
                          {rule.triggerType === 'before_due'
                            ? `${rule.daysOffset} days before due date`
                            : rule.triggerType === 'on_due'
                            ? 'On due date (5:00 PM)'
                            : `${rule.daysOffset} days after due date`}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 rounded bg-stone-100 px-2 py-1 text-[11px] font-medium text-stone-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {rule.channels.includes('sms') && (
                          <span className="flex items-center gap-0.5">
                            <MessageSquare className="h-3 w-3 text-indigo-600" /> SMS
                          </span>
                        )}
                        {rule.channels.includes('email') && (
                          <span className="flex items-center gap-0.5 ml-1">
                            <Mail className="h-3 w-3 text-indigo-600" /> Email
                          </span>
                        )}
                        {rule.channels.includes('portal') && (
                          <span className="flex items-center gap-0.5 ml-1">
                            <Smartphone className="h-3 w-3 text-indigo-600" /> Portal
                          </span>
                        )}
                      </div>

                      {isLateFeeNotice && (
                        <div className="flex items-center gap-1 rounded bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                          <AlertTriangle className="h-3 w-3 text-amber-600" />
                          <span>Includes statutory late fee assessment notice</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Delivery stats & Controls */}
                  <div className="flex items-center gap-4 self-end lg:self-center border-t lg:border-t-0 pt-3 lg:pt-0 border-stone-100 dark:border-zinc-800">
                    <div className="text-right hidden sm:block">
                      <div className="text-[11px] text-stone-400">Delivery Performance</div>
                      <div className="font-mono text-xs font-semibold text-stone-800 dark:text-zinc-200">
                        {rule.deliveryStats.sent} sent · {rule.deliveryStats.openRate}% delivery
                      </div>
                      <div className="text-[10px] text-stone-400">
                        Last: {rule.deliveryStats.lastTriggered}
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggle(rule.id, rule.name)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        rule.enabled ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                          rule.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Template Preview Body */}
                <div className="mt-4 rounded-xl border border-stone-100 bg-stone-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-800/40 text-xs">
                  <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Message Template (SMS / Push Payload):
                  </div>
                  <p className="font-mono text-stone-700 dark:text-zinc-300 leading-relaxed text-[11px]">
                    "{rule.templateBody}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Tracking & Dispute-Proof Audit Trail */}
      <div className="rounded-2xl border border-stone-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 dark:border-zinc-800">
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-zinc-100">
              Live Reminder Delivery Tracker
            </h3>
            <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
              Carrier receipts, delivery confirmations, and dispute protection logs.
            </p>
          </div>
          <span className="text-[11px] font-mono text-stone-400">
            {deliveryLogs.length} logged dispatches
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 dark:bg-zinc-800/60 dark:border-zinc-800 dark:text-zinc-400">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Time</th>
                <th className="py-2.5 px-4 font-semibold">Recipient & Unit</th>
                <th className="py-2.5 px-4 font-semibold">Rule Triggered</th>
                <th className="py-2.5 px-4 font-semibold">Channel</th>
                <th className="py-2.5 px-4 font-semibold">Message Preview</th>
                <th className="py-2.5 px-4 font-semibold text-right">Carrier Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-zinc-800/80">
              {deliveryLogs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50/70 dark:hover:bg-zinc-800/30">
                  <td className="py-2.5 px-4 text-stone-500 font-mono text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-stone-900 dark:text-zinc-100">
                    {log.tenantName}
                    <span className="block text-[10px] text-stone-400 font-normal">
                      {log.unitNumber}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-stone-600 dark:text-zinc-300">
                    {log.ruleName}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-mono uppercase text-stone-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {log.channel === 'sms' ? <MessageSquare className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
                      {log.channel}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-stone-600 dark:text-zinc-400 max-w-xs truncate text-[11px]">
                    {log.snippet}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" /> Delivered
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SendReminderModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        isBulk={true}
      />
    </div>
  );
};
