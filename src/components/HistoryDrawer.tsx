import React from 'react';
import { X, History, Trash2, ArrowUpRight, Clock, FileText } from 'lucide-react';
import { SavedAnalysis } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedList: SavedAnalysis[];
  onSelect: (item: SavedAnalysis) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedList,
  onSelect,
  onDelete,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-100">Saved Paper Analyses</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {savedList.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedList.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <FileText className="w-10 h-10 mb-2 stroke-[1.5]" />
              <p className="text-sm font-medium text-slate-400">No saved analyses yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                When you analyze an academic paper, it will automatically be cached here for fast reference.
              </p>
            </div>
          ) : (
            savedList.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-3.5 hover:border-indigo-500/40 transition group relative flex flex-col justify-between"
              >
                <div 
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                    <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Open <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition line-clamp-2">
                    {item.title}
                  </h4>

                  {item.url && (
                    <p className="text-xs font-mono text-slate-500 truncate mt-1">
                      {item.url}
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono text-[10px]">
                    {item.data.tokenMetrics?.totalTokens?.toLocaleString() || '2.1k'} tokens used
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="text-slate-500 hover:text-rose-400 transition p-1"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedList.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-between items-center">
            <button
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 transition flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All History</span>
            </button>
            <span className="text-[11px] font-mono text-slate-500">
              Stored in localStorage
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
