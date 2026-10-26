import { SimulatedTokenCandidate } from '../types';

export const STAGE_CONFIGS = {
  stage1: {
    title: 'Etapa 1 — Gerando a primeira resposta (Caos & Aleatoriedade)',
    description: 'Nesta etapa, o grupo gera a resposta inicial usando alta temperatura para observar o comportamento estocástico da IA.',
    defaultPrompt: 'Explique o que é variável em Python.',
    defaultTemperature: 1.5,
    defaultTopP: 0.95,
    expectedOutcome: 'A resposta provavelmente não ficará boa — e isso é esperado. O objetivo é observar o que acontece quando os parâmetros favorecem aleatoriedade e tokens improváveis.',
    pedagogyTips: [
      'Temperatura 1.5 "achata" a curva softmax de probabilidades.',
      'Tokens raros, gírias, alucinações e analogias bizarras passam a ser escolhidos.',
      'A resposta pode perder coerência estrutural ou divagar para tópicos não solicitados.',
    ],
  },
  stage2: {
    title: 'Etapa 2 — Identificando problemas & Diário de Bordo',
    description: 'Análise minuciosa da primeira resposta gerada, catálogo de falhas e reflexão sobre a percepção crítica do grupo.',
    guidingQuestions: [
      'A resposta ficou confusa ou desorganizada?',
      'Ficou extensa demais ou enrolada?',
      'Está pouco clara para o público-alvo?',
      'Fugiu do tema ou incluiu divagações?',
      'Há sinais de informações inventadas (alucinações) ou sintaxe errada?',
    ],
    reflectionPrompt: 'Como você se sentiu ao perceber que a resposta estava errada? Isso mudou a forma como você vai olhar para o próximo teste?',
  },
  stage3: {
    title: 'Etapa 3 — Primeiro refinamento técnico (Controle & Especificidade)',
    description: 'Deixar a tarefa mais específica, definir o público-alvo e limitar o formato através de engenharia de prompt e restrição paramétrica.',
    suggestedPrompt: 'Explique o que é variável em Python em linguagem simples para um estudante iniciante. Dê uma definição curta, um exemplo simples e uma explicação objetiva. Não fale de assuntos que não foram perguntados.',
    defaultTemperature: 0.2,
    defaultTopP: 0.2,
    pedagogyTips: [
      'Temperatura 0.2 concentra a probabilidade quase inteiramente no token mais provável (maior confiança e determinismo).',
      'Top-P (Nucleus Sampling) 0.2 corta os 80% inferiores dos tokens candidatos, eliminando riscos de desvios aleatórios.',
      'O prompt especifica persona, público (iniciante), restrição negativa ("Não fale de assuntos...") e estrutura (curta, exemplo, explicação).',
    ],
  },
};

export const SAMPLE_TOKENS_FOR_SIMULATION: SimulatedTokenCandidate[] = [
  { token: ' um espaço', baseLogit: 4.8, meaning: 'Definição clássica de memória' },
  { token: ' uma caixa', baseLogit: 4.5, meaning: 'Metáfora pedagógica intuitiva' },
  { token: ' um rótulo', baseLogit: 3.9, meaning: 'Analogia de etiqueta/referência' },
  { token: ' como um contêiner', baseLogit: 3.1, meaning: 'Terminologia técnica intermediária' },
  { token: ' essencialmente um ponteiro', baseLogit: 2.2, meaning: 'Detalhe avançado de baixo nível' },
  { token: ' um portal cósmico', baseLogit: 0.4, meaning: 'Metáfora extravagante (alta temperatura)' },
  { token: ' o segredo ancestral', baseLogit: -0.2, meaning: 'Divagação poética/alucinatória' },
  { token: ' x = lambda y: y**2', baseLogit: -0.8, meaning: 'Código avançado fora de contexto' },
  { token: ' unicórnio dimensional', baseLogit: -1.5, meaning: 'Caos estatístico improvável' },
];

export const WORKSHOP_CHALLENGES = [
  {
    id: 'python-var',
    title: 'Variável em Python (Oficina Principal)',
    subject: 'Programação Básica',
    badPrompt: 'Explique o que é variável em Python.',
    badTemp: 1.5,
    badTopP: 0.95,
    goodPrompt: 'Explique o que é variável em Python em linguagem simples para um estudante iniciante. Dê uma definição curta, um exemplo simples e uma explicação objetiva. Não fale de assuntos que não foram perguntados.',
    goodTemp: 0.2,
    goodTopP: 0.2,
  },
  {
    id: 'python-loops',
    title: 'Estruturas de Repetição (Loop For)',
    subject: 'Programação Básica',
    badPrompt: 'Fale de loops.',
    badTemp: 1.6,
    badTopP: 0.98,
    goodPrompt: 'Você é um professor paciente. Explique como funciona um loop for em Python para alguém que nunca programou. Use o exemplo de dar voltas em uma pista de corrida. Máximo 120 palavras.',
    goodTemp: 0.3,
    goodTopP: 0.3,
  },
  {
    id: 'photosynthesis',
    title: 'Fotossíntese para Ensino Fundamental',
    subject: 'Ciências da Natureza',
    badPrompt: 'Diga tudo sobre fotossíntese rápida.',
    badTemp: 1.7,
    badTopP: 0.95,
    goodPrompt: 'Explique o processo de fotossíntese para alunos de 11 anos. Resuma em 3 etapas numeradas: 1) o que a planta absorve, 2) o papel do sol e 3) o que ela produz. Linguagem amigável sem termos químicos complexos.',
    goodTemp: 0.2,
    goodTopP: 0.2,
  },
];
