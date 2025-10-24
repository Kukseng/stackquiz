// components/ParticipantQuiz/index.tsx
"use client"
import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"

// Components
import { JoinForm } from "@/components/ParticipantQuiz/JoinForm"
import { LobbyView } from "@/components/ParticipantQuiz/LobbyView"
import { QuestionView  } from "@/components/ParticipantQuiz/QuestionView"
import { AnswerRevealView } from "@/components/ParticipantQuiz/AnswerRevealView"
import { ConnectionStatus } from "@/components/shared/ConnectionStatus"
import { ScoreAnimation } from "@/components/shared/ScoreAnimation"
// import Rank from "@/components/ParticipantQuiz/LiveRankingPanel"
import Rank from "@/components/Poduim/rank"
// Hooks & Services
import { useParticipantWebSocket } from "@/components/ParticipantQuiz/hooks/useParticipantWebSocket"
import { participantApi } from "@/components/ParticipantQuiz/services/participantApi"

// Types
import type { 
  GameStatus, 
  LeaderboardEntry,
  AnswerFeedback,
  Question 
} from "@/components/ParticipantQuiz/types/participant.types"

export default function ParticipantQuiz() {
  const params = useParams()
  const sessionCode = params?.sessionCode as string

  // Join state
  const [joined, setJoined] = useState(false)
  const [nickname, setNickname] = useState("")
  const [avatarId, setAvatarId] = useState("")
  const [participantId, setParticipantId] = useState("")

  // Game state
  const [status, setStatus] = useState<GameStatus>("LOBBY")
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [questionNumber, setQuestionNumber] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  
  // Answer state
  const [answerSelected, setAnswerSelected] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)
  const [answerFeedback, setAnswerFeedback] = useState<AnswerFeedback | null>(null)
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false)

  // Personal stats
  const [personalScore, setPersonalScore] = useState(0)
  const [personalRank, setPersonalRank] = useState(0)
  const [scoreChange, setScoreChange] = useState<number | undefined>(undefined)
  const [streak, setStreak] = useState(0)

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  // Handle join
  const handleJoin = async (nick: string, avatar: string) => {
    const result = await participantApi.join(sessionCode, nick, avatar)
    setParticipantId(result.id)
    setNickname(nick)
    setAvatarId(avatar)
    setPersonalScore(result.totalScore || 0)
    setJoined(true)
  }

  // WebSocket connection
  const { sendAnswer, connectionStatus } = useParticipantWebSocket(
    joined ? sessionCode : "",
    joined ? participantId : "",
    joined ? nickname : "",
    joined ? avatarId : "",
    {
      onGameState: (msg) => {
        if (msg.action === "SESSION_STARTED" || msg.status === "IN_PROGRESS") {
          if (!currentQuestion && status !== "ANSWER_REVEAL") {
            setStatus("PLAY")
          }
        } else if (msg.action === "SESSION_ENDED" || msg.status === "ENDED") {
          setStatus("END")
        }
      },
      onQuestion: (msg) => {
        const question = msg.question || msg
        setCurrentQuestion(question)
        setQuestionNumber(msg.questionNumber || msg.currentQuestion || 0)
        setTotalQuestions(msg.totalQuestions || 0)
        setTimeLeft(msg.timeLimit || 30)
        setAnswerSelected(null)
        setFeedback(null)
        setShowFeedback(false)
        setAnswerFeedback(null)
        setIsSubmittingAnswer(false)
        setStatus("PLAY")
      },
      onCompletion: () => setStatus("COMPLETED"),
      onLeaderboardUpdate: (entries) => {
        setLeaderboard(entries)
        const current = entries.find(e => e.participantId === participantId)
        if (current) {
          setPersonalRank(current.position)
          setPersonalScore(current.totalScore)
          if (current.streak) setStreak(current.streak)
        }
      },
      onAnswerFeedback: (feedback) => {
        if (feedback.participantId === participantId) {
          setAnswerFeedback(feedback)
          setPersonalScore(feedback.newTotalScore)
          setPersonalRank(feedback.currentRank)
          if (feedback.streak) setStreak(feedback.streak)
          setStatus("ANSWER_REVEAL")
          setIsSubmittingAnswer(false)
        }
      },
    }
  )

  // Timer countdown
  useEffect(() => {
    if (
      timeLeft > 0 &&
      status === "PLAY" &&
      currentQuestion &&
      !answerSelected &&
      !showFeedback &&
      !isSubmittingAnswer
    ) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (
      timeLeft === 0 &&
      status === "PLAY" &&
      !answerSelected &&
      !isSubmittingAnswer
    ) {
      handleTimeUp();
    }
  }, [
    timeLeft,
    status,
    currentQuestion,
    answerSelected,
    showFeedback,
    isSubmittingAnswer,
  ]);

  // Handle time up
  const handleTimeUp = () => {
    setFeedback({ timeUp: true, canStillAnswer: true })
  }

  // Handle answer submission
  const handleAnswer = (optionId: string) => {
    if (!currentQuestion || answerSelected || isSubmittingAnswer) return

    setAnswerSelected(optionId);
    setIsSubmittingAnswer(true);

    const success = sendAnswer(optionId, currentQuestion.id);
    if (success) {
      setShowFeedback(true)
      setFeedback({ submitted: true })
      
      // Workaround: Fetch analytics after delay
      setTimeout(async () => {
        setIsSubmittingAnswer(false)
        try {
          const analytics = await participantApi.fetchQuestionAnalytics(sessionCode)
          // Handle analytics if needed
        } catch (err) {
          console.error("Failed to fetch analytics:", err)
        }
      }, 2000)
    } else {
      setAnswerSelected(null)
      setIsSubmittingAnswer(false)
    }
  }

  // Handle continue from answer reveal
  const handleContinue = () => {
    setStatus("PLAY")
    setAnswerFeedback(null)
    setAnswerSelected(null)
    setShowFeedback(false)
    setFeedback(null)
  }

  // Render join form
  if (!joined) {
    return <JoinForm sessionCode={sessionCode} onJoin={handleJoin} />
  }

  // Render based on game status
  return (
    <>
      <ConnectionStatus status={connectionStatus} />
      <ScoreAnimation scoreChange={scoreChange} />

      {status === "END" && (
        <div
          className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <div className="w-full max-w-6xl">
            <Rank leaderboard={leaderboard} />
          </div>
        </div>
      )}

      {status === "COMPLETED" && (
        <CompletedView
          personalScore={personalScore}
          personalRank={personalRank}
          totalQuestions={totalQuestions}
          streak={streak}
          leaderboard={leaderboard}
          sessionCode={sessionCode}
        />
      )}

      {status === "LOBBY" && <LobbyView nickname={nickname} />}

      {status === "PLAY" && !currentQuestion && (
        <WaitingView
          personalScore={personalScore}
          personalRank={personalRank}
          nickname={nickname}
          streak={streak}
        />
      )}

      {status === "PLAY" && currentQuestion && (
        <QuestionView
          question={currentQuestion}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          timeLeft={timeLeft}
          timeLimit={30}
          onAnswer={handleAnswer}
          onTimeUp={handleTimeUp}
          answerSelected={answerSelected}
          isSubmitting={isSubmittingAnswer}
          feedback={feedback}
          personalScore={personalScore}
          personalRank={personalRank}
          nickname={nickname}
          streak={streak}
        />
      )}

      {status === "ANSWER_REVEAL" && answerFeedback && (
        <AnswerRevealView
          answerFeedback={answerFeedback}
          questionNumber={questionNumber}
          onContinue={handleContinue}
          personalScore={personalScore}
          personalRank={personalRank}
          nickname={nickname}
          streak={streak}
        />
      )}
    </>
  )
}

