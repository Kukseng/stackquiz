
"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";


function useParticipantWebSocket(
  quizCode: string,
  participantId: string,
  nickname: string,
  avatarId: string,
  onGameState: (msg: any) => void,
  onQuestion: (msg: any) => void,
  onCompletion: (msg: any) => void
) {
  const stompRef = useRef<Client | null>(null);
  const questionStartTimeRef = useRef<number>(0);

  const onGameStateRef = useRef(onGameState);
  const onQuestionRef = useRef(onQuestion);
  const onCompletionRef = useRef(onCompletion);


  useEffect(() => {
    onGameStateRef.current = onGameState;
    onQuestionRef.current = onQuestion;
    onCompletionRef.current = onCompletion;
  }, [onGameState, onQuestion, onCompletion]);

  useEffect(() => {
    if (!quizCode || !nickname || !participantId) return;
// https://stackquiz-api.stackquiz.me/api/v1
    const sock = new SockJS("https://stackquiz-api.stackquiz.me/api/v1/ws");
    const stomp = new Client({
      webSocketFactory: () => sock,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log("[STOMP]", str),
    
      connectHeaders: {
        participantId: participantId,  // Backend uses this as Principal
      },
    });

    stomp.onConnect = () => {
      console.log("WebSocket connected for participant:", nickname);
      
      // Subscribe to general game state (for session start/end/lobby)
      stomp.subscribe(`/topic/session/${quizCode}/game-state`, (msg) => {
        try {
          const data = JSON.parse(msg.body);
          console.log("📢 Game state received:", data);
          onGameStateRef.current(data); // Use ref to avoid reconnection
        } catch (e) {
          console.error("Failed to parse game state:", msg.body, e);
        }
      });
      
    
      stomp.subscribe(`/user/queue/question`, (msg) => {
        try {
          const message = JSON.parse(msg.body);
          console.log(" Participant-specific question received:", message);
          
          if (message.action === "NEXT_QUESTION" || message.question) {
            questionStartTimeRef.current = Date.now(); // Track question start time
            onQuestionRef.current(message); // Use ref to avoid reconnection
          } else if (message.action === "PARTICIPANT_COMPLETED") {
            onCompletionRef.current(message); // Use ref to avoid reconnection
          }
        } catch (e) {
          console.error("Failed to parse participant message:", msg.body, e);
        }
      });

      // FIXED: Subscribe to broadcast questions (for SYNC mode)
      stomp.subscribe(`/topic/session/${quizCode}/question`, (msg) => {
        try {
          const message = JSON.parse(msg.body);
          console.log(" Broadcast question received:", message);
          questionStartTimeRef.current = Date.now(); // Track question start time
          onQuestionRef.current(message); // Use ref to avoid reconnection
        } catch (e) {
          console.error("Failed to parse broadcast question:", msg.body, e);
        }
      });

     
      console.log("WebSocket connected - subscriptions ready");
    };

    stomp.onStompError = (frame) => {
      console.error("❌ STOMP error:", frame.headers?.message || frame.body);
    };

    stomp.onDisconnect = () => {
      console.warn("⚠️ WebSocket disconnected");
    };

    stomp.activate();
    stompRef.current = stomp;
    
    return () => {
      console.log("🔌 Disconnecting WebSocket");
      stompRef.current?.deactivate();
    };
  }, [quizCode, participantId, nickname, avatarId]); // Removed callback dependencies

  //  Calculate actual response time
  const sendAnswer = useCallback(
    (optionId: string, questionId: string) => {
      if (!stompRef.current?.connected) {
        console.error("⚠️ WebSocket not connected");
        return;
      }
      
      // Calculate response time in seconds
      const responseTime = Math.floor((Date.now() - questionStartTimeRef.current) / 1000);
      
      const answerPayload = {
        participantId,
        questionId,
        selectedOptionId: optionId,
        responseTime, 
      };
      
      console.log("📤 Sending answer:", answerPayload);
      stompRef.current.publish({
        destination: `/app/session/${quizCode}/answer`,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(answerPayload),
      });
    },
    [quizCode, participantId]
  );

  return sendAnswer;
}

