// components/shared/ScoreAnimation.tsx
"use client"
import React from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ScoreAnimationProps {
  scoreChange: number | undefined
}

export function ScoreAnimation({ scoreChange }: ScoreAnimationProps) {
  if (!scoreChange || scoreChange === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        key={scoreChange}
        initial={{ opacity: 0, y: -50, scale: 0.5 }}
        animate={{ opacity: 1, y: -100, scale: 1 }}
        exit={{ opacity: 0, y: -150, scale: 0.5 }}
        transition={{ duration: 0.8 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
      >
        <div
          className={`text-6xl font-bold ${
            scoreChange > 0 ? "text-green-400" : "text-red-400"
          } drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]`}
        >
          {scoreChange > 0 ? "+" : ""}
          {scoreChange}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}