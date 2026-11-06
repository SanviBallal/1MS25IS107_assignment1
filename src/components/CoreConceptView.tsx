import React, { useState } from 'react';
import { 
  FileText, 
  HelpCircle, 
  Lightbulb, 
  Calculator, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CoreConceptData } from '../types';

interface CoreConceptViewProps {
  coreConcept: CoreConceptData;
  paperTitle: string;
  authors?: string[];
  year?: string;
  arxivId?: string;
}

export const CoreConceptView: React.FC<CoreConceptViewProps> = ({
  coreConcept,
  paperTitle,
  authors,
  year,
  arxivId,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const wordCount = coreConcept.wordCount || 
    (coreConcept.fullSummary ? coreConcept.fullSummary.trim().split(/\s+/).filter(Boolean).length : 0);
  const isUnder300 = wordCount <= 300;

  const handleCopy = async () => {
    const textToCopy = `Paper: ${paperTitle}\n\nCORE CONCEPT EXTRACTION:\n${coreConcept.fullSummary || `${coreConcept.problemStatement}\n\n${coreConcept.primaryMethodology}\n\n${coreConcept.keyBreakthroughs}`}`;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = coreConcept.fullSummary || `${coreConcept.problemStatement}. ${coreConcept.primaryMethodology}. ${coreConcept.keyBreakthroughs}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      {/* Top Academic Context Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-mono font-medium rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                Core Concept Extraction
              </span>
              {arxivId && arxivId !== 'N/A' && (
                <a
                  href={`https://arxiv.org/abs/${arxivId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-0.5 text-xs font-mono rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition flex items-center gap-1 border border-slate-700"
                >
                  <span>arXiv:{arxivId}</span>
                </a>
              )}
              {year && (
                <span className="px-2 py-0.5 text-xs font-mono text-slate-400 bg-slate-800/80 rounded-md">
                  {year}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              {paperTitle}
            </h2>

            {authors && authors.length > 0 && (
              <p className="text-xs text-slate-400">
                <span className="text-slate-500 font-mono">Authors: </span>
                {authors.join(', ')}
              </p>
            )}
          </div>

          {/* Word Count and Controls */}
          <div className="flex flex-row md:flex-col items-end gap-2 shrink-0">
            <div className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 ${
              isUnder300 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              {isUnder300 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              <span>{wordCount} / 300 words</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSpeak}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                title={isSpeaking ? 'Stop Audio' : 'Listen to Core Concept'}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-indigo-400 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                title="Copy Core Concept Summary"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Triad: Problem, Methodology, Breakthroughs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Problem Statement */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:border-indigo-500/40 transition flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Step 1</span>
              <h4 className="text-sm font-semibold text-slate-200">The Problem Statement</h4>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed flex-1">
            {coreConcept.problemStatement || 'Identifies fundamental scalability, computational bottleneck, or memory hierarchy limits in existing systems.'}
          </p>
        </div>

        {/* 2. Primary Methodology */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:border-purple-500/40 transition flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Step 2</span>
              <h4 className="text-sm font-semibold text-slate-200">Primary Methodology</h4>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed flex-1">
            {coreConcept.primaryMethodology || 'Introduces novel architectural formulation and inductive biases that bypass prior computational trade-offs.'}
          </p>
        </div>

        {/* 3. Mathematical & Algorithmic Breakthroughs */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:border-cyan-500/40 transition flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Step 3</span>
              <h4 className="text-sm font-semibold text-slate-200">Key Breakthroughs</h4>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed flex-1">
            {coreConcept.keyBreakthroughs || 'Mathematical proof of linear complexity, hardware IO tiling, low-rank factorization, or algorithmic scaling properties.'}
          </p>
        </div>
      </div>

      {/* Synthesized Plain-Language Summary (Strictly Under 300 Words) */}
      <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/20 border border-slate-800 rounded-2xl p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Plain-Language Synthesis (Under 300 Words)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Target Audience: 3rd-Year CS Student / Researcher
          </span>
        </div>

        <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-line font-normal">
          {coreConcept.fullSummary || 
            `${coreConcept.problemStatement}\n\n${coreConcept.primaryMethodology}\n\n${coreConcept.keyBreakthroughs}`}
        </div>
      </div>
    </div>
  );
};
