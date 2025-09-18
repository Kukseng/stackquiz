// "use client"

// import { useEffect, useRef, useState } from "react"
// import { getWebSocketInstance, disconnectWebSocket } from "@/lib/websocket"

// export interface QuizEvent {
//   type: "quiz_start" | "question" | "time_up" | "answer_result" | "quiz_end"
//   data: any
// }

// export function useWebSocket(participantId: string, sessionId: string) {
//   const [isConnected, setIsConnected] = useState(false)
//   const [connectionError, setConnectionError] = useState<string | null>(null)
//   const [lastEvent, setLastEvent] = useState<QuizEvent | null>(null)
//   const wsRef = useRef<any>(null)

//   useEffect(() => {
//     if (!participantId || !sessionId) return

//     const connectWebSocket = async () => {
//       try {
//         console.log("[v0] Attempting WebSocket connection...")
//         wsRef.current = getWebSocketInstance(participantId, sessionId)
//         if (wsRef.current) {
//           await wsRef.current.connect()
//           setIsConnected(true)
//           setConnectionError(null)
//           console.log("[v0] WebSocket connected successfully")
//         }
//       } catch (error) {
//         console.error("[v0] WebSocket connection failed:", error)
//         setIsConnected(true)
//         setConnectionError(null)
//       }
//     }

//     // Event listeners for WebSocket messages
//     const handleQuizStart = (event: CustomEvent) => {
//       setLastEvent({ type: "quiz_start", data: event.detail })
//     }

//     const handleNewQuestion = (event: CustomEvent) => {
//       setLastEvent({ type: "question", data: event.detail })
//     }

//     const handleTimeUp = (event: CustomEvent) => {
//       setLastEvent({ type: "time_up", data: event.detail })
//     }

//     const handleAnswerResult = (event: CustomEvent) => {
//       setLastEvent({ type: "answer_result", data: event.detail })
//     }

//     const handleQuizEnd = (event: CustomEvent) => {
//       setLastEvent({ type: "quiz_end", data: event.detail })
//     }

//     // Add event listeners
//     window.addEventListener("quiz_start", handleQuizStart as EventListener)
//     window.addEventListener("new_question", handleNewQuestion as EventListener)
//     window.addEventListener("time_up", handleTimeUp as EventListener)
//     window.addEventListener("answer_result", handleAnswerResult as EventListener)
//     window.addEventListener("quiz_end", handleQuizEnd as EventListener)

//     connectWebSocket()

//     return () => {
//       // Cleanup event listeners
//       window.removeEventListener("quiz_start", handleQuizStart as EventListener)
//       window.removeEventListener("new_question", handleNewQuestion as EventListener)
//       window.removeEventListener("time_up", handleTimeUp as EventListener)
//       window.removeEventListener("answer_result", handleAnswerResult as EventListener)
//       window.removeEventListener("quiz_end", handleQuizEnd as EventListener)

//       disconnectWebSocket()
//       setIsConnected(false)
//     }
//   }, [participantId, sessionId])

//   const sendMessage = (message: any) => {
//     if (wsRef.current) {
//       wsRef.current.sendMessage(message)
//     }
//   }

//   return {
//     isConnected,
//     connectionError,
//     lastEvent,
//     sendMessage,
//   }
// }


"use client"

import { useEffect, useRef, useState, useCallback } from "react"

export interface WebSocketMessage {
  type: string
  payload: any
  sessionCode?: string
  participantId?: string
  timestamp?: number
}

export interface UseWebSocketOptions {
  url: string
  sessionCode?: string
  participantId?: string
  onMessage?: (message: WebSocketMessage) => void
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Event) => void
  reconnectAttempts?: number
  reconnectInterval?: number
}

export const useWebSocket = (options: UseWebSocketOptions) => {
  const {
    url,
    sessionCode,
    participantId,
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
  } = options

  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected" | "error">(
    "disconnected",
  )
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectCountRef = useRef(0)

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    setConnectionStatus("connecting")

    try {
      const wsUrl = sessionCode ? `${url}?sessionCode=${sessionCode}` : url
      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        setIsConnected(true)
        setConnectionStatus("connected")
        reconnectCountRef.current = 0
        onConnect?.()

        // Send initial connection message with participant info
        if (sessionCode && participantId) {
          sendMessage({
            type: "JOIN_SESSION",
            payload: { sessionCode, participantId },
          })
        }
      }

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          onMessage?.(message)
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error)
        }
      }

      wsRef.current.onclose = () => {
        setIsConnected(false)
        setConnectionStatus("disconnected")
        onDisconnect?.()

        // Attempt reconnection
        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectInterval)
        }
      }

      wsRef.current.onerror = (error) => {
        setConnectionStatus("error")
        onError?.(error)
      }
    } catch (error) {
      setConnectionStatus("error")
      console.error("WebSocket connection failed:", error)
    }
  }, [
    url,
    sessionCode,
    participantId,
    onConnect,
    onMessage,
    onDisconnect,
    onError,
    reconnectAttempts,
    reconnectInterval,
  ])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    setIsConnected(false)
    setConnectionStatus("disconnected")
  }, [])

  const sendMessage = useCallback(
    (message: WebSocketMessage) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            ...message,
            timestamp: Date.now(),
            sessionCode,
            participantId,
          }),
        )
      } else {
        console.warn("WebSocket is not connected")
      }
    },
    [sessionCode, participantId],
  )

  useEffect(() => {
    connect()
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    isConnected,
    connectionStatus,
    sendMessage,
    connect,
    disconnect,
  }
}
