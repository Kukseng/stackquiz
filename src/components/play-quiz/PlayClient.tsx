"use client";
import { useEffect, useState } from "react";

export default function PlayClient() {
  const [messages, setMessages] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");
    setWs(socket);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, `${data.from}: ${data.message}`]);
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws) ws.send("Hello from Player!");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">🎮 WebSocket Play</h1>
      <button
        onClick={sendMessage}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-4"
      >
        Send Message
      </button>
      <div className="mt-6">
        <h2 className="font-semibold">Messages:</h2>
        <ul>
          {messages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
