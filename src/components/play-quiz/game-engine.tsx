"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle } from "lucide-react"
import type { Quiz, GameResults } from "@/app/play/page"
import { MultipleChoiceQuestion } from "../question-type/multiple-choice"
import { TrueFalseQuestion } from "../question-type/true-false"
import { FillBlankQuestion } from "@/components/question-type/fill-blank"
import { TimeUpAlert } from "@/components/time-up-alert"
import { useWebSocket } from "@/context/websocket-context"
import Image from "next/image"

interface GameEngineProps {
  quiz: Quiz
  onGameComplete: (results: GameResults) => void
  playerNickname: string
}

export function GameEngine({ quiz, onGameComplete, playerNickname }: GameEngineProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(quiz.questions[0]?.timeLimit || 30)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<GameResults["answers"]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false)
  const [gameStartTime] = useState(Date.now())
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [showTimeUpAlert, setShowTimeUpAlert] = useState(false)
  const [correctAnswer, setCorrectAnswer] = useState<string>("")
  const { sendMessage, participants } = useWebSocket()

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1

  const getCorrectAnswer = useCallback((question: typeof currentQuestion) => {
    if (question.type === "MCQ") {
      const correctOption = question.options.find((opt) => opt.isCorrected)
      return correctOption ? correctOption.optionText : ""
    } else if (question.type === "TF") {
      const correctOption = question.options.find((opt) => opt.isCorrected)
      return correctOption ? correctOption.optionText : ""
    } else if (question.type === "FB") {
      const correctOption = question.options.find((opt) => opt.isCorrected)
      return correctOption ? correctOption.optionText : ""
    }
    return ""
  }, [])

  const isAnswerCorrect = useCallback((userAnswer: string | number, question: typeof currentQuestion) => {
    if (question.type === "MCQ") {
      const selectedOption = question.options[userAnswer as number]
      return selectedOption?.isCorrected || false
    } else if (question.type === "TF") {
      const selectedOption = question.options.find(
        (opt) => opt.optionText.toLowerCase() === String(userAnswer).toLowerCase(),
      )
      return selectedOption?.isCorrected || false
    } else if (question.type === "FB") {
      const selectedOption = question.options[userAnswer as number]
      return selectedOption?.isCorrected || false
    }
    return false
  }, [])

  const handleAnswer = useCallback(
    (userAnswer: string | number) => {
      const timeSpent = Date.now() - questionStartTime
      const isCorrect = isAnswerCorrect(userAnswer, currentQuestion)
      const correctAns = getCorrectAnswer(currentQuestion)

      setLastAnswerCorrect(isCorrect)
      setCorrectAnswer(correctAns)
      setShowFeedback(true)

      if (isCorrect) {
        setScore((prev) => prev + currentQuestion.points)
      }

      const answerRecord = {
        questionId: currentQuestion.id,
        userAnswer,
        correct: isCorrect,
        timeSpent,
      }

      setAnswers((prev) => [...prev, answerRecord])

      // Show feedback for 1.5 seconds before moving to next question
      setTimeout(() => {
        if (isLastQuestion) {
          const totalTimeSpent = Date.now() - gameStartTime
          const results: GameResults = {
            score: isCorrect ? score + currentQuestion.points : score,
            totalQuestions: quiz.questions.length,
            timeSpent: totalTimeSpent,
            answers: [...answers, answerRecord],
          }
          onGameComplete(results)
        } else {
          setCurrentQuestionIndex((prev) => prev + 1)
          setTimeLeft(quiz.questions[currentQuestionIndex + 1]?.timeLimit || 30)
          setShowFeedback(false)
          setQuestionStartTime(Date.now())
        }
      }, 1500)
    },
    [
      currentQuestion,
      questionStartTime,
      score,
      answers,
      isLastQuestion,
      quiz,
      onGameComplete,
      gameStartTime,
      isAnswerCorrect,
      getCorrectAnswer,
    ],
  )

  // Timer countdown
  useEffect(() => {
    if (showFeedback) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowTimeUpAlert(true) // Show time up alert
          handleAnswer("") // Time's up, submit empty answer
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [handleAnswer, showFeedback])

  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100
  const totalPossiblePoints = quiz.questions.reduce((acc, q) => acc + q.points, 0)

  if (showFeedback) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card
          className={`w-full max-w-md text-center bg-white/70 ${lastAnswerCorrect ? "animate-pulse-success border-green-500" : "animate-shake-error border-red-500"}`}
        >
          <CardContent className="p-8">
            <div
              className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${lastAnswerCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
            >
              {lastAnswerCorrect ?    
              <Image 
              className="mx-auto mb-0"
              src="play/correct.svg" 
              alt="Banner" 
              width={80} 
              height={80} 
            /> :    
            <Image 
              className="mx-auto mb-0"
              src="play/wrong.svg" 
              alt="Banner" 
              width={80} 
              height={80} 
            />}

            </div>
            <h2 className={`text-3xl font-bold mb-4 ${lastAnswerCorrect ? "text-green-600" : "text-red-600"}`}>
              {lastAnswerCorrect ? "Correct!" : "Incorrect!"}
            </h2>
            <p className="text-muted-foreground text-lg">
              {lastAnswerCorrect
                ? `Great job! +${currentQuestion.points} points`
                : `The correct answer was: ${correctAnswer}`}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

 return (
  <div className="min-h-screen p-6">
    <div className="container mx-auto max-w-4xl">
      
      {/* Header */}
      <div className="mb-8">
        <Card className="border bg-white/70 backdrop-blur-md shadow-lg p-4 rounded-xl">
          <div className="flex items-center justify-between">
            {/* Left: Quiz Info */}
            <div>
              <h1 className="text-3xl font-bold text-indigo-600">{quiz.title}</h1>
              <p className="text-xl text-gray-500">Playing as: {playerNickname}</p>
            </div>

            {/* Right: Score + Online */}
            <div className="flex items-center gap-3">
              <Badge
                className="px-4 py-1 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
              >
                {score}/{totalPossiblePoints}
              </Badge>
              <Badge
                variant="secondary"
                className="px-4 py-1 text-gray-700 border animate-pulse"
              >
                {participants.length} online
              </Badge>
            </div>
          </div>

          {/* Progress + Timer */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-2xl text-gray-600">
              <span>
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
              <div className="flex items-center gap-2">
                <Clock className="w-7 h-7" />
                <span className={`font-semibold ${timeLeft <= 10 ? "text-red-500 text-2xl animate-pulse" : "text-gray-800"}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>
            <Progress
              value={progress}
              className="h-2 rounded-full bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:to-purple-600"
            />
          </div>
        </Card>
      </div>

      {/* Question */}
      <Card className="mb-8 border-2 border-gray-100 bg-white/80 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden">
        <CardHeader>
          {currentQuestion.imageUrl && currentQuestion.imageUrl !== "string" && (
            <div className="w-full h-56 mb-4 overflow-hidden rounded-lg">
              <Image
                src={currentQuestion.imageUrl || "/placeholder.svg"}
                alt="Question"
                width={800}
                height={300}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          <CardTitle className="text-2xl font-semibold text-gray-800 leading-snug">
            {currentQuestion.text.replace(/_/g, " ")}
          </CardTitle>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <Badge variant="secondary">{currentQuestion.points} pts</Badge>
            <Badge variant="outline">{currentQuestion.timeLimit}s</Badge>
          </div>
        </CardHeader>

        <CardContent>
          {currentQuestion.type === "MCQ" && (
            <MultipleChoiceQuestion question={currentQuestion} onAnswer={handleAnswer} timeLeft={timeLeft} />
          )}
          {currentQuestion.type === "TF" && (
            <TrueFalseQuestion question={currentQuestion} onAnswer={handleAnswer} timeLeft={timeLeft} />
          )}
          {currentQuestion.type === "FB" && (
            <FillBlankQuestion question={currentQuestion} onAnswer={handleAnswer} timeLeft={timeLeft} />
          )}
        </CardContent>
      </Card>

      {/* Timer Bar */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-md border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-center">
            <div className={`w-full max-w-lg h-3 bg-gray-200 rounded-full overflow-hidden`}>
              <div
                className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 10 ? "bg-red-500" : "bg-gradient-to-r from-indigo-500 to-purple-600"}`}
                style={{ width: `${(timeLeft / currentQuestion.timeLimit) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div> */}
    </div>

    {/* Time Up Alert */}
    <TimeUpAlert show={showTimeUpAlert} onClose={() => setShowTimeUpAlert(false)} />
  </div>
)
}