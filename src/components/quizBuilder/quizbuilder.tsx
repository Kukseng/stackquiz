"use client"

import { useState } from "react"
import { QuizSidebar } from "./quizsidebar"
import { QuizMainContent } from "./quizmaincontent"

interface Option {
  id: number
  text: string
  correct: boolean
  color: string
  icon?: string
}

interface Question {
  id: number
  type: string
  question: string
  options: Option[]
}

export default function QuizBuilder() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null)

  // Add new question
  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      type: "multiple",
      question: "New Question",
      options: [
        { id: 1, text: "Option 1", correct: false, color: "bg-red-500" },
        { id: 2, text: "Option 2", correct: false, color: "bg-green-500" },
        { id: 3, text: "Option 3", correct: false, color: "bg-blue-500" },
        { id: 4, text: "Option 4", correct: false, color: "bg-yellow-500" },
      ],
    }
    setQuestions([...questions, newQuestion])
    setActiveQuestionId(newQuestion.id)
  }

  // Update question text
  const updateQuestionText = (questionId: number, text: string) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, question: text } : q))
    )
  }

  // Update option text
  const updateOptionText = (questionId: number, optionId: number, text: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((opt) =>
              opt.id === optionId ? { ...opt, text } : opt
            ),
          }
        }
        return q
      })
    )
  }



  // Toggle correct answer
  const toggleCorrectAnswer = (questionId: number, optionId: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((opt) => ({
              ...opt,
              correct: opt.id === optionId ? !opt.correct : opt.correct,
            })),
          }
        }
        return q
      })
    )
  }

  // Delete question
  const deleteQuestion = (questionId: number) => {
    const filtered = questions.filter((q) => q.id !== questionId)
    setQuestions(filtered)
    if (activeQuestionId === questionId) {
      setActiveQuestionId(filtered.length > 0 ? filtered[0].id : null)
    }
  }

  // Duplicate question
  const duplicateQuestion = (question: Question) => {
    const copy: Question = {
      ...question,
      id: Date.now(),
      options: question.options.map((opt) => ({ ...opt })),
    }
    setQuestions([...questions, copy])
    setActiveQuestionId(copy.id)
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-pink-50 to-purple-50">
      <QuizSidebar
        questions={questions}
        activeQuestionId={activeQuestionId}
        onQuestionSelect={setActiveQuestionId}
        onAddQuestion={addQuestion}
      />

      <QuizMainContent
        questions={questions}
        activeQuestionId={activeQuestionId}
        onUpdateQuestionText={updateQuestionText}
        onUpdateOptionText={updateOptionText}
        onToggleCorrectAnswer={toggleCorrectAnswer}
        onDeleteQuestion={deleteQuestion}
        onDuplicateQuestion={duplicateQuestion}
      />
    </div>
  )
}
