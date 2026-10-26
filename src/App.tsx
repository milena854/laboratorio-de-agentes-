/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StepOne } from './components/StepOne';
import { StepTwo } from './components/StepTwo';
import { StepThree } from './components/StepThree';
import { StepComparison } from './components/StepComparison';
import { TokenProbabilitySimulator } from './components/TokenProbabilitySimulator';
import { FreePlayground } from './components/FreePlayground';
import { ExportReportModal } from './components/ExportReportModal';
import { GenerationResult, GroupReflection, WorkshopStage } from './types';
import { fetchServerStatus, generateContentAPI } from './services/api';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const STORAGE_KEY_REFLECTION = 'agent_lab_reflection_v1';
const STORAGE_KEY_STEP1 = 'agent_lab_step1_v1';
const STORAGE_KEY_STEP3 = 'agent_lab_step3_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'guided' | 'comparison' | 'simulator' | 'playground'>('guided');
  const [currentStage, setCurrentStage] = useState<WorkshopStage>(1);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Results State
  const [step1Result, setStep1Result] = useState<GenerationResult | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STEP1);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [step3Result, setStep3Result] = useState<GenerationResult | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STEP3);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [history, setHistory] = useState<GenerationResult[]>([]);

  // Reflection State
  const [reflection, setReflection] = useState<GroupReflection>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REFLECTION);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      groupName: '',
      members: '',
      identifiedProblems: '',
      emotionalReflection: '',
      checklist: {
        confusing: false,
        tooLong: false,
        unclear: false,
        offTopic: false,
        hallucination: false,
        inappropriateTone: false,
        other: '',
      },
      stage4Conclusion: '',
    };
  });

  // Check backend Gemini status on mount
  useEffect(() => {
    fetchServerStatus().then((status) => {
      setHasApiKey(status.hasKey);
    });
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REFLECTION, JSON.stringify(reflection));
    } catch {
      // ignore
    }
  }, [reflection]);

  useEffect(() => {
    if (step1Result) {
      try {
        localStorage.setItem(STORAGE_KEY_STEP1, JSON.stringify(step1Result));
      } catch {
        // ignore
      }
    }
  }, [step1Result]);

  useEffect(() => {
    if (step3Result) {
      try {
        localStorage.setItem(STORAGE_KEY_STEP3, JSON.stringify(step3Result));
      } catch {
        // ignore
      }
    }
  }, [step3Result]);

  const handleUpdateReflection = (updates: Partial<GroupReflection>) => {
    setReflection((prev) => ({ ...prev, ...updates }));
  };

  // Step 1 Generation
  const handleGenerateStep1 = async (prompt: string, temperature: number, topP: number) => {
    setIsLoading(true);
    try {
      const result = await generateContentAPI({
        prompt,
        stage: 1,
        temperature,
        topP,
      });
      setStep1Result(result);
      setHistory((prev) => [result, ...prev]);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3 Generation
  const handleGenerateStep3 = async (prompt: string, temperature: number, topP: number) => {
    setIsLoading(true);
    try {
      const result = await generateContentAPI({
        prompt,
        stage: 3,
        temperature,
        topP,
      });
      setStep3Result(result);
      setHistory((prev) => [result, ...prev]);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Playground Generation
  const handleGeneratePlayground = async (
    prompt: string,
    temperature: number,
    topP: number,
    systemInstruction?: string
  ) => {
    setIsLoading(true);
    try {
      const result = await generateContentAPI({
        prompt,
        stage: 'playground',
        temperature,
        topP,
        systemInstruction,
      });
      setHistory((prev) => [result, ...prev]);
      return result;
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Deseja reiniciar todas as etapas do laboratório? As respostas atuais serão limpas.')) {
      setStep1Result(null);
      setStep3Result(null);
      setCurrentStage(1);
      localStorage.removeItem(STORAGE_KEY_STEP1);
      localStorage.removeItem(STORAGE_KEY_STEP3);
      setReflection({
        groupName: '',
        members: '',
        identifiedProblems: '',
        emotionalReflection: '',
        checklist: {
          confusing: false,
          tooLong: false,
          unclear: false,
          offTopic: false,
          hallucination: false,
          inappropriateTone: false,
          other: '',
        },
        stage4Conclusion: '',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasApiKey={hasApiKey}
        onOpenExport={() => setIsExportModalOpen(true)}
        onReset={handleReset}
        currentStage={currentStage}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Guided Workshop Mode */}
        {activeTab === 'guided' && (
          <div className="space-y-6">
            {/* Stage Progress Stepper */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 shadow-sm flex items-center justify-between overflow-x-auto gap-2">
              {[
                { stage: 1, title: 'Etapa 1', subtitle: 'Primeira Resposta (Caos)' },
                { stage: 2, title: 'Etapa 2', subtitle: 'Identificar Problemas' },
                { stage: 3, title: 'Etapa 3', subtitle: 'Refinamento Técnico' },
                { stage: 4, title: 'Etapa 4', subtitle: 'Comparação & Conclusão' },
              ].map((item, idx) => {
                const isCurrent = currentStage === item.stage;
                const isDone =
                  item.stage === 1
                    ? Boolean(step1Result)
                    : item.stage === 2
                    ? Boolean(reflection.identifiedProblems || reflection.emotionalReflection)
                    : item.stage === 3
                    ? Boolean(step3Result)
                    : false;

                return (
                  <React.Fragment key={item.stage}>
                    <button
                      onClick={() => setCurrentStage(item.stage as WorkshopStage)}
                      className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-left transition shrink-0 cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : isDone
                          ? 'bg-slate-800/80 text-slate-200 hover:bg-slate-800'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          isCurrent
                            ? 'bg-white text-blue-600'
                            : isDone
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {isDone && !isCurrent ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          item.stage
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-tight">{item.title}</div>
                        <div
                          className={`text-[10px] leading-tight ${
                            isCurrent ? 'text-blue-100' : 'text-slate-400'
                          }`}
                        >
                          {item.subtitle}
                        </div>
                      </div>
                    </button>

                    {idx < 3 && (
                      <ArrowRight className="w-4 h-4 text-slate-700 shrink-0 hidden sm:block" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Stage View Routing */}
            {currentStage === 1 && (
              <StepOne
                onGenerate={handleGenerateStep1}
                isLoading={isLoading}
                result={step1Result}
                onProceedToStepTwo={() => setCurrentStage(2)}
              />
            )}

            {currentStage === 2 && (
              <StepTwo
                step1Result={step1Result}
                reflection={reflection}
                onUpdateReflection={handleUpdateReflection}
                onProceedToStepThree={() => setCurrentStage(3)}
                onBackToStepOne={() => setCurrentStage(1)}
              />
            )}

            {currentStage === 3 && (
              <StepThree
                onGenerate={handleGenerateStep3}
                isLoading={isLoading}
                result={step3Result}
                onProceedToComparison={() => setCurrentStage(4)}
                onBackToStepTwo={() => setCurrentStage(2)}
              />
            )}

            {currentStage === 4 && (
              <StepComparison
                step1Result={step1Result}
                step3Result={step3Result}
                reflection={reflection}
                onUpdateReflection={handleUpdateReflection}
                onBackToStepThree={() => setCurrentStage(3)}
                onOpenExportModal={() => setIsExportModalOpen(true)}
              />
            )}
          </div>
        )}

        {/* Tab 2: Comparison Mode */}
        {activeTab === 'comparison' && (
          <StepComparison
            step1Result={step1Result}
            step3Result={step3Result}
            reflection={reflection}
            onUpdateReflection={handleUpdateReflection}
            onBackToStepThree={() => {
              setActiveTab('guided');
              setCurrentStage(3);
            }}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        )}

        {/* Tab 3: Token Probability Simulator */}
        {activeTab === 'simulator' && <TokenProbabilitySimulator />}

        {/* Tab 4: Free AI Studio Playground */}
        {activeTab === 'playground' && (
          <FreePlayground
            onGenerate={handleGeneratePlayground}
            isLoading={isLoading}
            history={history}
          />
        )}
      </main>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        step1Result={step1Result}
        step3Result={step3Result}
        reflection={reflection}
        onUpdateReflection={handleUpdateReflection}
      />
    </div>
  );
}
