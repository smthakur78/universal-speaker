// backend/src/config/env.ts
import 'dotenv/config';

export const ENV = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  WS_PATH: process.env.WS_PATH || '/ws',

  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL!,
  OLLAMA_TRANSLATION_MODEL: process.env.OLLAMA_TRANSLATION_MODEL!,
  OLLAMA_SUMMARY_MODEL: process.env.OLLAMA_SUMMARY_MODEL!,

  ASR_SERVICE_URL: process.env.ASR_SERVICE_URL!,
  DIARIZATION_SERVICE_URL: process.env.DIARIZATION_SERVICE_URL!,
  LANGID_SERVICE_URL: process.env.LANGID_SERVICE_URL!
};
