import React, { useState } from 'react';
import { Sliders, Play, ArrowRight, ArrowLeft, CheckCircle, RefreshCw, Info, Lock } from 'lucide-react';
import { GenerationResult } from '../types';

interface StepThreeProps {
  onGenerate: (prompt: string, temperature: number, topP: number) => Promise<void>;
  isLoading: boolean;
  result: GenerationResult | null;
  onProceedToComparison: () => void;
  onBackToStepTwo: () => void;
}

export const StepThree: React.FC<StepThreeProps> = ({
  onGenerate,
  isLoading,
  result,
  onProceedToComparison,
  onBackToStepTwo,
}) => {
  const defaultStep3Prompt =
    'Explique o que é variável em Python em linguagem simples para um estudante iniciante. Dê uma definição curta, um exemplo simples e uma explicação objetiva. Não fale de assuntos que não foram perguntados.';

  const [prompt, setPrompt] = useState(defaultStep3Prompt);
  const [temperature, setTemperature] = useState(0.2);
  const [topP, setTopP] = useState(0.2);
  const [showAdvanced, setShowAdvanced] = useState(true);

  const handleApplyPreset = () => {
    setPrompt(defaultStep3Prompt);
    setTemperature(0.2);
    setTopP(0.2);
  };

  const handleRun = async () => {
    await onGenerate(prompt, temperature, topP);
  };

  const wordCount = result?.output ? result.output.trim().split(/\s+/).length : 0;
  const charCount = result?.output ? result.output.length : 0;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-start justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-2">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Etapa 3: Primeiro Refinamento Técnico</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Especificidade de Prompt & Controle Estocástico
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              Agora corrigimos os problemas da Etapa 1 aplicando a tríade de ouro da engenharia de prompts:
              <strong> público-alvo definido</strong>, <strong>estrutura explícita</strong> e <strong>restrições negativas</strong>, combinadas com 
              <strong> temperatura (0.2)</strong> e <strong>top-p (0.2)</strong> para máxima fidelidade.
            </p>
          </div>

          <button
            onClick={handleApplyPreset}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 transition shrink-0 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restaurar Valores da Etapa 3</span>
          </button>
        </div>

        {/* 3 Pillars of Refinement */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
            <span className="font-bold text-emerald-300 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Público & Tom
            </span>
            <p className="text-slate-300 text-[11px]">
              &ldquo;...em linguagem simples para um estudante iniciante.&rdquo;
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
            <span className="font-bold text-cyan-300 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Formato & Estrutura
            </span>
            <p className="text-slate-300 text-[11px]">
              &ldquo;Dê uma definição curta, um exemplo simples e uma explicação objetiva.&rdquo;
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
            <span className="font-bold text-amber-300 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Restrição Negativa
            </span>
            <p className="text-slate-300 text-[11px]">
              &ldquo;Não fale de assuntos que não foram perguntados.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Main Form & Output Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Refined Prompt & Advanced Settings */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <span>Prompt Refinado</span>
                <span className="text-xs text-emerald-400 font-semibold">(Etapa 3)</span>
              </label>
              <button
                type="button"
                onClick={handleApplyPreset}
                className="text-xs text-blue-400 hover:text-blue-300 transition"
              >
                Restaurar prompt sugerido
              </button>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm leading-relaxed"
              placeholder="Digite o prompt refinado..."
            />

            {/* AI Studio Parameters Panel */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Painel do AI Studio: Configuração de Controle Estocástico</span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Temp: {temperature.toFixed(2)} | Top-P: {topP.toFixed(2)}
                </span>
              </div>

              {/* Temperature Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-200 font-medium flex items-center gap-1">
                    Temperatura (Temperature)
                    <span className="text-emerald-400 font-bold ml-1">→ 0.2</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">{temperature.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span className="text-emerald-400 font-bold">0.2 (Alvo da Etapa 3: Foco Alto)</span>
                  <span>1.0</span>
                  <span>1.5 (Etapa 1 anterior)</span>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="pt-2 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-xs text-cyan-400 font-semibold flex items-center gap-1 hover:text-cyan-300 transition"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Painel Lateral Direito: &ldquo;Advanced Settings&rdquo;</span>
                  </button>
                  <span className="text-[10px] text-slate-400">Nucleus Sampling</span>
                </div>

                {showAdvanced && (
                  <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-200 font-medium flex items-center gap-1">
                        Top-P
                        <span className="text-cyan-400 font-bold ml-1">→ 0.2</span>
                      </span>
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
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span className="text-cyan-400 font-bold">0.2 (Corta 80% dos tokens imprevisíveis)</span>
                      <span>0.95</span>
                      <span>1.0</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRun}
              disabled={isLoading || !prompt.trim()}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Gerando resposta com alta precisão (Temp 0.2, Top-P 0.2)...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white text-white" />
                  <span>Gerar Resposta Refinada (Etapa 3)</span>
                </>
              )}
            </button>
          </div>

          {/* Educational Note */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Por que Top-P = 0.2 muda tudo?</span>
            </div>
            <p className="leading-relaxed">
              O parâmetro <strong>Top-P (Nucleus Sampling)</strong> ordena todos os tokens possíveis pelo grau de probabilidade e descarta sumariamente toda a cauda cuja soma acumulada ultrapasse 20%. Isso garante que analogias absurdas ou informações fora de contexto sequer tenham chance de ser sorteadas pelo modelo.
            </p>
          </div>
        </div>

        {/* Right Column: Output Card */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm min-h-[420px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <h3 className="text-sm font-semibold text-slate-200">
                    Resposta Refinada (Etapa 3)
                  </h3>
                </div>

                {result && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
                      {wordCount} palavras
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {charCount} caracteres
                    </span>
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-3">
                  <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                  <p className="text-xs font-mono animate-pulse">Amostragem concentrada com Temp 0.2 e Top-P 0.2...</p>
                </div>
              ) : result ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans select-text max-h-[360px] overflow-y-auto">
                    {result.output}
                  </div>

                  {result.isSimulated && result.note && (
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs">
                      <strong>Nota do laboratório:</strong> {result.note}
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200 flex items-start gap-2">
                    <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Resultado Observado:</strong> Note a clareza, a ausência de divagações e o cumprimento estrito das restrições de formato solicitadas!
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-3">
                  <CheckCircle className="w-8 h-8 text-slate-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-400">Pronto para o refinamento</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">
                      Clique em &ldquo;Gerar Resposta Refinada&rdquo; para testar com temperatura 0.2 e top-p 0.2.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Navigation */}
            <div className="pt-4 mt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={onBackToStepTwo}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar para Etapa 2</span>
              </button>

              {result && (
                <button
                  onClick={onProceedToComparison}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Comparar Lado a Lado (Etapa 1 vs. 3)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
