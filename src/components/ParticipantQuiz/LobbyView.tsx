// components/ParticipantQuiz/LobbyView.tsx
"use client"
import React from "react"
import { motion } from "framer-motion"

interface LobbyViewProps {
  nickname: string
}

export function LobbyView({ nickname }: LobbyViewProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="text-center max-w-2xl px-6 z-10">
        {/* Rocket icon */}
        <motion.div
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-9xl mb-8"
        >
          🚀
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white text-4xl font-bold mb-4"
        >
          Waiting for the Host
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white/90 text-xl mb-12"
        >
          Hang tight, the quiz will start soon
        </motion.p>

        {/* Participant avatar */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          className="inline-block relative"
        >
          <div className="w-32 h-32 bg-gray-700/80 backdrop-blur-sm rounded-2xl flex items-center justify-center border-4 border-white/20 shadow-2xl">
            <span className="text-6xl">👤</span>
          </div>
          {/* Edit icon */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-sm">✏️</span>
          </div>
          {/* Nickname label */}
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-800 border-2 border-white/30 px-4 py-1 rounded-full whitespace-nowrap">
            <span className="text-white font-bold">{nickname}</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}