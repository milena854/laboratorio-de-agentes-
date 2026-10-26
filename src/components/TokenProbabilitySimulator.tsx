import React, { useState, useMemo } from 'react';
import { BarChart3, Dice5, Sliders, Info, Zap, Sparkles, Filter, RefreshCw } from 'lucide-react';
import { SAMPLE_TOKENS_FOR_SIMULATION } from '../data/workshopPresets';
import { computeTokenProbabilities } from '../utils/probability';

export const TokenProbabilitySimulator: React.FC = () => {
  const [temperature, setTemperature] = useState(1.5);
  const [topP, setTopP] = useState(0.95);
  const [sampledToken, setSampledToken] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  // Compute live probabilities
  const { tokens, entropy, effectiveTokenCount } = useMemo(() => {
    return computeTokenProbabilities(SAMPLE_TOKENS_FOR_SIMULATION, temperature, topP);
  }, [temperature, topP]);

  // Roll a stochastic sample based on finalProb
  const handleRollSample = () => {
    setIsRolling(true);
    setSampledToken(null);

    setTimeout(() => {
      const rand = Math.random();
      let cumulative = 0;
      let picked = tokens[0]?.token || 'uma caixa';

      for (const t of tokens) {
        if (!t.isIncludedInTopP) continue;
        cumulative += t.finalProb;
        if (rand <= cumulative) {
          picked = t.token;
          break;
        }
      }

      setSampledToken(picked);
      setIsRolling(false);
    }, 400);
  };

  const handleSetPresetEtapa1 = () => {
    setTemperature(1.5);
    setTopP(0.95);
  };

  const handleSetPresetEtapa3 = () => {
    setTemperature(0.2);
    setTopP(0.2);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Inspetor Interativo de Amostragem (Sampling Inspector)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              O que a Temperatura e o Top-P realmente fazem com os Tokens?
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              Modelos de linguagem não &ldquo;pensam&rdquo;: a cada palavra, eles calculam uma distribuição de probabilidades sobre milhares de tokens. 
              Mova os controles abaixo e veja a curva matemática se transformar em tempo real!
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSetPresetEtapa1}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition"
            >
              Simular Etapa 1 (1.5 / 0.95)
            </button>
            <button
              onClick={handleSetPresetEtapa3}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition"
            >
              Simular Etapa 3 (0.2 / 0.2)
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders & Sampling Machine */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Controles de Amostragem</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Entropia: {entropy.toFixed(2)} bits
              </span>
            </div>

            {/* Prompt context */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-500 font-mono block mb-1">Frase gerada até o momento:</span>
              <span className="text-slate-200 font-semibold font-mono text-sm bg-slate-900 px-2 py-1 rounded inline-block">
                &ldquo;Uma variável em Python é...&rdquo;
              </span>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-200 font-medium flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Temperatura (T)
                </span>
                <span className="font-mono text-amber-400 font-bold text-sm">{temperature.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.1 (Pico afiado no #1)</span>
                <span>1.0 (Softmax padrão)</span>
                <span>2.0 (Quase uniforme / Caos)</span>
              </div>
            </div>

            {/* Top-P Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-200 font-medium flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-cyan-400" />
                  Top-P (Nucleus Sampling)
                </span>
                <span className="font-mono text-cyan-400 font-bold text-sm">{topP.toFixed(2)}</span>
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
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.05 (Apenas o topo)</span>
                <span>0.50 (Corte de 50%)</span>
                <span>1.0 (Sem nenhum corte)</span>
              </div>
            </div>

            {/* Live Token Sampler Button */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <button
                onClick={handleRollSample}
                disabled={isRolling}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {isRolling ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sorteando token estocástico...</span>
                  </>
                ) : (
                  <>
                    <Dice5 className="w-4 h-4" />
                    <span>🎲 Sortear Próximo Token com estas Probabilidades!</span>
                  </>
                )}
              </button>

              {sampledToken && (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-500/40 text-center animate-in fade-in duration-300">
                  <span className="text-[11px] text-indigo-300 block mb-1">Token Sorteado:</span>
                  <span className="text-lg font-mono font-bold text-white bg-indigo-900/60 px-3 py-1 rounded-lg border border-indigo-400/40 inline-block shadow">
                    &ldquo;{sampledToken}&rdquo;
                  </span>
                  <p className="text-[11px] text-slate-300 mt-2">
                    Frase completada: &ldquo;Uma variável em Python é
                    <strong className="text-indigo-200"> {sampledToken}</strong>...&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Summary Pill */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Resumo do Estado Matemático</span>
            </div>
            <ul className="space-y-1 list-disc list-inside text-slate-300">
              <li>
                Tokens no núcleo ativo: <strong>{effectiveTokenCount} de {tokens.length}</strong>
              </li>
              <li>
                Tokens descartados pelo corte Top-P: <strong>{tokens.length - effectiveTokenCount}</strong>
              </li>
              <li>
                Grau de imprevisibilidade (Entropia): <strong>{entropy > 2 ? 'Alto (Caótico)' : 'Baixo (Previsível)'}</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Dynamic Probability Bar Chart */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Distribuição de Probabilidades dos Próximos Tokens Candidatos</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Pós-Softmax & Top-P</span>
            </div>

            <div className="space-y-2.5">
              {tokens.map((tokenObj, idx) => {
                const percent = Math.round(tokenObj.finalProb * 100);
                const rawPercent = Math.round(tokenObj.rawSoftmax * 100);
                const isSelectedSample = sampledToken === tokenObj.token;

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border transition-all ${
                      isSelectedSample
                        ? 'bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-500/50'
                        : tokenObj.isIncludedInTopP
                        ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-950/30 border-slate-900 opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-slate-500 w-4">#{idx + 1}</span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-xs ${
                            tokenObj.isIncludedInTopP
                              ? 'bg-slate-800 text-white'
                              : 'line-through text-slate-500'
                          }`}
                        >
                          &ldquo;{tokenObj.token}&rdquo;
                        </span>
                        <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">
                          — {tokenObj.meaning}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-xs">
                        {tokenObj.isIncludedInTopP ? (
                          <span className="font-bold text-emerald-400 text-sm">
                            {percent}%
                          </span>
                        ) : (
                          <span className="text-[10px] text-rose-400 font-bold bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-800/40">
                            CORTADO
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 hidden md:inline">
                          (bruto: {rawPercent}%)
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          !tokenObj.isIncludedInTopP
                            ? 'bg-slate-700'
                            : percent > 50
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : percent > 20
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
                            : 'bg-gradient-to-r from-amber-500 to-orange-400'
                        }`}
                        style={{ width: `${Math.max(2, percent)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>Alta Probabilidade</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Aleatoriedade</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span>Cortado pelo Top-P</span>
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Logits base calculados sobre modelo de linguagem
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