// Waiting for question component
function WaitingView({ personalScore, personalRank, nickname, streak }: any) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-800 to-indigo-900 text-white relative">
      <div className="text-center max-w-2xl px-6 z-10">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="text-6xl mb-6"
        >
          🕐
        </motion.div>
        <h2 className="text-3xl font-bold mb-4">Get Ready!</h2>
        <p className="text-xl">Your next question is loading...</p>
      </div>
    </div>
  )
}

// Completed view component
function CompletedView({ personalScore, personalRank, totalQuestions, streak, leaderboard, sessionCode }: any) {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="text-center max-w-2xl px-6 z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white text-5xl font-bold mb-6"
        >
          Summary
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white text-xl mb-8"
        >
          Congratulations, you finished the quiz!
        </motion.p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-black/40 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Rank</p>
                <p className="text-white text-3xl font-bold">
                  {personalRank}/{leaderboard.length}
                </p>
              </div>
              <span className="text-4xl">🏆</span>
            </div>
          </div>
          <div className="bg-black/40 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Score</p>
                <p className="text-white text-3xl font-bold">{personalScore}</p>
              </div>
              <span className="text-4xl">🪙</span>
            </div>
          </div>
        </div>

        {/* Performance stats */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-black/40 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-white mb-1">{streak}</p>
            <p className="text-white/70 text-sm">Streak</p>
          </div>
          <div className="bg-black/40 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-white mb-1">{totalQuestions}</p>
            <p className="text-white/70 text-sm">Questions</p>
          </div>
        </div>

        {/* Find new quiz button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl font-bold text-xl text-blue-900 shadow-lg mt-8"
          style={{
            background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
          }}
        >
          Find new quiz
        </motion.button>
      </div>
    </div>
  )
}
