// components/ParticipantQuiz/AnswerRevealView.tsx
"use client"
import React from "react"
import { motion } from "framer-motion"
import { LiveRankingPanel } from "./LiveRankingPanel"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import type { AnswerFeedback } from "@/components/ParticipantQuiz/types/participant.types"

interface AnswerRevealViewProps {
  answerFeedback: AnswerFeedback
  questionNumber: number
  personalScore: number
  personalRank: number
  nickname: string
  streak: number
}

export function AnswerRevealView({
  answerFeedback,
  questionNumber,
  personalScore,
  personalRank,
  nickname,
  streak,
}: AnswerRevealViewProps) {
  const isCorrect = answerFeedback.isCorrect

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="container sm:px-2 lg:px-8 py-4 sm:py-2 lg:py-8 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <Card
            className={`w-full max-w-md text-center bg-white shadow-2xl ${
              isCorrect
                ? "animate-pulse-success border-4 border-green-500"
                : "animate-shake-error border-4 border-red-500"
            }`}
          >
            <CardContent className="p-6 sm:p-8 lg:p-10">
              {/* Image Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="mb-6"
              >
                {isCorrect ? (
                  <Image 
                    className="mx-auto" 
                    src="/play/correct.svg" 
                    alt="Correct" 
                    width={120} 
                    height={120} 
                  />
                ) : (
                  <Image 
                    className="mx-auto" 
                    src="/play/wrong.svg" 
                    alt="Incorrect" 
                    width={100} 
                    height={100} 
                  />
                )}
              </motion.div>

              {/* Result Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`text-4xl font-bold mb-4 ${
                  isCorrect ? "text-green-600" : "text-red-600"
                }`}
              >
                {isCorrect ? "Correct!" : "Incorrect!"}
              </motion.h2>

              {/* Points Display */}
              {answerFeedback.pointsEarned > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                  className="mb-4"
                >
                  <p className="text-green-600 text-2xl font-bold">
                    Great job! +{answerFeedback.pointsEarned} points
                  </p>
                  {answerFeedback.timeBonus && answerFeedback.timeBonus > 0 && (
                    <p className="text-yellow-600 text-lg mt-2">
                      ⚡ +{answerFeedback.timeBonus} speed bonus
                    </p>
                  )}
                </motion.div>
              )}

              {/* Streak Display */}
              {answerFeedback.streak && answerFeedback.streak > 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                  className="mb-4"
                >
                  <p className="text-orange-500 text-xl font-bold">
                    🔥 {answerFeedback.streak} answer streak!
                  </p>
                </motion.div>
              )}

              {/* Podium Message */}
              {personalRank <= 3 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-purple-600 text-lg font-semibold mb-4"
                >
                  🏆 You are on the podium!
                </motion.p>
              )}

              {/* Encouragement Message */}
              {answerFeedback.encouragementMessage && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-gray-600 text-lg mb-6"
                >
                  {answerFeedback.encouragementMessage}
                </motion.p>
              )}

              {/* Incorrect Answer Message */}
              {!isCorrect && answerFeedback.correctAnswer && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-gray-600 text-lg mb-6"
                >
                  The correct answer was: <span className="font-semibold">{answerFeedback.correctAnswer}</span>
                </motion.p>
              )}

            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Live Ranking Panel */}
      <LiveRankingPanel
        personalScore={personalScore}
        personalRank={personalRank}
        nickname={nickname}
        isMinimized={true}
        streak={streak}
      />
    </div>
  )
}