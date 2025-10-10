
"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { motion, AnimatePresence } from "framer-motion";

// ===== INTERFACES =====
interface LeaderboardEntry {
  participantId: string;
  nickname: string;
  totalScore: number;
  position: number;
  rank: number;
  isCurrentUser?: boolean;
  avatarId?: string;
  questionsAnswered?: number;
  correctAnswers?: number;
  streak?: number;
  positionChange?: number;
  isOnline?: boolean;
  lastActivity?: string;
  status?: string;
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

interface ParticipantRankUpdate {
  participantId: string;
  nickname: string;
  currentRank: number;
  previousRank: number;
  currentScore: number;
  scoreChange: number;
  updateType: string;
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
  optionStats?: { [optionId: string]: number };
}

interface PersonalScoreUpdate {
  participantId: string;
  participantNickname: string;
  previousScore: number;
  newScore: number;
  pointsEarned: number;
  currentRank: number;
  previousRank: number;
  isCorrect: boolean;
  questionId: string;
  streak?: number;
  timeBonus?: number;
}

interface AnswerFeedback {
  participantId: string;
  questionId: string;
  selectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
  pointsEarned: number;
  timeTaken: number;
  newTotalScore: number;
  currentRank: number;
  explanation: string;
  timeBonus?: number;
  streak?: number;
  encouragementMessage?: string;
}

// Configuration
const WEBSOCKET_CONFIG = {
  url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:9999/ws",
  reconnectDelay: 3000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
  maxReconnectAttempts: 5,
};

// Utility function for safe JSON parsing
const safeJsonParse = (jsonString: string, fallback: any = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("JSON parse error:", error);
    return fallback;
  }
};

