export type LlmProvider = 'groq' | 'openai' | 'gemini' | 'none';

type GenerateAnswerArgs = {
  question: string;
  context: string;
  provider: LlmProvider;
  apiKey?: string;
  model?: string;
};

type GenerateAnswerResult = {
  answer: string;
  mode: string;
  provider: LlmProvider;
  model?: string;
};

const DEFAULT_MODELS: Record<Exclude<LlmProvider, 'none'>, string> = {
  groq: 'llama-3.1-8b-instant',
  openai: 'gpt-4o-mini',
  gemini: 'gemini-2.0-flash',
};

function buildPrompt(question: string, context: string) {
  return [
    'You are Wintrig travel assistant.',
    'Answer clearly and briefly using the context when available.',
    'If context is missing, give a helpful general travel answer.',
    '',
    `Context:\n${context || 'No retrieved context.'}`,
    '',
    `Question: ${question}`,
  ].join('\n');
}

async function callOpenAiCompatible(args: {
  baseUrl: string;
  apiKey: string;
  model: string;
  prompt: string;
}) {
  const response = await fetch(`${args.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${args.apiKey}`,
    },
    body: JSON.stringify({
      model: args.model,
      temperature: 0.3,
      messages: [
        { role: 'system', content: 'You are a helpful travel assistant for Wintrig hotel booking.' },
        { role: 'user', content: args.prompt },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LLM request failed (${response.status}): ${text}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = json.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error('LLM returned an empty response');
  }
  return content;
}

async function callGemini(args: { apiKey: string; model: string; prompt: string }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${args.model}:generateContent?key=${args.apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: args.prompt }] }],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${text}`);
  }

  const json = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const content = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!content) {
    throw new Error('Gemini returned an empty response');
  }
  return content;
}

export async function generateRagAnswer(args: GenerateAnswerArgs): Promise<GenerateAnswerResult> {
  const prompt = buildPrompt(args.question, args.context);
  const model = args.model || (args.provider === 'none' ? undefined : DEFAULT_MODELS[args.provider]);

  if (args.provider === 'none' || !args.apiKey) {
    const answer = args.context
      ? `Based on our travel knowledge base:\n${args.context}\n\nAnswer: ${args.question}`
      : 'No matching knowledge found yet. Please add docs using /api/rag/index.';
    return { answer, mode: 'free-rag-fallback', provider: 'none' };
  }

  if (args.provider === 'groq') {
    const answer = await callOpenAiCompatible({
      baseUrl: 'https://api.groq.com/openai/v1',
      apiKey: args.apiKey,
      model: model!,
      prompt,
    });
    return { answer, mode: 'rag+llm', provider: 'groq', model };
  }

  if (args.provider === 'openai') {
    const answer = await callOpenAiCompatible({
      baseUrl: 'https://api.openai.com/v1',
      apiKey: args.apiKey,
      model: model!,
      prompt,
    });
    return { answer, mode: 'rag+llm', provider: 'openai', model };
  }

  if (args.provider === 'gemini') {
    const answer = await callGemini({
      apiKey: args.apiKey,
      model: model!,
      prompt,
    });
    return { answer, mode: 'rag+llm', provider: 'gemini', model };
  }

  return {
    answer: 'Unsupported LLM provider configured.',
    mode: 'error',
    provider: 'none',
  };
}

export function resolveLlmConfig(env: {
  LLM_PROVIDER?: string;
  LLM_API_KEY?: string;
  LLM_MODEL?: string;
  GROQ_API_KEY?: string;
  OPENAI_API_KEY?: string;
  GEMINI_API_KEY?: string;
}) {
  const provider = (env.LLM_PROVIDER ?? 'groq').toLowerCase() as LlmProvider;
  const apiKey =
    env.LLM_API_KEY ||
    (provider === 'groq' ? env.GROQ_API_KEY : undefined) ||
    (provider === 'openai' ? env.OPENAI_API_KEY : undefined) ||
    (provider === 'gemini' ? env.GEMINI_API_KEY : undefined);

  return {
    provider: (['groq', 'openai', 'gemini', 'none'].includes(provider) ? provider : 'groq') as LlmProvider,
    apiKey,
    model: env.LLM_MODEL,
  };
}
