"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useQuizState } from "@/hooks/use-quiz-state"

interface QuestionOption {
  id: string
  text: string
  isCorrect: boolean
}

interface Question {
  id: string
  text: string
  options: QuestionOption[]
  timeLimit: number // seconds
  type: "multiple_choice" | "true_false" | "text"
}

interface Result {
  questionId: string
  questionText: string
  isCorrect: boolean
  selectedOption?: string | null
  textAnswer?: string
  points: number
}

export default function QuizPage() {
  const [participantId, setParticipantId] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [textAnswer, setTextAnswer] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [results, setResults] = useState<Result[]>([])
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const router = useRouter()
  const { submitAnswer } = useQuizState()

  // ==== Load quizzes ====
  useEffect(() => {
    const storedParticipantId = localStorage.getItem("participantId")
    const storedSessionId = localStorage.getItem("sessionId")

    if (!storedParticipantId || !storedSessionId) {
      router.push("/")
      return
    }

    setParticipantId(storedParticipantId)
    setSessionId(storedSessionId)

    fetch("https://stackquiz-api.stackquiz.me/api/v1/quizzes?active=true")
      .then(res => res.json())
      .then(data => {
        const allQuestions: Question[] = data
          .flatMap((quiz: any) =>
            quiz.questions.map((q: any) => ({
              id: q.id,
              text: q.text,
              options: q.options.map((opt: any) => ({
                id: opt.id,
                text: opt.optionText,
                isCorrect: opt.isCorrected,
              })),
              timeLimit: q.timeLimit,
              type: q.type === "MCQ" ? "multiple_choice" : q.type === "TF" ? "true_false" : "text",
            }))
          )
          .sort((a, b) => a.timeLimit - b.timeLimit) // optional ordering

        setQuestions(allQuestions)
      })
      .catch(() => router.push("/"))
  }, [router])

  // ==== Countdown timer ====
  useEffect(() => {
    if (!questions[currentIndex]) return

    setTimeLeft(questions[currentIndex].timeLimit)
    timerRef.current && clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          handleOptionSelect(null, true) // auto submit as wrong
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [currentIndex, questions])

  // ==== Handle answer selection ====
  const handleOptionSelect = (optionId: string | null, timeout = false) => {
    if (selectedOption) return

    const question = questions[currentIndex]
    setSelectedOption(optionId)

    let correct = false
    if (!timeout) {
      if (question.type === "multiple_choice" || question.type === "true_false") {
        const chosen = question.options.find(opt => opt.id === optionId)
        correct = chosen?.isCorrect ?? false
      } else if (question.type === "text") {
        correct = question.options[0]?.text?.toLowerCase() === textAnswer.trim().toLowerCase()
      }
    }

    setIsCorrect(correct)
    setShowFeedback(true)

    if (timeout) setAlertMessage("Time's up!")

    // Save result
    setResults(prev => [
      ...prev,
      {
        questionId: question.id,
        questionText: question.text,
        isCorrect: correct,
        selectedOption: optionId,
        textAnswer: question.type === "text" ? textAnswer : undefined,
        points: correct ? 100 : 0,
      },
    ])

    // Submit answer
    submitAnswer(participantId, sessionId, {
      questionId: question.id,
      optionId: optionId,
      answerText: question.type === "text" ? textAnswer : undefined,
      timeTaken: question.timeLimit - timeLeft,
    }).catch(() => setAlertMessage("Failed to submit answer."))

    // Next question
    setTimeout(() => {
      setSelectedOption(null)
      setShowFeedback(false)
      setIsCorrect(null)
      setTextAnswer("")
      setAlertMessage(null)
      setCurrentIndex(prev => prev + 1)
    }, 2000)
  }

  // ==== Render question ====
  const renderQuestion = () => {
    const question = questions[currentIndex]
    if (!question) return null

    if (question.type === "multiple_choice") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {question.options.map((opt, i) => (
            <Button
              key={opt.id}
              onClick={() => handleOptionSelect(opt.id)}
              className={`text-white h-16 text-lg font-bold rounded-xl
                ${selectedOption === opt.id ? (isCorrect ? "bg-green-500" : "bg-red-500") : ["bg-red-500","bg-blue-500","bg-green-500","bg-purple-500"][i % 4]}
                hover:brightness-110`}
            >
              {opt.text}
            </Button>
          ))}
        </div>
      )
    }

    if (question.type === "true_false") {
      return (
        <div className="flex gap-4 mt-4">
          {["True", "False"].map((val, i) => (
            <Button
              key={val}
              onClick={() => handleOptionSelect(val)}
              className={`text-white h-16 text-lg font-bold rounded-xl
                ${selectedOption === val ? (isCorrect ? "bg-green-500" : "bg-red-500") : i === 0 ? "bg-green-500" : "bg-red-500"}
                hover:brightness-110`}
            >
              {val}
            </Button>
          ))}
        </div>
      )
    }

    if (question.type === "text") {
      return (
        <div className="mt-4">
          <Textarea
            value={textAnswer}
            onChange={e => setTextAnswer(e.target.value)}
            placeholder="Type your answer..."
            className="h-24 border-2 border-purple-300 rounded-lg resize-none p-2"
          />
          <Button
            onClick={() => handleOptionSelect(textAnswer)}
            disabled={textAnswer.trim() === ""}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white h-12 w-full rounded-lg font-bold"
          >
            Submit Answer
          </Button>
        </div>
      )
    }

    return <p>Unsupported question type</p>
  }

  // ==== Quiz finished ====
  if (currentIndex >= questions.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-3xl font-bold">Quiz Finished!</h1>
        <p className="text-xl">
          You got {results.filter(r => r.isCorrect).length} / {questions.length} correct
        </p>
        <p className="text-lg">
          Total Points: {results.reduce((acc, r) => acc + r.points, 0)}
        </p>
        <Button
          onClick={() => router.push("/")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
        >
          Back to Home
        </Button>
      </div>
    )
  }

  // ==== Render page ====
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {alertMessage && (
        <Alert variant="destructive" className="mb-4 w-full max-w-2xl">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      <Card className="p-6 shadow-lg border-2 border-purple-300 w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Question {currentIndex + 1} of {questions.length} | Time Left: {timeLeft}s
          </CardTitle>
        </CardHeader>

        <p className="mt-2 text-lg">{questions[currentIndex]?.text}</p>

        {renderQuestion()}

        {showFeedback && (
          <div
            className={`mt-4 text-center font-bold text-xl ${
              isCorrect ? "text-green-600" : "text-red-600"
            }`}
          >
            {isCorrect ? "Correct!" : "Incorrect!"}
          </div>
        )}
      </Card>
    </div>
  )
}
