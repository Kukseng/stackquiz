"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RotateCcw } from "lucide-react"
import type { Quiz, GameResults } from "@/app/play/[id]/page"
import { useWebSocket } from "../../context/websocket-context"
import Image from "next/image"

interface ResultsSystemProps {
  results: GameResults
  quiz: Quiz
  onPlayAgain: () => void
  playerNickname: string
}

export function ResultsSystem({ results, quiz, onPlayAgain, playerNickname }: ResultsSystemProps) {
  const { participants } = useWebSocket()
  const totalPossiblePoints = quiz.questions.reduce((acc, q) => acc + q.points, 0)
  const percentage = totalPossiblePoints > 0 ? Math.round((results.score / totalPossiblePoints) * 100) : 0
  const averageTimePerQuestion = Math.round(results.timeSpent / results.totalQuestions / 1000)

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: "Outstanding! 🏆", color: "text-yellow-600" }
    if (percentage >= 80) return { message: "Excellent! 🌟", color: "text-green-600" }
    if (percentage >= 70) return { message: "Great job! 👏", color: "text-blue-600" }
    if (percentage >= 60) return { message: "Good effort! 👍", color: "text-purple-600" }
    return { message: "Keep practicing! 💪", color: "text-orange-600" }
  }

  const performance = getPerformanceMessage()

return (
  <div className="min-h-screen p-8 ">
    <div className="container mx-auto max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white">Quiz Completed</h1>
        <p className="text-amber-500 text-2xl mt-2 font-bold"><span>Topic about</span>{quiz.title}</p>
        <Badge variant="outline" className="mt-3 px-4 py-1 text-2xl text-white border-gray-300">
          {playerNickname}
        </Badge>
      </div>

      {/* Score Overview */}
      <Card className="mb-5 border border-gray-200 bg-white backdrop-blur-md shadow-lg rounded-2xl">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-5xl font-bold text-indigo-600">
            {results.score}/{totalPossiblePoints}
          </CardTitle>
          <p className="text-lg text-gray-500">Total Points</p>
          <div className="space-y-3">
            <Progress value={percentage} className="h-3 rounded-full" />
            <p className="font-medium text-gray-700">
              {percentage}% — {performance.message}
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <Card className="border border-gray-200 bg-white backdrop-blur-md shadow-sm p-0.5 rounded-2xl">
          <CardContent className="text-center">
              <Image 
              className="mx-auto mb-0"
              src="correct.svg" 
              alt="Banner" 
              width={80} 
              height={80} 
            />
            <p className="text-2xl font-semibold text-gray-800">
              {results.answers.filter((a) => a.correct).length}/{results.totalQuestions}
            </p>
            <p className="text-gray-500">Correct</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white backdrop-blur-md p-0.5 shadow-sm rounded-2xl">
          <CardContent className="text-center">
               <Image 
              className="mx-auto mt-2"
              src="clock.svg" 
              alt="Banner" 
              width={70} 
              height={70} 
            />
            <p className="text-2xl font-semibold text-gray-800">{averageTimePerQuestion}s</p>
            <p className="text-gray-500">Avg / Question</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white backdrop-blur-md p-0.5 shadow-sm rounded-2xl">
          <CardContent className="text-center">
               <Image 
              className="mx-auto mb-0"
              src="totaltime.svg" 
              alt="Banner" 
              width={80} 
              height={80} 
            />
            <p className="text-2xl font-semibold text-gray-800">{Math.round(results.timeSpent / 1000)}s</p>
            <p className="text-gray-500">Total Time</p>
          </CardContent>
        </Card>
      </div>

      {/* Question Breakdown */}
      <Card className="mb-10 border border-gray-200 bg-white backdrop-blur-md shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-800">Question Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {results.answers.map((answer, index) => {
            const question = quiz.questions.find((q) => q.id === answer.questionId)
            return (
              <div
                key={answer.questionId}
                className={`flex items-center justify-between p-4 rounded-xl border transition ${
                  answer.correct ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"
                }`}
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {index + 1}. {question?.text.replace(/_/g, " ")}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={answer.correct ? "default" : "destructive"}>
                      {answer.correct ? "Correct" : "Incorrect"}
                    </Badge>
                    <Badge variant="outline">{answer.correct ? `+${question?.points || 0}` : "0"} pts</Badge>
                    <span className="text-sm text-gray-500">{Math.round(answer.timeSpent / 1000)}s</span>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onPlayAgain}
          className="btn-secondary text-gray-800 font-semibold py-3 px-8 rounded-xl shadow-md"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Play Again
        </Button>
         <Button
         onClick={() => window.location.href = '/home'}
          className=" text-white font-semibold py-3 px-8 rounded-xl shadow-md"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Exits
        </Button>
      </div>
    </div>
  </div>
)
}