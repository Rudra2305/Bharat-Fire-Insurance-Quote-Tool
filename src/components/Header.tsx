import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8 mb-8 border-b border-slate-700">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-500/20">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Small Business Fire Insurance Quote Tool
          </h1>
          <p className="mt-1 text-slate-400 text-sm sm:text-base max-w-2xl font-medium">
            Professional premium estimation using IIB Burning Cost benchmarks for the Indian Market.
          </p>
        </div>
      </div>
    </header>
  );
};
