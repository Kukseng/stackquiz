
"use client";
import React, { useCallback, useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
// import SessionReportView from './SessionReportView';
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";

// --- Quiz Settings Modal ---
function QuizSettingsModal({ isOpen, onClose, onStart }: any) {
  const [settings, setSettings] = useState({
    mode: "ASYNC", //  FIXED: Added mode field with default value
    scheduledStartTime: "",
    scheduledEndTime: "",
    maxAttempts: 1,
    allowJoinInProgress: false,
    shuffleQuestions: false,
    showCorrectAnswers: true,
    defaultQuestionTimeLimit: 30,
    maxParticipants: 100,
  });

  if (!isOpen) return null;

  const handleStart = () => {
    onStart(settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Quiz Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quiz Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Quiz Mode
            </label>
            <select
              value={settings.mode}
              onChange={(e) => setSettings({ ...settings, mode: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="SYNC">Synchronous (host-paced)</option>
              <option value="ASYNC">Asynchronous (self-paced)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {settings.mode === "SYNC" 
                ? "Host controls question progression for all participants" 
                : "Participants progress at their own pace"}
            </p>
          </div>

          {/* Time Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Time Settings</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Scheduled Start Time
              </label>
              <input
                type="datetime-local"
                value={settings.scheduledStartTime}
                onChange={(e) => setSettings({...settings, scheduledStartTime: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Scheduled End Time
              </label>
              <input
                type="datetime-local"
                value={settings.scheduledEndTime}
                onChange={(e) => setSettings({...settings, scheduledEndTime: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Participation Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Participation</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Max Attempts per Participant
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.maxAttempts}
                onChange={(e) => setSettings({...settings, maxAttempts: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Max Participants
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={settings.maxParticipants}
                onChange={(e) => setSettings({...settings, maxParticipants: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Default Question Time Limit (seconds)
              </label>
              <input
                type="number"
                min="5"
                max="300"
                value={settings.defaultQuestionTimeLimit}
                onChange={(e) => setSettings({...settings, defaultQuestionTimeLimit: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.allowJoinInProgress}
              onChange={(e) => setSettings({...settings, allowJoinInProgress: e.target.checked})}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Allow join in progress</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.shuffleQuestions}
              onChange={(e) => setSettings({...settings, shuffleQuestions: e.target.checked})}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Shuffle questions</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.showCorrectAnswers}
              onChange={(e) => setSettings({...settings, showCorrectAnswers: e.target.checked})}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Show correct answers</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Participant Progress ---
function ParticipantProgress({ participants }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Participant Progress ({participants.length})
      </h2>
      {participants.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {participants.map((p: any, idx: number) => (
            <div key={p.id || idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {p.nickname?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div>
                  <span className="font-medium text-gray-800">{p.nickname}</span>
                  <div className="text-xs text-gray-500">
                    Question {p.currentQuestion || 0} of {p.totalQuestions || 0}
                  </div>
                  {/* Progress bar */}
                  <div className="w-32 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 transition-all duration-300"
                      style={{ 
                        width: `${((p.currentQuestion || 0) / (p.totalQuestions || 1)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-purple-600 text-lg">{p.totalScore || 0}</div>
                <div className="text-xs text-gray-500">
                  {p.isCompleted ? " Completed" : "🔄 In Progress"}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400 text-lg">Waiting for participants to join...</p>
          <p className="text-gray-400 text-sm mt-2">Share the session code or QR code above</p>
        </div>
      )}
    </div>
  );
}

// --- Host Dashboard ---
export default function HostDashboard() {
  const [sessionCode, setSessionCode] = useState("ABC123");
  const [sessionId, setSessionId] = useState<string>(""); //  ADDED: Store session ID for report
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [gameState, setGameState] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [participantProgress, setParticipantProgress] = useState<Map<string, any>>(new Map());
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showReport, setShowReport] = useState(false); //  ADDED: Show report modal
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [joinUrl, setJoinUrl] = useState<string>(""); //  FIXED: SSR-safe URL

  const stompRef = useRef<Client | null>(null);

  //  FIXED: Set join URL only on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setJoinUrl(`${window.location.origin}/${sessionCode}/join`);
    }
  }, [sessionCode]);

  // --- WebSocket setup ---
  useEffect(() => {
    try {
      const sock = new SockJS("https://stackquiz-api.stackquiz.me/api/v1/ws");
      const stomp = new Client({
        webSocketFactory: () => sock,
        reconnectDelay: 3000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectHeaders: { nickname: "__HOST__" },
        debug: (str) => console.log("[STOMP]", str), //  FIXED: Added debug logging
      });

      stomp.onConnect = () => {
        console.log(" WebSocket connected");
        setConnectionStatus("Connected");

        //  FIXED: Correct subscription topics matching backend
        stomp.subscribe(`/topic/session/${sessionCode}/game-state`, (msg) => {
          const data = JSON.parse(msg.body);
          console.log("📢 Game state update:", data);
          setGameState(data);
          //  ADDED: Capture session ID for report generation
          if (data.sessionId && !sessionId) {
            setSessionId(data.sessionId);
          }
        });

        stomp.subscribe(`/topic/session/${sessionCode}/leaderboard`, (msg) => {
          const data = JSON.parse(msg.body);
          console.log("📊 Leaderboard update:", data);
          //  FIXED: Handle both possible data structures
          const entries = data.leaderboard?.entries || data.entries || [];
          setLeaderboard(entries);
        });

        stomp.subscribe(`/topic/session/${sessionCode}/participants`, (msg) => {
          const data = JSON.parse(msg.body);
          console.log("👥 Participants update:", data);
          setParticipants(data.participants || []);
        });

        stomp.subscribe(`/topic/session/${sessionCode}/question`, (msg) => {
          const data = JSON.parse(msg.body);
          console.log("❓ Question update:", data);
          setCurrentQuestion(data.question || data);
        });

        //  FIXED: Added participant progress subscription
        stomp.subscribe(`/topic/session/${sessionCode}/participant-progress`, (msg) => {
          const data = JSON.parse(msg.body);
          console.log("📈 Participant progress:", data);
          setParticipantProgress((prev) => {
            const updated = new Map(prev);
            updated.set(data.participantId, data);
            return updated;
          });
          
          // Update participants list with progress
          setParticipants((prev) => 
            prev.map((p) => 
              p.id === data.participantId 
                ? { ...p, currentQuestion: data.currentQuestion, isCompleted: data.isCompleted }
                : p
            )
          );
        });
      };

      stomp.onDisconnect = () => {
        console.warn("⚠️ WebSocket disconnected");
        setConnectionStatus("Disconnected");
      };

      //  FIXED: Added error handling
      stomp.onStompError = (frame) => {
        console.error("❌ STOMP error:", frame);
        setConnectionStatus("Error");
      };

      stomp.activate();
      stompRef.current = stomp;

      return () => {
        console.log("🔌 Disconnecting WebSocket");
        stompRef.current?.deactivate();
      };
    } catch (error) {
      console.error("❌ WebSocket setup error:", error);
      setConnectionStatus("Error");
    }
  }, [sessionCode]);

  // --- Countdown ---
  useEffect(() => {
    if (gameState?.scheduledStartTime) {
      const start = new Date(gameState.scheduledStartTime).getTime();
      const timer = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((start - now) / 1000));
        setCountdown(remaining);
        if (remaining === 0) clearInterval(timer);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState?.scheduledStartTime]);

  //  FIXED: Corrected sendHostCommand to match backend expectations
  const sendHostCommand = useCallback((command: string, data?: any) => {
    if (!stompRef.current?.connected) {
      console.warn("⚠️ Cannot send command - not connected");
      return;
    }
    
    const payload = { 
      command, 
      sessionCode,
      ...data // Spread data directly, not nested
    };
    
    console.log("📤 Sending host command:", payload);
    
    stompRef.current.publish({
      destination: `/app/session/${sessionCode}/host-command`,
      body: JSON.stringify(payload),
    });
  }, [sessionCode]);

  //  FIXED: Start session with correct data structure
  const handleStartSession = useCallback((settings: any) => {
    console.log("🚀 Starting session with settings:", settings);
    // Send settings directly in the command, not nested
    sendHostCommand("START_SESSION", settings);
  }, [sendHostCommand]);

  const sortedLeaderboard = [...leaderboard].sort(
    (a, b) => (b.totalScore || 0) - (a.totalScore || 0)
  );

  //  FIXED: Merge participant progress into participants list
  const participantsWithProgress = participants.map((p) => ({
    ...p,
    ...(participantProgress.get(p.id) || {}),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900">
      {/* Header */}
      <div className="bg-white shadow-lg p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quiz Host Dashboard</h1>
          <div className="flex items-center space-x-2 mt-1">
            <div 
              className={`w-2 h-2 rounded-full ${
                connectionStatus === "Connected" 
                  ? "bg-green-500" 
                  : connectionStatus === "Connecting..." 
                  ? "bg-yellow-500 animate-pulse" 
                  : "bg-red-500"
              }`} 
            />
            <span className="text-sm text-gray-600">{connectionStatus}</span>
          </div>
        </div>
        <div className="bg-purple-100 px-6 py-3 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Session Code</p>
          <input
            value={sessionCode}
            onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
            className="text-2xl font-bold bg-transparent border-none text-center text-purple-700 w-32"
            maxLength={6}
          />
        </div>
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center py-6">
        {joinUrl && <QRCodeCanvas value={joinUrl} size={180} />}
        <p className="mt-3 text-sm text-white bg-black bg-opacity-30 px-4 py-2 rounded-lg">
          Join at <span className="font-mono font-bold">{joinUrl || "Loading..."}</span>
        </p>
      </div>

      {/* Controls */}
      <div className="container mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Host controls */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Host Controls</h2>
            <div className="flex gap-3 flex-wrap">
              <button 
                onClick={() => setShowSettings(true)} 
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={gameState?.sessionStatus === "IN_PROGRESS" || gameState?.sessionStatus === "ENDED"}
              >
                ⚙️ Start Quiz
              </button>
              <button 
                onClick={() => sendHostCommand("NEXT_QUESTION")} 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={gameState?.sessionStatus !== "IN_PROGRESS"}
              >
                ⏭️ Next Question
              </button>
              <button 
                onClick={() => sendHostCommand("PAUSE_SESSION")} 
                className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={gameState?.sessionStatus !== "IN_PROGRESS"}
              >
                ⏸️ Pause
              </button>
              <button 
                onClick={() => sendHostCommand("END_SESSION")} 
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={gameState?.sessionStatus === "ENDED"}
              >
                ⏹️ End Quiz
              </button>
              <button 
                onClick={() => setShowReport(true)} 
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={gameState?.sessionStatus !== "ENDED" || !sessionId}
              >
                📊 View Report
              </button>
            </div>
          </div>

          {/* Game status + current question */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Game Status</h2>
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                gameState?.sessionStatus === "WAITING" ? "bg-yellow-100 text-yellow-800" :
                gameState?.sessionStatus === "IN_PROGRESS" ? "bg-green-100 text-green-800" :
                gameState?.sessionStatus === "ENDED" ? "bg-gray-100 text-gray-800" :
                "bg-blue-100 text-blue-800"
              }`}>
                {gameState?.sessionStatus || "WAITING"}
              </div>
              <span className="text-gray-600">{gameState?.hostMessage || gameState?.message || "Waiting to start..."}</span>
            </div>
            
            {countdown > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <p className="text-yellow-800 font-semibold">⏰ Starting in {countdown} seconds</p>
              </div>
            )}
            
            {currentQuestion && (
              <motion.div 
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-purple-900 text-lg">Current Question:</h3>
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                    Q{currentQuestion.questionNumber || "?"} / {gameState?.totalQuestions || "?"}
                  </span>
                </div>
                <p className="text-gray-800 text-lg">{currentQuestion.text || currentQuestion.questionText}</p>
                {currentQuestion.timeLimit && (
                  <p className="text-sm text-gray-600 mt-2">⏱️ Time limit: {currentQuestion.timeLimit}s</p>
                )}
              </motion.div>
            )}
          </div>

          <ParticipantProgress participants={participantsWithProgress} />
        </div>

        {/* Right column - Leaderboard */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🏆</span> Leaderboard
            </h2>
            {sortedLeaderboard.length > 0 ? (
              <div className="space-y-2">
                {sortedLeaderboard.slice(0, 10).map((entry, index) => (
                  <div 
                    key={entry.participantId || index} 
                    className={`flex justify-between items-center p-3 rounded-lg transition ${
                      index === 0 ? "bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-400" :
                      index === 1 ? "bg-gradient-to-r from-gray-100 to-gray-50 border-2 border-gray-400" :
                      index === 2 ? "bg-gradient-to-r from-orange-100 to-orange-50 border-2 border-orange-400" :
                      "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`font-bold text-lg ${
                        index === 0 ? "text-yellow-600" :
                        index === 1 ? "text-gray-600" :
                        index === 2 ? "text-orange-600" :
                        "text-gray-500"
                      }`}>
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`}
                      </span>
                      <span className="font-medium text-gray-800">{entry.nickname || entry.participantNickname}</span>
                    </div>
                    <span className="font-bold text-purple-600">{entry.totalScore || 0} pts</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-8">No scores yet</p>
            )}
          </div>
        </div>
      </div>

      <QuizSettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        onStart={handleStartSession}
      />

      {/*  ADDED: Session Report Modal */}
      {showReport && sessionId && (
        <SessionReportView 
          sessionId={sessionId} 
          onClose={() => setShowReport(false)} 
        />
      )}
    </div>
  );
}

//  ADDED: Import SessionReportView component
// Note: You need to import this from the SessionReportView.tsx file
// import SessionReportView from './SessionReportView';
// For now, we'll include a placeholder component here

function SessionReportView({ sessionId, onClose }: { sessionId: string; onClose: () => void }) {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://stackquiz-api.stackquiz.me/api/v1/session-reports/${sessionId}`)
      .then(res => res.json())
      .then(data => {
        setReport(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch report:", err);
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <p className="text-red-600">Failed to load report</p>
          <button onClick={onClose} className="mt-4 bg-gray-600 text-white px-4 py-2 rounded">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">📊 Session Report</h1>
              <p className="text-purple-100">{report.sessionName}</p>
              <p className="text-sm text-purple-200">Code: {report.sessionOverview.sessionCode}</p>
            </div>
            <button onClick={onClose} className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg">
              ✕ Close
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-100 p-4 rounded-xl">
              <div className="text-2xl font-bold text-blue-800">{report.sessionOverview.totalParticipants}</div>
              <div className="text-sm text-blue-600">Participants</div>
            </div>
            <div className="bg-purple-100 p-4 rounded-xl">
              <div className="text-2xl font-bold text-purple-800">{report.sessionOverview.totalQuestions}</div>
              <div className="text-sm text-purple-600">Questions</div>
            </div>
            <div className="bg-green-100 p-4 rounded-xl">
              <div className="text-2xl font-bold text-green-800">{report.sessionOverview.accuracyRate.toFixed(1)}%</div>
              <div className="text-sm text-green-600">Accuracy</div>
            </div>
            <div className="bg-orange-100 p-4 rounded-xl">
              <div className="text-2xl font-bold text-orange-800">{report.sessionOverview.durationMinutes} min</div>
              <div className="text-sm text-orange-600">Duration</div>
            </div>
          </div>

          {/* Podium */}
          {report.finalRankings?.podium && (
            <div>
              <h3 className="text-xl font-bold mb-4">🏆 Top 3</h3>
              <div className="space-y-2">
                {report.finalRankings.podium.map((entry: any) => (
                  <div key={entry.position} className="flex justify-between items-center bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{entry.badge}</span>
                      <span className="font-bold">{entry.nickname}</span>
                    </div>
                    <span className="text-xl font-bold text-purple-600">{entry.totalScore}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Export Button */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                const dataStr = JSON.stringify(report, null, 2);
                const dataBlob = new Blob([dataStr], { type: "application/json" });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `report-${report.sessionOverview.sessionCode}.json`;
                link.click();
              }}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              📥 Export Report (JSON)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}