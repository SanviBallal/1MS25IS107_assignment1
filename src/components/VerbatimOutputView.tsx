import React, { useState } from 'react';
import { Terminal, Copy, Check, FileDown, CheckCircle2 } from 'lucide-react';

interface VerbatimOutputViewProps {
  verbatimText: string;
  paperTitle: string;
}

export const VerbatimOutputView: React.FC<VerbatimOutputViewProps> = ({
  verbatimText,
  paperTitle,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(verbatimText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([verbatimText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${paperTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_agent_analysis.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Console Header */}
      <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <div className="h-4 w-px bg-slate-800"></div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Verbatim Research Agent Output (Operational Format)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Raw Output'}</span>
          </button>
          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>.txt</span>
          </button>
        </div>
      </div>

      {/* Console Output Body */}
      <div className="p-6 overflow-x-auto max-h-[640px] overflow-y-auto">
        <pre className="font-mono text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-indigo-500 selection:text-white">
          {verbatimText}
        </pre>
      </div>

      {/* Footer Status */}
      <div className="px-5 py-2.5 bg-slate-900/60 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 flex items-center justify-between">
        <span>Segments: CORE CONCEPT EXTRACTION • [FLOWCHART] (graph TD) • FUTURE WORK & INTERNSHIP OPPORTUNITIES</span>
        <span className="text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Validated Format
        </span>
      </div>
    </div>
  );
};
