<<<<<<< HEAD
"use client";
import type React from "react";
import { useCallback, useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { QRCodeCanvas } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { getSession } from "next-auth/react";
import { Link } from "lucide-react";
=======
"use client"
import type React from "react"
import { useCallback, useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import { QRCodeCanvas } from "qrcode.react"
import { motion, AnimatePresence } from "framer-motion"
import { getSession } from "next-auth/react"
import { Link } from "lucide-react"
>>>>>>> e93bcd0 (update host)

// Enhanced interfaces for better type safety - Updated to match backend DTOs
interface LeaderboardEntry {
  participantId: string;
  nickname: string;
  totalScore: number;
  position: number;
  rank: number;
  currentRank?: number;
  isCurrentUser?: boolean;
  avatarId?: string;
  questionsAnswered?: number;
  averageResponseTime?: number;
  correctAnswers?: number;
  streak?: number;
  isOnline?: boolean;
  lastActivity?: string;
  status?: string;
  positionChange?: number;
}

interface EnhancedLeaderboard {
  sessionId: string;
  entries: LeaderboardEntry[];
  totalParticipants: number;
  lastUpdated: number;
  status: string;
}

interface ScoreCelebration {
  participantId: string;
  nickname: string;
  pointsEarned: number;
  newTotalScore: number;
  newRank: number;
  isCorrect: boolean;
  celebrationType: string;
  animationType: string;
}

interface QuestionStats {
  sessionId: string;
  questionNumber: number;
  totalQuestions: number;
  totalParticipants: number;
  participantsAnswered: number;
  participantsRemaining: number;
  averageResponseTime: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracyRate: number;
  isQuestionComplete: boolean;
}

// NEW: Host Dashboard Response interface matching backend
interface HostDashboardData {
  sessionId: string;
  sessionCode: string;
  sessionName: string;
  sessionStatus: string;
  currentQuestion: number;
  totalQuestions: number;
  totalParticipants: number;
  activeParticipants: number;
  participantsAnswered: number;
  participantsPending: number;
  currentTimer?: {
    timerType: string;
    timerStatus: string;
    remainingSeconds: number;
    totalSeconds: number;
  };
  canStart: boolean;
  canPause: boolean;
  canResume: boolean;
  canEnd: boolean;
  canAdvanceQuestion: boolean;
}

// Participant Progress Interfaces
interface ParticipantAnswer {
  questionNumber: number;
  isCorrect: boolean;
  answered: boolean;
  pointsEarned: number;
  timeSpent?: number;
}

interface DetailedParticipantProgress {
  participantId: string;
  nickname: string;
  avatarId: string;
  totalScore: number;
  currentQuestionNumber: number;
  answeredCount: number;
  correctCount: number;
  accuracy: number;
  answers: ParticipantAnswer[];
  status: "active" | "idle" | "completed";
  lastActivityTime?: string;
}

// FIXED: NextAuth authentication helper functions
const getAuthHeaders = async () => {
  try {
    const session = await getSession();
    const token = (session as any)?.apiAccessToken;

    if (!token) {
      console.warn(
        "⚠️ No authentication token found in session. Please login first."
      );
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  } catch (error) {
    console.error("❌ Error getting session:", error);
    return {};
  }
};

const checkAuthToken = async () => {
  try {
    const session = await getSession();
    const token = (session as any)?.apiAccessToken;
    return !!token;
  } catch (error) {
    console.error("❌ Error checking auth token:", error);
    return false;
  }
};

// FIXED: WebSocket URL helper function
const getWebSocketUrl = () => {
  // For local development
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    // Local development URLs
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "https://stackquiz-api.stackquiz.me/ws";
    }
  }

  // Use environment variable or fallback to production
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    const wsUrl = apiUrl
      .replace(/\/api\/v1\/?$/, "")
      .replace(/\/api\/?$/, "")
      .replace(/\/v1\/?$/, "");

    return `${wsUrl}/ws`;
  }

  // Production fallback - use https:// not wss://
  return "https://stackquiz-api.stackquiz.me/ws";
};

// FIXED: API Base URL helper function
const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "https://stackquiz-api.stackquiz.me/api";
    }
  }

<<<<<<< HEAD
  const envUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://stackquiz-api.stackquiz.me/api";
=======
  const envUrl = process.env.NEXT_PUBLIC_API_URL || "https://stackquiz-api.stackquiz.me/api/v1"
>>>>>>> e93bcd0 (update host)
  // Remove trailing /v1 if present since all endpoints already include /v1/
  return envUrl.replace(/\/v1\/?$/, "");
};

<<<<<<< HEAD
function getRankSuffix(rank: number): string {
  if (rank === 1) return "st";
  if (rank === 2) return "nd";
  if (rank === 3) return "rd";
  return "th";
}

=======
>>>>>>> e93bcd0 (update host)
// Session Code Input Component
function SessionCodeInput({
  sessionCode,
  setSessionCode,
  onConnect,
}: {
  sessionCode: string;
  setSessionCode: (code: string) => void;
  onConnect: () => void;
}) {
  const [inputCode, setInputCode] = useState(sessionCode);
  const [isConnecting, setIsConnecting] = useState(false);
  const [authWarning, setAuthWarning] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const hasToken = await checkAuthToken();
      if (!hasToken) {
        setAuthWarning(true);
      }
    };
    checkAuth();
  }, []);

  const handleConnect = async () => {
    if (!inputCode.trim()) {
      alert("Please enter a session code");
      return;
    }

    const hasToken = await checkAuthToken();
    if (!hasToken) {
      alert("Please login first to access the host dashboard");
      return;
    }

    setIsConnecting(true);
    setSessionCode(inputCode.trim().toUpperCase());

    setTimeout(() => {
      setIsConnecting(false);
      onConnect();
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConnect();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">🎮</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Host Quiz Dashboard
        </h2>
        <p className="text-gray-600">
          Enter your session code from the database
        </p>
      </div>

      {authWarning && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">⚠️</span>
<<<<<<< HEAD
            <span className="text-sm text-yellow-800">
              Please make sure you're logged in before connecting
            </span>
=======
            <span className="text-sm text-yellow-800">Please make sure you&apos;re logged in before connecting</span>
>>>>>>> e93bcd0 (update host)
          </div>
        </div>
      )}

<<<<<<< HEAD
=======
      {/* Connection Info */}
>>>>>>> e93bcd0 (update host)
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Code
          </label>
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
          <p className="text-xs text-gray-500 mt-1">
            Copy the session code from your database
          </p>
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
  );
}

