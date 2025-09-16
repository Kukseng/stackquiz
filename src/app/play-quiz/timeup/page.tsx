"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight, AlertTriangle } from "lucide-react"
import { useWebSocket } from "@/hooks/use-websocket"

type LastAnswer = {
  questionText: string
  // Add other properties as needed, e.g. answer: string, etc.
}

export default function Page() {
  const [participantId, setParticipantId] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [lastAnswer, setLastAnswer] = useState<LastAnswer | null>(null)
  const [showNextButton, setShowNextButton] = useState(false)
  const router = useRouter()

  const { lastEvent } = useWebSocket(participantId, sessionId)

  useEffect(() => {
    // Get participant info from localStorage
    const storedParticipantId = localStorage.getItem("participantId")
    const storedSessionId = localStorage.getItem("sessionId")
    const storedLastAnswer = localStorage.getItem("lastAnswer")

    if (!storedParticipantId || !storedSessionId) {
      router.push("/")
      return
    }

    setParticipantId(storedParticipantId)
    setSessionId(storedSessionId)

    if (storedLastAnswer) {
      setLastAnswer(JSON.parse(storedLastAnswer))
    }

    // Show next button after animation
    setTimeout(() => setShowNextButton(true), 2000)
  }, [router])

  // Handle WebSocket events
  useEffect(() => {
    if (lastEvent?.type === "question") {
      router.push("/play-quiz/question")
    } else if (lastEvent?.type === "quiz_end") {
      router.push("/play-quiz/result/summary")
    }
  }, [lastEvent, router])

  const handleNextQuestion = () => {
    // In real app, this would be triggered by WebSocket
    router.push("/play-quiz/question")
  }

  const handleViewResults = () => {
    router.push("/play-quiz/result/summary")
  }

  return (
    <div className="min-h-screen quiz-background flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-amber-100">
      <Card className="w-full max-w-lg quiz-card">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4">
            <div className="relative">
              <Clock className="w-24 h-24 text-orange-500 mx-auto animate-pulse" />
              <div className="absolute inset-0 w-24 h-24 bg-orange-500 rounded-full opacity-20 animate-ping mx-auto"></div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-orange-600">Time is Up!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-orange-600">
              <AlertTriangle className="w-6 h-6" />
              <span className="font-semibold text-lg">No answer submitted</span>
            </div>

            {lastAnswer && (
              <div className="bg-orange-50 p-4 rounded-lg space-y-2 border border-orange-200">
                <p className="text-sm text-gray-600 font-medium">Question:</p>
                <p className="font-semibold text-gray-800">{lastAnswer.questionText}</p>

                <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-500 mt-3">
                  <p className="text-yellow-700 text-sm font-medium">
                    Time ran out before you could submit an answer. Try to be quicker next time!
                  </p>
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-blue-700 text-sm font-bold">Tip:</p>
              <p className="text-blue-600 text-sm font-medium">
                Keep an eye on the timer and submit your best guess if you are running out of time.
              </p>
            </div>
          </div>

          {showNextButton && (
            <div className="space-y-3">
              <Button
                onClick={handleNextQuestion}
                className="w-full quiz-button-primary h-12 text-lg bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Next Question
              </Button>
              <Button
                onClick={handleViewResults}
                variant="outline"
                className="w-full bg-white border-2 border-purple-300 text-purple-700 hover:bg-purple-50 h-12 text-lg font-medium"
              >
                View Results
              </Button>
            </div>
          )}

          {!showNextButton && (
            <div className="text-center">
              <p className="text-gray-600 font-medium">Waiting for next question...</p>
              <div className="flex justify-center space-x-1 mt-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
