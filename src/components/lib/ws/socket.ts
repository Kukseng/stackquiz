import { WebSocketServer, WebSocket } from "ws";
import { Server as HttpServer } from "http";
import { GameEvent } from "../type/game";

type Client = {
  id: string;
  socket: WebSocket;
  pin?: string;
  player?: string;
};

let clients: Client[] = [];

export function createWebSocketServer(server: HttpServer) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws: WebSocket) => {
    const clientId = Math.random().toString(36).substring(2, 9);
    const client: Client = { id: clientId, socket: ws };
    clients.push(client);

    console.log(`🔌 Client connected: ${clientId}`);

    ws.on("message", (msg) => {
      try {
        const data:GameMessage = JSON.parse(msg.toString());

        switch (data.type) {
          case "JOIN_GAME":
            client.pin = data.pin;
            client.player = data.payload.player;
            console.log(`👤 ${client.player} joined game ${data.pin}`);
            broadcast(data.pin, {
              type: "JOIN_GAME",
              pin: data.pin,
              payload: { player: client.player },
            });
            break;

          case "ANSWER":
            console.log(
              `✅ Answer from ${data.payload.player} in game ${data.pin}`
            );
            broadcast(data.pin, data); // send to host/others
            break;

          case "NEW_QUESTION":
          case "TIME_UP":
          case "QUESTION_RESULT":
          case "GAME_START":
          case "GAME_OVER":
            broadcast(data.pin, data);
            break;

          default:
            console.log("⚠️ Unknown message type", data.type);
        }
      } catch (err) {
        console.error("❌ Error parsing message", err);
      }
    });

    ws.on("close", () => {
      console.log(`❌ Client disconnected: ${clientId}`);
      clients = clients.filter((c) => c.id !== clientId);
    });
  });

  function broadcast(pin: string, message: GameMessage) {
    clients
      .filter((c) => c.pin === pin)
      .forEach((c) => c.socket.send(JSON.stringify(message)));
  }
  return wss;
}