<<<<<<< HEAD
// Enhanced Quiz Settings Modal
=======
// Enhanced Quiz Settings Modal - Updated to use backend SessionTimingRequest
>>>>>>> e93bcd0 (update host)
function QuizSettingsModal({ isOpen, onClose, onStart }: any) {
  const [settings, setSettings] = useState({
    mode: "SYNC",
    scheduledStartTime: "",
    scheduledEndTime: "",
    defaultQuestionTimeLimit: 30,
    autoAdvanceQuestions: false,
    allowLateJoining: true,
    shuffleQuestions: false,
    showCorrectAnswers: true,
    showTimer: true,
    maxParticipants: 100,
<<<<<<< HEAD
  });

  if (!isOpen) return null;

  const handleStart = () => {
    const timingRequest = {
      scheduledStartTime: settings.scheduledStartTime
        ? new Date(settings.scheduledStartTime).toISOString()
        : null,
      scheduledEndTime: settings.scheduledEndTime
        ? new Date(settings.scheduledEndTime).toISOString()
        : null,
=======
  })

  if (!isOpen) return null

  const handleStart = () => {
    // Convert to backend SessionTimingRequest format
    const timingRequest = {
      scheduledStartTime: settings.scheduledStartTime ? new Date(settings.scheduledStartTime).toISOString() : null,
      scheduledEndTime: settings.scheduledEndTime ? new Date(settings.scheduledEndTime).toISOString() : null,
>>>>>>> e93bcd0 (update host)
      defaultQuestionTimeLimit: settings.defaultQuestionTimeLimit,
      autoAdvanceQuestions: settings.autoAdvanceQuestions,
      allowLateJoining: settings.allowLateJoining,
      showTimer: settings.showTimer,
<<<<<<< HEAD
    };

    onStart(timingRequest);
    onClose();
  };
=======
    }

    onStart(timingRequest)
    onClose()
  }
>>>>>>> e93bcd0 (update host)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
<<<<<<< HEAD
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
=======
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
>>>>>>> e93bcd0 (update host)
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
<<<<<<< HEAD
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          🎮 Quiz Settings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Quiz Mode
            </label>
            <select
              value={settings.mode}
              onChange={(e) =>
                setSettings({ ...settings, mode: e.target.value })
              }
=======
        <h2 className="text-2xl font-bold mb-6 text-gray-800">🎮 Quiz Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quiz Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Quiz Mode</label>
            <select
              value={settings.mode}
              onChange={(e) => setSettings({ ...settings, mode: e.target.value })}
>>>>>>> e93bcd0 (update host)
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="SYNC">🎯 Synchronous (Real-time)</option>
              <option value="ASYNC">⏱️ Asynchronous (Self-paced)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {settings.mode === "SYNC"
                ? "Host controls question progression - best for real-time engagement"
                : "Participants progress at their own pace"}
            </p>
          </div>

<<<<<<< HEAD
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Question Time Limit (seconds)
            </label>
=======
          {/* Time Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Question Time Limit (seconds)</label>
>>>>>>> e93bcd0 (update host)
            <input
              type="number"
              min="5"
              max="300"
              value={settings.defaultQuestionTimeLimit}
<<<<<<< HEAD
              onChange={(e) =>
                setSettings({
                  ...settings,
                  defaultQuestionTimeLimit: Number.parseInt(e.target.value),
                })
              }
=======
              onChange={(e) => setSettings({ ...settings, defaultQuestionTimeLimit: Number.parseInt(e.target.value) })}
>>>>>>> e93bcd0 (update host)
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 30s for multiple choice, 60s for complex questions
            </p>
          </div>

<<<<<<< HEAD
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Scheduled Start Time (Optional)
            </label>
            <input
              type="datetime-local"
              value={settings.scheduledStartTime}
              onChange={(e) =>
                setSettings({ ...settings, scheduledStartTime: e.target.value })
              }
=======
          {/* Scheduled Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Scheduled Start Time (Optional)</label>
            <input
              type="datetime-local"
              value={settings.scheduledStartTime}
              onChange={(e) => setSettings({ ...settings, scheduledStartTime: e.target.value })}
>>>>>>> e93bcd0 (update host)
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

<<<<<<< HEAD
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Scheduled End Time (Optional)
            </label>
            <input
              type="datetime-local"
              value={settings.scheduledEndTime}
              onChange={(e) =>
                setSettings({ ...settings, scheduledEndTime: e.target.value })
              }
=======
          {/* Scheduled End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Scheduled End Time (Optional)</label>
            <input
              type="datetime-local"
              value={settings.scheduledEndTime}
              onChange={(e) => setSettings({ ...settings, scheduledEndTime: e.target.value })}
>>>>>>> e93bcd0 (update host)
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

<<<<<<< HEAD
=======
        {/* Enhanced Checkboxes */}
>>>>>>> e93bcd0 (update host)
        <div className="mt-6 space-y-3">
          <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowLateJoining}
<<<<<<< HEAD
              onChange={(e) =>
                setSettings({ ...settings, allowLateJoining: e.target.checked })
              }
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">
                Allow late joins
              </span>
              <p className="text-xs text-gray-500">
                Participants can join after the quiz starts
              </p>
