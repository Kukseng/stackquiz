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

  const envUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://stackquiz-api.stackquiz.me/api";
  // Remove trailing /v1 if present since all endpoints already include /v1/
  return envUrl.replace(/\/v1\/?$/, "");
};

function getRankSuffix(rank: number): string {
  if (rank === 1) return "st";
  if (rank === 2) return "nd";
  if (rank === 3) return "rd";
  return "th";
}

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
            <span className="text-sm text-yellow-800">
              Please make sure you're logged in before connecting
            </span>
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
            Make sure the session exists in your database and you're logged in
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Enhanced Quiz Settings Modal
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
      defaultQuestionTimeLimit: settings.defaultQuestionTimeLimit,
      autoAdvanceQuestions: settings.autoAdvanceQuestions,
      allowLateJoining: settings.allowLateJoining,
      showTimer: settings.showTimer,
    };

    onStart(timingRequest);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
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

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Question Time Limit (seconds)
            </label>
            <input
              type="number"
              min="5"
              max="300"
              value={settings.defaultQuestionTimeLimit}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  defaultQuestionTimeLimit: Number.parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 30s for multiple choice, 60s for complex questions
            </p>
          </div>

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
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

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
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowLateJoining}
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
            </div>
          </label>

          <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoAdvanceQuestions}
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
            </div>
          </label>

          <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showTimer}
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
            </div>
          </label>

          <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showCorrectAnswers}
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
            </div>
          </label>
        </div>

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
  );
}

// Enhanced Leaderboard Component
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
    <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-purple-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span>🏆</span> Live Leaderboard
        </h2>
        <div className="text-right">
          <div className="text-sm text-gray-500 font-semibold">
            {leaderboard.length} participant
            {leaderboard.length !== 1 ? "s" : ""}
          </div>
          {questionStats && (
            <div className="text-xs text-purple-600 font-semibold">
              Q{questionStats.questionNumber}:{" "}
              {questionStats.participantsAnswered}/
              {questionStats.totalParticipants} answered
            </div>
          )}
        </div>
      </div>

      {questionStats && (
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
          <div className="flex justify-between text-xs text-purple-700 font-semibold mt-2">
            <span>Accuracy: {questionStats.accuracyRate.toFixed(1)}%</span>
            <span>
              Avg Time: {questionStats.averageResponseTime.toFixed(1)}s
            </span>
          </div>
        </div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
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
                >
                  {celebration && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-2xl opacity-30 pointer-events-none"
                    />
                  )}

                  <div className="flex justify-between items-center relative z-10">
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
                              🔥 {entry.streak}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 font-semibold mt-1">
                          {entry.questionsAnswered || 0} answered •{" "}
                          {entry.correctAnswers || 0} correct
                        </div>
                      </div>
                    </div>

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
                            ↗️ +{positionChange}
                          </motion.span>
                        )}
                        {positionChange < 0 && (
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
                      </div>
                    </div>
                  </div>

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
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👋</div>
              <p className="text-gray-400 text-lg font-semibold">
                Waiting for participants...
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Share the session code or QR code to get started
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
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
    <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span>👥</span>
          Participants ({participants.length})
        </h3>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="text-xs px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
        >
          <option value="score">Score</option>
          <option value="progress">Progress</option>
          <option value="accuracy">Accuracy</option>
        </select>
      </div>

      <div className="flex items-center gap-3 mb-3 text-xs font-semibold">
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

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {sortedParticipants.length > 0 ? (
          sortedParticipants.map((participant, index) => (
            <motion.div
              key={participant.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
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
                      {Math.round(participant.accuracy || 0)}% accuracy
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-indigo-600">
                    {participant.totalScore || 0}
                  </div>
                  <div className="text-xs text-gray-500 font-semibold">
                    points
                  </div>
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
            <p className="text-lg font-semibold">No participants yet</p>
            <p className="text-sm">Share the session code to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
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
    <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-purple-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>🎮</span>
        Host Controls
      </h3>

      <div className="space-y-3">
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
          )}
        </div>

        {hostDashboard.currentTimer && (
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
            <div className="text-sm font-bold text-gray-700 mb-2">
              Current Timer: {hostDashboard.currentTimer.timerType}
            </div>
            <div className="text-3xl font-black text-purple-600">
              {Math.floor(hostDashboard.currentTimer.remainingSeconds / 60)}:
              {(hostDashboard.currentTimer.remainingSeconds % 60)
                .toString()
                .padStart(2, "0")}
            </div>
            <div className="text-xs text-gray-600 font-semibold mt-1">
              Status: {hostDashboard.currentTimer.timerStatus}
            </div>
          </div>
        )}

        <div className="p-4 bg-gray-50 rounded-2xl border-2 border-gray-200">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Set Question Time Limit
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              min="5"
              max="300"
              value={customTimeLimit}
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
          </div>
        </div>
      </div>
    </div>
  );
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

  const stompRef = useRef<Client | null>(null);

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

      const baseUrl = getApiBaseUrl();
      const response = await fetch(
        `${baseUrl}/v1/host/dashboard/${sessionCode}`,
        {
          headers,
        }
      );

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

  const handleSendHostCommand = useCallback(
    async (command: string, data?: any) => {
      if (!sessionCode) {
        console.error("❌ Cannot send command: No session code");
        return;
      }

      const headers = await getAuthHeaders();
      if (!headers.Authorization) {
        setAuthError("No authentication token found. Please login first.");
        return;
      }

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

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900 flex items-center justify-center p-6">
        <SessionCodeInput
          sessionCode={sessionCode}
          setSessionCode={setSessionCode}
          onConnect={handleConnect}
        />
      </div>
    );
  }

  return (
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
            </div>
          </div>
        </div>
      </div>

      {authError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-red-700 font-semibold">
            ⚠️ {authError}
          </div>
        </div>
      )}

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
