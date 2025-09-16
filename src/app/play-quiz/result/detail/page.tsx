"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, ArrowLeft, Home } from "lucide-react"

interface DetailedAnswer {
  questionId: string
  questionText: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  timeTaken: number
  pointsEarned: number
  options?: Array<{
    id: string
    text: string
    isCorrect: boolean
  }>
}

export default function Page() {
  const [participantId, setParticipantId] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [detailedAnswers, setDetailedAnswers] = useState<DetailedAnswer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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

    // Load detailed answers
    loadDetailedAnswers(storedParticipantId)
  }, [router])

  const loadDetailedAnswers = async (participantId: string) => {
    try {
      // In a real app, this would fetch from the API
      // For demo purposes, we'll use mock data
      const mockAnswers: DetailedAnswer[] = [
        {
          questionId: "q1",
          questionText: "What is the capital of France?",
          userAnswer: "Paris",
          correctAnswer: "Paris",
          isCorrect: true,
          timeTaken: 8,
          pointsEarned: 100,
          options: [
            { id: "opt1", text: "London", isCorrect: false },
            { id: "opt2", text: "Berlin", isCorrect: false },
            { id: "opt3", text: "Paris", isCorrect: true },
            { id: "opt4", text: "Madrid", isCorrect: false },
          ],
        },
        {
          questionId: "q2",
          questionText: "What is 2 + 2?",
          userAnswer: "5",
          correctAnswer: "4",
          isCorrect: false,
          timeTaken: 15,
          pointsEarned: 0,
          options: [
            { id: "opt1", text: "3", isCorrect: false },
            { id: "opt2", text: "4", isCorrect: true },
            { id: "opt3", text: "5", isCorrect: false },
            { id: "opt4", text: "6", isCorrect: false },
          ],
        },
        {
          questionId: "q3",
          questionText: "What is the largest planet in our solar system?",
          userAnswer: "Jupiter",
          correctAnswer: "Jupiter",
          isCorrect: true,
          timeTaken: 12,
          pointsEarned: 100,
        },
      ]

      setTimeout(() => {
        setDetailedAnswers(mockAnswers)
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error loading detailed answers:", error)
      setIsLoading(false)
    }
  }

  const handleBackToSummary = () => {
    router.push("/play-quiz/result/summary")
  }

  const handleGoHome = () => {
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen quiz-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-2 text-white font-medium">Loading detailed results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen quiz-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Detailed Results</h1>
            <p className="text-purple-100 text-lg font-medium">Review your answers question by question</p>
          </div>
          <Button
            onClick={handleBackToSummary}
            variant="outline"
            className="bg-white border-2 border-purple-300 text-purple-700 hover:bg-purple-50 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Summary
          </Button>
        </div>

        {/* Question Results */}
        <div className="space-y-6 mb-8">
          {detailedAnswers.map((answer, index) => (
            <Card key={answer.questionId} className="overflow-hidden quiz-card">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-semibold text-gray-500">Question {index + 1}</span>
                      {answer.isCorrect ? (
                        <Badge variant="default" className="bg-green-500 text-white font-medium">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Correct
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="font-medium">
                          <XCircle className="w-3 h-3 mr-1" />
                          Incorrect
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg text-gray-900 font-bold">{answer.questionText}</CardTitle>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">+{answer.pointsEarned}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      <span className="font-medium">{answer.timeTaken}s</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {answer.options ? (
                  <div className="space-y-2">
                    {answer.options.map((option) => {
                      const isUserAnswer = answer.userAnswer === option.text
                      const isCorrectOption = option.isCorrect

                      return (
                        <div
                          key={option.id}
                          className={`p-3 rounded-lg border-2 font-medium ${
                            isCorrectOption
                              ? "bg-green-50 border-green-300"
                              : isUserAnswer && !isCorrectOption
                                ? "bg-red-50 border-red-300"
                                : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-gray-800">{option.text}</span>
                            <div className="flex items-center space-x-2">
                              {isUserAnswer && (
                                <Badge variant="outline" className="text-xs font-medium">
                                  Your Answer
                                </Badge>
                              )}
                              {isCorrectOption && <CheckCircle className="w-4 h-4 text-green-500" />}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1 font-medium">Your Answer:</p>
                      <p className="font-semibold text-gray-800">{answer.userAnswer}</p>
                    </div>
                    {!answer.isCorrect && (
                      <div className="p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1 font-medium">Correct Answer:</p>
                        <p className="font-semibold text-green-700">{answer.correctAnswer}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleBackToSummary}
            variant="outline"
            size="lg"
            className="bg-white border-2 border-purple-300 text-purple-700 hover:bg-purple-50 h-12 text-lg font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Summary
          </Button>
          <Button onClick={handleGoHome} size="lg" className="quiz-button-primary h-12 text-lg">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>
      </div>
    </div>
  )
}
