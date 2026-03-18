// backend/src/pipeline/diarizationService.ts
import { ENV } from '../config/env';

export const diarizationService = {
  async process(audio: Buffer) {
    const form = new FormData();
    const blob = new Blob([audio], { type: "audio/wav" });
    form.append("file", blob, "audio.wav");

    const res = await fetch(`${ENV.DIARIZATION_SERVICE_URL}/diarize`, {
      method: "POST",
      body: form
    });

	console.log("Diarization - 1");
    const json = await res.json();
	console.log("Diarization RAW RESPONSE:", json);
    return json.segments || [];
  }
};
