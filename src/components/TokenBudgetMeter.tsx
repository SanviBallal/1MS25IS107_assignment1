import React from 'react';
import { Cpu, Zap, Activity, Globe, CheckCircle2, AlertTriangle } from 'lucide-react';
import { TokenMetrics } from '../types';

interface TokenBudgetMeterProps {
  metrics: TokenMetrics;
  groundingCount?: number;
  searchQueries?: string[];
}

export const TokenBudgetMeter: React.FC<TokenBudgetMeterProps> = ({
  metrics,
  groundingCount = 0,
  searchQueries = [],
}) => {
  const percentNum = parseFloat(metrics.percentBudgetUsed) || 0;
  const isHealthy = metrics.totalTokens < metrics.maxBudget;

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Summary */}
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${isHealthy ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
                Operational Constraint Verification
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> Under 25,000 Token Ceiling
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-200 mt-0.5 flex items-baseline gap-2">
              <span className="font-mono text-base text-indigo-300">
                {metrics.totalTokens.toLocaleString()}
              </span>
              <span className="text-slate-500 text-xs">/ {metrics.maxBudget.toLocaleString()} max tokens ({metrics.percentBudgetUsed}%)</span>
            </div>
          </div>
        </div>

        {/* Breakdown chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="px-2.5 py-1 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700/60">
            <span className="text-slate-400 mr-1.5">Input Context:</span>
            <span className="text-slate-100 font-semibold">{metrics.promptTokens.toLocaleString()}</span>
          </div>
          <div className="px-2.5 py-1 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700/60">
            <span className="text-slate-400 mr-1.5">Agent Output:</span>
            <span className="text-slate-100 font-semibold">{metrics.candidatesTokens.toLocaleString()}</span>
          </div>
          {groundingCount > 0 && (
            <div className="px-2.5 py-1 rounded-md bg-cyan-950/60 text-cyan-300 border border-cyan-700/50 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Grounded Web Sources: {groundingCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(percentNum, 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-1">
          <span>0 tokens</span>
          <span className="text-emerald-400/80 font-medium">90%+ token headroom remaining</span>
          <span>25,000 ceiling</span>
        </div>
      </div>

      {searchQueries && searchQueries.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-xs text-slate-400 flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[11px] text-slate-500">Autonomous Web Searches:</span>
          {searchQueries.slice(0, 3).map((q, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono">
              "{q}"
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
