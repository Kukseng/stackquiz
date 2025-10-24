// components/ParticipantQuiz/JoinForm.tsx
"use client"
import React, { useState } from "react"
import { motion } from "framer-motion"

interface JoinFormProps {
  sessionCode: string
  onJoin: (nickname: string, avatarId: string) => Promise<void>
}

export function JoinForm({ sessionCode, onJoin }: JoinFormProps) {
  const [nickname, setNickname] = useState("")
  const [avatarId, setAvatarId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!nickname.trim()) {
      return setError("Nickname is required")
    }
    if (!avatarId.trim()) {
      return setError("Avatar ID is required")
    }

    setIsSubmitting(true)
    try {
      await onJoin(nickname.trim(), avatarId.trim())
    } catch (err: any) {
      setError(err.message || "Failed to join session. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      {/* Session code in top right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-6 right-6 bg-white rounded-full px-6 py-3 shadow-lg"
      >
        <span className="text-gray-800 font-bold text-lg">{sessionCode}</span>
      </motion.div>

      {/* Close button top left */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
      >
        <span className="text-2xl">✕</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-700/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-6">
          <h2 className="text-white text-2xl font-semibold mb-2">Your nickname is ...</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-6 py-4 bg-white text-gray-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/30 transition-all text-center text-lg"
            maxLength={20}
            required
          />

          <input
            value={avatarId}
            onChange={(e) => setAvatarId(e.target.value)}
            placeholder="Avatar ID"
            className="w-full px-6 py-4 bg-white text-gray-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/30 transition-all text-center text-sm font-mono"
            required
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-500/20 border border-red-400 rounded-xl text-center"
            >
              <p className="text-red-200 text-sm">{error}</p>
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-2xl font-bold text-xl text-blue-900 shadow-lg transition-all duration-200 disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
            }}
          >
            {isSubmitting ? "Joining..." : "Start"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}