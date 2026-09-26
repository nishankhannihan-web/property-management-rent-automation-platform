import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check, Building2, Users, CreditCard, ArrowRight, ShieldCheck } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { addNewProperty, resetToDemoData } = useApp();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 Form
  const [propertyName, setPropertyName] = useState('Barton Hills Terraces');
  const [propertyAddress, setPropertyAddress] = useState('2800 Barton Skyway');
  const [city, setCity] = useState('Austin');
  const [state, setState] = useState('TX');
  const [unitsCount, setUnitsCount] = useState(24);
  const [avgRent, setAvgRent] = useState(1850);

  // Step 2 Form
  const [importMethod, setImportMethod] = useState<'csv' | 'manual'>('csv');
  const [uploadedFileName, setUploadedFileName] = useState('rent_roll_2026.csv');

  // Step 3 Form
  const [bankConnected, setBankConnected] = useState(false);

  if (!isOpen) return null;

  const handleFinish = () => {
    addNewProperty({
      name: propertyName,
      address: propertyAddress,
      city,
      state,
      totalUnits: unitsCount,
      occupiedUnits: Math.floor(unitsCount * 0.95),
      monthlyExpectedRent: unitsCount * avgRent,
    });
    onClose();
  };

  const loadFullDemo = () => {
    resetToDemoData();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-zinc-800">
          <div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
              Fast 3-Step Setup
            </span>
            <h2 className="text-lg font-bold text-stone-900 dark:text-zinc-100">
              Welcome to RentPulse
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="mt-6 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                currentStep >= 1
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-100 text-stone-500 dark:bg-zinc-800'
              }`}
            >
              {currentStep > 1 ? <Check className="h-4 w-4" /> : '1'}
            </div>
            <span className="text-xs font-medium text-stone-700 dark:text-zinc-300">
              Add Property
            </span>
          </div>

          <div className="h-0.5 w-16 bg-stone-200 dark:bg-zinc-800" />

          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                currentStep >= 2
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-100 text-stone-500 dark:bg-zinc-800'
              }`}
            >
              {currentStep > 2 ? <Check className="h-4 w-4" /> : '2'}
            </div>
            <span className="text-xs font-medium text-stone-700 dark:text-zinc-300">
              Units & Rent Roll
            </span>
          </div>

          <div className="h-0.5 w-16 bg-stone-200 dark:bg-zinc-800" />

          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                currentStep === 3
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-100 text-stone-500 dark:bg-zinc-800'
              }`}
            >
              3
            </div>
            <span className="text-xs font-medium text-stone-700 dark:text-zinc-300">
              Bank Connection
            </span>
          </div>
        </div>

        {/* Step 1: Add Property */}
        {currentStep === 1 && (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-stone-50 p-4 border border-stone-200 dark:bg-zinc-800/50 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-stone-800 dark:text-zinc-200 font-medium text-sm mb-1">
                <Building2 className="h-4 w-4 text-emerald-600" />
                Property Specifications
              </div>
              <p className="text-xs text-stone-500 dark:text-zinc-400">
                Independent landlords replace messy spreadsheets by organizing properties in dedicated clusters.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-zinc-300 mb-1">
                  Property Name
                </label>
                <input
                  type="text"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-zinc-300 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-zinc-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-zinc-300 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-zinc-300 mb-1">
                  Total Units
                </label>
                <input
                  type="number"
                  value={unitsCount}
                  onChange={(e) => setUnitsCount(Number(e.target.value))}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm tabular-nums focus:border-emerald-600 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-stone-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={loadFullDemo}
                className="text-xs text-stone-500 hover:text-stone-800 underline dark:hover:text-zinc-200"
              >
                Or load 154-unit live demo portfolio
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700 shadow-xs"
              >
                Continue to Units <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Units & Rent Roll */}
        {currentStep === 2 && (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-stone-50 p-4 border border-stone-200 dark:bg-zinc-800/50 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-stone-800 dark:text-zinc-200 font-medium text-sm mb-1">
                <Users className="h-4 w-4 text-emerald-600" />
                Import Existing Rent Roll
              </div>
              <p className="text-xs text-stone-500 dark:text-zinc-400">
                Directly import your Excel or Google Sheets tenant list to populate unit numbers, monthly rent, and phone numbers in seconds.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setImportMethod('csv')}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  importMethod === 'csv'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-950/20'
                    : 'border-stone-200 hover:border-stone-300 dark:border-zinc-700'
                }`}
              >
                <div className="font-semibold text-xs text-stone-900 dark:text-zinc-100">
                  Upload Spreadsheet / CSV
                </div>
                <p className="mt-1 text-[11px] text-stone-500 dark:text-zinc-400">
                  Matches columns: Unit, Tenant Name, Phone, Email, Monthly Rent.
                </p>
                <div className="mt-3 inline-flex items-center gap-1 rounded bg-stone-100 px-2 py-1 text-[10px] font-mono text-stone-700 dark:bg-zinc-800 dark:text-zinc-300">
                  ✓ {uploadedFileName} (24 rows detected)
                </div>
              </div>

              <div
                onClick={() => setImportMethod('manual')}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  importMethod === 'manual'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-950/20'
                    : 'border-stone-200 hover:border-stone-300 dark:border-zinc-700'
                }`}
              >
                <div className="font-semibold text-xs text-stone-900 dark:text-zinc-100">
                  Batch Auto-Generate Units
                </div>
                <p className="mt-1 text-[11px] text-stone-500 dark:text-zinc-400">
                  Create Units 101–124 automatically with uniform rent rates.
                </p>
                <div className="mt-3 text-[11px] text-stone-500">
                  Avg. Rent: <span className="font-mono">${avgRent}/mo</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-stone-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="rounded-lg px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700 shadow-xs"
              >
                Continue to Bank Setup <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Connect Bank / Stripe */}
        {currentStep === 3 && (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-stone-50 p-4 border border-stone-200 dark:bg-zinc-800/50 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-stone-800 dark:text-zinc-200 font-medium text-sm mb-1">
                <CreditCard className="h-4 w-4 text-emerald-600" />
                Connect Operating Escrow Account
              </div>
              <p className="text-xs text-stone-500 dark:text-zinc-400">
                Plaid & Stripe tokenization handles tenant ACH payments securely with zero raw bank details stored on your server (PCI-DSS compliant).
              </p>
            </div>

            <div className="rounded-xl border border-stone-200 p-4 text-center dark:border-zinc-800">
              {bankConnected ? (
                <div className="space-y-2 py-2">
                  <ShieldCheck className="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  <div className="text-xs font-semibold text-stone-900 dark:text-zinc-100">
                    JPMorgan Chase Operating Checking ••••4892 Connected
                  </div>
                  <p className="text-[11px] text-stone-500">
                    ACH transfer fee capped at $5 · Next-day direct deposit active
                  </p>
                </div>
              ) : (
                <div className="space-y-3 py-2">
                  <CreditCard className="mx-auto h-8 w-8 text-stone-400" />
                  <div className="text-xs text-stone-600 dark:text-zinc-300">
                    Connect your bank via instant OAuth authentication.
                  </div>
                  <button
                    type="button"
                    onClick={() => setBankConnected(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700 shadow-xs"
                  >
                    Simulate Connect via Plaid / Stripe
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-stone-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="rounded-lg px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs"
              >
                Launch RentPulse Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
