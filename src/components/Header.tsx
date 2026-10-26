import React from 'react';
import { Sparkles, BarChart3, Columns2, Play, FileDown, RotateCcw, BrainCircuit } from 'lucide-react';

interface HeaderProps {
  activeTab: 'guided' | 'comparison' | 'simulator' | 'playground';
  setActiveTab: (tab: 'guided' | 'comparison' | 'simulator' | 'playground') => void;
  hasApiKey: boolean;
  onOpenExport: () => void;
  onReset: () => void;
  currentStage: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hasApiKey,
  onOpenExport,
  onReset,
  currentStage,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-3">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Laboratório de Melhoria de Agentes
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-full">
                  AI Studio Lab
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ciclos de Teste, Análise Crítica e Refinamento Estocástico de Agentes de IA
              </p>
            </div>
          </div>

          {/* Right Status & Actions */}
          <div className="flex items-center gap-2.5 self-end md:self-auto flex-wrap">
            <div
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                hasApiKey
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}
              title={
                hasApiKey
                  ? 'Conectado à API oficial do Gemini 3.8 Flash'
                  : 'Modo Didático ativo com simulações pedagógicas realistas e suporte à API'
              }
            >
              <span
                className={`w-2 h-2 rounded-full mr-1.5 ${
                  hasApiKey ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                }`}
              />
              {hasApiKey ? 'Gemini 3.8 Flash Ativo' : 'Laboratório Didático Interativo'}
            </div>

            <button
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Gerar e exportar relatório completo do grupo"
            >
              <FileDown className="w-3.5 h-3.5 text-blue-400" />
              <span>Relatório do Grupo</span>
            </button>

            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-800/60 text-slate-400 border border-slate-700 transition"
              title="Reiniciar etapas do laboratório"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-2 scrollbar-none text-sm">
          <button
            onClick={() => setActiveTab('guided')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
              activeTab === 'guided'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Oficina Guiada</span>
            <span className="px-1.5 py-0.2 bg-blue-900/60 text-blue-200 text-xs rounded-full font-mono">
              Etapa {currentStage}/4
            </span>
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
              activeTab === 'comparison'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Columns2 className="w-4 h-4 text-emerald-400" />
            <span>Comparador A/B</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Inspetor de Probabilidade (Softmax & Top-P)</span>
          </button>

          <button
            onClick={() => setActiveTab('playground')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
              activeTab === 'playground'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Play className="w-4 h-4 text-purple-400" />
            <span>Playground AI Studio Livre</span>
          </button>
        </div>
      </div>
    </header>
  );
};
