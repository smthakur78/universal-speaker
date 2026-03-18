// backend/src/sessions/sessionTypes.ts

export type SpeakerSegment = {
  speakerId: string;
  audio: Buffer;
  start: number;
  end: number;
};

export type SessionConfig = {
  targetLanguage: string;
  deviceInfo?: {
    platform: 'ios' | 'android';
    appVersion: string;
  };
};
