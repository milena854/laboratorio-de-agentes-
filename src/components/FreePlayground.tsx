import React, { useState } from 'react';
import { Play, Sparkles, Sliders, History, RefreshCw, Copy, Check, Terminal } from 'lucide-react';
import { WORKSHOP_CHALLENGES } from '../data/workshopPresets';
import { GenerationResult } from '../types';

interface FreePlaygroundProps {
  onGenerate: (
    prompt: string,
    temperature: number,
    topP: number,
    systemInstruction?: string
  ) => Promise<GenerationResult | void>;
  isLoading: boolean;
  history: GenerationResult[];
}

export const FreePlayground: React.FC<FreePlaygroundProps> = ({
  onGenerate,
  isLoading,
  history,
}) => {
  const [prompt, setPrompt] = useState('Explique como funciona um loop for em Python com uma analogia simples.');
  const [systemInstruction, setSystemInstruction] = useState('Você é um tutor pedagógico amigável focado em alunos do primeiro ano do ensino médio.');
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleApplyChallenge = (challenge: typeof WORKSHOP_CHALLENGES[0], type: 'bad' | 'good') => {
    if (type === 'bad') {
      setPrompt(challenge.badPrompt);
      setTemperature(challenge.badTemp);
      setTopP(challenge.badTopP);
    } else {
      setPrompt(challenge.goodPrompt);
      setTemperature(challenge.goodTemp);
      setTopP(challenge.goodTopP);
    }
  };

  const handleRun = async () => {
    await onGenerate(prompt, temperature, topP, systemInstruction);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const playgroundHistory = history.filter((h) => h.stage === 'playground' || h.stage === 1 || h.stage === 3);
  const latestResult = playgroundHistory[0];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-400/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Playground Livre de Experimentação</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Laboratório Avançado de Prompts & Agentes
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              Use a interface completa do Google AI Studio para testar novos desafios, instruir papéis (System Instructions) e validar hipóteses de refinamento.
            </p>
          </div>
        </div>

        {/* Quick Challenge Buttons */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs pb-1">
          <span className="text-slate-400 whitespace-nowrap font-medium">Desafios Prontos:</span>
          {WORKSHOP_CHALLENGES.map((ch) => (
            <div key={ch.id} className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700 shrink-0">
              <span className="text-slate-300 font-semibold px-2">{ch.title}</span>
              <button
                onClick={() => handleApplyChallenge(ch, 'bad')}
                className="px-2 py-0.5 rounded text-[11px] bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition"
                title="Carregar versão caótica (Alta Temp)"
              >
                Caótico (T:{ch.badTemp})
              </button>
              <button
                onClick={() => handleApplyChallenge(ch, 'good')}
                className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition"
                title="Carregar versão refinada (Baixa Temp)"
              >
                Refinado (T:{ch.goodTemp})
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            {/* System Instruction */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>System Instructions (Persona / Papel do Agente)</span>
                </label>
                <button
                  onClick={() => setSystemInstruction('')}
                  className="text-[11px] text-slate-500 hover:text-slate-300"
                >
                  Limpar
                </button>
              </div>
              <textarea
                value={systemInstruction}
                onChange={(e) => setSystemInstruction(e.target.value)}
                rows={2}
                placeholder="Ex: Você é um professor socrático que responde em tópicos curtos..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
              />
            </div>

            {/* Prompt Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                User Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder="Digite o prompt que o agente receberá..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sliders */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-400" />
                  <span>Configuração de Hiperparâmetros</span>
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Modelo: gemini-3.8-flash
                </span>
              </div>

              {/* Temp Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Temperatura</span>
                  <span className="font-mono text-amber-400 font-bold">{temperature.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Top-P Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Top-P</span>
                  <span className="font-mono text-cyan-400 font-bold">{topP.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.05"
                  value={topP}
                  onChange={(e) => setTopP(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleRun}
              disabled={isLoading || !prompt.trim()}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Processando resposta...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white text-white" />
                  <span>Executar Agente no AI Studio</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results & History Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm min-h-[420px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                  <span>Última Execução</span>
                </h3>
                {latestResult && (
                  <button
                    onClick={() => handleCopyText(latestResult.output, latestResult.id)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition"
                  >
                    {copiedId === latestResult.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {latestResult ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      T: {latestResult.config.temperature}
                    </span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      Top-P: {latestResult.config.topP}
                    </span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {latestResult.timestamp}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap max-h-[340px] overflow-y-auto">
                    {latestResult.output}
                  </div>
                </div>
              ) : (
                <div className="h-64 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-6 text-center text-slate-500">
                  <Terminal className="w-8 h-8 text-slate-600 mb-2" />
                  <p className="text-sm font-medium text-slate-400">Nenhuma execução registrada</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Escreva um prompt ou clique em um desafio acima para testar.
                  </p>
                </div>
              )}
            </div>

            {/* History mini list */}
            {playgroundHistory.length > 1 && (
              <div className="pt-4 mt-4 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-2">
                  <History className="w-3.5 h-3.5" />
                  <span>Histórico Recente ({playgroundHistory.length} testes)</span>
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
                  {playgroundHistory.slice(1, 5).map((h) => (
                    <div
                      key={h.id}
                      className="p-2 rounded-lg bg-slate-950 border border-slate-800 min-w-[200px] max-w-[240px] shrink-0 space-y-1"
                    >
                      <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                        <span>T: {h.config.temperature}</span>
                        <span>{h.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-2">{h.prompt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
