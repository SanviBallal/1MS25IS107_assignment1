import React from 'react';
import { 
  Briefcase, 
  Target, 
  Layers, 
  Terminal, 
  Code2, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight, 
  Calendar,
  Sparkles,
  Award,
  Loader2
} from 'lucide-react';
import { StudentOpportunity } from '../types';

interface StudentOpportunitiesViewProps {
  opportunities: StudentOpportunity[];
  paperTitle: string;
  onGenerateScaffold: (opportunity: StudentOpportunity) => void;
  scaffoldingId: number | null;
}

export const StudentOpportunitiesView: React.FC<StudentOpportunitiesViewProps> = ({
  opportunities,
  paperTitle,
  onGenerateScaffold,
  scaffoldingId,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/60 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                <Briefcase className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-semibold uppercase text-indigo-400 tracking-wider">
                Future Work & Internship Opportunities
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-100 tracking-tight">
              3 High-Impact Resume Projects for 3rd-Year CS Students
            </h3>
            <p className="text-xs text-slate-400 max-w-2xl">
              Concrete architectural extensions engineered to showcase systems, ML engineering, and performance optimization skills during technical interviews.
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
            <span className="text-indigo-400 font-bold">{opportunities.length}</span> Extensions Formulated
          </div>
        </div>
      </div>

      {/* 3 Opportunity Cards */}
      <div className="grid grid-cols-1 gap-6">
        {opportunities.map((opp, idx) => {
          const isScaffoldingThis = scaffoldingId === opp.id;

          return (
            <div 
              key={opp.id || idx}
              className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-6 hover:border-indigo-500/40 transition-all shadow-lg hover:shadow-indigo-500/5 relative overflow-hidden flex flex-col justify-between"
            >
              {/* Top Row: Index Badge, Title, Difficulty */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/60">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-mono font-bold text-xs">
                    0{idx + 1}
                  </span>
                  <h4 className="text-base font-bold text-slate-100">
                    {opp.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[11px] font-mono rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {opp.difficulty || 'Accessible for 3rd Year'}
                  </span>
                  {opp.estimatedWeeks && (
                    <span className="px-2.5 py-0.5 text-[11px] font-mono rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {opp.estimatedWeeks}
                    </span>
                  )}
                </div>
              </div>

              {/* Core Requirements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                {/* 1. Exact Extension */}
                <div className="bg-slate-950/60 border border-slate-800/70 rounded-xl p-4 flex flex-col">
                  <div className="flex items-center gap-2 text-indigo-400 mb-2">
                    <Layers className="w-4 h-4" />
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider">
                      The Exact Extension
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed flex-1">
                    {opp.exactExtension}
                  </p>
                </div>

                {/* 2. Targeted Performance Metric */}
                <div className="bg-slate-950/60 border border-slate-800/70 rounded-xl p-4 flex flex-col">
                  <div className="flex items-center gap-2 text-cyan-400 mb-2">
                    <Target className="w-4 h-4" />
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider">
                      Targeted Performance Metric
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-mono flex-1">
                    {opp.targetedPerformanceMetric}
                  </p>
                </div>

                {/* 3. Recommended Tech Stack */}
                <div className="bg-slate-950/60 border border-slate-800/70 rounded-xl p-4 flex flex-col">
                  <div className="flex items-center gap-2 text-purple-400 mb-2">
                    <Terminal className="w-4 h-4" />
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider">
                      Recommended Tech Stack
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {(Array.isArray(opp.recommendedTechStack) 
                      ? opp.recommendedTechStack 
                      : (opp.recommendedTechStack as string).split(',')
                    ).map((tech, tIdx) => (
                      <span 
                        key={tIdx}
                        className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Resume Bullet Point & Action Footer */}
              <div className="pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/40 -mx-6 -mb-6 p-6 rounded-b-2xl">
                <div className="flex items-start gap-2.5 max-w-2xl">
                  <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                      Resume STAR Bullet (Copy for SWE/ML Intern Application)
                    </span>
                    <p className="text-xs text-slate-300 italic mt-0.5">
                      "{opp.resumeBullet || `Engineered an optimized architectural variant utilizing ${opp.exactExtension.split(' ').slice(0, 5).join(' ')}, targeting ${opp.targetedPerformanceMetric}.`}"
                    </p>
                  </div>
                </div>

                {/* Action CTA: Generate Project Scaffold */}
                <button
                  onClick={() => onGenerateScaffold(opp)}
                  disabled={isScaffoldingThis}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition disabled:opacity-50 shrink-0"
                >
                  {isScaffoldingThis ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating Scaffold...</span>
                    </>
                  ) : (
                    <>
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Generate Starter Code</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
