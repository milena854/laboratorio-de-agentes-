import { GenerationConfig, GenerationResult, WorkshopStage } from '../types';

export interface GenerateParams {
  prompt: string;
  stage: WorkshopStage | 'playground';
  temperature: number;
  topP: number;
  systemInstruction?: string;
  model?: string;
  forceSimulated?: boolean;
}

export async function fetchServerStatus(): Promise<{ hasKey: boolean; model: string }> {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('Status check failed');
    return await res.json();
  } catch {
    return { hasKey: false, model: 'gemini-3.8-flash' };
  }
}

export async function generateContentAPI(params: GenerateParams): Promise<GenerationResult> {
  const payload = {
    prompt: params.prompt,
    stage: params.stage,
    temperature: params.temperature,
    topP: params.topP,
    systemInstruction: params.systemInstruction,
    model: params.model || 'gemini-3.8-flash',
    forceSimulated: params.forceSimulated,
  };

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Erro HTTP ${response.status}`);
  }

  const data = await response.json();

  const config: GenerationConfig = {
    temperature: data.config?.temperature ?? params.temperature,
    topP: data.config?.topP ?? params.topP,
    model: data.config?.model ?? (params.model || 'gemini-3.8-flash'),
    systemInstruction: params.systemInstruction,
  };

  return {
    id: `gen-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    stage: params.stage,
    prompt: params.prompt,
    output: data.text || '',
    config,
    timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    isSimulated: data.isSimulated,
    note: data.note,
    errorNotice: data.errorNotice,
  };
}
