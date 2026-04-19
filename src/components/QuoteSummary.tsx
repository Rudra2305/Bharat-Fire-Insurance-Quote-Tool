import React, { useState } from 'react';
import type { QuoteResult } from '../utils/calculator';
import { standardPerils } from '../data/perils';
import { 
  Info, TrendingDown, ShieldPlus, AlertTriangle, FileText, CheckCircle2, 
  MessageSquare, Linkedin, ChevronDown, ChevronUp, ShieldCheck 
} from 'lucide-react';

interface QuoteSummaryProps {
  result: QuoteResult | null;
}

export const QuoteSummary: React.FC<QuoteSummaryProps> = ({ result }) => {
  const [showPerils, setShowPerils] = useState(false);

  if (!result) {
    return (
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center h-full">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
          <ShieldPlus className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Ready for your quote?</h3>
        <p className="text-slate-500 mt-2 max-w-xs text-sm">Enter your business details and asset values to generate a real-time estimate.</p>
      </div>
    );
  }

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      maximumFractionDigits: 0 
    }).format(val || 0);

  if (result.isBlocked) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white border-2 border-red-100 rounded-[2rem] overflow-hidden shadow-2xl shadow-red-500/10">
          <div className="bg-red-600 px-8 py-6 flex items-center gap-3 text-white">
            <AlertTriangle className="w-8 h-8 animate-pulse" />
            <h3 className="text-xl font-black uppercase tracking-tight">Technical Underwriting Advisory</h3>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
              <span className="text-sm font-bold text-red-900">Calculated Claim Ratio</span>
              <span className="text-2xl font-black text-red-600">{(result.claimRatio || 0).toFixed(2)}%</span>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              Your 3-year Incurred Claim Ratio is <strong className="text-red-600">{(result.claimRatio || 0).toFixed(2)}%</strong>. 
              Based on Indian market standards (IIB guidelines), this exceeds the <strong className="text-slate-900">70% threshold</strong> for automated quoting.
            </p>

            <div className="bg-slate-900 p-6 rounded-2xl space-y-4">
              <h4 className="text-white font-bold text-sm">Reach out to Shiva for further negotiation</h4>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                High-claim risks require manual technical auditing. Shiva can help prepare your "Loss Mitigation Report" to secure a manual quote from top insurers.
              </p>
              <div className="flex gap-3">
                <a href="https://wa.me/918770365124" className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-500 text-white text-[10px] font-black rounded-lg hover:bg-emerald-600 transition-colors uppercase">
                  <MessageSquare className="w-3 h-3" /> WhatsApp
                </a>
                <a href="https://www.linkedin.com/in/shiva-yadav-7618b516a" className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white text-[10px] font-black rounded-lg hover:bg-blue-700 transition-colors uppercase">
                  <Linkedin className="w-3 h-3" /> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* SUM INSURED DISPLAY (LARGE & PROMINENT) */}
      <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Total Sum Insured (SI)</span>
          <div className="text-4xl sm:text-5xl font-black mt-1 flex items-baseline gap-1">
            <span className="text-2xl opacity-40 font-medium italic">₹</span>
            {new Intl.NumberFormat('en-IN').format(result.totalSI)}
          </div>
          <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full w-fit backdrop-blur-sm border border-white/10">
             <CheckCircle2 className="w-3.5 h-3.5 text-blue-200" />
             <span className="text-[10px] font-black uppercase tracking-wider">{result.policyType}</span>
          </div>
        </div>
        <ShieldCheck className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 rotate-12" />
      </div>

      {/* Main Quote Card */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 px-8 py-4 flex justify-between items-center text-white">
          <span className="text-[10px] font-black opacity-80 uppercase tracking-widest">Premium Breakdown</span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/10 rounded-full border border-white/10 backdrop-blur-sm">
             <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
             <span className="text-[8px] font-bold tracking-wider uppercase">Live</span>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <div className="flex flex-col">
                <span className="text-slate-500 font-bold uppercase tracking-tighter text-xs">Flexa Premium</span>
                <span className="text-[9px] text-blue-600 font-bold tracking-widest">RATE: {result.netFlexaRate.toFixed(4)}</span>
              </div>
              <span className="text-slate-900 font-bold">{formatCurrency(result.flexaPremium)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex flex-col">
                <span className="text-slate-500 font-bold uppercase tracking-tighter text-xs">STFI Premium</span>
                <span className="text-[9px] text-blue-600 font-bold tracking-widest">RATE: {result.stfiRate.toFixed(4)}</span>
              </div>
              <span className="text-slate-900 font-bold">{formatCurrency(result.stfiPremium)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex flex-col">
                <span className="text-slate-500 font-bold uppercase tracking-tighter text-xs">EQ Premium</span>
                <span className="text-[9px] text-blue-600 font-bold tracking-widest">RATE: {result.eqRate.toFixed(4)}</span>
              </div>
              <span className="text-slate-900 font-bold">{formatCurrency(result.eqPremium)}</span>
            </div>
            {result.terrorismPremium > 0 && (
              <div className="flex justify-between items-center text-sm">
                <div className="flex flex-col">
                  <span className="text-slate-500 font-bold uppercase tracking-tighter text-xs">Terrorism</span>
                  <span className="text-[9px] text-blue-600 font-bold tracking-widest">RATE: {result.terrorismRate.toFixed(4)}</span>
                </div>
                <span className="text-slate-900 font-bold">{formatCurrency(result.terrorismPremium)}</span>
              </div>
            )}
            
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-slate-800 font-black uppercase text-[10px]">Net Premium</span>
              <span className="text-slate-900 font-black text-lg">{formatCurrency(result.netPremium)}</span>
            </div>

            <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase">
              <span>GST (18%)</span>
              <span>{formatCurrency(result.gst)}</span>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 flex flex-col items-center shadow-lg relative">
            <span className="text-slate-400 font-black uppercase tracking-widest text-[9px] mb-1">Total Payable Premium</span>
            <div className="text-4xl font-black text-white flex items-center gap-1">
              <span className="text-xl opacity-40 font-medium">₹</span>
              {new Intl.NumberFormat('en-IN').format(Math.round(result.totalPremium))}
            </div>
            
            <div className="mt-4 pt-3 border-t border-white/5 w-full flex flex-col items-center">
               <div className="flex items-center gap-1.5">
                 <ShieldCheck className="w-3 h-3 text-amber-500" />
                 <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Compulsory Excess</span>
               </div>
               <p className="text-[11px] font-bold text-white/70 mt-0.5">{result.compulsoryDeductible}</p>
            </div>
          </div>
        </div>
      </div>

      {/* WHAT IS COVERED? (EXPANDABLE) */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <button 
          onClick={() => setShowPerils(!showPerils)}
          className="w-full px-6 py-3 flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">What is Covered?</span>
          </div>
          {showPerils ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
        </button>
        
        {showPerils && (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in slide-in-from-top-2 duration-300">
            {standardPerils.map((peril) => (
              <div key={peril.name} className="flex gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="bg-white p-1.5 rounded-lg h-fit shadow-sm">
                  <peril.icon className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-900">{peril.name}</p>
                  <p className="text-[8px] text-slate-500 font-medium leading-tight mt-0.5">{peril.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Professional Call to Action */}
      <div className="bg-blue-600 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-500/20 space-y-4">
        <h4 className="font-black text-xs uppercase tracking-wider italic underline decoration-blue-400 underline-offset-4">Optimize Your Quote</h4>
        <p className="text-[11px] font-semibold leading-relaxed text-blue-100">
          Want to negotiate this premium or find a better insurer? Reach out to Shiva for a final quote tailored exactly to your requirements.
        </p>
        <div className="flex gap-3 pt-1">
           <a href="https://wa.me/918770365124" className="flex-1 flex items-center justify-center gap-2 py-2 bg-white text-blue-600 text-[10px] font-black rounded-xl hover:bg-blue-50 transition-colors uppercase">
              <MessageSquare className="w-3 h-3" /> WhatsApp
            </a>
            <a href="https://www.linkedin.com/in/shiva-yadav-7618b516a" className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-500 text-white text-[10px] font-black rounded-xl hover:bg-blue-400 transition-colors uppercase border border-blue-400">
              <Linkedin className="w-3 h-3" /> Profile
            </a>
        </div>
      </div>
    </div>
  );
};
