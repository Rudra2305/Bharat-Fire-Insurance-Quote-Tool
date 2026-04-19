import React from 'react';
import type { QuoteResult } from '../utils/calculator';
import { Info, TrendingDown, ShieldPlus, AlertTriangle, FileText, CheckCircle2, MessageSquare, Linkedin } from 'lucide-react';

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

  // ADVISORY CARD FOR HIGH CLAIM RATIO (>70%)
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

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">General Guidelines</h4>
              <ul className="space-y-3">
                {[
                  "This risk requires a manual technical audit by a senior underwriter.",
                  "Standard Bharat Sookshma/Laghu automated rates are not applicable."
                ].map((step, i) => (
                  <li key={i} className="flex gap-3 text-xs text-slate-700 font-semibold">
                    <div className="bg-slate-100 p-1 rounded-md h-fit mt-0.5">
                      <FileText className="w-3 h-3 text-slate-500" />
                    </div>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Policy Type Badge */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
        <div className="bg-emerald-600 p-2 rounded-lg shrink-0">
          <CheckCircle2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Underwriting Approved</span>
          <h3 className="text-lg font-bold text-emerald-900 leading-tight">{result.policyType}</h3>
          <p className="text-xs text-emerald-700 mt-1 font-medium">Sum Insured: {formatCurrency(result.totalSI)}</p>
        </div>
      </div>

      {/* Main Quote Card */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 px-8 py-5 flex justify-between items-center text-white">
          <span className="text-xs font-black opacity-80 uppercase tracking-widest">Premium Breakdown</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full border border-white/10 backdrop-blur-sm">
             <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
             <span className="text-[9px] font-bold tracking-wider uppercase">Live Quote</span>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <div className="flex flex-col">
                <span className="text-slate-500 font-bold uppercase tracking-tighter text-xs">Flexa Premium</span>
                <span className="text-[10px] text-blue-600 font-bold tracking-widest">RATE: {result.netFlexaRate.toFixed(4)}</span>
              </div>
              <span className="text-slate-900 font-bold">{formatCurrency(result.flexaPremium)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex flex-col">
                <span className="text-slate-500 font-bold uppercase tracking-tighter text-xs">STFI Premium</span>
                <span className="text-[10px] text-blue-600 font-bold tracking-widest">RATE: {result.stfiRate.toFixed(4)}</span>
              </div>
              <span className="text-slate-900 font-bold">{formatCurrency(result.stfiPremium)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex flex-col">
                <span className="text-slate-500 font-bold uppercase tracking-tighter text-xs">EQ Premium</span>
                <span className="text-[10px] text-blue-600 font-bold tracking-widest">RATE: {result.eqRate.toFixed(4)}</span>
              </div>
              <span className="text-slate-900 font-bold">{formatCurrency(result.eqPremium)}</span>
            </div>
            {result.terrorismPremium > 0 && (
              <div className="flex justify-between items-center text-sm">
                <div className="flex flex-col">
                  <span className="text-slate-500 font-bold uppercase tracking-tighter text-xs">Terrorism</span>
                  <span className="text-[10px] text-blue-600 font-bold tracking-widest">RATE: {result.terrorismRate.toFixed(4)}</span>
                </div>
                <span className="text-slate-900 font-bold">{formatCurrency(result.terrorismPremium)}</span>
              </div>
            )}
            
            <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between items-center">
              <span className="text-slate-800 font-black uppercase text-xs">Net Premium</span>
              <span className="text-slate-900 font-black text-xl">{formatCurrency(result.netPremium)}</span>
            </div>

            <div className="flex justify-between items-center text-slate-400 text-[11px] font-bold uppercase">
              <span>GST (18%)</span>
              <span>{formatCurrency(result.gst)}</span>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 flex flex-col items-center shadow-lg">
            <span className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-1">Total Payable Premium</span>
            <div className="text-4xl font-black text-white flex items-center gap-1">
              <span className="text-xl opacity-40 font-medium">₹</span>
              {new Intl.NumberFormat('en-IN').format(Math.round(result.totalPremium))}
            </div>
          </div>
        </div>
      </div>

      {/* Professional Call to Action */}
      <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20 space-y-4">
        <h4 className="font-black text-sm uppercase tracking-wider italic underline decoration-blue-400 underline-offset-4">Optimize Your Quote</h4>
        <p className="text-xs font-semibold leading-relaxed text-blue-100">
          Want to negotiate this premium or find a better insurer? Reach out to Shiva for a final quote tailored exactly to your requirements.
        </p>
        <div className="flex gap-3 pt-2">
           <a href="https://wa.me/918770365124" className="flex-1 flex items-center justify-center gap-2 py-2 bg-white text-blue-600 text-[10px] font-black rounded-xl hover:bg-blue-50 transition-colors uppercase">
              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
            </a>
            <a href="https://www.linkedin.com/in/shiva-yadav-7618b516a" className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-500 text-white text-[10px] font-black rounded-xl hover:bg-blue-400 transition-colors uppercase border border-blue-400">
              <Linkedin className="w-3.5 h-3.5" /> Profile
            </a>
        </div>
      </div>

      {/* Negotiation Tip */}
      <div className="bg-slate-100 rounded-2xl p-5 flex gap-4">
        <TrendingDown className="w-5 h-5 text-slate-500 shrink-0 mt-1" />
        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-wide leading-relaxed">
          Benchmark Insight: Claim Ratio is <span className="text-blue-600">{(result.claimRatio || 0).toFixed(1)}%</span>. These IIB figures are standard for negotiation with brokers.
        </p>
      </div>
    </div>
  );
};
