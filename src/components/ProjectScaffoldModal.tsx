import React, { useState } from 'react';
import { 
  X, 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Award, 
  FolderGit2, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { ProjectScaffold } from '../types';

interface ProjectScaffoldModalProps {
  scaffold: ProjectScaffold | null;
  onClose: () => void;
}

export const ProjectScaffoldModal: React.FC<ProjectScaffoldModalProps> = ({
  scaffold,
  onClose,
}) => {
  if (!scaffold) return null;

  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedBullets, setCopiedBullets] = useState(false);

  const activeFile = scaffold.files?.[activeFileIndex] || { path: 'model.py', code: '' };

  const handleCopyCurrentFile = async () => {
    await navigator.clipboard.writeText(activeFile.code);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleCopyResumeBullets = async () => {
    const bullets = (scaffold.resumeBulletPoints || []).map(b => `• ${b}`).join('\n');
    await navigator.clipboard.writeText(bullets);
    setCopiedBullets(true);
    setTimeout(() => setCopiedBullets(false), 2000);
  };

  const handleDownloadAll = () => {
    // Download current file or prompt
    const blob = new Blob([activeFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.path;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100 font-mono">
                  {scaffold.repoName || 'student-paper-extension'}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Student Starter Scaffold
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {scaffold.tagline || scaffold.architectureOverview}
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

        {/* Content Tabs & Explorer */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File sidebar */}
          <div className="w-full md:w-56 bg-slate-950/90 border-r border-slate-800 p-3 space-y-1">
            <span className="text-[11px] font-mono uppercase text-slate-500 px-3 py-1 block">
              Generated Files
            </span>
            {scaffold.files?.map((file, idx) => (
              <button
                key={file.path}
                onClick={() => setActiveFileIndex(idx)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono transition text-left ${
                  activeFileIndex === idx
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{file.path}</span>
              </button>
            ))}

            {/* Resume Bullets Section in Sidebar */}
            <div className="pt-4 mt-3 border-t border-slate-800">
              <span className="text-[11px] font-mono uppercase text-slate-500 px-3 py-1 block flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-400" /> Resume Bullets
              </span>
              <div className="px-3 py-2 text-xs text-slate-300 space-y-2">
                <p className="text-[11px] text-slate-400">
                  Ready-to-use STAR bullets for your technical internship resume:
                </p>
                <button
                  onClick={handleCopyResumeBullets}
                  className="w-full py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono flex items-center justify-center gap-1.5 transition border border-slate-700"
                >
                  {copiedBullets ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBullets ? 'Copied Bullets' : 'Copy All Bullets'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col bg-slate-950/60 overflow-hidden">
            {/* File toolbar */}
            <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                <span className="text-slate-500">file:</span>
                <span className="font-semibold text-indigo-300">{activeFile.path}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCurrentFile}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition border border-slate-700"
                >
                  {copiedFile ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedFile ? 'Copied' : 'Copy File'}</span>
                </button>
                <button
                  onClick={handleDownloadAll}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition border border-slate-700"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Code content */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-200 bg-slate-950">
              <pre className="whitespace-pre-wrap">{activeFile.code}</pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Engineered for 3rd-year CS portfolio demonstration</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
