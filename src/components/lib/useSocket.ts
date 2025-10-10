
"use client"
import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // your server URL

socket.on("connect", () => {
  console.log("Connected to WS:", socket.id);
});

export default socket;
