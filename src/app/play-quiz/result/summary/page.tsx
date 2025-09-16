"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, Clock, CheckCircle, XCircle, AlertTriangle, Home, RotateCcw } from "lucide-react"

interface QuizSummary {
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  timeoutAnswers: number
  totalPoints: number
  averageTime: number
  accuracy: number
  rank?: number
  totalParticipants?: number
}

export default function Page() {
  const [participantId, setParticipantId] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [summary, setSummary] = useState<QuizSummary | null>(null)
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

    // Load quiz summary
    loadQuizSummary(storedParticipantId)
  }, [router])

  const loadQuizSummary = async (participantId: string) => {
    try {
      // In a real app, this would fetch from the API
      // For demo purposes, we'll use mock data
      const mockSummary: QuizSummary = {
        totalQuestions: 10,
        correctAnswers: 7,
        incorrectAnswers: 2,
        timeoutAnswers: 1,
        totalPoints: 700,
        averageTime: 12.5,
        accuracy: 70,
        rank: 3,
        totalParticipants: 25,
      }

      setTimeout(() => {
        setSummary(mockSummary)
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error loading quiz summary:", error)
      setIsLoading(false)
    }
  }

  const handleViewDetails = () => {
    router.push("/play-quiz/result/detail")
  }

  const handlePlayAgain = () => {
    // Clear stored data and return to home
    localStorage.removeItem("participantId")
    localStorage.removeItem("sessionId")
    localStorage.removeItem("lastAnswer")
    router.push("/")
  }

  const handleGoHome = () => {
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen quiz-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-2 text-white font-medium">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="min-h-screen quiz-background flex items-center justify-center">
        <Card className="w-full max-w-md quiz-card">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 font-medium">Unable to load quiz results.</p>
            <Button onClick={handleGoHome} className="mt-4 quiz-button-primary">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getPerformanceColor = (accuracy: number) => {
    if (accuracy >= 80) return "text-green-600"
    if (accuracy >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceBadge = (accuracy: number) => {
    if (accuracy >= 90) return { text: "Excellent", variant: "default" as const, color: "bg-green-500" }
    if (accuracy >= 80) return { text: "Great", variant: "secondary" as const, color: "bg-blue-500" }
    if (accuracy >= 70) return { text: "Good", variant: "secondary" as const, color: "bg-yellow-500" }
    if (accuracy >= 60) return { text: "Fair", variant: "outline" as const, color: "bg-orange-500" }
    return { text: "Needs Improvement", variant: "destructive" as const, color: "bg-red-500" }
  }

  const performanceBadge = getPerformanceBadge(summary.accuracy)

  return (
    <div className="min-h-screen quiz-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-16 h-16 text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Quiz Complete!</h1>
          <p className="text-purple-100 text-lg font-medium">Here is how you performed</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="quiz-card">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{summary.totalPoints}</p>
              <p className="text-sm text-gray-600 font-medium">Total Points</p>
            </CardContent>
          </Card>

          <Card className="quiz-card">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{summary.accuracy}%</p>
              <p className="text-sm text-gray-600 font-medium">Accuracy</p>
            </CardContent>
          </Card>

          <Card className="quiz-card">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{summary.averageTime}s</p>
              <p className="text-sm text-gray-600 font-medium">Avg. Time</p>
            </CardContent>
          </Card>

          <Card className="quiz-card">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                #{summary.rank}/{summary.totalParticipants}
              </p>
              <p className="text-sm text-gray-600 font-medium">Rank</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Results */}
        <Card className="mb-8 quiz-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">Performance Summary</CardTitle>
              <Badge variant={performanceBadge.variant} className={performanceBadge.color}>
                {performanceBadge.text}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Accuracy Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Overall Accuracy</span>
                <span className={`text-sm font-bold ${getPerformanceColor(summary.accuracy)}`}>
                  {summary.accuracy}%
                </span>
              </div>
              <Progress value={summary.accuracy} className="h-3" />
            </div>

            {/* Answer Breakdown */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-lg font-bold text-green-700">{summary.correctAnswers}</p>
                <p className="text-sm text-green-600 font-medium">Correct</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-lg font-bold text-red-700">{summary.incorrectAnswers}</p>
                <p className="text-sm text-red-600 font-medium">Incorrect</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                <AlertTriangle className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <p className="text-lg font-bold text-orange-700">{summary.timeoutAnswers}</p>
                <p className="text-sm text-orange-600 font-medium">Timeout</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleViewDetails}
            variant="outline"
            size="lg"
            className="bg-white border-2 border-purple-300 text-purple-700 hover:bg-purple-50 h-12 text-lg font-medium"
          >
            View Detailed Results
          </Button>
          <Button onClick={handlePlayAgain} size="lg" className="quiz-button-secondary h-12 text-lg">
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
          <Button
            onClick={handleGoHome}
            variant="outline"
            size="lg"
            className="bg-white border-2 border-purple-300 text-purple-700 hover:bg-purple-50 h-12 text-lg font-medium"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>
      </div>
    </div>
  )
}
