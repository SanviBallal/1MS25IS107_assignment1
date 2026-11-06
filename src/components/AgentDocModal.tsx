import React from 'react';
import { X, ShieldCheck, Terminal, Cpu, CheckCircle2 } from 'lucide-react';

interface AgentDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgentDocModal: React.FC<AgentDocModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Agent System Prompt & Constraints
              </h3>
              <p className="text-xs text-slate-400">
                Active Operational Specification for CS Research Agent
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs font-mono text-slate-300 leading-relaxed bg-slate-950">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="text-indigo-400 font-bold mb-2 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Cpu className="w-4 h-4" /> Agent Identity
            </h4>
            <p className="text-slate-300">
              "You are an advanced Computer Science Research Agent specializing in parsing academic papers, extracting system architectures, and identifying student development opportunities."
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <ShieldCheck className="w-4 h-4" /> Operational Constraints
            </h4>
            <ul className="space-y-2 text-slate-300 list-disc list-inside">
              <li>
                <strong className="text-slate-100">Token Efficiency:</strong> Total analysis and tool execution must strictly stay well under 25,000 tokens.
              </li>
              <li>
                <strong className="text-slate-100">Web Search Grounding:</strong> If paper is too long to ingest entirely, use Web Search tool to look up summaries, abstracts, and open-source implementations (e.g., GitHub).
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="text-cyan-400 font-bold mb-2 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <CheckCircle2 className="w-4 h-4" /> Execution Pipeline
            </h4>
            <ol className="space-y-3 text-slate-300 list-decimal list-inside">
              <li>
                <strong className="text-slate-100">CORE CONCEPT EXTRACTION:</strong> Summarize the problem statement, primary methodology introduced, and key mathematical/algorithmic breakthroughs in under 300 words using plain, accessible language.
              </li>
              <li>
                <strong className="text-slate-100">ARCHITECTURAL FLOWCHART (Mermaid.js):</strong> Generate a clean, syntactically correct Mermaid.js flowchart (graph TD) charting components, data inputs, model layers, and data outputs. Output as a clear text segment labeled [FLOWCHART].
              </li>
              <li>
                <strong className="text-slate-100">FUTURE WORK & INTERNSHIP OPPORTUNITIES:</strong> Brainstorm 3 concrete, realistic ways a 3rd-year CS student could build upon, extend, or optimize this paper for a resume project (exact extension, targeted performance metric, recommended tech stack).
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
