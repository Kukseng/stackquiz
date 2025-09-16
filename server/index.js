
"use client"
import express from "express";
import http from "http";
import { Server } from "socket.io";
import fetch from "node-fetch"; // or global fetch in newer Node

const API_BASE = process.env.API_BASE || "https://stackquiz-api.stackquiz.me/api/v1";
const PORT = process.env.PORT || 4000;

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

// In-memory minimal room state (for demo). Replace with DB/Redis for production
const rooms = {}; // { sessionId: { participants: {socketId:{id,name,score}}, currentQuestionIndex, questions } }

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  socket.on("createSession", async ({ hostToken, quizId, hostName }) => {
    // Create session via REST API
    const res = await fetch(`${API_BASE}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${hostToken}` },
      body: JSON.stringify({ quizId }),
    });
    const session = await res.json(); // expected { id, code, ... }
    const sessionId = session.id ?? session.sessionId ?? session.code;

    // initialize in-memory
    rooms[sessionId] = {
      sessionId,
      hostSocket: socket.id,
      participants: {},
      currentQuestionIndex: 0,
      questions: session.questions ?? [], // server can also fetch quiz questions
      sessionCode: session.sessionCode ?? session.code,
    };

    socket.join(sessionId);

    // initialize leaderboard via API if provided
    await fetch(`${API_BASE}/leaderboard/session/${sessionId}/initialize`, { method: "POST" });

    socket.emit("sessionCreated", { session, sessionId });
  });

  socket.on("joinSession", async ({ sessionCode, nickname }) => {
    // Call participant join API to validate / create participant
    const res = await fetch(`${API_BASE}/participants/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionCode, nickname }),
    });
    const participant = await res.json(); // expects participant id, maybe token
    const sessionId = participant.sessionId ?? participant.session?.id ?? sessionCode;

    // ensure room exists in memory
    if (!rooms[sessionId]) rooms[sessionId] = { participants: {}, currentQuestionIndex: 0 };

    rooms[sessionId].participants[socket.id] = {
      socketId: socket.id,
      participantId: participant.id ?? participant.participantId ?? socket.id,
      nickname,
      score: 0,
    };

    socket.join(sessionId);
    io.to(sessionId).emit("participantsUpdated", Object.values(rooms[sessionId].participants));
    socket.emit("joined", { sessionId, participant: rooms[sessionId].participants[socket.id] });
  });

  socket.on("startSession", async ({ sessionId }) => {
    const room = rooms[sessionId];
    if (!room) return socket.emit("error", "session not found");

    // call API to start session
    await fetch(`${API_BASE}/sessions/${sessionId}/start`, { method: "PUT" });

    room.currentQuestionIndex = 0;
    // fetch question from REST (optional)
    // Here for demo we assume questions are part of room.questions
    const question = room.questions[room.currentQuestionIndex] ?? { id: null, text: "Question not loaded" };

    io.to(sessionId).emit("question", { question, index: room.currentQuestionIndex });
  });

  socket.on("nextQuestion", async ({ sessionId }) => {
    const room = rooms[sessionId];
    if (!room) return;
    room.currentQuestionIndex++;
    // notify API to move next
    await fetch(`${API_BASE}/sessions/${sessionId}/next-question`, { method: "PUT" });

    if (room.currentQuestionIndex >= (room.questions?.length ?? 0)) {
      io.to(sessionId).emit("sessionEnded", { leaderboard: Object.values(room.participants) });
      // finalize leaderboard via API
      await fetch(`${API_BASE}/leaderboard/session/${sessionId}/finalize`, { method: "POST" });
      return;
    }

    const question = room.questions[room.currentQuestionIndex];
    io.to(sessionId).emit("question", { question, index: room.currentQuestionIndex });
  });

  socket.on("submitAnswer", async ({ sessionId, participantId, questionId, answer, timeTaken }) => {
    const room = rooms[sessionId];
    if (!room) return;

    // Option 1: persist answer via REST API
    await fetch(`${API_BASE}/answers/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId, questionId, answer, sessionId, timeTaken }),
    });

    // Evaluate correctness locally if we have answer key (or fetch from API)
    const currentQ = room.questions?.[room.currentQuestionIndex];
    const isCorrect = currentQ && currentQ.correctOption === answer;

    // simple scoring: +10 correct, +bonus for speed
    const participantSocketEntry = Object.values(room.participants).find((p) => p.participantId === participantId);
    if (participantSocketEntry) {
      participantSocketEntry.score += isCorrect ? 10 + Math.max(0, 5 - Math.floor(timeTaken || 0)) : 0;
    }

    // update live leaderboard via API (optional)
    await fetch(`${API_BASE}/leaderboard/live`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, participantId, score: participantSocketEntry?.score ?? 0 }),
    });

    // broadcast updated leaderboard
    io.to(sessionId).emit("leaderboard", Object.values(room.participants).sort((a,b)=>b.score-a.score));
  });

  socket.on("disconnect", () => {
    // remove from rooms
    for (const rId of Object.keys(rooms)) {
      const r = rooms[rId];
      if (r.participants?.[socket.id]) {
        delete r.participants[socket.id];
        io.to(rId).emit("participantsUpdated", Object.values(r.participants));
      }
    }
    console.log("socket disconnected", socket.id);
  });
});

httpServer.listen(PORT, () => console.log("Realtime server listening on", PORT));
