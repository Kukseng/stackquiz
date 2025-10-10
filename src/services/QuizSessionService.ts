
// // services/QuizSessionService.ts

// // =========================
// // 🔵 Organizer APIs
// // =========================

// export async function startSession(sessionId: string, token: string) {
//   try {
//     const response = await fetch(`/api/v1/sessions/${sessionId}/start`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`,
//       },
//     })
//     if (!response.ok) throw new Error(`Failed to start session: ${response.status}`)
//     return await response.json()
//   } catch (error) {
//     console.error("❌ Error starting session:", error)
//     throw error
//   }
// }

// export async function nextQuestion(sessionId: string, token: string) {
//   try {
//     const response = await fetch(`/api/v1/sessions/${sessionId}/next-question`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`,
//       },
//     })
//     if (!response.ok) throw new Error(`Failed to go to next question: ${response.status}`)
//     return await response.json()
//   } catch (error) {
//     console.error("❌ Error going to next question:", error)
//     throw error
//   }
// }

// export async function endSession(sessionId: string, token: string) {
//   try {
//     const response = await fetch(`/api/v1/sessions/${sessionId}/end`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`,
//       },
//     })
//     if (!response.ok) throw new Error(`Failed to end session: ${response.status}`)
//     return await response.json()
//   } catch (error) {
//     console.error("❌ Error ending session:", error)
//     throw error
//   }
// }

// // =========================
// // 🟢 Participant APIs
// // =========================

// export async function joinSession(sessionId: string, participantName: string) {
//   try {
//     const response = await fetch(`/api/v1/sessions/${sessionId}/join`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name: participantName }),
//     })
//     if (!response.ok) throw new Error(`Failed to join session: ${response.status}`)
//     return await response.json()
//   } catch (error) {
//     console.error("❌ Error joining session:", error)
//     throw error
//   }
// }

// // =========================
// // ⚡ Real-time WebSocket
// // =========================

// let socket: WebSocket | null = null

// export function connectWebSocket(
//   sessionId: string,
//   onMessage: (msg: any) => void,
//   onOpen?: () => void,
//   onClose?: () => void,
//   onError?: (err: Event) => void
// ) {
//   socket = new WebSocket(`ws://localhost:8000/ws/sessions/${sessionId}`)

//   socket.onopen = () => {
//     console.log("✅ WebSocket connected")
//     if (onOpen) onOpen()
//   }

//   socket.onmessage = (event) => {
//     try {
//       const msg = JSON.parse(event.data)
//       console.log("📩 WS Message:", msg)
//       onMessage(msg)
//     } catch (e) {
//       console.error("❌ Error parsing WS message:", e)
//     }
//   }

//   socket.onerror = (err) => {
//     console.error("❌ WebSocket error:", err)
//     if (onError) onError(err)
//   }

//   socket.onclose = () => {
//     console.log("🔌 WebSocket disconnected")
//     if (onClose) onClose()
//   }

//   return socket
// }

// // =========================
// // 🟡 Organizer: Create Session
// // =========================
// export async function createSession(quizId: string, hostName: string, token: string) {
//   try {
//     const response = await fetch(`/api/v1/sessions`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         quiz: quizId,
//         hostName: hostName,
//       }),
//     })

//     if (!response.ok) throw new Error(`Failed to create session: ${response.status}`)
//     return await response.json() // returns session object including sessionCode
//   } catch (error) {
//     console.error("❌ Error creating session:", error)
//     throw error
//   }
// }

// // =========================
// // 📝 Send Answer (Participant)
// // =========================
// export function sendAnswer(questionId: string, answer: string) {
//   if (!socket || socket.readyState !== WebSocket.OPEN) {
//     console.error("❌ Cannot send answer, WebSocket not connected")
//     return
//   }

//   const payload = {
//     type: "ANSWER",
//     questionId,
//     answer,
//     sentAt: new Date().toISOString(),
//   }

//   socket.send(JSON.stringify(payload))
//   console.log("📤 Sent Answer:", payload)
// }

// src/services/QuizSessionService.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9999/api/v1";
const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:9999/ws";

export interface Participant {
  name: string;
  emoji: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
}

// 1️⃣ REST API to create a session
export async function createSession(quizId: string, hostName: string) {
  const res = await fetch(`${API_BASE}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quizId, hostName }),
  });
  if (!res.ok) throw new Error("Failed to create session");
  return res.json(); // should return { id, sessionCode }
}

// 2️⃣ REST API to join session
export async function joinSession(sessionId: string, participantName: string) {
  const res = await fetch(`${API_BASE}/sessions/${sessionId}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: participantName }),
  });
  if (!res.ok) throw new Error("Failed to join session");
  return res.json();
}

// 3️⃣ WebSocket for real-time updates
let ws: WebSocket | null = null;

export function connectWebSocket(sessionId: string, onMessage: (msg: any) => void) {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  ws = new WebSocket(`${WS_BASE}/sessions/${sessionId}`);

  ws.onopen = () => console.log("✅ WS connected");
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    onMessage(msg);
  };
  ws.onclose = () => console.log("🔌 WS disconnected");
  ws.onerror = (err) => console.error("❌ WS error", err);

  return ws;
}

// 4️⃣ Send answer via WebSocket
export function sendAnswer(questionId: string, answer: string) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify({ type: "ANSWER", questionId, answer }));
}
