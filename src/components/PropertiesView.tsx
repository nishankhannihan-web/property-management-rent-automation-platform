import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Property } from '../types';
import {
  Building2,
  Plus,
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Home,
  X,
} from 'lucide-react';
import { OnboardingModal } from './OnboardingModal';
import {
  BUNDLED_PROPERTY_IMAGES,
  PUBLIC_FALLBACK_IMAGES,
} from '../assets/propertyImages';

interface PropertyCardImageProps {
  prop: Property;
}

const PropertyCardImage: React.FC<PropertyCardImageProps> = ({ prop }) => {
  const publicFallback = PUBLIC_FALLBACK_IMAGES[prop.id];
  const initialSrc = prop.image || publicFallback;
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(initialSrc);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    // If the imported URL failed and we haven't tried the public static URL, try it
    if (!hasTriedFallback && publicFallback && currentSrc !== publicFallback) {
      setHasTriedFallback(true);
      setCurrentSrc(publicFallback);
    } else {
      // Both failed, show the clean architectural card
      setHasError(true);
    }
  };

  // If valid image provided and no final error, render eagerly
  if (currentSrc && !hasError) {
    return (
      <div className="h-44 w-full overflow-hidden bg-stone-100 dark:bg-zinc-800 relative group">
        <img
          src={currentSrc}
          alt={prop.name}
          referrerPolicy="no-referrer"
          loading="eager"
          decoding="async"
          onError={handleError}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 rounded bg-stone-900/80 px-2 py-0.5 text-[10px] font-mono text-white backdrop-blur-xs">
          {prop.totalUnits} Units
        </div>
        <div className="absolute bottom-2.5 left-3 rounded bg-stone-900/60 px-2 py-0.5 text-[10px] text-white/90 backdrop-blur-xs">
          {prop.propertyType}
        </div>
      </div>
    );
  }

  // Resilient neutral architectural placeholder (never renders an empty gray box)
  return (
    <div className="h-44 w-full bg-gradient-to-br from-stone-100 via-stone-200/60 to-stone-100 dark:from-zinc-850 dark:via-zinc-800 dark:to-zinc-850 p-4 relative flex flex-col justify-between border-b border-stone-200 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <span className="rounded bg-white/90 dark:bg-zinc-700/80 px-2 py-0.5 text-[10px] font-medium text-stone-700 dark:text-zinc-200 shadow-2xs">
          {prop.propertyType}
        </span>
        <span className="rounded bg-stone-900/80 px-2 py-0.5 text-[10px] font-mono text-white">
          {prop.totalUnits} Units
        </span>
      </div>

      <div className="flex items-center gap-3 py-2">
        <div className="h-10 w-10 rounded-xl bg-white/85 dark:bg-zinc-700/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-2xs shrink-0">
          <Building2 className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold text-stone-800 dark:text-zinc-200 truncate">
            {prop.name}
          </div>
          <div className="text-[10px] text-stone-500 dark:text-zinc-400">
            {prop.city}, {prop.state} · Built {prop.yearBuilt || 2020}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-stone-400 dark:text-zinc-500 font-mono">
        <span>Portfolio Asset</span>
        <span>${prop.monthlyExpectedRent.toLocaleString()}/mo</span>
      </div>
    </div>
  );
};

