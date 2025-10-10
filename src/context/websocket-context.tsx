"use client"

import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react"

// --- Types ---
export type WebSocketMessage = {
  type: "participant_joined" | "participant_left" | "question_sync" | "answer_submitted" | "time_sync"
  data: unknown
}

export type Participant = {
  id: string
  nickname: string
  isReady: boolean
}

export type WebSocketContextType = {
  socket: WebSocket | null
  isConnected: boolean
  participants: Participant[]
  currentQuestionIndex: number
  timeLeft: number
  sendMessage: (message: WebSocketMessage) => void
  joinRoom: (nickname: string) => void
  roomId: string | null
}

// --- Context ---
const WebSocketContext = createContext<WebSocketContextType | null>(null)

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (!context) throw new Error("useWebSocket must be used within a WebSocketProvider")
  return context
}

// --- Provider Props ---
interface WebSocketProviderProps {
  children: ReactNode
  roomId: string
}

// --- Provider ---
export function WebSocketProvider({ children, roomId }: WebSocketProviderProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)

  // Send message helper
  const sendMessage = (message: WebSocketMessage) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message))
    }
  }

  // Join room
  const joinRoom = (nickname: string) => {
    if (!roomId) return

    // Replace with actual WebSocket URL
    const ws = new WebSocket(`wss://yourserver.com/quiz?room=${roomId}`)

    ws.onopen = () => {
      console.log(`Connected to room: ${roomId}`)
      setIsConnected(true)

      // Notify server we're joining (optional)
      sendMessage({ type: "participant_joined", data: { nickname } })

      // Add self as participant
      const self: Participant = { id: Math.random().toString(36).substr(2, 9), nickname, isReady: true }
      setParticipants([self])
    }

    ws.onmessage = (event) => {
      const msg: WebSocketMessage = JSON.parse(event.data)
      // Example: handle participant_joined
      if (msg.type === "participant_joined" && typeof msg.data === "object") {
        setParticipants((prev) => [...prev, msg.data as Participant])
      }
      // Add other message handling here
    }

    ws.onclose = () => {
      console.log("Disconnected from server")
      setIsConnected(false)
    }

    setSocket(ws)
  }

  useEffect(() => {
    // Cleanup socket on unmount
    return () => {
      if (socket) socket.close()
    }
  }, [socket])

  const value: WebSocketContextType = {
    socket,
    isConnected,
    participants,
    currentQuestionIndex,
    timeLeft,
    sendMessage,
    joinRoom,
    roomId,
  }

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>
}
