/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useQuizHostWebSocket.ts
import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export function useQuizHostWebSocket(
  sessionCode: string,
  onMessage: (topic: string, msg: any) => void
) {
  const stompRef = useRef<Client | null>(null);

  useEffect(() => {
    const sock = new SockJS("http://localhost:9999/ws"); // Change to your backend's ws endpoint
    const stomp = new Client({ webSocketFactory: () => sock, reconnectDelay: 5000 });

    stomp.onConnect = () => {
      stomp.subscribe(`/topic/session/${sessionCode}/game-state`, (msg) => {
        onMessage("game-state", JSON.parse(msg.body));
      });
      stomp.subscribe(`/topic/session/${sessionCode}/questions`, (msg) => {
        onMessage("questions", JSON.parse(msg.body));
      });
      stomp.subscribe(`/topic/session/${sessionCode}/leaderboard`, (msg) => {
        onMessage("leaderboard", JSON.parse(msg.body));
      });
      stomp.subscribe(`/topic/session/${sessionCode}/participants`, (msg) => {
        onMessage("participants", JSON.parse(msg.body));
      });
    };

    stomp.activate();
    stompRef.current = stomp;
    return () => { stomp.deactivate(); };
  }, [sessionCode, onMessage]);

  function send(destination: string, body: any) {
    if (stompRef.current?.connected) {
      stompRef.current.publish({ destination, body: JSON.stringify(body) });
    }
  }
  return send;
}
