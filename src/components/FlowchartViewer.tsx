import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Copy, 
  Check, 
  Code, 
  Eye, 
  Layers, 
  Maximize2, 
  Sparkles,
  Info,
  AlertCircle
} from 'lucide-react';

interface FlowchartViewerProps {
  mermaidCode: string;
  rawFlowchartText?: string;
  paperTitle?: string;
}

export const FlowchartViewer: React.FC<FlowchartViewerProps> = ({
  mermaidCode,
  rawFlowchartText,
  paperTitle = 'System Architecture',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentCode, setCurrentCode] = useState<string>(mermaidCode);
  const [selectedNodeInfo, setSelectedNodeInfo] = useState<{ id: string; label: string } | null>(null);

  // Initialize mermaid configuration
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'JetBrains Mono, monospace',
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
        curve: 'basis',
        nodeSpacing: 50,
        rankSpacing: 60,
      },
      themeVariables: {
        darkMode: true,
        background: '#090d16',
        primaryColor: '#4f46e5',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#6366f1',
        lineColor: '#818cf8',
        secondaryColor: '#0e7490',
        tertiaryColor: '#1e293b',
        mainBkg: '#1e1b4b',
        nodeBorder: '#818cf8',
        clusterBkg: '#0f172a',
        clusterBorder: '#334155',
        edgeLabelBackground: '#090d16',
        textColor: '#e2e8f0',
      },
    });
  }, []);

  // Sanitize mermaid code for bulletproof rendering
  const sanitizeMermaidCode = (code: string): string => {
    let clean = code.trim();
    // Remove markdown code fences if any
    clean = clean.replace(/^```(?:mermaid)?/i, '').replace(/```$/i, '').trim();

    // Ensure it starts with graph TD or TB
    if (!clean.startsWith('graph ') && !clean.startsWith('flowchart ')) {
      clean = `graph TD\n${clean}`;
    }

    // Fix unescaped parentheses inside brackets like [Layer (d_model=512)] -> [Layer d_model=512]
    clean = clean.replace(/\[([^\]]*)\(([^)]*)\)([^\]]*)\]/g, '["$1($2)$3"]');

    return clean;
  };

  // Render diagram whenever code changes
  useEffect(() => {
    setCurrentCode(mermaidCode);
  }, [mermaidCode]);

  useEffect(() => {
    let isMounted = true;

    async function renderChart() {
      if (!currentCode) return;
      setError(null);

      const clean = sanitizeMermaidCode(currentCode);
      const uniqueId = `mermaid-chart-${Date.now()}`;

      try {
        const { svg } = await mermaid.render(uniqueId, clean);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        console.warn('Mermaid rendering issue, attempting fallback sanitize:', err);
        // Fallback: try basic graph TD
        try {
          const simplified = clean
            .split('\n')
            .filter(line => !line.includes('classDef') && !line.includes('style '))
            .join('\n');
          const { svg } = await mermaid.render(`${uniqueId}-fallback`, simplified);
          if (isMounted) {
            setSvgContent(svg);
          }
        } catch (secondErr: any) {
          if (isMounted) {
            setError(secondErr.message || 'Could not parse Mermaid syntax.');
          }
        }
      }
    }

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [currentCode]);

  // Attach click listener to nodes inside rendered SVG
  useEffect(() => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) return;

    const nodeElements = svgEl.querySelectorAll('.node');
    nodeElements.forEach(node => {
      node.classList.add('cursor-pointer', 'transition', 'hover:brightness-125');
      node.addEventListener('click', () => {
        const textContent = node.textContent?.trim() || '';
        const id = node.id || 'Layer';
        setSelectedNodeInfo({ id, label: textContent });
      });
    });
  }, [svgContent]);

  // Handlers
  const handleZoomIn = () => setScale(s => Math.min(s + 0.2, 2.5));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.2, 0.4));
  const handleResetZoom = () => setScale(1);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSVG = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${paperTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_architecture.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl flex flex-col">
      {/* Top Header & Toolbar */}
      <div className="px-5 py-3.5 border-b border-slate-800/80 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              System Architecture Flowchart
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Mermaid.js (graph TD)
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive pipeline mapping components, tensor shapes, model blocks, and outputs
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 mr-1">
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] font-mono text-slate-400 select-none">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition border-l border-slate-800"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Toggle Edit */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
              isEditing 
                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200' 
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
            title="Edit Mermaid Code"
          >
            {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'View Diagram' : 'Edit Syntax'}</span>
          </button>

          {/* Copy Mermaid */}
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
            title="Copy Mermaid.js Syntax"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Export SVG */}
          <button
            onClick={handleDownloadSVG}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
            title="Download SVG Diagram"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export SVG</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="relative min-h-[480px] max-h-[640px] flex-1 overflow-auto bg-slate-950/70 p-6 flex items-center justify-center">
        {/* Background Grid Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {error ? (
          <div className="max-w-md p-5 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-200 text-sm">
            <div className="flex items-center gap-2 font-semibold text-rose-300 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span>Mermaid Syntax Warning</span>
            </div>
            <p className="text-xs text-rose-300/80 mb-3">{error}</p>
            <p className="text-xs text-slate-400">
              You can click "Edit Syntax" in the top bar to inspect or adjust the Mermaid code directly.
            </p>
          </div>
        ) : isEditing ? (
          <div className="w-full h-full p-2">
            <textarea
              value={currentCode}
              onChange={(e) => setCurrentCode(e.target.value)}
              className="w-full h-[400px] bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
              placeholder="graph TD..."
            />
          </div>
        ) : (
          <div 
            ref={containerRef}
            className="mermaid-container transition-transform duration-200 origin-center flex items-center justify-center w-full"
            style={{ transform: `scale(${scale})` }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}
      </div>

      {/* Interactive Node Inspector Banner */}
      <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-950/90 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          {selectedNodeInfo ? (
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-medium">Selected Layer:</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-semibold border border-indigo-500/30">
                {selectedNodeInfo.label}
              </span>
            </div>
          ) : (
            <span>Tip: Click on any component or layer in the diagram to inspect its pipeline stage. Use mouse wheel or buttons to zoom.</span>
          )}
        </div>
        <div className="font-mono text-[11px] text-slate-500">
          Strict Format: [FLOWCHART] • graph TD
        </div>
      </div>
    </div>
  );
};
