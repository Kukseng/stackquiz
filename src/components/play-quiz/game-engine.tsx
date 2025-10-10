"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock} from "lucide-react"
import type { Quiz, GameResults } from "@/app/play/[id]/page"
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-8 sm:py-10 lg:py-12 flex items-center justify-center min-h-screen">
        <Card
          className={`w-full max-w-md text-center bg-white/50 ${lastAnswerCorrect ? "animate-pulse-success border-green-500" : "animate-shake-error border-red-500"}`}
        >
          <CardContent className="p-8">
            <div
              className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${lastAnswerCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
            >
              {lastAnswerCorrect ?    
              <Image 
              className="mx-auto mb-0"
              src="correct.svg" 
              alt="Banner" 
              width={80} 
              height={80} 
            /> :    
            <Image 
              className="mx-auto mb-0"
              src="wrong.svg" 
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
  <div className="min-h-screen ">
    <div className="container mx-auto max-w-3xl space-y-8">

      {/* Header */}
      <Card className="bg-white/50 shadow-xl rounded-2xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700">{quiz.title}</h1>
            <p className="text-lg text-gray-600">Playing as: <span className="font-medium text-gray-800">{playerNickname}</span></p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="px-4 py-2 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-md">
              {score}/{totalPossiblePoints}
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-gray-700 border rounded-full animate-pulse">
              {participants.length} online
            </Badge>
          </div>
        </div>

        {/* Progress + Timer */}
        <div className="mt-6 flex justify-between items-center text-xl text-gray-700">
          <span>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-500" />
            <span className={`text-3xl font-bold ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-gray-800"}`}>
              {timeLeft}
            </span>
          </div>
        </div>
        <Progress
          value={progress}
          className="mt-2 h-2 rounded-full bg-gray-300 [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:to-purple-500"
        />
      </Card>

      {/* Question */}
      <Card className="bg-white/50 shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {currentQuestion.text.replace(/_/g, " ")}
        </h2>
        <div className="flex gap-3 text-sm text-gray-600 mb-6">
          <Badge variant="secondary">{currentQuestion.points} pts</Badge>
          <Badge variant="outline">{currentQuestion.timeLimit}s</Badge>
        </div>

        {/* Answer Options */}
       {currentQuestion.type === "MCQ" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {currentQuestion.options.map((opt, index) => {
              const styles = [
                { color: "bg-yellow-500", icon: "🟨" },
                { color: "bg-red-500", icon: "♦️" },
                { color: "bg-blue-500", icon: "🌕" },
                { color: "bg-green-500", icon: "🔺" },
              ]
              const { color, icon } = styles[index % styles.length]
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`flex items-center justify-center gap-3 text-white text-lg font-semibold py-6 px-4 rounded-xl shadow-md hover:scale-105 transition-transform duration-300 ${color}`}
                >
                  <span className="text-2xl">{icon}</span>
                  <span>{opt.optionText}</span>
                </button>
              )
            })}
          </div>
        )}


       {currentQuestion.type === "TF" && (
          <div className="grid grid-cols-2 gap-6">
            {currentQuestion.options.map((opt, index) => {
              const isTrue = opt.optionText.toLowerCase() === "true"
              const color = isTrue ? "bg-green-500" : "bg-red-500"
              const icon = isTrue ? "🟢" : "🟥"
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(opt.optionText)}
                  className={`flex items-center justify-center gap-3 text-white text-xl font-semibold py-6 px-4 rounded-xl shadow-md hover:scale-105 transition-transform duration-300 ${color}`}
                >
                  <span className="text-2xl">{icon}</span>
                  <span>{opt.optionText}</span>
                </button>
              )
            })}
          </div>
        )}


        {currentQuestion.type === "FB" && (
          <FillBlankQuestion question={currentQuestion} onAnswer={handleAnswer} timeLeft={timeLeft} />
        )}
      </Card>
    </div>
  </div>
)
}