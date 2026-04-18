import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { CalculatorForm } from './components/CalculatorForm';
import { QuoteSummary } from './components/QuoteSummary';
import { calculateQuote } from './utils/calculator';
import type { QuoteInputs, QuoteResult } from './utils/calculator';

function App() {
  const [result, setResult] = useState<QuoteResult | null>(null);

  const handleUpdate = useCallback((inputs: QuoteInputs) => {
    const newResult = calculateQuote(inputs);
    setResult(newResult);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-col gap-2 mb-2">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Configure Your Risk</h2>
              <p className="text-slate-500 font-medium">Provide the asset values and location details to generate an accurate benchmark quote.</p>
            </div>
            <CalculatorForm onUpdate={handleUpdate} />
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <div className="flex flex-col gap-2 mb-2">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Quote Summary</h2>
              <p className="text-slate-500 font-medium">Estimated premiums based on current tariff rates.</p>
            </div>
            <QuoteSummary result={result} />
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-8 border-t border-slate-200">
        <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} Fire Insurance Quote Tool • Built for the Indian Market
        </p>
      </footer>
    </div>
  );
}

export default App;
