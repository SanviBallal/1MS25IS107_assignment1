/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  FileText, 
  Briefcase, 
  Terminal, 
  Download, 
  Share2, 
  Sparkles, 
  Check, 
  AlertCircle, 
  ArrowUpRight,
  ExternalLink,
  Code,
  RotateCcw
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { PaperInputForm } from './components/PaperInputForm';
import { TokenBudgetMeter } from './components/TokenBudgetMeter';
import { FlowchartViewer } from './components/FlowchartViewer';
import { CoreConceptView } from './components/CoreConceptView';
import { StudentOpportunitiesView } from './components/StudentOpportunitiesView';
import { VerbatimOutputView } from './components/VerbatimOutputView';
import { ProjectScaffoldModal } from './components/ProjectScaffoldModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { AgentDocModal } from './components/AgentDocModal';
import { 
  PaperAnalysisResponse, 
  SavedAnalysis, 
  StudentOpportunity, 
  ProjectScaffold 
} from './types';

export default function App() {
  const [activeAnalysis, setActiveAnalysis] = useState<PaperAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'flowchart' | 'core-concept' | 'opportunities' | 'verbatim'>('flowchart');
  
  // Scaffold modal state
  const [scaffoldModalData, setScaffoldModalData] = useState<ProjectScaffold | null>(null);
  const [scaffoldingId, setScaffoldingId] = useState<number | null>(null);

  // History & Docs drawers
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [savedHistory, setSavedHistory] = useState<SavedAnalysis[]>([]);
  const [copiedReport, setCopiedReport] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('scholar_architect_history');
      if (stored) {
        setSavedHistory(JSON.parse(stored));
      }
    } catch {}
  }, []);

  // Save history helper
  const saveToHistory = (analysis: PaperAnalysisResponse, title: string, url: string) => {
    try {
      const newEntry: SavedAnalysis = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        timestamp: Date.now(),
        title: title || analysis.structuredData?.paperTitle || 'Academic Paper Analysis',
        url: url || '',
        data: analysis,
      };

      setSavedHistory(prev => {
        const filtered = prev.filter(item => item.title !== newEntry.title).slice(0, 15);
        const updated = [newEntry, ...filtered];
        localStorage.setItem('scholar_architect_history', JSON.stringify(updated));
        return updated;
      });
    } catch {}
  };

  // Analyze Paper Handler
  const handleAnalyzePaper = async (payload: {
    url: string;
    title: string;
    rawContent: string;
    studentFocus: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setLoadingStep('Ingesting academic paper context & verifying token budget...');

    try {
      setLoadingStep('Searching web citations & extracting model layers...');
      const response = await fetch('/api/analyze-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Failed to analyze paper');
      }

      setLoadingStep('Compiling Mermaid architecture flowchart & student extensions...');
      const data: PaperAnalysisResponse = await response.json();
      setActiveAnalysis(data);
      saveToHistory(data, data.structuredData?.paperTitle || payload.title || payload.url, payload.url);
      setActiveTab('flowchart');
    } catch (err: any) {
      console.error('Error analyzing paper:', err);
      setError(err.message || 'An unexpected error occurred during paper extraction.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Generate Project Scaffold Handler
  const handleGenerateScaffold = async (opportunity: StudentOpportunity) => {
    if (!activeAnalysis) return;
    setScaffoldingId(opportunity.id);

    try {
      const res = await fetch('/api/generate-project-scaffold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunity,
          paperTitle: activeAnalysis.structuredData?.paperTitle || 'Academic Paper',
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Failed to generate scaffold');
      }

      const scaffoldData: ProjectScaffold = await res.json();
      setScaffoldModalData(scaffoldData);
    } catch (err: any) {
      alert(`Could not generate scaffold: ${err.message}`);
    } finally {
      setScaffoldingId(null);
    }
  };

  // Export full markdown report
  const handleExportMarkdown = () => {
    if (!activeAnalysis) return;
    const { structuredData, mermaidGraph, tokenMetrics } = activeAnalysis;

    const mdContent = `# Academic Paper Architecture Analysis: ${structuredData.paperTitle}
**Authors:** ${structuredData.paperAuthors?.join(', ')}  
**Year:** ${structuredData.paperYear}  
**arXiv ID:** ${structuredData.arxivId || 'N/A'}  
**Token Efficiency:** ${tokenMetrics?.totalTokens} / ${tokenMetrics?.maxBudget} tokens (${tokenMetrics?.percentBudgetUsed}% used)

---

## 1. CORE CONCEPT EXTRACTION (<300 words)
${structuredData.coreConcept?.fullSummary}

### Detailed Breakdown
* **Problem Statement:** ${structuredData.coreConcept?.problemStatement}
* **Primary Methodology:** ${structuredData.coreConcept?.primaryMethodology}
* **Key Algorithmic Breakthroughs:** ${structuredData.coreConcept?.keyBreakthroughs}

---

## 2. ARCHITECTURAL FLOWCHART (Mermaid.js)
\`\`\`mermaid
${mermaidGraph}
\`\`\`

---

## 3. FUTURE WORK & INTERNSHIP OPPORTUNITIES (3rd-Year CS Student Resume Projects)
${structuredData.studentOpportunities?.map((op, i) => `
### Opportunity ${i + 1}: ${op.title}
* **The Exact Extension:** ${op.exactExtension}
* **Targeted Performance Metric:** ${op.targetedPerformanceMetric}
* **Recommended Tech Stack:** ${Array.isArray(op.recommendedTechStack) ? op.recommendedTechStack.join(', ') : op.recommendedTechStack}
* **Resume STAR Bullet:** ${op.resumeBullet}
* **Estimated Timeline:** ${op.estimatedWeeks}
`).join('\n')}

---
*Generated by ScholarArchitect CS Research Agent*
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(structuredData.paperTitle || 'paper').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = async () => {
    if (!activeAnalysis) return;
    await navigator.clipboard.writeText(activeAnalysis.verbatimOutput);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={savedHistory.length}
        onReset={() => setActiveAnalysis(null)}
        onOpenDocModal={() => setIsDocModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Paper Input & Quick Seminal Papers Selector */}
        <PaperInputForm onAnalyze={handleAnalyzePaper} isLoading={isLoading} />

        {/* Loading Progress State */}
        {isLoading && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
              <Sparkles className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-100">
                CS Research Agent Executing Pipeline
              </h4>
              <p className="text-xs font-mono text-slate-400 mt-1 max-w-md mx-auto">
                {loadingStep}
              </p>
            </div>
            <div className="max-w-xs mx-auto">
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-xl flex items-start gap-3 text-rose-200 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-rose-300">Analysis Error</h5>
              <p className="text-xs text-rose-200/80 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Results Workspace */}
        {activeAnalysis && !isLoading && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Operational Token Constraint Meter */}
            <TokenBudgetMeter
              metrics={activeAnalysis.tokenMetrics}
              groundingCount={activeAnalysis.grounding?.sourcesCount}
              searchQueries={activeAnalysis.grounding?.queries}
            />

            {/* Navigation Tabs & Report Actions */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Tab Pills */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveTab('flowchart')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition ${
                    activeTab === 'flowchart'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Architecture Flowchart</span>
                </button>

                <button
                  onClick={() => setActiveTab('core-concept')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition ${
                    activeTab === 'core-concept'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Core Concept (&lt;300w)</span>
                </button>

                <button
                  onClick={() => setActiveTab('opportunities')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition ${
                    activeTab === 'opportunities'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Student Resume Projects</span>
                  <span className="w-4 h-4 rounded-full bg-indigo-400/20 text-indigo-300 text-[10px] flex items-center justify-center font-bold">
                    3
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('verbatim')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition ${
                    activeTab === 'verbatim'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>Raw Agent Output</span>
                </button>
              </div>

              {/* Action Buttons: Export Report */}
              <div className="flex items-center gap-2 px-1">
                <button
                  onClick={handleCopyMarkdown}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
                  title="Copy formatted agent analysis"
                >
                  {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedReport ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleExportMarkdown}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 transition"
                  title="Export Markdown Report"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Report (.md)</span>
                </button>
              </div>
            </div>

            {/* Tab Views */}
            {activeTab === 'flowchart' && (
              <FlowchartViewer
                mermaidCode={activeAnalysis.mermaidGraph}
                paperTitle={activeAnalysis.structuredData?.paperTitle}
              />
            )}

            {activeTab === 'core-concept' && (
              <CoreConceptView
                coreConcept={activeAnalysis.structuredData?.coreConcept}
                paperTitle={activeAnalysis.structuredData?.paperTitle}
                authors={activeAnalysis.structuredData?.paperAuthors}
                year={activeAnalysis.structuredData?.paperYear}
                arxivId={activeAnalysis.structuredData?.arxivId}
              />
            )}

            {activeTab === 'opportunities' && (
              <StudentOpportunitiesView
                opportunities={activeAnalysis.structuredData?.studentOpportunities || []}
                paperTitle={activeAnalysis.structuredData?.paperTitle}
                onGenerateScaffold={handleGenerateScaffold}
                scaffoldingId={scaffoldingId}
              />
            )}

            {activeTab === 'verbatim' && (
              <VerbatimOutputView
                verbatimText={activeAnalysis.verbatimOutput}
                paperTitle={activeAnalysis.structuredData?.paperTitle}
              />
            )}
          </div>
        )}

        {/* Empty State / Welcome Splash */}
        {!activeAnalysis && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold">
                01
              </div>
              <h4 className="text-base font-bold text-slate-100">
                Core Concept Extraction
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Condenses dense 30-page academic papers into problem statements, novel methodologies, and mathematical breakthroughs in under 300 words.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold">
                02
              </div>
              <h4 className="text-base font-bold text-slate-100">
                Mermaid.js System Architecture
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Renders clean, interactive <code className="font-mono text-indigo-300">graph TD</code> flowcharts mapping tensor inputs, encoders/decoders, selective state blocks, and outputs with SVG export.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold">
                03
              </div>
              <h4 className="text-base font-bold text-slate-100">
                3rd-Year CS Student Resume Projects
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Formulates 3 actionable extensions with exact extensions, performance metrics, and recommended tech stacks (PyTorch, ONNX, TensorRT, Triton) plus runnable code scaffolds.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Code Scaffold Modal */}
      <ProjectScaffoldModal
        scaffold={scaffoldModalData}
        onClose={() => setScaffoldModalData(null)}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedList={savedHistory}
        onSelect={(item) => setActiveAnalysis(item.data)}
        onDelete={(id) => {
          const updated = savedHistory.filter(h => h.id !== id);
          setSavedHistory(updated);
          localStorage.setItem('scholar_architect_history', JSON.stringify(updated));
        }}
        onClearAll={() => {
          setSavedHistory([]);
          localStorage.removeItem('scholar_architect_history');
        }}
      />

      {/* Agent Documentation Modal */}
      <AgentDocModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 mt-12 bg-slate-950/60 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>ScholarArchitect Agent</span>
            <span>•</span>
            <span className="text-emerald-400">Strictly Under 25,000 Tokens</span>
            <span>•</span>
            <span>Gemini Flash</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>arXiv Grounding</span>
            <span>•</span>
            <span>Mermaid.js graph TD</span>
            <span>•</span>
            <span>CS Portfolio Scaffold</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
