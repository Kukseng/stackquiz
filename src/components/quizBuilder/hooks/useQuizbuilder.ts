"use client"
import { useState } from "react"

// Icon type
export type IconType = "circle" | "triangle" | "square" | "diamond"

export interface QuizOption {
  id: number
  text: string
  correct: boolean
  color: string
  icon?: IconType
}

export interface Question {
  id: number
  type: string
  question: string
  options: QuizOption[]
}

export function useQuizStore() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null)

  // Add new question
  const addQuestion = (type: string) => {
    const newQuestion: Question = {
      id: Date.now(),
      type,
      question:
        type === "multiple"
          ? ""
          : type === "truefalse"
          ? ""
          : "",
      options:
        type === "multiple"
    ? [
        { id: 1, text: "", correct: false, color: "#e21a3b", icon: "circle" },
        { id: 2, text: "", correct: false, color: "#e77f42", icon: "triangle" },
        { id: 3, text: "", correct: false, color: "#1355b4", icon: "square" },
        { id: 4, text: "", correct: true, color: "#27890d", icon: "diamond" }, // updated color
      ]
          : type === "truefalse"
          ? [
              { id: 1, text: "True", correct: false, color: "bg-red-500", icon: "circle" },
              { id: 4, text: "False", correct: true, color: "bg-green-700", icon: "diamond" },
            ]
          : [{ id: 1, text: "", correct: true, color: "bg-blue-500" }],
    }
    setQuestions((prev) => [...prev, newQuestion])
    setActiveQuestionId(newQuestion.id)
  }

  // Delete question
  const deleteQuestion = (id: number) => {
    const newQuestions = questions.filter((q) => q.id !== id)
    setQuestions(newQuestions)
    setActiveQuestionId(newQuestions.length ? newQuestions[0].id : null)
  }

  // Duplicate question
  const duplicateQuestion = (question: Question) => {
    const duplicate: Question = {
      ...question,
      id: Date.now(),
      options: question.options.map((opt) => ({ ...opt })),
    }
    setQuestions((prev) => [...prev, duplicate])
    setActiveQuestionId(duplicate.id)
  }

  // Update question text
  const updateQuestionText = (questionId: number, newText: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, question: newText } : q))
    )
  }

  // Update option text
  const updateOptionText = (questionId: number, optionId: number, newText: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((opt) =>
              opt.id === optionId ? { ...opt, text: newText } : opt
            ),
          }
        }
        return q
      })
    )
  }

  // Toggle correct answer
  const toggleCorrectAnswer = (questionId: number, optionId: number) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((opt) => ({
              ...opt,
              correct:
                opt.id === optionId
                  ? !opt.correct
                  : q.type === "truefalse" || q.type === "fillblank"
                  ? false
                  : opt.correct,
            })),
          }
        }
        return q
      })
    )
  }

  return {
    questions,
    activeQuestionId,
    setActiveQuestionId,
    addQuestion,
    deleteQuestion,
    duplicateQuestion,
    updateQuestionText,
    updateOptionText,
    toggleCorrectAnswer,
  }
}
