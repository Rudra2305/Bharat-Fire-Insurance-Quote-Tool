import React, { useState, useEffect, useMemo } from 'react';
import type { QuoteInputs } from '../utils/calculator';
import { pincodeMap, occupancies } from '../data/dataManager';
import { optionalAddons } from '../data/perils';
import { Search, MapPin, Building2, Factory, Package, Percent, ShieldAlert, Sofa, History, AlertCircle, Plus, Check, ShieldCheck } from 'lucide-react';

interface CalculatorFormProps {
  onUpdate: (inputs: QuoteInputs) => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ onUpdate }) => {
  const [inputs, setInputs] = useState<QuoteInputs>({
    buildingSI: 0,
    pmSI: 0,
    furnitureSI: 0,
    stocksSI: 0,
    otherSI: 0,
    discount: 0,
    includeTerrorism: true,
    occupancy: null,
    pincode: null,
    isRenewal: false,
    hasClaims: false,
    pastPremium: 0,
    pastClaims: 0,
    selectedAddons: ['terrorism'],
  });

  const [pincodeQuery, setPincodeQuery] = useState('');
  const [occupancyQuery, setOccupancyQuery] = useState('');

  // Calculate Live Claim Ratio
  const currentClaimRatio = useMemo(() => {
    if (!inputs.isRenewal || !inputs.hasClaims || inputs.pastPremium <= 0) return 0;
    return (inputs.pastClaims / inputs.pastPremium) * 100;
  }, [inputs.isRenewal, inputs.hasClaims, inputs.pastPremium, inputs.pastClaims]);

  useEffect(() => {
    onUpdate(inputs);
  }, [inputs, onUpdate]);

  const handlePincodeChange = (val: string) => {
    setPincodeQuery(val);
    if (val.length === 6) {
      const found = pincodeMap[val];
      if (found) {
        setInputs(prev => ({ ...prev, pincode: found }));
      }
    } else {
      setInputs(prev => ({ ...prev, pincode: null }));
    }
  };

  const toggleTerrorism = () => {
    setInputs(prev => {
      const isSelected = prev.selectedAddons.includes('terrorism');
      const updated = isSelected 
        ? prev.selectedAddons.filter(a => a !== 'terrorism')
        : [...prev.selectedAddons, 'terrorism'];
      
      return { 
        ...prev, 
        selectedAddons: updated,
        includeTerrorism: updated.includes('terrorism')
      };
    });
  };

  const filteredOccupancies = occupancyQuery.length > 1 
    ? occupancies.filter(occ => 
        occ.name && occ.name.toLowerCase().includes(occupancyQuery.toLowerCase())
      ).slice(0, 10)
    : [];

  return (
    <div className="space-y-8 pb-10">
      {/* STEP 1: Location & Occupancy */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <MapPin className="w-4 h-4" /> 1. Risk Location & Business
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Pincode</label>
              <input
                type="text"
                maxLength={6}
                value={pincodeQuery}
                onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit PIN"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Search Occupancy</label>
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={occupancyQuery}
                  onChange={(e) => {
                    setOccupancyQuery(e.target.value);
                    if (inputs.occupancy) setInputs(prev => ({ ...prev, occupancy: null }));
                  }}
                  placeholder="e.g. Textile, Warehouse..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
                {inputs.occupancy && (
                  <div className="mt-2 flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Selected Business</span>
                      <span className="font-bold text-blue-900 text-sm leading-tight">{inputs.occupancy.name}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setInputs(prev => ({ ...prev, occupancy: null }));
                        setOccupancyQuery('');
                      }}
                      className="text-[10px] font-black text-blue-600 hover:text-blue-800 underline uppercase tracking-widest"
                    >
                      Change
                    </button>
                  </div>
                )}
                {occupancyQuery && !inputs.occupancy && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {filteredOccupancies.map(occ => (
                      <button
                        key={occ.name}
                        onClick={() => {
                          setInputs(prev => ({ ...prev, occupancy: occ }));
                          setOccupancyQuery(occ.name);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                      >
                        <div className="font-bold text-slate-800 text-sm">{occ.name}</div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Code: {occ.categoryCode}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {inputs.pincode && (
            <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg inline-block">
              {inputs.pincode.district}, {inputs.pincode.state} (EQ Zone {inputs.pincode.eqZone})
            </div>
          )}
        </section>
      </div>

      {/* STEP 2: Assets */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" /> 2. Asset Values (Sum Insured)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Building', key: 'buildingSI', icon: Building2 },
            { label: 'Plant & Mach.', key: 'pmSI', icon: Factory },
            { label: 'Furniture/Fixt.', key: 'furnitureSI', icon: Sofa },
            { label: 'Stocks', key: 'stocksSI', icon: Package },
            { label: 'Other Assets', key: 'otherSI', icon: Plus },
          ].map((item) => (
            <div key={item.key} className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 uppercase tracking-tighter">
                 <item.icon className="w-3 h-3 text-slate-400" /> {item.label}
              </label>
              <input
                type="number"
                onChange={(e) => setInputs(prev => ({ ...prev, [item.key as any]: Number(e.target.value) }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-sm"
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* STEP 3: Risk Assessment */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <History className="w-4 h-4" /> 3. Risk Assessment & Validation
        </h3>
        
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <p className="font-bold text-slate-800 text-sm">Policy Status</p>
              <p className="text-xs text-slate-500 font-medium">New business or existing policy renewal?</p>
            </div>
            <div className="flex bg-slate-200 p-1 rounded-xl">
              <button 
                onClick={() => setInputs(prev => ({ ...prev, isRenewal: false }))}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${!inputs.isRenewal ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
              >
                Fresh Insurance
              </button>
              <button 
                onClick={() => setInputs(prev => ({ ...prev, isRenewal: true }))}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${inputs.isRenewal ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
              >
                Renewal
              </button>
            </div>
          </div>

          {inputs.isRenewal && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-colors ${inputs.hasClaims ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-400'}`}>
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">Claims in the last 3 years?</p>
                    <p className="text-xs text-slate-500 font-medium">Mandatory disclosure for renewals</p>
                  </div>
                </div>
                <button
                  onClick={() => setInputs(prev => ({ ...prev, hasClaims: !prev.hasClaims }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${inputs.hasClaims ? 'bg-amber-500' : 'bg-slate-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${inputs.hasClaims ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {inputs.hasClaims && (
                <div className="space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Total Premium Paid (Last 3 Years)</label>
                      <input
                        type="number"
                        onChange={(e) => setInputs(prev => ({ ...prev, pastPremium: Number(e.target.value) }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-bold text-sm"
                        placeholder="Enter amount"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Total Claim Amount Received (Last 3 Years)</label>
                      <input
                        type="number"
                        onChange={(e) => setInputs(prev => ({ ...prev, pastClaims: Number(e.target.value) }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-bold text-sm"
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>
                  
                  {/* LIVE CLAIM RATIO DISPLAY */}
                  <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${currentClaimRatio > 70 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                    <div className={`p-1.5 rounded-lg ${currentClaimRatio > 70 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      <History className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Live Claim Ratio</span>
                      <p className={`text-lg font-black leading-none ${currentClaimRatio > 70 ? 'text-red-700' : 'text-emerald-700'}`}>
                        {currentClaimRatio.toFixed(2)}%
                      </p>
                    </div>
                    {currentClaimRatio > 70 && (
                      <span className="ml-auto text-[10px] font-black text-red-600 uppercase bg-red-100 px-2 py-1 rounded-md animate-pulse">Threshold Exceeded</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Market Discount (%)</label>
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{inputs.discount}%</span>
              </div>
              <input
                type="range"
                min="0" max="80" step="5"
                value={inputs.discount}
                onChange={(e) => setInputs(prev => ({ ...prev, discount: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* STEP 4: Simplified Add-ons */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Plus className="w-4 h-4" /> 4. Optional Cover
          </h3>
          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">Terrorism Only</span>
        </div>

        {/* Terrorism Toggle (The only optional calculation cover) */}
        <button
          onClick={toggleTerrorism}
          className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all group ${
            inputs.selectedAddons.includes('terrorism')
              ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
              : 'bg-white border-slate-100 text-slate-700 hover:border-slate-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-xl transition-colors ${inputs.selectedAddons.includes('terrorism') ? 'bg-blue-500' : 'bg-slate-100 text-slate-400'}`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-black text-sm uppercase tracking-wider">Terrorism Cover</p>
              <p className={`text-[10px] font-medium opacity-80 ${inputs.selectedAddons.includes('terrorism') ? 'text-blue-100' : 'text-slate-500'}`}>
                Highly recommended for urban risk locations.
              </p>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            inputs.selectedAddons.includes('terrorism') ? 'bg-white border-white' : 'border-slate-200'
          }`}>
            {inputs.selectedAddons.includes('terrorism') && <Check className="w-4 h-4 text-blue-600 stroke-[4]" />}
          </div>
        </button>

        {/* Informational Standard Extensions List */}
        <div className="mt-8 space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Standard Extensions (Included based on eligibility)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {optionalAddons.filter(a => a.id !== 'terrorism').map((addon) => (
              <div key={addon.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-slate-700 leading-tight">{addon.name}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{addon.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
