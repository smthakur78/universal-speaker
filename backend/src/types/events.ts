// backend/src/types/events.ts

export type SubtitleSegmentPayload = {
  speakerId: string;      // "speaker_1"
  language: string;       // "fr", "ja", "es"
  text: string;           // original
  translated: string;     // target language
  timestamp: number;
};

export type SessionSummaryPayload = {
  summary: {
    keyPoints: string[];
    decisions: string[];
    actionItems: string[];
  };
  transcript: SubtitleSegmentPayload[];
};

export type ServerToClientEvent =
  | {
      type: 'SESSION_INITED';
      payload: { sessionId: string };
    }
  | {
      type: 'SUBTITLE_SEGMENT';
      payload: SubtitleSegmentPayload;
    }
  | {
      type: 'SESSION_SUMMARY';
      payload: SessionSummaryPayload;
    }
  | {
      type: 'ERROR';
      payload: { message: string; code?: string };
    };

export type ClientToServerInitPayload = {
  targetLanguage: string; // e.g. "en"
  deviceInfo?: {
    platform: 'ios' | 'android';
    appVersion: string;
  };
};

export type IncomingClientEvent =
  | {
      type: 'INIT_SESSION';
      payload: ClientToServerInitPayload;
    }
  | {
      type: 'STOP_SESSION';
      payload: { sessionId?: string };
    };
