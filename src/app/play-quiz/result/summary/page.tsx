"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface QuizSummary {
  totalQuestions: number
  correctAnswers: number
  partiallyCorrectAnswers?: number
  incorrectAnswers: number
  timeoutAnswers?: number
  totalPoints: number
  averageTime: number
  accuracy: number
  rank?: number
  totalParticipants?: number
  streak?: number
}

export default function Page() {
  const [participantId, setParticipantId] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [summary, setSummary] = useState<QuizSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedParticipantId = localStorage.getItem("participantId")
    const storedSessionId = localStorage.getItem("sessionId")

    if (!storedParticipantId || !storedSessionId) {
      router.push("/")
      return
    }
    setParticipantId(storedParticipantId)
    setSessionId(storedSessionId)
    loadQuizSummary(storedParticipantId, storedSessionId)
  }, [router])

const loadQuizSummary = async (participantId: string, sessionId: string) => {
  try {
    const res = await fetch(
      `https://stackquiz-api.stackquiz.me/api/v1/sessions/${sessionId}/summary?participantId=${participantId}`
    )
    if (!res.ok) throw new Error("Failed to load summary")

    const data = await res.json()
    setSummary(data)  // API should return QuizSummary shape
    setIsLoading(false)
  } catch (error) {
    console.error("Error loading quiz summary:", error)
    setIsLoading(false)
  }
}

  if (isLoading) {
    return (
      <div className="min-h-screen quiz-background flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-2 font-medium">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="min-h-screen quiz-background flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-600 font-medium">Unable to load quiz results.</p>
          <Button onClick={() => router.push("/")} className="mt-4 quiz-button-primary">
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center quiz-background px-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 w-full max-w-2xl text-center text-white">
        <h1 className="text-3xl font-bold mb-2">Summary</h1>

        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-6 py-1 mb-4">
          Solo review
        </Button>

        <p className="mb-6">Congratulations, you finished the quiz.</p>

        {/* Accuracy Progress */}
        <div className="mb-6">
          <Progress value={summary.accuracy} className="h-4 rounded-full" />
          <p className="text-sm mt-2">Accuracy {summary.accuracy}%</p>
        </div>

        {/* Rank and Score */}
        <div className="flex justify-center gap-8 mb-6">
          <div className="bg-black/60 px-4 py-2 rounded-lg">
            <p className="text-lg font-bold">Rank</p>
            <p>{summary.rank}/{summary.totalParticipants}</p>
          </div>
          <div className="bg-black/60 px-4 py-2 rounded-lg">
            <p className="text-lg font-bold">Score</p>
            <p>{summary.totalPoints}</p>
          </div>
        </div>

        <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 w-full py-3 rounded-lg font-bold text-lg mb-6">
          Find new quiz
        </Button>

        {/* Performance Stats */}
        <h2 className="text-lg font-semibold mb-4">Performance stats</h2>
        <div className="grid grid-cols-3 gap-4 text-black">
          <div className="bg-white/80 rounded-lg p-2">
            <p className="font-bold">{summary.correctAnswers}</p>
            <p className="text-sm">Correct</p>
          </div>
          <div className="bg-white/80 rounded-lg p-2">
            <p className="font-bold">{summary.partiallyCorrectAnswers}</p>
            <p className="text-sm">Partially correct</p>
          </div>
          <div className="bg-white/80 rounded-lg p-2">
            <p className="font-bold">{summary.incorrectAnswers}</p>
            <p className="text-sm">Incorrect</p>
          </div>
          <div className="bg-white/80 rounded-lg p-2">
            <p className="font-bold">{summary.averageTime}s</p>
            <p className="text-sm">Time/ques</p>
          </div>
          <div className="bg-white/80 rounded-lg p-2">
            <p className="font-bold">{summary.streak}</p>
            <p className="text-sm">Streak</p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <Button variant="outline" className="rounded-full px-6">Feedback</Button>
          <Button variant="outline" className="rounded-full px-6">Report</Button>
        </div>
      </div>
    </div>
  )
}