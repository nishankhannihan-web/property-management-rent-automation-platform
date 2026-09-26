import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Smartphone,
  CreditCard,
  FileText,
  Wrench,
  MessageSquare,
  CheckCircle2,
  DollarSign,
  Send,
  Building,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export const TenantPortalView: React.FC = () => {
  const {
    tenants,
    payments,
    markPaymentPaid,
    sendMessageToTenant,
    messages,
  } = useApp();

  // Pick Elena Rostova (Unit 204, Highland Court) as the default tenant
  const tenant = tenants.find((t) => t.id === 't-1') || tenants[0];
  const pendingPayment = payments.find(
    (p) => p.tenantId === tenant?.id && p.status !== 'paid'
  );

  const [activeTab, setActiveTab] = useState<'pay' | 'lease' | 'maintenance' | 'messages'>('pay');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [maintenanceSubmitted, setMaintenanceSubmitted] = useState(false);
  const [maintTitle, setMaintTitle] = useState('');
  const [maintDesc, setMaintDesc] = useState('');
  const [maintCat, setMaintCat] = useState('Plumbing');
  const [msgInput, setMsgInput] = useState('');

  if (!tenant) {
    return (
      <div className="p-8 text-center text-stone-500">
        No active tenant to preview in the portal.
      </div>
    );
  }

  const handlePayNow = () => {
    if (pendingPayment) {
      markPaymentPaid(pendingPayment.id, 'ach', 'Paid online via Plaid ACH Tenant Portal');
      setPaymentSuccess(true);
      setTimeout(() => setPaymentSuccess(false), 4000);
    }
  };

  const handleSendTenantMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    sendMessageToTenant(tenant.id, msgInput, 'sms');
    setMsgInput('');
  };

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintTitle.trim()) return;
    setMaintenanceSubmitted(true);
    setTimeout(() => {
      setMaintenanceSubmitted(false);
      setMaintTitle('');
      setMaintDesc('');
    }, 3000);
  };

  const tenantMessages = messages.filter((m) => m.tenantId === tenant.id);

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5">
      {/* Mobile Frame Simulation Container */}
      <div className="rounded-3xl border border-stone-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        {/* Portal Header */}
        <div className="bg-stone-900 text-white p-5 dark:bg-zinc-950 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono tracking-wider uppercase text-stone-400">
                Tenant Portal
              </span>
            </div>
            <h2 className="text-base font-bold mt-1">{tenant.name}</h2>
            <p className="text-xs text-stone-400">
              Unit #{tenant.unitNumber} · Highland Court Apartments
            </p>
          </div>

          <div className="rounded-xl bg-stone-800/80 px-2.5 py-1 text-[11px] font-mono text-stone-300">
            Plaid Secure
          </div>
        </div>

        {/* Portal Navigation Bar */}
        <div className="flex items-center justify-around border-b border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-800/40 text-xs">
          <button
            onClick={() => setActiveTab('pay')}
            className={`py-3 px-3 font-semibold transition-colors flex items-center gap-1.5 border-b-2 ${
              activeTab === 'pay'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:text-zinc-400'
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>Pay Rent</span>
          </button>

          <button
            onClick={() => setActiveTab('lease')}
            className={`py-3 px-3 font-semibold transition-colors flex items-center gap-1.5 border-b-2 ${
              activeTab === 'lease'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:text-zinc-400'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>My Lease</span>
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={`py-3 px-3 font-semibold transition-colors flex items-center gap-1.5 border-b-2 ${
              activeTab === 'maintenance'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:text-zinc-400'
            }`}
          >
            <Wrench className="h-3.5 w-3.5" />
            <span>Repairs</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`py-3 px-3 font-semibold transition-colors flex items-center gap-1.5 border-b-2 ${
              activeTab === 'messages'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:text-zinc-400'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Messages</span>
          </button>
        </div>

        {/* Tab 1: Pay Rent */}
        {activeTab === 'pay' && (
          <div className="p-6 space-y-5">
            {paymentSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100">
                  Payment Submitted Successfully!
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Receipt #{`TXN-ACH-${Date.now().toString().slice(-6)}`} has been emailed to {tenant.email}. Your landlord dashboard has updated in real-time.
                </p>
              </div>
            ) : pendingPayment ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-red-200 bg-red-50/60 p-5 dark:border-red-950 dark:bg-red-950/20 text-center space-y-2">
                  <span className="text-[11px] font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider">
                    Past Due Rent Balance
                  </span>
                  <div className="text-3xl font-extrabold tabular-nums text-red-900 dark:text-red-200 font-mono">
                    ${pendingPayment.amount.toLocaleString()}
                  </div>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    September 2026 Rent · Due Sep 1 ({pendingPayment.daysLate} days past due)
                  </p>
                </div>

                <div className="rounded-xl border border-stone-200 p-4 dark:border-zinc-800 text-xs space-y-2">
                  <div className="flex justify-between text-stone-600 dark:text-zinc-300">
                    <span>Monthly Rent:</span>
                    <span className="font-mono font-semibold">${tenant.monthlyRent}</span>
                  </div>
                  {pendingPayment.lateFeeApplied ? (
                    <div className="flex justify-between text-red-600">
                      <span>Texas Statutory Late Fee:</span>
                      <span className="font-mono font-semibold">+${pendingPayment.lateFeeApplied}</span>
                    </div>
                  ) : null}
                  <div className="pt-2 border-t border-stone-100 dark:border-zinc-800 flex justify-between font-bold text-stone-900 dark:text-zinc-100">
                    <span>Total Outstanding:</span>
                    <span className="font-mono">${pendingPayment.amount}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-stone-50 p-3.5 border border-stone-200 dark:bg-zinc-800/60 dark:border-zinc-700 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-stone-500" />
                    <div>
                      <div className="font-semibold text-stone-900 dark:text-zinc-100">
                        {tenant.paymentMethodOnFile}
                      </div>
                      <div className="text-[10px] text-stone-400">Zero fee ACH bank transfer</div>
                    </div>
                  </div>
                  <span className="text-emerald-600 font-medium text-[11px]">Default</span>
                </div>

                <button
                  onClick={handlePayNow}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-700 shadow-md transition-colors"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Submit Payment of ${pendingPayment.amount.toLocaleString()}</span>
                </button>
              </div>
            ) : (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100">
                  You're all caught up!
                </h3>
                <p className="text-xs text-stone-500">
                  Zero balance due for September 2026. Next rent of ${tenant.monthlyRent} is due October 1st.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Lease */}
        {activeTab === 'lease' && (
          <div className="p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-stone-900 dark:text-zinc-100">
              Active Residential Lease Agreement
            </h3>
            <div className="rounded-xl border border-stone-200 p-4 dark:border-zinc-800 space-y-2.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Property:</span>
                <span className="font-semibold">Highland Court Apartments</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Unit:</span>
                <span className="font-mono font-semibold">#204</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Monthly Rent:</span>
                <span className="font-mono font-semibold">${tenant.monthlyRent}/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Term:</span>
                <span className="font-mono">{tenant.leaseStartDate} to {tenant.leaseEndDate}</span>
              </div>
            </div>

            <button
              onClick={() => alert('Downloaded PDF lease agreement copy.')}
              className="w-full rounded-xl border border-stone-300 py-2.5 font-semibold text-stone-700 hover:bg-stone-50 dark:border-zinc-700 dark:text-zinc-300"
            >
              Download Signed Lease Agreement (PDF)
            </button>
          </div>
        )}

        {/* Tab 3: Maintenance Request */}
        {activeTab === 'maintenance' && (
          <div className="p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-stone-900 dark:text-zinc-100">
              Submit Repair or Maintenance Ticket
            </h3>

            {maintenanceSubmitted ? (
              <div className="py-6 text-center space-y-1">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                <div className="font-semibold">Request Received!</div>
                <p className="text-[11px] text-stone-500">
                  Our maintenance coordinator will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleMaintenanceSubmit} className="space-y-3">
                <div>
                  <label className="block text-stone-700 dark:text-zinc-300 mb-1 font-medium">
                    Issue Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Garbage disposal humming, bathroom drain slow"
                    value={maintTitle}
                    onChange={(e) => setMaintTitle(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 p-2 text-xs text-stone-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-zinc-300 mb-1 font-medium">
                    Category
                  </label>
                  <select
                    value={maintCat}
                    onChange={(e) => setMaintCat(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 p-2 text-xs text-stone-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  >
                    <option value="Plumbing">Plumbing / Water</option>
                    <option value="HVAC">Heating & Air Conditioning</option>
                    <option value="Appliance">Kitchen Appliance</option>
                    <option value="Electrical">Electrical / Lighting</option>
                    <option value="Lock">Lock & Keypad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-zinc-300 mb-1 font-medium">
                    Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe where and when it happens..."
                    value={maintDesc}
                    onChange={(e) => setMaintDesc(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 p-2 text-xs text-stone-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-indigo-600 py-2.5 font-bold text-white hover:bg-indigo-700 shadow-xs"
                >
                  Submit Maintenance Request
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 4: Messages */}
        {activeTab === 'messages' && (
          <div className="p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-stone-900 dark:text-zinc-100">
              Direct Message with Landlord
            </h3>

            <div className="space-y-2.5 max-h-64 overflow-y-auto p-3 bg-stone-50 rounded-xl dark:bg-zinc-800/40">
              {tenantMessages.map((m) => (
                <div
                  key={m.id}
                  className={`p-2.5 rounded-xl text-xs max-w-xs ${
                    m.sender === 'tenant'
                      ? 'bg-indigo-600 text-white ml-auto'
                      : 'bg-white border border-stone-200 text-stone-900 dark:bg-zinc-800 dark:text-zinc-100'
                  }`}
                >
                  <p>{m.content}</p>
                  <div className="text-[10px] opacity-70 mt-1 text-right">{m.timestamp}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendTenantMessage} className="flex gap-2">
              <input
                type="text"
                placeholder="Text your property manager..."
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                className="flex-1 rounded-xl border border-stone-300 p-2 text-xs text-stone-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-4 py-2 text-white font-semibold"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
