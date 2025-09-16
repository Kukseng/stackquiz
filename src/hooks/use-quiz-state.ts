"use client"

import { useState, useCallback } from "react"
import { stackQuizAPI, type AnswerSubmission } from "@/lib/api"

export interface QuizAnswer {
  questionId: string
  optionId?: string
  answerText?: string
  timeTaken: number
  timestamp: number
}

export function useQuizState() {
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  const addAnswer = useCallback((answer: QuizAnswer) => {
    setAnswers((prev) => [...prev, answer])
  }, [])

  const submitAnswer = useCallback(
    async (participantId: string, sessionId: string, answer: Omit<QuizAnswer, "timestamp">) => {
      setIsSubmitting(true)
      setSubmissionError(null)

      try {
        const submission: AnswerSubmission = {
          participantId,
          sessionId,
          questionId: answer.questionId,
          optionId: answer.optionId,
          answerText: answer.answerText,
          timeTaken: answer.timeTaken,
        }

        console.log("[v0] Attempting to submit answer:", submission)
        await stackQuizAPI.submitAnswer(submission)
        console.log("[v0] Answer submitted successfully")

        // Add to local state after successful submission
        addAnswer({
          ...answer,
          timestamp: Date.now(),
        })

        return true
      } catch (error) {
        console.error("[v0] Answer submission failed:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to submit answer"
        setSubmissionError(errorMessage)

        // In development mode, still add the answer locally for demo purposes
        if (process.env.NODE_ENV === "development") {
          console.log("[v0] Adding answer locally for demo purposes")
          addAnswer({
            ...answer,
            timestamp: Date.now(),
          })
          return true
        }

        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    [addAnswer],
  )

  const submitBulkAnswers = useCallback(
    async (participantId: string, sessionId: string, answersToSubmit: QuizAnswer[]) => {
      setIsSubmitting(true)
      setSubmissionError(null)

      try {
        await stackQuizAPI.submitBulkAnswers({
          participantId,
          sessionId,
          answers: answersToSubmit.map((answer) => ({
            questionId: answer.questionId,
            optionId: answer.optionId,
            answerText: answer.answerText,
            timeTaken: answer.timeTaken,
          })),
        })

        // Update local state after successful bulk submission
        setAnswers((prev) => [
          ...prev,
          ...answersToSubmit.map((answer) => ({
            ...answer,
            timestamp: Date.now(),
          })),
        ])

        return true
      } catch (error) {
        console.error("[v0] Bulk answer submission failed:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to submit answers"
        setSubmissionError(errorMessage)

        // In development mode, still add the answers locally for demo purposes
        if (process.env.NODE_ENV === "development") {
          console.log("[v0] Adding answers locally for demo purposes")
          setAnswers((prev) => [
            ...prev,
            ...answersToSubmit.map((answer) => ({
              ...answer,
              timestamp: Date.now(),
            })),
          ])
          return true
        }

        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    [],
  )

  const getAnswerForQuestion = useCallback(
    (questionId: string) => {
      return answers.find((answer) => answer.questionId === questionId)
    },
    [answers],
  )

  const clearAnswers = useCallback(() => {
    setAnswers([])
    setSubmissionError(null)
  }, [])

  return {
    answers,
    isSubmitting,
    submissionError,
    submitAnswer,
    submitBulkAnswers,
    addAnswer,
    getAnswerForQuestion,
    clearAnswers,
  }
}
