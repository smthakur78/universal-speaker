// backend/src/sessions/sessionManager.ts
import crypto from 'crypto';
import { AudioRouter } from '../pipeline/audioRouter';
import type { ClientToServerInitPayload } from '../types/events';

export class SessionManager {
  private sessions = new Map<string, AudioRouter>();

  createSession(payload: ClientToServerInitPayload, socket: WebSocket): string {
    const id = crypto.randomUUID();
    const router = new AudioRouter(id, payload, socket);
    this.sessions.set(id, router);

    socket.send(
      JSON.stringify({
        type: 'SESSION_INITED',
        payload: { sessionId: id }
      })
    );

    return id;
  }

  handleAudioChunk(sessionId: string, chunk: Buffer, socket: WebSocket) {
    const router = this.sessions.get(sessionId);
    if (!router) return;
    router.handleChunk(chunk, socket);
  }

  async stopSession(sessionId: string, socket: WebSocket) {
    const router = this.sessions.get(sessionId);
    if (!router) return;
    await router.finish(socket);
  }

  cleanupSession(sessionId: string) {
    const router = this.sessions.get(sessionId);
    if (!router) return;
    router.dispose();
    this.sessions.delete(sessionId);
  }
}
