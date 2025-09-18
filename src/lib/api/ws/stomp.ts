import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export function createStompClient() {
  const client = new Client({
    webSocketFactory: () => new SockJS("http://localhost:9999/ws"), // SockJS endpoint
    reconnectDelay: 500,
    heartbeatIncoming: 20000,
    heartbeatOutgoing: 20000,
    debug: (msg) => console.log("[STOMP]", msg),
  });

  client.onConnect = () => console.log("Connected via SockJS");
  client.onStompError = (frame) => console.error("STOMP Error:", frame.headers["message"]);
  client.onWebSocketError = (err) => console.error("WebSocket Error:", err);

  client.activate();
  return client;
}
