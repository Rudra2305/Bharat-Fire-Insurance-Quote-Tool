import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { CalculatorForm } from './components/CalculatorForm';
import { QuoteSummary } from './components/QuoteSummary';
import { calculateQuote } from './utils/calculator';
import type { QuoteInputs, QuoteResult } from './utils/calculator';
import { Linkedin, Github, MessageSquare, Heart } from 'lucide-react';

function App() {
  const [result, setResult] = useState<QuoteResult | null>(null);

  const handleUpdate = useCallback((inputs: QuoteInputs) => {
    const newResult = calculateQuote(inputs);
    setResult(newResult);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-10">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-col gap-2 mb-2">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Configure Your Risk</h2>
              <p className="text-slate-500 font-medium text-sm">Provide the asset values and location details to generate an accurate benchmark quote.</p>
            </div>
            <CalculatorForm onUpdate={handleUpdate} />
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <div className="flex flex-col gap-2 mb-2">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Quote Summary</h2>
              <p className="text-slate-500 font-medium text-sm">Estimated premiums based on current tariff rates.</p>
            </div>
            <QuoteSummary result={result} />
          </div>
        </div>
      </main>

      {/* Branded Footer */}
      <footer className="mt-20 py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-2">Creator & Insurance Advisor</p>
            <h3 className="text-xl font-black text-slate-900 leading-none">Shiva Yadav</h3>
            <p className="mt-2 text-slate-500 text-sm font-medium">Helping businesses find the right coverage at the right price.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://wa.me/918770365124" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black border border-emerald-100 hover:bg-emerald-100 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" /> WHATSAPP
            </a>
            <a 
              href="https://www.linkedin.com/in/shiva-yadav-016429161/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-black border border-blue-100 hover:bg-blue-100 transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" /> LINKEDIN
            </a>
            <a 
              href="https://github.com/Rudra2305/Bharat-Fire-Insurance-Quote-Tool" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-full text-xs font-black border border-slate-100 hover:bg-slate-100 transition-colors"
            >
              <Github className="w-3.5 h-3.5" /> GITHUB
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-50 flex justify-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for the Indian Insurance Market
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
