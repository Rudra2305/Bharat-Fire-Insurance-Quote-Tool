import React, { useState, useEffect } from 'react';
import type { QuoteInputs } from '../utils/calculator';
import { pincodes, occupancies } from '../data/dataManager';
import { Search, MapPin, Building2, Factory, Package, Percent, ShieldAlert } from 'lucide-react';

interface CalculatorFormProps {
  onUpdate: (inputs: QuoteInputs) => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ onUpdate }) => {
  const [inputs, setInputs] = useState<QuoteInputs>({
    buildingSI: 0,
    pmSI: 0,
    stocksSI: 0,
    discount: 0,
    includeTerrorism: true,
    occupancy: null,
    pincode: null,
  });

  const [pincodeQuery, setPincodeQuery] = useState('');
  const [occupancyQuery, setOccupancyQuery] = useState('');

  useEffect(() => {
    onUpdate(inputs);
  }, [inputs, onUpdate]);

  const handlePincodeChange = (val: string) => {
    setPincodeQuery(val);
    if (val.length === 6) {
      const found = pincodes.find(p => p.pincode === val);
      if (found) {
        setInputs(prev => ({ ...prev, pincode: found }));
      } else {
        // Fallback for demo if not in list
        setInputs(prev => ({ ...prev, pincode: { pincode: val, state: 'Unknown', district: 'Unknown', eqZone: 3 } }));
      }
    } else {
      setInputs(prev => ({ ...prev, pincode: null }));
    }
  };

  const filteredOccupancies = occupancies.filter(occ => 
    occ.name.toLowerCase().includes(occupancyQuery.toLowerCase())
  );

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
      {/* Location Section */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <MapPin className="w-4 h-4" /> Risk Location
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <label className="text-sm font-semibold text-slate-700">Zone / Region</label>
            <div className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-500 font-medium">
              {inputs.pincode ? `${inputs.pincode.district}, ${inputs.pincode.state} (Zone ${inputs.pincode.eqZone})` : 'Enter PIN to fetch details'}
            </div>
          </div>
        </div>
      </section>

      {/* Occupancy Section */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Building2 className="w-4 h-4" /> Business Type
        </h3>
        <div className="space-y-1.5 relative">
          <label className="text-sm font-semibold text-slate-700">Search Occupancy</label>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={occupancyQuery}
              onChange={(e) => setOccupancyQuery(e.target.value)}
              placeholder="e.g. Textile, Engineering, Warehouse..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
          </div>
          {occupancyQuery && !inputs.occupancy && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
              {filteredOccupancies.map(occ => (
                <button
                  key={occ.name}
                  onClick={() => {
                    setInputs(prev => ({ ...prev, occupancy: occ }));
                    setOccupancyQuery(occ.name);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                >
                  <div className="font-bold text-slate-800">{occ.name}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-tight">Category: {occ.categoryCode} • Flexa: {occ.flexaRate}</div>
                </button>
              ))}
            </div>
          )}
          {inputs.occupancy && (
            <div className="mt-2 flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <span className="font-bold text-blue-900">{inputs.occupancy.name}</span>
              <button 
                onClick={() => {
                  setInputs(prev => ({ ...prev, occupancy: null }));
                  setOccupancyQuery('');
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 underline"
              >
                Change
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Sum Insured Section */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" /> Sum Insured (₹)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
               <Building2 className="w-3 h-3 text-slate-400" /> Building
            </label>
            <input
              type="number"
              onChange={(e) => setInputs(prev => ({ ...prev, buildingSI: Number(e.target.value) }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
              placeholder="0"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
               <Factory className="w-3 h-3 text-slate-400" /> P&M
            </label>
            <input
              type="number"
              onChange={(e) => setInputs(prev => ({ ...prev, pmSI: Number(e.target.value) }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
              placeholder="0"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
               <Package className="w-3 h-3 text-slate-400" /> Stocks
            </label>
            <input
              type="number"
              onChange={(e) => setInputs(prev => ({ ...prev, stocksSI: Number(e.target.value) }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
              placeholder="0"
            />
          </div>
        </div>
      </section>

      {/* Adjustments Section */}
      <section className="space-y-6 pt-4 border-t border-slate-100">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Percent className="w-4 h-4 text-blue-500" /> Discount on Flexa Rate
            </label>
            <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">{inputs.discount}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="5"
            value={inputs.discount}
            onChange={(e) => setInputs(prev => ({ ...prev, discount: Number(e.target.value) }))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <p className="text-[10px] text-slate-400 font-bold uppercase text-center">Market standard cap: 80%</p>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg transition-colors ${inputs.includeTerrorism ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-400'}`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">Include Terrorism Cover</p>
              <p className="text-xs text-slate-500 font-medium italic">Highly recommended for urban areas</p>
            </div>
          </div>
          <button
            onClick={() => setInputs(prev => ({ ...prev, includeTerrorism: !prev.includeTerrorism }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${inputs.includeTerrorism ? 'bg-blue-600' : 'bg-slate-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${inputs.includeTerrorism ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </section>
    </div>
  );
};
