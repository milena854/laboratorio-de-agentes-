import React, { useEffect, useState } from 'react';
import { Columns2, ArrowLeft, FileDown, CheckCircle, Star, Sparkles, TrendingDown, Target, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GenerationResult, GroupReflection } from '../types';

interface StepComparisonProps {
  step1Result: GenerationResult | null;
  step3Result: GenerationResult | null;
  reflection: GroupReflection;
  onUpdateReflection: (updates: Partial<GroupReflection>) => void;
  onBackToStepThree: () => void;
  onOpenExportModal: () => void;
}

export const StepComparison: React.FC<StepComparisonProps> = ({
  step1Result,
  step3Result,
  reflection,
  onUpdateReflection,
  onBackToStepThree,
  onOpenExportModal,
}) => {
  const [step1Rating, setStep1Rating] = useState(1);
  const [step3Rating, setStep3Rating] = useState(5);

  const wordCount1 = step1Result?.output ? step1Result.output.trim().split(/\s+/).length : 0;
  const wordCount3 = step3Result?.output ? step3Result.output.trim().split(/\s+/).length : 0;
  const wordDiffPercent = wordCount1 > 0 ? Math.round(((wordCount1 - wordCount3) / wordCount1) * 100) : 0;

  useEffect(() => {
    // Fire celebratory confetti when both steps are ready and user arrives at comparison
    if (step1Result && step3Result) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // no-op if confetti fails
      }
    }
  }, [step1Result, step3Result]);

  return (
    <div className="space-y-6">
      {/* Comparison Banner */}
      <div className="bg-gradient-to-r from-blue-950/50 via-slate-900 to-indigo-950/40 border border-blue-500/30 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-2">
            <Columns2 className="w-3.5 h-3.5" />
            <span>Etapa 4: Comparativo A/B & Conclusão</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Análise Comparativa: Antes vs. Depois
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
            Veja o impacto da engenharia de prompts somada ao ajuste fino dos hiperparâmetros de amostragem no comportamento do agente de IA.
          </p>
        </div>

        <button
          onClick={onOpenExportModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition shrink-0 cursor-pointer"
        >
          <FileDown className="w-4 h-4" />
          <span>Exportar Relatório do Grupo</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-center">
          <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>Redução de Prolixidade</span>
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
            {wordDiffPercent > 0 ? `-${wordDiffPercent}%` : 'Otimizado'}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {wordCount1} → {wordCount3} palavras
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-center">
          <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span>Foco no Alvo</span>
          </div>
          <div className="text-xl font-bold text-cyan-400 mt-1">100% Alinhado</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Sem tópicos alheios</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-center">
          <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Temperatura</span>
          </div>
          <div className="text-xl font-bold text-amber-400 font-mono mt-1">1.5 → 0.2</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Caos → Determinismo</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-center">
          <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Top-P (Nucleus)</span>
          </div>
          <div className="text-xl font-bold text-purple-400 font-mono mt-1">0.95 → 0.2</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Corte de 80% dos ruídos</div>
        </div>
      </div>

      {/* Side-by-Side Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step 1 Card (Bad / Chaotic) */}
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                Versão 1 (Caótica)
              </span>
              <h3 className="text-base font-bold text-white mt-1">Etapa 1: Prompt Vago + Temp 1.5</h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-slate-400">{wordCount1} palavras</span>
              <div className="text-[10px] text-amber-400 font-mono">Temp: 1.5 | Top-P: 0.95</div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
            <span className="text-slate-500 font-mono">Prompt: </span>
            <em>{step1Result?.prompt || 'Explique o que é variável em Python.'}</em>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap max-h-[380px] overflow-y-auto">
            {step1Result?.output || 'Nenhuma resposta disponível na Etapa 1.'}
          </div>

          {/* Rating */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Avaliação de Adequação do Grupo:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setStep1Rating(star)}
                  className={`p-1 transition ${star <= step1Rating ? 'text-amber-400' : 'text-slate-600'}`}
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3 Card (Good / Refined) */}
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                Versão 2 (Refinada)
              </span>
              <h3 className="text-base font-bold text-white mt-1">Etapa 3: Prompt Específico + Temp 0.2</h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-slate-400">{wordCount3} palavras</span>
              <div className="text-[10px] text-emerald-400 font-mono">Temp: 0.2 | Top-P: 0.2</div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
            <span className="text-slate-500 font-mono">Prompt: </span>
            <em>{step3Result?.prompt || 'Explique o que é variável em Python em linguagem simples...'}</em>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap max-h-[380px] overflow-y-auto">
            {step3Result?.output || 'Nenhuma resposta disponível na Etapa 3.'}
          </div>

          {/* Rating */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Avaliação de Adequação do Grupo:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setStep3Rating(star)}
                  className={`p-1 transition ${star <= step3Rating ? 'text-emerald-400' : 'text-slate-600'}`}
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Synthesis & Final Reflection */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Conclusão do Grupo sobre o Refinamento do Agente:</span>
        </h3>
        <textarea
          rows={3}
          value={reflection.stage4Conclusion}
          onChange={(e) => onUpdateReflection({ stage4Conclusion: e.target.value })}
          placeholder="Ex: Aprendemos que um modelo de IA não tem intenção própria: ele segue puramente a distribuição de probabilidades guiada pelo prompt e pela temperatura. Ao restringir o público, limitar o tamanho e reduzir a temperatura e o top-p para 0.2, eliminamos todas as alucinações..."
          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm leading-relaxed"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={onBackToStepThree}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Etapa 3</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Gerar e Exportar Relatório Final do Laboratório</span>
          </button>
        </div>
      </div>
    </div>
  );
};
