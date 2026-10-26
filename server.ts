import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini client server-side
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Status endpoint
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    hasKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    model: 'gemini-3.8-flash',
  });
});

// Educational simulated fallback responses if key is not configured or in offline mode
function getSimulatedResponse(prompt: string, temperature: number, topP: number): { text: string; simulatedReason: string } {
  const isHighTemp = temperature >= 1.2;
  const isTargetEtapa1 = prompt.toLowerCase().includes('variável') || prompt.toLowerCase().includes('variavel');

  if (isTargetEtapa1) {
    if (isHighTemp) {
      return {
        simulatedReason: `Simulação com Temperatura Alta (${temperature}): O modelo explora tokens improváveis, resultando em metáforas desconexas, sintaxe mista e divagações excessivas sobre física quântica e poética de código.`,
        text: `Ah, variáveis em Python! Pense nelas como caixas cósmicas que flutuam no éter da memória RAM do computador 🌌📦.

Quando você diz:
x = 42
Você está na verdade entrelaçando um ponteiro dimensional quântico com o objeto sagrado PyLongObject! Mas cuidado: se você tentar somar uma string com um unicórnio flutuante, o interpretador Guido van Rossum vai chorar em código binário!

Além disso, em CPython 3.12 tudo é um ponteiro de ponteiros onde o Garbage Collector rastreia ciclos biológicos. Em linguagens antigas como Cobol ou Assembly de 1970, você alocava registradores no silício, o que não tem nada a ver com Python, mas é fascinante como as estrelas no céu noturno de Amsterdam... 

Exemplo transcendental:
minha_variavel = "Olá mundo ou talvez multiverso"
def voar():
    global x
    x = [i**2 for i in range(999999)] # Cuidado com o Big Bang da memória!
print(type(x)) # Retorna a essência do ser cósmico <class 'int'>

Em resumo: Python é vida, a variável é um rótulo que cola na alma dos números. 🔮🚀`
      };
    } else {
      return {
        simulatedReason: `Simulação com Temperatura Baixa (${temperature}) e Top-P (${topP}): Alta precisão, foco estrito, vocabulário conciso e direto ao ponto sem divagações.`,
        text: `Uma variável em Python é um nome que você cria para guardar e referenciar um valor na memória do computador. Pense nela como uma etiqueta colada em uma caixa.

Exemplo simples:
idade = 15
nome = "Lucas"

Explicação:
Neste exemplo, criamos duas variáveis: 'idade', que armazena o número 15, e 'nome', que armazena o texto "Lucas". Sempre que você usar 'idade' no seu programa, o Python saberá que o valor é 15.`
      };
    }
  }

  // Generic fallback
  if (isHighTemp) {
    return {
      simulatedReason: `Alta temperatura (${temperature}): texto criativo, porém propenso a desvios temáticos e inconsistências.`,
      text: `Sobre '${prompt}': É como uma sinfonia imprevisível de ideias multidimensionais! Explorando caminhos incomuns, conexões poéticas e perspectivas que vão muito além do comum, misturando conceitos inesperados...`
    };
  }

  return {
    simulatedReason: `Baixa temperatura (${temperature}): resposta objetiva, direta e focada.`,
    text: `Definição objetiva para '${prompt}': Informação direta e estruturada com linguagem clara, sem divagações adicionais.`
  };
}

// Generate endpoint
app.post('/api/generate', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      systemInstruction,
      temperature = 1.0,
      topP = 0.95,
      model = 'gemini-3.8-flash',
      forceSimulated = false,
    } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'O prompt é obrigatório e deve ser um texto.' });
      return;
    }

    const tempNum = Math.max(0, Math.min(2.0, parseFloat(temperature) || 1.0));
    const topPNum = Math.max(0.01, Math.min(1.0, parseFloat(topP) || 0.95));

    // If no live API or forced simulated
    if (!ai || forceSimulated) {
      const sim = getSimulatedResponse(prompt, tempNum, topPNum);
      res.json({
        text: sim.text,
        isSimulated: true,
        note: sim.simulatedReason,
        config: {
          temperature: tempNum,
          topP: topPNum,
          model,
        },
      });
      return;
    }

    // Call real Gemini API
    const response = await ai.models.generateContent({
      model: model || 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction ? String(systemInstruction) : undefined,
        temperature: tempNum,
        topP: topPNum,
      },
    });

    const text = response.text || '';
    res.json({
      text,
      isSimulated: false,
      config: {
        temperature: tempNum,
        topP: topPNum,
        model,
      },
    });
  } catch (error: any) {
    console.error('Error generating with Gemini:', error);
    // Graceful fallback to educational simulated content with error explanation
    const prompt = req.body?.prompt || '';
    const tempNum = parseFloat(req.body?.temperature) || 1.0;
    const topPNum = parseFloat(req.body?.topP) || 0.95;
    const sim = getSimulatedResponse(prompt, tempNum, topPNum);

    res.json({
      text: sim.text,
      isSimulated: true,
      errorNotice: error?.message || 'Falha na conexão com a API; resposta de laboratório ativada.',
      note: sim.simulatedReason,
      config: {
        temperature: tempNum,
        topP: topPNum,
        model: req.body?.model || 'gemini-3.8-flash',
      },
    });
  }
});

// Setup Vite or Static Serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Laboratório de Agentes ativo em http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
