// backend/src/ollama/ollamaClient.ts
import { ENV } from '../config/env';

type OllamaRequest = {
  model: string;
  prompt: string;
  stream?: boolean;
};

export async function callOllama(req: OllamaRequest) {
  const res = await fetch(`${ENV.OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    body: JSON.stringify({
      model: req.model,
      prompt: req.prompt,
      stream: req.stream ?? false
    }),
    headers: { 'Content-Type': 'application/json' }
  });

  const json = await res.json();
  return json;
}
