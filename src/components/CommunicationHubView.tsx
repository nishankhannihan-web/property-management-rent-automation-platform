import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Mail,
  Send,
  Phone,
  User,
  Clock,
  CheckCheck,
  Paperclip,
} from 'lucide-react';

export const CommunicationHubView: React.FC = () => {
  const { messages, tenants, sendMessageToTenant, isEmptyState } = useApp();

  // Unique tenants in communication thread
  const tenantThreads = Array.from(new Set(messages.map((m) => m.tenantId))).map((tId) => {
    const tenant = tenants.find((t) => t.id === tId);
    const tenantMsgs = messages.filter((m) => m.tenantId === tId);
    const lastMsg = tenantMsgs[0];
    const unread = tenantMsgs.some((m) => !m.read);
    return {
      tenantId: tId,
      tenantName: tenant?.name || lastMsg?.tenantName || 'Tenant',
      unitNumber: tenant?.unitNumber || lastMsg?.unitNumber || '101',
      phone: tenant?.phone || '+1 (512) 584-9021',
      lastMessage: lastMsg?.content || '',
      timestamp: lastMsg?.timestamp || 'Just now',
      unread,
    };
  });

  const [activeTenantId, setActiveTenantId] = useState<string>(
    tenantThreads[0]?.tenantId || 't-1'
  );
  const [replyText, setReplyText] = useState('');
  const [replyChannel, setReplyChannel] = useState<'sms' | 'email'>('sms');

  const activeTenant = tenants.find((t) => t.id === activeTenantId);
  const activeThreadMessages = messages
    .filter((m) => m.tenantId === activeTenantId)
    .sort((a, b) => (a.id > b.id ? 1 : -1));

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    sendMessageToTenant(activeTenantId, replyText, replyChannel);
    setReplyText('');
  };

  const applyTemplate = (templateText: string) => {
    setReplyText(templateText);
  };

  if (isEmptyState || tenantThreads.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-500 dark:bg-zinc-800">
          <MessageSquare className="h-7 w-7" />
        </div>
        <h2 className="text-lg font-bold text-stone-900 dark:text-zinc-100">
          No Communication Threads Yet
        </h2>
        <p className="text-xs text-stone-500 dark:text-zinc-400 max-w-md mx-auto">
          RentPulse unifies SMS and Email messages per tenant into a single thread. When automated late reminders trigger or tenants text back, they appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-zinc-100">
          Unified Communication Hub
        </h1>
        <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
          2-way SMS and email threads merged by tenant. No more hunting through personal phone texts.
        </p>
      </div>

      {/* Main Inbox Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 rounded-2xl border border-stone-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden min-h-[600px]">
        {/* Left Column: Conversations List (4 cols) */}
        <div className="lg:col-span-4 border-r border-stone-200 dark:border-zinc-800 flex flex-col">
          <div className="p-4 border-b border-stone-100 dark:border-zinc-800">
            <h3 className="text-xs font-bold text-stone-900 dark:text-zinc-100 uppercase tracking-wider">
              Conversations ({tenantThreads.length})
            </h3>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-zinc-800/60 overflow-y-auto flex-1">
            {tenantThreads.map((thread) => {
              const isActive = thread.tenantId === activeTenantId;
              return (
                <div
                  key={thread.tenantId}
                  onClick={() => setActiveTenantId(thread.tenantId)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-stone-100/80 dark:bg-zinc-800/80'
                      : 'hover:bg-stone-50 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-900 dark:text-zinc-100">
                    <span className="truncate">{thread.tenantName}</span>
                    <span className="text-[10px] text-stone-400 font-mono font-normal">
                      {thread.timestamp}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5">
                    Unit #{thread.unitNumber} · {thread.phone}
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-stone-600 dark:text-zinc-400">
                    {thread.lastMessage}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Thread & Composer (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          {/* Thread Header */}
          <div className="p-4 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between bg-stone-50/50 dark:bg-zinc-800/30">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs dark:bg-emerald-950/60 dark:text-emerald-300">
                {activeTenant?.name.slice(0, 2).toUpperCase() || 'TN'}
              </div>
              <div>
                <div className="text-sm font-bold text-stone-900 dark:text-zinc-100">
                  {activeTenant?.name} (Unit #{activeTenant?.unitNumber})
                </div>
                <div className="text-xs text-stone-500 font-mono">
                  {activeTenant?.phone} · {activeTenant?.email}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-400">Channel Mode:</span>
              <span className="rounded bg-indigo-50 px-2 py-0.5 text-[11px] font-mono font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                SMS Active
              </span>
            </div>
          </div>

          {/* Messages Bubble Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-stone-50/20 dark:bg-zinc-950/20">
            {activeThreadMessages.map((msg) => {
              const isLandlord = msg.sender === 'landlord';
              const isSystem = msg.sender === 'system';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isLandlord ? 'items-end' : isSystem ? 'items-center' : 'items-start'
                  }`}
                >
                  {isSystem ? (
                    <div className="my-2 rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-[11px] text-stone-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      Automated Notice Triggered: {msg.content}
                    </div>
                  ) : (
                    <div
                      className={`max-w-lg rounded-2xl p-3.5 text-xs shadow-xs space-y-1 ${
                        isLandlord
                          ? 'bg-indigo-600 text-white rounded-br-xs'
                          : 'bg-white border border-stone-200 text-stone-900 rounded-bl-xs dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px] opacity-80">
                        <span className="font-semibold uppercase font-mono">
                          {isLandlord ? 'You (Property Mgr)' : msg.tenantName} · {msg.channel.toUpperCase()}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed">{msg.content}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Fast Response Templates */}
          <div className="px-5 py-2.5 bg-stone-50 border-t border-stone-200 dark:bg-zinc-800/40 dark:border-zinc-800 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[11px] text-stone-400 shrink-0 font-medium">Templates:</span>
            <button
              onClick={() =>
                applyTemplate(
                  `Hi ${activeTenant?.name}, we received your message and can confirm your ACH transfer is in transit. Late fees have been paused.`
                )
              }
              className="rounded bg-white px-2 py-1 text-[11px] font-medium text-stone-700 border border-stone-200 hover:border-stone-300 dark:bg-zinc-800 dark:text-zinc-300 shrink-0"
            >
              Payment In-Transit Confirmed
            </button>
            <button
              onClick={() =>
                applyTemplate(
                  `Hi ${activeTenant?.name}, maintenance ticket has been assigned to our lead tech. They will coordinate entry between 1-3 PM today.`
                )
              }
              className="rounded bg-white px-2 py-1 text-[11px] font-medium text-stone-700 border border-stone-200 hover:border-stone-300 dark:bg-zinc-800 dark:text-zinc-300 shrink-0"
            >
              Maintenance Dispatched
            </button>
            <button
              onClick={() =>
                applyTemplate(
                  `Hi ${activeTenant?.name}, your lease expires soon. We'd love to have you renew at our guaranteed rate. Let's discuss!`
                )
              }
              className="rounded bg-white px-2 py-1 text-[11px] font-medium text-stone-700 border border-stone-200 hover:border-stone-300 dark:bg-zinc-800 dark:text-zinc-300 shrink-0"
            >
              Lease Renewal Offer
            </button>
          </div>

          {/* Composer */}
          <form
            onSubmit={handleSendReply}
            className="p-4 border-t border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3"
          >
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500">Send via:</span>
              <button
                type="button"
                onClick={() => setReplyChannel('sms')}
                className={`rounded px-2 py-0.5 text-xs font-medium ${
                  replyChannel === 'sms'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-stone-100 text-stone-600 dark:bg-zinc-800'
                }`}
              >
                SMS Text
              </button>
              <button
                type="button"
                onClick={() => setReplyChannel('email')}
                className={`rounded px-2 py-0.5 text-xs font-medium ${
                  replyChannel === 'email'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-stone-100 text-stone-600 dark:bg-zinc-800'
                }`}
              >
                Email
              </button>
            </div>

            <div className="flex items-end gap-2">
              <textarea
                rows={2}
                placeholder={`Type message to ${activeTenant?.name || 'tenant'}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-stone-50 p-2.5 text-xs text-stone-900 focus:bg-white focus:border-indigo-600 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 shadow-xs transition-colors shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
