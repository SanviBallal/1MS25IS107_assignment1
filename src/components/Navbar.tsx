import React from 'react';
import { Cpu, Terminal, History, ShieldCheck, Sparkles, BookOpen, ExternalLink } from 'lucide-react';

interface NavbarProps {
  onOpenHistory: () => void;
  historyCount: number;
  onReset: () => void;
  onOpenDocModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenHistory,
  historyCount,
  onReset,
  onOpenDocModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Agent Identity */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onReset}
            className="flex items-center gap-3 group text-left transition"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-100 tracking-tight flex items-center gap-1.5">
                  Scholar<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">Architect</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider uppercase rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  CS Research Agent
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Academic Paper Parser • Architecture Flowcharts • Student Resume Opportunities
              </p>
            </div>
          </button>
        </div>

        {/* Operational Constraints Badge & Actions */}
        <div className="flex items-center gap-3">
          {/* Token Constraint Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-400">Budget:</span>
            <span className="text-emerald-400 font-semibold">&lt; 25,000 tokens</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Grounded Search
            </span>
          </div>

          {/* Agent Spec Info */}
          <button
            onClick={onOpenDocModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
            title="View Agent System Constraints & Prompt"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Agent Spec</span>
          </button>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition relative"
            title="Analysis History"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Saved Papers</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold bg-indigo-500 text-white rounded-full ml-0.5">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
