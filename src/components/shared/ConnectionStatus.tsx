// components/shared/ConnectionStatus.tsx
"use client"
import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { ConnectionStatus as Status } from "@/components/ParticipantQuiz/types/participant.types"

interface ConnectionStatusProps {
  status: Status
}

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  if (status === "Connected") return null

  const getStatusConfig = () => {
    switch (status) {
      case "Connecting...":
        return {
          bg: "bg-yellow-600",
          icon: "🔄",
          text: "Connecting...",
        }
      case "Disconnected":
        return {
          bg: "bg-red-600",
          icon: "⚠️",
          text: "Connection lost - Reconnecting...",
        }
      case "Error":
        return {
          bg: "bg-red-700",
          icon: "❌",
          text: "Connection error - Please refresh",
        }
      default:
        return null
    }
  }

  const config = getStatusConfig()
  if (!config) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-0 left-0 right-0 z-50 p-3 text-center text-white font-semibold ${config.bg}`}
      >
        <span className="mr-2">{config.icon}</span>
        {config.text}
      </motion.div>
    </AnimatePresence>
  )
}