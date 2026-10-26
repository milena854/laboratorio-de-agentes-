import React, { useState } from 'react';
import { X, Copy, Check, Download, Printer, FileText } from 'lucide-react';
import { GenerationResult, GroupReflection } from '../types';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  step1Result: GenerationResult | null;
  step3Result: GenerationResult | null;
  reflection: GroupReflection;
  onUpdateReflection: (updates: Partial<GroupReflection>) => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  step1Result,
  step3Result,
  reflection,
  onUpdateReflection,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const checklistText = Object.entries(reflection.checklist)
    .filter(([k, v]) => k !== 'other' && v === true)
    .map(([k]) => {
      const map: Record<string, string> = {
        confusing: 'Confusa / Desestruturada',
        tooLong: 'Extensa demais / Prolixa',
        unclear: 'Pouco clara para iniciantes',
        offTopic: 'Fora do tema / Divagações',
        hallucination: 'Possíveis alucinações / Informações inventadas',
        inappropriateTone: 'Tom inadequado / Analogias exageradas',
      };
      return `- [X] ${map[k] || k}`;
    })
    .join('\n');

  const markdownContent = `# Relatório de Laboratório: Melhoria e Refinamento de Agentes de IA
**Grupo:** ${reflection.groupName || 'Não informado'}  
**Integrantes:** ${reflection.members || 'Não informado'}  
**Data:** ${new Date().toLocaleDateString('pt-BR')}  
**Ferramenta Base:** Google AI Studio (Modelo: Gemini 3.8 Flash)

---

## 📌 Etapa 1 — Gerando a Primeira Resposta (Caos & Aleatoriedade)
- **Prompt:** \`${step1Result?.prompt || 'Explique o que é variável em Python.'}\`
- **Temperatura:** ${step1Result?.config.temperature ?? 1.5}
- **Top-P:** ${step1Result?.config.topP ?? 0.95}

### Resposta Gerada:
\`\`\`
${step1Result?.output || '(Nenhuma resposta gerada ainda)'}
\`\`\`

---

## 🔍 Etapa 2 — Identificando Problemas & Diagnóstico Crítico

### Problemas Catalogados no Checklist:
${checklistText || '- (Nenhum item do checklist marcado)'}

### Principais Problemas Registrados pelo Grupo:
> ${reflection.identifiedProblems || '(Nenhuma anotação registrada)'}

### Pergunta Reflexiva Central:
*"Como você se sentiu ao perceber que a resposta estava errada? Isso mudou a forma como você vai olhar para o próximo teste?"*
> ${reflection.emotionalReflection || '(Nenhuma reflexão registrada)'}

---

## 🛠️ Etapa 3 — Primeiro Refinamento Técnico
- **Prompt Refinado:** \`${step3Result?.prompt || 'Explique o que é variável em Python em linguagem simples para um estudante iniciante. Dê uma definição curta, um exemplo simples e uma explicação objetiva. Não fale de assuntos que não foram perguntados.'}\`
- **Temperatura:** ${step3Result?.config.temperature ?? 0.2}
- **Top-P:** ${step3Result?.config.topP ?? 0.2}

### Resposta Refinada Gerada:
\`\`\`
${step3Result?.output || '(Nenhuma resposta gerada ainda)'}
\`\`\`

---

## 📊 Etapa 4 — Conclusão Comparativa do Grupo
> ${reflection.stage4Conclusion || '(Nenhuma conclusão registrada)'}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-laboratorio-agentes-${reflection.groupName.replace(/\s+/g, '-').toLowerCase() || 'grupo'}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Relatório da Oficina do Grupo</h3>
              <p className="text-xs text-slate-400">Exportação e entrega da atividade de melhoria de agentes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Metadata Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Nome do Grupo / Equipe:
              </label>
              <input
                type="text"
                value={reflection.groupName}
                onChange={(e) => onUpdateReflection({ groupName: e.target.value })}
                placeholder="Ex: Grupo 04 - Turma A"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Integrantes da Equipe:
              </label>
              <input
                type="text"
                value={reflection.members}
                onChange={(e) => onUpdateReflection({ members: e.target.value })}
                placeholder="Ex: João Silva, Maria Souza, Pedro Santos"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Preview Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">
              Pré-visualização do Relatório (Formato Markdown):
            </label>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed">
              {markdownContent}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-2.5">
          <div className="text-[11px] text-slate-400">
            Pronto para anexar ou submeter ao professor/instrutor.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Baixar (.md)</span>
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copiado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Markdown</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
