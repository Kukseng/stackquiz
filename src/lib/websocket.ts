// QuizWebSocket.ts
export class QuizWebSocket {
  private ws: WebSocket | null = null
  private url: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private isMockMode = false
  private role: "participant" | "organizer"
  private participantId?: string
  private sessionId: string

  constructor(role: "participant" | "organizer", sessionId: string, participantId?: string) {
    this.role = role
    this.sessionId = sessionId
    this.participantId = participantId

    const isDevelopment =
      process.env.NODE_ENV === "development" ||
      (typeof window !== "undefined" && window.location.hostname === "localhost")

    if (isDevelopment) {
      this.isMockMode = true
      this.url = ""
      console.log(`[v0] Starting in mock WebSocket mode (${this.role})`)
    } else {
      const baseUrl = `wss://stackquiz-api.stackquiz.me/ws`
      if (role === "participant" && participantId) {
        this.url = `${baseUrl}?role=participant&participantId=${participantId}&sessionId=${sessionId}`
      } else {
        this.url = `${baseUrl}?role=organizer&sessionId=${sessionId}`
      }
    }
  }

  connect(): Promise<void> {
    return new Promise((resolve) => {
      try {
        if (this.isMockMode) {
          console.log(`[v0] Using mock WebSocket for ${this.role}`)
          this.setupMockWebSocket()
          resolve()
          return
        }

        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
          console.log(`[v0] ${this.role} WebSocket connected`)
          this.reconnectAttempts = 0
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            this.handleMessage(data)
          } catch (error) {
            console.error("Error parsing WebSocket message:", error)
          }
        }

        this.ws.onclose = () => {
          console.log(`[v0] ${this.role} WebSocket disconnected`)
          if (!this.isMockMode) {
            this.attemptReconnect()
          }
        }

        this.ws.onerror = () => {
          console.log(`[v0] ${this.role} WebSocket error, switching to mock mode`)
          this.ws = null
          this.isMockMode = true
          this.setupMockWebSocket()
          resolve()
        }
      } catch (error) {
        console.log("[v0] WebSocket setup error, using mock mode:", error)
        this.isMockMode = true
        this.setupMockWebSocket()
        resolve()
      }
    })
  }

  private handleMessage(data: { type: string; [key: string]: unknown }) {
    if (this.role === "participant") {
      switch (data.type) {
        case "quiz_start":
          window.dispatchEvent(new CustomEvent("quiz_start", { detail: data }))
          break
        case "new_question":
          window.dispatchEvent(new CustomEvent("new_question", { detail: data }))
          break
        case "answer_result":
          window.dispatchEvent(new CustomEvent("answer_result", { detail: data }))
          break
        case "quiz_end":
          window.dispatchEvent(new CustomEvent("quiz_end", { detail: data }))
          break
        default:
          console.log("Unknown participant message:", data.type)
      }
    } else if (this.role === "organizer") {
      switch (data.type) {
        case "participant_join":
          window.dispatchEvent(new CustomEvent("participant_join", { detail: data }))
          break
        case "leaderboard":
          window.dispatchEvent(new CustomEvent("leaderboard", { detail: data }))
          break
        case "quiz_end":
          window.dispatchEvent(new CustomEvent("quiz_end", { detail: data }))
          break
        default:
          console.log("Unknown organizer message:", data.type)
      }
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`[v0] Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts}`)
        this.connect()
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  private setupMockWebSocket() {
    console.log(`[v0] Setting up mock WebSocket for ${this.role}`)
    setTimeout(() => {
      this.handleMessage({
        type: this.role === "participant" ? "quiz_start" : "participant_join",
        data: { message: `Mock event for ${this.role}` },
      })
    }, 2000)
  }

  sendMessage(message: { type: string; [key: string]: unknown }) {
    if (this.isMockMode) {
      console.log(`[v0] Mock ${this.role} sending:`, message)
      return
    }
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    }
  }

  disconnect() {
    if (this.ws && !this.isMockMode) {
      this.ws.close()
      this.ws = null
    }
    console.log(`[v0] ${this.role} WebSocket disconnected`)
  }
}

// Singleton
let wsInstance: QuizWebSocket | null = null

export const getWebSocketInstance = (
  role: "participant" | "organizer",
  sessionId: string,
  participantId?: string
): QuizWebSocket => {
  if (!wsInstance) {
    wsInstance = new QuizWebSocket(role, sessionId, participantId)
  }
  return wsInstance
}

export const disconnectWebSocket = () => {
  if (wsInstance) {
    wsInstance.disconnect()
    wsInstance = null
  }
}
