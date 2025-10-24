// components/ParticipantQuiz/QuestionView.tsx
"use client"
import React from "react"
import { motion } from "framer-motion"
import { QuestionTimer } from "./QuestionTimer"
import { AnswerOption } from "./AnswerOption"
import { LiveRankingPanel } from "./LiveRankingPanel"
import type { Question } from "@/components/ParticipantQuiz/types/participant.types"

interface QuestionViewProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  timeLeft: number
  timeLimit: number
  onAnswer: (optionId: string) => void
  onTimeUp: () => void
  answerSelected: string | null
  isSubmitting: boolean
  feedback: any
  personalScore: number
  personalRank: number
  nickname: string
  streak: number
}

export function QuestionView({
  question,
  questionNumber,
  timeLeft,
  timeLimit,
  onAnswer,
  onTimeUp,
  answerSelected,
  isSubmitting,
  feedback,
  personalScore,
  personalRank,
  nickname,
  streak,
}: QuestionViewProps) {
  // Format question text: remove underscores
  const formatQuestionText = (text: string) => {
    if (!text) return ''
    return text.replace(/_/g, ' ')
  }

  const displayQuestionText = formatQuestionText(question.text || question.questionText || '')

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center py-8 px-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <LiveRankingPanel
        personalScore={personalScore}
        personalRank={personalRank}
        nickname={nickname}
        isMinimized={true}
        streak={streak}
      />

      {/* Question number indicator */}
      <div className="absolute top-6 left-6 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
        <span className="text-gray-800 font-bold text-xl">{questionNumber}</span>
      </div>

      <div className="max-w-4xl w-full space-y-6 z-10">
        {/* Timer */}
        <QuestionTimer
          timeRemaining={timeLeft}
          timeLimit={timeLimit}
          isActive={!answerSelected && !isSubmitting}
          onTimeUp={onTimeUp}
        />

        {/* Question Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white bg-gray-700/60 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
            {displayQuestionText}
          </h1>
        </motion.div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {(question.options || []).map((option, index) => (
            <AnswerOption
              key={option.id}
              option={option}
              index={index}
              isSelected={answerSelected === option.id}
              isDisabled={answerSelected !== null || (feedback && !feedback?.canStillAnswer) || isSubmitting}
              onSelect={onAnswer}
            />
          ))}
        </div>

        {/* Feedback messages */}
        {feedback?.submitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-center"
          >
            <p className="text-white font-semibold">
              {isSubmitting ? "📤 Submitting answer..." : "✅ Answer submitted! Loading results..."}
            </p>
          </motion.div>
        )}

        {feedback?.timeUp && !answerSelected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-yellow-500/20 backdrop-blur-sm border-2 border-yellow-400/50 rounded-2xl text-center"
          >
            <p className="text-white font-semibold">⏰ Time is up!</p>
            <p className="text-white/80 text-sm mt-1">You can still answer for base points</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}