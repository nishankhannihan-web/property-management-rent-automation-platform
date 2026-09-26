export type PaletteMode = 'optionA' | 'optionB';
export type ThemeMode = 'light' | 'dark';
export type UserRole = 'landlord' | 'property_manager' | 'tenant';

export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'partial';
export type PaymentMethod = 'ach' | 'credit_card' | 'debit_card' | 'paper_check' | 'zelle' | 'cash';

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  totalUnits: number;
  occupiedUnits: number;
  monthlyExpectedRent: number;
  image?: string;
  propertyType: 'Multifamily Mid-Rise' | 'Townhome Community' | 'Urban Lofts' | 'Garden Apartments';
  yearBuilt: number;
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  monthlyRent: number;
  depositAmount: number;
  status: 'occupied' | 'vacant' | 'maintenance';
  tenantId?: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  unitId: string;
  unitNumber: string;
  monthlyRent: number;
  leaseStartDate: string;
  leaseEndDate: string;
  status: 'current' | 'late' | 'at-risk' | 'vacated';
  paymentMethodOnFile: string; // e.g. "Chase ACH ••••4821"
  autoPayEnabled: boolean;
  balanceDue: number;
  daysLate: number;
  notes?: string;
}

export interface Payment {
  id: string;
  tenantId: string;
  tenantName: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  transactionReference?: string;
  lateFeeApplied?: number;
  daysLate: number;
  receiptNumber?: string;
}

export interface Message {
  id: string;
  tenantId: string;
  tenantName: string;
  unitNumber: string;
  propertyName: string;
  sender: 'landlord' | 'tenant' | 'system';
  channel: 'sms' | 'email' | 'portal';
  content: string;
  timestamp: string;
  read: boolean;
  status?: 'sent' | 'delivered' | 'failed';
}

export interface ReminderRule {
  id: string;
  name: string;
  description: string;
  triggerType: 'before_due' | 'on_due' | 'after_due';
  daysOffset: number; // e.g. 3 days before, 0 for on due, 4 days after
  channels: ('sms' | 'email' | 'portal')[];
  enabled: boolean;
  includeLateFeeNotice: boolean;
  lateFeeAmount?: number;
  templateSubject?: string;
  templateBody: string;
  deliveryStats: {
    sent: number;
    delivered: number;
    openRate: number;
    lastTriggered: string;
  };
}

export interface ReminderDeliveryLog {
  id: string;
  ruleName: string;
  tenantName: string;
  unitNumber: string;
  channel: 'sms' | 'email';
  status: 'delivered' | 'sent' | 'failed';
  timestamp: string;
  snippet: string;
  errorMessage?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  category: 'payment' | 'reminder' | 'lease' | 'compliance' | 'security';
  details: string;
  ipAddress?: string;
}

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  tenantName: string;
  tenantId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'assigned' | 'in_progress' | 'resolved';
  createdAt: string;
  category: 'Plumbing' | 'HVAC' | 'Electrical' | 'Appliance' | 'Access';
}

export interface StateComplianceConfig {
  stateCode: string;
  stateName: string;
  mandatoryGracePeriodDays: number;
  maxLateFeeType: 'percentage' | 'flat' | 'reasonable';
  maxLateFeeValue: number; // e.g. 5% or $50
  noticeToQuitDays: number;
  securityDepositReturnLimitDays: number;
  statutoryReference: string;
}
