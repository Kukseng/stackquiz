import { createServer } from "http";
import next from "next";
import { createWebSocketServer } from "../ws/socket";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  createWebSocketServer(server); // now typed as HttpServer ✅

  server.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
  });
});
