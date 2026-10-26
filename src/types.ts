export type WorkshopStage = 1 | 2 | 3 | 4 | 5;

export interface GenerationConfig {
  temperature: number;
  topP: number;
  topK?: number;
  model: string;
  systemInstruction?: string;
}

export interface GenerationResult {
  id: string;
  stage: WorkshopStage | 'playground';
  prompt: string;
  output: string;
  config: GenerationConfig;
  timestamp: string;
  isSimulated?: boolean;
  note?: string;
  errorNotice?: string;
}

export interface ProblemChecklist {
  confusing: boolean;
  tooLong: boolean;
  unclear: boolean;
  offTopic: boolean;
  hallucination: boolean;
  inappropriateTone: boolean;
  other: string;
}

export interface GroupReflection {
  groupName: string;
  members: string;
  identifiedProblems: string;
  emotionalReflection: string; // Como você se sentiu ao perceber que a resposta estava errada? Isso mudou a forma como você vai olhar para o próximo teste?
  checklist: ProblemChecklist;
  stage4Conclusion: string;
}

export interface SimulatedTokenCandidate {
  token: string;
  baseLogit: number;
  meaning: string;
}
