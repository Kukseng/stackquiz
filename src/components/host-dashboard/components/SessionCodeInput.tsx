// ============================================================================
// FILE: components/host-dashboard/components/SessionCodeInput.tsx
// ============================================================================

import React, { useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../hooks/useAuth"
import { getWebSocketUrl, getApiBaseUrl } from "../utils/api"

interface SessionCodeInputProps {
  sessionCode: string
  setSessionCode: (code: string) => void
  onConnect: () => void
}

export function SessionCodeInput({ sessionCode, setSessionCode, onConnect }: SessionCodeInputProps) {
  const [inputCode, setInputCode] = useState(sessionCode)
  const [isConnecting, setIsConnecting] = useState(false)
  const { authWarning, validateAuth } = useAuth()

  const handleConnect = async () => {
    if (!inputCode.trim()) {
      alert("Please enter a session code")
      return
    }

    const isValid = await validateAuth()
    if (!isValid) {
      alert("Please login first to access the host dashboard")
      return
    }

    setIsConnecting(true)
    setSessionCode(inputCode.trim().toUpperCase())

    setTimeout(() => {
      setIsConnecting(false)
      onConnect()
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConnect()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">🎮</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Host Quiz Dashboard</h2>
        <p className="text-gray-600">Enter your session code from the database</p>
      </div>

      {authWarning && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">⚠️</span>
            <span className="text-sm text-yellow-800">Please make sure you&apos;re logged in before connecting</span>
          </div>
        </div>
      )}

      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-sm text-blue-800">
          <div className="font-medium mb-1">🔗 Connection Info:</div>
          <div className="text-xs space-y-1">
            <div>WebSocket: {getWebSocketUrl()}</div>
            <div>API: {getApiBaseUrl()}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Code</label>
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder="Enter session code (e.g., E20E84)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-lg text-center tracking-wider"
            maxLength={10}
            disabled={isConnecting}
          />
          <p className="text-xs text-gray-500 mt-1">Copy the session code from your database</p>
        </div>

        <motion.button
          onClick={handleConnect}
          disabled={isConnecting || !inputCode.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          {isConnecting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Connecting...</span>
            </div>
          ) : (
            "🚀 Connect to Session"
          )}
        </motion.button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Make sure the session exists in your database and you&apos;re logged in
          </p>
        </div>
      </div>
    </motion.div>
  )
}