=======
              onChange={(e) => setSettings({ ...settings, allowLateJoining: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Allow late joins</span>
              <p className="text-xs text-gray-500">Participants can join after the quiz starts</p>
>>>>>>> e93bcd0 (update host)
            </div>
          </label>

          <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoAdvanceQuestions}
<<<<<<< HEAD
              onChange={(e) =>
                setSettings({
                  ...settings,
                  autoAdvanceQuestions: e.target.checked,
                })
              }
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">
                Auto-advance questions
              </span>
              <p className="text-xs text-gray-500">
                Automatically move to next question when time expires
              </p>
=======
              onChange={(e) => setSettings({ ...settings, autoAdvanceQuestions: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Auto-advance questions</span>
              <p className="text-xs text-gray-500">Automatically move to next question when time expires</p>
>>>>>>> e93bcd0 (update host)
            </div>
          </label>

          <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showTimer}
<<<<<<< HEAD
              onChange={(e) =>
                setSettings({ ...settings, showTimer: e.target.checked })
              }
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">
                Show timer
              </span>
              <p className="text-xs text-gray-500">
                Display countdown timer to participants
              </p>
=======
              onChange={(e) => setSettings({ ...settings, showTimer: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Show timer</span>
              <p className="text-xs text-gray-500">Display countdown timer to participants</p>
>>>>>>> e93bcd0 (update host)
            </div>
          </label>

          <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showCorrectAnswers}
<<<<<<< HEAD
              onChange={(e) =>
                setSettings({
                  ...settings,
                  showCorrectAnswers: e.target.checked,
                })
              }
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">
                Show correct answers
              </span>
              <p className="text-xs text-gray-500">
                Display correct answers after each question
              </p>
=======
              onChange={(e) => setSettings({ ...settings, showCorrectAnswers: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Show correct answers</span>
              <p className="text-xs text-gray-500">Display correct answers after each question</p>
>>>>>>> e93bcd0 (update host)
            </div>
          </label>
        </div>

<<<<<<< HEAD
=======
        {/* Buttons */}
>>>>>>> e93bcd0 (update host)
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition shadow-lg"
          >
            🚀 Start Quiz
          </button>
        </div>
      </motion.div>
    </motion.div>
<<<<<<< HEAD
  );
}

// Enhanced Leaderboard Component
=======
  )
}

// Enhanced Leaderboard Component with Real-time Animations
>>>>>>> e93bcd0 (update host)
function EnhancedLeaderboard({
  leaderboard,
  celebrations,
  questionStats,
}: {
  leaderboard: LeaderboardEntry[];
  celebrations: ScoreCelebration[];
  questionStats: QuestionStats | null;
}) {
  const [previousPositions, setPreviousPositions] = useState<
    Map<string, number>
  >(new Map());

  useEffect(() => {
    const newPositions = new Map();
    leaderboard.forEach((entry, index) => {
      newPositions.set(entry.participantId, index + 1);
    });
    setPreviousPositions(newPositions);
  }, [leaderboard]);

  const getPositionChange = (
    participantId: string,
    currentPosition: number
  ) => {
    const previousPosition = previousPositions.get(participantId);
    if (!previousPosition) return 0;
    return previousPosition - currentPosition;
  };

  return (
<<<<<<< HEAD
    <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-purple-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span>🏆</span> Live Leaderboard
=======
    <div className="bg-white rounded-2xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-2">🏆</span>
          Live Leaderboard
>>>>>>> e93bcd0 (update host)
        </h2>
        <div className="text-right">
          <div className="text-sm text-gray-500 font-semibold">
            {leaderboard.length} participant
            {leaderboard.length !== 1 ? "s" : ""}
          </div>
          {questionStats && (
<<<<<<< HEAD
            <div className="text-xs text-purple-600 font-semibold">
              Q{questionStats.questionNumber}:{" "}
              {questionStats.participantsAnswered}/
              {questionStats.totalParticipants} answered
=======
            <div className="text-xs text-purple-600">
              Q{questionStats.questionNumber}: {questionStats.participantsAnswered}/{questionStats.totalParticipants}{" "}
              answered
>>>>>>> e93bcd0 (update host)
            </div>
          )}
        </div>
      </div>

      {questionStats && (
<<<<<<< HEAD
        <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-purple-800">
              Question {questionStats.questionNumber} Progress
            </span>
            <span className="text-sm font-bold text-purple-600">
              {questionStats.participantsAnswered}/
              {questionStats.totalParticipants}
            </span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
=======
        <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-purple-800">
              Question {questionStats.questionNumber} Progress
            </span>
            <span className="text-sm text-purple-600">
              {questionStats.participantsAnswered}/{questionStats.totalParticipants}
            </span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
>>>>>>> e93bcd0 (update host)
              initial={{ width: 0 }}
              animate={{
                width: `${
                  (questionStats.participantsAnswered /
                    questionStats.totalParticipants) *
                  100
                }%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
<<<<<<< HEAD
          <div className="flex justify-between text-xs text-purple-700 font-semibold mt-2">
=======
          <div className="flex justify-between text-xs text-purple-600 mt-1">
>>>>>>> e93bcd0 (update host)
            <span>Accuracy: {questionStats.accuracyRate.toFixed(1)}%</span>
            <span>
              Avg Time: {questionStats.averageResponseTime.toFixed(1)}s
            </span>
          </div>
        </div>
      )}

<<<<<<< HEAD
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
=======
      {/* Leaderboard Entries */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
>>>>>>> e93bcd0 (update host)
        <AnimatePresence>
          {leaderboard.length > 0 ? (
            leaderboard.map((entry, index) => {
              const positionChange = getPositionChange(
                entry.participantId,
                index + 1
              );
              const isTop3 = index < 3;
              const celebration = celebrations.find(
                (c) => c.participantId === entry.participantId
              );
              const medalEmoji =
                index === 0
                  ? "🥇"
                  : index === 1
                  ? "🥈"
                  : index === 2
                  ? "🥉"
                  : null;

              return (
                <motion.div
                  key={entry.participantId}
                  layout
<<<<<<< HEAD
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className={`relative p-5 rounded-2xl transition-all ${
                    isTop3
                      ? "bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 border-4 border-purple-300 shadow-xl"
                      : "bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 shadow-md hover:shadow-lg"
                  } ${
                    celebration ? "ring-2 ring-yellow-400 ring-opacity-75" : ""
                  }`}
=======
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`relative p-4 rounded-lg transition-all duration-300 ${
                    isTop3
                      ? "bg-gradient-to-r from-purple-100 via-indigo-100 to-purple-100 border-2 border-purple-300 shadow-md"
                      : "bg-gray-50 hover:bg-gray-100"
                  } ${celebration ? "ring-2 ring-yellow-400 ring-opacity-75" : ""}`}
>>>>>>> e93bcd0 (update host)
                >
                  {celebration && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
<<<<<<< HEAD
                      className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-2xl opacity-30 pointer-events-none"
=======
                      className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-lg opacity-30 pointer-events-none"
>>>>>>> e93bcd0 (update host)
                    />
                  )}

                  <div className="flex justify-between items-center relative z-10">
<<<<<<< HEAD
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex items-center justify-center w-16 h-16 rounded-2xl font-black text-2xl shadow-lg ${
                          index === 0
                            ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
                            : index === 1
                            ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                            : index === 2
                            ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                            : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                        }`}
                      >
                        {medalEmoji ||
                          `${index + 1}${getRankSuffix(index + 1)}`}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xl text-gray-800">
                            {entry.nickname}
                          </span>
                          {entry.streak && entry.streak > 2 && (
                            <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
=======
                    <div className="flex items-center space-x-4">
                      {/* Position with Medal */}
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-xl font-bold ${
                            index === 0
                              ? "text-yellow-600"
                              : index === 1
                                ? "text-gray-600"
                                : index === 2
                                  ? "text-orange-600"
                                  : "text-gray-500"
                          }`}
                        >
                          {index + 1}
                        </span>
                        {index === 0 && <span className="text-xl">🥇</span>}
                        {index === 1 && <span className="text-xl">🥈</span>}
                        {index === 2 && <span className="text-xl">🥉</span>}
                      </div>

                      {/* Participant Info */}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-800">{entry.nickname}</span>
                          {entry.streak && entry.streak > 2 && (
                            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
>>>>>>> e93bcd0 (update host)
                              🔥 {entry.streak}
                            </span>
                          )}
                        </div>
<<<<<<< HEAD
                        <div className="text-sm text-gray-600 font-semibold mt-1">
                          {entry.questionsAnswered || 0} answered •{" "}
                          {entry.correctAnswers || 0} correct
=======
                        <div className="text-xs text-gray-500">
                          {entry.questionsAnswered || 0} answered • {entry.correctAnswers || 0} correct
>>>>>>> e93bcd0 (update host)
                        </div>
                      </div>
                    </div>

<<<<<<< HEAD
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                          {entry.totalScore}
                        </span>
                        {positionChange > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-green-500 text-sm font-bold"
                          >
=======
                    {/* Score and Position Change */}
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-purple-600">{entry.totalScore}</span>
                        {positionChange > 0 && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500 text-sm">
>>>>>>> e93bcd0 (update host)
                            ↗️ +{positionChange}
                          </motion.span>
                        )}
                        {positionChange < 0 && (
<<<<<<< HEAD
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-red-500 text-sm font-bold"
                          >
                            ↘️ {positionChange}
                          </motion.span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 font-semibold">
                        points
=======
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-red-500 text-sm">
                            ↘️ {positionChange}
                          </motion.span>
                        )}
>>>>>>> e93bcd0 (update host)
                      </div>
                    </div>
                  </div>

<<<<<<< HEAD
                  <div className="flex justify-between items-center mt-3 relative z-10">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          entry.status === "ACTIVE"
                            ? "bg-green-500 animate-pulse"
                            : entry.status === "ANSWERING"
                            ? "bg-blue-500"
                            : entry.status === "WAITING"
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                        }`}
                      />
                      <span className="text-xs text-gray-600 font-semibold">
                        {entry.status === "ACTIVE"
                          ? "Active"
                          : entry.status === "ANSWERING"
                          ? "Answering"
                          : entry.status === "WAITING"
                          ? "Waiting"
                          : "Idle"}
                      </span>
                    </div>
                    {entry.averageResponseTime && (
                      <span className="text-xs text-gray-500 font-semibold">
                        Avg: {entry.averageResponseTime.toFixed(1)}s
                      </span>
=======
                  {/* Activity Indicator */}
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          entry.status === "ACTIVE"
                            ? "bg-green-500"
                            : entry.status === "ANSWERING"
                              ? "bg-blue-500"
                              : entry.status === "WAITING"
                                ? "bg-yellow-500"
                                : "bg-gray-400"
                        }`}
                      />
                      <span className="text-xs text-gray-500">
                        {entry.status === "ACTIVE"
                          ? "🟢 Active"
                          : entry.status === "ANSWERING"
                            ? "🔵 Answering"
                            : entry.status === "WAITING"
                              ? "🟡 Waiting"
                              : "⚪ Idle"}
                      </span>
                    </div>
                    {entry.averageResponseTime && (
                      <span className="text-xs text-gray-500">Avg: {entry.averageResponseTime.toFixed(1)}s</span>
>>>>>>> e93bcd0 (update host)
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👋</div>
<<<<<<< HEAD
              <p className="text-gray-400 text-lg font-semibold">
                Waiting for participants...
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Share the session code or QR code to get started
              </p>
=======
              <p className="text-gray-400 text-lg">Waiting for participants...</p>
              <p className="text-gray-400 text-sm mt-2">Share the session code or QR code to get started</p>
>>>>>>> e93bcd0 (update host)
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> e93bcd0 (update host)
}

// Participant Progress Component
function ParticipantProgress({
  participants,
  detailedProgress,
  totalQuestions,
}: {
  participants: any[];
  detailedProgress: DetailedParticipantProgress[];
  totalQuestions: number;
}) {
  const [sortBy, setSortBy] = useState<"score" | "progress" | "accuracy">(
    "score"
  );

  const enrichedParticipants = participants.map((p) => {
    const details = detailedProgress.find((d) => d.participantId === p.id);
    return {
      ...p,
      ...details,
    };
  });

  const sortedParticipants = [...enrichedParticipants].sort((a, b) => {
    switch (sortBy) {
      case "score":
        return (b.totalScore || 0) - (a.totalScore || 0);
      case "progress":
        return (b.answeredCount || 0) - (a.answeredCount || 0);
      case "accuracy":
        return (b.accuracy || 0) - (a.accuracy || 0);
      default:
        return 0;
    }
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "completed":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
<<<<<<< HEAD
    <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span>👥</span>
=======
    <div className="bg-white rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <span className="mr-2">👥</span>
>>>>>>> e93bcd0 (update host)
          Participants ({participants.length})
        </h3>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
<<<<<<< HEAD
          className="text-xs px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
=======
          className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
>>>>>>> e93bcd0 (update host)
        >
          <option value="score">Score</option>
          <option value="progress">Progress</option>
          <option value="accuracy">Accuracy</option>
        </select>
      </div>

<<<<<<< HEAD
      <div className="flex items-center gap-3 mb-3 text-xs font-semibold">
=======
      {/* Legend */}
      <div className="flex items-center gap-3 mb-3 text-xs">
>>>>>>> e93bcd0 (update host)
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Correct</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Wrong</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-300 rounded"></div>
          <span>Pending</span>
        </div>
      </div>

<<<<<<< HEAD
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
=======
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
>>>>>>> e93bcd0 (update host)
        {sortedParticipants.length > 0 ? (
          sortedParticipants.map((participant, index) => (
            <motion.div
              key={participant.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
<<<<<<< HEAD
              className="border-2 border-gray-200 rounded-2xl p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                        ? "bg-gray-400"
                        : index === 2
                        ? "bg-orange-600"
                        : "bg-indigo-500"
=======
              className="border border-gray-200 rounded-lg p-3"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                          ? "bg-gray-400"
                          : index === 2
                            ? "bg-orange-600"
                            : "bg-indigo-500"
>>>>>>> e93bcd0 (update host)
                    }`}
                  >
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : index + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
<<<<<<< HEAD
                      <span className="font-bold text-gray-800 text-sm">
                        {participant.nickname}
                      </span>
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          participant.status
                        )}`}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 font-semibold">
                      {participant.answeredCount || 0}/{totalQuestions} •{" "}
                      {participant.correctCount || 0} correct •{" "}
=======
                      <span className="font-semibold text-gray-800 text-sm">{participant.nickname}</span>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(participant.status)}`}></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {participant.answeredCount || 0}/{totalQuestions} •{participant.correctCount || 0} correct •
>>>>>>> e93bcd0 (update host)
                      {Math.round(participant.accuracy || 0)}% accuracy
                    </div>
                  </div>
                </div>

                <div className="text-right">
<<<<<<< HEAD
                  <div className="text-lg font-bold text-indigo-600">
                    {participant.totalScore || 0}
                  </div>
                  <div className="text-xs text-gray-500 font-semibold">
                    points
                  </div>
=======
                  <div className="text-lg font-bold text-indigo-600">{participant.totalScore || 0}</div>
                  <div className="text-xs text-gray-500">points</div>
>>>>>>> e93bcd0 (update host)
                </div>
              </div>

              {participant.answers && participant.answers.length > 0 && (
                <div className="flex gap-0.5">
                  {Array.from({ length: totalQuestions }, (_, i) => {
                    const questionNum = i + 1;
                    const answer = participant.answers.find(
                      (a: ParticipantAnswer) => a.questionNumber === questionNum
                    );

                    let bgColor = "bg-gray-300";
                    let tooltip = `Q${questionNum}: Not attempted`;

                    if (answer && answer.answered) {
                      if (answer.isCorrect) {
                        bgColor = "bg-green-500";
                        tooltip = `Q${questionNum}: Correct (+${answer.pointsEarned})`;
                      } else {
                        bgColor = "bg-red-500";
                        tooltip = `Q${questionNum}: Incorrect`;
                      }
                    }

                    const isCurrent =
                      questionNum === participant.currentQuestionNumber;

                    return (
                      <div
                        key={questionNum}
                        title={tooltip}
                        className={`flex-1 h-6 rounded ${bgColor} ${
                          isCurrent ? "ring-2 ring-blue-500" : ""
                        } transition-all cursor-pointer hover:scale-105`}
                      >
                        {isCurrent && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
<<<<<<< HEAD
            <p className="text-lg font-semibold">No participants yet</p>
=======
            <p className="text-lg">No participants yet</p>
>>>>>>> e93bcd0 (update host)
            <p className="text-sm">Share the session code to get started!</p>
          </div>
        )}
      </div>
    </div>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> e93bcd0 (update host)
}

// Host Controls Component
function HostControls({
  hostDashboard,
  sessionCode,
  onStartSession,
  onPauseSession,
  onResumeSession,
  onEndSession,
  onNextQuestion,
  onSetQuestionTimeLimit,
}: {
  hostDashboard: HostDashboardData | null;
  sessionCode: string;
  onStartSession: () => void;
  onPauseSession: () => void;
  onResumeSession: () => void;
  onEndSession: () => void;
  onNextQuestion: () => void;
  onSetQuestionTimeLimit: (timeLimit: number) => void;
}) {
  const [customTimeLimit, setCustomTimeLimit] = useState(30);

  if (!hostDashboard) return null;

  return (
<<<<<<< HEAD
    <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-purple-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>🎮</span>
=======
    <div className="bg-white rounded-2xl p-6 shadow-xl">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">🎮</span>
>>>>>>> e93bcd0 (update host)
        Host Controls
      </h3>

      <div className="space-y-3">
<<<<<<< HEAD
        <div className="grid grid-cols-2 gap-2">
          {hostDashboard.canStart && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartSession}
              className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              🚀 Start
            </motion.button>
          )}

          {hostDashboard.canPause && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPauseSession}
              className="px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              ⏸️ Pause
            </motion.button>
          )}

          {hostDashboard.canResume && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onResumeSession}
              className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              ▶️ Resume
            </motion.button>
          )}

          {hostDashboard.canAdvanceQuestion && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNextQuestion}
              className="px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              ➡️ Next Q
            </motion.button>
          )}

          {hostDashboard.canEnd && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEndSession}
              className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all col-span-2"
            >
              🛑 End Session
            </motion.button>
=======
        {/* Session Controls */}
        <div className="grid grid-cols-2 gap-2">
          {hostDashboard.canStart && (
            <button
              onClick={onStartSession}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition text-sm"
            >
              🚀 Start
            </button>
          )}

          {hostDashboard.canPause && (
            <button
              onClick={onPauseSession}
              className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition text-sm"
            >
              ⏸️ Pause
            </button>
          )}

          {hostDashboard.canResume && (
            <button
              onClick={onResumeSession}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition text-sm"
            >
              ▶️ Resume
            </button>
          )}

          {hostDashboard.canAdvanceQuestion && (
            <button
              onClick={onNextQuestion}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition text-sm"
            >
              ➡️ Next Q
            </button>
          )}

          {hostDashboard.canEnd && (
            <button
              onClick={onEndSession}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition text-sm col-span-2"
            >
              🛑 End Session
            </button>
>>>>>>> e93bcd0 (update host)
          )}

<<<<<<< HEAD
        {hostDashboard.currentTimer && (
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
            <div className="text-sm font-bold text-gray-700 mb-2">
              Current Timer: {hostDashboard.currentTimer.timerType}
            </div>
            <div className="text-3xl font-black text-purple-600">
=======
          {/* veiw report */}
{hostDashboard?.sessionStatus === "COMPLETED" && (
  <div className="text-center mt-6">
    <Link href={`/host/${sessionCode}/report`}>
      <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 shadow-lg">
        📊 View Session Report
      </button>
    </Link>
  </div>
)}
          
        </div>

        {/* Timer Controls */}
        {hostDashboard.currentTimer && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Current Timer: {hostDashboard.currentTimer.timerType}
            </div>
            <div className="text-lg font-bold text-purple-600">
>>>>>>> e93bcd0 (update host)
              {Math.floor(hostDashboard.currentTimer.remainingSeconds / 60)}:
              {(hostDashboard.currentTimer.remainingSeconds % 60)
                .toString()
                .padStart(2, "0")}
            </div>
<<<<<<< HEAD
            <div className="text-xs text-gray-600 font-semibold mt-1">
              Status: {hostDashboard.currentTimer.timerStatus}
            </div>
          </div>
        )}

        <div className="p-4 bg-gray-50 rounded-2xl border-2 border-gray-200">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Set Question Time Limit
          </label>
=======
            <div className="text-xs text-gray-500">Status: {hostDashboard.currentTimer.timerStatus}</div>
          </div>
        )}

        {/* Custom Time Limit */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">Set Question Time Limit</label>
>>>>>>> e93bcd0 (update host)
          <div className="flex space-x-2">
            <input
              type="number"
              min="5"
              max="300"
              value={customTimeLimit}
<<<<<<< HEAD
              onChange={(e) =>
                setCustomTimeLimit(Number.parseInt(e.target.value))
              }
              className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-purple-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSetQuestionTimeLimit(customTimeLimit)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-lg"
            >
              Set
            </motion.button>
=======
              onChange={(e) => setCustomTimeLimit(Number.parseInt(e.target.value))}
              className="flex-1 px-3 py-1 border rounded text-sm"
            />
            <button
              onClick={() => onSetQuestionTimeLimit(customTimeLimit)}
              className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
            >
              Set
            </button>
>>>>>>> e93bcd0 (update host)
          </div>
        </div>
      </div>
    </div>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> e93bcd0 (update host)
}

// Main Component
export default function LocalhostHostUI() {
  const params = useParams();
  const urlSessionCode = params?.sessionCode as string;

  const [isConnected, setIsConnected] = useState(false);
  const [sessionCode, setSessionCode] = useState(urlSessionCode || "");
  const [sessionId, setSessionId] = useState<string>("");
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");

  const [hostDashboard, setHostDashboard] = useState<HostDashboardData | null>(
    null
  );
  const [participants, setParticipants] = useState<any[]>([]);
  const [participantProgress, setParticipantProgress] = useState<
    Map<string, any>
  >(new Map());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [celebrations, setCelebrations] = useState<ScoreCelebration[]>([]);
  const [questionStats, setQuestionStats] = useState<QuestionStats | null>(
    null
  );
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [joinUrl, setJoinUrl] = useState<string>("");
  const [detailedProgress, setDetailedProgress] = useState<
    DetailedParticipantProgress[]
  >([]);

  const [showSettings, setShowSettings] = useState(false);
  const [authError, setAuthError] = useState<string>("");

<<<<<<< HEAD
  const stompRef = useRef<Client | null>(null);
=======
  // UI state
  const [showSettings, setShowSettings] = useState(false)
  const [authError, setAuthError] = useState<string>("")
>>>>>>> e93bcd0 (update host)

  const handleConnect = useCallback(async () => {
    const hasToken = await checkAuthToken();
    if (!hasToken) {
      setAuthError("Please login first to access the host dashboard");
      return;
    }
    setIsConnected(true);
    setConnectionStatus("Connecting...");
    setAuthError("");
  }, []);

  useEffect(() => {
    if (urlSessionCode && !isConnected && sessionCode) {
      const timer = setTimeout(() => {
        handleConnect();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [urlSessionCode, sessionCode, isConnected, handleConnect]);

  useEffect(() => {
    if (typeof window !== "undefined" && isConnected) {
      setJoinUrl(`${window.location.origin}/${sessionCode}/join`);
    }
  }, [sessionCode, isConnected]);

  const handleDisconnect = useCallback(() => {
    if (stompRef.current) {
      stompRef.current.deactivate();
    }
    setIsConnected(false);
    setConnectionStatus("Disconnected");
    setHostDashboard(null);
    setParticipants([]);
    setLeaderboard([]);
    setCelebrations([]);
    setQuestionStats(null);
    setCurrentQuestion(null);
    setAuthError("");
  }, []);

  const fetchHostDashboardByCode = useCallback(async () => {
    if (!sessionCode) return;

    try {
      const headers = await getAuthHeaders();
      if (!headers.Authorization) {
        setAuthError("No authentication token found. Please login first.");
        return;
      }

<<<<<<< HEAD
      const baseUrl = getApiBaseUrl();
      const response = await fetch(
        `${baseUrl}/v1/host/dashboard/${sessionCode}`,
        {
          headers,
        }
      );
=======
      const baseUrl = getApiBaseUrl()
      console.log("📊 Fetching host dashboard for session:", sessionCode)

      // Use the correct host dashboard endpoint directly
      const response = await fetch(`${baseUrl}/v1/host/dashboard/${sessionCode}`, {
        headers,
      })
>>>>>>> e93bcd0 (update host)

      if (response.ok) {
        const dashboardData = await response.json();
        setHostDashboard(dashboardData);

        if (dashboardData.sessionId) {
          setSessionId(dashboardData.sessionId);
        }
      } else if (response.status === 404) {
        setAuthError(`Session ${sessionCode} not found`);
      } else {
        const errorDetails = await response
          .text()
          .catch(() => "No details available");
        setAuthError(
          `Failed to load dashboard: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      setAuthError(
        `An error occurred: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }, [sessionCode]);

  useEffect(() => {
    if (!isConnected || !sessionCode) return;

    const setupWebSocket = async () => {
      const hasToken = await checkAuthToken();
      if (!hasToken) {
        setAuthError("Authentication token not found. Please login first.");
        setConnectionStatus("Authentication Error");
        return;
      }

      try {
        const session = await getSession();
        const token = (session as any)?.apiAccessToken;

        const wsUrl = getWebSocketUrl();
        const sock = new SockJS(wsUrl);
        const stomp = new Client({
          webSocketFactory: () => sock,
          reconnectDelay: 3000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          connectHeaders: {
            nickname: "__HOST__",
            Authorization: `Bearer ${token}`,
          },
          debug: (str) => console.log("[STOMP]", str),
        });

        stomp.onConnect = () => {
          setConnectionStatus("Connected");

          stomp.subscribe(
            `/topic/session/${sessionCode}/enhanced-leaderboard`,
            (msg) => {
              const data = JSON.parse(msg.body);
              if (data.entries) {
                setLeaderboard(data.entries);
              }
            }
          );

          stomp.subscribe(
            `/topic/session/${sessionCode}/leaderboard`,
            (msg) => {
              const data = JSON.parse(msg.body);
              let entries: LeaderboardEntry[] = [];
              if (data.leaderboard?.entries) {
                entries = data.leaderboard.entries;
              } else if (data.entries) {
                entries = data.entries;
              } else if (Array.isArray(data)) {
                entries = data;
              }
              setLeaderboard(entries);
            }
          );

          stomp.subscribe(
            `/topic/session/${sessionCode}/host/dashboard`,
            (msg) => {
              const data = JSON.parse(msg.body);
              setHostDashboard(data);
            }
          );

          stomp.subscribe(
            `/topic/session/${sessionCode}/host/progress`,
            (msg) => {
              const data = JSON.parse(msg.body);
              if (data.participantProgress) {
                setParticipants(data.participantProgress);
              }
            }
          );

          stomp.subscribe(`/topic/session/${sessionCode}/live-stats`, (msg) => {
            const data = JSON.parse(msg.body);
            setQuestionStats({
              sessionId: data.sessionId || sessionCode,
              questionNumber: data.currentQuestion || 1,
              totalQuestions: data.totalQuestions || 10,
              totalParticipants: data.totalParticipants || 0,
              participantsAnswered: data.participantsAnswered || 0,
              participantsRemaining: data.participantsRemaining || 0,
              averageResponseTime: data.averageResponseTime || 0,
              correctAnswers: data.correctAnswers || 0,
              incorrectAnswers: data.incorrectAnswers || 0,
              accuracyRate: data.accuracyRate || 0,
              isQuestionComplete: data.isQuestionComplete || false,
            });
          });

          stomp.subscribe(
            `/topic/session/${sessionCode}/score-updates`,
            (msg) => {
              const data = JSON.parse(msg.body);
              if (data.isCorrect && data.pointsEarned > 0) {
                const celebration: ScoreCelebration = {
                  participantId: data.participantId,
                  nickname: data.participantNickname,
                  pointsEarned: data.pointsEarned,
                  newTotalScore: data.newScore,
                  newRank: data.currentRank || 0,
                  isCorrect: data.isCorrect,
                  celebrationType: "SCORE_GAIN",
                  animationType: "BOUNCE",
                };

                setCelebrations((prev) => [...prev, celebration]);
                setTimeout(() => {
                  setCelebrations((prev) =>
                    prev.filter(
                      (c) => c.participantId !== celebration.participantId
                    )
                  );
                }, 3000);
              }
            }
          );

          stomp.subscribe(`/topic/session/${sessionCode}/timer`, (msg) => {
            const data = JSON.parse(msg.body);
            setHostDashboard((prev) =>
              prev
                ? {
                    ...prev,
                    currentTimer: {
                      timerType: data.timerType,
                      timerStatus: data.timerStatus,
                      remainingSeconds: data.remainingSeconds,
                      totalSeconds: data.totalSeconds,
                    },
                  }
                : null
            );
          });

          stomp.subscribe(
            `/topic/session/${sessionCode}/participants`,
            (msg) => {
              const data = JSON.parse(msg.body);
              setParticipants(data.participants || []);
            }
          );

          stomp.subscribe(`/topic/session/${sessionCode}/question`, (msg) => {
            const data = JSON.parse(msg.body);
            setCurrentQuestion(data.question || data);
          });

          fetchHostDashboardByCode();
        };

        stomp.onDisconnect = () => {
          setConnectionStatus("Disconnected");
        };

        stomp.onStompError = (frame) => {
          console.error("❌ STOMP error:", frame);
          setConnectionStatus("Error");

          if (
            frame.headers &&
            frame.headers.message &&
            frame.headers.message.includes("401")
          ) {
            setAuthError("Authentication failed. Please login again.");
          }
        };

        stomp.activate();
        stompRef.current = stomp;

        return () => {
          stompRef.current?.deactivate();
        };
      } catch (error) {
        setConnectionStatus("Error");
      }
    };

    setupWebSocket();
  }, [isConnected, sessionCode, fetchHostDashboardByCode]);

  const fetchDetailedProgress = useCallback(async () => {
    if (!sessionCode) return;

    try {
      const headers = await getAuthHeaders();
      if (!headers.Authorization) return;

      const baseUrl = getApiBaseUrl();
      const response = await fetch(
        `${baseUrl}/v1/host/session/${sessionCode}/participant-progress`,
        { headers }
      );

      if (response.ok) {
        const data = await response.json();
        setDetailedProgress(data);
      }
    } catch (error) {
      console.error("❌ Failed to fetch detailed progress:", error);
    }
  }, [sessionCode]);

  useEffect(() => {
    if (hostDashboard?.sessionStatus === "IN_PROGRESS" && sessionCode) {
      fetchDetailedProgress();
      const interval = setInterval(fetchDetailedProgress, 3000);
      return () => clearInterval(interval);
    }
  }, [hostDashboard?.sessionStatus, sessionCode, fetchDetailedProgress]);

  // FIXED: Enhanced host command sender with correct API URL
  const handleSendHostCommand = useCallback(
    async (command: string, data?: any) => {
<<<<<<< HEAD
      if (!sessionCode) {
        console.error("❌ Cannot send command: No session code");
        return;
      }

      const headers = await getAuthHeaders();
      if (!headers.Authorization) {
        setAuthError("No authentication token found. Please login first.");
        return;
      }
=======
      // FIXED: Always use sessionCode, not sessionId
      if (!sessionCode) {
        console.error("❌ Cannot send command: No session code")
        return
      }

      const headers = await getAuthHeaders()
      if (!headers.Authorization) {
        setAuthError("No authentication token found. Please login first.")
        return
      }

      const baseUrl = getApiBaseUrl()

      try {
        let endpoint = ""
        let method = "POST"
        const body = null

        switch (command) {
          case "START_SESSION":
            // First, update session timing settings if provided
            if (data) {
              // FIXED: Use sessionCode instead of currentSessionId
              const timingEndpoint = `/v1/host/session/${sessionCode}/timing`
              const timingResponse = await fetch(`${baseUrl}${timingEndpoint}`, {
                method: "PUT",
                headers,
                body: JSON.stringify(data),
              })
              if (!timingResponse.ok) {
                console.error("❌ Failed to update session timing:", timingResponse.statusText)
                return
              }
              console.log("✅ Session timing updated successfully")
            }

            // FIXED: Use sessionCode (not sessionId) - backend expects session code
            endpoint = `/v1/quiz-sessions/${sessionCode}/start`
            method = "PUT"
            break
          case "PAUSE_SESSION":
            // FIXED: Use sessionCode
            endpoint = `/v1/host/session/${sessionCode}/timer/pause`
            break
          case "RESUME_SESSION":
            // FIXED: Use sessionCode
            endpoint = `/v1/host/session/${sessionCode}/timer/resume`
            break
          case "END_SESSION":
            // FIXED: Use correct session end endpoint
            endpoint = `/v1/quiz-sessions/${sessionCode}/end`
            method = "PUT"
            break
          case "NEXT_QUESTION":
            // FIXED: Use sessionCode
            endpoint = `/v1/host/session/${sessionCode}/force-advance`
            break
          case "SET_QUESTION_TIME_LIMIT":
            // FIXED: Use sessionCode
            endpoint = `/v1/host/session/${sessionCode}/question-time-limit?timeLimit=${data}`
            break
          default:
            console.warn("Unknown command:", command)
            return
        }

        const response = await fetch(`${baseUrl}${endpoint}`, {
          method,
          headers,
          body,
        })

        if (response.ok) {
          console.log(`✅ Command ${command} executed successfully`)

          // REMOVED: Redundant timer start - backend handles this automatically
          // The startSession endpoint should start the timer internally

          // Refresh dashboard data
          fetchHostDashboardByCode()
        } else if (response.status === 401) {
          setAuthError("Authentication failed. Please login again.")
          console.error(`❌ Command ${command} failed: Authentication error`)
        } else {
          const errorText = await response.text().catch(() => response.statusText)
          console.error(`❌ Command ${command} failed:`, errorText)
          setAuthError(`Failed to execute command ${command}: ${response.status} ${response.statusText} - ${errorText}`)
        }
      } catch (error) {
        console.error(`❌ Error executing command ${command}:`, error)
        setAuthError(
          `An error occurred while executing ${command}: ${error instanceof Error ? error.message : String(error)}`,
        )
      }
    },
    [sessionCode, fetchHostDashboardByCode],
  )
>>>>>>> e93bcd0 (update host)

      const baseUrl = getApiBaseUrl();

      try {
        let endpoint = "";
        let method = "POST";
        const body = null;

        switch (command) {
          case "START_SESSION":
            if (data) {
              const timingEndpoint = `/v1/host/session/${sessionCode}/timing`;
              const timingResponse = await fetch(
                `${baseUrl}${timingEndpoint}`,
                {
                  method: "PUT",
                  headers,
                  body: JSON.stringify(data),
                }
              );
              if (!timingResponse.ok) {
                console.error("❌ Failed to update session timing");
                return;
              }
            }
            endpoint = `/v1/quiz-sessions/${sessionCode}/start`;
            method = "PUT";
            break;
          case "PAUSE_SESSION":
            endpoint = `/v1/host/session/${sessionCode}/timer/pause`;
            break;
          case "RESUME_SESSION":
            endpoint = `/v1/host/session/${sessionCode}/timer/resume`;
            break;
          case "END_SESSION":
            endpoint = `/v1/quiz-sessions/${sessionCode}/end`;
            method = "PUT";
            break;
          case "NEXT_QUESTION":
            endpoint = `/v1/host/session/${sessionCode}/force-advance`;
            break;
          case "SET_QUESTION_TIME_LIMIT":
            endpoint = `/v1/host/session/${sessionCode}/question-time-limit?timeLimit=${data}`;
            break;
          default:
            return;
        }

        const response = await fetch(`${baseUrl}${endpoint}`, {
          method,
          headers,
          body,
        });

        if (response.ok) {
          fetchHostDashboardByCode();
        } else if (response.status === 401) {
          setAuthError("Authentication failed. Please login again.");
        } else {
          const errorText = await response
            .text()
            .catch(() => response.statusText);
          setAuthError(
            `Failed to execute command ${command}: ${response.status}`
          );
        }
      } catch (error) {
        setAuthError(
          `An error occurred while executing ${command}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    },
    [sessionCode, fetchHostDashboardByCode]
  );

  const handleStartSession = useCallback(
    (settings: any) => {
      handleSendHostCommand("START_SESSION", settings);
    },
    [handleSendHostCommand]
  );

  const handlePauseSession = useCallback(() => {
    handleSendHostCommand("PAUSE_SESSION");
  }, [handleSendHostCommand]);

  const handleResumeSession = useCallback(() => {
    handleSendHostCommand("RESUME_SESSION");
  }, [handleSendHostCommand]);

  const handleEndSession = useCallback(() => {
    handleSendHostCommand("END_SESSION");
  }, [handleSendHostCommand]);

  const handleNextQuestion = useCallback(() => {
    handleSendHostCommand("NEXT_QUESTION");
  }, [handleSendHostCommand]);

  const handleSetQuestionTimeLimit = useCallback(
    (timeLimit: number) => {
      handleSendHostCommand("SET_QUESTION_TIME_LIMIT", timeLimit);
    },
    [handleSendHostCommand]
  );

<<<<<<< HEAD
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900 flex items-center justify-center p-6">
        <SessionCodeInput
          sessionCode={sessionCode}
          setSessionCode={setSessionCode}
          onConnect={handleConnect}
        />
=======
  // Show session code input if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-auto text-center"
        >
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Host Quiz Dashboard</h2>
          <p className="text-gray-600 mb-6">Connecting to session...</p>

          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="text-sm text-purple-800">
              <div className="font-medium mb-2">📋 Session Code:</div>
              <div className="text-2xl font-mono font-bold text-purple-900 tracking-wider">
                {sessionCode || "Loading..."}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Connecting to WebSocket...</span>
          </div>

          {authError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-sm text-red-800">
                <div className="font-medium mb-1">⚠️ Authentication Error</div>
                <div>{authError}</div>
              </div>
            </div>
          )}
        </motion.div>
>>>>>>> e93bcd0 (update host)
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Professional Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-2xl border-b-4 border-purple-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <span className="text-3xl">🎮</span>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  Host Dashboard
                  <span
                    className={`w-3 h-3 rounded-full ${
                      connectionStatus === "Connected"
                        ? "bg-green-500 animate-pulse"
                        : "bg-red-500"
                    }`}
                  />
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-600 font-medium">
                    {connectionStatus}
                  </span>
                  {hostDashboard && (
                    <div className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                      Q{hostDashboard.currentQuestion}/
                      {hostDashboard.totalQuestions} •{" "}
                      {hostDashboard.participantsAnswered}/
                      {hostDashboard.totalParticipants} answered
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 px-8 py-4 rounded-2xl shadow-xl border-4 border-white">
              <p className="text-xs text-white/90 font-semibold mb-1 text-center">
                SESSION CODE
              </p>
              <p className="text-3xl lg:text-4xl font-black text-white tracking-wider">
                {sessionCode}
              </p>
            </div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                🚀 Start
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDisconnect}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                🔌 Exit
              </motion.button>
=======
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900">
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <span className="mr-2">🎮</span>
              Quiz Host Dashboard
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    connectionStatus === "Connected"
                      ? "bg-green-500 animate-pulse"
                      : connectionStatus === "Connecting..."
                        ? "bg-yellow-500 animate-pulse"
                        : connectionStatus === "Authentication Error"
                          ? "bg-red-500"
                          : "bg-red-500"
                  }`}
                />
                <span className="text-sm text-gray-600 font-medium">{connectionStatus}</span>
              </div>

              {hostDashboard && (
                <div className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  Q{hostDashboard.currentQuestion}/{hostDashboard.totalQuestions} •{hostDashboard.participantsAnswered}/
                  {hostDashboard.totalParticipants} answered
                </div>
              )}
            </div>

            {/* Authentication Error Display */}
            {authError && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">⚠️ {authError}</div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 px-6 py-4 rounded-xl border border-purple-200">
              <p className="text-xs text-gray-600 mb-1">Session Code</p>
              <p className="text-2xl font-bold text-purple-800">{sessionCode}</p>
            </div>

            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition shadow-lg"
                disabled={!!authError}
              >
                🚀 Start Quiz
              </button>

              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition"
                disabled={connectionStatus !== "Connected" || !!authError}
              >
                ➡️ Next Question
              </button>

              <button
                onClick={handleDisconnect}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition text-sm"
              >
                🔌 Disconnect
              </button>
>>>>>>> e93bcd0 (update host)
            </div>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {authError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-red-700 font-semibold">
            ⚠️ {authError}
          </div>
=======
      {/* Main Content */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Session Info & Controls */}
        <div className="space-y-6">
          {/* QR Code */}
          <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📱 Join Quiz</h3>
            {joinUrl && (
              <div className="bg-white p-4 rounded-lg inline-block border-2 border-gray-200">
                <QRCodeCanvas value={joinUrl} size={150} />
              </div>
            )}
            <p className="text-sm text-gray-600 mt-4">
              Scan QR code or visit: <br />
              <span className="font-mono text-purple-600">{joinUrl}</span>
            </p>
          </div>
          <HostControls
            hostDashboard={hostDashboard}
            sessionCode={sessionCode}
            onStartSession={() => setShowSettings(true)}
            onPauseSession={handlePauseSession}
            onResumeSession={handleResumeSession}
            onEndSession={handleEndSession}
            onNextQuestion={handleNextQuestion}
            onSetQuestionTimeLimit={handleSetQuestionTimeLimit}
         
            // onSetQuestionTimeLimit={handleSetQuestionTimeLimit}
          />

          {/* Participant Progress */}
          <ParticipantProgress
            participants={participants}
            detailedProgress={detailedProgress}
            totalQuestions={hostDashboard?.totalQuestions || 10}
          />
>>>>>>> e93bcd0 (update host)
        </div>
      )}

<<<<<<< HEAD
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-purple-200 text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                📱 Join Quiz
              </h3>
              {joinUrl && (
                <div className="bg-white p-4 rounded-lg inline-block border-2 border-gray-200">
                  <QRCodeCanvas value={joinUrl} size={150} />
                </div>
              )}
              <p className="text-sm text-gray-600 mt-4">
                Scan QR code or visit: <br />
                <span className="font-mono text-purple-600">{joinUrl}</span>
              </p>
            </div>

            <HostControls
              hostDashboard={hostDashboard}
              sessionCode={sessionCode}
              onStartSession={() => setShowSettings(true)}
              onPauseSession={handlePauseSession}
              onResumeSession={handleResumeSession}
              onEndSession={handleEndSession}
              onNextQuestion={handleNextQuestion}
              onSetQuestionTimeLimit={handleSetQuestionTimeLimit}
            />

            <ParticipantProgress
              participants={participants}
              detailedProgress={detailedProgress}
              totalQuestions={hostDashboard?.totalQuestions || 10}
            />
          </div>

          <div className="lg:col-span-2">
            <EnhancedLeaderboard
              leaderboard={leaderboard}
              celebrations={celebrations}
              questionStats={questionStats}
            />
          </div>
        </div>
      </div>

=======
        {/* Right Columns - Leaderboard */}
        <div className="lg:col-span-2">
          <EnhancedLeaderboard leaderboard={leaderboard} celebrations={celebrations} questionStats={questionStats} />
        </div>
      </div>

      {/* Quiz Settings Modal */}
>>>>>>> e93bcd0 (update host)
      <AnimatePresence>
        {showSettings && (
          <QuizSettingsModal
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            onStart={handleStartSession}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
