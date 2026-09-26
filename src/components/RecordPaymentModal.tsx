import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';
import { X, CheckCircle, DollarSign, Receipt } from 'lucide-react';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTenantId?: string;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  preselectedTenantId,
}) => {
  const { tenants, recordManualPayment } = useApp();

  const [tenantId, setTenantId] = useState(preselectedTenantId || (tenants[0]?.id ?? ''));
  const [amount, setAmount] = useState<number>(() => {
    const t = tenants.find((item) => item.id === (preselectedTenantId || tenants[0]?.id));
    return t ? t.balanceDue || t.monthlyRent : 1650;
  });
  const [method, setMethod] = useState<PaymentMethod>('paper_check');
  const [receiptNumber, setReceiptNumber] = useState(`REC-${Date.now().toString().slice(-6)}`);
  const [note, setNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTenantChange = (id: string) => {
    setTenantId(id);
    const selected = tenants.find((t) => t.id === id);
    if (selected) {
      setAmount(selected.balanceDue > 0 ? selected.balanceDue : selected.monthlyRent);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId || amount <= 0) return;

    recordManualPayment({
      tenantId,
      amount,
      method,
      receiptNumber,
      note,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-xl border border-stone-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-zinc-100">
              Record Manual Payment
            </h3>
            <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
              Logs check, cash, or Zelle receipts and updates the live pending rent total.
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
          <div className="py-12 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-emerald-600 dark:text-emerald-400" />
            <p className="mt-3 text-sm font-semibold text-stone-900 dark:text-zinc-100">
              Payment Recorded Successfully!
            </p>
            <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
              Receipt #{receiptNumber} logged to dispute-proof audit trail.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-zinc-300 mb-1">
                Select Tenant & Unit
              </label>
              <select
                value={tenantId}
                onChange={(e) => handleTenantChange(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — Unit #{t.unitNumber} ({t.status === 'late' ? `Past Due $${t.balanceDue}` : 'Current'})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-zinc-300 mb-1">
                  Amount Received ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                    className="w-full rounded-lg border border-stone-300 bg-white pl-8 pr-3 py-2 text-sm tabular-nums text-stone-900 focus:border-emerald-600 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-zinc-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  <option value="paper_check">Cashier Check / Paper Check</option>
                  <option value="zelle">Zelle / Direct Bank Wire</option>
                  <option value="ach">Offline ACH</option>
                  <option value="cash">Cash (Escrow Deposit)</option>
                  <option value="credit_card">Card Terminal / POS</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-zinc-300 mb-1">
                Receipt / Check Reference Number
              </label>
              <div className="relative">
                <Receipt className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  required
                  className="w-full rounded-lg border border-stone-300 bg-white pl-8 pr-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="e.g. CHK-88192 or ZELLE-REF-44"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-zinc-300 mb-1">
                Internal Note (Optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Deposited in Chase Operating account; late fee waived."
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
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
                type="submit"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                Confirm & Record Payment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
