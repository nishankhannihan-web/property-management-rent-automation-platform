import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Tenant } from '../types';
import { X, Send, AlertTriangle, CheckCircle, MessageSquare, Mail } from 'lucide-react';

interface SendReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant?: Tenant;
  isBulk?: boolean;
}

export const SendReminderModal: React.FC<SendReminderModalProps> = ({
  isOpen,
  onClose,
  tenant,
  isBulk = false,
}) => {
  const {
    tenants,
    sendBulkRemindersToOverdue,
    sendSingleReminder,
    overdueRent,
    overdueTenantsCount,
  } = useApp();

  const [channel, setChannel] = useState<'sms' | 'email' | 'both'>('both');
  const [customMessage, setCustomMessage] = useState(
    tenant
      ? `Hi ${tenant.name}, this is a courtesy notice regarding your balance of $${tenant.balanceDue.toLocaleString()} for Unit ${tenant.unitNumber}. Please submit payment via your tenant portal: https://rentpulse.co/pay/${tenant.unitNumber.toLowerCase()} or reach out if you need assistance.`
      : `Friendly reminder that rent balance is past due. Please settle online or contact property management.`
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [resultSummary, setResultSummary] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    if (isBulk) {
      const res = sendBulkRemindersToOverdue();
      setResultSummary(
        `Dispatched SMS & Email notices to ${res.count} overdue tenants representing $${res.totalAmount.toLocaleString()} in pending rent.`
      );
    } else if (tenant) {
      sendSingleReminder(tenant.id, 'Direct Follow-Up Notice', customMessage);
      setResultSummary(`Sent reminder notice directly to ${tenant.name} (${tenant.phone}).`);
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-xl border border-stone-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-zinc-100">
              {isBulk ? 'Dispatch Bulk Late-Rent Reminders' : `Send Reminder to ${tenant?.name}`}
            </h3>
            <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
              {isBulk
                ? `Targets all ${overdueTenantsCount} overdue units ($${overdueRent.toLocaleString()} pending)`
                : `Unit #${tenant?.unitNumber} · Balance Due: $${tenant?.balanceDue.toLocaleString()}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-10 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-emerald-600 dark:text-emerald-400" />
            <p className="mt-3 text-sm font-semibold text-stone-900 dark:text-zinc-100">
              Dispatched Successfully
            </p>
            <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
              {resultSummary}
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {/* Delivery Channel selector */}
            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-zinc-300 mb-1.5">
                Delivery Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('both')}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-colors ${
                    channel === 'both'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600 dark:border-zinc-700 dark:text-zinc-400'
                  }`}
                >
                  <Send className="h-3.5 w-3.5" />
                  SMS & Email
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('sms')}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-colors ${
                    channel === 'sms'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600 dark:border-zinc-700 dark:text-zinc-400'
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  SMS Only
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('email')}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-colors ${
                    channel === 'email'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600 dark:border-zinc-700 dark:text-zinc-400'
                  }`}
                >
                  <Mail className="h-3.5 w-3.5" />
                  Email Only
                </button>
              </div>
            </div>

            {/* Message Preview */}
            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-zinc-300 mb-1">
                {isBulk ? 'Standard Notice Body (Merge Tags Applied)' : 'Message Preview'}
              </label>
              <textarea
                rows={4}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-stone-50 p-3 text-xs text-stone-800 focus:border-indigo-600 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              />
              <p className="mt-1 text-[11px] text-stone-400">
                Variables like <code>{`{{tenant_name}}`}</code>, <code>{`{{balance_due}}`}</code>, and <code>{`{{payment_link}}`}</code> are automatically inserted per recipient.
              </p>
            </div>

            {/* Compliance Callout */}
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div className="text-xs leading-relaxed">
                <span className="font-semibold">Texas Prop Code § 92.019 Compliance:</span> Notices include statutory grace period notice and itemized late fees. Dispatches are permanently recorded in the dispute-proof audit log.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSend}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700 transition-colors shadow-xs"
              >
                <Send className="h-3.5 w-3.5" />
                {isBulk ? `Send to All ${overdueTenantsCount} Overdue Tenants` : 'Send Direct Reminder'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
