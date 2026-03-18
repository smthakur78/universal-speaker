// backend/src/pipeline/translationService.ts
import { callOllama } from '../ollama/ollamaClient';
import { ENV } from '../config/env';

export const translationService = {
  async translateWithOllama(
    text: string,
    sourceLang: string,
    targetLang: string
  ): Promise<string> {
    const prompt = `
You are a precise translation engine for live conversations.

Rules:
- Translate the given text into the target language.
- Preserve the meaning and tone.
- Do NOT add explanations or commentary.
- Do NOT change names, numbers, or entities.
- If the text is incomplete, still translate it as best as possible.
- Output ONLY the translated text, nothing else.

Source language: ${sourceLang}
Target language: ${targetLang}

Text:
${text}
    `.trim();

    const res = await callOllama({
      model: ENV.OLLAMA_TRANSLATION_MODEL,
      prompt,
      stream: false
    });

    return (res.response as string).trim();
  }
};
