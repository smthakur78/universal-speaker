// backend/src/pipeline/asrService.ts
import { ENV } from '../config/env';

export const asrService = {
  async transcribe(audio: Buffer, language: string): Promise<string> {
    const form = new FormData();
    const blob = new Blob([audio], { type: "audio/wav" });
    form.append("audio", blob, "audio.wav");

    const res = await fetch(
      `${ENV.ASR_SERVICE_URL}/transcribe?language=${language || "auto"}`,
      {
        method: "POST",
        body: form
      }
    );

	console.log("ASR -1 ");
    const json = await res.json();
	console.log("ASR RAW RESPONSE:", json);	
    return json.text || "";
  }
};


