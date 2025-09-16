
let socket;

export function initWS() {
  if (!socket) {
    socket = new WebSocket("ws://localhost:8080");
  }
  return socket;
}
