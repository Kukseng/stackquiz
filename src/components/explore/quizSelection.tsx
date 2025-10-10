"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Trophy, Play, AlertCircle } from "lucide-react"
import type { Quiz } from "../../../src/lib/types/api"
import Image from "next/image"

interface QuizSelectionProps {
  onQuizSelect: (quiz: Quiz) => void
}

export function QuizSelection({ onQuizSelect }: QuizSelectionProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/quizzes`)

        if (!response.ok) {
          throw new Error(`Failed to fetch quizzes: ${response.status}`)
        }

        const data: Quiz[] = await response.json()

        const quizzesWithQuestions = data.filter((quiz) => quiz.questions && quiz.questions.length > 0)

        setQuizzes(quizzesWithQuestions)
      } catch (err) {
        console.error("Error fetching quizzes:", err)
        setError(err instanceof Error ? err.message : "Failed to load quizzes")
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">QuizMaster</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-700 font-medium mb-2">Failed to load quizzes</p>
            <p className="text-red-600 text-sm">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <Card
            key={quiz.id}
            className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20"
          >
            <CardHeader>
              {quiz.thumbnailUrl && quiz.thumbnailUrl !== "string" && (
                <div className="w-full h-32 mb-4 rounded-lg overflow-hidden">
                    <Image
                        src={quiz.thumbnailUrl}
                        alt={`${quiz.title} Thumbnail`}
                        className="w-full h-full object-cover"
                    />  
                </div>
              )}
              <CardTitle className="text-xl text-balance">{quiz.title}</CardTitle>
              <CardDescription className="text-pretty">{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={getDifficultyColor(quiz.difficulty)}>{quiz.difficulty}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {quiz.questions.length} questions
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {Math.round(quiz.questions.reduce((acc: number, q: { timeLimit: number }) => acc + q.timeLimit, 0) / quiz.questions.length)}s avg
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  {quiz.questions.reduce((acc: number, q: { points: number }) => acc + q.points, 0)} pts
                </Badge>
              </div>

              <Button
                onClick={() => onQuizSelect(quiz)}
                className="w-full bg-primary hover:bg-primary/90 text-[--font-dm-sans] btn-secondary py-3 rounded-lg transition-all duration-200 hover:shadow-md"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {quizzes.length === 0 && !loading && (
        <div className="text-center mt-12">
          <p className="text-muted-foreground">No quizzes available at the moment. Check back later! 🚀</p>
        </div>
      )}
    </div>
  )
}
