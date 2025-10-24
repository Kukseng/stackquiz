import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Mock data
const mockParticipants = [
  { id: "1", nickname: "Alice", score: 0, correct: 0, answered: 0, streak: 0, status: "ACTIVE" },
  { id: "2", nickname: "Bob", score: 0, correct: 0, answered: 0, streak: 0, status: "ACTIVE" },
  { id: "3", nickname: "Charlie", score: 0, correct: 0, answered: 0, streak: 0, status: "ACTIVE" },
  { id: "4", nickname: "Diana", score: 0, correct: 0, answered: 0, streak: 0, status: "ACTIVE" },
  { id: "5", nickname: "Eve", score: 0, correct: 0, answered: 0, streak: 0, status: "ACTIVE" },
]

interface LeaderboardEntry {
  participantId: string
  nickname: string
  totalScore: number
  correctAnswers: number
  questionsAnswered: number
  streak: number
  status: string
  averageResponseTime?: number
}

interface LeaderboardEntryProps {
  entry: LeaderboardEntry
  index: number
  positionChange: number
  celebration: boolean
}

function LeaderboardEntryComponent({ entry, index, positionChange, celebration }: LeaderboardEntryProps) {
  const isTop3 = index < 3

  return (
    <motion.div
      layout
      layoutId={`entry-${entry.participantId}`}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`relative p-4 rounded-xl ${
        isTop3
          ? "bg-gradient-to-r from-purple-100 to-indigo-100 border-2 border-purple-400 shadow-lg"
          : "bg-white border border-gray-200 shadow-md"
      } ${celebration ? "ring-4 ring-yellow-400" : ""}`}
    >
      <AnimatePresence>
        {celebration && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: [0, 0.6, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-xl pointer-events-none z-10"
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center relative z-20">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex items-center space-x-2 min-w-[60px]">
            <motion.span
              key={`rank-${entry.participantId}-${index}`}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className={`text-2xl font-black ${
                index === 0 ? "text-yellow-500" :
                index === 1 ? "text-gray-500" :
                index === 2 ? "text-orange-600" : "text-gray-400"
              }`}
            >
              #{index + 1}
            </motion.span>
            {index === 0 && <span className="text-2xl">🥇</span>}
            {index === 1 && <span className="text-2xl">🥈</span>}
            {index === 2 && <span className="text-2xl">🥉</span>}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`font-bold ${isTop3 ? 'text-gray-900 text-lg' : 'text-gray-800'}`}>
                {entry.nickname}
              </span>
              {entry.streak > 2 && (
                <span className="text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full font-bold">
                  🔥 {entry.streak}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
              <span>{entry.questionsAnswered} answered</span>
              <span>•</span>
              <span className="text-green-600 font-semibold">{entry.correctAnswers} correct</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <AnimatePresence mode="wait">
            {positionChange > 0 && (
              <motion.div
                initial={{ scale: 0, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-green-100 px-2 py-1 rounded-full"
              >
                <span className="text-green-600 font-bold text-sm">↑{positionChange}</span>
              </motion.div>
            )}
            {positionChange < 0 && (
              <motion.div
                initial={{ scale: 0, y: -10 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-red-100 px-2 py-1 rounded-full"
              >
                <span className="text-red-600 font-bold text-sm">↓{Math.abs(positionChange)}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            key={`score-${entry.totalScore}`}
            initial={{ scale: 1.5, color: "#10b981" }}
            animate={{ scale: 1, color: isTop3 ? "#7c3aed" : "#6b7280" }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-black min-w-[80px] text-right"
          >
            {entry.totalScore}
          </motion.div>

          <motion.div
            animate={{ scale: entry.status === "ANSWERING" ? [1, 1.3, 1] : 1 }}
            transition={{ repeat: entry.status === "ANSWERING" ? Infinity : 0, duration: 1 }}
            className={`w-3 h-3 rounded-full ${
              entry.status === "ACTIVE" ? "bg-green-500" :
              entry.status === "ANSWERING" ? "bg-blue-500" : "bg-gray-400"
            }`}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function LeaderboardTestDemo() {
  const [participants, setParticipants] = useState(mockParticipants)
  const [previousPositions, setPreviousPositions] = useState<Map<string, number>>(new Map())
  const [celebrations, setCelebrations] = useState<Set<string>>(new Set())
  const [questionNumber, setQuestionNumber] = useState(1)
  const [isAutoPlay, setIsAutoPlay] = useState(false)

  // Sort leaderboard
  const leaderboard = [...participants].sort((a, b) => b.score - a.score)

  useEffect(() => {
    const newPositions = new Map()
    leaderboard.forEach((entry, index) => {
      newPositions.set(entry.id, index + 1)
    })
    setPreviousPositions(newPositions)
  }, [leaderboard])

  const getPositionChange = (id: string, currentPosition: number) => {
    const prev = previousPositions.get(id)
    return prev ? prev - currentPosition : 0
  }

  // Simulate a question round
  const simulateQuestion = () => {
    setParticipants(prev => prev.map(p => {
      const isCorrect = Math.random() > 0.3
      const pointsGained = isCorrect ? Math.floor(Math.random() * 500) + 500 : 0
      
      if (isCorrect) {
        setCelebrations(prev => new Set(prev).add(p.id))
        setTimeout(() => {
          setCelebrations(prev => {
            const next = new Set(prev)
            next.delete(p.id)
            return next
          })
        }, 2000)
      }

      return {
        ...p,
        score: p.score + pointsGained,
        correct: p.correct + (isCorrect ? 1 : 0),
        answered: p.answered + 1,
        streak: isCorrect ? p.streak + 1 : 0,
        status: "ACTIVE"
      }
    }))
    setQuestionNumber(prev => prev + 1)
  }

  // Auto-play mode
  useEffect(() => {
    if (!isAutoPlay) return
    const interval = setInterval(simulateQuestion, 3000)
    return () => clearInterval(interval)
  }, [isAutoPlay])

  // Add random participant
  const addParticipant = () => {
    const names = ["Frank", "Grace", "Henry", "Iris", "Jack", "Kate", "Leo", "Mia"]
    const randomName = names[Math.floor(Math.random() * names.length)]
    const newId = `${Date.now()}`
    
    setParticipants(prev => [...prev, {
      id: newId,
      nickname: randomName,
      score: 0,
      correct: 0,
      answered: 0,
      streak: 0,
      status: "ACTIVE"
    }])
  }

  // Remove participant
  const removeParticipant = () => {
    if (participants.length > 1) {
      setParticipants(prev => prev.slice(0, -1))
    }
  }

  // Reset
  const reset = () => {
    setParticipants(mockParticipants.map(p => ({ ...p, score: 0, correct: 0, answered: 0, streak: 0 })))
    setQuestionNumber(1)
    setCelebrations(new Set())
    setIsAutoPlay(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-white mb-2">Leaderboard Test Demo</h1>
          <p className="text-white/80 text-lg">Test real-time updates and animations</p>
        </div>

        {/* Controls */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={simulateQuestion}
              disabled={isAutoPlay}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:scale-105"
            >
              🎯 Simulate Question
            </button>
            
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:scale-105 ${
                isAutoPlay
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
              }`}
            >
              {isAutoPlay ? "⏸ Stop Auto" : "▶ Auto Play"}
            </button>

            <button
              onClick={addParticipant}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:scale-105"
            >
              ➕ Add Player
            </button>

            <button
              onClick={removeParticipant}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:scale-105"
            >
              ➖ Remove Player
            </button>

            <button
              onClick={reset}
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg hover:scale-105"
            >
              🔄 Reset
            </button>
          </div>

          <div className="mt-4 text-center">
            <span className="text-white/90 text-sm">
              Question {questionNumber} • {participants.length} Participants • 
              {isAutoPlay && <span className="ml-2 animate-pulse">🔴 Auto-playing...</span>}
            </span>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black text-white flex items-center gap-2">
                  🏆 Live Leaderboard
                </h2>
                <div className="flex items-center gap-2 mt-2 text-white/90 text-sm">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-2 h-2 bg-green-400 rounded-full"
                  />
                  <span>Live Updates Active</span>
                </div>
              </div>
              <div className="text-white text-2xl font-bold">
                {participants.length} players
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50">
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {leaderboard.map((entry, index) => (
                  <LeaderboardEntryComponent
                    key={entry.id}
                    entry={{
                      participantId: entry.id,
                      nickname: entry.nickname,
                      totalScore: entry.score,
                      correctAnswers: entry.correct,
                      questionsAnswered: entry.answered,
                      streak: entry.streak,
                      status: entry.status
                    }}
                    index={index}
                    positionChange={getPositionChange(entry.id, index + 1)}
                    celebration={celebrations.has(entry.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white/10 backdrop-blur rounded-xl p-4 text-white/80 text-sm">
          <p className="mb-2"><strong>Instructions:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Simulate Question:</strong> Randomly updates scores for all participants</li>
            <li><strong>Auto Play:</strong> Automatically simulates questions every 3 seconds</li>
            <li><strong>Add/Remove Player:</strong> Test dynamic participant changes</li>
            <li><strong>Reset:</strong> Clear all scores and start over</li>
          </ul>
          <p className="mt-3 text-white/60">Watch for: position changes (↑↓), celebrations (yellow flash), and smooth animations!</p>
        </div>
      </div>
    </div>
  )
}