// --- Main Component ---
export default function ParticipantJoinUI() {
  const { sessionCode } = useParams<{ sessionCode: string }>();

  // Join form state
  const [nickname, setNickname] = useState("");
  const [avatarId, setAvatarId] = useState(""); 
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joined, setJoined] = useState(false);

  // Game state
  const [participantId, setParticipantId] = useState("");
  const [gameState, setGameState] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [status, setStatus] = useState<"LOBBY" | "PLAY" | "COMPLETED" | "END">("LOBBY");
  const [answerSelected, setAnswerSelected] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [, setFeedback] = useState<any>(null);

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
      // https://stackquiz-api.stackquiz.me/api/v1
      const res = await axios.post("https://stackquiz-api.stackquiz.me/api/v1/participants/join", {
        quizCode: sessionCode,
        nickname: nickname.trim(),
        avatarId: avatarId.trim(), 
      });

      console.log("Successfully joined:", res.data);
      setParticipantId(res.data.id);
      setJoined(true);
    } catch (err: any) {
      console.error("❌ Join failed:", err);
      setError(err.response?.data?.message || "Failed to join session. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  //  WebSocket connection
  const sendAnswer = useParticipantWebSocket(
    joined ? (sessionCode as string) : "",
    joined ? participantId : "",
    joined ? nickname : "",
    joined ? avatarId : "",
    (msg) => {
      console.log(" Game state update:", msg);
      setGameState(msg);
    },
    (qmsg) => {
      console.log(" New question received:", qmsg);
      
      // Extract question data (handle both formats)
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
      setStatus("PLAY");
    },
    (cmsg) => {
      console.log("🎉 Completion message received:", cmsg);
      setStatus("COMPLETED");
    }
  );

  // Handle game state changes
  useEffect(() => {
    if (!gameState) return;
    
    console.log("Processing game state:", gameState.action, gameState.status);
    
    if (gameState.action === "SESSION_STARTED" || gameState.status === "IN_PROGRESS") {
      if (!currentQuestion) {
        setStatus("PLAY"); // Will show "waiting for question"
      }
    } else if (gameState.action === "SESSION_ENDED" || gameState.status === "ENDED") {
      setStatus("END");
    } else if (gameState.action === "SESSION_LOBBY" || gameState.status === "WAITING") {
      setStatus("LOBBY");
    }
  }, [gameState, currentQuestion]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && status === "PLAY" && currentQuestion && !answerSelected && !showFeedback) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, status, currentQuestion, answerSelected, showFeedback]);

  // Handle answer selection
  function handleAnswer(optionId: string) {
    if (!currentQuestion || answerSelected || showFeedback) {
      console.warn("Cannot answer: already answered or showing feedback");
      return;
    }
    
    console.log("Answering question:", currentQuestion.id, "with option:", optionId);
    setAnswerSelected(optionId);
    sendAnswer(optionId, currentQuestion.id);
    
    // Show temporary feedback (answer submitted)
    setShowFeedback(true);
    setFeedback({ submitted: true });
  }

  // --- UI Rendering ---

  // Join form
  if (!joined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-800 to-indigo-900 p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-indigo-800 mb-2">
              Join Quiz
            </h1>
            <p className="text-gray-600">Session Code: <span className="font-mono font-bold text-purple-600">{sessionCode}</span></p>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                placeholder="Enter avatar ID "
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Example: 1-10</p>
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              {isSubmitting ? "Joining..." : "Join Quiz"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Quiz ended
  if (status === "END") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
        <div className="text-center">
          <div className="text-8xl mb-6">🏆</div>
          <h1 className="text-5xl font-bold mb-4">Quiz Ended</h1>
          <p className="text-2xl mb-8">Thanks for playing, {nickname}!</p>
          <div className="bg-white bg-opacity-20 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-lg">Check the leaderboard to see your final ranking!</p>
          </div>
        </div>
      </div>
    );
  }

  // Participant completed all questions
  if (status === "COMPLETED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white">
        <div className="text-center max-w-2xl px-6">
          <div className="text-8xl mb-6 animate-bounce">***</div>
          <h1 className="text-5xl font-bold mb-4">Congratulations!</h1>
          <p className="text-2xl mb-4">You&apos;ve completed all questions!</p>
          <div className="bg-white bg-opacity-20 rounded-lg p-6 mt-8">
            <p className="text-xl">Waiting for other participants to finish...</p>
            <div className="mt-6">
              <div className="animate-pulse text-6xl">....</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Waiting in lobby
  if (status === "LOBBY") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-800 to-indigo-900 text-white">
        <div className="text-center max-w-2xl px-6">
          <div className="text-6xl mb-6">👋</div>
          <h1 className="text-4xl font-bold mb-4">Welcome, {nickname}!</h1>
          <p className="text-2xl mb-8">Waiting for the host to start the quiz...</p>
          <div className="bg-white bg-opacity-20 rounded-lg p-6">
            <p className="text-lg mb-4">Get ready to answer questions!</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing - waiting for question
  if (status === "PLAY" && !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-800 to-indigo-900 text-white">
        <div className="text-center max-w-2xl px-6">
          <div className="text-6xl mb-6 animate-pulse">🕐</div>
          <h2 className="text-3xl font-bold mb-4">Get Ready!</h2>
          <p className="text-xl">Your next question is loading...</p>
          <div className="mt-8">
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing - showing question
  if (status === "PLAY" && currentQuestion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-purple-800 to-indigo-900 py-8 px-4">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8">
          {/* Progress and Timer */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                Question {questionNumber} of {totalQuestions}
              </span>
              <div className={`text-4xl font-bold ${timeLeft <= 5 ? 'text-red-600 animate-pulse' : 'text-purple-600'}`}>
                {timeLeft}s
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${timeLeft <= 5 ? 'bg-red-500' : 'bg-purple-600'}`}
                style={{ width: `${(timeLeft / (currentQuestion.timeLimit || 30)) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 leading-tight">
            {currentQuestion.text || currentQuestion.questionText}
          </h2>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options?.map((option: any, idx: number) => {
              const colors = [
                "bg-red-500 hover:bg-red-600 shadow-red-300",
                "bg-blue-500 hover:bg-blue-600 shadow-blue-300", 
                "bg-yellow-500 hover:bg-yellow-600 shadow-yellow-300",
                "bg-green-500 hover:bg-green-600 shadow-green-300"
              ];
              
              const isSelected = answerSelected === option.id;
              const isDisabled = !!answerSelected;
              
              return (
                <button
                  key={option.id || idx}
                  disabled={isDisabled}
                  onClick={() => handleAnswer(option.id)}
                  className={`text-white text-xl py-8 px-6 rounded-xl font-bold shadow-lg transform transition-all duration-200 ${
                    isSelected
                      ? "bg-gray-600 scale-95 shadow-xl"
                      : isDisabled
                      ? "bg-gray-400 opacity-50 cursor-not-allowed"
                      : `${colors[idx % 4]} hover:scale-105 active:scale-95`
                  }`}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-2xl font-black">{String.fromCharCode(65 + idx)}</span>
                    <span>{option.optionText || option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {answerSelected && (
            <div className="mt-8 p-6 rounded-xl text-center bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <div className="text-blue-800 font-bold text-lg">
                ✓ Answer Submitted!
              </div>
              <p className="text-blue-600 mt-2">Waiting for next question...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-900 text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
        <p className="text-xl">Loading...</p>
      </div>
    </div>
  );
}