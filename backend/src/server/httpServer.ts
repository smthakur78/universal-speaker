// backend/src/server/httpServer.ts
import http from "http";
import Busboy from "busboy";
import { ENV } from "../config/env";
import { asrService } from "../pipeline/asrService";
import { diarizationService } from "../pipeline/diarizationService";
import { languageIdService } from "../pipeline/languageIdService";

export function createHttpServer() {
  const server = http.createServer((req, res) => {
    // Health check
    if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
      return;
    }

    // ---------- PROCESS AUDIO ----------
    if (req.method === "POST" && req.url === "/process-audio") {
      const busboy = Busboy({ headers: req.headers });

      let audioBuffer: Buffer | null = null;

      busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        const chunks: Buffer[] = [];

        file.on("data", (data) => chunks.push(data));
        file.on("end", () => {
          audioBuffer = Buffer.concat(chunks);
        });
      });

      busboy.on("finish", async () => {
        if (!audioBuffer) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "No audio file uploaded" }));
          return;
        }

        try {
          // 1) Language ID
          const language = await languageIdService.detect(audioBuffer);

          // 2) ASR
          const text = await asrService.transcribe(audioBuffer, language);

          // 3) Diarization
          const diarization = await diarizationService.process(audioBuffer);

          const response = { language, text, diarization };

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(response));
        } catch (err: any) {
          console.error("Error in /process-audio:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: err.message }));
        }
      });

      req.pipe(busboy);
      return;
    }

    // Fallback
    res.writeHead(404);
    res.end();
  });

  return server;
}
