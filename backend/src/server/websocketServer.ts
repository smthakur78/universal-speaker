// backend/src/server/websocketServer.ts
import { WebSocketServer, WebSocket } from 'ws';
import { SessionManager } from '../sessions/sessionManager';
import type { IncomingClientEvent } from '../types/events';
import { ENV } from '../config/env';

export function createWebSocketServer(server: any) {
  const wss = new WebSocketServer({ server, path: ENV.WS_PATH });
  const sessions = new SessionManager();

  wss.on('connection', (socket: WebSocket) => {
    let sessionId: string | null = null;

    socket.on('message', async (data: Buffer, isBinary: boolean) => {
      if (isBinary) {
        if (!sessionId) return;
        sessions.handleAudioChunk(sessionId, data, socket);
        return;
      }

      const msg = JSON.parse(data.toString()) as IncomingClientEvent;

      if (msg.type === 'INIT_SESSION') {
        sessionId = sessions.createSession(msg.payload, socket);
      }

      if (msg.type === 'STOP_SESSION') {
        if (sessionId) await sessions.stopSession(sessionId, socket);
      }
    });

    socket.on('close', () => {
      if (sessionId) sessions.cleanupSession(sessionId);
    });
  });

  return wss;
}
