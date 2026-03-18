// backend/src/pipeline/audioRouter.ts
import type { ClientToServerInitPayload, ServerToClientEvent, SubtitleSegmentPayload } from '../types/events';
import { asrService } from './asrService';
import { diarizationService } from './diarizationService';
import { languageIdService } from './languageIdService';
import { translationService } from './translationService';
import { summaryService } from './summaryService';

export class AudioRouter {
  private transcript: SubtitleSegmentPayload[] = [];

  constructor(
    private sessionId: string,
    private initPayload: ClientToServerInitPayload,
    private socket: WebSocket
  ) {}

  async handleChunk(chunk: Buffer, socket: WebSocket) {
    const diarizedSegments = await diarizationService.process(chunk);

    for (const seg of diarizedSegments) {
      const lang = await languageIdService.detect(seg.audio);
      const text = await asrService.transcribe(seg.audio, lang);
      const translated = await translationService.translateWithOllama(
        text,
        lang,
        this.initPayload.targetLanguage
      );

      const payload: SubtitleSegmentPayload = {
        speakerId: seg.speakerId,
        language: lang,
        text,
        translated,
        timestamp: Date.now()
      };

      this.transcript.push(payload);

      const event: ServerToClientEvent = {
        type: 'SUBTITLE_SEGMENT',
        payload
      };

      socket.send(JSON.stringify(event));
    }
  }

  async finish(socket: WebSocket) {
    const summary = await summaryService.summarizeWithOllama(
      this.transcript,
      this.initPayload.targetLanguage
    );

    const event: ServerToClientEvent = {
      type: 'SESSION_SUMMARY',
      payload: { summary, transcript: this.transcript }
    };

    socket.send(JSON.stringify(event));
  }

  dispose() {
    // cleanup if needed
  }
}
