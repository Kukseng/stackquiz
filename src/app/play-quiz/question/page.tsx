"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useWebSocket } from "@/hooks/use-websocket"
import { useQuizState } from "@/hooks/use-quiz-state"
import { QuizTimer } from "@/components/quiz-timer"

interface Question {
  id: string
  text: string
  options: Array<{
    id: string
    text: string
  }>
  timeLimit: number
  type: "multiple_choice" | "text"
}

export default function Page() {
  const [participantId, setParticipantId] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [textAnswer, setTextAnswer] = useState("")
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())
  const router = useRouter()

  const { isConnected, lastEvent } = useWebSocket(participantId, sessionId)
  const { submitAnswer, isSubmitting, submissionError } = useQuizState()

  useEffect(() => {
    // Get participant info from localStorage
    const storedParticipantId = localStorage.getItem("participantId")
    const storedSessionId = localStorage.getItem("sessionId")

    if (!storedParticipantId || !storedSessionId) {
      router.push("/")
      return
    }

    setParticipantId(storedParticipantId)
    setSessionId(storedSessionId)

    // Mock question data - in real app this would come from WebSocket
    setCurrentQuestion({
      id: "q1",
      text: "What is the capital of France?",
      options: [
        { id: "opt1", text: "London" },
        { id: "opt2", text: "Berlin" },
        { id: "opt3", text: "Paris" },
        { id: "opt4", text: "Madrid" },
      ],
      timeLimit: 30,
      type: "multiple_choice",
    })
    setQuestionStartTime(Date.now())
  }, [router])

  // Handle WebSocket events
  useEffect(() => {
    if (lastEvent?.type === "question") {
      setCurrentQuestion(lastEvent.data)
      setSelectedOption(null)
      setTextAnswer("")
      setQuestionStartTime(Date.now())
    } else if (lastEvent?.type === "time_up") {
      handleTimeUp()
    } else if (lastEvent?.type === "answer_result") {
      handleAnswerResult(lastEvent.data)
    }
  }, [lastEvent])

  const handleTimeUp = () => {
    if (!isSubmitting) {
      router.push("/play-quiz/timeup")
    }
  }

  interface AnswerResult {
    isCorrect: boolean
    [key: string]: unknown
  }

  const handleAnswerResult = (result: AnswerResult) => {
    if (result.isCorrect) {
      router.push("/play-quiz/correct")
    } else {
      router.push("/play-quiz/incorrect")
    }
  }

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !participantId || !sessionId || isSubmitting) return

    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000)

    console.log("[v0] Submitting answer for question:", currentQuestion.id)
    console.log("[v0] Selected option:", selectedOption)
    console.log("[v0] Time taken:", timeTaken)

    const success = await submitAnswer(participantId, sessionId, {
      questionId: currentQuestion.id,
      optionId: selectedOption || undefined,
      answerText: currentQuestion.type === "text" ? textAnswer : undefined,
      timeTaken,
    })

    if (success) {
      console.log("[v0] Answer submitted successfully, navigating to result")

      // Store the answer details for the result page
      localStorage.setItem(
        "lastAnswer",
        JSON.stringify({
          questionId: currentQuestion.id,
          questionText: currentQuestion.text,
          selectedOption,
          textAnswer,
          timeTaken,
        }),
      )

      // In a real app, we'd wait for the WebSocket response
      // For demo purposes, simulate a correct answer
      setTimeout(() => {
        router.push("/play-quiz/correct")
      }, 500)
    } else {
      console.error("[v0] Answer submission failed")
    }
  }

  const canSubmit = currentQuestion?.type === "multiple_choice" ? selectedOption : textAnswer.trim()

  if (!currentQuestion) {
    return (
      <div className="min-h-screen quiz-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-2 text-white font-medium">Loading question...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen quiz-background p-4 relative">
      <div className="kahoot-shape kahoot-triangle" style={{ top: "5%", left: "5%", animationDelay: "0s" }}></div>
      <div className="kahoot-shape kahoot-circle" style={{ top: "10%", right: "10%", animationDelay: "3s" }}></div>
      <div className="kahoot-shape kahoot-square" style={{ bottom: "20%", left: "8%", animationDelay: "6s" }}></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Timer Header */}
        <div className="mb-8">
          <Card className="quiz-card">
            <CardContent className="p-6">
              <QuizTimer initialTime={currentQuestion.timeLimit} onTimeUp={handleTimeUp} isActive={!isSubmitting} />
            </CardContent>
          </Card>
        </div>

        {/* Question Card */}
        <Card className="mb-8 quiz-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl text-gray-900 font-black text-center leading-tight">
              {currentQuestion.text}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {submissionError && (
              <Alert variant="destructive" className="border-4 border-red-300">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="font-semibold">{submissionError}</AlertDescription>
              </Alert>
            )}

            {currentQuestion.type === "multiple_choice" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentQuestion.options.map((option, index) => {
                  const colors = [
                    "kahoot-answer-red",
                    "kahoot-answer-blue",
                    "kahoot-answer-yellow",
                    "kahoot-answer-green",
                  ]
                  const shapes = ["△", "◇", "○", "□"]
                  const colorClass = colors[index % colors.length]
                  const shape = shapes[index % shapes.length]

                  return (
                    <Button
                      key={option.id}
                      className={`${colorClass} ${selectedOption === option.id ? "ring-8 ring-white ring-opacity-50" : ""} h-24 text-xl relative overflow-hidden`}
                      onClick={() => setSelectedOption(option.id)}
                      disabled={isSubmitting}
                    >
                      <div className="flex items-center space-x-4 w-full">
                        <div className="text-4xl font-black opacity-80">{shape}</div>
                        <span className="flex-1 text-left font-black">{option.text}</span>
                      </div>
                    </Button>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-4">
                <Textarea
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="resize-none h-32 border-4 border-purple-200 focus:border-purple-400 text-lg font-semibold rounded-xl"
                  disabled={isSubmitting}
                />
              </div>
            )}

            <Button
              onClick={handleSubmitAnswer}
              disabled={!canSubmit || isSubmitting}
              className="w-full kahoot-primary-button h-16 text-xl"
              size="lg"
            >
              {isSubmitting ? "Submitting..." : "Submit Answer"}
            </Button>
          </CardContent>
        </Card>

        {/* Connection Status */}
        <div className="text-center">
          <span
            className={`text-lg font-bold px-4 py-2 rounded-full ${isConnected ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
          >
            {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
          </span>
        </div>
      </div>
    </div>
  )
}
