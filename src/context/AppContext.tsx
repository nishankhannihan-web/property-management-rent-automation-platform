import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  Property,
  Tenant,
  Payment,
  ReminderRule,
  ReminderDeliveryLog,
  Message,
  AuditLog,
  MaintenanceRequest,
  UserRole,
  ThemeMode,
  PaletteMode,
  PaymentMethod,
} from '../types';
import {
  INITIAL_PROPERTIES,
  INITIAL_TENANTS,
  INITIAL_PAYMENTS,
  INITIAL_REMINDER_RULES,
  INITIAL_DELIVERY_LOGS,
  INITIAL_MESSAGES,
  INITIAL_AUDIT_LOGS,
  INITIAL_MAINTENANCE_REQUESTS,
  STATE_COMPLIANCE_CONFIGS,
} from '../data/mockData';
import { BUNDLED_PROPERTY_IMAGES } from '../assets/propertyImages';

export type NavTab =
  | 'dashboard'
  | 'payments'
  | 'reminders'
  | 'tenants'
  | 'properties'
  | 'messages'
  | 'reports'
  | 'settings'
  | 'portal';

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  paletteMode: PaletteMode;
  togglePalette: () => void;
  isEmptyState: boolean;
  setIsEmptyState: (empty: boolean) => void;
  selectedStateCode: string;
  setSelectedStateCode: (stateCode: string) => void;

  // Data
  properties: Property[];
  tenants: Tenant[];
  payments: Payment[];
  reminderRules: ReminderRule[];
  deliveryLogs: ReminderDeliveryLog[];
  messages: Message[];
  auditLogs: AuditLog[];
  maintenanceRequests: MaintenanceRequest[];

  // Computed Metrics
  totalPendingRent: number;
  overdueRent: number;
  inGracePeriodRent: number;
  totalCollectedRent: number;
  totalExpectedRent: number;
  collectionRate: number;
  occupancyRate: number;
  totalUnitsCount: number;
  occupiedUnitsCount: number;
  overdueTenantsCount: number;

  // Actions
  markPaymentPaid: (paymentId: string, method?: PaymentMethod, note?: string) => void;
  sendBulkRemindersToOverdue: () => { count: number; totalAmount: number };
  sendSingleReminder: (tenantId: string, ruleName?: string, customNote?: string) => void;
  toggleReminderRule: (ruleId: string) => void;
  updateReminderRule: (rule: ReminderRule) => void;
  addReminderRule: (rule: ReminderRule) => void;
  deleteReminderRule: (ruleId: string) => void;
  addNewProperty: (property: Partial<Property>) => void;
  addNewTenant: (tenant: Partial<Tenant>) => void;
  resolveMaintenanceTicket: (id: string) => void;
  sendMessageToTenant: (tenantId: string, content: string, channel: 'sms' | 'email') => void;
  recordManualPayment: (payment: {
    tenantId: string;
    amount: number;
    method: PaymentMethod;
    receiptNumber: string;
    note?: string;
  }) => void;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('landlord');
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('rentpulse_theme_mode');
        if (saved === 'dark' || saved === 'light') return saved;
      } catch (e) {
        // ignore
      }
    }
    return 'light';
  });
  const [paletteMode, setPaletteMode] = useState<PaletteMode>('optionA');
  const [isEmptyState, setIsEmptyState] = useState<boolean>(false);
  const [selectedStateCode, setSelectedStateCode] = useState<string>('TX');

  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [reminderRules, setReminderRules] = useState<ReminderRule[]>(INITIAL_REMINDER_RULES);
  const [deliveryLogs, setDeliveryLogs] = useState<ReminderDeliveryLog[]>(INITIAL_DELIVERY_LOGS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(
    INITIAL_MAINTENANCE_REQUESTS
  );

  // Sync dark mode class on root HTML element and body, persist to localStorage
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (themeMode === 'dark') {
      root.classList.add('dark');
      body?.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body?.classList.remove('dark');
    }
    try {
      localStorage.setItem('rentpulse_theme_mode', themeMode);
    } catch (e) {
      // ignore
    }
  }, [themeMode]);

  // If in empty state, views show zero data
  const currentProperties = isEmptyState ? [] : properties;
  const currentTenants = isEmptyState ? [] : tenants;
  const currentPayments = isEmptyState ? [] : payments;
  const currentMaintenance = isEmptyState ? [] : maintenanceRequests;
  const currentMessages = isEmptyState ? [] : messages;
  const currentLogs = isEmptyState ? [] : auditLogs;
  const currentDeliveryLogs = isEmptyState ? [] : deliveryLogs;

  // Real-time pre-aggregated metrics
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
  } = useMemo(() => {
    if (isEmptyState) {
      return {
        totalPendingRent: 0,
        overdueRent: 0,
        inGracePeriodRent: 0,
        totalCollectedRent: 0,
        totalExpectedRent: 0,
        collectionRate: 0,
        occupancyRate: 0,
        totalUnitsCount: 0,
        occupiedUnitsCount: 0,
        overdueTenantsCount: 0,
      };
    }

    let overdue = 0;
    let inGrace = 0;
    let collected = 0;
    const overdueTenantIds = new Set<string>();

    currentPayments.forEach((p) => {
      if (p.status === 'overdue') {
        overdue += p.amount;
        overdueTenantIds.add(p.tenantId);
      } else if (p.status === 'pending') {
        inGrace += p.amount;
      } else if (p.status === 'paid') {
        collected += p.amount;
      }
    });

    const pending = overdue + inGrace;
    const expected = collected + pending;
    const cRate = expected > 0 ? (collected / expected) * 100 : 0;

    const totalU = currentProperties.reduce((acc, curr) => acc + curr.totalUnits, 0);
    const occupiedU = currentProperties.reduce((acc, curr) => acc + curr.occupiedUnits, 0);
    const occRate = totalU > 0 ? (occupiedU / totalU) * 100 : 0;

    return {
      totalPendingRent: pending,
      overdueRent: overdue,
      inGracePeriodRent: inGrace,
      totalCollectedRent: collected,
      totalExpectedRent: expected,
      collectionRate: cRate,
      occupancyRate: occRate,
      totalUnitsCount: totalU,
      occupiedUnitsCount: occupiedU,
      overdueTenantsCount: overdueTenantIds.size,
    };
  }, [isEmptyState, currentPayments, currentProperties]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const togglePalette = () => {
    setPaletteMode((prev) => (prev === 'optionA' ? 'optionB' : 'optionA'));
  };

  const markPaymentPaid = (paymentId: string, method: PaymentMethod = 'ach', note?: string) => {
    const target = payments.find((p) => p.id === paymentId);
    if (!target) return;

    const updatedPayments = payments.map((p) => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: 'paid' as const,
          paidDate: new Date().toISOString().split('T')[0],
          paymentMethod: method,
          receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
        };
      }
      return p;
    });

    setPayments(updatedPayments);

    // Update tenant status if all overdue payments resolved
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === target.tenantId) {
          return {
            ...t,
            status: 'current',
            balanceDue: Math.max(0, t.balanceDue - target.amount),
            daysLate: 0,
          };
        }
        return t;
      })
    );

    // Append dispute-proof audit log
    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: userRole === 'landlord' ? 'Landlord (Sam Vance)' : 'Property Manager',
      action: 'Payment Marked Paid',
      category: 'payment',
      details: `Marked $${target.amount.toLocaleString()} paid for ${target.tenantName} (${target.propertyName} #${target.unitNumber}) via ${method}. ${note || ''}`,
      ipAddress: '127.0.0.1 (Web Console)',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const sendBulkRemindersToOverdue = () => {
    const overdueList = payments.filter((p) => p.status === 'overdue');
    const count = overdueList.length;
    const totalAmount = overdueList.reduce((sum, p) => sum + p.amount, 0);

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLogs: ReminderDeliveryLog[] = overdueList.map((p, idx) => ({
      id: `bulk-log-${Date.now()}-${idx}`,
      ruleName: 'Overdue Notice & Late Fee Assessment',
      tenantName: p.tenantName,
      unitNumber: `${p.propertyName} #${p.unitNumber}`,
      channel: 'sms',
      status: 'delivered',
      timestamp: `Today, ${nowStr}`,
      snippet: `Sent formal overdue alert for $${p.amount.toLocaleString()} (balance past due). Texas grace period expired.`,
    }));

    setDeliveryLogs((prev) => [...newLogs, ...prev]);

    // Add audit log
    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: userRole === 'landlord' ? 'Landlord (Sam Vance)' : 'Property Manager',
      action: 'Bulk Overdue Reminders Dispatched',
      category: 'reminder',
      details: `Triggered 1-click reminders to ${count} overdue tenants totaling $${totalAmount.toLocaleString()} via SMS & Email.`,
      ipAddress: '68.96.14.88 (One-Click Dispatch)',
    };
    setAuditLogs((prev) => [audit, ...prev]);

    return { count, totalAmount };
  };

  const sendSingleReminder = (tenantId: string, ruleName = 'Individual Follow-Up Notice', customNote?: string) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    if (!tenant) return;

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const log: ReminderDeliveryLog = {
      id: `single-log-${Date.now()}`,
      ruleName,
      tenantName: tenant.name,
      unitNumber: `Unit #${tenant.unitNumber}`,
      channel: 'sms',
      status: 'delivered',
      timestamp: `Today, ${nowStr}`,
      snippet: customNote || `Hi ${tenant.name}, reminder regarding balance of $${tenant.balanceDue.toLocaleString()} due for Unit ${tenant.unitNumber}.`,
    };

    setDeliveryLogs((prev) => [log, ...prev]);

    // Also add to messages thread
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      tenantId: tenant.id,
      tenantName: tenant.name,
      unitNumber: `Unit #${tenant.unitNumber}`,
      propertyName: 'Highland Court Apartments',
      sender: 'landlord',
      channel: 'sms',
      content: customNote || `Hi ${tenant.name}, following up regarding your rent balance of $${tenant.balanceDue.toLocaleString()}. Please let us know if you need assistance submitting via the portal.`,
      timestamp: nowStr,
      read: true,
      status: 'delivered',
    };
    setMessages((prev) => [newMsg, ...prev]);

    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: 'Landlord (Sam Vance)',
      action: 'Individual Reminder Dispatched',
      category: 'reminder',
      details: `Dispatched SMS reminder to ${tenant.name} (${tenant.phone}) for $${tenant.balanceDue.toLocaleString()}.`,
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const toggleReminderRule = (ruleId: string) => {
    setReminderRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const updateReminderRule = (updated: ReminderRule) => {
    setReminderRules((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const addReminderRule = (newRule: ReminderRule) => {
    setReminderRules((prev) => [...prev, newRule]);
    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: 'Landlord (Sam Vance)',
      action: 'Created Reminder Rule',
      category: 'reminder',
      details: `Configured new automated reminder rule: "${newRule.name}"`,
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const deleteReminderRule = (ruleId: string) => {
    setReminderRules((prev) => prev.filter((r) => r.id !== ruleId));
  };

  const addNewProperty = (propData: Partial<Property>) => {
    const newProp: Property = {
      id: `prop-${Date.now()}`,
      name: propData.name || 'New Rental Property',
      address: propData.address || '100 Main St',
      city: propData.city || 'Austin',
      state: propData.state || 'TX',
      zip: propData.zip || '78701',
      totalUnits: propData.totalUnits || 20,
      occupiedUnits: propData.occupiedUnits || 18,
      monthlyExpectedRent: propData.monthlyExpectedRent || 32000,
      image: propData.image || BUNDLED_PROPERTY_IMAGES[properties.length % BUNDLED_PROPERTY_IMAGES.length],
      propertyType: propData.propertyType || 'Multifamily Mid-Rise',
      yearBuilt: propData.yearBuilt || 2022,
    };
    setProperties((prev) => [newProp, ...prev]);
    setIsEmptyState(false);
  };

  const addNewTenant = (tenantData: Partial<Tenant>) => {
    const newT: Tenant = {
      id: `t-${Date.now()}`,
      name: tenantData.name || 'Jane Doe',
      email: tenantData.email || 'jane.doe@example.com',
      phone: tenantData.phone || '+1 (512) 555-0199',
      propertyId: tenantData.propertyId || 'prop-1',
      unitId: `u-${Date.now()}`,
      unitNumber: tenantData.unitNumber || '101',
      monthlyRent: tenantData.monthlyRent || 1650,
      leaseStartDate: tenantData.leaseStartDate || '2026-09-01',
      leaseEndDate: tenantData.leaseEndDate || '2027-08-31',
      status: 'current',
      paymentMethodOnFile: 'Chase ACH ••••1234',
      autoPayEnabled: true,
      balanceDue: 0,
      daysLate: 0,
    };
    setTenants((prev) => [newT, ...prev]);
  };

  const resolveMaintenanceTicket = (id: string) => {
    setMaintenanceRequests((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'resolved' as const } : m))
    );
  };

  const sendMessageToTenant = (tenantId: string, content: string, channel: 'sms' | 'email') => {
    const tenant = tenants.find((t) => t.id === tenantId);
    if (!tenant) return;

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      tenantId: tenant.id,
      tenantName: tenant.name,
      unitNumber: `Unit #${tenant.unitNumber}`,
      propertyName: 'Highland Court Apartments',
      sender: 'landlord',
      channel,
      content,
      timestamp: nowStr,
      read: true,
      status: 'delivered',
    };
    setMessages((prev) => [newMsg, ...prev]);
  };

  const recordManualPayment = (paymentData: {
    tenantId: string;
    amount: number;
    method: PaymentMethod;
    receiptNumber: string;
    note?: string;
  }) => {
    const tenant = tenants.find((t) => t.id === paymentData.tenantId);
    if (!tenant) return;

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      tenantId: tenant.id,
      tenantName: tenant.name,
      propertyId: tenant.propertyId,
      propertyName: 'Highland Court',
      unitNumber: tenant.unitNumber,
      amount: paymentData.amount,
      dueDate: '2026-09-01',
      paidDate: new Date().toISOString().split('T')[0],
      status: 'paid',
      paymentMethod: paymentData.method,
      receiptNumber: paymentData.receiptNumber,
      daysLate: 0,
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Deduct balance
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === tenant.id) {
          const newBal = Math.max(0, t.balanceDue - paymentData.amount);
          return {
            ...t,
            balanceDue: newBal,
            status: newBal === 0 ? 'current' : t.status,
          };
        }
        return t;
      })
    );

    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: userRole === 'landlord' ? 'Landlord (Sam Vance)' : 'Property Manager',
      action: 'Manual Payment Recorded',
      category: 'payment',
      details: `Recorded $${paymentData.amount.toLocaleString()} via ${paymentData.method} for ${tenant.name} (#${tenant.unitNumber}). Receipt: ${paymentData.receiptNumber}. Note: ${paymentData.note || 'None'}`,
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const resetToDemoData = () => {
    setProperties(INITIAL_PROPERTIES);
    setTenants(INITIAL_TENANTS);
    setPayments(INITIAL_PAYMENTS);
    setReminderRules(INITIAL_REMINDER_RULES);
    setDeliveryLogs(INITIAL_DELIVERY_LOGS);
    setMessages(INITIAL_MESSAGES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setMaintenanceRequests(INITIAL_MAINTENANCE_REQUESTS);
    setIsEmptyState(false);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userRole,
        setUserRole,
        themeMode,
        toggleTheme,
        paletteMode,
        togglePalette,
        isEmptyState,
        setIsEmptyState,
        selectedStateCode,
        setSelectedStateCode,
        properties: currentProperties,
        tenants: currentTenants,
        payments: currentPayments,
        reminderRules,
        deliveryLogs: currentDeliveryLogs,
        messages: currentMessages,
        auditLogs: currentLogs,
        maintenanceRequests: currentMaintenance,
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
        markPaymentPaid,
        sendBulkRemindersToOverdue,
        sendSingleReminder,
        toggleReminderRule,
        updateReminderRule,
        addReminderRule,
        deleteReminderRule,
        addNewProperty,
        addNewTenant,
        resolveMaintenanceTicket,
        sendMessageToTenant,
        recordManualPayment,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
