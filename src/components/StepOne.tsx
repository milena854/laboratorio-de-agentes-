import React, { useState } from 'react';
import { AlertTriangle, Play, Sparkles, Sliders, ArrowRight, HelpCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { GenerationResult } from '../types';

interface StepOneProps {
  onGenerate: (prompt: string, temperature: number, topP: number) => Promise<void>;
  isLoading: boolean;
  result: GenerationResult | null;
  onProceedToStepTwo: () => void;
}

export const StepOne: React.FC<StepOneProps> = ({
  onGenerate,
  isLoading,
  result,
  onProceedToStepTwo,
}) => {
  const [prompt, setPrompt] = useState('Explique o que é variável em Python.');
  const [temperature, setTemperature] = useState(1.5);
  const [topP, setTopP] = useState(0.95);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleApplyPreset = () => {
    setPrompt('Explique o que é variável em Python.');
    setTemperature(1.5);
    setTopP(0.95);
  };

  const handleRun = async () => {
    await onGenerate(prompt, temperature, topP);
  };

  const wordCount = result?.output ? result.output.trim().split(/\s+/).length : 0;
  const charCount = result?.output ? result.output.length : 0;

  return (
    <div className="space-y-6">
      {/* Step Banner / Instructions */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />
        
        <div className="flex items-start justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Etapa 1: Caos & Alta Aleatoriedade</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Gerando a primeira resposta
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              O objetivo desta etapa é testar o que acontece quando usamos um prompt muito genérico com parâmetros que favorecem alta aleatoriedade. 
              A resposta gerada provavelmente não ficará adequada — e isso é exatamente o esperado para o experimento!
            </p>
          </div>

          <button
            onClick={handleApplyPreset}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition shrink-0 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restaurar Valores da Etapa 1</span>
          </button>
        </div>

        {/* Guided Steps Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300">
            <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <span>Ambiente: <strong>Google AI Studio</strong></span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300">
            <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <span>Prompt: <em>Explique o que é variável...</em></span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 font-medium">
            <span className="w-5 h-5 rounded-full bg-amber-500/30 text-amber-300 font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <span>Temperatura: <strong>1.5</strong> (Alta)</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300">
            <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center shrink-0">
              4
            </span>
            <span>Gerar resposta & analisar</span>
          </div>
        </div>
      </div>

      {/* Main Workspace (Prompt + Controls) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prompt Input & Parameters */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <span>Prompt de Entrada</span>
                <span className="text-xs text-slate-400 font-normal">(Requisito da Etapa 1)</span>
              </label>
              <button
                type="button"
                onClick={() => setPrompt('Explique o que é variável em Python.')}
                className="text-xs text-blue-400 hover:text-blue-300 transition"
              >
                Colar padrão
              </button>
            </div>

            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm leading-relaxed"
                placeholder="Digite o prompt aqui..."
              />
            </div>

            {/* AI Studio Parameters Panel */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Painel de Parâmetros do Google AI Studio</span>
                </div>
                <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-mono">
                  Temp: {temperature.toFixed(2)}
                </span>
              </div>

              {/* Temperature Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1">
                    Temperatura (Temperature)
                    <span className="group relative cursor-pointer text-slate-500">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span className="hidden group-hover:block absolute left-0 bottom-full mb-1 w-60 p-2 bg-slate-800 text-[11px] text-slate-200 rounded-lg shadow-lg border border-slate-700 z-50">
                        Valores mais altos aumentam a aleatoriedade ao achatar as probabilidades dos tokens. Valores baixos tornam o modelo focado e determinístico.
                      </span>
                    </span>
                  </span>
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
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0.0 (Determinístico)</span>
                  <span className="text-amber-400 font-bold">1.5 (Alvo da Etapa 1)</span>
                  <span>2.0 (Caos Total)</span>
                </div>
              </div>

              {/* Advanced Settings Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition py-1"
                >
                  <Sliders className="w-3 h-3" />
                  <span>{showAdvanced ? 'Ocultar Advanced Settings' : 'Mostrar Advanced Settings (Top-P)'}</span>
                </button>

                {showAdvanced && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium">Top-P (Nucleus Sampling)</span>
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
                        <span>0.1 (Estrito)</span>
                        <span>0.95 (Padrão)</span>
                        <span>1.0 (Sem corte)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Execute Button */}
            <button
              onClick={handleRun}
              disabled={isLoading || !prompt.trim()}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Executando no Google AI Studio (Gemini 3.8 Flash)...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white text-white" />
                  <span>Gerar Primeira Resposta (Temp: {temperature})</span>
                </>
              )}
            </button>
          </div>

          {/* Educational Callout */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>O que a matemática da Temperatura 1.5 faz nos bastidores?</span>
            </div>
            <p className="leading-relaxed">
              Modelos de linguagem calculam pontuações chamadas <em>logits</em> para cada token do dicionário. 
              Ao dividir os logits por uma temperatura de 1.5 antes da função <strong>softmax</strong>, a diferença entre a palavra mais provável (como <em>&ldquo;caixa&rdquo;</em>) e palavras improváveis (como <em>&ldquo;cósmico&rdquo;</em> ou <em>&ldquo;multiverso&rdquo;</em>) é fortemente reduzida. Isso faz o agente &ldquo;arriscar&rdquo; caminhos bizarros!
            </p>
          </div>
        </div>

        {/* Right Column: Output & Transition */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm min-h-[420px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <h3 className="text-sm font-semibold text-slate-200">
                    Resposta da Etapa 1
                  </h3>
                </div>

                {result && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {wordCount} palavras
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {charCount} caracteres
                    </span>
                  </div>
                )}
              </div>

              {/* Output Content */}
              {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-3">
                  <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                  <p className="text-xs font-mono animate-pulse">Consultando modelo com temperatura estocástica 1.5...</p>
                </div>
              ) : result ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans select-text max-h-[360px] overflow-y-auto">
                    {result.output}
                  </div>

                  {result.isSimulated && result.note && (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                      <strong>Nota didática:</strong> {result.note}
                    </div>
                  )}

                  <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300">Observe com atenção:</strong> A resposta acima tem problemas evidentes? Ficou prolixa? Usou analogias fora de proporção? Introduziu conceitos desnecessários para um iniciante?
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-3">
                  <AlertTriangle className="w-8 h-8 text-slate-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-400">Nenhuma resposta gerada ainda</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">
                      Clique em &ldquo;Gerar Primeira Resposta&rdquo; para ver como o agente se comporta com Temperatura 1.5.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Next Step Transition */}
            {result && (
              <div className="pt-4 mt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Primeira resposta registrada!</span>
                </div>
                <button
                  onClick={onProceedToStepTwo}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Avançar para Etapa 2: Identificar Problemas</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
