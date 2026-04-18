import React from 'react';
import type { QuoteResult } from '../utils/calculator';
import { Info, TrendingDown, ShieldPlus } from 'lucide-react';

interface QuoteSummaryProps {
  result: QuoteResult | null;
}

export const QuoteSummary: React.FC<QuoteSummaryProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center h-full">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
          <ShieldPlus className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Ready for your quote?</h3>
        <p className="text-slate-500 mt-2 max-w-xs">Enter your pincode, occupancy, and sum insured details to see a real-time estimate.</p>
      </div>
    );
  }

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Policy Type Badge */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
        <div className="bg-blue-600 p-2 rounded-lg shrink-0">
          <ShieldPlus className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Policy Classification</span>
          <h3 className="text-xl font-bold text-blue-900 leading-tight">{result.policyType}</h3>
          <p className="text-sm text-blue-700 mt-1">Based on Total Sum Insured of {formatCurrency(result.totalSI)}</p>
        </div>
      </div>

      {/* Main Quote Card */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 px-8 py-6 flex justify-between items-center text-white">
          <span className="text-lg font-bold opacity-80 uppercase tracking-widest text-xs">Premium Summary</span>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/10 backdrop-blur-sm">
             <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
             <span className="text-[10px] font-bold tracking-wider">REAL-TIME QUOTE</span>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-slate-600 font-medium flex items-center gap-2">
                Net Flexa Premium <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded uppercase">Rate: {result.netFlexaRate.toFixed(4)}</span>
              </span>
              <span className="text-slate-900 font-bold">{formatCurrency(result.flexaPremium)}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-slate-600 font-medium flex items-center gap-2">
                STFI Premium <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded uppercase">Rate: {result.stfiRate.toFixed(4)}</span>
              </span>
              <span className="text-slate-900 font-bold">{formatCurrency(result.stfiPremium)}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-slate-600 font-medium flex items-center gap-2">
                Earthquake (EQ) Premium <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded uppercase">Rate: {result.eqRate.toFixed(4)}</span>
              </span>
              <span className="text-slate-900 font-bold">{formatCurrency(result.eqPremium)}</span>
            </div>
            {result.terrorismPremium > 0 && (
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  Terrorism Premium <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded uppercase">Rate: {result.terrorismRate.toFixed(4)}</span>
                </span>
                <span className="text-slate-900 font-bold">{formatCurrency(result.terrorismPremium)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-800 font-bold">Net Premium</span>
              <span className="text-slate-900 font-extrabold text-lg">{formatCurrency(result.netPremium)}</span>
            </div>

            <div className="flex justify-between items-center pb-6 border-b border-slate-100 text-slate-500 text-sm">
              <span>Goods & Services Tax (GST 18%)</span>
              <span>{formatCurrency(result.gst)}</span>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-6 flex flex-col items-center">
            <span className="text-emerald-700 font-bold uppercase tracking-widest text-xs mb-1">Estimated Total Premium</span>
            <div className="text-4xl sm:text-5xl font-black text-emerald-900 flex items-center gap-2">
              <span className="text-2xl opacity-50 font-medium mt-2">₹</span>
              {new Intl.NumberFormat('en-IN').format(Math.round(result.totalPremium))}
            </div>
            <p className="text-emerald-600 text-xs mt-3 font-medium uppercase tracking-wide">Inclusive of all taxes and add-ons</p>
          </div>
        </div>
      </div>

      {/* Negotiation Tip */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex gap-4 shadow-sm">
        <div className="bg-amber-100 p-2 rounded-lg shrink-0 h-fit">
          <TrendingDown className="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <h4 className="text-amber-900 font-bold text-sm">Negotiation Insight</h4>
          <p className="text-amber-800 text-sm mt-1 leading-relaxed">
            This quote uses <strong>IIB Burning Cost benchmarks</strong>. If your current broker or insurer provides a quote significantly higher than this, use these figures to negotiate a better deal. These benchmarks are standard for the Indian market.
          </p>
        </div>
      </div>
      
      <div className="bg-slate-100 rounded-2xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 leading-normal font-medium">
          Note: Final premiums may vary based on specific insurer policy wording, deductibles, and risk inspection reports.
        </p>
      </div>
    </div>
  );
};
