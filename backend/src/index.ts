// backend/src/index.ts
console.log("Before imports - Index.ts");
import { createHttpServer } from './server/httpServer';
import { createWebSocketServer } from './server/websocketServer';
import { ENV } from './config/env';
console.log("Post imports - Index.ts");
const server = createHttpServer();
console.log("After createHttepServer - Index.ts");
createWebSocketServer(server);

server.listen(ENV.PORT, () => {
  console.log(`Server listening on port ${ENV.PORT}`);
});
