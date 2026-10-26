import React from 'react';
import { Search, MessageSquare, ArrowRight, ArrowLeft, Lightbulb, CheckSquare, HeartHandshake } from 'lucide-react';
import { GenerationResult, GroupReflection, ProblemChecklist } from '../types';

interface StepTwoProps {
  step1Result: GenerationResult | null;
  reflection: GroupReflection;
  onUpdateReflection: (updates: Partial<GroupReflection>) => void;
  onProceedToStepThree: () => void;
  onBackToStepOne: () => void;
}

export const StepTwo: React.FC<StepTwoProps> = ({
  step1Result,
  reflection,
  onUpdateReflection,
  onProceedToStepThree,
  onBackToStepOne,
}) => {
  const handleChecklistToggle = (key: keyof ProblemChecklist) => {
    if (key === 'other') return;
    const current = reflection.checklist[key];
    onUpdateReflection({
      checklist: {
        ...reflection.checklist,
        [key]: !current,
      },
    });
  };

  const checklistItems: { key: keyof Omit<ProblemChecklist, 'other'>; label: string; desc: string }[] = [
    {
      key: 'confusing',
      label: 'Confusa ou Desestruturada',
      desc: 'Mistura conceitos sem uma linha de raciocínio clara ou linear.',
    },
    {
      key: 'tooLong',
      label: 'Extensa demais / Prolixa',
      desc: 'Usa parágrafos desnecessários e enrola antes de responder a pergunta central.',
    },
    {
      key: 'unclear',
      label: 'Pouco clara para iniciantes',
      desc: 'Usa termos técnicos complexos (como CPython, registradores, ponteiros) que assustam um estudante.',
    },
    {
      key: 'offTopic',
      label: 'Fora do tema / Divagações',
      desc: 'Fala de outras linguagens (Cobol, Assembly), multiverso, física ou assuntos não solicitados.',
    },
    {
      key: 'hallucination',
      label: 'Possíveis sinais de Alucinação / Informação Inventada',
      desc: 'Cria relações inexistentes, pseudocódigo incorreto ou fatos sem fundamento científico.',
    },
    {
      key: 'inappropriateTone',
      label: 'Tom ou analogias exageradas',
      desc: 'Usa analogias cósmicas, poéticas ou cômicas em excesso que não ajudam no aprendizado.',
    },
  ];

  const selectedCount = Object.entries(reflection.checklist).filter(
    ([k, v]) => k !== 'other' && v === true
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/30 rounded-2xl p-5 shadow-lg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-2">
          <Search className="w-3.5 h-3.5" />
          <span>Etapa 2: Diagnóstico Crítico & Diário de Bordo</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Identificando problemas na resposta
        </h2>
        <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
          Agora é o momento de agir como auditores de qualidade do agente. Analisem minuciosamente a saída gerada na Etapa 1, apontem as inconsistências e reflitam sobre o impacto dessa falha.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Reference Output from Step 1 */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 sticky top-24">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Resposta Gerada na Etapa 1 (Temp: 1.5)
              </span>
              <button
                onClick={onBackToStepOne}
                className="text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Editar na Etapa 1
              </button>
            </div>

            <div className="text-xs text-slate-400 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 font-mono">
              <strong>Prompt usado:</strong> {step1Result?.prompt || 'Explique o que é variável em Python.'}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap max-h-[380px] overflow-y-auto">
              {step1Result?.output || (
                <span className="text-slate-500 italic">
                  Nenhuma resposta encontrada. Volte à Etapa 1 para gerar a primeira resposta com temperatura 1.5.
                </span>
              )}
            </div>

            <div className="p-3 bg-blue-950/30 border border-blue-500/20 rounded-xl text-xs text-blue-200 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>Dica do Laboratório:</strong> Procure trechos que fogem do propósito simples de ensinar um estudante iniciante.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Problem Catalog & Reflection Form */}
        <div className="lg:col-span-7 space-y-5">
          {/* Item 1: Checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-blue-400" />
                <span>1. Checklist de Problemas Detectados</span>
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                {selectedCount} selecionado(s)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {checklistItems.map((item) => {
                const isChecked = reflection.checklist[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleChecklistToggle(item.key)}
                    className={`text-left p-3 rounded-xl border transition flex items-start gap-2.5 cursor-pointer ${
                      isChecked
                        ? 'bg-blue-600/15 border-blue-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 transition ${
                        isChecked ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-600 bg-slate-900'
                      }`}
                    >
                      {isChecked && <span className="text-[10px] font-bold">✓</span>}
                    </div>
                    <div>
                      <div className="text-xs font-semibold">{item.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Item 2: Written Problem Registry */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>2. Registrem os principais problemas encontrados pelo grupo:</span>
            </label>
            <textarea
              rows={3}
              value={reflection.identifiedProblems}
              onChange={(e) => onUpdateReflection({ identifiedProblems: e.target.value })}
              placeholder="Ex: A resposta começou falando de caixas cósmicas, usou termos de baixo nível como PyLongObject e CPython que não fazem sentido para iniciantes, e incluiu um loop infinito irrelevante..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm leading-relaxed"
            />
          </div>

          {/* Item 3: Emotional / Metacognitive Reflection Question */}
          <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-sm space-y-3">
            <label className="text-sm font-bold text-indigo-200 flex items-start gap-2">
              <HeartHandshake className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                3. Como você se sentiu ao perceber que a resposta estava errada? Isso mudou a forma como você vai olhar para o próximo teste?
              </span>
            </label>
            <p className="text-xs text-slate-400">
              Reflexão central da oficina: Discutam em grupo como a confiança inicial na IA se transforma em um olhar crítico e investigativo.
            </p>
            <textarea
              rows={3}
              value={reflection.emotionalReflection}
              onChange={(e) => onUpdateReflection({ emotionalReflection: e.target.value })}
              placeholder="Ex: No início esperávamos uma resposta pronta e perfeita. Perceber o erro nos fez ver que a IA precisa de comandos precisos e limites claros. No próximo teste vamos olhar com mais rigor e ceticismo..."
              className="w-full bg-slate-950 border border-indigo-500/30 rounded-xl p-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm leading-relaxed"
            />
          </div>

          {/* Navigation Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={onBackToStepOne}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para Etapa 1</span>
            </button>

            <button
              onClick={onProceedToStepThree}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>Salvar Diagnóstico e Ir para a Etapa 3</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
