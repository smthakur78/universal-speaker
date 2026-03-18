// backend/src/ollama/prompts/summaryPrompt.ts

import { SubtitleSegmentPayload } from "../../types/events";

export const buildSummaryPrompt = (
  transcript: SubtitleSegmentPayload[],
  targetLang: string
) => {
  const transcriptText = transcript
    .map(
      (t) =>
        `[${new Date(t.timestamp).toISOString()}] ${t.speakerId}: ${t.translated}`
    )
    .join("\n");

  return `
You are an AI meeting assistant.

You receive a transcript of a multi-speaker, multi-language meeting that has already been translated into the user's target language.

Your job:
- Extract the key points.
- Identify decisions made.
- Identify action items with owners if possible.

Output format (JSON only):
{
  "keyPoints": ["..."],
  "decisions": ["..."],
  "actionItems": ["..."]
}

Rules:
- Be concise but clear.
- Do NOT invent facts.
- If something is unclear, omit it.
- Do NOT include any text outside the JSON.

Target language: ${targetLang}

Transcript:
${transcriptText}
  `.trim();
};
