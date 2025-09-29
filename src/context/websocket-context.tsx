"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type WebSocketMessage = {
  type: "participant_joined" | "participant_left" | "question_sync" | "answer_submitted" | "time_sync"
  data: unknown
}

export type Participant = {
  id: string
  nickname: string
  isReady: boolean
}

type WebSocketContextType = {
  socket: WebSocket | null
  isConnected: boolean
  participants: Participant[]
  currentQuestionIndex: number
  timeLeft: number
  sendMessage: (message: WebSocketMessage) => void
  joinRoom: (roomId: string, nickname: string) => void
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider")
  }
  return context
}

interface WebSocketProviderProps {
  children: ReactNode
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)

  const sendMessage = (message: WebSocketMessage) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message))
    }
  }

  const joinRoom = (roomId: string, nickname: string) => {
    // For demo purposes, we'll simulate WebSocket connection
    // In a real app, you'd connect to your WebSocket server
    const mockSocket = {
      send: (data: string) => {
        console.log("[v0] Mock WebSocket send:", data)
      },
      readyState: WebSocket.OPEN,
      close: () => {},
    } as WebSocket

    setSocket(mockSocket)
    setIsConnected(true)

    // Simulate joining room
    const newParticipant: Participant = {
      id: Math.random().toString(36).substr(2, 9),
      nickname,
      isReady: true,
    }

    setParticipants([newParticipant])

    // Simulate other participants joining
    setTimeout(() => {
      const mockParticipants: Participant[] = [
        { id: "user1", nickname: "QuizMaster", isReady: true },
        { id: "user2", nickname: "BrainBox", isReady: true },
        { id: "user3", nickname: "Thinker", isReady: true },
      ]
      setParticipants((prev) => [...prev, ...mockParticipants])
    }, 2000)
  }

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close()
      }
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
  }

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>
}
