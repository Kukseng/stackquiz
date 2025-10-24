"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface NicknameEntryProps {
  sessionCode: string
  onSubmit: (nickname: string) => void
}

export default function NicknameEntry({ sessionCode, onSubmit }: NicknameEntryProps) {
  const [nickname, setNickname] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!nickname.trim()) {
      setError("Please enter a nickname")
      return
    }

    if (nickname.trim().length < 2) {
      setError("Nickname must be at least 2 characters")
      return
    }

    if (nickname.trim().length > 20) {
      setError("Nickname must be less than 20 characters")
      return
    }

    onSubmit(nickname.trim())
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/20 to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Session code badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/20"
      >
        <span className="text-white font-bold text-lg">{sessionCode}</span>
      </motion.div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Rocket icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="inline-block text-8xl">🚀</div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-3">Join the Quiz!</h1>
          <p className="text-white/80 text-lg">Enter your nickname to get started</p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Nickname input */}
          <div>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Your nickname..."
              className="w-full px-6 py-5 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/30 transition-all text-center text-xl font-semibold border-2 border-white/20"
              maxLength={20}
              autoFocus
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-300 text-sm mt-2 text-center"
              >
                {error}
              </motion.p>
            )}
          </div>

          {/* Submit button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-5 rounded-2xl font-bold text-xl text-blue-900 shadow-2xl transition-all duration-200 flex items-center justify-center gap-3"
            style={{
              background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
            }}
          >
            Continue
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </motion.form>

        {/* Helper text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/50 text-sm text-center mt-6"
        >
          Your nickname will be visible to other players
        </motion.p>
      </motion.div>
    </div>
  )
}
