"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface ParticipantInfo {
  id: string
  nickname: string
  sessionCode: string
  sessionName: string
  totalScore: number
  joinedAt: string
  avatarId?: string
}

interface EnhancedLobbyProps {
  participants: ParticipantInfo[]
  totalParticipants: number
  currentParticipantId: string
  sessionName: string
  quizTitle: string
}

export default function EnhancedLobby({
  participants,
  totalParticipants,
  currentParticipantId,
  sessionName,
  quizTitle,
}: EnhancedLobbyProps) {
  const [dots, setDots] = useState("")

  // Animated dots for "waiting"
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Avatar colors
  const avatarColors = [
    "from-red-400 to-pink-500",
    "from-blue-400 to-indigo-500",
    "from-green-400 to-emerald-500",
    "from-yellow-400 to-orange-500",
    "from-purple-400 to-pink-500",
    "from-cyan-400 to-blue-500",
  ]

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Animated Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.h1
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-6xl font-black text-white mb-4 drop-shadow-2xl"
        >
          {quizTitle}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/20 backdrop-blur-md rounded-2xl p-6 inline-block"
        >
          <p className="text-white text-2xl font-bold mb-2">
            Waiting for host to start{dots}
          </p>
          <motion.p
            key={totalParticipants}
            initial={{ scale: 1.5, color: "#fbbf24" }}
            animate={{ scale: 1, color: "#ffffff" }}
            className="text-4xl font-black"
          >
            {totalParticipants} {totalParticipants === 1 ? "Player" : "Players"}
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Participant Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <AnimatePresence mode="popLayout">
            {participants.map((participant, index) => {
              const colorClass = avatarColors[index % avatarColors.length]
              const isCurrentUser = participant.id === currentParticipantId

              return (
                <motion.div
                  key={participant.id}
                  layout
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0, rotate: 180 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: index * 0.03,
                  }}
                  className="relative"
                >
                  {/* Highlight current user */}
                  {isCurrentUser && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur-sm"
                    />
                  )}

                  <div
                    className={`relative bg-white rounded-2xl p-4 shadow-lg ${
                      isCurrentUser ? "ring-4 ring-yellow-400" : ""
                    }`}
                  >
                    {/* "You" Badge */}
                    {isCurrentUser && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                        className="absolute -top-3 -right-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10"
                      >
                        YOU
                      </motion.div>
                    )}

                    {/* Avatar */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="relative mb-3"
                    >
                      <div
                        className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
                      >
                        {participant.nickname.charAt(0).toUpperCase()}
                      </div>

                      {/* Join Animation Ring */}
                      <motion.div
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${colorClass} opacity-50`}
                      />
                    </motion.div>

                    {/* Nickname */}
                    <p className="text-center font-bold text-gray-800 text-sm truncate">
                      {participant.nickname}
                    </p>

                    {/* Join Time */}
                    <p className="text-center text-xs text-gray-500 mt-1">
                      {new Date(participant.joinedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {participants.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="text-6xl mb-4"
            >
              👥
            </motion.div>
            <p className="text-white text-2xl font-semibold mb-4">
              Waiting for players to join...
            </p>
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -20, 0] }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                  className="w-4 h-4 bg-white rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Fun Facts or Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 inline-block">
            <p className="text-white text-sm font-medium">
              💡 <strong>Tip:</strong> Answer quickly to earn bonus points!
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Pulsing "Get Ready" Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        className="text-center mt-8"
      >
        <p className="text-white text-xl font-bold">
          🚀 Get ready! The quiz will start soon...
        </p>
      </motion.div>
    </div>
  )
}