"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Trophy, Clock, ArrowRight } from "lucide-react"
import { useWebSocket } from "@/hooks/use-websocket"

type LastAnswer = {
  questionText: string
  selectedOption?: string
  timeTaken: number
}

export default function Page(){
  const [participantId, setParticipantId] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [lastAnswer, setLastAnswer] = useState<LastAnswer | null>(null)
  const [pointsEarned, setPointsEarned] = useState(100)
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
    <div className="min-h-screen quiz-background flex items-center justify-center p-4 relative">
      <div className="kahoot-shape kahoot-triangle" style={{ top: "10%", left: "15%", animationDelay: "0s" }}></div>
      <div className="kahoot-shape kahoot-circle" style={{ top: "20%", right: "20%", animationDelay: "1s" }}></div>
      <div className="kahoot-shape kahoot-square" style={{ bottom: "25%", left: "10%", animationDelay: "2s" }}></div>
      <div className="kahoot-shape kahoot-diamond" style={{ bottom: "15%", right: "15%", animationDelay: "3s" }}></div>

      <Card className="w-full max-w-lg quiz-card relative z-10">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-6">
            <div className="relative">
              <CheckCircle className="w-32 h-32 text-green-500 mx-auto animate-bounce" />
              <div className="absolute inset-0 w-32 h-32 bg-green-500 rounded-full opacity-20 animate-ping mx-auto"></div>
            </div>
          </div>
          <CardTitle className="text-5xl font-black text-green-600 mb-4">Correct!</CardTitle>
          <CardDescription className="text-2xl font-bold text-gray-700">🎉 Awesome job! 🎉</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3 text-green-600 bg-green-50 p-4 rounded-xl border-2 border-green-200">
              <Trophy className="w-8 h-8" />
              <span className="text-3xl font-black">+{pointsEarned} points</span>
            </div>

            {lastAnswer && (
              <div className="bg-green-50 p-6 rounded-xl space-y-4 border-4 border-green-200">
                <p className="text-sm text-gray-600 font-bold uppercase tracking-wide">Question:</p>
                <p className="font-black text-gray-800 text-lg">{lastAnswer.questionText}</p>
                {lastAnswer.selectedOption && (
                  <>
                    <p className="text-sm text-gray-600 font-bold uppercase tracking-wide mt-4">Your answer:</p>
                    <p className="text-green-700 font-black text-xl">✓ Correct!</p>
                  </>
                )}
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mt-4 bg-white p-3 rounded-lg">
                  <Clock className="w-5 h-5" />
                  <span className="font-bold">Answered in {lastAnswer.timeTaken}s</span>
                </div>
              </div>
            )}
          </div>

          {showNextButton && (
            <div className="space-y-4">
              <Button onClick={handleNextQuestion} className="w-full kahoot-answer-green h-16 text-xl" size="lg">
                <ArrowRight className="w-6 h-6 mr-3" />
                Next Question
              </Button>
              <Button onClick={handleViewResults} className="w-full kahoot-secondary-button h-16 text-xl">
                📊 View Results
              </Button>
            </div>
          )}

          {!showNextButton && (
            <div className="text-center">
              <p className="text-gray-700 font-bold text-lg mb-4">Get ready for the next question!</p>
              <div className="flex justify-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
                <div
                  className="w-3 h-3 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