export const PropertiesView: React.FC = () => {
  const { properties, payments, tenants, isEmptyState, addNewProperty } = useApp();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isNewPropertyOpen, setIsNewPropertyOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // New property form state
  const [newPropName, setNewPropName] = useState('');
  const [newPropAddress, setNewPropAddress] = useState('');
  const [newPropUnits, setNewPropUnits] = useState(20);
  const [newPropRent, setNewPropRent] = useState(1750);

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropName) return;

    const assignedImage = BUNDLED_PROPERTY_IMAGES[properties.length % BUNDLED_PROPERTY_IMAGES.length];

    addNewProperty({
      name: newPropName,
      address: newPropAddress || '100 Central Ave',
      city: 'Austin',
      state: 'TX',
      totalUnits: Number(newPropUnits),
      occupiedUnits: Math.floor(Number(newPropUnits) * 0.95),
      monthlyExpectedRent: Number(newPropUnits) * Number(newPropRent),
      image: assignedImage,
    });

    setIsNewPropertyOpen(false);
    setNewPropName('');
  };

  if (isEmptyState) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-500 dark:bg-zinc-800">
          <Building2 className="h-7 w-7" />
        </div>
        <h2 className="text-lg font-bold text-stone-900 dark:text-zinc-100">
          No Properties in Your Portfolio Yet
        </h2>
        <p className="text-xs text-stone-500 dark:text-zinc-400 max-w-md mx-auto">
          RentPulse supports independent landlords managing 100 to 300 rental units. Add your first multifamily building or townhome community.
        </p>
        <button
          onClick={() => setIsOnboardingOpen(true)}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs"
        >
          Add Your First Property
        </button>
        <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-zinc-100">
            Properties & Unit Inventory
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
            154 total rental units across 6 communities in Austin, Round Rock, and San Marcos.
          </p>
        </div>

        <button
          onClick={() => setIsNewPropertyOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Property</span>
        </button>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {properties.map((prop) => {
          const propPayments = payments.filter((p) => p.propertyId === prop.id);
          const overdueCount = propPayments.filter((p) => p.status === 'overdue').length;
          const pendingCount = propPayments.filter((p) => p.status === 'pending').length;
          const occupancyPercent = (prop.occupiedUnits / prop.totalUnits) * 100;

          return (
            <div
              key={prop.id}
              className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between"
            >
              <div>
                {/* Robust Image slot with eager loading and graceful fallback */}
                <PropertyCardImage prop={prop} />

                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base text-stone-900 dark:text-zinc-100">
                        {prop.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-zinc-400 mt-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
                        {prop.address}, {prop.city}, {prop.state}
                      </span>
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 dark:border-zinc-800 text-xs">
                    <div>
                      <span className="text-stone-400 text-[10px] block">Occupancy Rate</span>
                      <span className="font-mono font-semibold text-stone-900 dark:text-zinc-100">
                        {occupancyPercent.toFixed(0)}% ({prop.occupiedUnits}/{prop.totalUnits})
                      </span>
                    </div>

                    <div>
                      <span className="text-stone-400 text-[10px] block">Monthly Rent Roll</span>
                      <span className="font-mono font-semibold text-stone-900 dark:text-zinc-100">
                        ${prop.monthlyExpectedRent.toLocaleString()}/mo
                      </span>
                    </div>
                  </div>

                  {/* Payment Status Badges */}
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    {overdueCount > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-400">
                        <AlertCircle className="h-3 w-3" /> {overdueCount} Overdue
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" /> 100% On-Time
                      </span>
                    )}

                    {pendingCount > 0 && (
                      <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-2 py-0.5 text-[11px] text-stone-600 dark:bg-zinc-800 dark:text-zinc-300">
                        {pendingCount} in Grace
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => setSelectedProperty(prop)}
                  className="w-full rounded-xl border border-stone-200 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                >
                  View Rent Roll & Units
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Property Deep-Dive Modal (Rent Roll Breakdown) */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-3xl rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-stone-200 dark:border-zinc-800">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-600 font-semibold">
                  Property Rent Roll Breakdown
                </span>
                <h3 className="text-lg font-bold text-stone-900 dark:text-zinc-100">
                  {selectedProperty.name}
                </h3>
                <p className="text-xs text-stone-500">
                  {selectedProperty.totalUnits} Units · {selectedProperty.address}, {selectedProperty.city}, {selectedProperty.state}
                </p>
              </div>
              <button
                onClick={() => setSelectedProperty(null)}
                className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {selectedProperty.image && (
              <div className="h-44 w-full rounded-xl overflow-hidden bg-stone-100 dark:bg-zinc-800 relative">
                <img
                  src={selectedProperty.image}
                  alt={selectedProperty.name}
                  referrerPolicy="no-referrer"
                  loading="eager"
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 right-3 rounded bg-stone-900/80 px-2 py-0.5 text-[10px] font-mono text-white backdrop-blur-xs">
                  {selectedProperty.totalUnits} Units
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 rounded-xl bg-stone-50 p-3 dark:bg-zinc-800 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px]">Total Units</span>
                <span className="font-bold font-mono text-sm">{selectedProperty.totalUnits}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Occupancy</span>
                <span className="font-bold font-mono text-sm">
                  {((selectedProperty.occupiedUnits / selectedProperty.totalUnits) * 100).toFixed(0)}% ({selectedProperty.occupiedUnits} leased)
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Monthly Gross Rent</span>
                <span className="font-bold font-mono text-sm text-emerald-600 dark:text-emerald-400">
                  ${selectedProperty.monthlyExpectedRent.toLocaleString()}/mo
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-stone-900 dark:text-zinc-100">
                Sample Units & Lease Status
              </h4>
              <div className="space-y-1.5 text-xs">
                {tenants
                  .filter((t) => t.propertyId === selectedProperty.id)
                  .map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between rounded-lg border border-stone-200 p-2.5 dark:border-zinc-800"
                    >
                      <div>
                        <span className="font-bold text-stone-900 dark:text-zinc-100 font-mono">
                          Unit #{t.unitNumber}
                        </span>
                        <span className="ml-2 font-medium text-stone-700 dark:text-zinc-300">
                          {t.name}
                        </span>
                        <span className="ml-2 text-[10px] text-stone-400">
                          Lease exp: {t.leaseEndDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold">${t.monthlyRent}/mo</span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                            t.status === 'late'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {t.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => setSelectedProperty(null)}
                className="rounded-lg bg-stone-900 px-4 py-2 text-xs font-medium text-white hover:bg-stone-800 dark:bg-zinc-100 dark:text-zinc-900"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Property Modal */}
      {isNewPropertyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-zinc-800">
              <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100">
                Add New Rental Property
              </h3>
              <button
                onClick={() => setIsNewPropertyOpen(false)}
                className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 dark:text-zinc-300 mb-1">
                  Property Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Barton Creek Townhomes"
                  value={newPropName}
                  onChange={(e) => setNewPropName(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-zinc-300 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1400 Barton Skyway, Austin, TX"
                  value={newPropAddress}
                  onChange={(e) => setNewPropAddress(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 dark:text-zinc-300 mb-1">
                    Number of Units
                  </label>
                  <input
                    type="number"
                    value={newPropUnits}
                    onChange={(e) => setNewPropUnits(Number(e.target.value))}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 dark:text-zinc-300 mb-1">
                    Average Monthly Rent ($)
                  </label>
                  <input
                    type="number"
                    value={newPropRent}
                    onChange={(e) => setNewPropRent(Number(e.target.value))}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsNewPropertyOpen(false)}
                  className="rounded-lg px-4 py-2 font-medium text-stone-600 hover:bg-stone-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 shadow-xs"
                >
                  Create Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