// ===== LIVE RANKING COMPONENT (Always Visible) =====
function LiveRankingPanel({ 
  personalScore, 
  personalRank, 
  nickname, 
  leaderboard, 
  currentParticipantId,
  isMinimized = false,
  streak = 0
}: { 
  personalScore: number,
  personalRank: number,
  nickname: string,
  leaderboard: LeaderboardEntry[],
  currentParticipantId: string,
  isMinimized?: boolean,
  streak?: number
}) {
  const [showFull, setShowFull] = useState(!isMinimized);
  const topEntries = leaderboard.slice(0, 5);

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-4 right-4 bg-white rounded-xl shadow-lg p-3 z-40 border-2 border-purple-200 cursor-pointer"
        onClick={() => setShowFull(true)}
      >
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">#{personalRank}</div>
          <div className="text-sm text-gray-600">{personalScore.toLocaleString()}</div>
          <div className="text-xs text-gray-500 truncate max-w-20">{nickname}</div>
          {streak > 1 && (
            <div className="text-xs text-orange-600 font-bold">🔥 {streak}</div>
          )}
          <div className="text-xs text-purple-500 mt-1">👆 Tap to expand</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-4 right-4 bg-white rounded-xl shadow-2xl p-4 max-w-sm z-40 border-2 border-purple-200"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <span className="mr-2">🏆</span>
          Live Rankings
        </h3>
        <button 
          onClick={() => setShowFull(false)}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ✕
        </button>
      </div>

      {/* Your Current Position - Always Highlighted */}
      <motion.div
        key={personalScore}
        initial={{ scale: 1.05, backgroundColor: "#fef3c7" }}
        animate={{ scale: 1, backgroundColor: "#f3f4f6" }}
        transition={{ duration: 0.5 }}
        className="mb-3 p-3 rounded-lg border-2 border-purple-300 bg-purple-50"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-purple-600">#{personalRank}</span>
            <span className="font-semibold text-gray-800">You</span>
            <span className="text-xs text-gray-500">({nickname})</span>
            {streak > 1 && (
              <span className="text-xs text-orange-600 font-bold bg-orange-100 px-2 py-1 rounded-full">
                🔥 {streak} streak
              </span>
            )}
          </div>
          <span className="text-xl font-bold text-purple-600">
            {personalScore.toLocaleString()}
          </span>
        </div>
      </motion.div>

      {/* Top Players */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {topEntries.map((entry, index) => {
          const isCurrentUser = entry.participantId === currentParticipantId;
          
          if (isCurrentUser) return null; // Already shown above
          
          return (
            <motion.div
              key={entry.participantId}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex justify-between items-center p-2 rounded-lg transition-all ${
                index < 3 ? "bg-gradient-to-r from-yellow-50 to-orange-50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-bold ${
                  index === 0 ? "text-yellow-600" :
                  index === 1 ? "text-gray-600" :
                  index === 2 ? "text-orange-600" :
                  "text-gray-500"
                }`}>
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`}
                </span>
                <span className="font-medium text-gray-800 text-sm truncate max-w-20">
                  {entry.nickname}
                </span>
                {entry.streak && entry.streak > 1 && (
                  <span className="text-xs text-orange-600">🔥{entry.streak}</span>
                )}
              </div>
              <div className="text-right">
                <motion.span
                  key={entry.totalScore}
                  initial={{ scale: 1.2, color: "#10b981" }}
                  animate={{ scale: 1, color: "#6b7280" }}
                  transition={{ duration: 0.5 }}
                  className="font-bold text-sm"
                >
                  {entry.totalScore.toLocaleString()}
                </motion.span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-3 text-xs text-gray-500 text-center">
        {leaderboard.length} participants • Updates live
      </div>
    </motion.div>
  );
}

// ===== ENHANCED QUESTION TIMER COMPONENT =====
function QuestionTimer({ 
  timeRemaining, 
  timeLimit, 
  isActive, 
  onTimeUp,
  showWarning = true,
  serverTime = null
}: { 
  timeRemaining: number, 
  timeLimit: number, 
  isActive: boolean,
  onTimeUp: () => void,
  showWarning?: boolean,
  serverTime?: number | null
}) {
  const percentage = (timeRemaining / timeLimit) * 100;
  const isWarning = timeRemaining <= 5;
  const isCritical = timeRemaining <= 3;

  useEffect(() => {
    if (timeRemaining === 0 && isActive) {
      onTimeUp();
    }
  }, [timeRemaining, isActive, onTimeUp]);

  return (
    <div className="relative">
      {/* Main Timer Display */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: isCritical ? [1, 1.1, 1] : 1, 
          opacity: 1 
        }}
        transition={{ 
          scale: { duration: 0.5, repeat: isCritical ? Infinity : 0 },
          opacity: { duration: 0.3 }
        }}
        className={`relative w-24 h-24 mx-auto mb-4 ${
          isCritical ? "animate-pulse" : ""
        }`}
      >
        {/* Background Circle */}
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke={
              isCritical ? "#ef4444" : 
              isWarning ? "#f59e0b" : 
              "#10b981"
            }
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - percentage / 100) }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>
        
        {/* Timer Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            key={timeRemaining}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className={`text-2xl font-bold ${
              isCritical ? "text-red-500" : 
              isWarning ? "text-yellow-500" : 
              "text-white"
            }`}
          >
            {timeRemaining}
          </motion.span>
        </div>
      </motion.div>

      {/* Warning Messages */}
      {showWarning && isWarning && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className={`text-sm font-semibold ${
            isCritical ? "text-red-400" : "text-yellow-400"
          }`}>
            {isCritical ? "⚠️ Time s almost up!" : "⏰ Hurry up!"}
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ===== ENHANCED ANSWER REVEAL COMPONENT =====
function AnswerRevealPanel({ 
  question, 
  selectedOptionId, 
  correctOptionId, 
  answerFeedback, 
  questionStats,
  onContinue 
}: {
  question: any,
  selectedOptionId: string | null,
  correctOptionId: string | null,
  answerFeedback: AnswerFeedback | null,
  questionStats: QuestionStats | null,
  onContinue: () => void
}) {
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    // Show stats after a delay
    const timer = setTimeout(() => setShowStats(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!question || !answerFeedback) return null;

  const isCorrect = answerFeedback.isCorrect;
  const pointsEarned = answerFeedback.pointsEarned;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl w-full space-y-6"
    >
      {/* Result Header */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className={`text-8xl mb-4 ${isCorrect ? "text-green-400" : "text-red-400"}`}
        >
          {isCorrect ? "✅" : "❌"}
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`text-4xl font-bold mb-2 ${
            isCorrect ? "text-green-400" : "text-red-400"
          }`}
        >
          {isCorrect ? "Correct!" : "Incorrect"}
        </motion.h1>

        {/* Points Earned */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, type: "spring", stiffness: 300 }}
          className="text-white text-2xl font-bold"
        >
          {pointsEarned > 0 ? `+${pointsEarned} points` : "0 points"}
          {answerFeedback.timeBonus && answerFeedback.timeBonus > 0 && (
            <span className="text-yellow-400 ml-2">⚡ +{answerFeedback.timeBonus} speed bonus</span>
          )}
        </motion.div>

        {/* Streak Display */}
        {answerFeedback.streak && answerFeedback.streak > 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, type: "spring", stiffness: 300 }}
            className="text-orange-400 text-xl font-bold mt-2"
          >
            🔥 {answerFeedback.streak} answer streak!
          </motion.div>
        )}

        {/* Encouragement Message */}
        {answerFeedback.encouragementMessage && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="text-white text-lg mt-2"
          >
            {answerFeedback.encouragementMessage}
          </motion.p>
        )}
      </motion.div>

      {/* Answer Options with Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {(question.options || []).map((option: any, index: number) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = correctOptionId === option.id;
          const participantCount = questionStats?.optionStats?.[option.id] || 0;
          const totalParticipants = questionStats?.totalParticipants || 1;
          const percentage = Math.round((participantCount / totalParticipants) * 100);

          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 + index * 0.1 }}
              className={`relative p-6 rounded-xl border-2 transition-all duration-500 ${
                isCorrect
                  ? "bg-green-100 border-green-500 text-green-800"
                  : isSelected
                  ? "bg-red-100 border-red-500 text-red-800"
                  : "bg-gray-100 border-gray-300 text-gray-600"
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  isCorrect
                    ? "bg-green-500 text-white"
                    : isSelected
                    ? "bg-red-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="font-semibold text-lg">{option.text || option.optionText}</span>
                {isSelected && <span className="text-sm font-bold">← Your answer</span>}
                {isCorrect && <span className="text-sm font-bold">✓ Correct</span>}
              </div>

              {/* Answer Statistics */}
              {showStats && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ delay: 2 + index * 0.1 }}
                  className="mt-3"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Participants who chose this:</span>
                    <span className="text-sm font-bold">{participantCount} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 2.2 + index * 0.1, duration: 0.8 }}
                      className={`h-2 rounded-full ${
                        isCorrect ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Explanation */}
      {answerFeedback.explanation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          className="bg-blue-100 border border-blue-300 rounded-xl p-6 text-center"
        >
          <h3 className="text-lg font-bold text-blue-800 mb-2">💡 Explanation</h3>
          <p className="text-blue-700">{answerFeedback.explanation}</p>
        </motion.div>
      )}

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3 }}
        className="text-center"
      >
        <button
          onClick={onContinue}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
        >
          Continue ➡️
        </button>
      </motion.div>
    </motion.div>
  );
}

// ===== ENHANCED WEBSOCKET HOOK =====
function useParticipantWebSocket(
  quizCode: string,
  participantId: string,
  nickname: string,
  avatarId: string,
  onGameState: (msg: any) => void,
  onQuestion: (msg: any) => void,
  onCompletion: (msg: any) => void,
  onLeaderboardUpdate: (leaderboard: LeaderboardEntry[]) => void,
  onScoreCelebration: (celebration: ScoreCelebration) => void,
  onRankUpdate: (rankUpdate: ParticipantRankUpdate) => void,
  onQuestionStats: (stats: QuestionStats) => void,
  onPersonalScoreUpdate: (scoreUpdate: PersonalScoreUpdate) => void,
  onAnswerFeedback: (feedback: AnswerFeedback) => void
) {
  const stompRef = useRef<Client | null>(null);
  const questionStartTimeRef = useRef<number>(0);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  // Use refs to store callbacks to prevent reconnection
  const onGameStateRef = useRef(onGameState);
  const onQuestionRef = useRef(onQuestion);
  const onCompletionRef = useRef(onCompletion);
  const onLeaderboardUpdateRef = useRef(onLeaderboardUpdate);
  const onScoreCelebrationRef = useRef(onScoreCelebration);
  const onRankUpdateRef = useRef(onRankUpdate);
  const onQuestionStatsRef = useRef(onQuestionStats);
  const onPersonalScoreUpdateRef = useRef(onPersonalScoreUpdate);
  const onAnswerFeedbackRef = useRef(onAnswerFeedback);

  // Update refs when callbacks change
  useEffect(() => {
    onGameStateRef.current = onGameState;
    onQuestionRef.current = onQuestion;
    onCompletionRef.current = onCompletion;
    onLeaderboardUpdateRef.current = onLeaderboardUpdate;
    onScoreCelebrationRef.current = onScoreCelebration;
    onRankUpdateRef.current = onRankUpdate;
    onQuestionStatsRef.current = onQuestionStats;
    onPersonalScoreUpdateRef.current = onPersonalScoreUpdate;
    onAnswerFeedbackRef.current = onAnswerFeedback;
  }, [onGameState, onQuestion, onCompletion, onLeaderboardUpdate, onScoreCelebration, onRankUpdate, onQuestionStats, onPersonalScoreUpdate, onAnswerFeedback]);

  const connect = useCallback(() => {
    if (!quizCode || !nickname || !participantId) return;

    try {
      const sock = new SockJS(WEBSOCKET_CONFIG.url);
      const stomp = new Client({
        webSocketFactory: () => sock,
        reconnectDelay: WEBSOCKET_CONFIG.reconnectDelay,
        heartbeatIncoming: WEBSOCKET_CONFIG.heartbeatIncoming,
        heartbeatOutgoing: WEBSOCKET_CONFIG.heartbeatOutgoing,
        debug: (str) => console.log("[STOMP]", str),
        connectHeaders: {
          participantId: participantId,
        },
      });

      stomp.onConnect = () => {
        console.log("✅ WebSocket connected for participant:", nickname);
        setConnectionStatus("Connected");
        setReconnectAttempts(0);
        
        // Core game subscriptions with enhanced error handling
        const subscriptions = [
          stomp.subscribe(`/topic/session/${quizCode}/game-state`, (msg) => {
            const data = safeJsonParse(msg.body);
            if (data) {
              console.log("📢 Game state received:", data);
              onGameStateRef.current(data);
            }
          }),
          
          // Participant-specific question queue
          stomp.subscribe(`/user/queue/session/${quizCode}/question`, (msg) => {
            const message = safeJsonParse(msg.body);
            if (message) {
              console.log("❓ Participant-specific question received:", message);
              
              if (message.action === "NEXT_QUESTION" || message.question) {
                questionStartTimeRef.current = Date.now();
                onQuestionRef.current(message);
              } else if (message.action === "PARTICIPANT_COMPLETED") {
                onCompletionRef.current(message);
              }
            }
          }),

          // Broadcast questions for SYNC mode
          stomp.subscribe(`/topic/session/${quizCode}/question`, (msg) => {
            const message = safeJsonParse(msg.body);
            if (message) {
              console.log("❓ Broadcast question received:", message);
              questionStartTimeRef.current = Date.now();
              onQuestionRef.current(message);
            }
          }),

          // Enhanced leaderboard updates
          stomp.subscribe(`/topic/session/${quizCode}/leaderboard`, (msg) => {
            const data = safeJsonParse(msg.body);
            if (data) {
              console.log("🏆 Leaderboard update received:", data);
              
              let entries: LeaderboardEntry[] = [];
              if (data.leaderboard?.entries) {
                entries = data.leaderboard.entries;
              } else if (data.entries) {
                entries = data.entries;
              } else if (Array.isArray(data)) {
                entries = data;
              }
              
              if (Array.isArray(entries)) {
                onLeaderboardUpdateRef.current(entries);
              }
            }
          }),

          // Score celebrations
          stomp.subscribe(`/topic/session/${quizCode}/celebration`, (msg) => {
            const celebration = safeJsonParse(msg.body);
            if (celebration && celebration.participantId) {
              console.log("🎉 Score celebration received:", celebration);
              onScoreCelebrationRef.current(celebration);
            }
          }),

          // Personal rank updates
          stomp.subscribe(`/user/queue/session/${quizCode}/ranking`, (msg) => {
            const rankUpdate = safeJsonParse(msg.body);
            if (rankUpdate && rankUpdate.participantId) {
              console.log("📈 Rank update received:", rankUpdate);
              onRankUpdateRef.current(rankUpdate);
            }
          }),

          // Question statistics
          stomp.subscribe(`/topic/session/${quizCode}/live-stats`, (msg) => {
            const stats = safeJsonParse(msg.body);
            if (stats) {
              console.log("📊 Question stats received:", stats);
              onQuestionStatsRef.current(stats);
            }
          }),

          // Personal score updates
          stomp.subscribe(`/user/queue/session/${quizCode}/score`, (msg) => {
            const scoreUpdate = safeJsonParse(msg.body);
            if (scoreUpdate && scoreUpdate.participantId) {
              console.log("💰 Personal score update received:", scoreUpdate);
              onPersonalScoreUpdateRef.current(scoreUpdate);
            }
          }),

          // Enhanced answer feedback - FIXED INTEGRATION
          stomp.subscribe(`/user/queue/session/${quizCode}/feedback`, (msg) => {
            const feedback = safeJsonParse(msg.body);
            if (feedback && feedback.participantId) {
              console.log("📝 Answer feedback received:", feedback);
              onAnswerFeedbackRef.current(feedback);
            }
          }),
        ];

        console.log("✅ WebSocket connected - all subscriptions ready");
      };

      stomp.onStompError = (frame) => {
        console.error("❌ STOMP error:", frame.headers?.message || frame.body);
        setConnectionStatus("Error");
        
        // Retry connection if not exceeded max attempts
        if (reconnectAttempts < WEBSOCKET_CONFIG.maxReconnectAttempts) {
          setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, WEBSOCKET_CONFIG.reconnectDelay);
        }
      };

      stomp.onDisconnect = () => {
        console.warn("⚠️ WebSocket disconnected");
        setConnectionStatus("Disconnected");
      };

      stomp.activate();
      stompRef.current = stomp;
    } catch (error) {
      console.error("❌ WebSocket setup error:", error);
      setConnectionStatus("Error");
    }
  }, [quizCode, participantId, nickname, avatarId, reconnectAttempts]);

  useEffect(() => {
    connect();
    
    return () => {
      console.log("🔌 Disconnecting WebSocket");
      stompRef.current?.deactivate();
    };
  }, [connect]);

  const sendAnswer = useCallback(
    (optionId: string, questionId: string) => {
      if (!stompRef.current?.connected) {
        console.error("⚠️ WebSocket not connected");
        return false;
      }
      
      const responseTime = Math.floor((Date.now() - questionStartTimeRef.current) / 1000);
      
      const answerPayload = {
        participantId,
        questionId,
        selectedOptionId: optionId,
        responseTime,
      };
      
      console.log("📤 Sending answer:", answerPayload);
      
      try {
        stompRef.current.publish({
          destination: `/app/session/${quizCode}/answer`,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(answerPayload),
        });
        return true;
      } catch (error) {
        console.error("❌ Failed to send answer:", error);
        return false;
      }
    },
    [quizCode, participantId]
  );

  return { sendAnswer, connectionStatus };
}

// ===== MAIN COMPONENT =====
export default function ParticipantQuizFixed() {
  const params = useParams();
  const sessionCode = params?.sessionCode as string;

  // Join form state
  const [joined, setJoined] = useState(false);
  const [nickname, setNickname] = useState("");
  const [avatarId, setAvatarId] = useState("");
  const [participantId, setParticipantId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Game state
  const [gameState, setGameState] = useState<any>(null);
  const [status, setStatus] = useState<"LOBBY" | "COUNTDOWN" | "PLAY" | "ANSWER_REVEAL" | "RESULTS" | "COMPLETED" | "END">("LOBBY");
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [answerSelected, setAnswerSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  // Enhanced real-time state
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [celebrations, setCelebrations] = useState<ScoreCelebration[]>([]);
  const [currentCelebration, setCurrentCelebration] = useState<ScoreCelebration | null>(null);
  const [rankUpdate, setRankUpdate] = useState<ParticipantRankUpdate | null>(null);
  const [questionStats, setQuestionStats] = useState<QuestionStats | null>(null);
  
  // Enhanced personal stats
  const [personalScore, setPersonalScore] = useState<number>(0);
  const [personalRank, setPersonalRank] = useState<number>(0);
  const [scoreChange, setScoreChange] = useState<number | undefined>(undefined);
  const [answerFeedback, setAnswerFeedback] = useState<AnswerFeedback | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  // Handle join submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    
    if (!nickname.trim()) {
      return setError("Nickname is required");
    }
    if (!avatarId.trim()) {
      return setError("Avatar ID is required");
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post("http://localhost:9999/api/v1/participants/join", {
        quizCode: sessionCode,
        nickname: nickname.trim(),
        avatarId: avatarId.trim(),
      });

      console.log("✅ Successfully joined:", res.data);
      setParticipantId(res.data.id);
      setPersonalScore(res.data.totalScore || 0);
      setJoined(true);
    } catch (err: any) {
      console.error("❌ Join failed:", err);
      setError(err.response?.data?.message || "Failed to join session. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Enhanced WebSocket connection with all callbacks
  const { sendAnswer, connectionStatus } = useParticipantWebSocket(
    joined ? (sessionCode as string) : "",
    joined ? participantId : "",
    joined ? nickname : "",
    joined ? avatarId : "",
    (msg) => {
      console.log("📢 Game state update:", msg);
      setGameState(msg);
    },
    (qmsg) => {
      console.log("❓ New question received:", qmsg);
      
      const question = qmsg.question || qmsg;
      const qNumber = qmsg.questionNumber || qmsg.currentQuestion || 0;
      const total = qmsg.totalQuestions || 0;
      const timeLimit = qmsg.timeLimit || 30;
      
      setCurrentQuestion(question);
      setQuestionNumber(qNumber);
      setTotalQuestions(total);
      setTimeLeft(timeLimit);
      setAnswerSelected(null);
      setFeedback(null);
      setShowFeedback(false);
      setAnswerFeedback(null);
      setIsSubmittingAnswer(false);  // FIXED: Reset submitting state for new question
      setStatus("PLAY");
    },
    (cmsg) => {
      console.log("🎉 Completion message received:", cmsg);
      setStatus("COMPLETED");
    },
    // Leaderboard update callback
    (leaderboardEntries) => {
      console.log("🏆 Updating leaderboard:", leaderboardEntries);
      setLeaderboard(leaderboardEntries);
      
      // Update personal rank from leaderboard
      const currentParticipant = leaderboardEntries.find(entry => entry.participantId === participantId);
      if (currentParticipant) {
        setPersonalRank(currentParticipant.position);
        setPersonalScore(currentParticipant.totalScore);
        if (currentParticipant.streak) {
          setStreak(currentParticipant.streak);
        }
      }
    },
    // Score celebration callback
    (celebration) => {
      console.log("🎉 Score celebration:", celebration);
      setCelebrations(prev => [...prev, celebration]);
      
      if (celebration.participantId === participantId) {
        setCurrentCelebration(celebration);
        setPersonalScore(celebration.newTotalScore);
        setPersonalRank(celebration.newRank);
      }
      
      setTimeout(() => {
        setCelebrations(prev => prev.filter(c => c.participantId !== celebration.participantId));
      }, 3000);
    },
    // Rank update callback
    (rankUpdate) => {
      console.log("📈 Rank update:", rankUpdate);
      if (rankUpdate.participantId === participantId) {
        setRankUpdate(rankUpdate);
        setPersonalRank(rankUpdate.currentRank);
        setPersonalScore(rankUpdate.currentScore);
        setTimeout(() => setRankUpdate(null), 3000);
      }
    },
    // Question stats callback
    (stats) => {
      console.log("📊 Question stats:", stats);
      setQuestionStats(stats);
    },
    // Personal score update callback
    (scoreUpdate) => {
      console.log("💰 Personal score update:", scoreUpdate);
      if (scoreUpdate.participantId === participantId) {
        setPersonalScore(scoreUpdate.newScore);
        setPersonalRank(scoreUpdate.currentRank);
        
        if (scoreUpdate.pointsEarned !== 0) {
          setScoreChange(scoreUpdate.pointsEarned);
          setTimeout(() => setScoreChange(undefined), 2000);
        }

        if (scoreUpdate.streak) {
          setStreak(scoreUpdate.streak);
        }
      }
    },
    // FIXED: Answer feedback callback - now properly integrated
    (feedback) => {
      console.log("📝 Answer feedback received:", feedback);
      if (feedback.participantId === participantId) {
        setAnswerFeedback(feedback);
        setPersonalScore(feedback.newTotalScore);
        setPersonalRank(feedback.currentRank);
        
        if (feedback.streak) {
          setStreak(feedback.streak);
        }
        
        // Transition to answer reveal phase
        setStatus("ANSWER_REVEAL");
        setIsSubmittingAnswer(false);
      }
    }
  );

  // Handle game state changes
  useEffect(() => {
    if (!gameState) return;
    
    console.log("Processing game state:", gameState.action, gameState.status);
    
    if (gameState.action === "SESSION_STARTED" || gameState.status === "IN_PROGRESS") {
      if (!currentQuestion && status !== "ANSWER_REVEAL") {
        setStatus("PLAY");
      }
    } else if (gameState.action === "SESSION_ENDED" || gameState.status === "ENDED") {
      setStatus("END");
    } else if (gameState.action === "SESSION_LOBBY" || gameState.status === "WAITING") {
      setStatus("LOBBY");
    }
  }, [gameState, currentQuestion, status]);

  // Enhanced timer countdown with server sync
  useEffect(() => {
    if (timeLeft > 0 && status === "PLAY" && currentQuestion && !answerSelected && !showFeedback && !isSubmittingAnswer) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && status === "PLAY" && !answerSelected && !isSubmittingAnswer) {
      handleTimeUp();
    }
  }, [timeLeft, status, currentQuestion, answerSelected, showFeedback, isSubmittingAnswer]);

  // Handle time up
  function handleTimeUp() {
    console.log("⏰ Time s up!");
    setShowFeedback(true);
    setFeedback({ timeUp: true });
    // Don't transition to answer reveal yet - wait for server feedback
  }

  // Enhanced answer handling
  function handleAnswer(optionId: string) {
    if (!currentQuestion || answerSelected || showFeedback || isSubmittingAnswer) {
      console.warn("⚠️ Cannot answer: already answered or submitting");
      return;
    }
    
    console.log("✅ Answering question:", currentQuestion.id, "with option:", optionId);
    setAnswerSelected(optionId);
    setIsSubmittingAnswer(true);
    
    const success = sendAnswer(optionId, currentQuestion.id);
    if (success) {
      setShowFeedback(true);
      setFeedback({ submitted: true });
    } else {
      // Reset if sending failed
      setAnswerSelected(null);
      setIsSubmittingAnswer(false);
      setError("Failed to submit answer. Please try again.");
    }
  }

  // Handle continue from answer reveal
  function handleContinueFromReveal() {
    setStatus("PLAY");
    setAnswerFeedback(null);
    setAnswerSelected(null);
    setShowFeedback(false);
    setFeedback(null);
  }

  // Join form UI
  if (!joined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-800 to-indigo-900 p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-6">
            <motion.h1 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-indigo-800 mb-2"
            >
              🎮 Join Quiz
            </motion.h1>
            <p className="text-gray-600">
              Session Code: <span className="font-mono font-bold text-purple-600">{sessionCode}</span>
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nickname
              </label>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter your nickname"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                maxLength={20}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avatar ID
              </label>
              <input
                value={avatarId}
                onChange={(e) => setAvatarId(e.target.value)}
                placeholder="Enter avatar ID (UUID)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Example: 550e8400-e29b-41d4-a716-446655440000</p>
            </div>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-600 text-sm">{error}</p>
              </motion.div>
            )}
            
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg transition-all duration-200"
            >
              {isSubmitting ? "Joining..." : "🚀 Join Quiz"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Connection status indicator
  const connectionIndicator = connectionStatus !== "Connected" && (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 p-3 text-center text-white font-semibold ${
        connectionStatus === "Connecting..." ? "bg-yellow-600" :
        connectionStatus === "Disconnected" ? "bg-red-600" :
        "bg-red-700"
      }`}
    >
      {connectionStatus === "Connecting..." && "🔄 Connecting..."}
      {connectionStatus === "Disconnected" && "⚠️ Connection lost - Reconnecting..."}
      {connectionStatus === "Error" && "❌ Connection error - Please refresh"}
    </motion.div>
  );

  // Quiz ended
  if (status === "END") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative">
        {connectionIndicator}
        <div className="text-center z-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-8xl mb-6"
          >
            🏆
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold mb-4"
          >
            Quiz Ended
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl mb-8"
          >
            Thanks for playing, {nickname}!
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white bg-opacity-20 rounded-lg p-6 max-w-md mx-auto"
          >
            <p className="text-lg">Final Score: {personalScore.toLocaleString()}</p>
            <p className="text-lg">Final Rank: #{personalRank}</p>
            {streak > 1 && <p className="text-lg">Best Streak: 🔥 {streak}</p>}
          </motion.div>
        </div>
        
        <LiveRankingPanel 
          personalScore={personalScore}
          personalRank={personalRank}
          nickname={nickname}
          leaderboard={leaderboard}
          currentParticipantId={participantId}
          isMinimized={false}
          streak={streak}
        />
      </div>
    );
  }

  // Participant completed
  if (status === "COMPLETED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white relative">
        {connectionIndicator}
        <div className="text-center max-w-2xl px-6 z-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-8xl mb-6"
          >
            🎉
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold mb-4"
          >
            Congratulations!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl mb-4"
          >
            You ve completed all questions!
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white bg-opacity-20 rounded-lg p-6 mt-8"
          >
            <p className="text-xl mb-4">Your Score: {personalScore.toLocaleString()}</p>
            <p className="text-xl mb-4">Your Rank: #{personalRank}</p>
            {streak > 1 && <p className="text-xl mb-4">Final Streak: 🔥 {streak}</p>}
            <p className="text-lg">Waiting for other participants to finish...</p>
          </motion.div>
        </div>
        
        <LiveRankingPanel 
          personalScore={personalScore}
          personalRank={personalRank}
          nickname={nickname}
          leaderboard={leaderboard}
          currentParticipantId={participantId}
          isMinimized={false}
          streak={streak}
        />
      </div>
    );
  }

  // Waiting in lobby
  if (status === "LOBBY") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-800 to-indigo-900 text-white relative">
        {connectionIndicator}
        <div className="text-center max-w-2xl px-6 z-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-6xl mb-6"
          >
            🎮
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            Welcome, {nickname}!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8"
          >
            Waiting for the quiz to start...
          </motion.p>
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl"
          >
            🕐 Get ready!
          </motion.div>
        </div>
        
        {leaderboard.length > 0 && (
          <LiveRankingPanel 
            personalScore={personalScore}
            personalRank={personalRank}
            nickname={nickname}
            leaderboard={leaderboard}
            currentParticipantId={participantId}
            isMinimized={true}
            streak={streak}
          />
        )}
      </div>
    );
  }

  // Playing - waiting for question
  if (status === "PLAY" && !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-800 to-indigo-900 text-white relative">
        {connectionIndicator}
        <div className="text-center max-w-2xl px-6 z-10">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-6xl mb-6"
          >
            🕐
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-4"
          >
            Get Ready!
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl"
          >
            Your next question is loading...
          </motion.p>
        </div>
        
        <LiveRankingPanel 
          personalScore={personalScore}
          personalRank={personalRank}
          nickname={nickname}
          leaderboard={leaderboard}
          currentParticipantId={participantId}
          isMinimized={true}
          streak={streak}
        />
      </div>
    );
  }

  // ENHANCED: Answer reveal phase - NEW KAHOOT-STYLE FEATURE
  if (status === "ANSWER_REVEAL" && answerFeedback) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-purple-800 to-indigo-900 py-8 px-4 relative">
        {connectionIndicator}
        
        <AnswerRevealPanel
          question={currentQuestion}
          selectedOptionId={answerSelected}
          correctOptionId={answerFeedback.correctOptionId}
          answerFeedback={answerFeedback}
          questionStats={questionStats}
          onContinue={handleContinueFromReveal}
        />
        
        <LiveRankingPanel 
          personalScore={personalScore}
          personalRank={personalRank}
          nickname={nickname}
          leaderboard={leaderboard}
          currentParticipantId={participantId}
          isMinimized={true}
          streak={streak}
        />
      </div>
    );
  }

  // Playing - showing question
  if (status === "PLAY" && currentQuestion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-purple-800 to-indigo-900 py-8 px-4 relative">
        {connectionIndicator}
        
        <div className="max-w-4xl w-full space-y-6 z-10">
          {/* Enhanced Timer */}
          <QuestionTimer 
            timeRemaining={timeLeft}
            timeLimit={30}
            isActive={!answerSelected && !showFeedback && !isSubmittingAnswer}
            onTimeUp={handleTimeUp}
          />

          {/* Question Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h2 className="text-lg font-semibold mb-2">
              Question {questionNumber} of {totalQuestions}
            </h2>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {currentQuestion.text || currentQuestion.questionText}
            </h1>
          </motion.div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(currentQuestion.options || []).map((option: any, index: number) => {
              const isSelected = answerSelected === option.id;
              const isDisabled = answerSelected !== null || showFeedback || isSubmittingAnswer;
              
              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={!isDisabled ? { scale: 1.02 } : {}}
                  whileTap={!isDisabled ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswer(option.id)}
                  disabled={isDisabled}
                  className={`p-6 rounded-xl text-left font-semibold text-lg transition-all duration-200 ${
                    isSelected
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg transform scale-105"
                      : isDisabled
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-50 text-gray-800 hover:bg-gray-100 hover:shadow-md border-2 border-transparent hover:border-purple-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      isSelected ? "bg-white text-purple-600" : "bg-purple-100 text-purple-600"
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option.text || option.optionText}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Enhanced Feedback */}
          {showFeedback && feedback?.submitted && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center"
            >
              <p className="text-blue-800 font-semibold">
                {isSubmittingAnswer ? "📤 Submitting answer..." : "✅ Answer submitted!"}
              </p>
              <p className="text-blue-600 text-sm mt-1">Waiting for results...</p>
            </motion.div>
          )}

          {/* Time up feedback */}
          {showFeedback && feedback?.timeUp && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center"
            >
              <p className="text-red-800 font-semibold">⏰ Time s up!</p>
              <p className="text-red-600 text-sm mt-1">No answer submitted</p>
            </motion.div>
          )}
        </div>

        {/* Live Ranking */}
        <LiveRankingPanel 
          personalScore={personalScore}
          personalRank={personalRank}
          nickname={nickname}
          leaderboard={leaderboard}
          currentParticipantId={participantId}
          isMinimized={true}
          streak={streak}
        />

        {/* Enhanced Score Change Animation */}
        <AnimatePresence>
          {scoreChange && scoreChange !== 0 && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.5 }}
              animate={{ opacity: 1, y: -100, scale: 1 }}
              exit={{ opacity: 0, y: -150, scale: 0.5 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            >
              <div className={`text-4xl font-bold ${
                scoreChange > 0 ? "text-green-400" : "text-red-400"
              }`}>
                {scoreChange > 0 ? "+" : ""}{scoreChange}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Rank Update Notification */}
        {rankUpdate && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-20 right-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-lg shadow-lg z-50"
          >
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📈</span>
              <div>
                <p className="font-bold">Rank Update!</p>
                <p className="text-sm">
                  You re now #{rankUpdate.currentRank}
                  {rankUpdate.currentRank < rankUpdate.previousRank && (
                    <span className="ml-1 text-green-300">↑ +{rankUpdate.previousRank - rankUpdate.currentRank}</span>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return null;
}
