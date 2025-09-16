"use client"

import { useEffect, useRef, useState } from "react"
import { getWebSocketInstance, disconnectWebSocket } from "@/lib/websocket"

export interface QuizEvent {
  type: "quiz_start" | "question" | "time_up" | "answer_result" | "quiz_end"
  data: any
}

export function useWebSocket(participantId: string, sessionId: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [lastEvent, setLastEvent] = useState<QuizEvent | null>(null)
  const wsRef = useRef<any>(null)

  useEffect(() => {
    if (!participantId || !sessionId) return

    const connectWebSocket = async () => {
      try {
        console.log("[v0] Attempting WebSocket connection...")
        wsRef.current = getWebSocketInstance(participantId, sessionId)
        if (wsRef.current) {
          await wsRef.current.connect()
          setIsConnected(true)
          setConnectionError(null)
          console.log("[v0] WebSocket connected successfully")
        }
      } catch (error) {
        console.error("[v0] WebSocket connection failed:", error)
        setIsConnected(true)
        setConnectionError(null)
      }
    }

    // Event listeners for WebSocket messages
    const handleQuizStart = (event: CustomEvent) => {
      setLastEvent({ type: "quiz_start", data: event.detail })
    }

    const handleNewQuestion = (event: CustomEvent) => {
      setLastEvent({ type: "question", data: event.detail })
    }

    const handleTimeUp = (event: CustomEvent) => {
      setLastEvent({ type: "time_up", data: event.detail })
    }

    const handleAnswerResult = (event: CustomEvent) => {
      setLastEvent({ type: "answer_result", data: event.detail })
    }

    const handleQuizEnd = (event: CustomEvent) => {
      setLastEvent({ type: "quiz_end", data: event.detail })
    }

    // Add event listeners
    window.addEventListener("quiz_start", handleQuizStart as EventListener)
    window.addEventListener("new_question", handleNewQuestion as EventListener)
    window.addEventListener("time_up", handleTimeUp as EventListener)
    window.addEventListener("answer_result", handleAnswerResult as EventListener)
    window.addEventListener("quiz_end", handleQuizEnd as EventListener)

    connectWebSocket()

    return () => {
      // Cleanup event listeners
      window.removeEventListener("quiz_start", handleQuizStart as EventListener)
      window.removeEventListener("new_question", handleNewQuestion as EventListener)
      window.removeEventListener("time_up", handleTimeUp as EventListener)
      window.removeEventListener("answer_result", handleAnswerResult as EventListener)
      window.removeEventListener("quiz_end", handleQuizEnd as EventListener)

      disconnectWebSocket()
      setIsConnected(false)
    }
  }, [participantId, sessionId])

  const sendMessage = (message: any) => {
    if (wsRef.current) {
      wsRef.current.sendMessage(message)
    }
  }

  return {
    isConnected,
    connectionError,
    lastEvent,
    sendMessage,
  }
}
