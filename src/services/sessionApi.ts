
// services/sessionApi.ts

const API_BASE = "/api/v1/sessions"

// =========================
// 🔵 Organizer APIs
// =========================

// Start session
export async function startSession(sessionId: string, token: string) {
  const res = await fetch(`${API_BASE}/${sessionId}/start`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // optional if secured
    },
  })
  if (!res.ok) throw new Error("❌ Failed to start session")
  return res.json()
}

// Next question
export async function nextQuestion(sessionId: string, token: string) {
  const res = await fetch(`${API_BASE}/${sessionId}/next-question`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error("❌ Failed to go next question")
  return res.json()
}

// End session
export async function endSession(sessionId: string, token: string) {
  const res = await fetch(`${API_BASE}/${sessionId}/end`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error("❌ Failed to end session")
  return res.json()
}

// =========================
// 🟢 Participant APIs
// =========================

// Join session
export async function joinSession(sessionCode: string, name: string) {
  const res = await fetch(`${API_BASE}/${sessionCode}/join`, {
    method: "GET", // if your backend requires POST with body, change here
    headers: {
      "Content-Type": "application/json",
    },
  })
  if (!res.ok) throw new Error("❌ Failed to join session")
  return res.json()
}

// Get session info
export async function getSession(sessionCode: string) {
  const res = await fetch(`${API_BASE}/${sessionCode}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  if (!res.ok) throw new Error("❌ Failed to get session")
  return res.json()
}
