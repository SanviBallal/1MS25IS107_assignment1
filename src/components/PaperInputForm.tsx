import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Link2, 
  Sparkles, 
  FileText, 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Loader2,
  BookOpen,
  Zap,
  Globe
} from 'lucide-react';
import { CuratedPaper } from '../types';

interface PaperInputFormProps {
  onAnalyze: (payload: { url: string; title: string; rawContent: string; studentFocus: string }) => void;
  isLoading: boolean;
}

export const PaperInputForm: React.FC<PaperInputFormProps> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [rawContent, setRawContent] = useState('');
  const [studentFocus, setStudentFocus] = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [curatedList, setCuratedList] = useState<CuratedPaper[]>([]);

  // Fetch curated seminal papers
  useEffect(() => {
    fetch('/api/curated-papers')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setCuratedList(data);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() && !title.trim() && !rawContent.trim()) return;
    onAnalyze({ url: url.trim(), title: title.trim(), rawContent: rawContent.trim(), studentFocus });
  };

  const handleSelectCurated = (paper: CuratedPaper) => {
    setUrl(paper.url);
    setTitle(paper.title);
    onAnalyze({ url: paper.url, title: paper.title, rawContent: '', studentFocus });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
        {/* Main Input Row */}
        <div>
          <label className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-indigo-400" />
              Academic Research Paper URL / arXiv Link
            </span>
            <span className="text-[11px] text-slate-500 normal-case">
              Supports arXiv, OpenReview, PapersWithCode, PDF or DOI
            </span>
          </label>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. https://arxiv.org/abs/2312.00752 (Mamba) or 1706.03762"
                className="w-full pl-4 pr-10 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
              />
              {url && (
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || (!url.trim() && !title.trim() && !rawContent.trim())}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Agent Parsing...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Extract Architecture</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Curated Seminal Papers Carousel */}
        {curatedList.length > 0 && (
          <div className="pt-1">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Quick Test with Seminal CS Papers:
              </span>
              <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">Click to parse immediately</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {curatedList.map((paper) => (
                <button
                  key={paper.id}
                  type="button"
                  onClick={() => handleSelectCurated(paper)}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 text-xs text-slate-300 hover:text-white transition flex items-center gap-2 group text-left"
                >
                  <span className="font-semibold text-slate-200 group-hover:text-indigo-300">
                    {paper.title.split(':')[0]}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                    {paper.year}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Student Specialization Focus Selector */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">Internship Focus Angle:</span>
          {[
            { id: 'all', label: 'Balanced CS Portfolio' },
            { id: 'edge', label: 'Edge & Mobile Deployment' },
            { id: 'quant', label: 'Quantization & Ultra-Low Bit' },
            { id: 'systems', label: 'CUDA & Systems / GPU IO' },
            { id: 'peft', label: 'PEFT & Finetuning' }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStudentFocus(f.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition ${
                studentFocus === f.id
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 font-medium'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Advanced Options Accordion (Title Search & Raw Excerpt Paste) */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span>{showAdvanced ? 'Hide Advanced Input (Title search or Raw Excerpt)' : 'Search by Paper Title or Paste Local Excerpt'}</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-3 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Paper Title or Research Query (if URL is unavailable)
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. BitNet b1.58 or FlashAttention-2"
                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1 flex items-center justify-between">
                  <span>Raw Paper Excerpt / Abstract / LaTeX</span>
                  <span className="text-[10px] text-slate-500 font-mono">Token efficiency prioritized</span>
                </label>
                <textarea
                  value={rawContent}
                  onChange={(e) => setRawContent(e.target.value)}
                  placeholder="Paste abstract, mathematical formulation, or paper excerpts here if paper is not on public arXiv..."
                  rows={3}
                  className="w-full p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
