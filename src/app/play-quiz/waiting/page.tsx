"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Users, Clock } from "lucide-react"
import { useWebSocket } from "@/hooks/use-websocket"

export default function Page() {
  const [participantId, setParticipantId] = useState("")
  const [sessionId, setSessionId] = useState("")
  const router = useRouter()

  const { isConnected, connectionError, lastEvent } = useWebSocket(participantId, sessionId)

  useEffect(() => {
    let storedParticipantId = localStorage.getItem("participantId")
    let storedSessionId = localStorage.getItem("sessionId")

    if (!storedParticipantId || !storedSessionId) {
      // Generate demo IDs for development
      storedParticipantId = `participant_${Math.random().toString(36).substr(2, 9)}`
      storedSessionId = `session_${Math.random().toString(36).substr(2, 9)}`

      localStorage.setItem("participantId", storedParticipantId)
      localStorage.setItem("sessionId", storedSessionId)
    }

    setParticipantId(storedParticipantId)
    setSessionId(storedSessionId)
  }, [router])

  useEffect(() => {
    if (lastEvent?.type === "quiz_start") {
      router.push("/play-quiz/question")
    }
  }, [lastEvent, router])

  const handleStartQuiz = () => {
    router.push("/play-quiz/question")
  }

  return (
    <div className="min-h-screen quiz-background flex items-center justify-center p-4 relative">
      <div className="kahoot-shape kahoot-triangle" style={{ top: "15%", left: "10%", animationDelay: "0s" }}></div>
      <div className="kahoot-shape kahoot-circle" style={{ top: "25%", right: "15%", animationDelay: "2s" }}></div>
      <div className="kahoot-shape kahoot-square" style={{ bottom: "30%", left: "12%", animationDelay: "4s" }}></div>
      <div className="kahoot-shape kahoot-diamond" style={{ bottom: "20%", right: "18%", animationDelay: "6s" }}></div>

      <Card className="w-full max-w-lg quiz-card relative z-10">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            Get Ready!
          </CardTitle>
          <CardDescription className="text-gray-700 text-lg font-semibold">
            Waiting for the game to start...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3">
              {isConnected ? (
                <>
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-lg text-green-600 font-bold">Connected</span>
                </>
              ) : connectionError ? (
                <>
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-lg text-red-600 font-bold">Connection Error</span>
                </>
              ) : (
                <>
                  <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                  <span className="text-lg text-purple-600 font-bold">Connecting...</span>
                </>
              )}
            </div>

            {connectionError && (
              <div className="text-sm text-red-600 bg-red-50 p-4 rounded-xl border-2 border-red-200 font-semibold">
                {connectionError}
              </div>
            )}

            <div className="space-y-4 bg-purple-50 p-6 rounded-xl border-2 border-purple-200">
              <div className="flex items-center justify-center space-x-3 text-gray-800">
                <Users className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-lg">Player: {participantId}</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-800">
                <Clock className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-lg">PIN: {sessionId}</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="flex justify-center space-x-3 mb-6">
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div
                className="w-4 h-4 bg-yellow-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>

          <Button
            onClick={handleStartQuiz}
            className="w-full kahoot-primary-button h-16 text-xl"
            disabled={!isConnected}
          >
            {isConnected ? "🚀 Start Quiz" : "Waiting for Connection..."}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
