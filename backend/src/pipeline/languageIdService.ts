// backend/src/pipeline/languageIdService.ts
import { ENV } from '../config/env';

export const languageIdService = {
  async detect(audio: Buffer): Promise<string> {
    const form = new FormData();
    const blob = new Blob([audio], { type: "audio/wav" });
    form.append("audio", blob, "audio.wav");

    console.log("LANGID → Sending request to:", `${ENV.LANGID_SERVICE_URL}/detect`);

    const res = await fetch(`${ENV.LANGID_SERVICE_URL}/detect`, {
      method: "POST",
      body: form
    });

    console.log("LANGID → Status:", res.status);
    console.log("LANGID → Headers:", Object.fromEntries(res.headers.entries()));

    const raw = await res.text();
    console.log("LANGID → RAW RESPONSE BODY:", raw);

    // Try parsing JSON only if it looks like JSON
    try {
      const json = JSON.parse(raw);
      return json.language || "unknown";
    } catch (err) {
      console.log("LANGID → JSON PARSE FAILED");
      throw new Error("LANGID returned non‑JSON: " + raw);
    }
  }
};
