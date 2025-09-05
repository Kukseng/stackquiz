"use client"

import { useState } from "react"

interface QuizOption {
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
  options: QuizOption[]
}

export function useQuizStore() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null)

  const addQuestion = (type: string) => {
    const newQuestion: Question = {
      id: Date.now(),
      type,
      question:
        type === "multiple"
          ? "CSS stands for"
          : type === "truefalse"
            ? "src attribute in HTML's img tag specifies the source or location of the image file to be displayed."
            : "The _____ property in CSS is used to change the text color of an element.",
      options:
        type === "multiple"
          ? [
              { id: 1, text: "Cascading Style Sheet", correct: false, color: "bg-red-500", icon: "●" },
              { id: 2, text: "Cases Style sheet", correct: false, color: "bg-orange-500", icon: "▲" },
              { id: 3, text: "Cascading Style Sheets", correct: false, color: "bg-blue-500", icon: "■" },
              { id: 4, text: "Casecading Style Sheets", correct: true, color: "bg-green-500", icon: "♦" },
            ]
          : type === "truefalse"
            ? [
                { id: 1, text: "True", correct: false, color: "bg-red-500" },
                { id: 2, text: "False", correct: false, color: "bg-green-500" },
              ]
            : [{ id: 1, text: "color", correct: true, color: "bg-blue-500" }],
    }

    setQuestions((prev) => [...prev, newQuestion])
    setActiveQuestionId(newQuestion.id)
  }

  const deleteQuestion = (id: number) => {
    const newQuestions = questions.filter((q) => q.id !== id)
    setQuestions(newQuestions)

    if (newQuestions.length > 0 && activeQuestionId === id) {
      setActiveQuestionId(newQuestions[0].id)
    } else if (newQuestions.length === 0) {
      setActiveQuestionId(null)
    }
  }

  const duplicateQuestion = (question: Question) => {
    const duplicate: Question = {
      ...question,
      id: Date.now(),
      options: question.options.map((opt) => ({ ...opt })),
    }
    setQuestions((prev) => [...prev, duplicate])
    setActiveQuestionId(duplicate.id)
  }

  const updateQuestionText = (questionId: number, newText: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, question: newText } : q)))
  }

  const updateOptionText = (questionId: number, optionId: number, newText: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((opt) => (opt.id === optionId ? { ...opt, text: newText } : opt)),
          }
        }
        return q
      }),
    )
  }

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
      }),
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
